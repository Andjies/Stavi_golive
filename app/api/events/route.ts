import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
export async function GET() {
  const events = await prisma.event.findMany({ orderBy: { date: "asc" } })
  return NextResponse.json(events.map(e => ({ ...e, title_fr: e.titleFr, title_en: e.titleEn, description_fr: e.descriptionFr, description_en: e.descriptionEn })))
}
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin(req)
  if (error) return error
  const { title_fr, title_en, description_fr, description_en, date, location, online=false, link="" } = await req.json()
  const event = await prisma.event.create({ data: { titleFr: title_fr, titleEn: title_en||"", descriptionFr: description_fr||"", descriptionEn: description_en||"", date: new Date(date), location, online, link } })
  return NextResponse.json(event)
}