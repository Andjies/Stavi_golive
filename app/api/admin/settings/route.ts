import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req)
  if (error) return error
  const s = await prisma.settings.findUnique({ where: { id: "global" } }) || {}
  return NextResponse.json(s)
}
export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin(req)
  if (error) return error
  const body = await req.json()
  const MAP: Record<string,string> = { whatsapp_link_fr:"whatsappLinkFr", whatsapp_link_en:"whatsappLinkEn", bundle_price:"bundlePrice", personalized_price:"personalizedPrice", shipping_ch:"shippingCh", shipping_eu:"shippingEu", shipping_world:"shippingWorld", openai_key:"openaiKey", claude_key:"claudeKey", gemini_key:"geminiKey" }
  const data: Record<string,unknown> = {}
  for (const [k,v] of Object.entries(body)) if (v !== null && v !== undefined) data[MAP[k]||k] = v
  const s = await prisma.settings.upsert({ where: { id: "global" }, update: data as any, create: { id: "global", ...data as any } })
  return NextResponse.json(s)
}