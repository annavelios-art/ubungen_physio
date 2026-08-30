import { useState } from "react";
import { useStore } from "../../store";
import type { Exercise, Page } from "../../types";
import SupabaseExerciseTest from "../../components/SupabaseExerciseTest";

interface Props {
  navigate: (page: Page) => void;
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds} Sek.`;
  return `${Math.floor(seconds / 60)} Min.`;
}

function ExerciseCard({
  exercise,
  selected,
  readOnly = false,
  onToggle,
  onView,
  onEdit,
  onDelete,
}: {
  exercise: Exercise;
  selected: boolean;
  readOnly?: boolean;
  onToggle: () => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      className={`bg-white rounded-2xl border-2 transition-all duration-150 overflow-hidden ${
        selected ? "border-teal-500 shadow-md" : "border-transparent shadow-sm hover:shadow-md"
      }`}
    >
      {/* Thumbnail */}
      <div className="relative">
        <div className="aspect-[4/3] bg-teal-50 overflow-hidden">
          {exercise.thumbnailUrl ? (
            <img
              src={exercise.thumbnailUrl}
              alt={exercise.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-teal-300">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
            </div>
          )}
        </div>
        {/* Selection checkbox / online marker */}
        {readOnly ? (
          <span className="absolute top-2 left-2 rounded-full bg-sky-600 px-2.5 py-1 text-xs font-medium text-white shadow">
            Online
          </span>
        ) : (
          <button
            onClick={onToggle}
            className={`absolute top-2 left-2 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all shadow ${
              selected
                ? "bg-teal-600 border-teal-600 text-white"
                : "bg-white/80 border-white hover:border-teal-400"
            }`}
            title={selected ? "Abwählen" : "Auswählen"}
          >
            {selected && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        )}
        {/* Category badge */}
        <span className="absolute bottom-2 right-2 bg-white/90 text-teal-800 text-xs font-medium px-2 py-0.5 rounded-full">
          {exercise.category}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 text-base leading-tight mb-1">{exercise.title}</h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-3">{exercise.description}</p>

        {/* Meta */}
        <div className="flex flex-wrap gap-2 mb-4 text-xs text-slate-600">
          {exercise.reps && (
            <span className="bg-slate-100 px-2 py-0.5 rounded-full">
              {exercise.sets ? `${exercise.sets}×` : ""}{exercise.reps} Wdh.
            </span>
          )}
          {exercise.holdTime && (
            <span className="bg-slate-100 px-2 py-0.5 rounded-full">
              {formatDuration(exercise.holdTime)} halten
            </span>
          )}
          {exercise.duration && (
            <span className="bg-slate-100 px-2 py-0.5 rounded-full">
              {formatDuration(exercise.duration)}
            </span>
          )}
        </div>

        {/* Actions */}
        {readOnly ? (
          <div className="flex gap-2">
            <button
              onClick={onView}
              className="flex-1 bg-sky-50 text-sky-700 text-sm py-2 rounded-xl font-medium hover:bg-sky-100 transition-colors"
            >
              Ansehen
            </button>
            <button
              onClick={onEdit}
              className="bg-sky-50 p-2 text-sky-700 rounded-xl hover:bg-sky-100 transition-colors"
              title="Online-Übung bearbeiten"
              aria-label={`${exercise.title} in Supabase bearbeiten`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        ) : confirmDelete ? (
          <div className="bg-red-50 rounded-xl p-3">
            <p className="text-sm text-red-700 font-medium mb-2">Übung wirklich löschen?</p>
            <div className="flex gap-2">
              <button
                onClick={onDelete}
                className="flex-1 bg-red-600 text-white text-sm py-1.5 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Löschen
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 bg-white border border-slate-200 text-sm py-1.5 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={onView}
              className="flex-1 bg-teal-50 text-teal-700 text-sm py-2 rounded-xl font-medium hover:bg-teal-100 transition-colors"
            >
              Ansehen
            </button>
            <button
              onClick={onEdit}
              className="bg-slate-100 text-slate-600 p-2 rounded-xl hover:bg-slate-200 transition-colors"
              title="Bearbeiten"
              aria-label={`${exercise.title} bearbeiten`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="bg-slate-100 text-red-400 p-2 rounded-xl hover:bg-red-50 transition-colors"
              title="Löschen"
              aria-label={`${exercise.title} löschen`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ExerciseModal({
  exercise,
  onClose,
}: {
  exercise: Exercise;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Video / Thumbnail */}
        <div className="relative">
          {exercise.videoUrl ? (
            <video
              src={exercise.videoUrl}
              controls
              className="w-full rounded-t-3xl bg-black"
              style={{ maxHeight: "280px" }}
            />
          ) : exercise.thumbnailUrl ? (
            <img
              src={exercise.thumbnailUrl}
              alt={exercise.title}
              className="w-full rounded-t-3xl object-cover"
              style={{ maxHeight: "280px" }}
            />
          ) : (
            <div className="w-full h-48 rounded-t-3xl bg-teal-50 flex items-center justify-center text-teal-300">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-1.5 hover:bg-white transition-colors"
          >
            <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <span className="inline-block bg-teal-100 text-teal-700 text-xs font-medium px-3 py-1 rounded-full mb-3">
            {exercise.category}
          </span>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">{exercise.title}</h2>
          <p className="text-slate-600 mb-4">{exercise.description}</p>

          {/* Meta row */}
          <div className="flex flex-wrap gap-3 mb-5">
            {exercise.reps && (
              <div className="bg-teal-50 rounded-xl px-4 py-2 text-center">
                <div className="text-xl font-bold text-teal-700">
                  {exercise.sets ? `${exercise.sets} × ` : ""}{exercise.reps}
                </div>
                <div className="text-xs text-teal-600">Wiederholungen</div>
              </div>
            )}
            {exercise.holdTime && (
              <div className="bg-teal-50 rounded-xl px-4 py-2 text-center">
                <div className="text-xl font-bold text-teal-700">{exercise.holdTime} Sek.</div>
                <div className="text-xs text-teal-600">Haltezeit</div>
              </div>
            )}
            {exercise.duration && (
              <div className="bg-teal-50 rounded-xl px-4 py-2 text-center">
                <div className="text-xl font-bold text-teal-700">{formatDuration(exercise.duration)}</div>
                <div className="text-xs text-teal-600">Dauer</div>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 mb-2">Durchführung</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{exercise.instructions}</p>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full bg-teal-600 text-white py-3 rounded-xl font-medium hover:bg-teal-700 transition-colors"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Library({ navigate }: Props) {
  const { exercises, categories, deleteExercise, addProgram } = useStore();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterCategory, setFilterCategory] = useState<string>("Alle");
  const [search, setSearch] = useState("");
  const [viewingExercise, setViewingExercise] = useState<Exercise | null>(null);
  const [programName, setProgramName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [onlineExercises, setOnlineExercises] = useState<Exercise[]>([]);

  const allExercises = [
    ...exercises.map((exercise) => ({ exercise, readOnly: false })),
    ...onlineExercises.map((exercise) => ({ exercise, readOnly: true })),
  ];

  const filtered = allExercises.filter(({ exercise: e }) => {
    const matchesCat = filterCategory === "Alle" || e.category === filterCategory;
    const matchesSearch =
      search === "" ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCreateProgram = () => {
    const program = addProgram(Array.from(selectedIds), programName || undefined);
    setCreatedCode(program.accessCode);
    setSelectedIds(new Set());
    setProgramName("");
    setShowCreateModal(false);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div>
      <SupabaseExerciseTest onLoaded={setOnlineExercises} />

      {viewingExercise && (
        <ExerciseModal exercise={viewingExercise} onClose={() => setViewingExercise(null)} />
      )}

      {/* Created code banner */}
      {createdCode && (
        <div className="mb-4 bg-teal-600 text-white rounded-2xl p-4 flex items-center justify-between gap-4">
          <div>
            <div className="font-medium">Programm erstellt!</div>
            <div className="text-teal-100 text-sm">
              Zugangscode für die Patientin / den Patienten:{" "}
              <span className="font-mono font-bold text-white text-lg">{createdCode}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => copyCode(createdCode)}
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              Kopieren
            </button>
            <button
              onClick={() => setCreatedCode(null)}
              className="bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Übungen suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        {selectedIds.size > 0 && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-teal-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-teal-700 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Programm erstellen ({selectedIds.size})
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        {["Alle", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterCategory === cat
                ? "bg-teal-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:border-teal-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Keine Übungen gefunden</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(({ exercise, readOnly }) => (
            <ExerciseCard
              key={`${readOnly ? "online" : "local"}-${exercise.id}`}
              exercise={exercise}
              selected={selectedIds.has(exercise.id)}
              readOnly={readOnly}
              onToggle={() => toggleSelect(exercise.id)}
              onView={() => setViewingExercise(exercise)}
              onEdit={() =>
                navigate(
                  readOnly
                    ? { type: "therapist/edit-online-exercise", exercise }
                    : { type: "therapist/edit-exercise", exerciseId: exercise.id },
                )
              }
              onDelete={() => deleteExercise(exercise.id)}
            />
          ))}
        </div>
      )}

      {/* Create Program Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-1">Programm erstellen</h2>
            <p className="text-sm text-slate-500 mb-5">
              {selectedIds.size} Übung{selectedIds.size !== 1 ? "en" : ""} ausgewählt
            </p>
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Bezeichnung <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="z. B. Morgenroutine HWS, Rücken-Programm ..."
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 border border-slate-200 text-slate-700 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleCreateProgram}
                className="flex-1 bg-teal-600 text-white py-2.5 rounded-xl font-medium hover:bg-teal-700 transition-colors"
              >
                Erstellen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
