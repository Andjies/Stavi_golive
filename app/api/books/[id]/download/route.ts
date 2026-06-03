import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = await requireAuth(req)
  if (error) return error
  const { id } = await params
  if (user!.role !== "admin") {
    const owns = await prisma.paymentTransaction.findFirst({ where: { userId: user!.id, paymentStatus: "paid", OR: [{ metadata: { path: ["book_id"], equals: id } }, { metadata: { path: ["item_type"], equals: "bundle" } }] } })
    const aid = !owns ? await prisma.aidRequest.findFirst({ where: { userId: user!.id, status: "approved", grantedBookIds: { has: id } } }) : null
    if (!owns && !aid) return NextResponse.json({ detail: "You do not own this book" }, { status: 403 })
  }
  const book = await prisma.book.findUnique({ where: { id }, select: { pdfData: true, pdfFilename: true } })
  if (!book?.pdfData) return NextResponse.json({ detail: "PDF not available yet" }, { status: 404 })
  return new NextResponse(book.pdfData as unknown as ArrayBuffer, { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${book.pdfFilename || "stavi.pdf"}"` } })
}
