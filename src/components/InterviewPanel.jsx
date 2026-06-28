import { useState, useEffect } from "react";
import api from "../api/client";
import { useToast } from "../context/ToastContext";

export default function InterviewPanel() {
  const { showSuccess, showError } = useToast();

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [summary, setSummary] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await api.get("/my_resumes");
      if (response.data && response.data.resumes) {
        setResumes(response.data.resumes);
        const activeId = localStorage.getItem("resume_id");
        if (activeId && response.data.resumes.some(r => String(r.resume_id) === String(activeId))) {
          setSelectedResumeId(activeId);
        } else if (response.data.resumes.length > 0) {
          setSelectedResumeId(response.data.resumes[0].resume_id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const generateInterview = async () => {
    if (!selectedResumeId) {
      showError("Please upload or select a resume first");
      return;
    }
    if (!targetRole.trim()) {
      showError("Please enter a target role to practice");
      return;
    }

    try {
      setLoading(true);
      setSessionId(null);
      setQuestions([]);
      setCurrentQuestion(0);
      setAnswer("");
      setFeedback("");
      setSummary(null);

      const response = await api.post(
        `/generate_interview_session?resume_id=${selectedResumeId}&target_role=${encodeURIComponent(
          targetRole
        )}&job_description=${encodeURIComponent(jobDescription)}&num_questions=5`
      );

      setSessionId(response.data.session_id);
      setQuestions(response.data.questions);
      showSuccess("Interview session generated successfully!");
    } catch (error) {
      console.error(error);
      showError("Failed to generate mock interview questions");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      showError("Please enter your answer response before submitting");
      return;
    }

    try {
      setSubmitting(true);
      setFeedback("");
      const response = await api.post(
        `/interview_answer?session_id=${sessionId}&question_index=${currentQuestion}&answer=${encodeURIComponent(
          answer
        )}`
      );
      setFeedback(response.data.feedback);
      showSuccess("Feedback generated for your answer");
    } catch (error) {
      console.error(error);
      showError("Failed to submit answer and parse feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await api.get(`/interview_summary/${sessionId}`);
      setSummary(response.data);
      showSuccess("Finished! Profile history logs have been updated.");
    } catch (error) {
      console.error("Summary fetch failed", error);
      showError("Failed to retrieve interview session performance summary");
    }
  };

  const nextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer("");
      setFeedback("");
    } else {
      await fetchSummary();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswer("");
      setFeedback("");
    }
  };

  const progress =
    questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  return (
    <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "25px" }}>
      {/* Session config setup */}
      <div className="card">
        <h2 style={{ fontSize: "1.3rem", fontWeight: "700", fontFamily: "var(--font-display)", marginBottom: "8px" }}>
          🎤 practice AI Mock Interview
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: "0.95rem" }}>
          Participate in a dynamic 5-question role-specific mock interview session based on your experiences and selected resume draft.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label htmlFor="resume-select">Select Target Resume</label>
            {resumes.length === 0 ? (
              <div className="alert alert-warning" style={{ margin: 0 }}>
                <span>⚠️ No uploaded resumes found. Go to "Resume" tab to upload PDF first.</span>
              </div>
            ) : (
              <select
                id="resume-select"
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "12px" }}
              >
                {resumes.map((r) => (
                  <option key={r.resume_id} value={r.resume_id}>
                    {r.filename} ({formatDate(r.uploaded_at)})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
            <div>
              <label htmlFor="targetRole">Target Role / Designation</label>
              <input
                id="targetRole"
                type="text"
                placeholder="e.g. Lead Software Engineer, Business Analyst"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="jobDesc">Job Description Requirements (Optional)</label>
              <textarea
                id="jobDesc"
                rows="4"
                placeholder="Paste the targeted job posting details to optimize scenarios..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                style={{ resize: "vertical" }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
          <button
            onClick={generateInterview}
            className="btn-primary"
            disabled={loading || resumes.length === 0}
            style={{ minHeight: "44px" }}
          >
            {loading ? "Generating Session..." : "Start Practice Session"}
          </button>
        </div>
      </div>

      {/* Questions progress dialog logs */}
      {questions.length > 0 && !summary && (
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          {/* Progress Header */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontWeight: "700", fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="badge badge-primary" style={{ padding: "6px 12px", fontWeight: "700" }}>
                {Math.round(progress)}% Complete
              </span>
            </div>

            <div style={{ width: "100%", height: "8px", background: "var(--border-color)", borderRadius: "99px", overflow: "hidden" }}>
              <div 
                style={{ 
                  width: `${progress}%`, 
                  height: "100%", 
                  background: "linear-gradient(90deg, var(--primary), var(--accent))", 
                  transition: "width 0.4s ease" 
                }} 
              />
            </div>
          </div>

          {/* Prompt card */}
          <div className="card" style={{ borderLeft: "4px solid var(--primary)" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: "800", textTransform: "uppercase", color: "var(--primary)", letterSpacing: "0.05em" }}>
              Interview Question
            </span>
            <p style={{ fontSize: "1.15rem", fontWeight: "600", color: "var(--text-primary)", marginTop: "6px", margin: "6px 0 0 0", lineHeight: "1.6" }}>
              {questions[currentQuestion]?.question}
            </p>
          </div>

          {/* Response text area */}
          <div className="card">
            <label htmlFor="userAns" style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "12px" }}>
              Type Your Answer Response
            </label>
            <textarea
              id="userAns"
              rows="6"
              placeholder="Formulate your response (we recommend the STAR structure: Situation, Task, Action, Result)..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              style={{ resize: "vertical", marginBottom: "20px" }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={previousQuestion}
                  disabled={currentQuestion === 0}
                  className="btn-secondary"
                  style={{ padding: "10px 18px", fontSize: "0.9rem" }}
                >
                  Previous
                </button>
                <button
                  onClick={nextQuestion}
                  className="btn-secondary"
                  style={{ padding: "10px 18px", fontSize: "0.9rem", color: "var(--text-secondary)" }}
                >
                  {currentQuestion === questions.length - 1 ? "Finish Interview" : "Skip / Next"}
                </button>
              </div>

              <button
                onClick={submitAnswer}
                className="btn-primary"
                style={{ padding: "10px 24px", fontSize: "0.9rem" }}
                disabled={submitting}
              >
                {submitting ? "Analyzing..." : "Submit Answer"}
              </button>
            </div>
          </div>

          {/* AI Instant Feedbacks */}
          {feedback && (
            <div className="card" style={{ borderLeft: "4px solid var(--success)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <span style={{ fontSize: "1.2rem" }}>💡</span>
                <h3 style={{ fontSize: "1.05rem", fontWeight: "800", margin: 0, color: "var(--text-primary)" }}>
                  AI Performance Assessment
                </h3>
              </div>
              <div 
                style={{ 
                  background: "var(--panel-bg)", 
                  padding: "16px 20px", 
                  borderRadius: "12px", 
                  lineHeight: "1.6",
                  color: "var(--text-primary)",
                  fontSize: "0.95rem"
                }}
              >
                {feedback}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Summary Score Card details */}
      {summary && (
        <div 
          className="card"
          style={{ 
            border: "1.5px solid var(--success)",
            background: "linear-gradient(135deg, var(--bg-secondary), var(--panel-bg))"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <span style={{ fontSize: "1.8rem" }}>🏆</span>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "850", fontFamily: "var(--font-display)", margin: 0 }}>
              Interview session Report Card
            </h2>
          </div>

          <p style={{ color: "var(--text-secondary)", marginBottom: "24px", fontSize: "0.92rem" }}>
            Great effort practicing your responses! Review your score metric details below.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
            <div style={{ background: "var(--panel-bg)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: "600", textTransform: "uppercase" }}>Total Questions</span>
              <h1 style={{ fontSize: "2rem", margin: "6px 0 0 0", color: "var(--text-primary)", background: "none", WebkitTextFillColor: "initial" }}>
                {summary.questions_total}
              </h1>
            </div>

            <div style={{ background: "var(--panel-bg)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: "600", textTransform: "uppercase" }}>Answered</span>
              <h1 style={{ fontSize: "2rem", margin: "6px 0 0 0", color: "var(--text-primary)", background: "none", WebkitTextFillColor: "initial" }}>
                {summary.questions_answered}
              </h1>
            </div>

            <div style={{ background: "var(--panel-bg)", padding: "16px", borderRadius: "12px", border: "1.5px solid rgba(16, 185, 129, 0.3)" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--success-text)", fontWeight: "600", textTransform: "uppercase" }}>Average Score</span>
              <h1 style={{ fontSize: "2rem", margin: "6px 0 0 0", color: "var(--success)", background: "none", WebkitTextFillColor: "initial" }}>
                {summary.average_score}/10
              </h1>
            </div>

            <div style={{ background: "var(--panel-bg)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: "600", textTransform: "uppercase" }}>High / Low Score</span>
              <h1 style={{ fontSize: "2rem", margin: "6px 0 0 0", color: "var(--text-primary)", background: "none", WebkitTextFillColor: "initial" }}>
                {summary.highest_score} / {summary.lowest_score}
              </h1>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Local format date utility
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
};
