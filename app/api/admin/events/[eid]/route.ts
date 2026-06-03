import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ eid: string }> }) {
  const { error } = await requireAdmin(req)
  if (error) return error
  const { eid } = await params
  await prisma.event.delete({ where: { id: eid } })
  return NextResponse.json({ ok: true })
}
