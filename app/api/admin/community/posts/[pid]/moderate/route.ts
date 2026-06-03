import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"

export async function PATCH(req: NextRequest, { params }: { params: { pid: string } }) {
  const { error } = await requireAdmin(req)
  if (error) return error
  const { status } = await req.json()
  if (!["approved", "rejected"].includes(status))
    return NextResponse.json({ detail: "Invalid status" }, { status: 400 })
  const post = await prisma.post.update({ where: { id: params.pid }, data: { status } })
  return NextResponse.json(post)
}
