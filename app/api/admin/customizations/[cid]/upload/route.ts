import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireSuperAdmin } from "@/lib/auth"
import { sendEmail } from "@/lib/email"
export async function POST(req: NextRequest, { params }: { params: { cid: string } }) {
  const { error } = await requireSuperAdmin(req)
  if (error) return error
  const custom = await prisma.customization.findUnique({ where: { id: params.cid } })
  if (!custom) return NextResponse.json({ detail: "Not found" }, { status: 404 })
  const fd = await req.formData()
  const file = fd.get("file") as File | null
  if (!file) return NextResponse.json({ detail: "No file" }, { status: 400 })
  const buf = Buffer.from(await file.arrayBuffer())
  if (buf.length > 15*1024*1024) return NextResponse.json({ detail: "File too large" }, { status: 400 })
  await prisma.customization.update({ where: { id: params.cid }, data: { pdfData: buf, pdfFilename: file.name, status: "delivered", deliveredAt: new Date() } })
  await sendEmail(custom.userEmail, `Le livre personnalisé de ${custom.childName} est prêt ! ✨`, `<h2>Bonjour ${custom.userName} 💛</h2><p>Le livre personnalisé de <b>${custom.childName}</b> sur le thème <b>« ${custom.themeToWork} »</b> est prêt.</p><p>Téléchargez-le dans votre espace Stavi → Ma bibliothèque.</p>`, { filename: file.name, content: buf })
  return NextResponse.json({ ok: true })
}