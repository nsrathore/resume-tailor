"use client";

import { useState } from "react";
import { copyToClipboard } from "@/lib/utils";

interface TailorPanelProps {
  resume: string;
  jobDescription: string;
  missingKeywords: string[];
}

export function TailorPanel({ resume, jobDescription, missingKeywords }: TailorPanelProps) {
  const [tailoredText, setTailoredText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleTailor() {
    setIsStreaming(true);
    setTailoredText("");
    setIsDone(false);
    setError(null);

    try {
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription, missingKeywords }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Tailoring request failed");
      }

      // Read the stream
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setTailoredText((prev) => prev + chunk);
      }

      setIsDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsStreaming(false);
    }
  }

  async function handleCopy() {
    const success = await copyToClipboard(tailoredText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            AI Bullet Rewriter
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Rewrites your bullets to naturally incorporate the missing keywords above.
          </p>
        </div>
        {!isStreaming && !tailoredText && (
          <button
            onClick={handleTailor}
            className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-all active:scale-95 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Tailor Resume
          </button>
        )}
      </div>

      {/* Not yet triggered */}
      {!isStreaming && !tailoredText && !error && (
        <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center">
          <div className="text-2xl mb-2">✦</div>
          <p className="text-sm text-gray-500">
            Click "Tailor Resume" to generate AI-rewritten bullets
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Takes about 10–15 seconds to stream
          </p>
        </div>
      )}

      {/* Streaming / result area */}
      {(isStreaming || tailoredText) && (
        <div className="space-y-3">
          <div className="relative bg-gray-50 rounded-xl border border-gray-100 p-5 min-h-[200px]">
            <pre className={`text-sm text-gray-800 whitespace-pre-wrap leading-relaxed font-sans ${isStreaming && !tailoredText ? "cursor-blink" : ""}`}>
              {tailoredText || ""}
              {isStreaming && <span className="cursor-blink" />}
            </pre>
          </div>

          {/* Actions */}
          {isDone && (
            <div className="flex gap-3 flex-wrap animate-slide-up">
              <button
                onClick={handleCopy}
                className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2 active:scale-95"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy to clipboard
                  </>
                )}
              </button>
              <button
                onClick={handleTailor}
                className="px-4 py-2 text-sm font-medium bg-white text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Regenerate
              </button>
            </div>
          )}

          {isStreaming && (
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Streaming from Claude...
            </p>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
          <button
            onClick={handleTailor}
            className="ml-auto text-red-600 underline text-xs"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
