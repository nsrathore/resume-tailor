import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { TAILOR_SYSTEM_PROMPT } from "@/lib/prompts";

const client = new Anthropic();

const RequestSchema = z.object({
  resume: z.string().min(50),
  jobDescription: z.string().min(50),
  missingKeywords: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resume, jobDescription, missingKeywords } = RequestSchema.parse(body);

    const keywordList = missingKeywords.join(", ");

    if (process.env.DEMO_ENABLED === "false") {
      return new Response(
        JSON.stringify({ error: "Demo is temporarily disabled." }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    if (resume.length > 8000 || jobDescription.length > 8000) {
      return new Response(
      JSON.stringify({ error: "Input too long. Please trim your resume or job description." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Stream the response directly to the client
    const stream = await client.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: TAILOR_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Rewrite the bullet points from this resume to better match the job description.
Focus on naturally incorporating these missing keywords where relevant: ${keywordList}

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Rewrite each bullet point. Return ONLY the rewritten bullets, one per line starting with "•".`,
        },
      ],
    });

    // Return a streaming response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("[/api/tailor] Error:", err);

    if (err instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: "Invalid request" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Tailoring failed. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
