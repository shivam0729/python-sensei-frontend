import { useEffect, useState } from "react";
import API from "../api/api";

export default function ResumeList() {
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    API.get("/my_resumes").then((res) => {
      setResumes(res.data.resumes || []);
    });
  }, []);

  return (
    <div className="bg-[#161B22] p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">My Resumes</h2>

      {resumes.length === 0 && <p>No resumes uploaded</p>}

      {resumes.map((r) => (
        <div key={r.resume_id} className="border-b border-gray-700 py-3">
          <p className="font-medium">{r.filename}</p>
          <p className="text-sm text-gray-400">{r.uploaded_at}</p>
        </div>
      ))}
    </div>
  );
}
