import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Field validation states (touched state for fields)
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const tokenKey = import.meta.env.VITE_JWT_TOKEN_KEY || "ps_auth_token";

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

  // Real-time validators
  const validateFullName = (name) => {
    if (!name) return "Full Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(name)) return "Name cannot contain numbers or special characters";
    return "";
  };

  const validateEmail = (val) => {
    if (!val) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Please enter a valid email format";
    return "";
  };

  const validatePassword = (pass) => {
    if (!pass) return "Password is required";
    if (pass.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(pass)) return "Must include at least one uppercase letter";
    if (!/[0-9]/.test(pass)) return "Must include at least one number";
    if (!/[^A-Za-z0-9]/.test(pass)) return "Must include at least one special character";
    return "";
  };

  const validateConfirmPassword = (cPass) => {
    if (!cPass) return "Please confirm your password";
    if (cPass !== password) return "Passwords do not match";
    return "";
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: "", color: "transparent" };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { score, label: "Weak", color: "var(--danger)" };
    if (score <= 4) return { score, label: "Medium", color: "var(--warning)" };
    return { score, label: "Strong", color: "var(--success)" };
  };

  const strength = getPasswordStrength();

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const nameError = touched.fullName ? validateFullName(fullName) : "";
  const emailError = touched.email ? validateEmail(email) : "";
  const passwordError = touched.password ? validatePassword(password) : "";
  const confirmPasswordError = touched.confirmPassword ? validateConfirmPassword(confirmPassword) : "";

  const isFormValid =
    fullName &&
    email &&
    password &&
    confirmPassword &&
    !validateFullName(fullName) &&
    !validateEmail(email) &&
    !validatePassword(password) &&
    !validateConfirmPassword(confirmPassword);

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Touch all fields to show validation errors if any
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!isFormValid) {
      showError("Please fix the validation errors before submitting");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/signup", {
        email: email.trim(),
        password,
        full_name: fullName.trim(),
      });

      // Save credentials & log in
      login(response.data.data.access_token);
      localStorage.setItem("user_id", response.data.data.user.id);
      localStorage.setItem("user_email", response.data.data.user.email);
      localStorage.setItem("user_name", response.data.data.user.full_name);
      if (response.data.data.user.profile_picture) {
        localStorage.setItem("user_avatar", response.data.data.user.profile_picture);
      }

      showSuccess("Account created successfully! Redirecting to dashboard...");
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.detail || "Signup failed. Please try again.";
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 style={{ fontSize: "2rem", marginBottom: "8px", fontFamily: "var(--font-display)" }}>Create Account</h1>
          <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)" }}>Get started with Python Sensei today</p>
        </div>

        <form
          onSubmit={handleSignup}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {/* Full Name field */}
          <div>
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={() => handleBlur("fullName")}
              className={nameError ? "input-error" : (touched.fullName && !nameError ? "input-success" : "")}
            />
            {nameError && (
              <span style={{ color: "var(--danger)", fontSize: "0.78rem", display: "block", marginTop: "5px", fontWeight: "600" }}>
                {nameError}
              </span>
            )}
          </div>

          {/* Email field */}
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

          {/* Password field */}
          <div>
            <label htmlFor="password">Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur("password")}
                style={{ paddingRight: "44px" }}
                className={passwordError ? "input-error" : (touched.password && !passwordError ? "input-success" : "")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
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
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
            
            {/* Password strength meter */}
            {password && (
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

          {/* Confirm Password field */}
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
            disabled={loading || !isFormValid}
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "8px" }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link 
              to="/" 
              style={{ 
                color: "var(--primary)", 
                textDecoration: "none", 
                fontWeight: "600" 
              }}
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}