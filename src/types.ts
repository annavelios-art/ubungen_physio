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
  isPublished?: boolean;
  ownerId?: string;
  createdAt: string;
}

export interface Program {
  id: string;
  name?: string;
  accessCode: string;
  exerciseIds: string[];
  createdAt: string;
  expiresAt?: string;
  isActive?: boolean;
  isOnline?: boolean;
}

export interface PatientProgram {
  programId: string;
  expiresAt: string;
  exercises: Exercise[];
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
  | { type: "patient/view"; code: string; program: PatientProgram };

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
