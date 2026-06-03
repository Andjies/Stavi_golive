"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLang, useAuth } from "@/app/layout"
import { Download, Sparkles, BookOpen, Clock, CheckCircle2, ClipboardList, FileText } from "lucide-react"
import { toast } from "sonner"

export default function Dashboard() {
  const { t, lang } = useLang()
  const { user, token } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<any>({ books:[], customizations:[], has_bundle:false, personalization_available:false })
  const [hasGuide, setHasGuide] = useState(false)

  useEffect(() => {
    if (!user) { router.push("/login"); return }
    const h = { Authorization: `Bearer ${token}` }
    fetch("/api/my/library", { headers: h }).then(r => r.json()).then(d => {
      setData(d)
      if (d.has_bundle) {
        fetch("/api/my/guide", { method: "HEAD", headers: h }).then(r => setHasGuide(r.ok))
      }
    })
  }, [user])

  const onDownload = async (bookId: string, slug: string) => {
    try {
      const r = await fetch(`/api/books/${bookId}/download`, { headers: { Authorization: `Bearer ${token}` } })
      if (!r.ok) { const d = await r.json(); throw new Error(d.detail); }
      const blob = await r.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a"); a.href = url; a.download = `${slug}.pdf`; a.click(); URL.revokeObjectURL(url)
    } catch (e: any) { toast.error(e.message || t("dashboard.pdfPending")) }
  }

  const onDownloadGuide = async () => {
    try {
      const r = await fetch("/api/my/guide", { headers: { Authorization: `Bearer ${token}` } })
      if (!r.ok) throw new Error()
      const blob = await r.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a"); a.href = url; a.download = "guide-stavi.pdf"; a.click(); URL.revokeObjectURL(url)
    } catch { toast.error(t("common.error")) }
  }

  const onDownloadCustom = async (cid: string) => {
    try {
      const r = await fetch(`/api/my/customizations/${cid}/download`, { headers: { Authorization: `Bearer ${token}` } })
      if (!r.ok) throw new Error(); const blob = await r.blob()
      const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "stavi-personnalise.pdf"; a.click(); URL.revokeObjectURL(url)
    } catch { toast.error(t("common.error")) }
  }

  if (!user) return null

  return (
    <div className="paper-texture min-h-screen py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-2">Bonjour, {user.name} 👋</h1>
        <p className="text-stavi-inkSoft mb-10">{t("dashboard.title")}</p>

        {data.personalization_available && (
          <Link href="/customize" className="block mb-10 bg-gradient-to-r from-stavi-sun to-stavi-peach rounded-3xl p-8 text-stavi-ink shadow-md hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 flex-wrap">
              <Sparkles size={32} />
              <div className="flex-1"><div className="font-display text-xl sm:text-2xl font-semibold mb-1">Votre livre personnalisé vous attend ✨</div><div className="text-sm">Cliquez ici pour créer le livre unique de votre enfant.</div></div>
              <span className="bg-stavi-ink text-white px-5 py-2 rounded-xl font-semibold">{t("customize.title")}</span>
            </div>
          </Link>
        )}

        <Link href="/quiz" className="block mb-6 bg-white border-2 border-stavi-sage/30 rounded-3xl p-6 hover:border-stavi-sage transition-colors">
          <div className="flex items-center gap-4">
            <ClipboardList size={28} className="text-stavi-sage" />
            <div className="flex-1">
              <div className="font-display text-lg font-semibold">{t("dashboard.quiz")}</div>
              <div className="text-sm text-stavi-inkSoft">Identifiez les livres prioritaires selon le profil de votre enfant — gratuit</div>
            </div>
          </div>
        </Link>

        {hasGuide && (
          <div className="mb-10 bg-gradient-to-r from-stavi-peach/40 to-stavi-sun/40 border-2 border-stavi-sun/50 rounded-3xl p-6">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="w-12 h-12 rounded-2xl bg-stavi-terracotta/20 flex items-center justify-center flex-shrink-0">
                <FileText size={24} className="text-stavi-terracotta" />
              </span>
              <div className="flex-1">
                <div className="font-display text-lg font-semibold">{t("dashboard.guide")}</div>
                <div className="text-sm text-stavi-inkSoft">Offert avec votre pack — guide complet psychomotricité &amp; orthophonie</div>
              </div>
              <button onClick={onDownloadGuide} className="btn-primary !py-2 !px-5 !text-sm flex items-center gap-2 flex-shrink-0">
                <Download size={14} />{t("dashboard.download")}
              </button>
            </div>
          </div>
        )}

        {data.customizations?.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-2"><Sparkles size={20} className="text-stavi-terracotta" /> {t("dashboard.customize")}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {data.customizations.map((c: any) => (
                <div key={c.id} className="card-soft">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div><div className="font-display text-lg font-semibold">Livre pour {c.childName}</div><div className="text-sm text-stavi-muted">{new Date(c.createdAt).toLocaleDateString()}</div></div>
                    {c.status === "delivered" ? <span className="tag bg-stavi-sage/20 text-stavi-sage flex items-center gap-1"><CheckCircle2 size={12} /> {t("customize.delivered")}</span> : <span className="tag bg-stavi-sun/40 text-stavi-terracottaDeep flex items-center gap-1"><Clock size={12} /> En cours</span>}
                  </div>
                  <p className="text-sm text-stavi-inkSoft mb-3">Thème : {c.themeToWork}</p>
                  {c.status === "delivered" && <button onClick={() => onDownloadCustom(c.id)} className="btn-primary !py-2 !px-4 !text-sm"><Download size={14} className="mr-1" /> {t("dashboard.download")}</button>}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-12">
          <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-2"><BookOpen size={20} className="text-stavi-terracotta" /> {t("dashboard.library")}</h2>
          {data.books.length === 0 ? (
            <div className="card-soft text-center py-12"><p className="text-stavi-inkSoft mb-4">{t("dashboard.empty")}</p><Link href="/shop" className="btn-primary">{t("nav.shop")}</Link></div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.books.map((b: any) => (
                <div key={b.id} className="card-soft">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-stavi-paper">
                    {b.cover_url ? <img src={b.cover_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><BookOpen size={32} className="text-stavi-muted" /></div>}
                  </div>
                  <div className="font-display font-semibold mb-3">{lang === "en" ? b.title_en : b.title_fr}</div>
                  {b.has_pdf ? <button onClick={() => onDownload(b.id, b.slug)} className="btn-primary !py-2 !px-4 !text-sm w-full"><Download size={14} className="mr-1" /> {t("dashboard.download")}</button> : <div className="text-sm text-stavi-muted text-center py-2">{t("dashboard.pdfPending")}</div>}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}