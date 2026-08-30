export interface Exercise {
  id: string;
  title: string;
  category: string;
  description: string;
  instructions: string;
  reps?: number;
  sets?: number;
  duration?: number; // seconds
  holdTime?: number; // seconds
  thumbnailUrl?: string;
  videoUrl?: string;
  isCustom: boolean;
  createdAt: string;
}

export interface Program {
  id: string;
  name?: string;
  accessCode: string;
  exerciseIds: string[];
  createdAt: string;
}

export type Page =
  | "home"
  | "therapist/login"
  | "therapist/library"
  | "therapist/programs"
  | "therapist/new-exercise"
  | { type: "therapist/edit-exercise"; exerciseId: string }
  | { type: "therapist/edit-online-exercise"; exercise: Exercise }
  | "patient/access"
  | { type: "patient/view"; code: string };

export const DEFAULT_CATEGORIES = [
  "Halswirbelsäule",
  "Schulter",
  "Brustwirbelsäule",
  "Lendenwirbelsäule",
  "Hüfte",
  "Knie",
  "Fuß",
  "Gleichgewicht",
  "Kräftigung",
  "Mobilisation",
  "Dehnung",
  "Atmung & Entspannung",
];
