import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin(req)
  if (error) return error
  const { id } = await params
  const fd = await req.formData()
  const file = fd.get("file") as File | null
  if (!file) return NextResponse.json({ detail: "No file" }, { status: 400 })
  const buf = Buffer.from(await file.arrayBuffer())
  if (buf.length > 5*1024*1024) return NextResponse.json({ detail: "Image too large (max 5MB)" }, { status: 400 })
  await prisma.book.update({ where: { id }, data: { coverData: buf, coverMime: file.type, coverUrl: `/api/books/${id}/cover` } })
  return NextResponse.json({ ok: true, cover_url: `/api/books/${id}/cover` })
}
