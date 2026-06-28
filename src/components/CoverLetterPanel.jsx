import { useState, useEffect } from "react";
import api from "../api/client";
import { useToast } from "../context/ToastContext";

export default function CoverLetterPanel() {
  const { showSuccess, showError } = useToast();

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  
  const [tone, setTone] = useState("Professional");
  const [template, setTemplate] = useState("Standard");
  const [coverLetter, setCoverLetter] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await api.get("/my_resumes");
      if (response.data && response.data.resumes) {
        setResumes(response.data.resumes);
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

  const generateCoverLetter = async () => {
    if (!selectedResumeId) {
      showError("Please upload or select a resume first");
      return;
    }
    if (!jobDescription.trim()) {
      showError("Please enter the target job description");
      return;
    }

    try {
      setLoading(true);
      setCoverLetter("");
      
      const response = await api.post(
        `/generate_cover_letter?resume_id=${selectedResumeId}&job_description=${encodeURIComponent(
          jobDescription
        )}&tone=${encodeURIComponent(tone)}`
      );

      setCoverLetter(response.data.data.cover_text);
      showSuccess("Cover letter generated successfully!");
    } catch (error) {
      console.error(error);
      showError("Failed to generate cover letter");
    } finally {
      setLoading(false);
    }
  };

  const copyCoverLetter = () => {
    if (!coverLetter) return;
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    showSuccess("Copied cover letter text to clipboard");
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const downloadCoverLetter = () => {
    if (!coverLetter) return;
    const element = document.createElement("a");
    const file = new Blob([coverLetter], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "cover_letter_sensei.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showSuccess("Cover letter document downloaded successfully");
  };

  return (
    <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "25px" }}>
      {/* Configuration Form Card */}
      <div className="card">
        <h2 style={{ fontSize: "1.3rem", fontWeight: "700", fontFamily: "var(--font-display)", marginBottom: "8px" }}>
          ✉️ Tailor Cover Letter
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: "0.95rem" }}>
          Instantly generate a highly targeted professional cover letter structure that aligns your credentials with the job posting requirements.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label htmlFor="resume-select">Select Reference Resume</label>
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
            <div>
              <label htmlFor="tone">Tone of Letter</label>
              <select
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "12px" }}
              >
                <option>Professional</option>
                <option>Friendly</option>
                <option>Confident</option>
                <option>Academic</option>
              </select>
            </div>

            <div>
              <label htmlFor="template">Select Template Type</label>
              <select
                id="template"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "12px" }}
              >
                <option>Standard</option>
                <option>Accomplishment-Focused</option>
                <option>Short & Punchy</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="jobDesc">Target Job Description</label>
            <textarea
              id="jobDesc"
              rows="6"
              placeholder="Paste targeted job responsibilities and company details here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              style={{ resize: "vertical" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
          <button
            onClick={generateCoverLetter}
            className="btn-primary"
            disabled={loading || resumes.length === 0}
            style={{ minHeight: "44px" }}
          >
            {loading ? "Generating..." : "Generate Cover Letter"}
          </button>
        </div>
      </div>

      {/* Editor/Result details card */}
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
            <h2 style={{ fontSize: "1.2rem", fontWeight: "700", fontFamily: "var(--font-display)", margin: 0 }}>
              📄 Interactive Cover Letter Editor
            </h2>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={copyCoverLetter}
                className={copied ? "btn-success" : "btn-secondary"}
                style={{
                  padding: "8px 16px",
                  fontSize: "0.82rem",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                {copied ? "Copied!" : "Copy Clipboard"}
              </button>
              
              <button
                onClick={downloadCoverLetter}
                className="btn-secondary"
                style={{
                  padding: "8px 16px",
                  fontSize: "0.82rem",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                Download Text
              </button>
            </div>
          </div>

          <textarea
            rows="20"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            style={{
              width: "100%",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid var(--border-color)",
              background: "var(--panel-bg)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-body)",
              fontSize: "0.95rem",
              lineHeight: "1.6",
              resize: "vertical"
            }}
            placeholder="Type or edit cover letter directly..."
          />
        </div>
      )}
    </div>
  );
}

// Local format date utility
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};
