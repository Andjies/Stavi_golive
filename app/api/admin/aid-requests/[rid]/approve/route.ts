import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { sendEmail } from "@/lib/email"
export async function POST(req: NextRequest, { params }: { params: { rid: string } }) {
  const { error } = await requireAdmin(req)
  if (error) return error
  const { book_ids, admin_note="" } = await req.json()
  const doc = await prisma.aidRequest.findUnique({ where: { id: params.rid } })
  if (!doc) return NextResponse.json({ detail: "Not found" }, { status: 404 })
  await prisma.aidRequest.update({ where: { id: params.rid }, data: { status: "approved", grantedBookIds: book_ids, adminNote: admin_note, approvedAt: new Date() } })
  const books = await prisma.book.findMany({ where: { id: { in: book_ids } }, select: { titleFr: true } })
  await sendEmail(doc.userEmail, "Votre demande d'aide a été acceptée 💛", `<h2>Bonjour ${doc.userName} 🌷</h2><p>Votre demande d'aide a été <b>approuvée</b>. Vos ${book_ids.length} livre(s) sont disponibles dans votre bibliothèque.</p><ul>${books.map(b=>`<li>${b.titleFr}</li>`).join("")}</ul>`)
  return NextResponse.json({ ok: true })
}