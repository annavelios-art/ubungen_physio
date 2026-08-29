import React, { createContext, useContext, useEffect, useState } from "react";
import type { Exercise, Program } from "./types";
import { DEFAULT_CATEGORIES } from "./types";

const SAMPLE_EXERCISES: Exercise[] = [
  {
    id: "sample-1",
    title: "Kinnretraktion",
    category: "Halswirbelsäule",
    description: "Sanfte Kräftigung der tiefen Nackenmuskulatur zur Verbesserung der HWS-Haltung.",
    instructions:
      "Setzen Sie sich aufrecht hin. Ziehen Sie das Kinn langsam gerade nach hinten, als wollten Sie einen doppelten Kinn erzeugen. Halten Sie die Position kurz und kehren Sie langsam in die Ausgangsposition zurück. Achten Sie darauf, den Kopf nicht zu neigen.",
    reps: 10,
    sets: 3,
    holdTime: 5,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1660739270492-6b79793ed992?w=400&h=280&fit=crop&auto=format",
    isCustom: false,
    createdAt: "2025-01-01T10:00:00Z",
  },
  {
    id: "sample-2",
    title: "Schulterkreisen",
    category: "Schulter",
    description: "Mobilisation des Schultergelenks und Lockerung der Schultermuskulatur.",
    instructions:
      "Stehen oder sitzen Sie aufrecht. Führen Sie beide Schultern langsam in großen Kreisen nach hinten. Atmen Sie dabei gleichmäßig. Führen Sie anschließend die Kreise in die entgegengesetzte Richtung aus.",
    reps: 10,
    sets: 2,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1649751361457-01d3a696c7e6?w=400&h=280&fit=crop&auto=format",
    isCustom: false,
    createdAt: "2025-01-01T10:00:00Z",
  },
  {
    id: "sample-3",
    title: "Katze-Kuh",
    category: "Brustwirbelsäule",
    description: "Mobilisation der gesamten Wirbelsäule mit Schwerpunkt auf der Brustwirbelsäule.",
    instructions:
      "Begeben Sie sich in den Vierfüßlerstand: Hände unter den Schultern, Knie unter den Hüften. Runden Sie beim Ausatmen die gesamte Wirbelsäule nach oben (Katze). Beim Einatmen lassen Sie den Bauch sinken und heben den Kopf leicht an (Kuh). Führen Sie die Bewegung fließend aus.",
    reps: 10,
    sets: 2,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=400&h=280&fit=crop&auto=format",
    isCustom: false,
    createdAt: "2025-01-01T10:00:00Z",
  },
  {
    id: "sample-4",
    title: "Beckenkippung im Liegen",
    category: "Lendenwirbelsäule",
    description: "Aktivierung der tiefen Rumpfmuskulatur und Stabilisierung der Lendenwirbelsäule.",
    instructions:
      "Legen Sie sich auf den Rücken, Beine aufgestellt, Füße hüftbreit. Kippen Sie das Becken, sodass der untere Rücken sanft in den Boden gedrückt wird. Halten Sie die Spannung kurz, dann lösen Sie sie wieder. Atmen Sie gleichmäßig weiter.",
    reps: 15,
    sets: 3,
    holdTime: 5,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1607914660217-754fdd90041d?w=400&h=280&fit=crop&auto=format",
    isCustom: false,
    createdAt: "2025-01-01T10:00:00Z",
  },
  {
    id: "sample-5",
    title: "Hüftkreisen im Stand",
    category: "Hüfte",
    description: "Mobilisation des Hüftgelenks und Dehnung der Hüftgelenkkapsel.",
    instructions:
      "Stehen Sie hüftbreit, Hände an den Hüften. Beschreiben Sie mit dem Becken langsam große Kreise – erst im Uhrzeigersinn, dann gegen den Uhrzeigersinn. Halten Sie den Oberkörper möglichst ruhig.",
    reps: 10,
    sets: 2,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1692372372810-c848c9cca1c5?w=400&h=280&fit=crop&auto=format",
    isCustom: false,
    createdAt: "2025-01-01T10:00:00Z",
  },
  {
    id: "sample-6",
    title: "Kniebeugen an der Wand",
    category: "Knie",
    description: "Kräftigung der Oberschenkelmuskulatur bei reduzierter Kniebelastung.",
    instructions:
      "Stehen Sie mit dem Rücken zur Wand, Füße ca. 30 cm von der Wand entfernt. Gleiten Sie langsam an der Wand nach unten, bis die Knie etwa 90° gebeugt sind. Halten Sie die Position. Drücken Sie sich wieder nach oben und wiederholen Sie die Übung.",
    sets: 3,
    holdTime: 30,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1540206276207-3af25c08abc4?w=400&h=280&fit=crop&auto=format",
    isCustom: false,
    createdAt: "2025-01-01T10:00:00Z",
  },
  {
    id: "sample-7",
    title: "Einbeinstand",
    category: "Gleichgewicht",
    description: "Training der Gleichgewichtsfähigkeit und Kräftigung der Beinachse.",
    instructions:
      "Stehen Sie aufrecht neben einer Wand (Sicherheit). Heben Sie ein Bein leicht an, sodass Sie auf dem anderen Bein balancieren. Halten Sie den Blick auf einen festen Punkt. Wechseln Sie nach der angegebenen Zeit das Bein.",
    sets: 3,
    holdTime: 20,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1561049501-e1f96bdd98fd?w=400&h=280&fit=crop&auto=format",
    isCustom: false,
    createdAt: "2025-01-01T10:00:00Z",
  },
  {
    id: "sample-8",
    title: "Wandstütz",
    category: "Kräftigung",
    description: "Kräftigung der Schulter- und Armmuskulatur mit reduzierter Belastung.",
    instructions:
      "Stehen Sie mit einem Abstand von ca. 50 cm vor einer Wand. Legen Sie die Hände schulterbreit an der Wand ab. Beugen Sie die Arme, bis die Nase fast die Wand berührt, und drücken Sie sich wieder zurück. Halten Sie den Körper gerade wie ein Brett.",
    reps: 10,
    sets: 3,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=280&fit=crop&auto=format",
    isCustom: false,
    createdAt: "2025-01-01T10:00:00Z",
  },
  {
    id: "sample-9",
    title: "Brustdehnung",
    category: "Dehnung",
    description: "Dehnung der Brustmuskulatur und Verbesserung der Körperhaltung.",
    instructions:
      "Stellen Sie sich in eine Türöffnung. Legen Sie beide Unterarme an den Türrahmen (Ellenbogen auf Schulterhöhe). Lehnen Sie sich langsam nach vorne, bis Sie eine Dehnung in der Brust spüren. Halten Sie die Dehnung und atmen Sie tief.",
    sets: 3,
    holdTime: 30,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1560233075-4c1e2007908e?w=400&h=280&fit=crop&auto=format",
    isCustom: false,
    createdAt: "2025-01-01T10:00:00Z",
  },
  {
    id: "sample-10",
    title: "Bauchatmung",
    category: "Atmung & Entspannung",
    description: "Aktivierung des Zwerchfells, Förderung der Entspannung und Stressreduktion.",
    instructions:
      "Legen Sie sich auf den Rücken oder setzen Sie sich bequem hin. Legen Sie eine Hand auf den Bauch, eine auf die Brust. Atmen Sie langsam durch die Nase ein – der Bauch hebt sich, die Brust bleibt ruhig. Atmen Sie durch den leicht geöffneten Mund aus. Spüren Sie, wie der Bauch sinkt.",
    sets: 1,
    duration: 300,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1706353399656-210cca727a33?w=400&h=280&fit=crop&auto=format",
    isCustom: false,
    createdAt: "2025-01-01T10:00:00Z",
  },
  {
    id: "sample-11",
    title: "BWS-Rotation im Sitzen",
    category: "Mobilisation",
    description: "Verbesserung der Rotationsbeweglichkeit der Brustwirbelsäule.",
    instructions:
      "Sitzen Sie aufrecht auf einem Stuhl, Arme vor der Brust verschränkt. Drehen Sie den Oberkörper langsam nach rechts, so weit es schmerzfrei möglich ist. Kehren Sie zur Mitte zurück und drehen Sie dann nach links. Achten Sie darauf, dass die Hüften auf dem Stuhl bleiben.",
    reps: 8,
    sets: 3,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1648638810948-f3bf2cccdde9?w=400&h=280&fit=crop&auto=format",
    isCustom: false,
    createdAt: "2025-01-01T10:00:00Z",
  },
  {
    id: "sample-12",
    title: "Fersenstand und -gang",
    category: "Fuß",
    description: "Kräftigung der vorderen Unterschenkelmuskulatur und Verbesserung der Fußhebung.",
    instructions:
      "Stehen Sie aufrecht, halten Sie sich bei Bedarf leicht an einer Wand fest. Heben Sie beide Fußspitzen vom Boden ab, sodass Sie nur auf den Fersen stehen. Halten Sie die Position kurz, dann senken Sie die Zehen wieder ab. Alternativ können Sie auf den Fersen einige Schritte gehen.",
    reps: 15,
    sets: 3,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1645005512964-5057008b4425?w=400&h=280&fit=crop&auto=format",
    isCustom: false,
    createdAt: "2025-01-01T10:00:00Z",
  },
];

