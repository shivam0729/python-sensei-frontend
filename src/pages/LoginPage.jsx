import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Field validation states (touched state for fields)
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const tokenKey = import.meta.env.VITE_JWT_TOKEN_KEY || "ps_auth_token";

  useEffect(() => {
    // Theme toggle initialization
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      setDarkMode(true);
    }

    // Remember Me initialization
    const savedEmail = localStorage.getItem("remembered_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
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

  const validateEmail = (val) => {
    if (!val) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Invalid email address format";
    return "";
  };

  const validatePassword = (pass) => {
    if (!pass) return "Password is required";
    return "";
  };

  const emailError = touched.email ? validateEmail(email) : "";
  const passwordError = touched.password ? validatePassword(password) : "";

  const handleLogin = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (validateEmail(email) || validatePassword(password)) {
      showError("Please enter valid credentials");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/login", {
        email: email.trim(),
        password,
      });

      const data = response.data.data;
      login(data.access_token);
      localStorage.setItem("user_id", data.user.id);
      localStorage.setItem("user_email", data.user.email);
      localStorage.setItem("user_name", data.user.full_name);
      if (data.user.profile_picture) {
        localStorage.setItem("user_avatar", data.user.profile_picture);
      }

      // Handle Remember Me storage
      if (rememberMe) {
        localStorage.setItem("remembered_email", email.trim());
      } else {
        localStorage.removeItem("remembered_email");
      }

      showSuccess(`Login successful! Welcome back, ${data.user.full_name} 👋`);
      
      // Small redirect timeout to let user see toast
      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.detail || "Invalid email or password";
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
          <h1 style={{ fontSize: "2rem", marginBottom: "8px", fontFamily: "var(--font-display)" }}>Welcome Back</h1>
          <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)" }}>Sign in to continue to Python Sensei</p>
        </div>

        <form
          onSubmit={handleLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {/* Email input field */}
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

          {/* Password input field */}
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
            {passwordError && (
              <span style={{ color: "var(--danger)", fontSize: "0.78rem", display: "block", marginTop: "5px", fontWeight: "600" }}>
                {passwordError}
              </span>
            )}
          </div>

          {/* Form Actions: Remember me & Forgot Password */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", marginTop: "4px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", margin: 0 }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: "16px", height: "16px", cursor: "pointer", boxShadow: "none" }}
              />
              Remember Me
            </label>

            <Link
              to="/forgot-password"
              style={{
                color: "var(--primary)",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: "100%", marginTop: "10px", minHeight: "44px" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "8px" }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              style={{ 
                color: "var(--primary)", 
                textDecoration: "none", 
                fontWeight: "600" 
              }}
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}