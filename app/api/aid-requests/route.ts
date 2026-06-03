import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth"
export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth(req)
  if (error) return error
  const fd = await req.formData()
  const familySituation = fd.get("family_situation") as string
  const organism = fd.get("organism") as string
  const childDifficulties = fd.get("child_difficulties") as string
  const country = fd.get("country") as string
  const justificatif = fd.get("justificatif") as File | null
  if (!familySituation || !organism || !childDifficulties || !country)
    return NextResponse.json({ detail: "Missing required fields" }, { status: 400 })
  let jBuf: Buffer | null = null, jMime = "application/octet-stream", jName = "justificatif"
  if (justificatif) {
    jBuf = Buffer.from(await justificatif.arrayBuffer())
    if (jBuf.length > 8*1024*1024) return NextResponse.json({ detail: "Fichier trop lourd (max 8 Mo)" }, { status: 400 })
    jMime = justificatif.type; jName = justificatif.name
  }
  const aid = await prisma.aidRequest.create({ data: { userId: user!.id, userEmail: user!.email, userName: user!.name, familySituation, organism, organismOther: (fd.get("organism_other") as string)||"", childDifficulties, country, monthlyIncomeRange: (fd.get("monthly_income_range") as string)||"", justificationData: jBuf||undefined, justificationMime: jMime, justificationFilename: jName, status: "pending" } })
  return NextResponse.json({ id: aid.id, status: aid.status })
}