"use client"
import { useEffect, useState } from "react"
import { useLang } from "@/app/layout"
import { Calendar, MapPin, ExternalLink } from "lucide-react"

export default function Events() {
  const { t, lang } = useLang()
  const [events, setEvents] = useState<any[]>([])
  useEffect(() => { fetch("/api/events").then(r => r.json()).then(setEvents) }, [])
  return (
    <div className="paper-texture min-h-screen py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="text-stavi-terracotta font-semibold text-sm uppercase tracking-wider mb-3">{t("nav.events")}</div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-stavi-ink leading-tight mb-4">{t("events.title")}</h1>
          <p className="text-lg text-stavi-inkSoft">{t("events.subtitle")}</p>
        </div>
        {events.length === 0 ? <div className="text-center py-16 text-stavi-muted">{t("events.empty")}</div> : (
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((e: any) => {
              const title = lang === "en" ? e.title_en : e.title_fr
              const desc = lang === "en" ? e.description_en : e.description_fr
              return (
                <div key={e.id} className="card-soft">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="w-12 h-12 rounded-2xl bg-stavi-sun/40 flex items-center justify-center text-stavi-terracotta flex-shrink-0"><Calendar size={20} /></span>
                    <div><div className="font-display text-xl font-semibold mb-1">{title}</div><div className="text-sm text-stavi-muted">{new Date(e.date).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}</div></div>
                  </div>
                  <p className="text-stavi-inkSoft mb-3">{desc}</p>
                  <div className="flex items-center gap-2 text-sm text-stavi-inkSoft"><MapPin size={14} /> {e.location}</div>
                  {e.link && <a href={e.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-stavi-terracotta">Détails <ExternalLink size={12} /></a>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}