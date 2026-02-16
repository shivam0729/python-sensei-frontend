import { useState } from "react";
import { signupUser } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await signupUser(email, password);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="
      min-h-screen
      flex items-center justify-center
      bg-slate-950
      px-4 sm:px-6
    ">
      <div className="
        w-full
        max-w-sm sm:max-w-md md:max-w-lg
        bg-slate-900
        p-6 sm:p-8 md:p-10
        rounded-xl md:rounded-2xl
        border border-slate-800
        shadow-xl
      ">

        <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-2">
          Create Account
        </h2>

        <p className="text-slate-400 text-sm md:text-base text-center mb-6">
          Join Python Sensei
        </p>

        {error && (
          <div className="
            mb-4
            text-red-300
            text-sm md:text-base
            text-center
            bg-red-900/30
            border border-red-700
            rounded-lg
            p-3
          ">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4 md:space-y-5">

          <input
            type="email"
            placeholder="Email"
            className="
              w-full
              p-3 md:p-3.5
              rounded-lg
              bg-slate-950 border border-slate-700
              text-white
              text-sm md:text-base
              focus:ring-2 focus:ring-indigo-600
              outline-none
            "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="
              w-full
              p-3 md:p-3.5
              rounded-lg
              bg-slate-950 border border-slate-700
              text-white
              text-sm md:text-base
              focus:ring-2 focus:ring-indigo-600
              outline-none
            "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              py-3 md:py-3.5
              rounded-lg
              bg-indigo-600 hover:bg-indigo-700
              disabled:opacity-60
              text-white font-semibold
              text-sm md:text-base
              transition
            "
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-slate-400 text-sm md:text-base text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
