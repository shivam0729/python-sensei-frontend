import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

import { useAuth } from "../context/AuthContext";

import DashboardLayout from "../components/DashboardLayout";

import DashboardStats from "../components/DashboardStats";
import ResumeUpload from "../components/ResumeUpload";
import ResumeStatus from "../components/ResumeStatus";
import ResumeResults from "../components/ResumeResults";
import ATSOptimizer from "../components/ATSOptimizer";
import InterviewPanel from "../components/InterviewPanel";
import CoverLetterPanel from "../components/CoverLetterPanel";
import ProfilePanel from "../components/ProfilePanel";
import SectionHeader from "../components/SectionHeader";

export default function DashboardPage() {

  const navigate = useNavigate();

  const { logout } = useAuth();

  const [resumeId, setResumeId] =
    useState(null);

  const [activeSection, setActiveSection] =
    useState("Dashboard");

  const [stats, setStats] = useState(null);

  const [favorites, setFavorites] = useState({
    resume_fav: true,
    ats_fav: false,
    interview_fav: true,
    cover_fav: false
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/dashboard_stats");
      if (response.data && response.data.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Dashboard stats error", error);
    }
  };

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogout = () => {

    logout();

    localStorage.removeItem(
      "user_id"
    );

    localStorage.removeItem(
      "resume_id"
    );

    navigate("/");
  };

  const renderSection = () => {

    switch (activeSection) {

      case "Dashboard":
        const email = localStorage.getItem("user_email") || "";
        const username = email ? email.split("@")[0] : "Member";
        const fullName = localStorage.getItem("user_name") || "";

        // Calculate Career Readiness score dynamically
        const resumeWeight = stats?.total_resumes > 0 ? 30 : 0;
        const atsWeight = stats?.total_ats_runs > 0 ? 25 : 0;
        const interviewWeight = stats?.total_interviews > 0 ? 25 : 0;
        const coverWeight = stats?.total_cover_letters > 0 ? 20 : 0;
        const readinessScore = resumeWeight + atsWeight + interviewWeight + coverWeight;

        const actionCards = [
          {
            id: "resume_fav",
            title: "AI Resume Audit",
            desc: "Upload your resume PDF and analyze syntax, keyword matches, and readability scores.",
            badge: "ATS Compliant",
            info: stats?.total_resumes > 0 ? `${stats.total_resumes} Resumes` : "0 Resumes uploaded",
            section: "Resume",
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            )
          },
          {
            id: "ats_fav",
            title: "ATS Match Rating",
            desc: "Compare your resume against a target job description to bypass automated ATS filters.",
            badge: "Job Optimizer",
            info: stats?.total_ats_runs > 0 ? `${stats.total_ats_runs} Scans run` : "No scans run yet",
            section: "ATS",
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
              </svg>
            )
          },
          {
            id: "interview_fav",
            title: "AI Mock Interview",
            desc: "Engage in live role-specific mock interviews and receive performance scoring reports.",
            badge: "STAR Interview",
            info: stats?.total_interviews > 0 ? `${stats.total_interviews} Sessions` : "0 Practice sessions",
            section: "Interview",
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                <path d="M19 10v1a7 7 0 0 1-14 0v-1"></path>
                <line x1="12" y1="19" x2="12" y2="22"></line>
              </svg>
            )
          },
          {
            id: "cover_fav",
            title: "Tailored Cover Letter",
            desc: "Instantly draft customized cover letters aligning your profile with targeted job description specifications.",
            badge: "AI Copywriter",
            info: stats?.total_cover_letters > 0 ? `${stats.total_cover_letters} Letters draft` : "0 Templates draft",
            section: "Cover Letter",
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
            )
          }
        ];

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "25px" }} className="animate-fade-in">
            {/* Quick Greeting header block */}
            <div className="dashboard-app-header" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div 
                style={{ 
                  width: "54px", 
                  height: "54px", 
                  borderRadius: "50%", 
                  background: "linear-gradient(135deg, var(--primary), var(--accent))",
                  color: "white",
                  fontSize: "1.35rem",
                  fontWeight: "800",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "var(--shadow-sm)",
                  overflow: "hidden"
                }}
              >
                {localStorage.getItem("user_avatar") ? (
                  <img src={`http://localhost:8000${localStorage.getItem("user_avatar")}`} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  (fullName || "U").substring(0, 2).toUpperCase()
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h1 className="dashboard-user-greeting" style={{ margin: 0 }}>Welcome back, {fullName || username}! 👋</h1>
                <p className="dashboard-user-subgreeting" style={{ margin: 0 }}>Here's your career preparation breakdown</p>
              </div>
            </div>

            {/* Horizontal Stats Row */}
            <DashboardStats stats={stats} />

            {/* Career Readiness Score Card */}
            <div className="readiness-card">
              <div className="readiness-header">
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: "700", fontSize: "1.1rem", color: "var(--text-primary)" }}>
                    🎯 Career Readiness Index
                  </span>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                    Monitors your resume, ATS matching, and mock interview completion status.
                  </span>
                </div>
                <div className="readiness-score-display">{readinessScore}%</div>
              </div>

              <div className="readiness-progress-track">
                <div
                  className="readiness-progress-fill"
                  style={{ width: `${readinessScore}%` }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: "600" }}>
                <span>Progress: {readinessScore === 100 ? "Ready to Apply!" : "Needs Setup"}</span>
                <span>
                  {readinessScore === 0 && "Next Step: Upload a resume"}
                  {readinessScore > 0 && readinessScore < 50 && "Next Step: Practice a mock interview"}
                  {readinessScore >= 50 && readinessScore < 100 && "Next Step: Try ATS Optimization"}
                  {readinessScore === 100 && "All steps completed!"}
                </span>
              </div>
            </div>

            {/* Recent Activities list feed */}
            <div className="card">
              <h3 style={{ fontSize: "1.15rem", fontWeight: "800", marginBottom: "15px", fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                ⚡ Recent Workspace Activities
              </h3>
              {stats?.recent_activities && stats.recent_activities.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {stats.recent_activities.map((act, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "12px", 
                        padding: "10px 14px", 
                        background: "var(--panel-bg)", 
                        border: "1px solid var(--border-color)", 
                        borderRadius: "12px" 
                      }}
                    >
                      <div 
                        style={{ 
                          width: "32px", 
                          height: "32px", 
                          borderRadius: "8px", 
                          background: act.type === "resume_upload" ? "rgba(37, 99, 235, 0.1)" : act.type === "ats_optimize" ? "rgba(124, 58, 237, 0.1)" : "rgba(16, 185, 129, 0.1)",
                          color: act.type === "resume_upload" ? "var(--primary)" : act.type === "ats_optimize" ? "var(--accent)" : "var(--success)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1rem",
                          fontWeight: "bold"
                        }}
                      >
                        {act.type === "resume_upload" && "📄"}
                        {act.type === "ats_optimize" && "🎯"}
                        {act.type === "cover_letter" && "✉️"}
                        {act.type === "mock_interview" && "🎤"}
                      </div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-primary)" }}>{act.title}</span>
                        <span style={{ fontSize: "0.76rem", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{act.description}</span>
                      </div>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", fontWeight: "500", flexShrink: 0 }}>
                        {new Date(act.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                  No recent activities recorded. Try uploading your resume to start!
                </p>
              )}
            </div>

            {/* Features section title */}
            <div style={{ marginTop: "10px", paddingLeft: "4px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: "800", fontFamily: "var(--font-display)", color: "var(--text-primary)", margin: 0 }}>
                AI Career Suite Tools
              </h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                Select a workspace module below to optimize your professional opportunities.
              </p>
            </div>

            {/* Quick Action Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "24px",
                marginBottom: "10px"
              }}
            >
              {actionCards.map((card) => {
                const isFav = favorites[card.id];
                return (
                  <div
                    key={card.id}
                    className="feature-product-card"
                    onClick={() => setActiveSection(card.section)}
                  >
                    <div className="feature-product-card-header">
                      <span className="feature-product-card-badge">
                        {card.badge}
                      </span>
                      <button
                        className={`feature-product-card-heart ${isFav ? "active" : ""}`}
                        onClick={(e) => toggleFavorite(e, card.id)}
                        aria-label="Favorite feature"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                      </button>
                    </div>

                    <div className="feature-product-card-body">
                      <h3 className="feature-product-card-title">{card.title}</h3>
                      <p className="feature-product-card-desc">{card.desc}</p>
                    </div>

                    <div className="feature-product-card-footer">
                      <span className="feature-product-card-info">
                        {card.info}
                      </span>
                      <button
                        className="feature-product-card-btn"
                        aria-label={`Open ${card.title}`}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "Resume":

        return (

          <>

            <SectionHeader
              title="📄 Resume Analysis"
              description="Upload your resume and receive AI-powered resume insights, skill recommendations and ATS guidance."
            />

            <ResumeUpload
              setResumeId={
                setResumeId
              }
            />

            <ResumeStatus
              resumeId={
                resumeId
              }
            />

            <ResumeResults
              resumeId={
                resumeId
              }
            />

          </>

        );

      case "ATS":

        return (

          <>

            <SectionHeader
              title="🎯 ATS Optimization"
              description="Compare your resume against a job description and receive ATS score improvements, keyword recommendations and tailored suggestions."
            />

            <ATSOptimizer />

          </>

        );

      case "Interview":

        return (

          <>

            <SectionHeader
              title="🎤 AI Mock Interview"
              description="Practice role-specific interviews, receive AI feedback and improve your interview performance."
            />

            <InterviewPanel />

          </>

        );

      case "Cover Letter":

        return (

          <>

            <SectionHeader
              title="✉️ Cover Letter Generator"
              description="Generate personalized cover letters tailored to your resume and target job."
            />

            <CoverLetterPanel />

          </>

        );

      case "Profile":
        return (
          <>
            <SectionHeader
              title="👤 Profile & Settings"
              description="Manage your account profile details, change passwords, and inspect historical activity logs."
            />
            <ProfilePanel />
          </>
        );

      default:

        return (
          <DashboardStats />
        );
    }
  };

  return (

    <DashboardLayout
      activeSection={
        activeSection
      }
      setActiveSection={
        setActiveSection
      }
      handleLogout={
        handleLogout
      }
    >

      {renderSection()}

    </DashboardLayout>

  );
}