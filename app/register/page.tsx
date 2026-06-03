"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLang, useAuth } from "@/app/layout"
import { Loader2, BookOpen } from "lucide-react"
import { toast } from "sonner"

export default function Register() {
  const { t, lang } = useLang()
  const { register } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try {
      const u = await register(email, password, name, lang)
      toast.success(`Bienvenue ${u.name} !`); router.push("/dashboard")
    } catch (err: any) { toast.error(err.message || t("common.error")) }
    finally { setLoading(false) }
  }

  return (
    <div className="paper-texture min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-stavi-paper">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-stavi-terracotta to-stavi-peach flex items-center justify-center text-white"><BookOpen size={20} /></span>
          <span className="font-display text-2xl font-semibold">Stavi</span>
        </div>
        <h1 className="font-display text-3xl font-semibold mb-2">{t("auth.join")}</h1>
        <p className="text-stavi-inkSoft mb-8">{t("auth.register")}</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div><label className="block text-sm font-semibold mb-1.5">{t("auth.name")}</label><input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-stavi-cream border border-stavi-paper focus:outline-none focus:border-stavi-terracotta" /></div>
          <div><label className="block text-sm font-semibold mb-1.5">{t("auth.email")}</label><input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-stavi-cream border border-stavi-paper focus:outline-none focus:border-stavi-terracotta" /></div>
          <div><label className="block text-sm font-semibold mb-1.5">{t("auth.password")}</label><input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-stavi-cream border border-stavi-paper focus:outline-none focus:border-stavi-terracotta" /></div>
          <button disabled={loading} className="btn-primary w-full disabled:opacity-50">{loading ? <Loader2 className="animate-spin" size={18} /> : t("auth.register")}</button>
        </form>
        <p className="mt-6 text-sm text-stavi-inkSoft text-center">{t("auth.haveAccount")} <Link href="/login" className="text-stavi-terracotta font-semibold">{t("auth.login")}</Link></p>
      </div>
    </div>
  )
}