import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
export async function DELETE(req: NextRequest, { params }: { params: { pid: string } }) {
  const { error } = await requireAdmin(req)
  if (error) return error
  await prisma.post.delete({ where: { id: params.pid } })
  return NextResponse.json({ ok: true })
}