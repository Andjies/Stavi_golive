import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ pid: string }> }) {
  const { error } = await requireAdmin(req)
  if (error) return error
  const { pid } = await params
  await prisma.post.delete({ where: { id: pid } })
  return NextResponse.json({ ok: true })
}
