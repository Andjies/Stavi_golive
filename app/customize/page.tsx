"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLang, useAuth } from "@/app/layout"
import { Sparkles, Lock, Loader2, ArrowRight } from "lucide-react"
import { toast } from "sonner"

const cls = "w-full px-4 py-3 rounded-xl bg-stavi-cream border border-stavi-paper focus:outline-none focus:border-stavi-terracotta"
const labelCls = "block text-sm font-semibold mb-1.5"

export default function Customize() {
  const { t } = useLang()
  const { user, token } = useAuth()
  const router = useRouter()
  const [available, setAvailable] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    child_name: "",
    child_age: 4,
    child_traits: "",
    child_interests: "",
    theme_to_work: "",
    additional_notes: "",
  })

  useEffect(() => {
    if (!user) { router.push("/login"); return }
    fetch("/api/my/library", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setAvailable(d.personalization_available))
      .finally(() => setLoading(false))
  }, [user])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const r = await fetch("/api/customize", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, child_age: parseInt(String(form.child_age)) }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.detail)
      toast.success(t("customize.pending"))
      router.push("/dashboard")
    } catch (err: any) {
      toast.error(err.message || t("common.error"))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-stavi-terracotta" size={32} />
      </div>
    )
  }

  if (!available) {
    return (
      <div className="paper-texture min-h-screen flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl p-10 sm:p-16 text-center max-w-lg shadow-xl border border-stavi-paper">
          <Lock size={48} className="mx-auto text-stavi-muted mb-4" />
          <h1 className="font-display text-3xl font-semibold mb-3">{t("customize.title")}</h1>
          <p className="text-stavi-inkSoft mb-6">{t("customize.locked")}</p>
          <Link href="/shop#bundle" className="btn-primary">
            {t("customize.buyPack")} <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="paper-texture min-h-screen py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Sparkles size={36} className="text-stavi-terracotta mx-auto mb-3" />
          <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-3">{t("customize.title")}</h1>
          <p className="text-stavi-inkSoft">{t("customize.subtitle")}</p>
        </div>

        <form onSubmit={onSubmit} className="bg-white rounded-3xl p-8 shadow-xl border border-stavi-paper space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>{t("customize.childName")}</label>
              <input required type="text" value={form.child_name} onChange={e => setForm({ ...form, child_name: e.target.value })} className={cls} />
            </div>
            <div>
              <label className={labelCls}>{t("customize.childAge")}</label>
              <input required type="number" value={form.child_age} onChange={e => setForm({ ...form, child_age: parseInt(e.target.value) || 0 })} className={cls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>{t("customize.traits")}</label>
            <textarea required rows={2} value={form.child_traits} onChange={e => setForm({ ...form, child_traits: e.target.value })} className={cls + " resize-none"} />
          </div>

          <div>
            <label className={labelCls}>{t("customize.interests")}</label>
            <textarea required rows={2} value={form.child_interests} onChange={e => setForm({ ...form, child_interests: e.target.value })} className={cls + " resize-none"} />
          </div>

          <div>
            <label className={labelCls}>{t("customize.theme")}</label>
            <input required type="text" value={form.theme_to_work} onChange={e => setForm({ ...form, theme_to_work: e.target.value })} className={cls} />
          </div>

          <div>
            <label className={labelCls}>{t("customize.notes")}</label>
            <textarea rows={2} value={form.additional_notes} onChange={e => setForm({ ...form, additional_notes: e.target.value })} className={cls + " resize-none"} />
          </div>

          <button disabled={submitting} className="btn-primary w-full disabled:opacity-50">
            {submitting ? <Loader2 className="animate-spin" size={18} /> : t("customize.submit")}
          </button>
        </form>
      </div>
    </div>
  )
}
