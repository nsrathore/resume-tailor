// Analysis response from /api/analyze
export interface AnalysisResult {
  score: number;                   // 0–100 ATS match score
  matched_keywords: string[];      // Keywords found in both resume and JD
  missing_keywords: string[];      // Important JD keywords absent from resume
  summary: string;                 // One-sentence human-readable summary
}

// A single resume bullet with its AI-tailored version
export interface TailoredBullet {
  original: string;
  tailored: string;
  accepted: boolean;
}

// Request body for /api/analyze
export interface AnalyzeRequest {
  resume: string;
  jobDescription: string;
}

// Request body for /api/tailor
export interface TailorRequest {
  resume: string;
  jobDescription: string;
  missingKeywords: string[];
}
