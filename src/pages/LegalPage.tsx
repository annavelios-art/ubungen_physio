import type { ReactNode } from "react";
import type { Page } from "../types";
import LegalLinks from "../components/LegalLinks";

interface Props {
  kind: "imprint" | "privacy";
  navigate: (page: Page) => void;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-teal-900">{title}</h2>
      <div className="space-y-3 leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

function Imprint() {
  return (
    <>
      <h1 className="font-display text-3xl text-teal-950 sm:text-4xl">Impressum</h1>
      <div className="mt-8 space-y-6 leading-relaxed text-slate-600">
        <div>
          <p className="font-semibold text-slate-800">Physiooptima. Anna Fleck</p>
          <p>Dietzgenstraße 28</p>
          <p>13156 Berlin</p>
        </div>
        <div>
          <p>
            <span className="font-medium text-slate-700">Telefon: </span>
            <a className="text-teal-700 underline underline-offset-2" href="tel:+493081492404">
              030 814 924 04
            </a>
          </p>
          <p>
            <span className="font-medium text-slate-700">E-Mail: </span>
            <a
              className="break-all text-teal-700 underline underline-offset-2"
              href="mailto:anna.fleck@physiooptima.de"
            >
              anna.fleck@physiooptima.de
            </a>
          </p>
        </div>
        <div>
          <p><span className="font-medium text-slate-700">Inhaberin:</span> Anna Fleck</p>
          <p><span className="font-medium text-slate-700">IK:</span> 441115293</p>
        </div>
      </div>
    </>
  );
}

function Privacy() {
  return (
    <>
      <h1 className="font-display text-3xl text-teal-950 sm:text-4xl">
        Datenschutzerklärung
      </h1>
      <p className="mt-3 text-sm text-slate-400">Stand: September 2026</p>

      <div className="mt-9 space-y-10">
        <Section title="1. Verantwortliche Stelle">
          <div>
            <p className="font-medium text-slate-700">Physiooptima. Anna Fleck</p>
            <p>Dietzgenstraße 28, 13156 Berlin</p>
            <p>Telefon: 030 814 924 04</p>
            <p>
              E-Mail:{" "}
              <a className="text-teal-700 underline underline-offset-2" href="mailto:anna.fleck@physiooptima.de">
                anna.fleck@physiooptima.de
              </a>
            </p>
          </div>
        </Section>

        <Section title="2. Zweck und verarbeitete Daten">
          <p>
            Die Anwendung stellt individuelle physiotherapeutische Übungsprogramme bereit.
            Verarbeitet werden insbesondere der zufällig erzeugte Zugangscode, die diesem Code
            zugeordneten Übungen sowie Beginn und Ende der Zugangsberechtigung. Die Therapeutin
            nutzt außerdem ein geschütztes Benutzerkonto.
          </p>
          <p>
            Namen, E-Mail-Adressen und Zahlungsdaten der Patientinnen und Patienten werden in
            der Anwendung nicht gespeichert. Die Bezahlung erfolgt außerhalb der Anwendung in
            der Praxis. Der Zugangscode ermöglicht eine pseudonymisierte Zuordnung. Da die
            Auswahl der Übungen mittelbar Rückschlüsse auf Beschwerden zulassen kann, werden
            diese Angaben vorsorglich als Gesundheitsdaten behandelt.
          </p>
          <p>
            Die Verarbeitung erfolgt zur Durchführung der physiotherapeutischen Behandlung und
            Bereitstellung des vereinbarten Übungsprogramms auf Grundlage von Art. 6 Abs. 1 lit. b
            DSGVO. Soweit Gesundheitsdaten betroffen sind, erfolgt sie auf Grundlage von Art. 9
            Abs. 2 lit. h DSGVO in Verbindung mit § 22 Abs. 1 Nr. 1 lit. b BDSG.
          </p>
        </Section>

        <Section title="3. Bereitstellung über Vercel">
          <p>
            Die Anwendung wird über Vercel bereitgestellt. Anbieter ist Vercel Inc.,
            440 N Barranca Avenue #4133, Covina, CA 91723, USA. Beim Aufruf können technisch
            notwendige Verbindungsdaten verarbeitet werden, etwa IP-Adresse, Datum und Uhrzeit,
            angeforderte Dateien, Browser- und Betriebssystemangaben sowie Protokoll- und
            Diagnosedaten.
          </p>
          <p>
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse liegt in
            einer sicheren und funktionsfähigen Bereitstellung. Vercel verarbeitet Daten als
            Auftragsverarbeiter. Soweit Daten in Drittländer übermittelt werden, werden geeignete
            Garantien, insbesondere EU-Standardvertragsklauseln, eingesetzt.
          </p>
          <p>
            Weitere Informationen:{" "}
            <a
              className="break-all text-teal-700 underline underline-offset-2"
              href="https://vercel.com/legal/privacy-notice"
              target="_blank"
              rel="noreferrer"
            >
              Datenschutzhinweise von Vercel
            </a>
          </p>
        </Section>

        <Section title="4. Datenbank, Anmeldung und Medien über Supabase">
          <p>
            Für Datenbank, Anmeldung der Therapeutin und Speicherung der Übungsmedien wird
            Supabase eingesetzt. Anbieter ist Supabase Pte. Ltd., 65 Chulia Street #38-02/03,
            OCBC Centre, Singapore 049513. Die Hauptregion dieses Projekts ist Frankfurt am Main.
          </p>
          <p>
            Supabase verarbeitet die Programm- und Übungsdaten, Zugangscodes,
            Berechtigungszeiträume, Kontodaten der Therapeutin sowie technisch erforderliche
            Verbindungs- und Protokolldaten im Auftrag. Eine Verarbeitung durch Unterauftragnehmer
            außerhalb des EWR kann nicht vollständig ausgeschlossen werden. Hierfür werden
            geeignete Garantien, insbesondere EU-Standardvertragsklauseln, eingesetzt.
          </p>
          <p>
            Weitere Informationen:{" "}
            <a
              className="break-all text-teal-700 underline underline-offset-2"
              href="https://supabase.com/privacy"
              target="_blank"
              rel="noreferrer"
            >
              Datenschutzhinweise von Supabase
            </a>
          </p>
        </Section>

        <Section title="5. Lokale Speicherung und PWA-Funktion">
          <p>
            Die Anwendung verwendet technisch notwendige lokale Browser-Speicher. Auf dem Gerät
            der Therapeutin können die Anmeldung sowie lokal angelegte Übungen, Kategorien und
            Programme gespeichert werden. Der Service Worker der installierbaren Web-App kann
            Programmdateien im Browser-Zwischenspeicher ablegen, damit die Oberfläche zuverlässig
            lädt und aktualisiert werden kann.
          </p>
          <p>
            Diese Speicherung ist für die gewünschten Funktionen erforderlich. Rechtsgrundlage
            ist § 25 Abs. 2 Nr. 2 TDDDG; die anschließende Verarbeitung erfolgt nach Art. 6 Abs. 1
            lit. b beziehungsweise lit. f DSGVO. Browserdaten können über die Einstellungen des
            verwendeten Browsers gelöscht werden.
          </p>
        </Section>

        <Section title="6. Keine Analyse- oder Werbedienste">
          <p>
            In dieser Anwendung sind keine Dienste zu Reichweitenmessung, Werbung oder
            Nutzerprofilbildung eingebunden. Es werden keine externen Google-Schriften geladen.
            Ein Einwilligungsbanner ist deshalb für solche Dienste derzeit nicht erforderlich.
          </p>
        </Section>

        <Section title="7. Speicherdauer und Sicherheit">
          <p>
            Der Zugang zu einem Übungsprogramm ist grundsätzlich auf sechs Monate befristet.
            Nach Ablauf ist der Code nicht mehr nutzbar. Programmzuordnungen und zugehörige Daten
            werden gelöscht, sobald sie für Behandlung, Nachweis- oder gesetzliche
            Aufbewahrungspflichten nicht mehr benötigt werden. Technische Protokolldaten werden
            nach den Fristen der eingesetzten Auftragsverarbeiter gelöscht.
          </p>
          <p>
            Es werden angemessene technische und organisatorische Maßnahmen eingesetzt. Der
            Zugangscode sollte vertraulich behandelt und nicht an Dritte weitergegeben werden.
          </p>
        </Section>

        <Section title="8. Ihre Rechte">
          <p>
            Sie haben im Rahmen der gesetzlichen Voraussetzungen das Recht auf Auskunft
            (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung
            der Verarbeitung (Art. 18 DSGVO), Datenübertragbarkeit (Art. 20 DSGVO) und Widerspruch
            (Art. 21 DSGVO). Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die
            Zukunft widerrufen. Wenden Sie sich hierzu an die oben genannte verantwortliche Stelle.
          </p>
        </Section>

        <Section title="9. Beschwerderecht">
          <p>
            Sie können sich bei einer Datenschutzaufsichtsbehörde beschweren. Zuständig ist
            insbesondere die Berliner Beauftragte für Datenschutz und Informationsfreiheit,
            Alt-Moabit 59–61, 10555 Berlin, Telefon 030 13889-0.
          </p>
          <p>
            <a
              className="text-teal-700 underline underline-offset-2"
              href="https://www.datenschutz-berlin.de/"
              target="_blank"
              rel="noreferrer"
            >
              www.datenschutz-berlin.de
            </a>
          </p>
        </Section>

        <Section title="10. Änderungen">
          <p>
            Diese Datenschutzerklärung wird angepasst, wenn sich Funktionen, eingesetzte Dienste
            oder rechtliche Anforderungen ändern. Es gilt die jeweils in der Anwendung
            veröffentlichte Fassung.
          </p>
        </Section>
      </div>
    </>
  );
}

export default function LegalPage({ kind, navigate }: Props) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-4">
          <button
            type="button"
            onClick={() => navigate("home")}
            className="flex items-center gap-2 text-sm font-medium text-teal-700 transition-colors hover:text-teal-900"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Zur Startseite
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          {kind === "imprint" ? <Imprint /> : <Privacy />}
        </article>
      </main>

      <footer className="px-4 pb-8">
        <LegalLinks navigate={navigate} />
      </footer>
    </div>
  );
}
