import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ pid: string }> }) {
  const { error } = await requireAdmin(req)
  if (error) return error
  const { pid } = await params
  const { status } = await req.json()
  if (!["approved", "rejected"].includes(status))
    return NextResponse.json({ detail: "Invalid status" }, { status: 400 })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const postData: any = { status }
  const post = await prisma.post.update({ where: { id: pid }, data: postData })
  return NextResponse.json(post)
}
