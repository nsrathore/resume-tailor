"use client";

import { useState } from "react";
import { InputPanel } from "@/components/InputPanel";
import { ScorePanel } from "@/components/ScorePanel";
import { TailorPanel } from "@/components/TailorPanel";
import type { AnalysisResult } from "@/lib/types";

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!resume.trim() || !jobDescription.trim()) return;

    setIsAnalyzing(true);
    setAnalyzeError(null);
    setAnalysis(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Analysis failed");
      }

      const data: AnalysisResult = await res.json();
      setAnalysis(data);
    } catch (err) {
      setAnalyzeError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">RT</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Resume Tailor</h1>
              <p className="text-xs text-gray-500">AI-powered ATS optimization</p>
            </div>
          </div>
          <a
            href="https://github.com/YOUR_USERNAME/resume-tailor"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Get past the ATS, land the interview
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Paste your resume and a job description. We'll score your match, identify missing keywords,
            and rewrite your bullets to speak the hiring manager's language.
          </p>
        </div>

        {/* Input Section */}
        <InputPanel
          resume={resume}
          jobDescription={jobDescription}
          onResumeChange={setResume}
          onJobDescriptionChange={setJobDescription}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
        />

        {/* Error */}
        {analyzeError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {analyzeError}
          </div>
        )}

        {/* Results */}
        {analysis && (
          <div className="mt-8 space-y-6 animate-fade-in">
            <ScorePanel analysis={analysis} />
            <TailorPanel
              resume={resume}
              jobDescription={jobDescription}
              missingKeywords={analysis.missing_keywords}
            />
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 mt-16 py-6 text-center text-xs text-gray-400">
        Built with Next.js + Claude API · Open source on GitHub
      </footer>
    </div>
  );
}
