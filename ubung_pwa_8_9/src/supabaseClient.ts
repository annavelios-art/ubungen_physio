import { createClient } from "@supabase/supabase-js"
import type { Exercise, PatientProgram, Program } from "./types"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
const exerciseMediaBucket = "exercise-media"

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabasePublishableKey,
)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null

export async function testSupabaseConnection(): Promise<boolean> {
  if (!supabaseUrl || !supabasePublishableKey) return false

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 8000)

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/health`, {
      headers: { apikey: supabasePublishableKey },
      signal: controller.signal,
    })
    return response.ok
  } catch {
    return false
  } finally {
    window.clearTimeout(timeout)
  }
}

interface ExerciseRow {
  id: string
  title: string
  category: string
  description: string
  instructions: string
  reps: number | null
  sets: number | null
  duration: number | null
  hold_time: number | null
  thumbnail_url: string | null
  video_url: string | null
  is_custom: boolean
  is_published: boolean
  owner_id: string
  created_at: string
}

function mapExerciseRow(row: ExerciseRow): Exercise {
  return {
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
    isPublished: row.is_published,
    ownerId: row.owner_id,
    createdAt: row.created_at,
  }
}

export async function fetchOnlineExercises(): Promise<Exercise[]> {
  if (!supabase) throw new Error("Supabase ist nicht eingerichtet.")

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) throw new Error("Bitte erneut anmelden.")

  const { data, error } = await supabase
    .from("exercises")
    .select(
      "id, title, category, description, instructions, reps, sets, duration, hold_time, thumbnail_url, video_url, is_custom, is_published, owner_id, created_at",
    )
    .eq("owner_id", userData.user.id)
    .order("created_at", { ascending: true })

  if (error) throw error

  return ((data ?? []) as ExerciseRow[]).map(mapExerciseRow)
}

export async function createOnlineExercise(
  exercise: Omit<Exercise, "id" | "createdAt">,
): Promise<Exercise> {
  if (!supabase) throw new Error("Supabase ist nicht eingerichtet.")

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) throw new Error("Bitte erneut anmelden.")

  const { data, error } = await supabase
    .from("exercises")
    .insert({
      title: exercise.title,
      category: exercise.category,
      description: exercise.description,
      instructions: exercise.instructions,
      reps: exercise.reps ?? null,
      sets: exercise.sets ?? null,
      duration: exercise.duration ?? null,
      hold_time: exercise.holdTime ?? null,
      thumbnail_url: exercise.thumbnailUrl ?? null,
      video_url: exercise.videoUrl ?? null,
      is_custom: true,
      is_published: exercise.isPublished ?? false,
      owner_id: userData.user.id,
    })
    .select(
      "id, title, category, description, instructions, reps, sets, duration, hold_time, thumbnail_url, video_url, is_custom, is_published, owner_id, created_at",
    )
    .single()

  if (error) throw error
  return mapExerciseRow(data as ExerciseRow)
}

export async function updateOnlineExercise(
  id: string,
  exercise: Omit<Exercise, "id" | "createdAt">,
): Promise<void> {
  if (!supabase) throw new Error("Supabase ist nicht eingerichtet.")

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
      thumbnail_url: exercise.thumbnailUrl ?? null,
      video_url: exercise.videoUrl ?? null,
      is_published: exercise.isPublished ?? false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id")
    .single()

  if (error) throw error
  if (!data) throw new Error("Die Online-Übung wurde nicht gefunden.")
}

export interface DeleteOnlineExerciseResult {
  mediaCleanupFailed: boolean
}

export async function deleteOnlineExercise(
  id: string,
): Promise<DeleteOnlineExerciseResult> {
  if (!supabase) throw new Error("Supabase ist nicht eingerichtet.")

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) throw new Error("Bitte erneut anmelden.")

  const { data, error } = await supabase
    .from("exercises")
    .delete()
    .eq("id", id)
    .eq("owner_id", userData.user.id)
    .select("thumbnail_url, video_url")
    .maybeSingle()

  if (error) throw error
  if (!data)
    throw new Error(
      "Die Online-Übung wurde nicht gefunden oder darf nicht gelöscht werden.",
    )

  const deletedExercise =
    data as Pick<ExerciseRow, "thumbnail_url" | "video_url">
  const mediaPaths = [deletedExercise.thumbnail_url, deletedExercise.video_url]
    .filter((url): url is string => Boolean(url))
    .map(exerciseMediaPathFromUrl)
    .filter((path): path is string => Boolean(path))
  const uniqueMediaPaths = [...new Set(mediaPaths)]

  if (uniqueMediaPaths.length === 0) return { mediaCleanupFailed: false }

  const { error: mediaError } = await supabase.storage
    .from(exerciseMediaBucket)
    .remove(uniqueMediaPaths)

  return { mediaCleanupFailed: Boolean(mediaError) }
}

export interface UploadedExerciseMedia {
  url: string
  path: string
}

function safeFileExtension(file: File): string {
  const extension = file.name
    .split(".")
    .pop()
    ?.toLowerCase()
    .replace(/[^a-z0-9]/g, "")
  if (extension) return extension
  if (file.type.startsWith("image/")) return "jpg"
  if (file.type.startsWith("video/")) return "mp4"
  return "bin"
}

export async function uploadExerciseMedia(
  file: File,
  type: "images" | "videos",
): Promise<UploadedExerciseMedia> {
  if (!supabase) throw new Error("Supabase ist nicht eingerichtet.")

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) throw new Error("Bitte erneut anmelden.")

  const path = `${userData.user.id}/${type}/${crypto.randomUUID()}.${safeFileExtension(file)}`
  const { error } = await supabase.storage
    .from(exerciseMediaBucket)
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    })

  if (error) throw error

  const { data } = supabase.storage.from(exerciseMediaBucket).getPublicUrl(path)
  return { path, url: data.publicUrl }
}

export async function deleteExerciseMedia(path: string): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.storage
    .from(exerciseMediaBucket)
    .remove([path])
  if (error) throw error
}

export function exerciseMediaPathFromUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${exerciseMediaBucket}/`
  const markerIndex = url.indexOf(marker)
  if (markerIndex === -1) return null
  return decodeURIComponent(url.slice(markerIndex + marker.length))
}

