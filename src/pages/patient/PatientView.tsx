import { useState } from "react";
import type { Exercise, Page, PatientProgram } from "../../types";

interface Props {
  code: string;
  program: PatientProgram;
  navigate: (page: Page) => void;
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds} Sekunden`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m} Min. ${s} Sek.` : `${m} Minuten`;
}

function ExerciseItem({ exercise, index }: { exercise: Exercise; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Thumbnail / header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left"
      >
        <div className="flex items-center gap-4 p-4">
          {/* Number */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-base">
            {index + 1}
          </div>

          {/* Thumbnail */}
          {exercise.thumbnailUrl && (
            <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-teal-50">
              <img
                src={exercise.thumbnailUrl}
                alt={exercise.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title + category */}
          <div className="flex-1 min-w-0">
            <div className="text-lg font-semibold text-slate-900 leading-tight">{exercise.title}</div>
            <div className="text-sm text-teal-600 mt-0.5">{exercise.category}</div>
          </div>

          {/* Expand icon */}
          <svg
            className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Meta bar */}
        <div className="flex gap-4 px-4 pb-4 flex-wrap">
          {exercise.reps && (
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {exercise.sets ? `${exercise.sets} × ` : ""}{exercise.reps} Wiederholungen
            </div>
          )}
          {exercise.holdTime && (
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {exercise.holdTime} Sek. halten
            </div>
          )}
          {exercise.duration && (
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDuration(exercise.duration)}
            </div>
          )}
        </div>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="border-t border-slate-100">
          {/* Video */}
          {exercise.videoUrl && (
            <div className="bg-black">
              <video
                src={exercise.videoUrl}
                controls
                playsInline
                className="w-full"
                style={{ maxHeight: "320px" }}
              />
            </div>
          )}

          <div className="p-5 space-y-5">
            {/* Description */}
            <div>
              <h3 className="text-base font-semibold text-slate-700 mb-1.5">Beschreibung</h3>
              <p className="text-slate-600 leading-relaxed text-base">{exercise.description}</p>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-base font-semibold text-slate-700 mb-1.5">Anleitung</h3>
              <p className="text-slate-600 leading-relaxed text-base whitespace-pre-line">{exercise.instructions}</p>
            </div>

            {/* Big meta for older users */}
            {(exercise.reps || exercise.holdTime || exercise.duration) && (
              <div className="bg-teal-50 rounded-2xl p-4">
                <h3 className="text-base font-semibold text-teal-800 mb-3">Dosierung</h3>
                <div className="flex flex-wrap gap-4">
                  {exercise.reps && (
                    <div>
                      <div className="text-3xl font-bold text-teal-700">
                        {exercise.sets ? `${exercise.sets} × ${exercise.reps}` : exercise.reps}
                      </div>
                      <div className="text-sm text-teal-600">Wiederholungen</div>
                    </div>
                  )}
                  {exercise.holdTime && (
                    <div>
                      <div className="text-3xl font-bold text-teal-700">{exercise.holdTime}<span className="text-lg"> Sek.</span></div>
                      <div className="text-sm text-teal-600">Haltezeit</div>
                    </div>
                  )}
                  {exercise.duration && (
                    <div>
                      <div className="text-3xl font-bold text-teal-700">{formatDuration(exercise.duration)}</div>
                      <div className="text-sm text-teal-600">Gesamtdauer</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={() => setOpen(false)}
              className="w-full border border-slate-200 text-slate-600 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              Einklappen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PatientView({ code, program, navigate }: Props) {
  const programExercises = program.exercises;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <div
              className="text-xl font-medium text-teal-900"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Ihr Übungsprogramm
            </div>
            <div className="text-xs text-slate-400 font-mono">{code}</div>
          </div>
          <button
            onClick={() => navigate("patient/access")}
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Abmelden
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-5">
          <p className="text-slate-500 text-sm">
            {programExercises.length} Übung{programExercises.length !== 1 ? "en" : ""} in Ihrem Programm
          </p>
        </div>

        {programExercises.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            Keine Übungen in diesem Programm.
          </div>
        ) : (
          <div className="space-y-3">
            {programExercises.map((exercise, i) => (
              <ExerciseItem key={exercise.id} exercise={exercise} index={i} />
            ))}
          </div>
        )}

        <p className="text-center text-xs text-slate-300 mt-8">
          Bei Beschwerden wenden Sie sich bitte an Ihre Therapeutin / Ihren Therapeuten.
        </p>
      </main>
    </div>
  );
}
