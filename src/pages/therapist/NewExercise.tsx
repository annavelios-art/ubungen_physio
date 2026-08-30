import { useState, useRef, useEffect } from "react";
import { useStore } from "../../store";
import type { Exercise, Page } from "../../types";
import { updateOnlineExercise } from "../../supabaseClient";

interface Props {
  navigate: (page: Page) => void;
  editExerciseId?: string;
  onlineExercise?: Exercise;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function NewExercise({ navigate, editExerciseId, onlineExercise }: Props) {
  const { exercises, categories, addExercise, updateExercise, addCategory } = useStore();

  const localEditing = editExerciseId ? exercises.find((e) => e.id === editExerciseId) : undefined;
  const editing = onlineExercise ?? localEditing;
  const isOnlineEditing = Boolean(onlineExercise);

  const [title, setTitle] = useState(editing?.title ?? "");
  const [category, setCategory] = useState(editing?.category ?? categories[0]);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [description, setDescription] = useState(editing?.description ?? "");
  const [instructions, setInstructions] = useState(editing?.instructions ?? "");
  const [reps, setReps] = useState(editing?.reps?.toString() ?? "");
  const [sets, setSets] = useState(editing?.sets?.toString() ?? "");
  const [duration, setDuration] = useState(editing?.duration?.toString() ?? "");
  const [holdTime, setHoldTime] = useState(editing?.holdTime?.toString() ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(editing?.thumbnailUrl);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(editing?.videoUrl);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const thumbnailRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setCategory(editing.category);
      setDescription(editing.description);
      setInstructions(editing.instructions);
      setReps(editing.reps?.toString() ?? "");
      setSets(editing.sets?.toString() ?? "");
      setDuration(editing.duration?.toString() ?? "");
      setHoldTime(editing.holdTime?.toString() ?? "");
      setThumbnailUrl(editing.thumbnailUrl);
      setVideoUrl(editing.videoUrl);
    }
  }, [editing]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Bitte einen Titel eingeben.";
    if (!description.trim()) errs.description = "Bitte eine kurze Beschreibung eingeben.";
    if (!instructions.trim()) errs.instructions = "Bitte die Durchführung beschreiben.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleMediaUpload = async (
    file: File,
    type: "thumbnail" | "video"
  ) => {
    try {
      const dataUrl = await fileToDataUrl(file);
      if (type === "thumbnail") setThumbnailUrl(dataUrl);
      else setVideoUrl(dataUrl);
    } catch {
      // ignore
    }
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setErrors({});

    const data: Omit<Exercise, "id" | "createdAt"> = {
      title: title.trim(),
      category,
      description: description.trim(),
      instructions: instructions.trim(),
      reps: reps ? parseInt(reps) : undefined,
      sets: sets ? parseInt(sets) : undefined,
      duration: duration ? parseInt(duration) : undefined,
      holdTime: holdTime ? parseInt(holdTime) : undefined,
      thumbnailUrl,
      videoUrl,
      isCustom: editing?.isCustom ?? true,
    };

    try {
      if (isOnlineEditing && editing) {
        await updateOnlineExercise(editing.id, data);
      } else if (editing) {
        updateExercise(editing.id, data);
      } else {
        addExercise(data);
      }
    } catch (error) {
      setErrors({
        save:
          error instanceof Error
            ? `Speichern in Supabase fehlgeschlagen: ${error.message}`
            : "Speichern in Supabase fehlgeschlagen.",
      });
      setSaving(false);
      return;
    }

    setSaving(false);
    navigate("therapist/library");
  };

  const handleAddCategory = () => {
    const cat = newCategoryInput.trim();
    if (cat) {
      addCategory(cat);
      setCategory(cat);
      setNewCategoryInput("");
      setShowNewCategory(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors ${
      errors[field] ? "border-red-300 bg-red-50" : "border-slate-200 bg-white"
    }`;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">
        {editing ? "Übung bearbeiten" : "Neue Übung erstellen"}
      </h1>

      {isOnlineEditing && (
        <div className="mb-5 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800">
          <span className="font-medium">Online-Übung:</span> Änderungen werden direkt in Supabase gespeichert.
          Bilder und Videos verbinden wir später über Supabase Storage.
        </div>
      )}

      <div className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Titel der Übung <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="z. B. Kinnretraktion, Schulterkreisen ..."
            className={inputClass("title")}
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Kategorie</label>
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowNewCategory(!showNewCategory)}
              className="px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-teal-700 hover:bg-teal-50 transition-colors"
            >
              + Neu
            </button>
          </div>
          {showNewCategory && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                placeholder="Neue Kategorie ..."
                className="flex-1 px-4 py-2.5 border border-teal-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                autoFocus
              />
              <button
                onClick={handleAddCategory}
                className="px-4 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors"
              >
                Hinzufügen
              </button>
            </div>
          )}
        </div>

        {/* Media Upload */}
        {!isOnlineEditing && <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Vorschaubild</label>
            <input
              ref={thumbnailRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleMediaUpload(e.target.files[0], "thumbnail")}
            />
            {thumbnailUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200" style={{ aspectRatio: "4/3" }}>
                <img src={thumbnailUrl} alt="Vorschau" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 inset-x-0 bg-black/50 flex">
                  <button
                    onClick={() => thumbnailRef.current?.click()}
                    className="flex-1 text-white text-xs py-2 hover:bg-white/20 transition-colors"
                  >
                    Ersetzen
                  </button>
                  <button
                    onClick={() => setThumbnailUrl(undefined)}
                    className="flex-1 text-white text-xs py-2 hover:bg-white/20 transition-colors"
                  >
                    Entfernen
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => thumbnailRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 py-8 hover:border-teal-400 hover:bg-teal-50 transition-colors text-slate-400 hover:text-teal-600"
                style={{ aspectRatio: "4/3" }}
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-medium">Bild hochladen</span>
              </button>
            )}
          </div>

          {/* Video */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Übungsvideo</label>
            <input
              ref={videoRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleMediaUpload(e.target.files[0], "video")}
            />
            {videoUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200" style={{ aspectRatio: "4/3" }}>
                <video src={videoUrl} className="w-full h-full object-cover bg-black" />
                <div className="absolute bottom-0 inset-x-0 bg-black/50 flex">
                  <button
                    onClick={() => videoRef.current?.click()}
                    className="flex-1 text-white text-xs py-2 hover:bg-white/20 transition-colors"
                  >
                    Ersetzen
                  </button>
                  <button
                    onClick={() => setVideoUrl(undefined)}
                    className="flex-1 text-white text-xs py-2 hover:bg-white/20 transition-colors"
                  >
                    Entfernen
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => videoRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 py-8 hover:border-teal-400 hover:bg-teal-50 transition-colors text-slate-400 hover:text-teal-600"
                style={{ aspectRatio: "4/3" }}
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
                <span className="text-xs font-medium">Video hochladen</span>
              </button>
            )}
          </div>
        </div>}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Kurze Beschreibung <span className="text-red-400">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Worum geht es bei dieser Übung? Was wird trainiert?"
            rows={2}
            className={inputClass("description") + " resize-none"}
          />
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Durchführung / Anleitung <span className="text-red-400">*</span>
          </label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Schritt-für-Schritt-Anleitung für die Patientin / den Patienten ..."
            rows={5}
            className={inputClass("instructions") + " resize-none"}
          />
          {errors.instructions && <p className="mt-1 text-xs text-red-500">{errors.instructions}</p>}
        </div>

        {/* Reps / Sets / Duration / Hold */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Wiederholungen</label>
            <input
              type="number"
              min="1"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="z. B. 10"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Sätze</label>
            <input
              type="number"
              min="1"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              placeholder="z. B. 3"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Haltezeit (Sek.)</label>
            <input
              type="number"
              min="1"
              value={holdTime}
              onChange={(e) => setHoldTime(e.target.value)}
              placeholder="z. B. 30"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Dauer (Sek.)</label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="z. B. 300"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
            />
          </div>
        </div>

        {/* Actions */}
        {errors.save && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{errors.save}</div>
        )}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => navigate("therapist/library")}
            className="flex-1 border border-slate-200 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-teal-600 text-white py-3 rounded-xl font-medium hover:bg-teal-700 transition-colors disabled:opacity-60"
          >
            {saving ? "Speichern ..." : editing ? "Änderungen speichern" : "Übung speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}
