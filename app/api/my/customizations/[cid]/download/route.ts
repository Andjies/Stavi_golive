import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth"
export async function GET(req: NextRequest, { params }: { params: { cid: string } }) {
  const { user, error } = await requireAuth(req)
  if (error) return error
  const doc = await prisma.customization.findUnique({ where: { id: params.cid } })
  if (!doc) return NextResponse.json({ detail: "Not found" }, { status: 404 })
  if (doc.userId !== user!.id && user!.role !== "admin") return NextResponse.json({ detail: "Forbidden" }, { status: 403 })
  if (!doc.pdfData) return NextResponse.json({ detail: "Not delivered yet" }, { status: 404 })
  return new NextResponse(doc.pdfData, { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${doc.pdfFilename||"stavi-custom.pdf"}"` } })
}