# Physiooptima – Update vom 18.10.2026

## Neue Funktionen

- In der **Patientenansicht** öffnet ein Tipp auf das Vorschaubild das große Bild im Dialog. Mit **Schließen** bzw. Escape geht es zurück. Es wird die URL des Originalbilds verwendet.
- Die **Anleitung** wird weiterhin über den Pfeil beim Übungstitel geöffnet.
- Falls ein Video existiert, erscheint im geöffneten Bereich der Button **Video ansehen**.
- Ein Zugangscode muss auf demselben Gerät im Normalfall **nur einmal** eingegeben werden. Beim nächsten Aufruf über „Patientin / Patient“ wird das Programm nach einer Online-Prüfung automatisch geladen.
- Bei **neuen Programmen** laufen die sechs Kalendermonate **erst ab der ersten erfolgreichen Anmeldung**, nicht ab Erstellung.
- Im Therapeutenbereich steht vor der ersten Anmeldung „wartet auf Anmeldung“; nach der ersten Anmeldung sieht man das Ablaufdatum. Die bestehende bezahlte Verlängerung funktioniert weiterhin.

## WICHTIG: Reihenfolge für die Veröffentlichung

**1. Supabase zuerst aktualisieren.**

Im Supabase-Dashboard des verwendeten Projekts zu **SQL Editor** wechseln, den Inhalt von
`supabase/migrations/20261018_first_access_six_months.sql` hineinkopieren und **Run** ausführen.

Am besten vorher ein Datenbankbackup anfertigen. Die Migration ist als einmaliges, bei erneutem Ausführen weitgehend idempotentes Schema-Update konzipiert. Sie legt eine zusätzliche Spalte sowie eine neue RPC-Funktion an; alte Programme werden nicht gelöscht.

**2. Erst danach die PWA-Dateien bei GitHub aktualisieren.**

Die neue PWA setzt die zusätzliche Spalte und die neue RPC-Funktion voraus. **Nicht umgekehrt veröffentlichen**, denn sonst können Patienten ihr Programm vorübergehend nicht laden.

**3. Testen:** Neues Programm erstellen, Code am Patienten-Zugang eingeben, erneut öffnen (ohne neuen Code), im Therapeutenbereich das Start- und Ablaufdatum kontrollieren und auf ein Vorschaubild tippen. Auch mit einer Übung ohne Video testen.

## Hinweise zu bereits bestehenden Programmen

Das Datum früherer Patienten-Anmeldungen wurde bisher **nicht** gespeichert. Die Migration lässt deshalb die bisherige Laufzeit und Verlängerungsmöglichkeit **aller bestehenden Programme unverändert**. In der neuen Statusanzeige ist deren Erstellungsdatum als technischer Startpunkt zu sehen, nicht als historisch nachgewiesene erste Anmeldung. **Nur Programme, die nach der Umstellung neu erstellt werden, laufen sechs Monate ab ihrer tatsächlichen ersten Anmeldung.** Bereits abgelaufene Altprogramme bleiben gesperrt, bis sie über die bestehende Verlängerungsfunktion verlängert werden.

## Nach Ablauf der sechs Monate

Die Datenbank-Funktion verweigert automatisch den Zugriff. Eine automatische **physische Löschung** von Codes oder Programmen wird **absichtlich nicht** eingerichtet, da dies die bestehende kostenpflichtige Verlängerung und ggf. Abrechnungsbezüge beeinträchtigen könnte. Programme können weiterhin im Therapeutenbereich einzeln gelöscht werden. Wenn eine automatische Datenbereinigung gewünscht ist, sollte zuvor gemeinsam die Aufbewahrungsfrist für bezahlte Programme festgelegt werden.

## Datenschutz und Technik

Der Code wird nur in der lokalen Browser-Speicherung dieses Geräts abgelegt und **bei jedem erneuten Laden online auf Gültigkeit geprüft**. Die Datenbank entscheidet über Ablauf und Verlängerung, nicht die Uhr des Patienten-Geräts. „Abmelden“ löscht die lokale Speicherung. Löscht der Patient seine Browserdaten, wechselt sein Gerät oder blockiert sein Browser die Speicherung, muss er den Code nochmals eingeben.

Die Datei `.env.local` und `node_modules` sind **nicht** in der ZIP-Datei. Die bereits verwendeten Supabase-Umgebungsvariablen müssen bei der Veröffentlichung weiter verfügbar sein.

## Prüfung

Alle React-/TypeScript-Dateien wurden syntaktisch mit TypeScript transpiliert. Ein kompletter Vite-Build oder Live-Test an der echten Supabase-Datenbank war in dieser Umgebung nicht möglich (Abhängigkeiten konnten wegen fehlender Netzwerkverbindung nicht installiert werden). Bitte daher erst den beschriebenen Funktionstest durchführen.
