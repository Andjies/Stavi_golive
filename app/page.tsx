"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useLang } from "@/app/layout"
import BookCard, { BundleCard } from "@/components/BookCard"
import { ArrowRight, BookOpen, Heart, Sparkles } from "lucide-react"

export default function Home() {
  const { t } = useLang()
  const [books, setBooks] = useState<any[]>([])
  const [bundlePrice, setBundlePrice] = useState(49.99)

  useEffect(() => {
    fetch("/api/books").then(r => r.json()).then(setBooks).catch(() => {})
    fetch("/api/settings/public").then(r => r.json()).then(d => setBundlePrice(d.bundle_price || 49.99)).catch(() => {})
  }, [])

  return (
    <div className="paper-texture">
      {/* HERO */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="absolute -top-32 -right-24 w-96 h-96 bg-stavi-sun/40 animate-blob blur-3xl opacity-70" />
        <div className="absolute -bottom-40 -left-20 w-[28rem] h-[28rem] bg-stavi-sage/30 animate-blob blur-3xl opacity-70" style={{ animationDelay: "3s" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-stavi-sun/40 px-4 py-2 rounded-full text-sm font-semibold text-stavi-night mb-6">
                <Sparkles size={14} className="text-stavi-terracotta" /> {t("hero.eyebrow")}
              </div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] text-stavi-ink mb-6">
                {t("hero.title").split("\n").map((line: string, i: number) => (
                  <span key={i} className="block">{i === 1 ? <span className="text-stavi-terracotta">{line}</span> : line}</span>
                ))}
              </h1>
              <p className="text-lg sm:text-xl text-stavi-inkSoft leading-relaxed mb-8 max-w-xl">{t("hero.subtitle")}</p>
              <div className="flex flex-wrap gap-4 items-center">
                <Link href="/shop" className="btn-primary">{t("hero.cta")} <ArrowRight size={18} className="ml-2" /></Link>
                <Link href="/story" className="btn-outline">{t("hero.cta2")}</Link>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm text-stavi-muted">
                <BookOpen size={16} /> {t("hero.badge")}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-stavi-sun/40 via-stavi-peach/30 to-stavi-terracotta/30 rounded-[3rem] animate-blob" />
              <div className="relative rounded-[2.5rem] shadow-2xl w-full aspect-square overflow-hidden animate-float-soft">
                <img src="/mom-stavi.png" alt="Maman et Stavi" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-4 sm:-left-8 bg-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-stavi-sage/20 flex items-center justify-center"><Heart size={18} className="text-stavi-sage fill-stavi-sage/60" /></span>
                <div>
                  <div className="text-xs text-stavi-muted">+ de 200 familles</div>
                  <div className="font-display font-semibold text-stavi-ink">déjà accompagnées</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTION */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-stavi-ink leading-tight">{t("home.collection.title")}</h2>
              <p className="mt-3 text-lg text-stavi-inkSoft max-w-2xl">{t("home.collection.subtitle")}</p>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-1 text-stavi-terracotta font-semibold hover:gap-2 transition-all">
              Voir les 10 livres <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.slice(0, 4).map((b) => <BookCard key={b.id} book={b} />)}
          </div>
        </div>
      </section>

      {/* BUNDLE */}
      <section className="pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BundleCard bundlePrice={bundlePrice} />
        </div>
      </section>

      {/* STORY TEASER */}
      <section className="py-20 sm:py-28 bg-stavi-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-stavi-terracotta font-semibold text-sm uppercase tracking-wider mb-3">Notre histoire</div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-stavi-ink leading-tight mb-6">{t("home.story.title")}</h2>
            <p className="text-lg text-stavi-inkSoft leading-relaxed mb-8 max-w-xl">{t("story.body1")}</p>
            <Link href="/story" className="btn-secondary">Lire notre histoire <ArrowRight size={16} className="ml-2" /></Link>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-stavi-terracotta/10 rounded-[2.5rem]" />
            <div className="relative rounded-3xl overflow-hidden aspect-video shadow-xl">
              <img src="/mom-stavi.png" alt="Maman et Stavi" className="w-full h-full object-cover object-top" />
              <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur rounded-xl px-3 py-1 text-xs font-semibold text-stavi-ink italic">"Pour mon petit garçon."</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
