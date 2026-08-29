import { useState } from "react";
import { useStore } from "../../store";
import type { Page } from "../../types";

interface Props {
  navigate: (page: Page) => void;
  onBack: () => void;
}

export default function PatientAccess({ navigate, onBack }: Props) {
  const { getProgramByCode } = useStore();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError("Bitte geben Sie Ihren Zugangscode ein.");
      return;
    }
    const program = getProgramByCode(trimmed);
    if (!program) {
      setError("Dieser Code wurde nicht gefunden. Bitte prüfen Sie Ihren Zugangscode.");
      return;
    }
    navigate({ type: "patient/view", code: trimmed });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex flex-col items-center justify-center px-4">
      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-teal-700 hover:text-teal-900 transition-colors text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Zurück
      </button>

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-teal-600 mx-auto mb-5 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1
            className="text-3xl text-teal-900 mb-2"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Mein Übungsprogramm
          </h1>
          <p className="text-slate-500 text-base leading-relaxed">
            Geben Sie den Zugangscode ein, den Sie von Ihrer Therapeutin oder Ihrem Therapeuten erhalten haben.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-7 shadow-sm border border-teal-100">
          <div className="mb-5">
            <label className="block text-base font-medium text-slate-700 mb-2">
              Zugangscode
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError("");
              }}
              placeholder="z. B. AB1C2D"
              maxLength={10}
              className={`w-full px-5 py-4 text-2xl font-mono font-bold tracking-widest text-center border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors ${
                error ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50"
              }`}
              autoCapitalize="characters"
              autoComplete="off"
            />
            {error && (
              <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-4 rounded-2xl text-lg font-semibold hover:bg-teal-700 active:scale-[0.98] transition-all"
          >
            Meine Übungen anzeigen
          </button>
        </form>
      </div>
    </div>
  );
}
