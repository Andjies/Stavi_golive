"use client"
import { useState } from "react"
import { useLang, useAuth } from "@/app/layout"
import { QUIZ_QUESTIONS, computeRecommendations } from "@/lib/quiz"
import type { QuizAnswer } from "@/lib/quiz"
import { ClipboardList, CheckCircle2, ArrowRight, RotateCcw, Info } from "lucide-react"

type Answers = Record<string, QuizAnswer>

const PRIORITY_CONFIG = {
  urgent: { labelFr: "🔴 Priorité 1 — Commencer tout de suite", labelEn: "🔴 Priority 1 — Start right away", bg: "bg-red-50 border-red-200" },
  reinforce: { labelFr: "🟡 Priorité 2 — Renforcer régulièrement", labelEn: "🟡 Priority 2 — Reinforce regularly", bg: "bg-stavi-sun/20 border-stavi-sun/40" },
  maintain: { labelFr: "🟢 Acquis — Maintenir", labelEn: "🟢 Acquired — Maintain", bg: "bg-stavi-sage/10 border-stavi-sage/20" },
}

const BOOK_TITLES: Record<number, { fr: string; en: string }> = {
  1: { fr: "L1 — Stavi et les toilettes", en: "B1 — Stavi and the toilet" },
  2: { fr: "L2 — Stavi marche en sécurité avec Nicky", en: "B2 — Stavi walks safely with Nicky" },
  3: { fr: "L3 — Stavi joue au Playland", en: "B3 — Stavi at the Playland" },
  4: { fr: "L4 — Stavi au Parc", en: "B4 — Stavi at the Park" },
  5: { fr: "L5 — Stavi s'habille tout seul", en: "B5 — Stavi dresses himself" },
  6: { fr: "L6 — Stavi range ses affaires", en: "B6 — Stavi tidies up" },
  7: { fr: "L7 — Stavi mange à table", en: "B7 — Stavi eats at the table" },
  8: { fr: "L8 — Stavi demande ce qu'il veut", en: "B8 — Stavi asks for what he wants" },
  9: { fr: "L9 — Stavi joue avec Anaïs", en: "B9 — Stavi plays with Anaïs" },
  10: { fr: "L10 — Stavi apprend à couper sa nourriture", en: "B10 — Stavi learns to cut his food" },
}

