"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLang, useAuth } from "@/app/layout"
import { Heart, HelpCircle, HeartHandshake, Loader2, ArrowRight, Sparkles } from "lucide-react"
import { toast } from "sonner"

const PRESETS = [10, 25, 50, 100]

export default function Donate() {
  const { t } = useLang()
  const { user, token } = useAuth()
  const router = useRouter()
  const [amount, setAmount] = useState(25)
  const [loading, setLoading] = useState(false)

  const onDonate = async () => {
    if (!user) { toast.info(t("aid.loginRequired")); router.push("/login"); return }
    setLoading(true)
    try {
      const r = await fetch("/api/checkout/session", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ item_type: "donation", donation_amount: amount, origin_url: window.location.origin, currency: "chf" }) })
      const data = await r.json(); if (!r.ok) throw new Error(data.detail)
      window.location.href = data.url
    } catch (e: any) { toast.error(e.message || t("common.error")); setLoading(false) }
  }

  return (
    <div className="paper-texture min-h-screen py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-stavi-terracotta font-semibold text-sm uppercase tracking-wider mb-3">{t("nav.donate")}</div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-stavi-ink leading-tight mb-4">{t("donate.title")}</h1>
          <p className="text-lg text-stavi-inkSoft max-w-2xl mx-auto">{t("donate.subtitle")}</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="relative bg-gradient-to-br from-stavi-terracotta to-stavi-peach rounded-3xl p-8 text-white shadow-xl overflow-hidden flex flex-col">
            <Heart size={36} className="mb-4 fill-white" />
            <h2 className="font-display text-2xl font-semibold mb-2">{t("donate.give.title")}</h2>
            <p className="text-white/90 text-sm mb-5 flex-1">{t("donate.give.desc")}</p>
            <div className="flex flex-wrap gap-2 mb-4">{PRESETS.map(p => <button key={p} onClick={() => setAmount(p)} className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${amount===p?"bg-white text-stavi-terracotta":"bg-white/15 text-white hover:bg-white/25"}`}>{p} CHF</button>)}</div>
            <input type="number" min="1" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} className="w-full px-4 py-2 rounded-xl text-stavi-ink text-center font-display font-semibold focus:outline-none mb-4" />
            <button onClick={onDonate} disabled={loading} className="bg-white text-stavi-terracotta px-6 py-3 rounded-xl font-semibold hover:-translate-y-1 hover:shadow-2xl transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <><Heart size={16} className="fill-stavi-terracotta" />{t("donate.give")} {amount} CHF</>}
            </button>
          </div>
          <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-stavi-paper flex flex-col">
            <span className="w-12 h-12 rounded-2xl bg-stavi-sage/20 flex items-center justify-center text-stavi-sage mb-4"><HelpCircle size={24} /></span>
            <h2 className="font-display text-2xl font-semibold mb-2 text-stavi-ink">{t("donate.aid.title")}</h2>
            <p className="text-stavi-inkSoft text-sm mb-5 flex-1">{t("donate.aid.desc")}</p>
            <Link href="/aid-request" className="btn-outline">{t("donate.aid.cta")} <ArrowRight size={14} className="ml-2" /></Link>
          </div>
          <div className="relative bg-stavi-paper rounded-3xl p-8 shadow-xl border border-stavi-sun/30 flex flex-col">
            <span className="w-12 h-12 rounded-2xl bg-stavi-sun/40 flex items-center justify-center text-stavi-terracottaDeep mb-4"><HeartHandshake size={24} /></span>
            <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-stavi-terracotta mb-2"><Sparkles size={12} /> Prochainement</div>
            <h2 className="font-display text-2xl font-semibold mb-2 text-stavi-ink">{t("donate.therapy.title")}</h2>
            <p className="text-stavi-inkSoft text-sm mb-5 flex-1">{t("donate.therapy.desc")}</p>
            <a href="mailto:hello@stavi.fr?subject=Fonds Thérapie Stavi" className="btn-secondary text-center">{t("donate.therapy.cta")}</a>
          </div>
        </div>
      </div>
    </div>
  )
}