import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth"
import { createCheckoutSession } from "@/lib/stripe"
export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth(req)
  if (error) return error
  const { item_type, item_id, origin_url, donation_amount, currency = "chf" } = await req.json()
  const settings = await prisma.settings.findUnique({ where: { id: "global" } }) || { bundlePrice: 49.99, personalizedPrice: 24.99 }
  let amount: number, label: string, metadata: Record<string,string>
  if (item_type === "book") {
    const book = await prisma.book.findUnique({ where: { id: item_id } })
    if (!book) return NextResponse.json({ detail: "Book not found" }, { status: 404 })
    amount = book.priceEbook; label = `Ebook PDF — ${book.titleFr}`
    metadata = { item_type: "book", book_id: item_id, user_id: user!.id, label }
  } else if (item_type === "bundle") {
    amount = settings.bundlePrice
    const allBooks = await prisma.book.findMany({ select: { id: true } })
    metadata = { item_type: "bundle", user_id: user!.id, book_ids: allBooks.map(b=>b.id).join(","), label: "Pack Collection Stavi", includes_personalized: "true" }
    label = metadata.label
  } else if (item_type === "personalized") {
    amount = settings.personalizedPrice; label = "Livre personnalisé Stavi"
    metadata = { item_type: "personalized", user_id: user!.id, label }
  } else if (item_type === "donation") {
    if (!donation_amount || donation_amount < 1) return NextResponse.json({ detail: "Donation must be >= 1" }, { status: 400 })
    amount = parseFloat(donation_amount); label = "Don solidaire familles TSA"
    metadata = { item_type: "donation", user_id: user!.id, label }
  } else return NextResponse.json({ detail: "Invalid item type" }, { status: 400 })
  const session = await createCheckoutSession({ amount, currency, successUrl: `${origin_url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`, cancelUrl: `${origin_url}/checkout/cancel`, metadata })
  await prisma.paymentTransaction.create({ data: { sessionId: session.sessionId, userId: user!.id, userEmail: user!.email, amount, currency, itemType: item_type, metadata, paymentStatus: "pending", status: "open" } })
  return NextResponse.json({ url: session.url, session_id: session.sessionId })
}