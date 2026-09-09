import { useState } from "react";
import type { Page } from "../../types";
import { isSupabaseConfigured, supabase } from "../../supabaseClient";

interface Props {
  navigate: (page: Page) => void;
}

export default function TherapistLogin({ navigate }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!supabase) {
      setError("Supabase ist nicht eingerichtet.");
      return;
    }

    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (signInError) {
      setError("Anmeldung fehlgeschlagen. Bitte E-Mail-Adresse und Passwort prüfen.");
      return;
    }

    navigate("therapist/library");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <button
          type="button"
          onClick={() => navigate("home")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-900"
        >
          <span aria-hidden="true">←</span>
          Zur Startseite
        </button>

        <div className="rounded-3xl border border-teal-100 bg-white p-7 shadow-sm sm:p-9">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h1 className="mb-2 text-2xl font-semibold text-slate-900">Therapeutinnen-Anmeldung</h1>
          <p className="mb-6 text-sm leading-relaxed text-slate-500">
            Der Verwaltungsbereich ist nur für angemeldete Therapeutinnen und Therapeuten zugänglich.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="therapist-email" className="mb-1.5 block text-sm font-medium text-slate-700">
                E-Mail-Adresse
              </label>
              <input
                id="therapist-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div>
              <label htmlFor="therapist-password" className="mb-1.5 block text-sm font-medium text-slate-700">
                Passwort
              </label>
              <input
                id="therapist-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <button
              type="submit"
              disabled={loading || !isSupabaseConfigured}
              className="w-full rounded-xl bg-teal-600 py-3 font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Anmeldung läuft …" : "Anmelden"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
