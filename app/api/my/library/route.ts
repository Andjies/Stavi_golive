import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth"
import { serializeBook } from "@/lib/books"
export async function GET(req: NextRequest) {
  const { user, error } = await requireAuth(req)
  if (error) return error

  // Admin/autrice : accès complet à toute la bibliothèque + guide
  if (["admin", "moderator"].includes(user!.role)) {
    const allBooks = await prisma.book.findMany({ orderBy: { orderIdx: "asc" } })
    const customizations = await prisma.customization.findMany({ where: { userId: user!.id }, select: { id:true, childName:true, status:true, createdAt:true, deliveredAt:true, pdfFilename:true, themeToWork:true } })
    return NextResponse.json({ books: allBooks.map(serializeBook), has_bundle: true, personalization_available: true, customizations, aid_grants: [], is_admin: true })
  }

  const txns = await prisma.paymentTransaction.findMany({ where: { userId: user!.id, paymentStatus: "paid" } })
  const ids = new Set<string>(); let hasBundle = false
  for (const t of txns) {
    const m = t.metadata as any
    if (m.item_type === "book" && m.book_id) ids.add(m.book_id)
    if (m.item_type === "bundle") { hasBundle = true; (m.book_ids||"").split(",").filter(Boolean).forEach((id:string) => ids.add(id)) }
  }
  const aids = await prisma.aidRequest.findMany({ where: { userId: user!.id, status: "approved" } })
  aids.forEach(ag => ag.grantedBookIds.forEach(id => ids.add(id)))
  const books = await prisma.book.findMany({ where: { id: { in: [...ids] } } })
  const slot = await prisma.personalizationSlot.findUnique({ where: { userId: user!.id } })
  const customizations = await prisma.customization.findMany({ where: { userId: user!.id }, select: { id:true, childName:true, status:true, createdAt:true, deliveredAt:true, pdfFilename:true, themeToWork:true } })
  return NextResponse.json({ books: books.map(serializeBook), has_bundle: hasBundle, personalization_available: !!(slot?.available), customizations, aid_grants: aids.map(ag => ({ id:ag.id, status:ag.status, grantedBookIds:ag.grantedBookIds, adminNote:ag.adminNote })) })
}