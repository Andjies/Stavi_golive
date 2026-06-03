"use client"
import Link from "next/link"
import { useLang } from "@/app/layout"
import { ArrowRight, Sparkles } from "lucide-react"

interface Book { id: string; slug: string; title_fr: string; title_en: string; subtitle_fr: string; subtitle_en: string; cover_url: string; price_ebook: number }

export default function BookCard({ book }: { book: Book }) {
  const { lang, t } = useLang()
  const title = lang === "en" ? book.title_en : book.title_fr
  const subtitle = lang === "en" ? book.subtitle_en : book.subtitle_fr
  return (
    <Link href={`/book/${book.id}`} className="card-soft flex flex-col group">
      <div className="aspect-[3/4] rounded-xl overflow-hidden bg-stavi-paper mb-4">
        {book.cover_url ? (
          <img src={book.cover_url} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stavi-muted bg-stavi-paper">
            <span className="font-display text-center px-4 text-sm">{title}</span>
          </div>
        )}
      </div>
      <h3 className="font-display text-xl font-semibold text-stavi-ink leading-tight mb-1">{title}</h3>
      <p className="text-sm text-stavi-inkSoft mb-4 line-clamp-2 flex-1">{subtitle}</p>
      <div className="flex items-center justify-between">
        <span className="font-display text-2xl font-semibold text-stavi-terracotta">{book.price_ebook.toFixed(2)} CHF</span>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-stavi-sage">
          {t("shop.ebook")} <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  )
}

export function BundleCard({ bundlePrice = 49.99, onBuy }: { bundlePrice?: number; onBuy?: () => void }) {
  const { t } = useLang()
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stavi-terracotta to-stavi-peach text-white p-8 sm:p-12 shadow-[0_20px_60px_-15px_rgba(224,122,95,0.5)]">
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-stavi-sun/30 rounded-full blur-3xl" />
      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 bg-stavi-sun text-stavi-ink px-4 py-1.5 rounded-full text-sm font-bold mb-4 shadow-md">
          <Sparkles size={14} /> {t("home.pack.save")}
        </div>
        <h3 className="font-display text-3xl sm:text-4xl font-semibold mb-3 leading-tight">{t("home.pack.title")}</h3>
        <p className="text-white/95 text-lg mb-2">{t("home.pack.subtitle")}</p>
        <p className="text-stavi-sun font-bold text-base mb-6">{t("home.pack.bonus")}</p>
        <div className="flex flex-wrap items-end gap-6">
          {onBuy ? (
            <button onClick={onBuy} className="inline-flex items-center gap-2 bg-white text-stavi-terracotta rounded-xl px-7 py-3 font-semibold hover:-translate-y-1 hover:shadow-xl transition-all">
              Acheter le pack <ArrowRight size={16} />
            </button>
          ) : (
            <Link href="/shop#bundle" className="inline-flex items-center gap-2 bg-white text-stavi-terracotta rounded-xl px-7 py-3 font-semibold hover:-translate-y-1 hover:shadow-xl transition-all">
              {t("home.pack.cta")} <ArrowRight size={16} />
            </Link>
          )}
          <div className="text-white">
            <div className="text-xs uppercase tracking-wider opacity-70">au lieu de <span className="line-through">79.90 CHF</span></div>
            <div className="font-display text-4xl font-semibold leading-none">{bundlePrice.toFixed(2)} CHF</div>
          </div>
        </div>
      </div>
    </div>
  )
}
