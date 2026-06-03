import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { serializeBook } from "@/lib/books"
export async function GET() {
  const books = await prisma.book.findMany({ orderBy: { orderIdx: "asc" } })
  return NextResponse.json(books.map(serializeBook))
}