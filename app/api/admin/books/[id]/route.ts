import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { serializeBook } from "@/lib/books"
const MAP: Record<string,string> = { title_fr:"titleFr",title_en:"titleEn",subtitle_fr:"subtitleFr",subtitle_en:"subtitleEn",description_fr:"descriptionFr",description_en:"descriptionEn",cover_url:"coverUrl",price_ebook:"priceEbook",price_print:"pricePrint",paper_available:"paperAvailable" }
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin(req)
  if (error) return error
  const body = await req.json()
  const update: Record<string,unknown> = {}
  for (const [k,v] of Object.entries(body)) { const m = MAP[k]||k; if (v !== undefined && v !== null) update[m] = v }
  if (!Object.keys(update).length) return NextResponse.json({ detail: "Nothing to update" }, { status: 400 })
  const book = await prisma.book.update({ where: { id: params.id }, data: update as any })
  return NextResponse.json(serializeBook(book))
}