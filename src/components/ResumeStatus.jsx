import { useEffect, useState } from "react";
import api from "../api/client";

export default function ResumeStatus({ resumeId }) {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!resumeId) return;

    setStatus("processing");
    setError("");

    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/resume_status/${resumeId}`);
        const data = response.data.data;
        setStatus(data.status);
        setError(data.error);

        if (data.status === "completed" || data.status === "failed") {
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [resumeId]);

  if (!resumeId) return null;

  return (
    <div className="card animate-fade-in" style={{ marginBottom: "25px" }}>
      <h2 style={{ fontSize: "1.3rem", fontWeight: "700", fontFamily: "var(--font-display)", marginBottom: "16px" }}>
        ⚡ Analysis Status
      </h2>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {status === "processing" && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
            <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "var(--primary)" }}>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p style={{ color: "var(--text-secondary)", fontWeight: "500", margin: 0 }}>
              AI is currently parsing and scoring your resume details...
            </p>
          </div>
        )}

        {status === "completed" && (
          <div className="alert alert-success" style={{ width: "100%", margin: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <div>
              <strong style={{ fontWeight: "700" }}>Analysis complete!</strong> Suggestions have been generated below.
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="alert alert-danger" style={{ width: "100%", margin: 0 }}>
            <span>⚠️ Analysis failed. Please try a different PDF structure.</span>
          </div>
        )}

        {!status && (
          <span className="badge badge-warning">Waiting to upload</span>
        )}
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginTop: "16px" }}>
          <span>⚠️ Error details: {error}</span>
        </div>
      )}
    </div>
  );
}