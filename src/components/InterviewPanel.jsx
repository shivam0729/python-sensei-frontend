import { useState } from "react";
import api from "../api/client";

export default function InterviewPanel() {
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

  const generateInterview = async () => {
    const resumeId = localStorage.getItem("resume_id");
    if (!resumeId) {
      alert("Please upload a resume first");
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
        `/generate_interview_session?resume_id=${resumeId}&target_role=${encodeURIComponent(
          targetRole
        )}&job_description=${encodeURIComponent(jobDescription)}&num_questions=5`
      );

      setSessionId(response.data.session_id);
      setQuestions(response.data.questions);
    } catch (error) {
      console.error(error);
      alert("Failed to generate interview session");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      alert("Please enter your answer before submitting");
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
    } catch (error) {
      console.error(error);
      alert("Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await api.get(`/interview_summary/${sessionId}`);
      setSummary(response.data);
    } catch (error) {
      console.error("Summary fetch failed", error);
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
    <div style={{ marginTop: "15px" }}>
      {/* Target Setup form */}
      <div className="card" style={{ marginBottom: "25px" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: "700", fontFamily: "var(--font-display)", marginBottom: "8px" }}>
          🎤 AI Mock Interview Setup
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "24px", fontSize: "0.95rem" }}>
          Setup your mock interview session. Our model will generate tailored behavior, scenario, and role-specific interview questions based on your resume.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label htmlFor="targetRole">Target Role</label>
            <input
              id="targetRole"
              type="text"
              placeholder="e.g. Senior Python Developer, Data Scientist"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="jobDesc">Job Description (Optional)</label>
            <textarea
              id="jobDesc"
              rows="5"
              placeholder="Paste job description to tailor interview questions..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              style={{ resize: "vertical" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
          <button
            onClick={generateInterview}
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "8px" }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Session...
              </>
            ) : (
              "Generate Mock Interview"
            )}
          </button>
        </div>
      </div>

      {/* Active Interview Panel */}
      {questions.length > 0 && !summary && (
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <div className="card" style={{ paddingBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ fontWeight: "700", fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="badge badge-primary" style={{ padding: "4px 10px" }}>
                {Math.round(progress)}% Progress
              </span>
            </div>

            {/* Progress bar container */}
            <div style={{ width: "100%", height: "8px", background: "var(--border-color)", borderRadius: "999px", overflow: "hidden", marginBottom: "12px" }}>
              <div 
                style={{ 
                  width: `${progress}%`, 
                  height: "100%", 
                  background: "linear-gradient(90deg, var(--primary), var(--accent))", 
                  borderRadius: "999px", 
                  transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)" 
                }} 
              />
            </div>
          </div>

          {/* Current Question Display */}
          <div className="card" style={{ borderLeft: "4px solid var(--primary)" }}>
            <h3 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--primary)", fontWeight: "700" }}>
              Interview Question
            </h3>
            <p
              style={{
                fontSize: "1.15rem",
                fontWeight: "600",
                color: "var(--text-primary)",
                lineHeight: "1.6",
                marginTop: "8px"
              }}
            >
              {questions[currentQuestion]?.question}
            </p>
          </div>

          {/* User Answer Area */}
          <div className="card">
            <h3 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "12px", fontFamily: "var(--font-display)" }}>
              Your Response
            </h3>
            <textarea
              rows="6"
              placeholder="Structure your answer (use STAR method if behavior-based)..."
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
                  className="btn-success"
                  style={{ padding: "10px 18px", fontSize: "0.9rem" }}
                >
                  {currentQuestion === questions.length - 1 ? "Finish Session" : "Skip/Next"}
                </button>
              </div>

              <button
                onClick={submitAnswer}
                className="btn-primary"
                style={{ padding: "10px 24px", fontSize: "0.9rem" }}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "6px" }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Answer...
                  </>
                ) : (
                  "Submit and Get Feedback"
                )}
              </button>
            </div>
          </div>

          {/* Question AI Feedback Display */}
          {feedback && (
            <div className="card" style={{ borderLeft: "4px solid var(--success)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", fontFamily: "var(--font-display)", margin: 0, color: "var(--text-primary)" }}>
                  AI Response Feedback
                </h3>
              </div>
              <div className="output-markdown">
                {feedback}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Session Summary performance grid */}
      {summary && (
        <div 
          className="card" 
          style={{ 
            marginTop: "15px",
            background: "linear-gradient(135deg, var(--glass-bg), var(--bg-secondary))",
            border: "1.5px solid var(--success)",
            boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.15)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--success-bg)", display: "flex", alignItems: "center", justifyItems: "center", paddingLeft: "8px", color: "var(--success)" }}>
              🏆
            </div>
            <h2 style={{ fontSize: "1.45rem", fontWeight: "800", fontFamily: "var(--font-display)", margin: 0 }}>
              Interview Performance Summary
            </h2>
          </div>

          <p style={{ color: "var(--text-secondary)", marginBottom: "30px", fontSize: "0.95rem" }}>
            Excellent job completing your mock session! Review your performance metrics and answer scores below.
          </p>

          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
              gap: "20px" 
            }}
          >
            <div style={{ padding: "20px", background: "var(--panel-bg)", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase" }}>
                Total Questions
              </span>
              <h1 style={{ fontSize: "2.25rem", fontWeight: "800", marginTop: "10px", color: "var(--text-primary)", background: "none", WebkitTextFillColor: "initial", margin: 0 }}>
                {summary.questions_total}
              </h1>
            </div>

            <div style={{ padding: "20px", background: "var(--panel-bg)", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase" }}>
                Answered
              </span>
              <h1 style={{ fontSize: "2.25rem", fontWeight: "800", marginTop: "10px", color: "var(--text-primary)", background: "none", WebkitTextFillColor: "initial", margin: 0 }}>
                {summary.questions_answered}
              </h1>
            </div>

            <div style={{ padding: "20px", background: "var(--panel-bg)", borderRadius: "16px", border: "1.5px solid rgba(16, 185, 129, 0.3)" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--success-text)", textTransform: "uppercase" }}>
                Average Score
              </span>
              <h1 style={{ fontSize: "2.25rem", fontWeight: "800", marginTop: "10px", color: "var(--success)", background: "none", WebkitTextFillColor: "initial", margin: 0 }}>
                {summary.average_score}/10
              </h1>
            </div>

            <div style={{ padding: "20px", background: "var(--panel-bg)", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase" }}>
                Highest / Lowest
              </span>
              <h1 style={{ fontSize: "2.25rem", fontWeight: "800", marginTop: "10px", color: "var(--text-primary)", background: "none", WebkitTextFillColor: "initial", margin: 0 }}>
                {summary.highest_score} <span style={{ fontSize: "1.2rem", fontWeight: "500", color: "var(--text-secondary)" }}>/</span> {summary.lowest_score}
              </h1>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
