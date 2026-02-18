import { useNavigate } from "react-router-dom";
import resume_upload from "../assets/resume_upload.png";
import ai_mock_interview from "../assets/ai_mock_interview.png";
import profile_activity from "../assets/profile_activity.png";

export default function Dashboard() {
  const navigate = useNavigate();

  const FeatureCard = ({ title, desc, image, to }) => (
    <div
      onClick={() => navigate(to)}
      className="
        group cursor-pointer
        rounded-xl md:rounded-2xl
        overflow-hidden
        border border-slate-800
        bg-slate-900
        hover:scale-[1.02]
        transition shadow-md
      "
    >
      {/* Responsive Image */}
      <div className="aspect-[16/9] w-full overflow-hidden bg-slate-800">
        <img
          src={image}
          alt={title}
          className="
            w-full h-full
            object-cover object-center
            group-hover:scale-105
            transition duration-300
          "
        />
      </div>

      {/* Card Content */}
      <div className="p-4 md:p-5 lg:p-6">
        <h3 className="
          text-base md:text-lg
          font-semibold text-white
          group-hover:text-indigo-400
          transition
        ">
          {title}
        </h3>

        <p className="text-sm md:text-base text-slate-400 mt-1.5">
          {desc}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
          Welcome to Sensei
        </h2>

        <p className="text-sm md:text-base text-slate-400 mt-2">
          AI Resume Analyzer & Mock Interview Platform
        </p>
      </div>

      {/* Responsive Grid */}
      <div className="
        grid gap-4 md:gap-6
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-3
      ">
        <FeatureCard
          title="Resume Upload & Analysis"
          desc="Upload your resume and get AI-powered suggestions"
          image={resume_upload}
          to="/upload"
        />

        <FeatureCard
          title="AI Mock Interview"
          desc="Practice with dynamic AI interview questions"
          image={ai_mock_interview}
          to="/interview"
        />

        <FeatureCard
          title="Profile & Activity"
          desc="View your account and session details"
          image={profile_activity}
          to="/profile"
        />
      </div>

      {/* Responsive CTA Banner */}
      <div className="
        rounded-xl md:rounded-2xl
        border border-slate-800
        bg-slate-900
        p-4 md:p-6 lg:p-8
        flex flex-col md:flex-row
        md:items-center md:justify-between
        gap-4
      ">
        <div>
          <h3 className="text-white font-semibold text-base md:text-lg">
            Ready to improve your interview performance?
          </h3>

          <p className="text-slate-400 text-sm md:text-base mt-1.5">
            Upload your resume and start your AI mock interview now.
          </p>
        </div>

        <button
          onClick={() => navigate("/upload")}
          className="
            w-full md:w-auto
            bg-indigo-600 hover:bg-indigo-700
            text-white
            px-5 py-3
            rounded-lg
            font-semibold
            transition
          "
        >
          Get Started
        </button>
      </div>

    </div>
  );
}
