import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export async function GET() {
  const s = await prisma.settings.findUnique({ where: { id: "global" } })
  return NextResponse.json({ whatsapp_link_fr: s?.whatsappLinkFr||"", whatsapp_link_en: s?.whatsappLinkEn||"", bundle_price: s?.bundlePrice??49.99, personalized_price: s?.personalizedPrice??24.99, shipping_ch: s?.shippingCh??5, shipping_eu: s?.shippingEu??10, shipping_world: s?.shippingWorld??15 })
}