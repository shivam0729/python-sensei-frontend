import API from "../api/api";

export default function ResumeUpload() {
  const uploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await API.post("/upload_resume", formData);
      alert("Resume uploaded successfully");
      window.location.reload();
    } catch {
      alert("Upload failed");
    }
  };

  return (
    <div className="bg-[#161B22] p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Upload Resume</h2>
      <input
        type="file"
        onChange={uploadResume}
        className="text-sm"
      />
    </div>
  );
}
