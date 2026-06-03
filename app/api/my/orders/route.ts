import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth"
export async function GET(req: NextRequest) {
  const { user, error } = await requireAuth(req)
  if (error) return error
  const txns = await prisma.paymentTransaction.findMany({ where: { userId: user!.id }, orderBy: { createdAt: "desc" } })
  return NextResponse.json(txns)
}