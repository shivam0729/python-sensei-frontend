import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const navLink = (path, label) => {
    const active = location.pathname === path;
    return (
      <Link
        to={path}
        className={`
          px-2.5 py-1.5 rounded-md
          text-xs sm:text-sm font-medium
          transition whitespace-nowrap
          ${active
            ? "bg-indigo-600 text-white"
            : "text-slate-300 hover:text-white hover:bg-slate-800"
          }
        `}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-900 border-b border-slate-800">

      <div className="
        max-w-screen-2xl mx-auto
        px-3 sm:px-6 lg:px-12
        min-h-14
        flex flex-wrap items-center gap-3
      ">

        {/* Brand */}
        <div className="flex items-center gap-2 mr-auto">
          <span className="text-lg sm:text-xl">🧠</span>
          <span className="text-sm sm:text-base font-semibold tracking-wide">
            Python Sensei
          </span>
        </div>

        {/* Links — wraps on small screens */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          {navLink("/", "Dashboard")}
          {navLink("/upload", "Upload")}
          {navLink("/interview", "Interview")}
          {navLink("/profile", "Profile")}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="
            ml-auto sm:ml-3
            bg-red-600 hover:bg-red-700
            text-white
            text-xs sm:text-sm
            font-semibold
            px-3 py-1.5
            rounded-md
            transition
          "
        >
          Logout
        </button>

      </div>
    </nav>
  );
}
