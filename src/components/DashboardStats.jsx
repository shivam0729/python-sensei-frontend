import { useEffect, useState } from "react";
import api from "../api/client";

export default function DashboardStats({ stats: propStats }) {
  const [localStats, setLocalStats] = useState(null);

  useEffect(() => {
    if (!propStats) {
      fetchStats();
    }
  }, [propStats]);

  const fetchStats = async () => {
    try {
      const response = await api.get("/dashboard_stats");
      setLocalStats(response.data.data);
    } catch (error) {
      console.error("Dashboard stats error", error);
    }
  };

  const stats = propStats || localStats;

  if (!stats) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 4px" }}>
        <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "var(--accent)" }}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: "600" }}>Loading preparedness...</span>
      </div>
    );
  }

  const cards = [
    {
      title: "Resumes",
      value: stats.total_resumes,
      color: "var(--primary)",
      glow: "var(--primary-glow)",
      emoji: "📄"
    },
    {
      title: "ATS Scans",
      value: stats.total_ats_runs,
      color: "var(--accent)",
      glow: "var(--accent-glow)",
      emoji: "🎯"
    },
    {
      title: "Mock Runs",
      value: stats.total_interviews,
      color: "var(--success)",
      glow: "rgba(16, 185, 129, 0.12)",
      emoji: "🎤"
    },
    {
      title: "Cover Letters",
      value: stats.total_cover_letters,
      color: "var(--warning)",
      glow: "rgba(245, 158, 11, 0.12)",
      emoji: "✉️"
    },
  ];

  return (
    <div className="stats-chips-row animate-fade-in">
      {cards.map((card, index) => (
        <div key={index} className="stat-chip">
          <div 
            className="stat-chip-icon" 
            style={{ 
              background: card.glow, 
              color: card.color 
            }}
          >
            {card.emoji}
          </div>
          
          <div className="stat-chip-details">
            <span className="stat-chip-value">{card.value}</span>
            <span className="stat-chip-label">{card.title}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
