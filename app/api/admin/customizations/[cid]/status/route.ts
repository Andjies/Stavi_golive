import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
export async function PATCH(req: NextRequest, { params }: { params: { cid: string } }) {
  const { error } = await requireAdmin(req)
  if (error) return error
  const { status } = await req.json()
  if (!["pending","in_progress","delivered"].includes(status)) return NextResponse.json({ detail: "Invalid status" }, { status: 400 })
  await prisma.customization.update({ where: { id: params.cid }, data: { status } })
  return NextResponse.json({ ok: true })
}