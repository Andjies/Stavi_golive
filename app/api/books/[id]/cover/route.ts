import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const book = await prisma.book.findUnique({ where: { id }, select: { coverData: true, coverMime: true } })
  if (!book?.coverData) return NextResponse.json({ detail: "No cover" }, { status: 404 })
  return new NextResponse(book.coverData as unknown as ArrayBuffer, { headers: { "Content-Type": book.coverMime || "image/jpeg", "Cache-Control": "public, max-age=3600" } })
}
