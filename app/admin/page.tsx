"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLang, useAuth } from "@/app/layout"
import { BarChart3, BookOpen, ShoppingCart, Sparkles, Heart, MessageCircle, Calendar, Users, Settings, CheckCircle2, XCircle, Clock, Trash2, Eye, Loader2, Plus, Save, FileText, RefreshCw } from "lucide-react"
import { toast } from "sonner"

const TABS = ["stats","books","orders","customizations","aid","community","events","users","settings"]
const TAB_ICONS: Record<string, any> = { stats: BarChart3, books: BookOpen, orders: ShoppingCart, customizations: Sparkles, aid: Heart, community: MessageCircle, events: Calendar, users: Users, settings: Settings }

export default function Admin() {
  const { t } = useLang()
  const { user, token } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState("stats")
  const [stats, setStats] = useState<any>({})
  const [books, setBooks] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [customs, setCustoms] = useState<any[]>([])
  const [aids, setAids] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [settings, setSettings] = useState<any>({})

  const h = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!user) { router.push("/login"); return }
    if (!["admin","moderator"].includes(user.role)) { router.push("/"); return }
  }, [user])

  useEffect(() => {
    const loaders: Record<string, () => void> = {
      stats: () => fetch("/api/admin/stats", { headers: h }).then(r => r.json()).then(setStats),
      books: () => fetch("/api/books").then(r => r.json()).then(setBooks),
      orders: () => fetch("/api/admin/orders", { headers: h }).then(r => r.json()).then(setOrders),
      customizations: () => fetch("/api/admin/customizations", { headers: h }).then(r => r.json()).then(setCustoms),
      aid: () => fetch("/api/admin/aid-requests", { headers: h }).then(r => r.json()).then(setAids),
      community: () => fetch("/api/community/posts?page=1", { headers: h }).then(r => r.json()).then(d => setPosts(d.posts || [])),
      events: () => fetch("/api/events").then(r => r.json()).then(setEvents),
      users: () => fetch("/api/admin/users", { headers: h }).then(r => r.json()).then(setUsers),
      settings: () => fetch("/api/admin/settings", { headers: h }).then(r => r.json()).then(setSettings),
    }
    loaders[tab]?.()
  }, [tab])

  if (!user || !["admin","moderator"].includes(user.role)) return null

  // ── STATS ──
  const StatsTab = () => (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Utilisateurs", value: stats.users, icon: Users, color: "text-stavi-night" },
          { label: "Commandes payées", value: stats.paid_orders, icon: ShoppingCart, color: "text-stavi-sage" },
          { label: "Revenus (CHF)", value: stats.revenue?.toFixed(2), icon: BarChart3, color: "text-stavi-terracotta" },
          { label: "Perso. en attente", value: stats.pending_customizations, icon: Sparkles, color: "text-stavi-peach" },
        ].map(s => (
          <div key={s.label} className="card-soft">
            <s.icon size={24} className={`${s.color} mb-3`} />
            <div className="font-display text-4xl font-semibold text-stavi-ink">{s.value ?? "—"}</div>
            <div className="text-sm text-stavi-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Dons collectés (CHF)", value: stats.donations_total?.toFixed(2), icon: Heart, color: "text-stavi-terracotta", sub: `${stats.donations_count ?? 0} donateur${stats.donations_count > 1 ? "s" : ""}` },
          { label: "Familles aidées (total)", value: stats.families_aided_total, icon: Users, color: "text-stavi-sage", sub: "Toutes années" },
          { label: `Familles aidées ${new Date().getFullYear()}`, value: stats.families_aided_year, icon: Heart, color: "text-stavi-peach", sub: "Cette année" },
          { label: "Posts en attente", value: stats.pending_posts, icon: MessageCircle, color: "text-stavi-night", sub: stats.pending_posts > 0 ? "À modérer" : "Tout approuvé ✓" },
        ].map(s => (
          <div key={s.label} className="card-soft">
            <s.icon size={24} className={`${s.color} mb-3`} />
            <div className="font-display text-4xl font-semibold text-stavi-ink">{s.value ?? "—"}</div>
            <div className="text-sm text-stavi-muted mt-0.5">{s.label}</div>
            {s.sub && <div className="text-xs text-stavi-muted/70 mt-0.5">{s.sub}</div>}
          </div>
        ))}
      </div>
    </div>
  )

  // ── BOOKS ──
  const BooksTab = () => {
    const [editing, setEditing] = useState<string|null>(null)
    const [editData, setEditData] = useState<any>({})
    const [coverFile, setCoverFile] = useState<File|null>(null)
    const [pdfFile, setPdfFile] = useState<File|null>(null)
    const [saving, setSaving] = useState(false)

    const startEdit = (b: any) => { setEditing(b.id); setEditData({ price_ebook: b.price_ebook, price_print: b.price_print, cover_url: b.cover_url }) }

    const saveBook = async (id: string) => {
      setSaving(true)
      try {
        await fetch(`/api/admin/books/${id}`, { method: "PATCH", headers: { ...h, "Content-Type": "application/json" }, body: JSON.stringify(editData) })
        if (coverFile) {
          const fd = new FormData(); fd.append("file", coverFile)
          await fetch(`/api/admin/books/${id}/upload-cover`, { method: "POST", headers: h, body: fd })
        }
        if (pdfFile) {
          const fd = new FormData(); fd.append("file", pdfFile)
          await fetch(`/api/admin/books/${id}/upload-pdf`, { method: "POST", headers: h, body: fd })
        }
        toast.success("Livre mis à jour")
        const updated: any[] = await fetch("/api/books").then(r => r.json()); setBooks(updated)
        setEditing(null); setCoverFile(null); setPdfFile(null)
        // recalcul auto du prix bundle = somme des prix ebook de tous les livres
        const newBundle = parseFloat(updated.reduce((sum: number, b: any) => sum + (b.price_ebook || 0), 0).toFixed(2))
        const settingsSnap = await fetch("/api/admin/settings", { headers: h }).then(r => r.json())
        await fetch("/api/admin/settings", { method: "PUT", headers: { ...h, "Content-Type": "application/json" }, body: JSON.stringify({ bundle_price: newBundle }) })
        setSettings({ ...settingsSnap, bundlePrice: newBundle })
        toast.info(`Prix bundle recalculé : ${newBundle} CHF`)
      } catch { toast.error(t("common.error")) } finally { setSaving(false) }
    }

    return (
      <div className="space-y-4">
        {books.map(b => (
          <div key={b.id} className="bg-white rounded-2xl p-5 border border-stavi-paper shadow-sm">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                {b.cover_url ? <img src={b.cover_url} alt="" className="w-16 h-20 object-cover rounded-xl" /> : <div className="w-16 h-20 bg-stavi-paper rounded-xl flex items-center justify-center text-stavi-muted"><BookOpen size={20} /></div>}
                <div>
                  <div className="font-display font-semibold text-lg">{b.title_fr}</div>
                  <div className="text-sm text-stavi-muted">PDF: {b.has_pdf ? "✅" : "❌"} · Ebook: {b.price_ebook} CHF · Print: {b.price_print} CHF</div>
                </div>
              </div>
              <button onClick={() => editing === b.id ? setEditing(null) : startEdit(b)} className="text-stavi-terracotta text-sm font-semibold">
                {editing === b.id ? "Annuler" : "Modifier"}
              </button>
            </div>
            {editing === b.id && (
              <div className="mt-4 grid sm:grid-cols-2 gap-4 border-t border-stavi-paper pt-4">
                <div><label className="text-xs font-semibold block mb-1">Prix ebook (CHF)</label><input type="number" step="0.01" value={editData.price_ebook} onChange={e => setEditData({...editData, price_ebook: parseFloat(e.target.value)})} className="w-full px-3 py-2 rounded-xl bg-stavi-cream border border-stavi-paper text-sm" /></div>
                <div><label className="text-xs font-semibold block mb-1">Prix print (CHF)</label><input type="number" step="0.01" value={editData.price_print} onChange={e => setEditData({...editData, price_print: parseFloat(e.target.value)})} className="w-full px-3 py-2 rounded-xl bg-stavi-cream border border-stavi-paper text-sm" /></div>
                <div><label className="text-xs font-semibold block mb-1">Couverture (image)</label><input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0]||null)} className="text-xs text-stavi-inkSoft" /></div>
                <div><label className="text-xs font-semibold block mb-1">PDF du livre</label><input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files?.[0]||null)} className="text-xs text-stavi-inkSoft" /></div>
                <div className="sm:col-span-2"><button onClick={() => saveBook(b.id)} disabled={saving} className="btn-primary !py-2 !px-5 !text-sm disabled:opacity-50">{saving ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} className="mr-1" />Enregistrer</>}</button></div>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  // ── ORDERS ──
  const OrdersTab = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-stavi-paper text-left">{["Date","Email","Type","Montant","Statut"].map(h => <th key={h} className="pb-3 pr-4 font-semibold text-stavi-inkSoft">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-stavi-paper">
          {orders.map((o: any) => (
            <tr key={o.id}>
              <td className="py-3 pr-4 text-stavi-muted whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString()}</td>
              <td className="py-3 pr-4">{o.userEmail}</td>
              <td className="py-3 pr-4"><span className="tag bg-stavi-paper">{o.itemType}</span></td>
              <td className="py-3 pr-4 font-semibold">{o.amount?.toFixed(2)} {o.currency?.toUpperCase()}</td>
              <td className="py-3">{o.paymentStatus === "paid" ? <span className="tag bg-stavi-sage/20 text-stavi-sage">✅ Payé</span> : <span className="tag bg-stavi-paper text-stavi-muted">{o.paymentStatus}</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  // ── CUSTOMIZATIONS ──
  const CustomizationsTab = () => {
    const [uploading, setUploading] = useState<string|null>(null)

    const uploadPdf = async (cid: string, file: File) => {
      setUploading(cid)
      const fd = new FormData(); fd.append("file", file)
      try {
        const r = await fetch(`/api/admin/customizations/${cid}/upload`, { method: "POST", headers: h, body: fd })
        if (!r.ok) throw new Error(); toast.success("PDF envoyé au parent !")
        const d = await fetch("/api/admin/customizations", { headers: h }).then(r => r.json()); setCustoms(d)
      } catch { toast.error(t("common.error")) } finally { setUploading(null) }
    }

    const setStatus = async (cid: string, status: string) => {
      await fetch(`/api/admin/customizations/${cid}/status`, { method: "PATCH", headers: { ...h, "Content-Type": "application/json" }, body: JSON.stringify({ status }) })
      toast.success("Statut mis à jour")
      const d = await fetch("/api/admin/customizations", { headers: h }).then(r => r.json()); setCustoms(d)
    }

    return (
      <div className="space-y-4">
        {customs.map((c: any) => (
          <div key={c.id} className="bg-white rounded-2xl p-5 border border-stavi-paper shadow-sm">
            <div className="flex flex-wrap gap-4 justify-between mb-3">
              <div><div className="font-semibold">{c.childName}, {c.childAge} ans — {c.userName}</div><div className="text-sm text-stavi-muted">{c.userEmail} · {new Date(c.createdAt).toLocaleDateString()}</div></div>
              <div className="flex gap-2">
                {["pending","in_progress","delivered"].map(s => <button key={s} onClick={() => setStatus(c.id,s)} className={`text-xs px-3 py-1 rounded-full font-semibold transition ${c.status===s?"bg-stavi-terracotta text-white":"bg-stavi-paper text-stavi-muted hover:bg-stavi-sun"}`}>{s}</button>)}
              </div>
            </div>
            <div className="text-sm text-stavi-inkSoft mb-1"><b>Thème :</b> {c.themeToWork}</div>
            <div className="text-sm text-stavi-inkSoft mb-1"><b>Traits :</b> {c.childTraits}</div>
            <div className="text-sm text-stavi-inkSoft mb-3"><b>Intérêts :</b> {c.childInterests}</div>
            {c.status !== "delivered" && (
              <div>
                <label className="text-xs font-semibold block mb-1">Envoyer le PDF finalisé :</label>
                <input type="file" accept=".pdf" onChange={e => { const f = e.target.files?.[0]; if (f) uploadPdf(c.id, f) }} className="text-xs" disabled={uploading===c.id} />
                {uploading===c.id && <span className="text-xs text-stavi-muted ml-2">Envoi en cours...</span>}
              </div>
            )}
            {c.status === "delivered" && <span className="tag bg-stavi-sage/20 text-stavi-sage inline-flex gap-1 items-center"><CheckCircle2 size={12} />Livré le {new Date(c.deliveredAt).toLocaleDateString()}</span>}
          </div>
        ))}
        {customs.length === 0 && <div className="text-center py-12 text-stavi-muted">Aucune demande</div>}
      </div>
    )
  }

  // ── AID REQUESTS ──
  const AidTab = () => {
    const [processing, setProcessing] = useState<string|null>(null)
    const [allBooks, setAllBooks] = useState<any[]>([])
    const [grantMap, setGrantMap] = useState<Record<string,string[]>>({})
    const [noteMap, setNoteMap] = useState<Record<string,string>>({})

    useEffect(() => { fetch("/api/books").then(r => r.json()).then(setAllBooks) }, [])

    const approve = async (id: string) => {
      setProcessing(id)
      try {
        const r = await fetch(`/api/admin/aid-requests/${id}/approve`, { method: "POST", headers: { ...h, "Content-Type":"application/json" }, body: JSON.stringify({ book_ids: grantMap[id]||[], admin_note: noteMap[id]||"" }) })
        if (!r.ok) throw new Error(); toast.success("Demande approuvée, email envoyé")
        const d = await fetch("/api/admin/aid-requests", { headers: h }).then(r => r.json()); setAids(d)
      } catch { toast.error(t("common.error")) } finally { setProcessing(null) }
    }

    const reject = async (id: string) => {
      setProcessing(id)
      try {
        await fetch(`/api/admin/aid-requests/${id}/reject`, { method: "POST", headers: { ...h, "Content-Type":"application/json" }, body: JSON.stringify({ admin_note: noteMap[id]||"" }) })
        toast.success("Demande refusée")
        const d = await fetch("/api/admin/aid-requests", { headers: h }).then(r => r.json()); setAids(d)
      } catch { toast.error(t("common.error")) } finally { setProcessing(null) }
    }

    return (
      <div className="space-y-4">
        {aids.map((a: any) => (
          <div key={a.id} className="bg-white rounded-2xl p-5 border border-stavi-paper shadow-sm">
            <div className="flex flex-wrap gap-3 justify-between mb-3">
              <div><div className="font-semibold">{a.userName} — {a.userEmail}</div><div className="text-sm text-stavi-muted">{a.organism} · {a.country} · {new Date(a.createdAt).toLocaleDateString()}</div></div>
              {a.status==="pending" ? <span className="tag bg-stavi-sun/40 text-stavi-terracottaDeep flex items-center gap-1"><Clock size={12} />En attente</span> : a.status==="approved" ? <span className="tag bg-stavi-sage/20 text-stavi-sage flex items-center gap-1"><CheckCircle2 size={12} />Approuvée</span> : <span className="tag bg-red-100 text-red-600 flex items-center gap-1"><XCircle size={12} />Refusée</span>}
            </div>
            <div className="text-sm mb-2"><b>Situation :</b> {a.familySituation}</div>
            <div className="text-sm mb-3"><b>Difficultés :</b> {a.childDifficulties}</div>
            {a.justificationFilename && <a href={`/api/admin/aid-requests/${a.id}/justificatif`} target="_blank" className="text-xs text-stavi-terracotta font-semibold flex items-center gap-1 mb-3"><Eye size={12} />Voir le justificatif ({a.justificationFilename})</a>}
            {a.status === "pending" && (
              <div className="space-y-3 border-t border-stavi-paper pt-3">
                <div>
                  <label className="text-xs font-semibold block mb-1">Livres à accorder :</label>
                  <div className="flex flex-wrap gap-2">{allBooks.map((b: any) => {
                    const sel = (grantMap[a.id]||[]).includes(b.id)
                    return <button key={b.id} onClick={() => setGrantMap({...grantMap,[a.id]:sel?(grantMap[a.id]||[]).filter((x:string)=>x!==b.id):[...(grantMap[a.id]||[]),b.id]})} className={`text-xs px-2 py-1 rounded-full border transition ${sel?"bg-stavi-sage/20 border-stavi-sage text-stavi-sage":"bg-stavi-paper border-stavi-paper text-stavi-muted"}`}>{b.title_fr?.split(" ").slice(0,4).join(" ")}</button>
                  })}</div>
                </div>
                <input type="text" placeholder="Note admin (optionnel)" value={noteMap[a.id]||""} onChange={e => setNoteMap({...noteMap,[a.id]:e.target.value})} className="w-full px-3 py-2 rounded-xl bg-stavi-cream border border-stavi-paper text-sm" />
                <div className="flex gap-3">
                  <button onClick={() => approve(a.id)} disabled={processing===a.id} className="btn-primary !py-2 !px-5 !text-sm disabled:opacity-50 flex items-center gap-1"><CheckCircle2 size={14} />Approuver</button>
                  <button onClick={() => reject(a.id)} disabled={processing===a.id} className="px-5 py-2 rounded-xl border-2 border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 disabled:opacity-50 flex items-center gap-1"><XCircle size={14} />Refuser</button>
                </div>
              </div>
            )}
            {a.adminNote && <div className="mt-2 text-sm text-stavi-inkSoft italic">Note : {a.adminNote}</div>}
          </div>
        ))}
        {aids.length === 0 && <div className="text-center py-12 text-stavi-muted">Aucune demande</div>}
      </div>
    )
  }

  // ── COMMUNITY ──
  const CommunityTab = () => {
    const [moderating, setModerating] = useState<string|null>(null)
    const [activeFilter, setActiveFilter] = useState<"pending"|"approved"|"all">("pending")

    const reload = () => fetch(`/api/community/posts?page=1`, { headers: h }).then(r => r.json()).then(d => setPosts(d.posts || []))

    const moderate = async (pid: string, status: "approved"|"rejected") => {
      setModerating(pid)
      try {
        await fetch(`/api/admin/community/posts/${pid}/moderate`, { method: "PATCH", headers: { ...h, "Content-Type": "application/json" }, body: JSON.stringify({ status }) })
        toast.success(status === "approved" ? "Post approuvé ✅" : "Post refusé")
        reload()
      } catch { toast.error(t("common.error")) } finally { setModerating(null) }
    }

    const delPost = async (pid: string) => {
      if (!confirm("Supprimer ce post ?")) return
      await fetch(`/api/admin/community/posts/${pid}`, { method: "DELETE", headers: h })
      toast.success("Post supprimé"); reload()
    }

    const filtered = activeFilter === "all" ? posts : posts.filter((p: any) => p.status === activeFilter)
    const pendingCount = posts.filter((p: any) => p.status === "pending").length

    return (
      <div>
        <div className="flex gap-2 mb-5 flex-wrap">
          {([["pending","En attente"],["approved","Approuvés"],["all","Tous"]] as const).map(([v, label]) => (
            <button key={v} onClick={() => setActiveFilter(v)} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${activeFilter===v?"bg-stavi-terracotta text-white":"bg-stavi-paper text-stavi-inkSoft hover:bg-stavi-sun/30"}`}>
              {label}{v==="pending" && pendingCount > 0 ? ` (${pendingCount})` : ""}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {filtered.map((p: any) => (
            <div key={p.id} className={`bg-white rounded-2xl p-4 border shadow-sm ${p.status==="pending"?"border-stavi-sun/60 bg-stavi-sun/5":"border-stavi-paper"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold truncate">{p.title}</span>
                    <span className={`tag text-xs ${p.status==="approved"?"bg-stavi-sage/20 text-stavi-sage":p.status==="pending"?"bg-stavi-sun/40 text-stavi-terracottaDeep":"bg-red-100 text-red-500"}`}>{p.status}</span>
                  </div>
                  <div className="text-sm text-stavi-muted">{p.userName} · {new Date(p.createdAt).toLocaleDateString()} · {(p.comments||[]).length} réponse{(p.comments||[]).length>1?"s":""}</div>
                  <p className="text-sm text-stavi-inkSoft mt-1 line-clamp-2">{p.content}</p>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  {p.status === "pending" && (
                    <>
                      <button onClick={() => moderate(p.id, "approved")} disabled={moderating===p.id} className="text-xs px-3 py-1 rounded-full bg-stavi-sage/20 text-stavi-sage font-semibold hover:bg-stavi-sage/30 disabled:opacity-50">✅ Approuver</button>
                      <button onClick={() => moderate(p.id, "rejected")} disabled={moderating===p.id} className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-500 font-semibold hover:bg-red-100 disabled:opacity-50">❌ Refuser</button>
                    </>
                  )}
                  <button onClick={() => delPost(p.id)} className="text-red-300 hover:text-red-600 self-end"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-12 text-stavi-muted">Aucun post {activeFilter === "pending" ? "en attente" : ""}</div>}
        </div>
      </div>
    )
  }

  // ── EVENTS ──
  const EventsTab = () => {
    const [form, setForm] = useState({ title_fr:"", title_en:"", description_fr:"", description_en:"", date:"", location:"", online:false, link:"" })
    const [creating, setCreating] = useState(false)
    const [showForm, setShowForm] = useState(false)

    const create = async () => {
      setCreating(true)
      try {
        await fetch("/api/events", { method: "POST", headers: { ...h, "Content-Type":"application/json" }, body: JSON.stringify(form) })
        toast.success("Événement créé")
        const d = await fetch("/api/events").then(r => r.json()); setEvents(d); setShowForm(false)
      } catch { toast.error(t("common.error")) } finally { setCreating(false) }
    }

    const del = async (eid: string) => {
      if (!confirm("Supprimer ?")) return
      await fetch(`/api/admin/events/${eid}`, { method: "DELETE", headers: h })
      const d = await fetch("/api/events").then(r => r.json()); setEvents(d)
    }

    return (
      <div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary !py-2 !px-5 !text-sm mb-6 flex items-center gap-1"><Plus size={14} />Nouvel événement</button>
        {showForm && (
          <div className="bg-white rounded-2xl p-5 border border-stavi-paper mb-6 grid sm:grid-cols-2 gap-4">
            {[["title_fr","Titre FR"],["title_en","Titre EN"],["description_fr","Description FR"],["description_en","Description EN"],["location","Lieu"],["link","Lien (optionnel)"]].map(([k,l]) => (
              <div key={k}><label className="text-xs font-semibold block mb-1">{l}</label><input type="text" value={(form as any)[k]} onChange={e => setForm({...form,[k]:e.target.value})} className="w-full px-3 py-2 rounded-xl bg-stavi-cream border border-stavi-paper text-sm" /></div>
            ))}
            <div><label className="text-xs font-semibold block mb-1">Date & heure</label><input type="datetime-local" value={form.date} onChange={e => setForm({...form,date:e.target.value})} className="w-full px-3 py-2 rounded-xl bg-stavi-cream border border-stavi-paper text-sm" /></div>
            <div className="flex items-center gap-2 mt-4"><input type="checkbox" checked={form.online} onChange={e => setForm({...form,online:e.target.checked})} /><label className="text-sm font-semibold">En ligne</label></div>
            <div className="sm:col-span-2"><button onClick={create} disabled={creating} className="btn-primary !py-2 !px-5 !text-sm">{creating ? <Loader2 size={14} className="animate-spin" /> : "Créer"}</button></div>
          </div>
        )}
        <div className="space-y-3">
          {events.map((e: any) => (
            <div key={e.id} className="bg-white rounded-2xl p-4 border border-stavi-paper flex items-start justify-between gap-4">
              <div><div className="font-semibold">{e.title_fr}</div><div className="text-sm text-stavi-muted">{new Date(e.date).toLocaleDateString("fr-FR")} · {e.location}</div></div>
              <button onClick={() => del(e.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── USERS ──
  const UsersTab = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-stavi-paper text-left">{["Nom","Email","Rôle","Langue","Inscrit le"].map(h => <th key={h} className="pb-3 pr-4 font-semibold text-stavi-inkSoft">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-stavi-paper">
          {users.map((u: any) => (
            <tr key={u.id}>
              <td className="py-3 pr-4 font-semibold">{u.name}</td>
              <td className="py-3 pr-4 text-stavi-muted">{u.email}</td>
              <td className="py-3 pr-4"><span className={`tag ${u.role==="admin"?"bg-stavi-night text-white":u.role==="moderator"?"bg-stavi-sage/20 text-stavi-sage":"bg-stavi-paper text-stavi-muted"}`}>{u.role}</span></td>
              <td className="py-3 pr-4">{u.language}</td>
              <td className="py-3 text-stavi-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  // ── SETTINGS ──
  const SettingsTab = () => {
    const [form, setForm] = useState(settings)
    const [saving, setSaving] = useState(false)
    const [guideFile, setGuideFile] = useState<File|null>(null)
    const [uploadingGuide, setUploadingGuide] = useState(false)
    const [guideName, setGuideName] = useState<string|null>(settings.guideName || null)
    useEffect(() => { setForm(settings); setGuideName(settings.guideName || null) }, [])

    const save = async () => {
      setSaving(true)
      const MAP: Record<string,string> = { bundlePrice:"bundle_price", personalizedPrice:"personalized_price", shippingCh:"shipping_ch", shippingEu:"shipping_eu", shippingWorld:"shipping_world", whatsappLinkFr:"whatsapp_link_fr", whatsappLinkEn:"whatsapp_link_en", openaiKey:"openai_key", claudeKey:"claude_key" }
      const payload: any = {}
      for (const [k,v] of Object.entries(form)) payload[MAP[k]||k] = v
      try {
        await fetch("/api/admin/settings", { method: "PUT", headers: { ...h, "Content-Type":"application/json" }, body: JSON.stringify(payload) })
        toast.success("Paramètres sauvegardés")
      } catch { toast.error(t("common.error")) } finally { setSaving(false) }
    }

    const uploadGuide = async () => {
      if (!guideFile) return
      setUploadingGuide(true)
      try {
        const fd = new FormData(); fd.append("file", guideFile)
        const r = await fetch("/api/admin/settings/guide", { method: "POST", headers: h, body: fd })
        if (!r.ok) throw new Error()
        const d = await r.json()
        setGuideName(d.name); setGuideFile(null)
        toast.success("Guide uploadé avec succès")
      } catch { toast.error(t("common.error")) } finally { setUploadingGuide(false) }
    }

    const deleteGuide = async () => {
      if (!confirm("Supprimer le guide ?")) return
      await fetch("/api/admin/settings/guide", { method: "DELETE", headers: h })
      setGuideName(null); toast.success("Guide supprimé")
    }

    const calcBundleFromBooks = async () => {
      const bks: any[] = await fetch("/api/books").then(r => r.json())
      const total = parseFloat(bks.reduce((s, b) => s + (b.price_ebook || 0), 0).toFixed(2))
      setForm((f: any) => ({ ...f, bundlePrice: total }))
      toast.info(`Total calculé : ${total} CHF`)
    }

    const fields: [string, string, string][] = [
      ["personalizedPrice","Prix personnalisé (CHF)","number"],
      ["shippingCh","Frais envoi Suisse (CHF)","number"], ["shippingEu","Frais envoi Europe (CHF)","number"], ["shippingWorld","Frais envoi Monde (CHF)","number"],
      ["whatsappLinkFr","Lien WhatsApp FR","text"], ["whatsappLinkEn","Lien WhatsApp EN","text"],
    ]

    return (
      <div className="max-w-2xl space-y-8">
        {/* Prix */}
        <div>
          <h3 className="font-display font-semibold text-lg mb-4">Tarification</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold block mb-1">Prix bundle (CHF)</label>
              <div className="flex gap-2 items-center">
                <input type="number" step="0.01" value={form.bundlePrice||""} onChange={e => setForm({...form, bundlePrice: parseFloat(e.target.value)})} className="flex-1 px-3 py-2 rounded-xl bg-stavi-cream border border-stavi-paper text-sm" />
                <button type="button" onClick={calcBundleFromBooks} title="Recalculer depuis les prix ebook" className="p-2 rounded-xl bg-stavi-paper hover:bg-stavi-sun transition border border-stavi-paper">
                  <RefreshCw size={15} className="text-stavi-terracotta" />
                </button>
              </div>
              <p className="text-xs text-stavi-muted mt-1">Cliquez <RefreshCw size={11} className="inline" /> pour recalculer automatiquement = somme des prix ebook</p>
            </div>
            {fields.map(([k, label, type]) => (
              <div key={k}><label className="text-xs font-semibold block mb-1">{label}</label><input type={type} value={form[k]||""} onChange={e => setForm({...form,[k]:type==="number"?parseFloat(e.target.value):e.target.value})} className="w-full px-3 py-2 rounded-xl bg-stavi-cream border border-stavi-paper text-sm" /></div>
            ))}
          </div>
          <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2">{saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}Enregistrer</button>
        </div>

        {/* Guide */}
        <div className="border-t border-stavi-paper pt-6">
          <h3 className="font-display font-semibold text-lg mb-1 flex items-center gap-2"><FileText size={18} className="text-stavi-terracotta" />Guide offert avec le bundle</h3>
          <p className="text-sm text-stavi-muted mb-4">Ce guide PDF sera téléchargeable gratuitement par tous les acheteurs du pack 10 livres.</p>
          {guideName ? (
            <div className="flex items-center gap-3 bg-stavi-sage/10 border border-stavi-sage/30 rounded-2xl px-4 py-3 mb-4">
              <FileText size={20} className="text-stavi-sage flex-shrink-0" />
              <div className="flex-1 min-w-0"><div className="font-semibold text-sm truncate">{guideName}</div><div className="text-xs text-stavi-muted">Guide actuel</div></div>
              <button onClick={deleteGuide} className="text-red-400 hover:text-red-600 flex-shrink-0"><Trash2 size={16} /></button>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-stavi-paper rounded-2xl px-4 py-3 mb-4 text-stavi-muted text-sm">
              <FileText size={18} /><span>Aucun guide uploadé</span>
            </div>
          )}
          <div className="flex items-center gap-3 flex-wrap">
            <input type="file" accept=".pdf" onChange={e => setGuideFile(e.target.files?.[0]||null)} className="text-sm text-stavi-inkSoft" />
            {guideFile && (
              <button onClick={uploadGuide} disabled={uploadingGuide} className="btn-primary !py-2 !px-4 !text-sm flex items-center gap-1 disabled:opacity-50">
                {uploadingGuide ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}Uploader
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  const CONTENT: Record<string, React.ReactNode> = {
    stats: <StatsTab />, books: <BooksTab />, orders: <OrdersTab />,
    customizations: <CustomizationsTab />, aid: <AidTab />, community: <CommunityTab />,
    events: <EventsTab />, users: <UsersTab />, settings: <SettingsTab />,
  }

  return (
    <div className="paper-texture min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-8">{t("admin.title")}</h1>
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map(tb => {
            const Icon = TAB_ICONS[tb]
            return (
              <button key={tb} onClick={() => setTab(tb)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${tab===tb?"bg-stavi-terracotta text-white shadow-md":"bg-white text-stavi-ink hover:bg-stavi-paper border border-stavi-paper"}`}>
                <Icon size={16} />{(t as any)(`admin.${tb}`)||tb}
              </button>
            )
          })}
        </div>
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stavi-paper">
          {CONTENT[tab]}
        </div>
      </div>
    </div>
  )
}
