"use client"
import { useEffect, useRef, useState } from "react"
import { useLang, useAuth } from "@/app/layout"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import BookCard, { BundleCard } from "@/components/BookCard"

export default function Shop() {
  const { t } = useLang()
  const { user, token } = useAuth()
  const router = useRouter()
  const [books, setBooks] = useState<any[]>([])
  const [bundlePrice, setBundlePrice] = useState(49.99)
  const [buyingBundle, setBuyingBundle] = useState(false)
  const bundleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/books").then(r => r.json()).then(setBooks)
    fetch("/api/settings/public").then(r => r.json()).then(d => setBundlePrice(d.bundle_price || 49.99))
    if (window.location.hash === "#bundle") {
      setTimeout(() => bundleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300)
    }
  }, [])

  const buyBundle = async () => {
    if (!user) { toast.info("Connectez-vous pour acheter"); router.push("/login"); return }
    setBuyingBundle(true)
    try {
      const r = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ item_type: "bundle", origin_url: window.location.origin, currency: "chf" }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.detail)
      window.location.href = data.url
    } catch (e: any) { toast.error(e.message || t("common.error")); setBuyingBundle(false) }
  }

  return (
    <div className="paper-texture min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <div className="text-stavi-terracotta font-semibold text-sm uppercase tracking-wider mb-3">{t("nav.shop")}</div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-stavi-ink leading-tight">{t("shop.title")}</h1>
          <p className="mt-4 text-lg text-stavi-inkSoft">{t("shop.subtitle")}</p>
        </div>
        <div ref={bundleRef} id="bundle" className="mb-16 scroll-mt-24">
          {buyingBundle ? (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stavi-terracotta to-stavi-peach text-white p-8 sm:p-12 flex items-center justify-center min-h-[200px]">
              <div className="flex items-center gap-3 text-white font-display text-xl">
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                Redirection vers le paiement...
              </div>
            </div>
          ) : (
            <BundleCard bundlePrice={bundlePrice} onBuy={buyBundle} />
          )}
        </div>
        {/* CTA quiz */}
        <div className="mb-10 bg-white border border-stavi-sage/30 rounded-3xl p-6 flex items-center justify-between gap-4 flex-wrap shadow-sm">
          <div className="flex items-center gap-4">
            <span className="w-12 h-12 rounded-2xl bg-stavi-sage/20 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stavi-sage"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            </span>
            <div>
              <div className="font-display text-lg font-semibold text-stavi-ink">{t("quiz.title")}</div>
              <div className="text-sm text-stavi-inkSoft">Pas sûr·e par où commencer ? Faites notre questionnaire gratuit.</div>
            </div>
          </div>
          <a href="/quiz" className="btn-outline !py-2 !px-5 !text-sm flex-shrink-0">Démarrer le quiz →</a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map(b => <BookCard key={b.id} book={b} />)}
        </div>
      </div>
    </div>
  )
}