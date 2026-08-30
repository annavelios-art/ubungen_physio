import { useState } from "react";
import type { Exercise } from "../types";
import { fetchPublishedExercises } from "../supabaseClient";

type LoadState = "idle" | "loading" | "success" | "error";

interface Props {
  onLoaded: (exercises: Exercise[]) => void;
}

export default function SupabaseExerciseTest({ onLoaded }: Props) {
  const [state, setState] = useState<LoadState>("idle");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [message, setMessage] = useState("");

  const loadExercises = async () => {
    setState("loading");
    setMessage("");

    try {
      const publishedExercises = await fetchPublishedExercises();
      setExercises(publishedExercises);
      onLoaded(publishedExercises);
      setState("success");
    } catch (error) {
      setExercises([]);
      onLoaded([]);
      setMessage(error instanceof Error ? error.message : "Unbekannter Fehler");
      setState("error");
    }
  };

  return (
    <div className="mb-5 rounded-2xl border border-dashed border-teal-300 bg-teal-50/60 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-medium text-slate-800">Sicherer Supabase-Lesetest</div>
          <p className="text-sm text-slate-500">
            Lädt veröffentlichte Übungen, ohne die lokale Bibliothek zu verändern.
          </p>
        </div>
        <button
          type="button"
          onClick={loadExercises}
          disabled={state === "loading"}
          className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-wait disabled:opacity-60"
        >
          {state === "loading" ? "Wird geladen …" : "Supabase-Test laden"}
        </button>
      </div>

      {state === "success" && (
        <div className="mt-3 rounded-xl bg-white p-3 text-sm text-emerald-700">
          {exercises.length === 0 ? (
            "Keine veröffentlichte Übung gefunden."
          ) : (
            <>
              Gefunden: {exercises.map((exercise) => exercise.title).join(", ")}
              <span className="ml-2 text-slate-400">({exercises.length})</span>
            </>
          )}
        </div>
      )}

      {state === "error" && (
        <div className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          Lesetest fehlgeschlagen: {message}
        </div>
      )}
    </div>
  );
}
