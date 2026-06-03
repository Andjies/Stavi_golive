import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { sendEmail } from "@/lib/email"
export async function POST(req: NextRequest, { params }: { params: { rid: string } }) {
  const { error } = await requireAdmin(req)
  if (error) return error
  const { admin_note="" } = await req.json().catch(()=>({}))
  const doc = await prisma.aidRequest.findUnique({ where: { id: params.rid } })
  if (!doc) return NextResponse.json({ detail: "Not found" }, { status: 404 })
  await prisma.aidRequest.update({ where: { id: params.rid }, data: { status: "rejected", adminNote: admin_note, rejectedAt: new Date() } })
  await sendEmail(doc.userEmail, "Réponse à votre demande Stavi", `<h2>Bonjour ${doc.userName}</h2><p>Nous n'avons pas pu accepter votre demande pour le moment.</p>${admin_note ? `<p>${admin_note}</p>` : ""}`)
  return NextResponse.json({ ok: true })
}