export default function Home() {
  return (
    <div className="pt-24 px-6 min-h-screen
                    bg-gradient-to-br
                    from-slate-900 via-slate-800 to-slate-900">

      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold mb-4 text-white">
          AI-Powered Career Coach 🚀
        </h2>

        <p className="text-lg text-slate-300 mb-10">
          Resume analysis, mock interviews, ATS scoring &
          intelligent feedback — all in one platform.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl p-6 shadow-lg
                          bg-slate-800 border border-slate-700
                          text-slate-200">
            📄 Resume Optimization
          </div>

          <div className="rounded-xl p-6 shadow-lg
                          bg-slate-800 border border-slate-700
                          text-slate-200">
            🎤 Mock Interviews
          </div>

          <div className="rounded-xl p-6 shadow-lg
                          bg-slate-800 border border-slate-700
                          text-slate-200">
            📊 AI Scoring & Feedback
          </div>
        </div>
      </div>
    </div>
  );
}
