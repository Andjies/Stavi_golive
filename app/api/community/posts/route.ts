import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

const PAGE_SIZE = 10

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
  const user = await getCurrentUser(req)
  const isAdmin = user && ["admin", "moderator"].includes(user.role)

  // Admins voient tous les posts, les autres uniquement les approuvés
  const where = isAdmin ? {} : { status: "approved" }

  const [total, posts] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { comments: { orderBy: { createdAt: "asc" } } },
    }),
  ])

  return NextResponse.json({ posts, total, page, pages: Math.ceil(total / PAGE_SIZE) })
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ detail: "Not authenticated" }, { status: 401 })
  const { title, content } = await req.json()
  if (!title?.trim() || !content?.trim())
    return NextResponse.json({ detail: "title and content required" }, { status: 400 })

  // Admins / modérateurs : publié directement. Users : en attente de validation.
  const status = ["admin", "moderator"].includes(user.role) ? "approved" : "pending"

  const post = await prisma.post.create({
    data: { userId: user.id, userName: user.name, title: title.trim(), content: content.trim(), status },
    include: { comments: true },
  })
  return NextResponse.json(post, { status: 201 })
}