interface StoreState {
  exercises: Exercise[];
  programs: Program[];
  categories: string[];
}

interface StoreContextType extends StoreState {
  addExercise: (exercise: Omit<Exercise, "id" | "createdAt">) => void;
  updateExercise: (id: string, updates: Partial<Exercise>) => void;
  deleteExercise: (id: string) => void;
  addProgram: (exerciseIds: string[], name?: string) => Program;
  deleteProgram: (id: string) => void;
  addCategory: (cat: string) => void;
  getProgramByCode: (code: string) => Program | undefined;
}

const StoreContext = createContext<StoreContextType | null>(null);

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function generateAccessCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function loadState(): StoreState {
  try {
    const raw = localStorage.getItem("physio-app-state");
    if (raw) {
      const parsed = JSON.parse(raw) as StoreState;
      return {
        exercises: parsed.exercises ?? SAMPLE_EXERCISES,
        programs: parsed.programs ?? [],
        categories: parsed.categories ?? DEFAULT_CATEGORIES,
      };
    }
  } catch {
    // ignore
  }
  return {
    exercises: SAMPLE_EXERCISES,
    programs: [],
    categories: [...DEFAULT_CATEGORIES],
  };
}

function saveState(state: StoreState) {
  try {
    localStorage.setItem("physio-app-state", JSON.stringify(state));
  } catch {
    // ignore – e.g. quota exceeded for large media files
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addExercise = (exercise: Omit<Exercise, "id" | "createdAt">) => {
    const newExercise: Exercise = {
      ...exercise,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, exercises: [...s.exercises, newExercise] }));
  };

  const updateExercise = (id: string, updates: Partial<Exercise>) => {
    setState((s) => ({
      ...s,
      exercises: s.exercises.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  };

  const deleteExercise = (id: string) => {
    setState((s) => ({
      ...s,
      exercises: s.exercises.filter((e) => e.id !== id),
      programs: s.programs.map((program) => ({
        ...program,
        exerciseIds: program.exerciseIds.filter((exerciseId) => exerciseId !== id),
      })),
    }));
  };

  const addProgram = (exerciseIds: string[], name?: string): Program => {
    const program: Program = {
      id: generateId(),
      name,
      accessCode: generateAccessCode(),
      exerciseIds,
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, programs: [...s.programs, program] }));
    return program;
  };

  const deleteProgram = (id: string) => {
    setState((s) => ({ ...s, programs: s.programs.filter((p) => p.id !== id) }));
  };

  const addCategory = (cat: string) => {
    setState((s) => ({
      ...s,
      categories: s.categories.includes(cat) ? s.categories : [...s.categories, cat],
    }));
  };

  const getProgramByCode = (code: string) =>
    state.programs.find((p) => p.accessCode === code.toUpperCase());

  return (
    <StoreContext.Provider
      value={{
        ...state,
        addExercise,
        updateExercise,
        deleteExercise,
        addProgram,
        deleteProgram,
        addCategory,
        getProgramByCode,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
