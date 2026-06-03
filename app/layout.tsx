"use client"
import "./globals.css"
import { useState, createContext, useContext, useEffect, useCallback } from "react"
import { Toaster } from "sonner"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import type { Lang } from "@/lib/i18n"
import { STRINGS } from "@/lib/i18n"

/* ─── Language Context ─── */
interface LangCtx { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string }
export const LangContext = createContext<LangCtx>({ lang: "fr", setLang: () => {}, t: (k) => k })
export const useLang = () => useContext(LangContext)

/* ─── Auth Context ─── */
interface User { id: string; email: string; name: string; role: string; language: string }
interface AuthCtx { user: User | null; token: string | null; loading: boolean; login: (email: string, password: string) => Promise<User>; register: (email: string, password: string, name: string, language?: string) => Promise<User>; logout: () => void }
export const AuthContext = createContext<AuthCtx>({ user: null, token: null, loading: true, login: async () => { throw new Error() }, register: async () => { throw new Error() }, logout: () => {} })
export const useAuth = () => useContext(AuthContext)

export function apiFetch(path: string, options?: RequestInit, token?: string | null) {
  const headers: Record<string, string> = { "Content-Type": "application/json", ...(options?.headers as Record<string, string> || {}) }
  if (token) headers["Authorization"] = `Bearer ${token}`
  return fetch(`/api${path}`, { ...options, headers })
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr")
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const setLang = useCallback((l: Lang) => { setLangState(l); localStorage.setItem("stavi_lang", l) }, [])
  const t = useCallback((k: string) => (STRINGS[lang] as Record<string, string>)[k] ?? k, [lang])

  useEffect(() => {
    const savedLang = localStorage.getItem("stavi_lang") as Lang | null
    if (savedLang) setLangState(savedLang)
    const savedToken = localStorage.getItem("stavi_token")
    if (!savedToken) { setLoading(false); return }
    setToken(savedToken)
    fetch("/api/auth/me", { headers: { Authorization: `Bearer ${savedToken}` } })
      .then(r => r.ok ? r.json() : null)
      .then(u => { if (u) setUser(u); else { localStorage.removeItem("stavi_token"); setToken(null) } })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const r = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) })
    const data = await r.json()
    if (!r.ok) throw new Error(data.detail || "Erreur")
    setToken(data.token); setUser(data.user)
    localStorage.setItem("stavi_token", data.token)
    return data.user
  }

  const register = async (email: string, password: string, name: string, language = "fr") => {
    const r = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, name, language }) })
    const data = await r.json()
    if (!r.ok) throw new Error(data.detail || "Erreur")
    setToken(data.token); setUser(data.user)
    localStorage.setItem("stavi_token", data.token)
    return data.user
  }

  const logout = () => { setToken(null); setUser(null); localStorage.removeItem("stavi_token") }

  return (
    <html lang={lang}>
      <body>
        <LangContext.Provider value={{ lang, setLang, t }}>
          <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            <Navbar />
            <main className="min-h-[60vh]">{children}</main>
            <Footer />
            <Toaster position="top-center" richColors closeButton />
          </AuthContext.Provider>
        </LangContext.Provider>
      </body>
    </html>
  )
}
