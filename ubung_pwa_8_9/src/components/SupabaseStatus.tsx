import { useEffect, useState } from "react";
import { isSupabaseConfigured, testSupabaseConnection } from "../supabaseClient";

type ConnectionStatus = "checking" | "connected" | "offline" | "not-configured";

export default function SupabaseStatus() {
  const [status, setStatus] = useState<ConnectionStatus>(
    isSupabaseConfigured ? "checking" : "not-configured",
  );

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let active = true;
    testSupabaseConnection().then((connected) => {
      if (active) setStatus(connected ? "connected" : "offline");
    });

    return () => {
      active = false;
    };
  }, []);

  const details = {
    checking: { label: "Supabase wird geprüft …", dot: "bg-amber-400", text: "text-slate-500" },
    connected: { label: "Supabase verbunden", dot: "bg-emerald-500", text: "text-emerald-700" },
    offline: { label: "Supabase nicht erreichbar – lokale Nutzung aktiv", dot: "bg-slate-400", text: "text-slate-500" },
    "not-configured": { label: "Supabase nicht eingerichtet", dot: "bg-slate-300", text: "text-slate-400" },
  }[status];

  return (
    <div
      className={`flex items-center gap-2 text-xs font-medium ${details.text}`}
      title="Übungen und Programme werden weiterhin ausschließlich lokal gespeichert."
    >
      <span className={`w-2 h-2 rounded-full ${details.dot}`} aria-hidden="true" />
      <span className="hidden sm:inline">{details.label}</span>
    </div>
  );
}
