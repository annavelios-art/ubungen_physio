import type { Page } from "../types";

interface Props {
  navigate: (page: Page) => void;
  className?: string;
}

export default function LegalLinks({ navigate, className = "" }: Props) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-slate-400 ${className}`}
    >
      <span>Physiooptima</span>
      <span aria-hidden="true">·</span>
      <button
        type="button"
        onClick={() => navigate("legal/imprint")}
        className="underline decoration-slate-300 underline-offset-2 transition-colors hover:text-teal-700"
      >
        Impressum
      </button>
      <span aria-hidden="true">·</span>
      <button
        type="button"
        onClick={() => navigate("legal/privacy")}
        className="underline decoration-slate-300 underline-offset-2 transition-colors hover:text-teal-700"
      >
        Datenschutz
      </button>
    </div>
  );
}
