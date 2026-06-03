import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin(req)
  if (error) return error
  const fd = await req.formData()
  const file = fd.get("file") as File | null
  if (!file) return NextResponse.json({ detail: "No file" }, { status: 400 })
  const buf = Buffer.from(await file.arrayBuffer())
  if (buf.length > 30 * 1024 * 1024) return NextResponse.json({ detail: "Fichier trop volumineux (max 30MB)" }, { status: 400 })
  await prisma.settings.upsert({
    where: { id: "global" },
    update: { guideData: buf, guideName: file.name },
    create: { id: "global", guideData: buf, guideName: file.name },
  })
  return NextResponse.json({ ok: true, name: file.name, size: buf.length })
}

export async function DELETE(req: NextRequest) {
  const { error } = await requireAdmin(req)
  if (error) return error
  await prisma.settings.update({ where: { id: "global" }, data: { guideData: null, guideName: null } })
  return NextResponse.json({ ok: true })
}
