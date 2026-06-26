import { useState, useRef } from "react";
import api from "../api/client";

export default function ResumeUpload({ setResumeId }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage(""); // Clear message when new file selected
    }
  };

  const onZoneClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF resume first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setMessage("");

      const response = await api.post("/upload_resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newResumeId = response.data.data.resume_id;

      // React State
      setResumeId(newResumeId);

      // Local Storage
      localStorage.setItem("resume_id", newResumeId);

      setMessage("Success: " + response.data.message);
    } catch (error) {
      console.error(error);
      setMessage("Error: Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: "25px" }}>
      <h2 style={{ fontSize: "1.3rem", fontWeight: "700", fontFamily: "var(--font-display)", marginBottom: "8px" }}>
        📤 Upload Resume
      </h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "24px", fontSize: "0.95rem" }}>
        Upload your latest resume in PDF format to generate AI insights, analyze keywords, and match job descriptions.
      </p>

      {/* Hidden file input */}
      <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Custom upload zone */}
      <div 
        className="file-upload-zone"
        onClick={onZoneClick}
        style={{ marginBottom: "24px" }}
      >
        <svg 
          width="40" 
          height="40" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <div>
          <p style={{ fontWeight: "600", color: "var(--text-primary)", fontSize: "0.95rem" }}>
            {file ? "Change selected file" : "Choose your PDF resume"}
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            {file ? file.name : "Click to select a file from your system"}
          </p>
        </div>
      </div>

      {file && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleUpload}
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "8px" }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing Resume...
              </>
            ) : (
              "Upload and Analyze"
            )}
          </button>
        </div>
      )}

      {message && (
        <div 
          className={`alert ${message.startsWith("Error") ? "alert-danger" : "alert-success"}`}
          style={{ marginTop: "20px" }}
        >
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}