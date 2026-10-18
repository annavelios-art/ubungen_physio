/**
 * Der Zugangscode bleibt nur auf diesem Gerät gespeichert.
 * Ob ein Programm (noch) gültig ist, entscheidet immer die Datenbank.
 */
const STORAGE_KEY = "physiooptima_patient_session_v2";
const OLD_STORAGE_KEY = "physiooptima_patient_session_v1";

export interface StoredPatientSession {
  code: string;
  validUntil: number;
}

export function savePatientSession(code: string, expiresAt: string): void {
  const validUntil = new Date(expiresAt).getTime();
  if (!code.trim() || !Number.isFinite(validUntil) || validUntil <= Date.now()) {
    return;
  }

  const session: StoredPatientSession = { code: code.trim(), validUntil };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    localStorage.removeItem(OLD_STORAGE_KEY);
  } catch {
    // Private Browsing kann das Speichern untersagen. Der aktuelle Zugang klappt trotzdem.
  }
}

export function loadPatientSession(): StoredPatientSession | null {
  try {
    // Bereits gespeicherte 7-Tage-Anmeldungen dürfen übernommen werden.
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(OLD_STORAGE_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw) as Partial<StoredPatientSession>;
    if (
      typeof session.code !== "string" ||
      !session.code.trim() ||
      typeof session.validUntil !== "number" ||
      !Number.isFinite(session.validUntil)
    ) {
      clearPatientSession();
      return null;
    }

    // Auch nach lokaler Frist prüfen wir beim Server: Das Programm könnte verlängert sein.
    // Der lokale Code allein gewährt niemals Zugang zu Übungen.
    return session as StoredPatientSession;
  } catch {
    clearPatientSession();
    return null;
  }
}

export function clearPatientSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(OLD_STORAGE_KEY);
  } catch {
    // Kein LocalStorage verfügbar.
  }
}
