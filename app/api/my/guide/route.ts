import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const { user, error } = await requireAuth(req)
  if (error) return error

  const isAdmin = ["admin", "moderator"].includes(user!.role)
  if (!isAdmin) {
    const txns = await prisma.paymentTransaction.findMany({
      where: { userId: user!.id, paymentStatus: "paid" },
    })
    const hasBundle = txns.some((t) => (t.metadata as any).item_type === "bundle")
    if (!hasBundle) return NextResponse.json({ detail: "Accès refusé" }, { status: 403 })
  }

  const settings = await prisma.settings.findUnique({ where: { id: "global" } })
  if (!settings?.guideData) return NextResponse.json({ detail: "Guide non disponible" }, { status: 404 })

  return new NextResponse(settings.guideData, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${settings.guideName || "guide-stavi.pdf"}"`,
    },
  })
}
