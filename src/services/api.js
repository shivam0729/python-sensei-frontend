const API_BASE = "python-sensei-backend-production.up.railway.app";

/* ---------------- AUTH ---------------- */

export async function signupUser(email, password) {
  const params = new URLSearchParams({ email, password }).toString();

  const res = await fetch(`${API_BASE}/signup?${params}`, {
    method: "POST",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Signup failed");
  }

  return res.json();
}

export async function loginUser(email, password) {
  const params = new URLSearchParams({ email, password }).toString();

  const res = await fetch(`${API_BASE}/login?${params}`, {
    method: "POST",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Login failed");
  }

  return res.json();
}

/* ---------------- AUTH HEADER ---------------- */

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
}

/* ---------------- RESUME ---------------- */

export async function fetchResumes() {
  const res = await fetch(`${API_BASE}/my_resumes`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch resumes");
  return res.json();
}

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload_resume`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

/* ---------------- INTERVIEW ---------------- */

export async function startInterview(payload) {
  const params = new URLSearchParams(payload).toString();

  const res = await fetch(
    `${API_BASE}/generate_interview_session?${params}`,
    {
      method: "POST",
      headers: authHeaders(),
    }
  );

  if (!res.ok) throw new Error("Interview start failed");
  return res.json();
}

export async function submitAnswer(payload) {
  const params = new URLSearchParams(payload).toString();

  const res = await fetch(
    `${API_BASE}/interview_answer?${params}`,
    {
      method: "POST",
      headers: authHeaders(),
    }
  );

  if (!res.ok) throw new Error("Answer submit failed");
  return res.json();
}
