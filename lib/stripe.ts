import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_API_KEY || "", { apiVersion: "2024-04-10" })

export async function createCheckoutSession(params: {
  amount: number; currency: string; successUrl: string; cancelUrl: string; metadata: Record<string, string>
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{ price_data: { currency: params.currency, product_data: { name: params.metadata.label || "Stavi" }, unit_amount: Math.round(params.amount * 100) }, quantity: 1 }],
    mode: "payment",
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: params.metadata,
  })
  return { sessionId: session.id, url: session.url! }
}

export async function getCheckoutStatus(sessionId: string) {
  const s = await stripe.checkout.sessions.retrieve(sessionId)
  return { status: s.status || "unknown", paymentStatus: s.payment_status, amountTotal: s.amount_total ? s.amount_total / 100 : null, currency: s.currency, metadata: s.metadata || {} }
}

export function constructWebhookEvent(body: Buffer, sig: string) {
  return stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET || "")
}
