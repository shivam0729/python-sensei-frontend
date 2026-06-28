import { useState, useEffect } from "react";

export default function TopNavigation({
  activeSection,
  setActiveSection,
  handleLogout,
}) {
  const [darkMode, setDarkMode] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const email = localStorage.getItem("user_email") || "";
  const fullName = localStorage.getItem("user_name") || "";
  const avatarUrl = localStorage.getItem("user_avatar") || "";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    if (newValue) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  };

  const getInitials = () => {
    if (fullName) {
      const parts = fullName.trim().split(" ");
      if (parts.length > 1) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return fullName.substring(0, 2).toUpperCase();
    }
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9"></rect>
          <rect x="14" y="3" width="7" height="5"></rect>
          <rect x="14" y="12" width="7" height="9"></rect>
          <rect x="3" y="16" width="7" height="5"></rect>
        </svg>
      ),
    },
    {
      label: "Resume",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
      ),
    },
    {
      label: "ATS",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="6"></circle>
          <circle cx="12" cy="12" r="2"></circle>
        </svg>
      ),
    },
    {
      label: "Interview",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
          <path d="M19 10v1a7 7 0 0 1-14 0v-1"></path>
          <line x1="12" y1="19" x2="12" y2="22"></line>
        </svg>
      ),
    },
    {
      label: "Cover Letter",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2"></rect>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
        </svg>
      ),
    },
    {
      label: "Profile",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
    }
  ];

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-sm)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          transition: "background-color 0.4s ease, border-color 0.4s ease",
        }}
      >
        {/* Brand/Logo and Mobile Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Hamburger button (Mobile only) */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="hamburger-btn"
            style={{
              background: "transparent",
              border: "none",
              boxShadow: "none",
              color: "var(--text-primary)",
              padding: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              marginRight: "4px"
            }}
            aria-label="Open navigation drawer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="18" x2="20" y2="18"></line>
            </svg>
          </button>

          <div 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px",
              cursor: "pointer"
            }}
            onClick={() => setActiveSection("Dashboard")}
          >
            <div 
              style={{ 
                width: "32px", 
                height: "32px", 
                borderRadius: "8px", 
                background: "linear-gradient(135deg, var(--primary), var(--accent))",
                boxShadow: "var(--shadow-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "800",
                fontSize: "16px",
                fontFamily: "var(--font-display)"
              }}
            >
              S
            </div>
            <div className="header-logo-text" style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "18px",
                  fontFamily: "var(--font-display)",
                  fontWeight: "800",
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary)",
                  lineHeight: "1.2"
                }}
              >
                Python Sensei
              </span>
              <span
                style={{
                  fontSize: "10px",
                  color: "var(--text-secondary)",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                AI Career Suite
              </span>
            </div>
          </div>
        </div>

        {/* Center: Navigation Links (Desktop Only) */}
        <nav
          className="desktop-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {menuItems.map((item) => {
            const isActive = activeSection === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveSection(item.label)}
                className={isActive ? "btn-neomorphic-active" : "btn-neomorphic-inactive"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  cursor: "pointer",
                  fontWeight: isActive ? "700" : "600",
                  fontSize: "0.9rem",
                  transition: "all 0.2s ease",
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Actions (Theme, User Profile, Logout) */}
        <div
          className="header-actions"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title="Toggle theme appearance"
            aria-label="Toggle theme appearance"
          >
            {darkMode ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="M4.93 4.93l1.41 1.41"></path>
                <path d="M17.66 17.66l1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="M6.34 17.66l-1.41 1.41"></path>
                <path d="M19.07 4.93l-1.41 1.41"></path>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </svg>
            )}
          </button>

          {/* User Info (Desktop only) */}
          <div
            className="desktop-nav"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 12px 4px 6px",
              borderRadius: "9999px",
              background: "var(--primary-glow)",
              fontSize: "0.85rem",
              fontWeight: "600",
              border: "1px solid rgba(124, 58, 237, 0.15)",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--primary), var(--accent))",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
                fontWeight: "700",
                overflow: "hidden"
              }}
            >
              {avatarUrl ? (
                <img src={`http://localhost:8000${avatarUrl}`} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                getInitials()
              )}
            </div>
            <span className="header-user-info-text" style={{ color: "var(--text-primary)", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {fullName || email || "User"}
            </span>
          </div>

          {/* Logout Button (Desktop only) */}
          <button
            onClick={handleLogout}
            className="desktop-nav"
            style={{
              background: "var(--danger-bg)",
              color: "var(--danger-text)",
              border: "1px solid rgba(239, 68, 68, 0.15)",
              padding: "8px 14px",
              fontSize: "0.85rem",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "none",
              transform: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--danger)";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--danger-bg)";
              e.currentTarget.style.color = "var(--danger-text)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Sliding Drawer Menu for Mobile */}
      <div 
        className={`drawer-backdrop ${isDrawerOpen ? "open" : ""}`}
        onClick={() => setIsDrawerOpen(false)}
      >
        <div 
          className="drawer-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="drawer-header">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div 
                style={{ 
                  width: "28px", 
                  height: "28px", 
                  borderRadius: "8px", 
                  background: "linear-gradient(135deg, var(--primary), var(--accent))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "800",
                  fontSize: "14px"
                }}
              >
                S
              </div>
              <span style={{ fontWeight: "850", color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>Python Sensei</span>
            </div>
            <button className="drawer-close-btn" onClick={() => setIsDrawerOpen(false)} aria-label="Close menu">
              &times;
            </button>
          </div>

          {/* User profile inside Drawer */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid var(--border-color)", paddingBottom: "16px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--primary), var(--accent))",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                fontWeight: "700",
                overflow: "hidden"
              }}
            >
              {avatarUrl ? (
                <img src={`http://localhost:8000${avatarUrl}`} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                getInitials()
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <span style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "0.95rem" }}>{fullName || "User Account"}</span>
              <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis" }}>{email}</span>
            </div>
          </div>

          {/* Drawer Nav links */}
          <nav className="drawer-nav">
            {menuItems.map((item) => {
              const isActive = activeSection === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setActiveSection(item.label);
                    setIsDrawerOpen(false);
                  }}
                  className={`drawer-nav-item ${isActive ? "active" : ""}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Drawer Footer / Logout */}
          <div style={{ marginTop: "auto", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
            <button
              onClick={() => {
                setIsDrawerOpen(false);
                handleLogout();
              }}
              style={{
                width: "100%",
                background: "var(--danger-bg)",
                color: "var(--danger-text)",
                border: "1px solid rgba(239, 68, 68, 0.15)",
                padding: "12px",
                borderRadius: "12px",
                fontSize: "0.95rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "none"
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
