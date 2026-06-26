import { useEffect, useState } from "react";
import api from "../api/client";

export default function ResumeResults({ resumeId }) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!resumeId) {
      setResult(null);
      return;
    }

    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/resume_result/${resumeId}`);
        if (response.data?.data) {
          setResult(response.data.data);
        }
      } catch (err) {
        console.error("Result fetch failed", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [resumeId]);

  if (!resumeId) return null;

  if (!result) {
    return (
      <div className="card" style={{ marginTop: "25px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }} className="animate-pulse">
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-1.414 1.414M6.05 17.95l-1.414 1.414M18.364 18.364l-1.414-1.414M6.05 6.05 4.636 7.464"></path>
          </svg>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "700", fontFamily: "var(--font-display)", margin: 0 }}>
            AI Suggestions
          </h2>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Generating insights based on your resume content. This should take a few seconds...
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginTop: "25px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}>
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-1.414 1.414M6.05 17.95l-1.414 1.414M18.364 18.364l-1.414-1.414M6.05 6.05 4.636 7.464"></path>
        </svg>
        <h2 style={{ fontSize: "1.3rem", fontWeight: "700", fontFamily: "var(--font-display)", margin: 0 }}>
          AI Suggestions
        </h2>
      </div>
      
      <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: "0.95rem" }}>
        Personalized insights, strength analysis, and key areas of growth found in your resume.
      </p>

      <div
        className="output-markdown"
        style={{
          background: "var(--border-color)",
          color: "var(--text-primary)",
          border: "1px solid var(--border-color)",
        }}
      >
        {result.suggestions}
      </div>
    </div>
  );
}