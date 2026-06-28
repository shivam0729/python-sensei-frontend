import { useState, useRef, useEffect } from "react";
import api from "../api/client";
import { useToast } from "../context/ToastContext";

export default function ResumeUpload({ setResumeId }) {
  const { showSuccess, showError } = useToast();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [myResumes, setMyResumes] = useState([]);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await api.get("/my_resumes");
      if (response.data && response.data.resumes) {
        setMyResumes(response.data.resumes);
      }
    } catch (err) {
      console.error("Failed to fetch resumes list", err);
    }
  };

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;
    
    // File format check
    if (!selectedFile.name.toLowerCase().endsWith(".pdf") && selectedFile.type !== "application/pdf") {
      showError("Only PDF resumes are supported");
      return false;
    }
    
    // File size check (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      showError("File size exceeds 5MB limit");
      return false;
    }
    
    return true;
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (validateFile(selected)) {
        setFile(selected);
      }
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      if (validateFile(selected)) {
        setFile(selected);
      }
    }
  };

  const onZoneClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!file) {
      showError("Please select a PDF resume first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setProgress(0);

      const response = await api.post("/upload_resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });

      const newResumeId = response.data.data.resume_id;
      setResumeId(newResumeId);
      localStorage.setItem("resume_id", newResumeId);
      
      showSuccess("Resume uploaded successfully! Starting AI suggestions...");
      setFile(null);
      fetchResumes();
    } catch (error) {
      console.error(error);
      showError("Upload failed. Please try a standard PDF format.");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleDelete = async (resumeId, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this resume?")) return;
    try {
      await api.delete(`/delete_resume/${resumeId}`);
      showSuccess("Resume deleted successfully");
      setMyResumes((prev) => prev.filter((r) => r.resume_id !== resumeId));
      if (localStorage.getItem("resume_id") === String(resumeId)) {
        localStorage.removeItem("resume_id");
        setResumeId(null);
      }
    } catch (err) {
      showError("Failed to delete resume");
    }
  };

  const handleDownload = (r, e) => {
    e.stopPropagation();
    showSuccess(`Downloading resume file: ${r.filename}`);
  };

  const handleSelectResume = (resumeId) => {
    setResumeId(resumeId);
    localStorage.setItem("resume_id", resumeId);
    showSuccess("Selected resume for active workspace review");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
      {/* Upload Zone Card */}
      <div className="card">
        <h2 style={{ fontSize: "1.3rem", fontWeight: "700", fontFamily: "var(--font-display)", marginBottom: "8px" }}>
          📤 Upload Resume PDF
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "24px", fontSize: "0.95rem" }}>
          Upload your latest resume in PDF format. We'll analyze structure, keywords, spelling, and readability constraints.
        </p>

        {/* Hidden file input */}
        <input
          type="file"
          accept=".pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {/* Drag and Drop Zone */}
        <div 
          className={`file-upload-zone ${dragActive ? "drag-active" : ""}`}
          onClick={onZoneClick}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          style={{ 
            marginBottom: "20px",
            borderColor: dragActive ? "var(--primary)" : "",
            background: dragActive ? "var(--primary-glow)" : ""
          }}
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
            <p style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "0.95rem", margin: 0 }}>
              {file ? "Change selected file" : "Drag and drop your resume here"}
            </p>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "4px", margin: 0 }}>
              {file ? file.name : "or click to search files (PDF format, max 5MB)"}
            </p>
          </div>
        </div>

        {/* Upload Action & Progress */}
        {file && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {loading && progress > 0 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "4px", fontWeight: "600" }}>
                  <span>Uploading file...</span>
                  <span>{progress}%</span>
                </div>
                <div style={{ width: "100%", height: "6px", background: "var(--border-color)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ width: `${progress}%`, height: "100%", background: "var(--primary)", transition: "width 0.1s ease" }} />
                </div>
              </div>
            )}
            
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleUpload}
                className="btn-primary"
                disabled={loading}
                style={{ minHeight: "44px" }}
              >
                {loading ? "Uploading..." : "Start AI Audit"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Resumes Card */}
      <div className="card">
        <h2 style={{ fontSize: "1.3rem", fontWeight: "700", fontFamily: "var(--font-display)", marginBottom: "16px" }}>
          📑 Uploaded Resumes List
        </h2>
        {myResumes.length === 0 ? (
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", margin: 0 }}>
            No resumes uploaded yet. Drag one above to begin.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {myResumes.map((r) => (
              <div 
                key={r.resume_id} 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  background: "var(--panel-bg)", 
                  padding: "12px 18px", 
                  borderRadius: "16px", 
                  border: "1px solid var(--border-color)",
                  flexWrap: "wrap",
                  gap: "10px"
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.92rem", fontWeight: "700", color: "var(--text-primary)" }}>
                    {r.filename}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                    Uploaded {formatDate(r.uploaded_at)}
                  </span>
                </div>
                
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleSelectResume(r.resume_id)}
                    className="btn-secondary"
                    style={{ padding: "8px 12px", fontSize: "0.8rem", borderSize: "1px" }}
                  >
                    View Suggestions
                  </button>
                  <button
                    onClick={(e) => handleDelete(r.resume_id, e)}
                    className="btn-danger"
                    style={{ padding: "8px 12px", fontSize: "0.8rem" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}