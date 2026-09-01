import { useState } from "react";
import type { Exercise } from "../types";
import { fetchOnlineExercises } from "../supabaseClient";

type LoadState = "idle" | "loading" | "success" | "error";

interface Props {
  exercises: Exercise[];
  onLoaded: (exercises: Exercise[]) => void;
}

export default function SupabaseExerciseTest({ exercises, onLoaded }: Props) {
  const [state, setState] = useState<LoadState>("idle");
  const [message, setMessage] = useState("");

  const loadExercises = async () => {
    setState("loading");
    setMessage("");

    try {
      const onlineExercises = await fetchOnlineExercises();
      onLoaded(onlineExercises);
      setState("success");
    } catch (error) {
      onLoaded([]);
      setMessage(error instanceof Error ? error.message : "Unbekannter Fehler");
      setState("error");
    }
  };

  return (
    <div className="mb-5 rounded-2xl border border-dashed border-teal-300 bg-teal-50/60 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-medium text-slate-800">Online-Übungen</div>
          <p className="text-sm text-slate-500">
            Lädt deine veröffentlichten Übungen und Entwürfe aus Supabase.
          </p>
        </div>
        <button
          type="button"
          onClick={loadExercises}
          disabled={state === "loading"}
          className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-wait disabled:opacity-60"
        >
          {state === "loading" ? "Wird geladen …" : "Online-Übungen laden"}
        </button>
      </div>

      {state === "success" && (
        <div className="mt-3 rounded-xl bg-white p-3 text-sm text-emerald-700">
          {exercises.length === 0 ? (
            "Noch keine Online-Übung gefunden."
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
          Laden fehlgeschlagen: {message}
        </div>
      )}
    </div>
  );
}
