import { useState, useEffect } from "react";
import api from "../api/client";
import { useToast } from "../context/ToastContext";

export default function ProfilePanel() {
  const { showSuccess, showError } = useToast();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [avatar, setAvatar] = useState("");
  
  // History data states
  const [resumes, setResumes] = useState([]);
  const [coverLetters, setCoverLetters] = useState([]);
  const [interviews, setInterviews] = useState([]);
  
  // Editing states
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempPhone, setTempPhone] = useState("");
  const [savingInfo, setSavingInfo] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Change Password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await api.get("/profile");
      const data = response.data.data;
      
      setFullName(data.user.full_name);
      setPhoneNumber(data.user.phone_number || "");
      setEmail(data.user.email);
      setJoinDate(data.user.created_at);
      setAvatar(data.user.profile_picture || "");

      // Prepopulate edit forms
      setTempName(data.user.full_name);
      setTempPhone(data.user.phone_number || "");

      setResumes(data.resumes || []);
      setCoverLetters(data.cover_letters || []);
      setInterviews(data.interviews || []);
      
      // Update local storage just in case
      localStorage.setItem("user_name", data.user.full_name);
      localStorage.setItem("user_avatar", data.user.profile_picture || "");
    } catch (err) {
      console.error(err);
      showError("Failed to fetch user profile details");
    }
  };

  const handleInfoSave = async () => {
    if (!tempName.trim()) {
      showError("Full Name is required");
      return;
    }
    setSavingInfo(true);
    try {
      const response = await api.put("/profile", {
        full_name: tempName.trim(),
        phone_number: tempPhone.trim() || null,
      });
      const data = response.data.data;
      setFullName(data.user.full_name);
      setPhoneNumber(data.user.phone_number || "");
      localStorage.setItem("user_name", data.user.full_name);
      setIsEditingInfo(false);
      showSuccess("Personal information updated successfully");
      
      // Refresh top navigation values
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      showError("Failed to update profile data");
    } finally {
      setSavingInfo(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    
    // File size check (max 3MB)
    if (file.size > 3 * 1024 * 1024) {
      showError("Image size must be less than 3MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploadingAvatar(true);
    try {
      const response = await api.post("/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const path = response.data.data.profile_picture;
      setAvatar(path);
      localStorage.setItem("user_avatar", path);
      showSuccess("Profile picture updated successfully");
      
      // Refresh context
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      showError("Failed to upload profile picture");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      showError("All password fields are required");
      return;
    }
    if (newPassword.length < 8) {
      showError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      showError("New password confirmation does not match");
      return;
    }

    setChangingPassword(true);
    try {
      await api.post("/profile/change-password", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      showSuccess("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.detail || "Incorrect current password";
      showError(msg);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (!confirm("Are you sure you want to delete this resume? All associated ATS scans and feedback details will be permanently removed.")) return;
    try {
      await api.delete(`/delete_resume/${resumeId}`);
      showSuccess("Resume removed successfully");
      setResumes((prev) => prev.filter((r) => r.id !== resumeId));
      
      // Check if deleted resume was active
      if (localStorage.getItem("resume_id") === String(resumeId)) {
        localStorage.removeItem("resume_id");
      }
    } catch (err) {
      showError("Failed to delete resume");
    }
  };

  const downloadFile = (resumeId, filename) => {
    // Resume file download helper
    showSuccess(`Downloading resume file: ${filename}`);
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
    <div style={{ display: "flex", flexDirection: "column", gap: "25px", marginTop: "15px" }} className="animate-fade-in">
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
          gap: "25px" 
        }}
      >
        {/* Personal Details Profile Card */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "700", fontFamily: "var(--font-display)", margin: 0 }}>
            👤 Profile & Account Status
          </h2>
          
          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", borderBottom: "1px solid var(--border-color)", paddingBottom: "20px" }}>
            <div style={{ position: "relative" }}>
              <div 
                style={{ 
                  width: "90px", 
                  height: "90px", 
                  borderRadius: "50%", 
                  background: "linear-gradient(135deg, var(--primary), var(--accent))",
                  color: "white",
                  fontSize: "2rem",
                  fontWeight: "800",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "var(--shadow-md)",
                  overflow: "hidden"
                }}
              >
                {avatar ? (
                  <img src={`http://localhost:8000${avatar}`} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  fullName ? fullName.substring(0, 2).toUpperCase() : "U"
                )}
              </div>
              
              <label 
                htmlFor="avatar-upload" 
                style={{ 
                  position: "absolute", 
                  bottom: "-4px", 
                  right: "-4px",
                  background: "var(--primary)",
                  color: "white",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "var(--shadow-sm)",
                  margin: 0
                }}
                title="Upload profile image"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </label>
              
              <input 
                id="avatar-upload"
                type="file" 
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: "none" }}
              />
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "800", margin: 0, color: "var(--text-primary)" }}>{fullName}</h3>
              <span className="badge badge-success" style={{ alignSelf: "flex-start", fontWeight: "700" }}>Active Member</span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Joined on {formatDate(joinDate)}</span>
            </div>
          </div>

          {/* Form items */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ marginBottom: "4px" }}>Email Address</label>
              <input 
                type="text" 
                value={email} 
                disabled 
                style={{ opacity: 0.7, cursor: "not-allowed", background: "var(--panel-bg)" }} 
              />
            </div>

            {!isEditingInfo ? (
              <>
                <div>
                  <label style={{ marginBottom: "4px" }}>Phone Number</label>
                  <input 
                    type="text" 
                    value={phoneNumber || "Not Specified"} 
                    disabled 
                    style={{ opacity: 0.8, background: "var(--panel-bg)" }} 
                  />
                </div>
                
                <button 
                  onClick={() => setIsEditingInfo(true)}
                  className="btn-secondary"
                  style={{ width: "100%", padding: "10px 18px", fontSize: "0.9rem", minHeight: "44px" }}
                >
                  Edit Personal Information
                </button>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ marginBottom: "4px" }}>Full Name</label>
                  <input 
                    type="text" 
                    value={tempName} 
                    onChange={(e) => setTempName(e.target.value)} 
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label style={{ marginBottom: "4px" }}>Phone Number</label>
                  <input 
                    type="text" 
                    value={tempPhone} 
                    onChange={(e) => setTempPhone(e.target.value)} 
                    placeholder="e.g. +1 555-0199"
                  />
                </div>
                
                <div style={{ display: "flex", gap: "10px" }}>
                  <button 
                    onClick={() => setIsEditingInfo(false)}
                    className="btn-secondary"
                    style={{ flex: 1, padding: "10px", fontSize: "0.9rem" }}
                    disabled={savingInfo}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleInfoSave}
                    className="btn-primary"
                    style={{ flex: 1, padding: "10px", fontSize: "0.9rem" }}
                    disabled={savingInfo}
                  >
                    {savingInfo ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Change Password settings block */}
        <div className="card">
          <h2 style={{ fontSize: "1.3rem", fontWeight: "700", fontFamily: "var(--font-display)", marginBottom: "20px" }}>
            🔑 Security & Password update
          </h2>
          
          <form onSubmit={handlePasswordChange} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label htmlFor="oldPass">Current Password</label>
              <input 
                id="oldPass"
                type="password" 
                placeholder="Enter current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="newPass">New Password</label>
              <input 
                id="newPass"
                type="password" 
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPass">Confirm New Password</label>
              <input 
                id="confirmPass"
                type="password" 
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: "100%", marginTop: "8px", minHeight: "44px" }}
              disabled={changingPassword}
            >
              {changingPassword ? "Updating..." : "Change Account Password"}
            </button>
          </form>
        </div>
      </div>

      {/* Historical Lists Area */}
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: "700", fontFamily: "var(--font-display)", margin: 0 }}>
          📑 Workspace Historical Records
        </h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "25px", marginTop: "10px" }}>
          {/* Resume History logs */}
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "var(--text-primary)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>📄</span> Resumes History ({resumes.length})
            </h3>
            
            {resumes.length === 0 ? (
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", margin: 0, paddingLeft: "10px" }}>
                No uploaded resumes found. Go to the "Resume" tab to upload your first resume!
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {resumes.map((r) => (
                  <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--panel-bg)", padding: "12px 18px", borderRadius: "12px", border: "1px solid var(--border-color)", flexWrap: "wrap", gap: "10px" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-primary)" }}>{r.filename}</span>
                      <span style={{ fontSize: "0.76rem", color: "var(--text-secondary)" }}>Uploaded {formatDate(r.created_at)}</span>
                    </div>
                    
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button 
                        onClick={() => handleDeleteResume(r.id)}
                        className="btn-danger"
                        style={{ padding: "8px 12px", fontSize: "0.78rem" }}
                        title="Delete resume log"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ATS Optimization History */}
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "var(--text-primary)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>✉️</span> Generated Cover Letters ({coverLetters.length})
            </h3>
            
            {coverLetters.length === 0 ? (
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", margin: 0, paddingLeft: "10px" }}>
                No generated cover letters. Go to the "Cover Letter" tab to draft your first letter!
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {coverLetters.map((c) => (
                  <div key={c.id} style={{ display: "flex", flexDirection: "column", gap: "8px", background: "var(--panel-bg)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-primary)" }}>
                        Letter {c.tone ? `(${c.tone})` : ""}
                      </span>
                      <span style={{ fontSize: "0.76rem", color: "var(--text-secondary)" }}>
                        {formatDate(c.created_at)}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", maxHeight: "40px" }}>
                      {c.cover_text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interview History log list */}
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: "800", color: "var(--text-primary)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>🎤</span> Practice Interview History ({interviews.length})
            </h3>
            
            {interviews.length === 0 ? (
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", margin: 0, paddingLeft: "10px" }}>
                No practice interview sessions found. Go to the "Interview" tab to start practicing!
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {interviews.map((i) => (
                  <div key={i.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--panel-bg)", padding: "12px 18px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-primary)" }}>
                        {i.target_role || "General Interview"}
                      </span>
                      <span style={{ fontSize: "0.76rem", color: "var(--text-secondary)" }}>
                        Completed {formatDate(i.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
