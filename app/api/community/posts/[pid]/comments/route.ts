import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth"
export async function POST(req: NextRequest, { params }: { params: { pid: string } }) {
  const { user, error } = await requireAuth(req)
  if (error) return error
  const { content } = await req.json()
  const post = await prisma.post.findUnique({ where: { id: params.pid } })
  if (!post) return NextResponse.json({ detail: "Post not found" }, { status: 404 })
  const comment = await prisma.comment.create({ data: { postId: params.pid, userId: user!.id, userName: user!.name, content } })
  return NextResponse.json(comment)
}