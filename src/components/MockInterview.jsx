import { useState } from "react";
import API from "../api/api";

export default function MockInterview() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);

  const startInterview = async () => {
    const res = await API.post("/generate_interview_session", null, {
      params: {
        resume_id: 1,
        target_role: "Python Developer",
        num_questions: 5,
      },
    });
    setQuestions(res.data.questions);
    setIndex(0);
  };

  return (
    <div className="bg-[#161B22] p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Mock Interview</h2>

      {questions.length === 0 ? (
        <button
          onClick={startInterview}
          className="bg-indigo-600 px-4 py-2 rounded"
        >
          Start Interview
        </button>
      ) : (
        <div>
          <p className="mb-4">{questions[index].question}</p>
          <button
            onClick={() => setIndex(index + 1)}
            className="bg-indigo-600 px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
