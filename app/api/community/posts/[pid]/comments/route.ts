import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth"

export async function POST(req: NextRequest, { params }: { params: Promise<{ pid: string }> }) {
  const { user, error } = await requireAuth(req)
  if (error) return error
  const { pid } = await params
  const { content } = await req.json()
  const post = await prisma.post.findUnique({ where: { id: pid } })
  if (!post) return NextResponse.json({ detail: "Post not found" }, { status: 404 })
  const comment = await prisma.comment.create({ data: { postId: pid, userId: user!.id, userName: user!.name, content } })
  return NextResponse.json(comment)
}
