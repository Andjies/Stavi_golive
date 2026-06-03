"use client"
import { useLang } from "@/app/layout"
import { Heart } from "lucide-react"

export default function Story() {
  const { t } = useLang()
  return (
    <div className="paper-texture">
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-stavi-terracotta font-semibold text-sm uppercase tracking-wider mb-3">{t("nav.story")}</div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-stavi-ink leading-[1.1] mb-10">{t("story.title")}</h1>
          <div className="relative my-12">
            <div className="absolute -inset-6 bg-stavi-sun/25 rounded-[3rem] -z-10" />
            <img src="/mom-stavi.png" alt="Maman et Stavi" className="rounded-3xl shadow-xl w-full aspect-[16/9] object-cover" />
          </div>
          <div className="space-y-6 text-lg sm:text-xl text-stavi-inkSoft leading-relaxed">
            <p>{t("story.body1")}</p>
            <p>{t("story.body2")}</p>
            <p>{t("story.body3")}</p>
          </div>
          <div className="mt-16 bg-white rounded-3xl p-8 sm:p-12 border border-stavi-paper shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-full bg-stavi-terracotta/20 flex items-center justify-center">
                <Heart size={18} className="text-stavi-terracotta fill-stavi-terracotta" />
              </span>
              <span className="font-display text-2xl font-semibold">Notre mission</span>
            </div>
            <p className="text-lg text-stavi-inkSoft leading-relaxed">
              Créer des outils doux, simples et beaux pour accompagner les parents et leurs enfants TSA dans le quotidien.
              Construire une communauté chaleureuse. Et — quand on le peut — financer l'accès aux livres pour les familles qui ne peuvent pas.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}