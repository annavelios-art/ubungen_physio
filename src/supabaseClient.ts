import { createClient } from "@supabase/supabase-js";
import type { Exercise } from "./types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null;

export async function testSupabaseConnection(): Promise<boolean> {
  if (!supabaseUrl || !supabasePublishableKey) return false;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/health`, {
      headers: { apikey: supabasePublishableKey },
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timeout);
  }
}

interface ExerciseRow {
  id: string;
  title: string;
  category: string;
  description: string;
  instructions: string;
  reps: number | null;
  sets: number | null;
  duration: number | null;
  hold_time: number | null;
  thumbnail_url: string | null;
  video_url: string | null;
  is_custom: boolean;
  created_at: string;
}

export async function fetchPublishedExercises(): Promise<Exercise[]> {
  if (!supabase) throw new Error("Supabase ist nicht eingerichtet.");

  const { data, error } = await supabase
    .from("exercises")
    .select(
      "id, title, category, description, instructions, reps, sets, duration, hold_time, thumbnail_url, video_url, is_custom, created_at",
    )
    .eq("is_published", true)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return ((data ?? []) as ExerciseRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    instructions: row.instructions,
    reps: row.reps ?? undefined,
    sets: row.sets ?? undefined,
    duration: row.duration ?? undefined,
    holdTime: row.hold_time ?? undefined,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    videoUrl: row.video_url ?? undefined,
    isCustom: row.is_custom,
    createdAt: row.created_at,
  }));
}

export async function updateOnlineExercise(
  id: string,
  exercise: Omit<Exercise, "id" | "createdAt">,
): Promise<void> {
  if (!supabase) throw new Error("Supabase ist nicht eingerichtet.");

  const { data, error } = await supabase
    .from("exercises")
    .update({
      title: exercise.title,
      category: exercise.category,
      description: exercise.description,
      instructions: exercise.instructions,
      reps: exercise.reps ?? null,
      sets: exercise.sets ?? null,
      duration: exercise.duration ?? null,
      hold_time: exercise.holdTime ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id")
    .single();

  if (error) throw error;
  if (!data) throw new Error("Die Online-Übung wurde nicht gefunden.");
}
