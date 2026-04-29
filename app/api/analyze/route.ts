import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { ANALYZE_SYSTEM_PROMPT } from "@/lib/prompts";
import { ratelimit } from "@/lib/ratelimit";

const client = new Anthropic();

// Zod schema to validate Claude's JSON response
const AnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  matched_keywords: z.array(z.string()),
  missing_keywords: z.array(z.string()),
  summary: z.string(),
});

// Request body schema
const RequestSchema = z.object({
  resume: z.string().min(50, "Resume is too short"),
  jobDescription: z.string().min(50, "Job description is too short"),
});

export async function POST(req: NextRequest) {
  try {
    // Rate limiting guardrails
    const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
    const { success, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "You've reached the daily limit of 50 analyses. Come back tomorrow!" },
        { status: 429 }
      );
    }
    // 1. Parse and validate request body
    const body = await req.json();
    const { resume, jobDescription } = RequestSchema.parse(body);

    if (process.env.DEMO_ENABLED === "false") {
      return NextResponse.json(
        { error: "Demo is temporarily disabled." },
        { status: 503 }
      );
    }

    if (resume.length > 8000 || jobDescription.length > 8000) {
      return NextResponse.json(
        { error: "Input too long. Please trim your resume or job description." },
        { status: 400 }
      );
    }

    // 2. Call Claude API
    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: ANALYZE_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `RESUME:\n${resume}\n\nJOB DESCRIPTION:\n${jobDescription}`,
        },
      ],
    });

    // 3. Extract text from response
    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    // 4. Strip any accidental markdown fences and parse JSON
    const rawText = content.text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(rawText);

    // 5. Validate against schema
    const analysis = AnalysisSchema.parse(parsed);

    return NextResponse.json(analysis);
  } catch (err) {
    console.error("[/api/analyze] Error:", err);

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request: " + err.errors[0].message },
        { status: 400 }
      );
    }

    if (err instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
