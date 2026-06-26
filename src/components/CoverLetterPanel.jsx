import { useState } from "react";
import api from "../api/client";

export default function CoverLetterPanel() {
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState("Professional");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateCoverLetter = async () => {
    const resumeId = localStorage.getItem("resume_id");
    if (!resumeId) {
      alert("Please upload a resume first");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please enter the job description");
      return;
    }

    try {
      setLoading(true);
      setCoverLetter("");
      const response = await api.post(
        `/generate_cover_letter?resume_id=${resumeId}&job_description=${encodeURIComponent(
          jobDescription
        )}&tone=${encodeURIComponent(tone)}`
      );

      setCoverLetter(response.data.data.cover_text);
    } catch (error) {
      console.error(error);
      alert("Cover letter generation failed");
    } finally {
      setLoading(false);
    }
  };

  const copyCoverLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: "25px" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: "700", fontFamily: "var(--font-display)", marginBottom: "8px" }}>
          ✉️ Cover Letter Generator
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "24px", fontSize: "0.95rem" }}>
          Generate a custom tailored cover letter aligning your resume achievements with the targeted job description responsibilities.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "24px" }}>
          <div>
            <label htmlFor="tone">Tone of Letter</label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              style={{ maxWidth: "300px" }}
            >
              <option>Professional</option>
              <option>Friendly</option>
              <option>Confident</option>
            </select>
          </div>

          <div>
            <label htmlFor="jobDesc">Target Job Description</label>
            <textarea
              id="jobDesc"
              rows="8"
              placeholder="Paste Job Description..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              style={{ resize: "vertical" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={generateCoverLetter}
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "8px" }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Cover Letter...
              </>
            ) : (
              "Generate Cover Letter"
            )}
          </button>
        </div>
      </div>

      {coverLetter && (
        <div className="card animate-fade-in">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              gap: "10px",
              flexWrap: "wrap"
            }}
          >
            <h2 style={{ fontSize: "1.3rem", fontWeight: "700", fontFamily: "var(--font-display)", margin: 0 }}>
              📄 Generated Cover Letter
            </h2>
            <button
              onClick={copyCoverLetter}
              className={copied ? "btn-success" : "btn-secondary"}
              style={{
                padding: "8px 16px",
                fontSize: "0.85rem",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "4px" }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "4px" }}>
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>

          <div
            className="output-markdown"
          >
            {coverLetter}
          </div>
        </div>
      )}
    </div>
  );
}
