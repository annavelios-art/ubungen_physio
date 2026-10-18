import { useEffect, useRef, useState } from "react";
import type { Exercise, Page, PatientProgram } from "../../types";
import LegalLinks from "../../components/LegalLinks";
import { clearPatientSession } from "../../patientSession";

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

/** Das Vorschaubild wird mit derselben Original-URL bildschirmgroß angezeigt. */
function ExerciseImageModal({
  src,
  title,
  onClose,
}: {
  src: string;
  title: string;
  onClose: () => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/90 px-3 pb-5 pt-4 sm:px-8"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Bild zur Übung: ${title}`}
        className="mx-auto flex h-full w-full max-w-6xl flex-col"
      >
        <div className="mb-3 flex min-h-12 items-center justify-between gap-3 text-white">
          <p className="min-w-0 truncate text-base font-semibold sm:text-lg">{title}</p>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Großes Bild schließen"
            className="flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-base font-medium hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-white"
          >
            <span aria-hidden="true">✕</span> Schließen
          </button>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-xl">
          <img
            src={src}
            alt={title}
            className="max-h-full max-w-full object-contain"
            style={{ touchAction: "pinch-zoom" }}
          />
        </div>
      </div>
    </div>
  );
}

function ExerciseItem({ exercise, index }: { exercise: Exercise; index: number }) {
  const [open, setOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const imageButtonRef = useRef<HTMLButtonElement>(null);

  const closeImage = () => {
    setImageOpen(false);
    imageButtonRef.current?.focus();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Überschrift und Bild haben getrennte Klickflächen: Bild = groß, Text = Details. */}
      <div className="flex items-center gap-3 px-4 pt-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-600 text-base font-bold text-white">
          {index + 1}
        </div>

        {exercise.thumbnailUrl && (
          <button
            ref={imageButtonRef}
            type="button"
            onClick={() => setImageOpen(true)}
            aria-label={`Bild vergrößern: ${exercise.title}`}
            title="Bild vergrößern"
            className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-teal-50 focus-visible:outline-2 focus-visible:outline-teal-600"
          >
            <img
              src={exercise.thumbnailUrl}
              alt={exercise.title}
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-tl-lg bg-teal-800/90 text-white" aria-hidden="true">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m16 16 5 5M7.5 10.5h6M10.5 7.5v6" />
              </svg>
            </span>
          </button>
        )}

        <button
          type="button"
          aria-expanded={open}
          onClick={() => {
            if (open) setVideoOpen(false);
            setOpen(!open);
          }}
          className="flex min-h-16 min-w-0 flex-1 items-center gap-3 text-left focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-teal-600"
        >
          <div className="min-w-0 flex-1">
            <div className="text-lg font-semibold leading-tight text-slate-900">{exercise.title}</div>
            <div className="mt-0.5 text-sm text-teal-600">{exercise.category}</div>
          </div>
          <svg
            className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="flex flex-wrap gap-4 px-4 pb-4 pt-3">
        {exercise.reps && (
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <svg className="h-4 w-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {exercise.sets ? `${exercise.sets} × ` : ""}{exercise.reps} Wiederholungen
          </div>
        )}
        {exercise.holdTime && (
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <svg className="h-4 w-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {exercise.holdTime} Sek. halten
          </div>
        )}
        {exercise.duration && (
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <svg className="h-4 w-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatDuration(exercise.duration)}
          </div>
        )}
      </div>

      {/* Expanded content */}
      {open && (
        <div className="border-t border-slate-100">
          {/* Video nur anzeigen, wenn eines vorhanden ist. */}
          {exercise.videoUrl && (
            <div className="px-4 pt-4">
              <button
                type="button"
                onClick={() => setVideoOpen(!videoOpen)}
                aria-expanded={videoOpen}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-base font-semibold text-white hover:bg-teal-700"
              >
                <span aria-hidden="true">{videoOpen ? "▾" : "▶"}</span>
                {videoOpen ? "Video ausblenden" : "Video ansehen"}
              </button>
              {videoOpen && (
                <video
                  src={exercise.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="mt-3 w-full rounded-xl bg-black"
                  style={{ maxHeight: "360px" }}
                />
              )}
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
              onClick={() => {
                setOpen(false);
                setVideoOpen(false);
              }}
              className="w-full border border-slate-200 text-slate-600 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              Einklappen
            </button>
          </div>
        </div>
      )}
      {imageOpen && exercise.thumbnailUrl && (
        <ExerciseImageModal
          src={exercise.thumbnailUrl}
          title={exercise.title}
          onClose={closeImage}
        />
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
              className="font-display text-xl font-medium text-teal-900"
            >
              Ihr Übungsprogramm
            </div>
            <div className="text-xs text-slate-400 font-mono">{code}</div>
          </div>
          <button
            onClick={() => {
              clearPatientSession();
              navigate("patient/access");
            }}
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
          {program.expiresAt && (
            <p className="mt-1 text-sm text-teal-700">
              Zugang gültig bis {new Date(program.expiresAt).toLocaleDateString("de-DE")}
            </p>
          )}
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
        <LegalLinks navigate={navigate} className="mt-5 pb-4" />
      </main>
    </div>
  );
}
