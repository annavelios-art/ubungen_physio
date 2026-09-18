const STORAGE_KEY = "physiooptima_patient_session_v1";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

interface StoredPatientSession {
  code: string;
  validUntil: number;
}

export function savePatientSession(code: string) {
  const session: StoredPatientSession = {
    code,
    validUntil: Date.now() + SESSION_MS,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function loadPatientSession(): StoredPatientSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw) as Partial<StoredPatientSession>;
    if (
      typeof session.code !== "string" ||
      typeof session.validUntil !== "number" ||
      session.validUntil <= Date.now()
    ) {
      clearPatientSession();
      return null;
    }
    return session as StoredPatientSession;
  } catch {
    clearPatientSession();
    return null;
  }
}

export function clearPatientSession() {
  localStorage.removeItem(STORAGE_KEY);
}
