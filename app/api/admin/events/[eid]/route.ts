import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
export async function DELETE(req: NextRequest, { params }: { params: { eid: string } }) {
  const { error } = await requireAdmin(req)
  if (error) return error
  await prisma.event.delete({ where: { id: params.eid } })
  return NextResponse.json({ ok: true })
}