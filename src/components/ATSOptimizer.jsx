import { useState, useEffect } from "react";
import api from "../api/client";
import { useToast } from "../context/ToastContext";

export default function ATSOptimizer() {
  const { showSuccess, showError } = useToast();
  
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await api.get("/my_resumes");
      if (response.data && response.data.resumes) {
        setResumes(response.data.resumes);
        // Pre-select active resume
        const activeId = localStorage.getItem("resume_id");
        if (activeId && response.data.resumes.some(r => String(r.resume_id) === String(activeId))) {
          setSelectedResumeId(activeId);
        } else if (response.data.resumes.length > 0) {
          setSelectedResumeId(response.data.resumes[0].resume_id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedResumeId) {
      showError("Please upload or select a resume first");
      return;
    }

    if (!jobDescription.trim()) {
      showError("Please enter a target job description");
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      setAtsScore(null);
      setKeywords([]);
      setBullets([]);
      setSummary("");

      const response = await api.post(
        `/optimize_resume?resume_id=${selectedResumeId}&job_description=${encodeURIComponent(
          jobDescription
        )}`
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
      
      showSuccess("ATS comparison analysis complete!");
    } catch (error) {
      console.error(error);
      showError("ATS optimization analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "25px", marginTop: "15px" }}>
      {/* Target Setup Configuration Card */}
      <div className="card">
        <h2 style={{ fontSize: "1.3rem", fontWeight: "700", fontFamily: "var(--font-display)", marginBottom: "8px" }}>
          🎯 ATS Keyword Optimizer
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: "0.95rem" }}>
          Compare your select resume draft against the target job description to pinpoint missing skills and increase candidate rating scores.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label htmlFor="resume-select">Select Resume to Analyze</label>
            {resumes.length === 0 ? (
              <div className="alert alert-warning" style={{ margin: 0 }}>
                <span>⚠️ No uploaded resumes found. Go to "Resume" tab to upload PDF first.</span>
              </div>
            ) : (
              <select
                id="resume-select"
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "12px" }}
              >
                {resumes.map((r) => (
                  <option key={r.resume_id} value={r.resume_id}>
                    {r.filename} ({formatDate(r.uploaded_at)})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label htmlFor="jobDesc">Job Description</label>
            <textarea
              id="jobDesc"
              rows="8"
              placeholder="Paste targeted job posting requirements here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              style={{ resize: "vertical" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
          <button
            onClick={handleAnalyze}
            className="btn-primary"
            disabled={loading || resumes.length === 0}
            style={{ minHeight: "44px" }}
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "8px" }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Comparing Match...
              </>
            ) : result ? (
              "Re-optimize Resume"
            ) : (
              "Analyze ATS Match"
            )}
          </button>
        </div>
      </div>

      {/* Results details grids */}
      {atsScore !== null && (
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
            gap: "25px" 
          }}
        >
          {/* Radial Gauge display card */}
          <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", justifyContent: "center" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: "700", fontFamily: "var(--font-display)", alignSelf: "flex-start", marginBottom: "16px", margin: 0 }}>
              🎯 ATS Match Score
            </h3>

            <div className="radial-score-container" style={{ margin: "20px 0" }}>
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
                ? "Highly Optimized Alignment"
                : atsScore >= 60
                ? "Good Fit (A few keyword gaps)"
                : "Weak Match (Needs improvement)"}
            </p>
          </div>

          {/* Missing Keywords list card */}
          <div className="card">
            <h3 style={{ fontSize: "1.15rem", fontWeight: "700", fontFamily: "var(--font-display)", marginBottom: "8px", margin: 0 }}>
              🔑 Missing Keywords Gaps
            </h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: "0.88rem" }}>
              Integrate these tags and languages into your resume bullet points to bypass ATS filters.
            </p>

            {keywords.length === 0 ? (
              <p style={{ fontSize: "0.9rem", color: "var(--success)", fontWeight: "600" }}>✓ No missing keywords found! Excellent job.</p>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {keywords.map((keyword, index) => (
                  <span key={index} className="badge badge-danger" style={{ padding: "8px 14px", fontSize: "0.82rem" }}>
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Suggested accomplishments updates */}
      {bullets.length > 0 && (
        <div className="card">
          <h2 style={{ fontSize: "1.2rem", fontWeight: "700", fontFamily: "var(--font-display)", marginBottom: "8px" }}>
            📈 Suggested Bullet Improvements
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: "0.9rem" }}>
            Incorporate these metric-driven statements into your resume draft to describe experiences:
          </p>

          <ul style={{ listStyleType: "none", display: "flex", flexDirection: "column", gap: "14px", padding: 0 }}>
            {bullets.map((bullet, index) => (
              <li 
                key={index}
                style={{ 
                  display: "flex", 
                  gap: "10px", 
                  alignItems: "flex-start",
                  fontSize: "0.92rem",
                  lineHeight: "1.6"
                }}
              >
                <span style={{ color: "var(--success)", fontSize: "1.15rem", lineHeight: 1, marginTop: "2px" }}>✓</span>
                <span style={{ color: "var(--text-primary)" }}>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tailored Professional Summary */}
      {summary && (
        <div className="card">
          <h2 style={{ fontSize: "1.2rem", fontWeight: "700", fontFamily: "var(--font-display)", marginBottom: "8px" }}>
            📝 Tailored Professional Summary
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "16px", fontSize: "0.9rem" }}>
            Copy and paste this tailored bio directly at the top of your resume:
          </p>
          <div
            className="output-markdown"
            style={{ 
              background: "var(--panel-bg)", 
              border: "1px solid var(--border-color)", 
              padding: "16px 20px", 
              borderRadius: "12px",
              lineHeight: "1.6",
              color: "var(--text-primary)",
              fontStyle: "italic"
            }}
          >
            {summary}
          </div>
        </div>
      )}

      {/* Raw full report fallback */}
      {result && (
        <div className="card">
          <h2 style={{ fontSize: "1.2rem", fontWeight: "700", fontFamily: "var(--font-display)", marginBottom: "16px" }}>
            📄 Full AI Report Output
          </h2>
          <pre 
            style={{ 
              background: "var(--panel-bg)", 
              color: "var(--text-primary)", 
              padding: "16px", 
              borderRadius: "12px", 
              border: "1px solid var(--border-color)", 
              fontFamily: "monospace",
              fontSize: "0.85rem",
              whiteSpace: "pre-wrap",
              overflowX: "auto"
            }}
          >
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}

// Inline date utility
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};
