import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../api/client";
import { useToast } from "../context/ToastContext";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // Step 1: Forgot Password Email Form
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  // Step 3: Reset Password Form
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const [darkMode, setDarkMode] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    newPassword: false,
    confirmPassword: false,
  });

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

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Validations
  const validateEmail = (val) => {
    if (!val) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Please enter a valid email format";
    return "";
  };

  const validateNewPassword = (pass) => {
    if (!pass) return "New password is required";
    if (pass.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(pass)) return "Must include at least one uppercase letter";
    if (!/[0-9]/.test(pass)) return "Must include at least one number";
    if (!/[^A-Za-z0-9]/.test(pass)) return "Must include at least one special character";
    return "";
  };

  const validateConfirmPassword = (cPass) => {
    if (!cPass) return "Please confirm your password";
    if (cPass !== newPassword) return "Passwords do not match";
    return "";
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!newPassword) return { score: 0, label: "", color: "transparent" };
    let score = 0;
    if (newPassword.length >= 8) score += 1;
    if (newPassword.length >= 10) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;

    if (score <= 2) return { score, label: "Weak", color: "var(--danger)" };
    if (score <= 4) return { score, label: "Medium", color: "var(--warning)" };
    return { score, label: "Strong", color: "var(--success)" };
  };

  const strength = getPasswordStrength();

  const emailError = touched.email ? validateEmail(email) : "";
  const passwordError = touched.newPassword ? validateNewPassword(newPassword) : "";
  const confirmPasswordError = touched.confirmPassword ? validateConfirmPassword(confirmPassword) : "";

  // Handlers
  const handleRequestLink = async (e) => {
    e.preventDefault();
    setTouched((prev) => ({ ...prev, email: true }));

    if (validateEmail(email)) {
      showError("Please enter a valid email address");
      return;
    }

    setEmailLoading(true);

    try {
      await api.post("/forgot-password", { email: email.trim() });
      showSuccess("Password reset link generated! Check your developer console/inbox.");
      setEmailSubmitted(true);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.detail || "Email address not found";
      showError(msg);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setTouched({ email: false, newPassword: true, confirmPassword: true });

    if (validateNewPassword(newPassword) || validateConfirmPassword(confirmPassword)) {
      showError("Please satisfy all password validation conditions");
      return;
    }

    setResetLoading(true);

    try {
      await api.post("/reset-password", {
        token: token,
        new_password: newPassword,
      });

      showSuccess("Password reset successfully! Redirecting to login...");
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.detail || "Failed to reset password. Token might be expired.";
      showError(msg);
    } finally {
      setResetLoading(false);
    }
  };

  // Render Reset Form (Step 3)
  if (token) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "radial-gradient(circle at 50% 50%, var(--primary-glow) 0%, var(--bg-primary) 100%)",
          padding: "20px",
          position: "relative",
        }}
      >
        <div className="auth-theme-switch-container">
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title="Toggle theme appearance"
            aria-label="Toggle theme appearance"
          >
            {darkMode ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="M4.93 4.93l1.41 1.41"></path><path d="M17.66 17.66l1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="M6.34 17.66l-1.41 1.41"></path><path d="M19.07 4.93l-1.41 1.41"></path></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
            )}
          </button>
        </div>

        <div
          className="card animate-fade-in"
          style={{
            width: "100%",
            maxWidth: "450px",
            padding: "40px 30px",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "25px" }}>
            <div 
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, var(--accent), var(--primary))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px auto",
                boxShadow: "var(--shadow-primary)",
                color: "white",
                fontSize: "24px",
                fontWeight: "bold",
                fontFamily: "var(--font-display)"
              }}
            >
              S
            </div>
            <h1 style={{ fontSize: "1.8rem", marginBottom: "8px", fontFamily: "var(--font-display)" }}>Reset Password</h1>
            <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)" }}>Choose a secure new password for your account</p>
          </div>

          <form
            onSubmit={handleResetPassword}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {/* New Password input */}
            <div>
              <label htmlFor="newPassword">New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onBlur={() => handleBlur("newPassword")}
                  style={{ paddingRight: "44px" }}
                  className={passwordError ? "input-error" : (touched.newPassword && !passwordError ? "input-success" : "")}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                    padding: "6px",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                    display: "flex",
                  }}
                >
                  {showNewPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>

              {/* Password strength meter */}
              {newPassword && (
                <div>
                  <div className="password-strength-meter">
                    <div 
                      className="password-strength-fill"
                      style={{
                        width: `${(strength.score / 5) * 100}%`,
                        backgroundColor: strength.color
                      }}
                    />
                  </div>
                  <span className="strength-text" style={{ color: strength.color }}>
                    Password Strength: {strength.label}
                  </span>
                </div>
              )}

              {passwordError && (
                <span style={{ color: "var(--danger)", fontSize: "0.78rem", display: "block", marginTop: "5px", fontWeight: "600" }}>
                  {passwordError}
                </span>
              )}
            </div>

            {/* Confirm Password input */}
            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => handleBlur("confirmPassword")}
                  style={{ paddingRight: "44px" }}
                  className={confirmPasswordError ? "input-error" : (touched.confirmPassword && !confirmPasswordError ? "input-success" : "")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                    padding: "6px",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                    display: "flex",
                  }}
                >
                  {showConfirmPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
              {confirmPasswordError && (
                <span style={{ color: "var(--danger)", fontSize: "0.78rem", display: "block", marginTop: "5px", fontWeight: "600" }}>
                  {confirmPasswordError}
                </span>
              )}
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: "100%", marginTop: "10px", minHeight: "44px" }}
              disabled={resetLoading}
            >
              {resetLoading ? (
                <>
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "8px" }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resetting Password...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Request Email Form (Step 1)
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "radial-gradient(circle at 50% 50%, var(--primary-glow) 0%, var(--bg-primary) 100%)",
        padding: "20px",
        position: "relative",
      }}
    >
      <div className="auth-theme-switch-container">
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title="Toggle theme appearance"
          aria-label="Toggle theme appearance"
        >
          {darkMode ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="M4.93 4.93l1.41 1.41"></path><path d="M17.66 17.66l1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="M6.34 17.66l-1.41 1.41"></path><path d="M19.07 4.93l-1.41 1.41"></path></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
          )}
        </button>
      </div>

      <div
        className="card animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "40px 30px",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <div 
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, var(--primary), var(--accent))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px auto",
              boxShadow: "var(--shadow-primary)",
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
              fontFamily: "var(--font-display)"
            }}
          >
            S
          </div>
          <h1 style={{ fontSize: "1.8rem", marginBottom: "8px", fontFamily: "var(--font-display)" }}>Forgot Password</h1>
          <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)" }}>
            {!emailSubmitted ? "Recover your account credentials" : "Check your reset link details"}
          </p>
        </div>

        {!emailSubmitted ? (
          <form
            onSubmit={handleRequestLink}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div>
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email")}
                className={emailError ? "input-error" : (touched.email && !emailError ? "input-success" : "")}
              />
              {emailError && (
                <span style={{ color: "var(--danger)", fontSize: "0.78rem", display: "block", marginTop: "5px", fontWeight: "600" }}>
                  {emailError}
                </span>
              )}
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: "100%", marginTop: "10px", minHeight: "44px" }}
              disabled={emailLoading}
            >
              {emailLoading ? (
                <>
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "8px" }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Reset Link...
                </>
              ) : (
                "Send Password Reset Link"
              )}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div className="alert alert-success" style={{ margin: "20px 0", textAlign: "left" }}>
              <span>✓ Password recovery link has been output to backend server console. Please inspect logs to retrieve token.</span>
            </div>
            
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
              In local development, the reset link is printed to the terminal console to facilitate testing. Look for:
              <br />
              <code style={{ background: "var(--panel-bg)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.82rem", display: "inline-block", marginTop: "6px" }}>
                http://localhost:5173/reset-password?token=...
              </code>
            </p>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
            Remembered your credentials?{" "}
            <Link 
              to="/" 
              style={{ 
                color: "var(--primary)", 
                textDecoration: "none", 
                fontWeight: "600" 
              }}
            >
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
