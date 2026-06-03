"use client"
import Link from "next/link"
import { useLang } from "@/app/layout"
import { XCircle } from "lucide-react"

export default function CheckoutCancel() {
  const { t } = useLang()
  return (
    <div className="paper-texture min-h-screen flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-3xl p-10 sm:p-16 text-center max-w-md shadow-xl border border-stavi-paper">
        <XCircle size={48} className="mx-auto text-stavi-muted mb-4" />
        <h1 className="font-display text-3xl font-semibold mb-3">{t("checkout.cancel")}</h1>
        <p className="text-stavi-inkSoft mb-6">{t("checkout.cancelDesc")}</p>
        <Link href="/shop" className="btn-primary">{t("checkout.backShop")}</Link>
      </div>
    </div>
  )
}