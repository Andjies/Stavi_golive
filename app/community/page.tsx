"use client"
import { useEffect, useState } from "react"
import { useLang, useAuth } from "@/app/layout"
import { MessageCircle, Send, Users, ExternalLink, Loader2, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function Community() {
  const { t } = useLang()
  const { user, token, loading: authLoading } = useAuth()
  const [posts, setPosts] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [settings, setSettings] = useState<any>({})
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [posting, setPosting] = useState(false)
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({})
  const [commentText, setCommentText] = useState<Record<string, string>>({})

  const load = (p = page) => {
    fetch(`/api/community/posts?page=${p}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then(d => { setPosts(d.posts || []); setTotal(d.total || 0); setPages(d.pages || 1) })
      .catch(() => {})
    fetch("/api/settings/public").then(r => r.json()).then(setSettings).catch(() => {})
  }

  useEffect(() => { load(page) }, [page, token])

  const onPost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    setPosting(true)
    try {
      const r = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, content }),
      })
      if (!r.ok) throw new Error()
      setTitle(""); setContent("")
      load(1); setPage(1)
      const isAdmin = user && ["admin", "moderator"].includes(user.role)
      toast.success(isAdmin ? "Message publié !" : "Message envoyé — en attente de validation ✨")
    } catch { toast.error(t("common.error")) } finally { setPosting(false) }
  }

  const onComment = async (pid: string) => {
    const c = (commentText[pid] || "").trim()
    if (!c) return
    try {
      await fetch(`/api/community/posts/${pid}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: c }),
      })
      setCommentText({ ...commentText, [pid]: "" })
      load(page)
    } catch { toast.error(t("common.error")) }
  }

  return (
    <div className="paper-texture min-h-screen py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-stavi-terracotta font-semibold text-sm uppercase tracking-wider mb-3">{t("nav.community")}</div>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-stavi-ink leading-tight mb-4">{t("community.title")}</h1>
        <p className="text-lg text-stavi-inkSoft mb-10 max-w-2xl">{t("community.subtitle")}</p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <a href={settings.whatsapp_link_fr || "#"} target="_blank" rel="noopener noreferrer"
            className="card-soft bg-stavi-sage/10 border-stavi-sage/30 flex items-start gap-4">
            <span className="w-12 h-12 rounded-2xl bg-stavi-sage/30 flex items-center justify-center text-stavi-sage flex-shrink-0"><MessageCircle size={22} /></span>
            <div>
              <h3 className="font-display text-xl font-semibold mb-1">{t("community.whatsapp")}</h3>
              <span className="text-stavi-sage font-semibold text-sm inline-flex items-center gap-1">Rejoindre <ExternalLink size={12} /></span>
            </div>
          </a>
          <a href="mailto:hello@stavi.fr?subject=Devenir relais"
            className="card-soft bg-stavi-sun/20 border-stavi-sun/30 flex items-start gap-4">
            <span className="w-12 h-12 rounded-2xl bg-stavi-sun/50 flex items-center justify-center text-stavi-terracottaDeep flex-shrink-0"><Users size={22} /></span>
            <div>
              <h3 className="font-display text-xl font-semibold mb-1">{t("community.lead")}</h3>
              <span className="text-stavi-terracotta font-semibold text-sm">{t("community.leadBtn")}</span>
            </div>
          </a>
        </div>

        <h2 className="font-display text-2xl font-semibold mb-6">{t("community.forum")}</h2>

        {authLoading ? (
          <div className="bg-stavi-paper rounded-2xl p-6 mb-8 border border-stavi-sun/30 animate-pulse h-40" />
        ) : user ? (
          <form onSubmit={onPost} className="bg-white rounded-2xl p-6 mb-8 border-2 border-stavi-sun/40 shadow-sm space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display text-lg font-semibold">Partager avec la communauté</h3>
              {!["admin", "moderator"].includes(user.role) && (
                <span className="text-xs text-stavi-muted bg-stavi-paper px-3 py-1 rounded-full flex items-center gap-1">
                  <Clock size={11} /> Soumis à validation
                </span>
              )}
            </div>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder={t("community.postTitle")}
              className="w-full px-4 py-3 rounded-xl bg-stavi-cream border border-stavi-paper focus:outline-none focus:border-stavi-terracotta font-semibold" />
            <textarea value={content} onChange={e => setContent(e.target.value)}
              placeholder={t("community.postContent")} rows={3}
              className="w-full px-4 py-3 rounded-xl bg-stavi-cream border border-stavi-paper focus:outline-none focus:border-stavi-terracotta resize-none" />
            <button disabled={posting} className="btn-primary !py-2.5 !px-6 disabled:opacity-50">
              {posting ? <Loader2 size={16} className="animate-spin" /> : <><Send size={14} className="mr-2" />{t("community.publish")}</>}
            </button>
          </form>
        ) : (
          <div className="bg-stavi-paper rounded-2xl p-6 mb-8 text-center border border-stavi-sun/30">
            <p className="text-stavi-inkSoft mb-4">{t("community.loginToPost")}</p>
            <Link href="/login" className="btn-primary !py-2 !px-6 !text-sm">Se connecter</Link>
          </div>
        )}

        {/* Liste des posts */}
        <div className="space-y-4">
          {posts.length === 0 && (
            <div className="text-center py-12 text-stavi-muted">Soyez la première à partager quelque chose 💛</div>
          )}
          {posts.map((p: any) => (
            <div key={p.id} className={`card-soft ${p.status === "pending" ? "border-2 border-stavi-sun/50 bg-stavi-sun/5" : ""}`}>
              {p.status === "pending" && (
                <div className="flex items-center gap-1 text-xs text-stavi-terracotta font-semibold mb-2 bg-stavi-sun/20 px-3 py-1 rounded-full w-fit">
                  <Clock size={11} /> En attente de validation
                </div>
              )}
              <div className="flex items-start gap-3 mb-3">
                <span className="w-10 h-10 rounded-full bg-gradient-to-br from-stavi-sun to-stavi-peach flex items-center justify-center text-white font-display font-semibold flex-shrink-0">
                  {(p.userName || "?")[0].toUpperCase()}
                </span>
                <div><div className="font-semibold">{p.userName}</div><div className="text-xs text-stavi-muted">{new Date(p.createdAt).toLocaleDateString("fr-FR")}</div></div>
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{p.title}</h3>
              <p className="text-stavi-inkSoft whitespace-pre-line">{p.content}</p>
              <button onClick={() => setOpenComments({ ...openComments, [p.id]: !openComments[p.id] })}
                className="mt-3 text-sm text-stavi-terracotta font-semibold flex items-center gap-1">
                <MessageCircle size={14} /> {(p.comments || []).length} {t("community.reply")}
              </button>
              {openComments[p.id] && (
                <div className="mt-4 space-y-3 pl-4 border-l-2 border-stavi-paper">
                  {(p.comments || []).map((c: any) => (
                    <div key={c.id} className="text-sm">
                      <span className="font-semibold">{c.userName}</span>
                      <span className="text-stavi-muted text-xs ml-2">{new Date(c.createdAt).toLocaleDateString()}</span>
                      <div className="text-stavi-inkSoft">{c.content}</div>
                    </div>
                  ))}
                  {user && (
                    <div className="flex gap-2">
                      <input value={commentText[p.id] || ""} onChange={e => setCommentText({ ...commentText, [p.id]: e.target.value })}
                        placeholder="Votre réponse..."
                        className="flex-1 px-3 py-2 rounded-lg bg-stavi-cream border border-stavi-paper text-sm focus:outline-none focus:border-stavi-terracotta" />
                      <button onClick={() => onComment(p.id)} className="px-3 py-2 rounded-lg bg-stavi-terracotta text-white"><Send size={14} /></button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-xl border border-stavi-paper bg-white disabled:opacity-40 hover:bg-stavi-paper transition">
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-semibold text-stavi-inkSoft">
              Page {page} / {pages} <span className="text-stavi-muted font-normal">({total} message{total > 1 ? "s" : ""})</span>
            </span>
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
              className="p-2 rounded-xl border border-stavi-paper bg-white disabled:opacity-40 hover:bg-stavi-paper transition">
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
