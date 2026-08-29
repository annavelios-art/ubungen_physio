import { useState } from "react";
import { useStore } from "../../store";
import type { Program } from "../../types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-AT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Programs() {
  const { programs, exercises, deleteProgram } = useStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const copyCode = (program: Program) => {
    navigator.clipboard.writeText(program.accessCode);
    setCopiedId(program.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getExercises = (program: Program) =>
    program.exerciseIds
      .map((id) => exercises.find((e) => e.id === id))
      .filter(Boolean) as typeof exercises;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Übungsprogramme</h1>
          <p className="text-slate-500 text-sm mt-0.5">{programs.length} Programme erstellt</p>
        </div>
      </div>

      {programs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <svg className="w-14 h-14 mx-auto mb-4 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-slate-400 font-medium mb-1">Noch keine Programme</p>
          <p className="text-slate-400 text-sm">
            Wählen Sie in der Bibliothek Übungen aus und erstellen Sie ein Programm.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...programs].reverse().map((program) => {
            const exs = getExercises(program);
            const isExpanded = expandedId === program.id;
            const isConfirmingDelete = confirmDeleteId === program.id;

            return (
              <div key={program.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {program.name && (
                        <div className="font-semibold text-slate-900 text-base truncate">{program.name}</div>
                      )}
                      <div className="text-sm text-slate-500 mt-0.5">{formatDate(program.createdAt)}</div>
                    </div>

                    {/* Access Code */}
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-xs text-slate-400 mb-0.5">Zugangscode</div>
                        <div className="font-mono font-bold text-teal-700 text-xl tracking-widest">
                          {program.accessCode}
                        </div>
                      </div>
                      <button
                        onClick={() => copyCode(program)}
                        className={`p-2 rounded-xl transition-colors ${
                          copiedId === program.id
                            ? "bg-teal-100 text-teal-600"
                            : "bg-slate-100 text-slate-500 hover:bg-teal-50 hover:text-teal-600"
                        }`}
                        title="Code kopieren"
                      >
                        {copiedId === program.id ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Exercise count + expand */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : program.id)}
                      className="flex items-center gap-2 text-sm text-slate-600 hover:text-teal-700 transition-colors"
                    >
                      <svg className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                      {exs.length} Übung{exs.length !== 1 ? "en" : ""}
                    </button>

                    {isConfirmingDelete ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-red-600 font-medium">Wirklich löschen?</span>
                        <button
                          onClick={() => {
                            deleteProgram(program.id);
                            setConfirmDeleteId(null);
                          }}
                          className="text-sm bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Ja, löschen
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-sm border border-slate-200 px-3 py-1 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          Nein
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(program.id)}
                        className="text-sm text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Löschen
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded exercises */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
                    {exs.length === 0 ? (
                      <p className="text-sm text-slate-400 py-2">Keine Übungen mehr vorhanden.</p>
                    ) : (
                      <ul className="space-y-2">
                        {exs.map((ex) => (
                          <li key={ex.id} className="flex items-center gap-3">
                            {ex.thumbnailUrl ? (
                              <img
                                src={ex.thumbnailUrl}
                                alt={ex.title}
                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-teal-50"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-teal-100 flex-shrink-0" />
                            )}
                            <div>
                              <div className="text-sm font-medium text-slate-800">{ex.title}</div>
                              <div className="text-xs text-slate-400">{ex.category}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
