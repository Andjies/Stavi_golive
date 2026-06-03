import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCheckoutStatus } from "@/lib/stripe"
export async function GET(_req: NextRequest, { params }: { params: { sessionId: string } }) {
  const s = await getCheckoutStatus(params.sessionId)
  const txn = await prisma.paymentTransaction.findUnique({ where: { sessionId: params.sessionId } })
  if (txn && txn.paymentStatus !== "paid") {
    await prisma.paymentTransaction.update({ where: { sessionId: params.sessionId }, data: { paymentStatus: s.paymentStatus, status: s.status } })
    if (s.paymentStatus === "paid" && txn.itemType === "bundle")
      await prisma.personalizationSlot.upsert({ where: { userId: txn.userId }, update: { available: true }, create: { userId: txn.userId, available: true } })
  }
  return NextResponse.json({ status: s.status, payment_status: s.paymentStatus, amount_total: s.amountTotal, currency: s.currency, metadata: s.metadata })
}