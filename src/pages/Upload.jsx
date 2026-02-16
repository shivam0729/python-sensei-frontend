import { useEffect, useState } from "react";
import { uploadResume, fetchResumes } from "../services/api";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [resumes, setResumes] = useState([]);

  /* ---------------- LOAD STORED RESUMES ---------------- */

  async function loadResumes() {
    try {
      const data = await fetchResumes();
      setResumes(data.resumes || []);
    } catch {
      // non-critical
    }
  }

  useEffect(() => {
    loadResumes();
  }, []);

  /* ---------------- UPLOAD ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setStatus("error");
      setMessage("Please select a resume file");
      return;
    }

    try {
      setLoading(true);
      setStatus("idle");
      setMessage("");

      await uploadResume(file);

      setStatus("success");
      setMessage("Resume uploaded and processed successfully ✅");
      setFile(null);

      await loadResumes(); // refresh list
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl md:max-w-3xl xl:max-w-5xl mx-auto space-y-6 md:space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
          Upload Resume
        </h2>
        <p className="text-sm md:text-base text-slate-400 mt-2">
          Upload and manage your resumes
        </p>
      </div>

      {/* Upload Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8">

        <label className="
          block border-2 border-dashed border-slate-700
          rounded-xl
          p-6 md:p-10
          text-center
          cursor-pointer
          hover:border-indigo-500
          transition
        ">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />

          <div className="text-3xl md:text-4xl mb-3">📄</div>

          <p className="text-white font-medium text-sm md:text-base">
            Click to select resume
          </p>

          <p className="text-slate-400 text-xs md:text-sm mt-1">
            PDF or Word files
          </p>
        </label>

        {/* File Preview */}
        {file && (
          <div className="mt-4 text-sm text-slate-300 bg-slate-800 p-3 rounded-lg border border-slate-700">
            Selected: <span className="text-white font-medium">{file.name}</span>
          </div>
        )}

        {/* Status Message */}
        {message && (
          <div
            className={`mt-4 text-sm md:text-base p-3 rounded-lg border
              ${
                status === "success"
                  ? "bg-emerald-900/30 border-emerald-700 text-emerald-300"
                  : "bg-red-900/30 border-red-700 text-red-300"
              }`}
          >
            {message}
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="
            w-full mt-6
            py-3 md:py-3.5
            rounded-lg
            bg-indigo-600 hover:bg-indigo-700
            text-white font-semibold
            text-sm md:text-base
            transition disabled:opacity-60
          "
        >
          {loading ? "Uploading..." : "Upload Resume"}
        </button>
      </div>

      {/* Stored Resume List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8">
        <h3 className="text-white font-semibold text-base md:text-lg mb-4 md:mb-6">
          Your Uploaded Resumes
        </h3>

        {resumes.length === 0 && (
          <p className="text-slate-400 text-sm md:text-base">
            No resumes uploaded yet
          </p>
        )}

        {/* Responsive Resume Grid */}
        <div className="
          grid gap-4 md:gap-5
          grid-cols-1
          lg:grid-cols-2
        ">
          {resumes.map((r) => (
            <div
              key={r.resume_id}
              className="
                border border-slate-800
                rounded-lg md:rounded-xl
                p-4 md:p-5
                bg-slate-950
              "
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="text-white font-medium text-sm md:text-base">
                    {r.filename}
                  </div>
                  <div className="text-xs md:text-sm text-slate-400">
                    Resume ID: {r.resume_id}
                  </div>
                </div>
              </div>

              {/* Suggestions Preview */}
              {r.suggestions && (
                <div className="
                  mt-3
                  text-sm md:text-base
                  text-slate-300
                  whitespace-pre-wrap
                  line-clamp-4
                ">
                  {r.suggestions}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
