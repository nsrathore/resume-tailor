import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resume Tailor — AI-Powered Resume Optimizer",
  description:
    "Paste your resume and a job description. Get an ATS match score and AI-rewritten bullets that mirror the job's exact language.",
  openGraph: {
    title: "Resume Tailor",
    description: "AI-powered resume optimization for ATS systems",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
