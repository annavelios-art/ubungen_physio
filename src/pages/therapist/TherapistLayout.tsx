import type { ReactNode } from "react";
import type { Page } from "../../types";
import SupabaseStatus from "../../components/SupabaseStatus";

interface Props {
  currentPage: string;
  navigate: (page: Page) => void;
  userEmail?: string;
  onSignOut: () => void;
  children: ReactNode;
}

const NAV_ITEMS = [
  {
    id: "therapist/library",
    label: "Bibliothek",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    id: "therapist/programs",
    label: "Programme",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    id: "therapist/new-exercise",
    label: "Neue Online-Übung",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
] as const;

export default function TherapistLayout({ currentPage, navigate, userEmail, onSignOut, children }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("home")}
            className="flex items-center gap-2 text-teal-700 hover:text-teal-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span
              className="text-xl font-medium"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              PhysioApp
            </span>
          </button>

          <div className="flex items-center gap-4">
            <SupabaseStatus />
            <span className="hidden text-sm font-medium text-slate-500 lg:block" title={userEmail}>
              Angemeldet
            </span>
            <button
              type="button"
              onClick={onSignOut}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              Abmelden
            </button>
          </div>
        </div>

        {/* Nav tabs */}
        <div className="max-w-6xl mx-auto px-4 border-t border-slate-100">
          <nav className="flex gap-1 -mb-px overflow-x-auto">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id as Page)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    isActive
                      ? "border-teal-600 text-teal-700"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">{children}</main>
    </div>
  );
}
