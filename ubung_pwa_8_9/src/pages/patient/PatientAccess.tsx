import { useState } from "react";
import { fetchPatientProgramByCode } from "../../supabaseClient";
import type { Page } from "../../types";
import LegalLinks from "../../components/LegalLinks";

interface Props {
  navigate: (page: Page) => void;
  onBack: () => void;
}

export default function PatientAccess({ navigate, onBack }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const formatCode = (value: string) => {
    const normalized = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (normalized.length <= 10) {
      const shortened = normalized.slice(0, 10);
      return shortened.length > 5
        ? `${shortened.slice(0, 5)}-${shortened.slice(5)}`
        : shortened;
    }
    return normalized.slice(0, 32);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = code.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (normalized.length < 10) {
      setError("Bitte geben Sie Ihren Zugangscode ein.");
      return;
    }

    setChecking(true);
    setError("");
    try {
      const program = await fetchPatientProgramByCode(code);
      if (!program) {
        setError("Dieser Code ist ungültig oder nicht mehr aktiv. Bitte prüfen Sie Ihre Eingabe.");
        return;
      }
      navigate({ type: "patient/view", code, program });
    } catch {
      setError("Das Programm konnte gerade nicht geladen werden. Bitte versuchen Sie es erneut.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex flex-col items-center justify-center px-4 py-24">
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
          <h1 className="font-display text-3xl text-teal-900 mb-2">
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
                setCode(formatCode(e.target.value));
                setError("");
              }}
              placeholder="z. B. K7M4P-9QX2R"
              maxLength={32}
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
            disabled={checking}
            className="w-full bg-teal-600 text-white py-4 rounded-2xl text-lg font-semibold hover:bg-teal-700 active:scale-[0.98] transition-all disabled:cursor-wait disabled:opacity-60"
          >
            {checking ? "Programm wird geladen …" : "Meine Übungen anzeigen"}
          </button>
        </form>
      </div>
      <footer className="absolute bottom-6 left-4 right-4">
        <LegalLinks navigate={navigate} />
      </footer>
    </div>
  );
}
