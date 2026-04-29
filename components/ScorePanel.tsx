"use client";

import type { AnalysisResult } from "@/lib/types";
import { scoreToColor, scoreToBackground, scoreToLabel } from "@/lib/utils";

interface ScorePanelProps {
  analysis: AnalysisResult;
}

export function ScorePanel({ analysis }: ScorePanelProps) {
  const { score, matched_keywords, missing_keywords, summary } = analysis;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
        ATS Analysis
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score */}
        <div className={`rounded-xl border p-5 text-center ${scoreToBackground(score)}`}>
          <div className={`text-5xl font-bold mb-1 ${scoreToColor(score)}`}>
            {score}
          </div>
          <div className="text-xs text-gray-500 mb-1">out of 100</div>
          <div className={`text-sm font-medium ${scoreToColor(score)}`}>
            {scoreToLabel(score)}
          </div>
          <div className="mt-3 text-xs text-gray-600 leading-relaxed">
            {summary}
          </div>
        </div>

        {/* Matched Keywords */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-gray-700">
              Matched ({matched_keywords.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matched_keywords.length === 0 ? (
              <p className="text-xs text-gray-400">No keyword matches found</p>
            ) : (
              matched_keywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-medium"
                >
                  {kw}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Missing Keywords */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-sm font-medium text-gray-700">
              Missing ({missing_keywords.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {missing_keywords.length === 0 ? (
              <p className="text-xs text-gray-400">No missing keywords — great match!</p>
            ) : (
              missing_keywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-medium"
                >
                  {kw}
                </span>
              ))
            )}
          </div>
          {missing_keywords.length > 0 && (
            <p className="text-xs text-gray-400 mt-3">
              These keywords will be incorporated when you tailor your resume below.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
