import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"

export async function GET(req: NextRequest, { params }: { params: Promise<{ rid: string }> }) {
  const { error } = await requireAdmin(req)
  if (error) return error
  const { rid } = await params
  const doc = await prisma.aidRequest.findUnique({ where: { id: rid } })
  if (!doc?.justificationData) return NextResponse.json({ detail: "Not found" }, { status: 404 })
  return new NextResponse(doc.justificationData as unknown as ArrayBuffer, {
    headers: {
      "Content-Type": doc.justificationMime,
      "Content-Disposition": `attachment; filename="${doc.justificationFilename}"`
    }
  })
}
