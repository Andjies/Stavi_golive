"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLang, useAuth } from "@/app/layout"
import { HelpCircle, Loader2, CheckCircle2, Clock, XCircle } from "lucide-react"
import { toast } from "sonner"

export default function AidRequest() {
  const { t } = useLang()
  const { user, token } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({ family_situation:"", organism:"hospice_general", organism_other:"", child_difficulties:"", country:"CH", monthly_income_range:"" })
  const [file, setFile] = useState<File|null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { router.push("/login"); return }
    fetch("/api/my/aid-requests", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(setRequests).finally(() => setLoading(false))
  }, [user])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) { toast.error(t("aid.justificatif")); return }
    setSubmitting(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    fd.append("justificatif", file)
    try {
      const r = await fetch("/api/aid-requests", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd })
      const d = await r.json(); if (!r.ok) throw new Error(d.detail)
      toast.success(t("aid.pending"))
      const r2 = await fetch("/api/my/aid-requests", { headers: { Authorization: `Bearer ${token}` } })
      setRequests(await r2.json())
      setForm({ family_situation:"", organism:"hospice_general", organism_other:"", child_difficulties:"", country:"CH", monthly_income_range:"" }); setFile(null)
    } catch (e: any) { toast.error(e.message || t("common.error")) } finally { setSubmitting(false) }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-stavi-terracotta" size={32} /></div>

  const statusBadge = (s: string) => {
    if (s==="approved") return <span className="tag bg-stavi-sage/20 text-stavi-sage flex items-center gap-1"><CheckCircle2 size={12} /> {t("aid.status.approved")}</span>
    if (s==="rejected") return <span className="tag bg-red-100 text-red-700 flex items-center gap-1"><XCircle size={12} /> {t("aid.status.rejected")}</span>
    return <span className="tag bg-stavi-sun/40 text-stavi-terracottaDeep flex items-center gap-1"><Clock size={12} /> {t("aid.status.pending")}</span>
  }

  return (
    <div className="paper-texture min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10"><HelpCircle size={40} className="text-stavi-sage mx-auto mb-3" /><h1 className="font-display text-3xl sm:text-4xl font-semibold mb-3">{t("aid.title")}</h1><p className="text-stavi-inkSoft max-w-lg mx-auto">{t("aid.subtitle")}</p></div>
        {requests.length > 0 && (
          <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-stavi-paper">
            <h2 className="font-display text-xl font-semibold mb-4">{t("aid.myRequests")}</h2>
            <div className="space-y-3">
              {requests.map((r: any) => (
                <div key={r.id} className="flex items-start justify-between gap-3 pb-3 border-b border-stavi-paper last:border-0">
                  <div className="text-sm"><div className="font-semibold">{new Date(r.createdAt).toLocaleDateString()}</div><div className="text-stavi-muted">{r.childDifficulties}</div>{r.adminNote && <div className="text-stavi-inkSoft mt-1 italic">« {r.adminNote} »</div>}</div>
                  {statusBadge(r.status)}
                </div>
              ))}
            </div>
          </div>
        )}
        <form onSubmit={onSubmit} className="bg-white rounded-3xl p-8 shadow-xl border border-stavi-paper space-y-5">
          <div><label className="block text-sm font-semibold mb-1.5">{t("aid.situation")}</label><textarea required rows={3} value={form.family_situation} onChange={e => setForm({...form,family_situation:e.target.value})} placeholder={t("aid.situationPh")} className="w-full px-4 py-3 rounded-xl bg-stavi-cream border border-stavi-paper focus:outline-none focus:border-stavi-terracotta resize-none" /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold mb-1.5">{t("aid.organism")}</label><select required value={form.organism} onChange={e => setForm({...form,organism:e.target.value})} className="w-full px-4 py-3 rounded-xl bg-stavi-cream border border-stavi-paper focus:outline-none focus:border-stavi-terracotta">
              <option value="hospice_general">{t("aid.organism.hospice")}</option>
              <option value="pole_emploi">{t("aid.organism.poleemploi")}</option>
              <option value="caritas">{t("aid.organism.caritas")}</option>
              <option value="csp">{t("aid.organism.csp")}</option>
              <option value="autre">{t("aid.organism.autre")}</option>
            </select></div>
            <div><label className="block text-sm font-semibold mb-1.5">{t("aid.country")}</label><select required value={form.country} onChange={e => setForm({...form,country:e.target.value})} className="w-full px-4 py-3 rounded-xl bg-stavi-cream border border-stavi-paper focus:outline-none focus:border-stavi-terracotta"><option value="CH">🇨🇭 Suisse</option><option value="FR">🇫🇷 France</option><option value="BE">🇧🇪 Belgique</option><option value="autre">Autre</option></select></div>
          </div>
          {form.organism === "autre" && <div><label className="block text-sm font-semibold mb-1.5">{t("aid.organismOther")}</label><input type="text" value={form.organism_other} onChange={e => setForm({...form,organism_other:e.target.value})} className="w-full px-4 py-3 rounded-xl bg-stavi-cream border border-stavi-paper focus:outline-none focus:border-stavi-terracotta" /></div>}
          <div><label className="block text-sm font-semibold mb-1.5">{t("aid.difficulties")}</label><textarea required rows={2} value={form.child_difficulties} onChange={e => setForm({...form,child_difficulties:e.target.value})} placeholder={t("aid.difficultiesPh")} className="w-full px-4 py-3 rounded-xl bg-stavi-cream border border-stavi-paper focus:outline-none focus:border-stavi-terracotta resize-none" /></div>
          <div><label className="block text-sm font-semibold mb-1.5">{t("aid.justificatif")}</label><input type="file" required accept=".pdf,.jpg,.jpeg,.png" onChange={e => setFile(e.target.files?.[0]||null)} className="w-full text-sm text-stavi-inkSoft" /><p className="text-xs text-stavi-muted mt-1">{t("aid.justificatifHelp")}</p></div>
          <button disabled={submitting} className="btn-primary w-full disabled:opacity-50">{submitting ? <Loader2 className="animate-spin" size={18} /> : t("aid.submit")}</button>
        </form>
      </div>
    </div>
  )
}