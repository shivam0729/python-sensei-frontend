export default function DashboardHero() {
  const email = localStorage.getItem("user_email") || "";

  return (
    <div className="dashboard-hero">
      {/* Decorative vector background */}
      <div className="dashboard-hero-pattern" />
      
      <div style={{ position: "relative", zIndex: 1 }}>
        <h1 className="dashboard-hero-title">👋 Welcome Back</h1>
        <p className="dashboard-hero-subtitle">{email || "Python Sensei Member"}</p>
        <p className="dashboard-hero-desc">
          Optimize your resumes, calculate real-time ATS match scores, generate custom tailored cover letters, and prepare for live mock interviews with our AI career suite.
        </p>
      </div>
    </div>
  );
}
