import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin(req)
  if (error) return error

  const yearStart = new Date(new Date().getFullYear(), 0, 1)

  const [users, paid, custPending, pendingPosts, allTxns, donations, familiesAidedTotal, familiesAidedYear] = await Promise.all([
    prisma.user.count(),
    prisma.paymentTransaction.count({ where: { paymentStatus: "paid" } }),
    prisma.customization.count({ where: { status: "pending" } }),
    prisma.post.count({ where: { status: "pending" } }),
    prisma.paymentTransaction.findMany({ where: { paymentStatus: "paid" }, select: { amount: true, itemType: true } }),
    prisma.paymentTransaction.findMany({ where: { paymentStatus: "paid", itemType: "donation" }, select: { amount: true } }),
    prisma.aidRequest.count({ where: { status: "approved" } }),
    prisma.aidRequest.count({ where: { status: "approved", approvedAt: { gte: yearStart } } }),
  ])

  const revenue = allTxns.filter(t => t.itemType !== "donation").reduce((s, t) => s + t.amount, 0)
  const donationsTotal = donations.reduce((s, t) => s + t.amount, 0)

  return NextResponse.json({
    users,
    paid_orders: paid,
    pending_customizations: custPending,
    pending_posts: pendingPosts,
    revenue,
    donations_count: donations.length,
    donations_total: donationsTotal,
    families_aided_total: familiesAidedTotal,
    families_aided_year: familiesAidedYear,
  })
}
