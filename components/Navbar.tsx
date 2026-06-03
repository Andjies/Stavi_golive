"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { useLang, useAuth } from "@/app/layout"
import { Menu, X, BookOpen, Globe, User, LogOut, Shield } from "lucide-react"

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href)
  return (
    <Link href={href} className={`relative px-3 py-2 text-[15px] font-semibold transition-colors duration-200 ${active ? "text-stavi-terracotta" : "text-stavi-ink hover:text-stavi-terracotta"}`}>
      {children}
    </Link>
  )
}

export default function Navbar() {
  const { t, lang, setLang } = useLang()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const onLogout = () => { logout(); router.push("/") }

  return (
    <header className="sticky top-0 z-50 bg-stavi-cream/85 backdrop-blur-md border-b border-stavi-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-stavi-terracotta to-stavi-peach flex items-center justify-center text-white shadow-sm group-hover:rotate-6 transition-transform">
              <BookOpen size={20} strokeWidth={2.4} />
            </span>
            <span className="font-display text-2xl font-semibold text-stavi-ink tracking-tight">Stavi</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <NavItem href="/">{t("nav.home")}</NavItem>
            <NavItem href="/shop">{t("nav.shop")}</NavItem>
            <NavItem href="/story">{t("nav.story")}</NavItem>
            <NavItem href="/community">{t("nav.community")}</NavItem>
            <NavItem href="/events">{t("nav.events")}</NavItem>
            <NavItem href="/donate">{t("nav.donate")}</NavItem>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <button onClick={() => setLang(lang === "fr" ? "en" : "fr")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stavi-paper text-stavi-ink text-sm font-bold hover:bg-stavi-sun transition-colors">
              <Globe size={14} />{lang.toUpperCase()}
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                {user.role === "admin" && (
                  <Link href="/admin" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-stavi-night hover:bg-stavi-paper transition-colors">
                    <Shield size={16} />{t("nav.admin")}
                  </Link>
                )}
                <Link href="/dashboard" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-stavi-ink hover:bg-stavi-paper transition-colors">
                  <User size={16} />{user.name}
                </Link>
                <button onClick={onLogout} className="p-2 rounded-xl text-stavi-muted hover:text-stavi-terracotta hover:bg-stavi-paper transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-stavi-ink hover:text-stavi-terracotta px-3 py-2">{t("nav.login")}</Link>
                <Link href="/register" className="btn-primary !py-2 !px-5 !text-sm">{t("nav.register")}</Link>
              </>
            )}
          </div>

          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-xl text-stavi-ink">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden pb-4 space-y-1">
            {["/", "/shop", "/story", "/community", "/events", "/donate"].map((p, i) => {
              const labels = [t("nav.home"), t("nav.shop"), t("nav.story"), t("nav.community"), t("nav.events"), t("nav.donate")]
              return (
                <Link key={p} href={p} onClick={() => setOpen(false)} className="block px-4 py-3 rounded-xl text-base font-semibold text-stavi-ink hover:bg-stavi-paper">
                  {labels[i]}
                </Link>
              )
            })}
            <div className="pt-2 border-t border-stavi-paper flex flex-wrap gap-2">
              <button onClick={() => setLang(lang === "fr" ? "en" : "fr")} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stavi-paper text-sm font-bold">
                <Globe size={14} />{lang.toUpperCase()}
              </button>
              {user ? (
                <>
                  {user.role === "admin" && <Link href="/admin" onClick={() => setOpen(false)} className="px-3 py-2 rounded-xl text-sm font-semibold bg-stavi-night text-white">Admin</Link>}
                  <Link href="/dashboard" onClick={() => setOpen(false)} className="px-3 py-2 rounded-xl text-sm font-semibold bg-stavi-sun">{t("nav.dashboard")}</Link>
                  <button onClick={() => { onLogout(); setOpen(false) }} className="px-3 py-2 rounded-xl text-sm font-semibold text-stavi-terracotta">{t("nav.logout")}</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="px-3 py-2 rounded-xl text-sm font-semibold">{t("nav.login")}</Link>
                  <Link href="/register" onClick={() => setOpen(false)} className="btn-primary !py-2 !px-4 !text-sm">{t("nav.register")}</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
