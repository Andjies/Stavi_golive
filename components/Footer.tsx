"use client"
import Link from "next/link"
import { useLang } from "@/app/layout"
import { Heart, Mail, BookOpen } from "lucide-react"

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="mt-24 bg-stavi-night text-stavi-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-stavi-terracotta to-stavi-peach flex items-center justify-center text-white">
              <BookOpen size={20} />
            </span>
            <span className="font-display text-2xl font-semibold">Stavi</span>
          </Link>
          <p className="text-stavi-cream/80 max-w-md leading-relaxed">{t("footer.tagline")}</p>
          <p className="mt-6 text-stavi-cream/60 text-sm flex items-center gap-1">
            Fait avec <Heart size={14} className="text-stavi-terracotta fill-stavi-terracotta" /> pour nos enfants.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-lg mb-4">Explorer</h4>
          <ul className="space-y-2 text-stavi-cream/80 text-sm">
            <li><Link href="/shop" className="hover:text-stavi-sun">{t("nav.shop")}</Link></li>
            <li><Link href="/story" className="hover:text-stavi-sun">{t("nav.story")}</Link></li>
            <li><Link href="/community" className="hover:text-stavi-sun">{t("nav.community")}</Link></li>
            <li><Link href="/donate" className="hover:text-stavi-sun">{t("nav.donate")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold text-lg mb-4">{t("footer.contact")}</h4>
          <a href="mailto:hello@stavi.fr" className="flex items-center gap-2 text-stavi-cream/80 hover:text-stavi-sun text-sm">
            <Mail size={14} /> hello@stavi.fr
          </a>
        </div>
      </div>
      <div className="border-t border-stavi-cream/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-stavi-cream/50">
          © {new Date().getFullYear()} Stavi. {t("footer.rights")}
        </div>
      </div>
    </footer>
  )
}
