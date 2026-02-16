import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchResumes } from "../services/api";

/* ---------------- TOKEN DECODE ---------------- */

function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

/* ---------------- WEAKNESS EXTRACTOR ---------------- */

function extractWeakHints(text = "") {
  const lines = text.split("\n");
  return lines.filter(l =>
    /improve|missing|lack|add|should|weak|increase|better/i.test(l)
  ).slice(0, 4);
}

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const data = useMemo(() => decodeToken(token), [token]);

  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    loadResumes();
  }, []);

  async function loadResumes() {
    try {
      const r = await fetchResumes();
      setResumes(r.resumes || []);
    } catch {
      // non-critical
    }
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="max-w-xl md:max-w-4xl xl:max-w-6xl mx-auto space-y-6 md:space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
          Profile & Career Insights
        </h2>

        <p className="text-sm md:text-base text-slate-400 mt-2">
          Resume history and AI improvement guidance
        </p>
      </div>

      {/* User Card */}
      <div className="
        bg-slate-900 border border-slate-800
        rounded-xl md:rounded-2xl
        p-4 md:p-6 lg:p-8
      ">
        <div className="
          flex flex-col sm:flex-row
          sm:items-center sm:justify-between
          gap-5
        ">

          <div className="flex items-center gap-4">
            <div className="
              w-14 h-14 md:w-16 md:h-16
              rounded-full bg-indigo-600
              flex items-center justify-center
              text-lg md:text-xl font-bold text-white
            ">
              {data?.sub ? String(data.sub).slice(-2) : "U"}
            </div>

            <div>
              <div className="text-white font-semibold text-base md:text-lg">
                Python Sensei User
              </div>
              <div className="text-slate-400 text-xs md:text-sm">
                User ID: {data?.sub}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="
              w-full sm:w-auto
              bg-red-600 hover:bg-red-700
              px-5 py-2.5
              rounded-lg
              text-white font-semibold
              text-sm md:text-base
              transition
            "
          >
            Logout
          </button>

        </div>
      </div>

      {/* Resume History */}
      <div className="
        bg-slate-900 border border-slate-800
        rounded-xl md:rounded-2xl
        p-4 md:p-6 lg:p-8
      ">
        <h3 className="text-white font-semibold text-base md:text-lg mb-4 md:mb-6">
          Uploaded Resumes & AI Feedback
        </h3>

        {resumes.length === 0 && (
          <p className="text-slate-400 text-sm md:text-base">
            No resumes uploaded yet.
          </p>
        )}

        {/* Responsive Resume Grid */}
        <div className="
          grid gap-4 md:gap-5
          grid-cols-1
          xl:grid-cols-2
        ">
          {resumes.map(r => {
            const weak = extractWeakHints(r.suggestions);

            return (
              <div
                key={r.resume_id}
                className="
                  border border-slate-800
                  rounded-lg md:rounded-xl
                  p-4 md:p-5
                  bg-slate-950
                  space-y-3 md:space-y-4
                "
              >

                {/* Resume Header */}
                <div className="
                  flex flex-col sm:flex-row
                  sm:items-start sm:justify-between
                  gap-2
                ">
                  <div className="min-w-0">
                    <div className="
                      text-white font-semibold
                      text-sm md:text-base
                      truncate
                    ">
                      {r.filename}
                    </div>

                    <div className="text-xs md:text-sm text-slate-400">
                      Resume ID: {r.resume_id}
                    </div>
                  </div>

                  <div className="text-xs text-slate-500">
                    {r.uploaded_at?.slice(0, 10)}
                  </div>
                </div>

                {/* Suggestions Preview */}
                {r.suggestions && (
                  <div className="
                    text-sm md:text-base
                    text-slate-300
                    whitespace-pre-wrap
                    line-clamp-4
                  ">
                    {r.suggestions}
                  </div>
                )}

                {/* Weak Areas */}
                {weak.length > 0 && (
                  <div className="
                    bg-amber-900/20 border border-amber-700
                    rounded-lg
                    p-3 md:p-4
                  ">
                    <div className="
                      text-amber-400
                      text-xs md:text-sm
                      font-semibold
                      mb-2
                    ">
                      Improvement Areas Detected
                    </div>

                    <ul className="
                      text-amber-200
                      text-sm md:text-base
                      list-disc ml-5
                      space-y-1
                    ">
                      {weak.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
