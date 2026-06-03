import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth"
import { computeRecommendations } from "@/lib/quiz"
import type { QuizAnswer } from "@/lib/quiz"

export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth(req)
  if (error) return error
  const { answers } = await req.json()
  if (!answers || typeof answers !== "object")
    return NextResponse.json({ detail: "answers required" }, { status: 400 })

  const recs = computeRecommendations(answers as Record<string, QuizAnswer>)
  const top2 = recs.filter(r => r.priority === "urgent").slice(0, 2)
  const topOrderIdxs = top2.length >= 2 ? top2.map(r => r.orderIdx) : recs.slice(0, 2).map(r => r.orderIdx)

  await prisma.quizResult.create({
    data: { userId: user!.id, answers: { answers, recommendations: recs, top2: topOrderIdxs } },
  })
  return NextResponse.json({ ok: true, recommendations: recs, top2: topOrderIdxs })
}

export async function GET(req: NextRequest) {
  const { user, error } = await requireAuth(req)
  if (error) return error
  const result = await prisma.quizResult.findFirst({
    where: { userId: user!.id },
    orderBy: { createdAt: "desc" },
  })
  if (!result) return NextResponse.json(null)
  return NextResponse.json(result.answers)
}
