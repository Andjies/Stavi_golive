import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth"
export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth(req)
  if (error) return error
  const slot = await prisma.personalizationSlot.findUnique({ where: { userId: user!.id } })
  if (!slot?.available) return NextResponse.json({ detail: "Personalization not available — please purchase the full pack first." }, { status: 403 })
  const { child_name, child_age, child_traits, child_interests, theme_to_work, additional_notes = "" } = await req.json()
  const custom = await prisma.customization.create({ data: { userId: user!.id, userEmail: user!.email, userName: user!.name, childName: child_name, childAge: parseInt(child_age), childTraits: child_traits, childInterests: child_interests, themeToWork: theme_to_work, additionalNotes: additional_notes, status: "pending" } })
  await prisma.personalizationSlot.update({ where: { userId: user!.id }, data: { available: false, usedAt: new Date() } })
  return NextResponse.json({ id: custom.id, status: custom.status })
}