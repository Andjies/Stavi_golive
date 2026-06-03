import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword, createToken } from "@/lib/auth"
export async function POST(req: NextRequest) {
  try {
    const { email, password, name, language = "fr" } = await req.json()
    if (!email || !password || !name) return NextResponse.json({ detail: "Champs requis" }, { status: 400 })
    if (typeof password !== "string" || password.length < 8)
      return NextResponse.json({ detail: "Le mot de passe doit faire au moins 8 caractères" }, { status: 400 })
    if (await prisma.user.findUnique({ where: { email: email.toLowerCase() } }))
      return NextResponse.json({ detail: "Email already registered" }, { status: 400 })
    const user = await prisma.user.create({ data: { email: email.toLowerCase(), name, password: await hashPassword(password), role: "user", language } })
    const token = await createToken(user.id, user.role)
    return NextResponse.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, language: user.language } })
  } catch { return NextResponse.json({ detail: "Erreur serveur" }, { status: 500 }) }
}