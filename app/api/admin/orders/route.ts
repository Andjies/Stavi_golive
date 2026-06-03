import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req)
  if (error) return error
  return NextResponse.json(await prisma.paymentTransaction.findMany({ orderBy: { createdAt: "desc" } }))
}