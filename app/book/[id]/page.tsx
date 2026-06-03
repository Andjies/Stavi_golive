"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useLang, useAuth } from "@/app/layout"
import { Check, ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function BookDetail() {
  const { id } = useParams<{ id: string }>()
  const { t, lang } = useLang()
  const { user, token } = useAuth()
  const router = useRouter()
  const [book, setBook] = useState<any>(null)
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/books/${id}`).then(r => r.ok ? r.json() : null).then(b => b ? setBook(b) : router.push("/shop"))
    fetch("/api/settings/public").then(r => r.json()).then(setSettings)
  }, [id])

  const onBuy = async () => {
    if (!user) { toast.info("Connectez-vous pour acheter"); router.push("/login"); return }
    setLoading(true)
    try {
      const r = await fetch("/api/checkout/session", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ item_type: "book", item_id: id, origin_url: window.location.origin, currency: "chf" }) })
      const data = await r.json()
      if (!r.ok) throw new Error(data.detail)
      window.location.href = data.url
    } catch (e: any) { toast.error(e.message || t("common.error")); setLoading(false) }
  }

  if (!book) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-stavi-terracotta" size={32} /></div>

  const title = lang === "en" ? book.title_en : book.title_fr
  const subtitle = lang === "en" ? book.subtitle_en : book.subtitle_fr
  const description = lang === "en" ? book.description_en : book.description_fr

  return (
    <div className="paper-texture min-h-screen py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/shop" className="inline-flex items-center gap-1 text-stavi-inkSoft hover:text-stavi-terracotta mb-8 font-semibold"><ArrowLeft size={16} /> {t("nav.shop")}</Link>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="relative">
            <div className="absolute -inset-4 bg-stavi-sun/30 rounded-[2.5rem] -z-10" />
            {book.cover_url ? <img src={book.cover_url} alt={title} className="rounded-3xl shadow-2xl w-full" /> : <div className="rounded-3xl shadow-2xl w-full aspect-[3/4] bg-gradient-to-br from-stavi-sun/60 to-stavi-peach/60 flex items-center justify-center"><p className="font-display text-2xl text-stavi-ink text-center px-8">{title}</p></div>}
          </div>
          <div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-stavi-ink leading-tight mb-3">{title}</h1>
            <p className="text-xl text-stavi-inkSoft mb-6">{subtitle}</p>
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-stavi-paper">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="font-display text-4xl font-semibold text-stavi-terracotta">{book.price_ebook?.toFixed(2)} CHF</span>
                <span className="text-sm text-stavi-muted">{t("shop.ebook")}</span>
              </div>
              <button onClick={onBuy} disabled={loading} className="btn-primary mt-4 w-full disabled:opacity-50">
                {loading ? <><Loader2 size={18} className="animate-spin mr-2" />{t("common.loading")}</> : t("book.buy")}
              </button>
            </div>
            <div className="bg-stavi-paper/60 rounded-2xl p-6 mb-6 border border-stavi-sun/30">
              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <div><div className="flex items-baseline gap-3"><span className="font-display text-2xl font-semibold text-stavi-ink">{book.price_print?.toFixed(2)} CHF</span><span className="text-sm text-stavi-muted">{t("shop.paper")}</span></div></div>
                <span className="tag bg-stavi-sun text-stavi-ink font-bold">{t("shop.paperSoon")}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                {[["🇨🇭 Suisse", settings.shipping_ch||5], ["🇪🇺 Europe", settings.shipping_eu||10], ["🌍 Monde", settings.shipping_world||15]].map(([l, p]) => (
                  <div key={l as string} className="bg-white rounded-lg p-2 text-center border border-stavi-paper"><div className="font-bold text-stavi-ink">{l}</div><div className="text-stavi-muted">{(p as number).toFixed(2)} CHF</div></div>
                ))}
              </div>
            </div>
            <h3 className="font-display text-xl font-semibold mb-3">{t("book.about")}</h3>
            <p className="text-stavi-inkSoft leading-relaxed mb-6">{description}</p>
            <h3 className="font-display text-xl font-semibold mb-3">{t("book.included")}</h3>
            <ul className="space-y-2 text-stavi-inkSoft">
              {["book.included.1","book.included.2","book.included.3"].map(k => (
                <li key={k} className="flex items-center gap-2"><Check size={18} className="text-stavi-sage" />{t(k)}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}