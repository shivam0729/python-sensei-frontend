import { useState } from "react";
import api from "../api/client";

export default function ATSOptimizer() {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    const resumeId = localStorage.getItem("resume_id");
    if (!resumeId) {
      alert("Please upload a resume first");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please enter a job description");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(
        "/optimize_resume?resume_id=" +
          resumeId +
          "&job_description=" +
          encodeURIComponent(jobDescription)
      );

      const aiResult = response.data.data.result;
      setResult(aiResult);

      const scoreMatch = aiResult.match(/ATS_SCORE:\s*(\d+)/);
      if (scoreMatch) {
        setAtsScore(parseInt(scoreMatch[1]));
      }

      const keywordMatch = aiResult.match(/MISSING_KEYWORDS:(.*?)IMPROVED_BULLETS:/s);
      if (keywordMatch) {
        setKeywords(
          keywordMatch[1]
            .split(",")
            .map((keyword) => keyword.trim())
            .filter(Boolean)
        );
      }

      const bulletMatch = aiResult.match(/IMPROVED_BULLETS:(.*?)TAILORED_SUMMARY:/s);
      if (bulletMatch) {
        setBullets(
          bulletMatch[1]
            .split("*")
            .map((bullet) => bullet.trim())
            .filter(Boolean)
        );
      }

      const summaryMatch = aiResult.match(/TAILORED_SUMMARY:(.*)/s);
      if (summaryMatch) {
        setSummary(summaryMatch[1].trim());
      }
    } catch (error) {
      console.error(error);
      alert("ATS analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: "25px" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: "700", fontFamily: "var(--font-display)", marginBottom: "8px" }}>
          🎯 Analyze ATS Match
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: "0.95rem" }}>
          Paste the target job description below. Our AI model will compare it to your uploaded resume and calculate matches, gaps, and improvements.
        </p>

        <textarea
          rows="10"
          placeholder="Paste Job Description Here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          style={{ marginBottom: "20px", resize: "vertical" }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleAnalyze}
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "8px" }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing ATS Match...
              </>
            ) : (
              "Analyze ATS Match"
            )}
          </button>
        </div>
      </div>

      {atsScore !== null && (
        <div className="card" style={{ marginBottom: "25px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "700", fontFamily: "var(--font-display)", alignSelf: "flex-start", marginBottom: "20px" }}>
            🎯 ATS Score
          </h2>

          <div className="radial-score-container" style={{ margin: "10px 0 20px 0" }}>
            <svg className="radial-score-svg" viewBox="0 0 120 120">
              <circle className="radial-score-bg" cx="60" cy="60" r="50" />
              <circle
                className="radial-score-fill"
                cx="60"
                cy="60"
                r="50"
                stroke={
                  atsScore >= 80
                    ? "var(--success)"
                    : atsScore >= 60
                    ? "var(--warning)"
                    : "var(--danger)"
                }
                style={{
                  strokeDasharray: 314.159,
                  strokeDashoffset: 314.159 - (atsScore / 100) * 314.159,
                }}
              />
            </svg>
            <div className="radial-score-text">{atsScore}%</div>
          </div>

          <p
            style={{
              fontWeight: "700",
              fontSize: "1.1rem",
              color:
                atsScore >= 80
                  ? "var(--success)"
                  : atsScore >= 60
                  ? "var(--warning)"
                  : "var(--danger)",
              margin: 0
            }}
          >
            {atsScore >= 80
              ? "Excellent Keyword Match"
              : atsScore >= 60
              ? "Good Match (Can Optimize Further)"
              : "Needs Keyword Alignment"}
          </p>
        </div>
      )}

      {keywords.length > 0 && (
        <div className="card" style={{ marginBottom: "25px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "700", fontFamily: "var(--font-display)", marginBottom: "8px" }}>
            🔑 Missing Keywords
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: "0.95rem" }}>
            Integrate these key concepts and tools from the job description to bypass automated ATS filters.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {keywords.map((keyword, index) => (
              <span key={index} className="badge badge-primary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {bullets.length > 0 && (
        <div className="card" style={{ marginBottom: "25px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "700", fontFamily: "var(--font-display)", marginBottom: "8px" }}>
            📈 Improved Resume Bullets
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px", fontSize: "0.95rem" }}>
            Use these tailored accomplishment statements on your resume to showcase aligned skills.
          </p>

          <ul style={{ listStyleType: "none", display: "flex", flexDirection: "column", gap: "16px" }}>
            {bullets.map((bullet, index) => (
              <li 
                key={index}
                style={{ 
                  display: "flex", 
                  gap: "12px", 
                  alignItems: "flex-start",
                  fontSize: "0.95rem",
                  lineHeight: "1.6"
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "3px" }}>
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span style={{ color: "var(--text-primary)" }}>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {summary && (
        <div className="card" style={{ marginBottom: "25px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "700", fontFamily: "var(--font-display)", marginBottom: "16px" }}>
            📝 Tailored Summary
          </h2>
          <div
            className="output-markdown"
          >
            {summary}
          </div>
        </div>
      )}

      {result && (
        <div className="card">
          <h2 style={{ fontSize: "1.3rem", fontWeight: "700", fontFamily: "var(--font-display)", marginBottom: "16px" }}>
            📄 Raw ATS Report
          </h2>
          <div className="code-block-wrapper">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}
