import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCheckoutStatus } from "@/lib/stripe"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params
  const s = await getCheckoutStatus(sessionId)
  const txn = await prisma.paymentTransaction.findUnique({ where: { sessionId } })
  if (txn && txn.paymentStatus !== "paid") {
    await prisma.paymentTransaction.update({ where: { sessionId }, data: { paymentStatus: s.paymentStatus, status: s.status } })
    if (s.paymentStatus === "paid" && txn.itemType === "bundle")
      await prisma.personalizationSlot.upsert({ where: { userId: txn.userId }, update: { available: true }, create: { userId: txn.userId, available: true } })
  }
  return NextResponse.json({ status: s.status, payment_status: s.paymentStatus, amount_total: s.amountTotal, currency: s.currency, metadata: s.metadata })
}
