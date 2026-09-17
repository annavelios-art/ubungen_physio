import { useEffect, useMemo, useState } from "react"
import type { Payment, PaymentMethod, Program } from "../../types"
import { cancelPayment, createPayment, fetchOnlinePrograms, fetchPayments, updatePayment } from "../../supabaseClient"

const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" })
const today = () => new Date().toISOString().slice(0, 10)
const dateLabel = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString("de-DE")

function csvCell(value: string | number) {
  const text = String(value).replace(/"/g, '""')
  return `"${text}"`
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [programId, setProgramId] = useState("")
  const [paymentDate, setPaymentDate] = useState(today())
  const [amount, setAmount] = useState("24.00")
  const [method, setMethod] = useState<PaymentMethod>("Überweisung")
  const [note, setNote] = useState("")
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true); setError(null)
    try {
      const [nextPayments, nextPrograms] = await Promise.all([fetchPayments(), fetchOnlinePrograms()])
      setPayments(nextPayments); setPrograms(nextPrograms)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Einnahmen konnten nicht geladen werden.")
    } finally { setLoading(false) }
  }
  useEffect(() => { void load() }, [])

  const years = useMemo(() => {
    const values = new Set(payments.map(p => p.paymentDate.slice(0, 4)))
    values.add(String(new Date().getFullYear()))
    return [...values].sort((a,b) => b.localeCompare(a))
  }, [payments])
  const visible = payments.filter(p => p.paymentDate.startsWith(year))
  const total = visible.filter(p => p.status === "bezahlt").reduce((sum,p) => sum + p.amount, 0)

  const reset = () => { setEditingId(null); setProgramId(""); setPaymentDate(today()); setAmount("24.00"); setMethod("Überweisung"); setNote("") }

  const save = async () => {
    const numeric = Number(amount.replace(",", "."))
    if (!paymentDate || !Number.isFinite(numeric) || numeric < 0) { setError("Bitte Datum und einen gültigen Betrag eingeben."); return }
    setSaving(true); setError(null)
    try {
      if (editingId) {
        await updatePayment(editingId, { paymentDate, amount: numeric, paymentMethod: method, note })
      } else {
        await createPayment({ programId: programId || undefined, paymentDate, amount: numeric, paymentMethod: method, note })
      }
      reset(); await load()
    } catch (e) { setError(e instanceof Error ? e.message : "Zahlung konnte nicht gespeichert werden.") }
    finally { setSaving(false) }
  }

  const edit = (p: Payment) => {
    setEditingId(p.id); setProgramId(p.programId ?? ""); setPaymentDate(p.paymentDate); setAmount(p.amount.toFixed(2)); setMethod(p.paymentMethod); setNote(p.note ?? "")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const cancel = async (p: Payment) => {
    if (!window.confirm(`Zahlung über ${euro.format(p.amount)} wirklich stornieren? Der Eintrag bleibt erhalten.`)) return
    try { await cancelPayment(p.id); await load() } catch (e) { setError(e instanceof Error ? e.message : "Stornierung fehlgeschlagen.") }
  }

  const exportCsv = () => {
    const rows = [["Datum","Zugangscode","Betrag EUR","Zahlungsart","Status","Notiz"], ...visible.map(p => [p.paymentDate,p.accessCode ?? "",p.amount.toFixed(2).replace(".",","),p.paymentMethod,p.status,p.note ?? ""])]
    const csv = "\uFEFF" + rows.map(r => r.map(csvCell).join(";")).join("\r\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `pwa-einnahmen-${year}.csv`; a.click(); URL.revokeObjectURL(url)
  }

  return <div>
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div><h1 className="text-2xl font-semibold text-slate-900">Einnahmen</h1><p className="mt-1 text-sm text-slate-500">Kassenbuch für die Übungs-PWA · ohne Patientennamen</p></div>
      <button onClick={() => void load()} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Neu laden</button>
    </div>
    {error && <div className="mb-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 font-semibold text-slate-800">{editingId ? "Zahlung korrigieren" : "Zahlung erfassen"}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <label className="text-sm text-slate-600">Datum<input type="date" value={paymentDate} onChange={e=>setPaymentDate(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /></label>
        <label className="text-sm text-slate-600">Programm / Code<select value={programId} disabled={Boolean(editingId)} onChange={e=>setProgramId(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 disabled:bg-slate-50"><option value="">Ohne Zuordnung</option>{programs.map(p=><option key={p.id} value={p.id}>{p.accessCode}</option>)}</select></label>
        <label className="text-sm text-slate-600">Betrag (€)<input inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /></label>
        <label className="text-sm text-slate-600">Zahlungsart<select value={method} onChange={e=>setMethod(e.target.value as PaymentMethod)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"><option>Überweisung</option><option>Bar</option><option>Sonstiges</option></select></label>
        <label className="text-sm text-slate-600">Notiz (optional)<input value={note} onChange={e=>setNote(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /></label>
      </div>
      <div className="mt-4 flex gap-2"><button disabled={saving} onClick={() => void save()} className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60">{saving ? "Speichert …" : editingId ? "Korrektur speichern" : "Zahlung speichern"}</button>{editingId && <button onClick={reset} className="rounded-xl border border-slate-200 px-4 py-2 text-sm">Abbrechen</button>}</div>
    </div>

    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3"><select value={year} onChange={e=>setYear(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2">{years.map(y=><option key={y}>{y}</option>)}</select><div className="rounded-xl bg-teal-50 px-4 py-2 font-semibold text-teal-800">Einnahmen {year}: {euro.format(total)}</div></div>
      <button onClick={exportCsv} disabled={visible.length===0} className="rounded-xl border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-700 hover:bg-teal-50 disabled:opacity-40">CSV exportieren</button>
    </div>

    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="px-4 py-3">Datum</th><th className="px-4 py-3">Code</th><th className="px-4 py-3">Betrag</th><th className="px-4 py-3">Zahlungsart</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Notiz</th><th className="px-4 py-3"></th></tr></thead>
      <tbody className="divide-y divide-slate-100">{loading ? <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-400">Wird geladen …</td></tr> : visible.length===0 ? <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-400">Noch keine Einträge für {year}.</td></tr> : visible.map(p=><tr key={p.id} className={p.status==="storniert" ? "text-slate-400" : "text-slate-700"}><td className="px-4 py-3">{dateLabel(p.paymentDate)}</td><td className="px-4 py-3 font-mono">{p.accessCode ?? "—"}</td><td className={`px-4 py-3 font-medium ${p.status==="storniert" ? "line-through" : ""}`}>{euro.format(p.amount)}</td><td className="px-4 py-3">{p.paymentMethod}</td><td className="px-4 py-3">{p.status}</td><td className="px-4 py-3">{p.note ?? "—"}</td><td className="px-4 py-3 text-right">{p.status==="bezahlt" && <div className="flex justify-end gap-2"><button onClick={()=>edit(p)} className="text-teal-700 hover:underline">Korrigieren</button><button onClick={()=>void cancel(p)} className="text-red-500 hover:underline">Stornieren</button></div>}</td></tr>)}</tbody></table>
    </div>
    <p className="mt-3 text-xs text-slate-400">Stornierte Zahlungen bleiben zur Nachvollziehbarkeit erhalten und werden nicht in die Jahressumme eingerechnet.</p>
  </div>
}
