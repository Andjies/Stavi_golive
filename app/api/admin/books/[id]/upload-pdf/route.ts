import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin(req)
  if (error) return error
  const fd = await req.formData()
  const file = fd.get("file") as File | null
  if (!file) return NextResponse.json({ detail: "No file" }, { status: 400 })
  const buf = Buffer.from(await file.arrayBuffer())
  if (buf.length > 15*1024*1024) return NextResponse.json({ detail: "File too large (max 15MB)" }, { status: 400 })
  await prisma.book.update({ where: { id: params.id }, data: { pdfData: buf, pdfFilename: file.name, hasPdf: true } })
  return NextResponse.json({ ok: true, size: buf.length })
}