import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { constructWebhookEvent } from "@/lib/stripe"
export async function POST(req: NextRequest) {
  const body = await req.arrayBuffer()
  const sig = req.headers.get("stripe-signature") || ""
  let event: any
  try { event = constructWebhookEvent(Buffer.from(body), sig) } catch (e) { return NextResponse.json({ error: "Webhook error" }, { status: 400 }) }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any
    const txn = await prisma.paymentTransaction.findUnique({ where: { sessionId: session.id } })
    await prisma.paymentTransaction.updateMany({ where: { sessionId: session.id }, data: { paymentStatus: session.payment_status, status: "complete" } })
    if (session.payment_status === "paid" && txn?.itemType === "bundle")
      await prisma.personalizationSlot.upsert({ where: { userId: txn.userId }, update: { available: true }, create: { userId: txn.userId, available: true } })
  }
  return NextResponse.json({ ok: true })
}