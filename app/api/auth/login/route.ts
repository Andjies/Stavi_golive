import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyPassword, createToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = (body.email || "").toLowerCase().trim()
    const password = body.password || ""
    if (!email || !password) return NextResponse.json({ detail: "Invalid credentials" }, { status: 401 })

    const user = await prisma.user.findFirst({ where: { email: { equals: email, mode: "insensitive" } } })
    if (!user) return NextResponse.json({ detail: "Invalid credentials" }, { status: 401 })

    const valid = await verifyPassword(password, user.password)
    if (!valid) return NextResponse.json({ detail: "Invalid credentials" }, { status: 401 })

    const token = await createToken(user.id, user.role)
    return NextResponse.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, language: user.language } })
  } catch {
    return NextResponse.json({ detail: "Erreur serveur" }, { status: 500 })
  }
}