export default function Quiz() {
  const { t, lang } = useLang()
  const { user, token } = useAuth()
  const [answers, setAnswers] = useState<Answers>({})
  const [done, setDone] = useState(false)
  const [saved, setSaved] = useState(false)

  const allAnswered = QUIZ_QUESTIONS.every(q => answers[q.id])
  const recs = done ? computeRecommendations(answers) : []

  const finish = async () => {
    setDone(true)
    // Si connecté, on sauvegarde les résultats
    if (user && token) {
      try {
        await fetch("/api/my/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ answers }),
        })
        setSaved(true)
      } catch { /* silencieux */ }
    }
  }

  const reset = () => { setAnswers({}); setDone(false); setSaved(false) }

  if (done) {
    const urgent = recs.filter(r => r.priority === "urgent")
    const reinforce = recs.filter(r => r.priority === "reinforce")
    const maintain = recs.filter(r => r.priority === "maintain")

    return (
      <div className="paper-texture min-h-screen py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <CheckCircle2 size={48} className="text-stavi-sage mx-auto mb-3" />
            <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-3">
              {lang === "fr" ? "Vos recommandations personnalisées" : "Your personalised recommendations"}
            </h1>
            <p className="text-stavi-inkSoft">
              {lang === "fr"
                ? "Basé sur vos réponses, voici les livres à privilégier pour accompagner votre enfant."
                : "Based on your answers, here are the books to prioritise for your child."}
            </p>
            {saved && (
              <span className="inline-block mt-3 text-xs bg-stavi-sage/20 text-stavi-sage px-3 py-1 rounded-full">
                ✓ {lang === "fr" ? "Résultats sauvegardés dans votre compte" : "Results saved to your account"}
              </span>
            )}
          </div>

          {urgent.length > 0 && (
            <div className="mb-8">
              <h2 className="font-display text-xl font-semibold mb-4 text-red-600">{lang === "fr" ? PRIORITY_CONFIG.urgent.labelFr : PRIORITY_CONFIG.urgent.labelEn}</h2>
              <div className="space-y-3">
                {urgent.map(r => (
                  <div key={r.orderIdx} className={`rounded-2xl p-4 border ${PRIORITY_CONFIG.urgent.bg} flex items-center justify-between`}>
                    <div>
                      <div className="font-semibold">{lang === "fr" ? BOOK_TITLES[r.orderIdx]?.fr : BOOK_TITLES[r.orderIdx]?.en}</div>
                      <div className="text-sm text-stavi-inkSoft">{lang === "fr" ? r.frequencyFr : r.frequencyEn}</div>
                    </div>
                    <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">URGENT</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {reinforce.length > 0 && (
            <div className="mb-8">
              <h2 className="font-display text-xl font-semibold mb-4 text-yellow-600">{lang === "fr" ? PRIORITY_CONFIG.reinforce.labelFr : PRIORITY_CONFIG.reinforce.labelEn}</h2>
              <div className="space-y-3">
                {reinforce.map(r => (
                  <div key={r.orderIdx} className={`rounded-2xl p-4 border ${PRIORITY_CONFIG.reinforce.bg} flex items-center justify-between`}>
                    <div>
                      <div className="font-semibold">{lang === "fr" ? BOOK_TITLES[r.orderIdx]?.fr : BOOK_TITLES[r.orderIdx]?.en}</div>
                      <div className="text-sm text-stavi-inkSoft">{lang === "fr" ? r.frequencyFr : r.frequencyEn}</div>
                    </div>
                    <span className="text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">À RENFORCER</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {maintain.length > 0 && (
            <div className="mb-8">
              <h2 className="font-display text-xl font-semibold mb-4 text-stavi-sage">{lang === "fr" ? PRIORITY_CONFIG.maintain.labelFr : PRIORITY_CONFIG.maintain.labelEn}</h2>
              <div className="space-y-2">
                {maintain.map(r => (
                  <div key={r.orderIdx} className={`rounded-2xl p-3 border ${PRIORITY_CONFIG.maintain.bg} flex items-center gap-3`}>
                    <CheckCircle2 size={16} className="text-stavi-sage" />
                    <span className="text-sm">{lang === "fr" ? BOOK_TITLES[r.orderIdx]?.fr : BOOK_TITLES[r.orderIdx]?.en}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-stavi-paper rounded-2xl p-5 border border-stavi-sun/30 flex gap-3 mb-8">
            <Info size={18} className="text-stavi-terracotta flex-shrink-0 mt-0.5" />
            <p className="text-sm text-stavi-inkSoft leading-relaxed">{t("quiz.disclaimer")}</p>
          </div>

          <div className="flex gap-4 flex-wrap">
            <a href="/shop" className="btn-primary">
              {lang === "fr" ? "Voir la boutique" : "See the shop"} <ArrowRight size={16} className="ml-1" />
            </a>
            <button onClick={reset} className="btn-outline flex items-center gap-2">
              <RotateCcw size={16} /> {lang === "fr" ? "Recommencer" : "Restart"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="paper-texture min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <ClipboardList size={40} className="text-stavi-sage mx-auto mb-3" />
          <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-3">{t("quiz.title")}</h1>
          <p className="text-stavi-inkSoft max-w-xl mx-auto">{t("quiz.subtitle")}</p>
        </div>

        <div className="space-y-6">
          {QUIZ_QUESTIONS.map(q => (
            <div key={q.id} className="bg-white rounded-2xl p-6 shadow-sm border border-stavi-paper">
              <div className="text-xs font-bold uppercase tracking-wider text-stavi-terracotta mb-2">{lang === "fr" ? q.domainFr : q.domainEn}</div>
              <p className="font-semibold text-stavi-ink mb-4">{lang === "fr" ? q.questionFr : q.questionEn}</p>
              <div className="space-y-2">
                {q.options.map(opt => (
                  <button key={opt.value} onClick={() => setAnswers({ ...answers, [q.id]: opt.value })}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm ${answers[q.id] === opt.value ? "border-stavi-terracotta bg-stavi-terracotta/5 text-stavi-ink font-semibold" : "border-stavi-paper hover:border-stavi-sun bg-stavi-cream/50"}`}>
                    {lang === "fr" ? opt.labelFr : opt.labelEn}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <div className="text-sm text-stavi-muted mb-4">{Object.keys(answers).length}/{QUIZ_QUESTIONS.length} {lang === "fr" ? "questions répondues" : "questions answered"}</div>
          <button onClick={finish} disabled={!allAnswered} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            {t("quiz.cta")} <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}
