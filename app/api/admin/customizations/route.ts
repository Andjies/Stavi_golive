import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req)
  if (error) return error
  const docs = await prisma.customization.findMany({ orderBy: { createdAt: "desc" }, select: { id:true, userId:true, userEmail:true, userName:true, childName:true, childAge:true, childTraits:true, childInterests:true, themeToWork:true, additionalNotes:true, status:true, createdAt:true, deliveredAt:true, pdfFilename:true } })
  return NextResponse.json(docs)
}