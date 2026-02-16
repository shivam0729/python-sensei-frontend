import { useEffect, useState } from "react";
import { startInterview, submitAnswer, fetchResumes } from "../services/api";

export default function Interview() {
  const [resumes, setResumes] = useState([]);
  const [resumeId, setResumeId] = useState("");
  const [role, setRole] = useState("");
  const [count, setCount] = useState(5);

  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);

  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD RESUMES ---------------- */

  useEffect(() => {
    loadResumes();
  }, []);

  async function loadResumes() {
    try {
      const data = await fetchResumes();
      setResumes(data.resumes || []);
    } catch {
      // non-critical
    }
  }

  /* ---------------- START INTERVIEW ---------------- */

  async function handleStart() {
    if (!resumeId) {
      alert("Please select a resume");
      return;
    }

    try {
      setLoading(true);

      const data = await startInterview({
        resume_id: resumeId,
        target_role: role || "General",
        num_questions: count,
      });

      setSessionId(data.session_id);
      setQuestions(data.questions || []);
      setCurrent(0);
      setFeedback("");

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- SUBMIT ANSWER ---------------- */

  async function handleSubmitAnswer() {
    if (!answer) return;

    try {
      setLoading(true);

      const res = await submitAnswer({
        session_id: sessionId,
        question_index: current,
        answer: answer,
      });

      setFeedback(res.feedback || "Feedback received");
      setAnswer("");

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  const nextQuestion = () => {
    setFeedback("");
    setCurrent((c) => c + 1);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-xl md:max-w-3xl xl:max-w-4xl mx-auto space-y-6 md:space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
          Mock Interview
        </h2>

        <p className="text-sm md:text-base text-slate-400 mt-2">
          Practice with AI-generated interview questions
        </p>
      </div>

      {/* Setup Card */}
      {!sessionId && (
        <div className="
          bg-slate-900 border border-slate-800
          rounded-xl md:rounded-2xl
          p-4 md:p-6 lg:p-8
          space-y-4 md:space-y-5
        ">

          {/* Resume Selector */}
          <select
            value={resumeId}
            onChange={(e) => setResumeId(e.target.value)}
            className="
              w-full
              p-3 md:p-3.5
              rounded-lg
              bg-slate-950 border border-slate-700
              text-white
              text-sm md:text-base
            "
          >
            <option value="">Select Resume</option>
            {resumes.map((r) => (
              <option key={r.resume_id} value={r.resume_id}>
                {r.filename} (ID: {r.resume_id})
              </option>
            ))}
          </select>

          <input
            placeholder="Target Role (optional)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="
              w-full p-3 md:p-3.5
              rounded-lg
              bg-slate-950 border border-slate-700
              text-white
              text-sm md:text-base
            "
          />

          <input
            type="number"
            min={3}
            max={15}
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="
              w-full p-3 md:p-3.5
              rounded-lg
              bg-slate-950 border border-slate-700
              text-white
              text-sm md:text-base
            "
          />

          <button
            onClick={handleStart}
            disabled={loading}
            className="
              w-full
              py-3 md:py-3.5
              rounded-lg
              bg-indigo-600 hover:bg-indigo-700
              text-white font-semibold
              text-sm md:text-base
              transition disabled:opacity-60
            "
          >
            {loading ? "Generating Questions..." : "Start Interview"}
          </button>

        </div>
      )}

      {/* Interview Session Card */}
      {sessionId && questions[current] && (
        <div className="
          bg-slate-900 border border-slate-800
          rounded-xl md:rounded-2xl
          p-4 md:p-6 lg:p-8
          space-y-5 md:space-y-6
        ">

          <div className="text-xs md:text-sm text-slate-400">
            Question {current + 1} of {questions.length}
          </div>

          <div className="text-white text-base md:text-lg lg:text-xl font-medium leading-relaxed">
            {questions[current].question}
          </div>

          <textarea
            rows={5}
            placeholder="Type your answer..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="
              w-full
              p-3 md:p-4
              rounded-lg
              bg-slate-950 border border-slate-700
              text-white
              text-sm md:text-base
              resize-none md:resize-y
            "
          />

          <button
            onClick={handleSubmitAnswer}
            disabled={loading}
            className="
              w-full
              py-3 md:py-3.5
              rounded-lg
              bg-emerald-600 hover:bg-emerald-700
              text-white font-semibold
              text-sm md:text-base
              transition disabled:opacity-60
            "
          >
            Submit Answer
          </button>

          {/* Feedback */}
          {feedback && (
            <div className="
              bg-indigo-900/30 border border-indigo-700
              rounded-xl
              p-4 md:p-5
              text-indigo-200
              text-sm md:text-base
              whitespace-pre-wrap
            ">
              {feedback}
            </div>
          )}

          {/* Next Button */}
          {feedback && current < questions.length - 1 && (
            <button
              onClick={nextQuestion}
              className="
                w-full
                py-3 md:py-3.5
                rounded-lg
                bg-slate-700 hover:bg-slate-600
                text-white
                text-sm md:text-base
              "
            >
              Next Question →
            </button>
          )}

          {/* Complete */}
          {current === questions.length - 1 && feedback && (
            <div className="text-center text-emerald-400 font-semibold text-sm md:text-base">
              Interview Complete ✅
            </div>
          )}

        </div>
      )}

    </div>
  );
}
