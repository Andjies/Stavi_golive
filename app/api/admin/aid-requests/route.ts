import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req)
  if (error) return error
  const docs = await prisma.aidRequest.findMany({ orderBy: { createdAt: "desc" }, select: { id:true, userId:true, userEmail:true, userName:true, familySituation:true, organism:true, organismOther:true, childDifficulties:true, country:true, monthlyIncomeRange:true, justificationMime:true, justificationFilename:true, status:true, grantedBookIds:true, adminNote:true, createdAt:true, approvedAt:true, rejectedAt:true } })
  return NextResponse.json(docs)
}