import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { serializeBook } from "@/lib/books"
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const book = await prisma.book.findUnique({ where: { id: params.id } })
  if (!book) return NextResponse.json({ detail: "Not found" }, { status: 404 })
  return NextResponse.json(serializeBook(book))
}