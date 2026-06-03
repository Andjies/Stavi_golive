import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth"
export async function GET(req: NextRequest) {
  const { user, error } = await requireAuth(req)
  if (error) return error
  const docs = await prisma.aidRequest.findMany({ where: { userId: user!.id }, orderBy: { createdAt: "desc" }, select: { id:true, status:true, organism:true, country:true, grantedBookIds:true, adminNote:true, createdAt:true, childDifficulties:true } })
  return NextResponse.json(docs)
}