"use client";

interface InputPanelProps {
  resume: string;
  jobDescription: string;
  onResumeChange: (val: string) => void;
  onJobDescriptionChange: (val: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export function InputPanel({
  resume,
  jobDescription,
  onResumeChange,
  onJobDescriptionChange,
  onAnalyze,
  isAnalyzing,
}: InputPanelProps) {
  const canAnalyze = resume.trim().length > 50 && jobDescription.trim().length > 50;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Resume Input */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <span className="w-5 h-5 bg-gray-900 text-white rounded text-xs flex items-center justify-center font-bold">1</span>
            Your Resume
          </label>
          <textarea
            value={resume}
            onChange={(e) => onResumeChange(e.target.value)}
            placeholder="Paste your full resume here — plain text works best. Include your work experience bullets, skills section, and any other relevant content."
            className="w-full h-64 lg:h-80 p-4 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow resize-y font-mono leading-relaxed"
          />
          <p className="text-xs text-gray-400 mt-1.5">
            {resume.length > 0 ? `${resume.length} characters` : "Plain text recommended"}
          </p>
        </div>

        {/* Job Description Input */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <span className="w-5 h-5 bg-gray-900 text-white rounded text-xs flex items-center justify-center font-bold">2</span>
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => onJobDescriptionChange(e.target.value)}
            placeholder="Paste the full job description here. Include the responsibilities, requirements, and preferred qualifications sections for best results."
            className="w-full h-64 lg:h-80 p-4 border border-gray-200 rounded-xl text-sm text-gray-800 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow resize-y font-mono leading-relaxed"
          />
          <p className="text-xs text-gray-400 mt-1.5">
            {jobDescription.length > 0 ? `${jobDescription.length} characters` : "Include the full posting for accuracy"}
          </p>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="flex justify-center">
        <button
          onClick={onAnalyze}
          disabled={!canAnalyze || isAnalyzing}
          className="px-8 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-2 shadow-sm hover:shadow-md active:scale-95"
        >
          {isAnalyzing ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analyze Match
            </>
          )}
        </button>
      </div>
    </div>
  );
}
