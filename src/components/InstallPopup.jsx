import { useEffect, useState } from "react";
import { useInstallPrompt } from "../hooks/useInstallPrompt";

export default function InstallPopup() {
  const { installAvailable, install } = useInstallPrompt();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (installAvailable) {
      setTimeout(() => {
        setVisible(true);
      }, 2000);
    }
  }, [installAvailable]);

  if (!visible || !installAvailable) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50">
      <div className="bg-slate-900 w-full max-w-md rounded-t-2xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-white">
          Install Python Sensei
        </h3>

        <p className="text-sm text-slate-400 mt-2">
          Install the app for a faster and full-screen experience.
        </p>

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => setVisible(false)}
            className="flex-1 py-2 rounded-lg bg-slate-700 text-white"
          >
            Not Now
          </button>

          <button
            onClick={async () => {
              const accepted = await install();
              if (accepted) setVisible(false);
            }}
            className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}