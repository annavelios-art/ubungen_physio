import LegalLinks from "../components/LegalLinks";
import type { Page } from "../types";

interface Props {
  navigate: (page: Page) => void
  onTherapist: () => void
  onPatient: () => void
}

export default function Home({ navigate, onTherapist, onPatient }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex flex-col">
      {/* Header */}
      <header className="px-6 pt-10 pb-4 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="text-3xl">o</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-teal-900 mb-2">
          Physiooptima Übungen
        </h1>
        <p className="text-lg text-teal-700 font-light max-w-md mx-auto">
          Individuelle Übungsprogramme für Ihre Patientinnen und Patienten
        </p>
      </header>

      {/* Cards */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* Therapist Card */}
          <button
            onClick={onTherapist}
            className="group bg-white rounded-3xl p-8 shadow-sm border border-teal-100 hover:shadow-lg hover:border-teal-300 hover:-translate-y-1 transition-all duration-200 text-left cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-200">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-teal-900 mb-2">
              Therapeutin / Therapeut
            </h2>
            <p className="text-slate-500 leading-relaxed">
              Übungen verwalten, Programme zusammenstellen und Zugangscodes
              generieren.
            </p>
            <div className="mt-6 flex items-center gap-2 text-teal-600 font-medium">
              <span>Zur Verwaltung</span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>

          {/* Patient Card */}
          <button
            onClick={onPatient}
            className="group bg-teal-700 rounded-3xl p-8 shadow-sm border border-teal-600 hover:shadow-lg hover:bg-teal-800 hover:-translate-y-1 transition-all duration-200 text-left cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-teal-500 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-200">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Patientin / Patient
            </h2>
            <p className="text-teal-200 leading-relaxed">
              Zugangscode eingeben und das persönliche Übungsprogramm anzeigen.
            </p>
            <p className="mt-3 text-sm text-teal-100">
              6 Monate Zugang: 24 € · einmalige Zahlung · keine automatische
              Verlängerung
            </p>
            <div className="mt-6 flex items-center gap-2 text-teal-300 font-medium">
              <span>Zum Übungsprogramm</span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        </div>
      </main>

      <footer className="px-4 pb-8">
        <LegalLinks navigate={navigate} />
      </footer>
    </div>
  )
}