interface PatientProgramRow {
  id: string
  access_code: string
  expires_at: string
  is_active: boolean
  created_at: string
  program_exercises?: Array<{
    exercise_id: string
    sort_order: number
  }>
}

function mapPatientProgramRow(row: PatientProgramRow): Program {
  const assignments = [...(row.program_exercises ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  )

  return {
    id: row.id,
    accessCode: row.access_code,
    exerciseIds: assignments.map((assignment) => assignment.exercise_id),
    createdAt: row.created_at,
    expiresAt: row.expires_at,
    isActive: row.is_active,
    isOnline: true,
  }
}

function addCalendarMonths(date: Date, months: number): Date {
  const result = new Date(date)
  const originalDay = result.getUTCDate()

  result.setUTCDate(1)
  result.setUTCMonth(result.getUTCMonth() + months)

  const lastDayOfTargetMonth = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0),
  ).getUTCDate()
  result.setUTCDate(Math.min(originalDay, lastDayOfTargetMonth))

  return result
}

export async function createOnlineProgram(
  exerciseIds: string[],
): Promise<Program> {
  if (!supabase) throw new Error("Supabase ist nicht eingerichtet.")

  const uniqueExerciseIds = [...new Set(exerciseIds)]
  if (uniqueExerciseIds.length === 0) {
    throw new Error(
      "Bitte mindestens eine veröffentlichte Online-Übung auswählen.",
    )
  }

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) throw new Error("Bitte erneut anmelden.")

  const { data: allowedExercises, error: exerciseError } = await supabase
    .from("exercises")
    .select("id")
    .eq("owner_id", userData.user.id)
    .eq("is_published", true)
    .in("id", uniqueExerciseIds)

  if (exerciseError) throw exerciseError
  if ((allowedExercises ?? []).length !== uniqueExerciseIds.length) {
    throw new Error(
      "Mindestens eine ausgewählte Übung ist nicht veröffentlicht oder nicht mehr vorhanden.",
    )
  }

  const { data: programData, error: programError } = await supabase
    .from("patient_programs")
    .insert({
      owner_id: userData.user.id,
      expires_at: addCalendarMonths(new Date(), 6).toISOString(),
      is_active: true,
    })
    .select("id, access_code, expires_at, is_active, created_at")
    .single()

  if (programError) throw programError

  const program = programData as PatientProgramRow
  const assignments = uniqueExerciseIds.map((exerciseId, index) => ({
    program_id: program.id,
    exercise_id: exerciseId,
    sort_order: index,
  }))

  const { error: assignmentError } = await supabase
    .from("program_exercises")
    .insert(assignments)

  if (assignmentError) {
    await supabase.from("patient_programs").delete().eq("id", program.id)
    throw assignmentError
  }

  return mapPatientProgramRow({
    ...program,
    program_exercises: assignments.map(({ exercise_id, sort_order }) => ({
      exercise_id,
      sort_order,
    })),
  })
}

