"use client"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useLang, useAuth } from "@/app/layout"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

export default function CheckoutSuccess() {
  const { t } = useLang()
  const { token } = useAuth()
  const [params] = useSearchParams() as any
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [status, setStatus] = useState("checking")
  const attempts = useRef(0)

  useEffect(() => {
    if (!sessionId) return
    let cancelled = false
    const poll = async () => {
      if (cancelled) return
      try {
        const r = await fetch(`/api/checkout/status/${sessionId}`)
        const d = await r.json()
        if (d.payment_status === "paid") { setStatus("paid"); return }
        if (d.status === "expired") { setStatus("expired"); return }
        attempts.current += 1
        if (attempts.current >= 8) { setStatus("timeout"); return }
        setTimeout(poll, 2000)
      } catch { setStatus("error") }
    }
    poll()
    return () => { cancelled = true }
  }, [sessionId])

  return (
    <div className="paper-texture min-h-screen flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-3xl p-10 sm:p-16 text-center max-w-md shadow-xl border border-stavi-paper">
        {status === "checking" && <><Loader2 size={48} className="mx-auto text-stavi-terracotta animate-spin mb-4" /><p className="text-stavi-inkSoft">{t("checkout.processing")}</p></>}
        {status === "paid" && <><CheckCircle2 size={56} className="mx-auto text-stavi-sage mb-4" /><h1 className="font-display text-3xl font-semibold mb-3">{t("checkout.success")}</h1><p className="text-stavi-inkSoft mb-6">{t("checkout.successDesc")}</p><Link href="/dashboard" className="btn-primary">{t("checkout.toLibrary")}</Link></>}
        {["expired","timeout","error"].includes(status) && <><XCircle size={48} className="mx-auto text-stavi-muted mb-4" /><p className="text-stavi-inkSoft mb-6">Veuillez vérifier votre email ou réessayer.</p><Link href="/shop" className="btn-outline">{t("checkout.backShop")}</Link></>}
      </div>
    </div>
  )
}