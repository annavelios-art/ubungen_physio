import { useEffect, useState } from "react";
import type { Exercise, Program } from "../../types";
import { deleteOnlineProgram, fetchOnlineExercises, fetchOnlinePrograms } from "../../supabaseClient";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function Programs() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadPrograms = async () => {
    setLoading(true);
    setError(null);
    try {
      const [nextPrograms, nextExercises] = await Promise.all([
        fetchOnlinePrograms(),
        fetchOnlineExercises(),
      ]);
      setPrograms(nextPrograms);
      setExercises(nextExercises);
    } catch (loadError) {
      setError(loadError instanceof Error
        ? `Programme konnten nicht geladen werden: ${loadError.message}`
        : "Programme konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadPrograms(); }, []);

  const copyCode = async (program: Program) => {
    await navigator.clipboard.writeText(program.accessCode);
    setCopiedId(program.id);
    window.setTimeout(() => setCopiedId(null), 2000);
  };

  const getExercises = (program: Program) =>
    program.exerciseIds
      .map((id) => exercises.find((exercise) => exercise.id === id))
      .filter(Boolean) as Exercise[];

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);
    try {
      await deleteOnlineProgram(id);
      setPrograms((current) => current.filter((program) => program.id !== id));
      setConfirmDeleteId(null);
    } catch (deleteError) {
      setError(deleteError instanceof Error
        ? `Programm konnte nicht gelöscht werden: ${deleteError.message}`
        : "Programm konnte nicht gelöscht werden.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Übungsprogramme</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {loading ? "Programme werden geladen …" : `${programs.length} Online-Programme`}
          </p>
        </div>
        <button type="button" onClick={() => void loadPrograms()} disabled={loading}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60">
          Neu laden
        </button>
      </div>

      {error && <div className="mb-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {!loading && programs.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center">
          <svg className="mx-auto mb-4 h-14 w-14 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="mb-1 font-medium text-slate-400">Noch keine Online-Programme</p>
          <p className="text-sm text-slate-400">Markieren Sie veröffentlichte Online-Übungen in der Bibliothek.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {programs.map((program) => {
            const assignedExercises = getExercises(program);
            const isExpanded = expandedId === program.id;
            const isConfirmingDelete = confirmDeleteId === program.id;
            const isExpired = Boolean(program.expiresAt && new Date(program.expiresAt) < new Date());

            return (
              <div key={program.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-900">Online-Programm</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${program.isActive && !isExpired ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-500"}`}>
                          {isExpired ? "abgelaufen" : program.isActive ? "aktiv" : "inaktiv"}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        Erstellt: {formatDate(program.createdAt)}
                        {program.expiresAt && ` · gültig bis ${formatDate(program.expiresAt)}`}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div>
                        <div className="mb-0.5 text-xs text-slate-400">Zugangscode</div>
                        <div className="break-all font-mono text-lg font-bold tracking-wider text-teal-700">{program.accessCode}</div>
                      </div>
                      <button type="button" onClick={() => void copyCode(program)}
                        className={`rounded-xl p-2 text-sm transition-colors ${copiedId === program.id ? "bg-teal-100 text-teal-600" : "bg-slate-100 text-slate-500 hover:bg-teal-50 hover:text-teal-600"}`}
                        title="Code kopieren">
                        {copiedId === program.id ? "✓" : "Kopieren"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <button type="button" onClick={() => setExpandedId(isExpanded ? null : program.id)}
                      className="text-sm text-slate-600 hover:text-teal-700">
                      {isExpanded ? "▾" : "▸"} {assignedExercises.length} Übung{assignedExercises.length !== 1 ? "en" : ""}
                    </button>

                    {isConfirmingDelete ? (
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <span className="text-sm font-medium text-red-600">Wirklich löschen?</span>
                        <button type="button" onClick={() => void handleDelete(program.id)} disabled={deletingId === program.id}
                          className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-60">
                          {deletingId === program.id ? "Wird gelöscht …" : "Ja, löschen"}
                        </button>
                        <button type="button" onClick={() => setConfirmDeleteId(null)} disabled={deletingId === program.id}
                          className="rounded-lg border border-slate-200 px-3 py-1 text-sm hover:bg-slate-50 disabled:opacity-60">
                          Nein
                        </button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => setConfirmDeleteId(program.id)}
                        className="text-sm text-slate-400 hover:text-red-500">
                        Programm löschen
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
                    {assignedExercises.length === 0 ? (
                      <p className="py-2 text-sm text-slate-400">Keine Übungen mehr vorhanden.</p>
                    ) : (
                      <ul className="space-y-2">
                        {assignedExercises.map((exercise) => (
                          <li key={exercise.id} className="flex items-center gap-3">
                            {exercise.thumbnailUrl ? (
                              <img src={exercise.thumbnailUrl} alt={exercise.title} className="h-10 w-10 flex-shrink-0 rounded-lg bg-teal-50 object-cover" />
                            ) : (
                              <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-teal-100" />
                            )}
                            <div>
                              <div className="text-sm font-medium text-slate-800">{exercise.title}</div>
                              <div className="text-xs text-slate-400">{exercise.category}</div>
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