export async function renewOnlineProgram(
  id: string,
  currentExpiresAt: string,
): Promise<Program> {
  if (!supabase) throw new Error("Supabase ist nicht eingerichtet.")

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) throw new Error("Bitte erneut anmelden.")

  const currentExpiry = new Date(currentExpiresAt)
  const now = new Date()
  const extensionStart =
    Number.isNaN(currentExpiry.getTime()) || currentExpiry < now
      ? now
      : currentExpiry
  const nextExpiry = addCalendarMonths(extensionStart, 6).toISOString()

  const { data, error } = await supabase
    .from("patient_programs")
    .update({ expires_at: nextExpiry, is_active: true })
    .eq("id", id)
    .eq("owner_id", userData.user.id)
    .select("id, access_code, expires_at, is_active, created_at")
    .maybeSingle()

  if (error) throw error
  if (!data) {
    throw new Error(
      "Das Programm wurde nicht gefunden oder darf nicht verlängert werden.",
    )
  }

  return mapPatientProgramRow({
    ...data as PatientProgramRow,
    program_exercises: [],
  })
}

export async function fetchOnlinePrograms(): Promise<Program[]> {
  if (!supabase) throw new Error("Supabase ist nicht eingerichtet.")

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) throw new Error("Bitte erneut anmelden.")

  const { data, error } = await supabase
    .from("patient_programs")
    .select(
      "id, access_code, expires_at, is_active, created_at, program_exercises(exercise_id, sort_order)",
    )
    .eq("owner_id", userData.user.id)
    .order("created_at", { ascending: false })

  if (error) throw error
  return ((data ?? []) as PatientProgramRow[]).map(mapPatientProgramRow)
}

export async function deleteOnlineProgram(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase ist nicht eingerichtet.")

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) throw new Error("Bitte erneut anmelden.")

  const { data, error } = await supabase
    .from("patient_programs")
    .delete()
    .eq("id", id)
    .eq("owner_id", userData.user.id)
    .select("id")
    .maybeSingle()

  if (error) throw error
  if (!data)
    throw new Error(
      "Das Programm wurde nicht gefunden oder darf nicht gelöscht werden.",
    )
}

export async function fetchPatientProgramByCode(
  accessCode: string,
): Promise<PatientProgram | null> {
  if (!supabase)
    throw new Error("Die Online-Verbindung ist nicht eingerichtet.")

  const { data, error } = await supabase.rpc("get_patient_program", {
    p_access_code: accessCode,
  })

  if (error) throw error
  if (!data || typeof data !== "object") return null

  const raw = data as {
    programId?: unknown
    expiresAt?: unknown
    exercises?: unknown
  }

  if (
    typeof raw.programId !== "string" ||
    typeof raw.expiresAt !== "string" ||
    !Array.isArray(raw.exercises)
  ) {
    return null
  }

  return {
    programId: raw.programId,
    expiresAt: raw.expiresAt,
    exercises: raw.exercises as Exercise[],
  }
}
