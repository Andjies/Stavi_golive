import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "./prisma"

const jwtSecretEnv = process.env.JWT_SECRET
if (!jwtSecretEnv && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET environment variable is required in production")
}
const secret = new TextEncoder().encode(jwtSecretEnv || "stavi-dev-secret-min-32-chars-!!")

export const hashPassword = (pw: string) => bcrypt.hash(pw, 12)
export const verifyPassword = (pw: string, hash: string) => bcrypt.compare(pw, hash)

export async function createToken(userId: string, role: string) {
  return new SignJWT({ sub: userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return { sub: payload.sub as string, role: payload.role as string }
  } catch { return null }
}

function extractToken(req: NextRequest) {
  const auth = req.headers.get("authorization")
  if (auth?.startsWith("Bearer ")) return auth.slice(7)
  // also check cookie for SSR calls
  return req.cookies.get("stavi_token")?.value ?? null
}

export async function getCurrentUser(req: NextRequest) {
  const token = extractToken(req)
  if (!token) return null
  const payload = await verifyToken(token)
  if (!payload) return null
  return prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, name: true, role: true, language: true },
  })
}

type AuthResult = { user: Awaited<ReturnType<typeof getCurrentUser>>; error: NextResponse | null }

export async function requireAuth(req: NextRequest): Promise<AuthResult> {
  const user = await getCurrentUser(req)
  if (!user) return { user: null, error: NextResponse.json({ detail: "Not authenticated" }, { status: 401 }) }
  return { user, error: null }
}

export async function requireAdmin(req: NextRequest): Promise<AuthResult> {
  const { user, error } = await requireAuth(req)
  if (error) return { user: null, error }
  if (!["admin", "moderator"].includes(user!.role))
    return { user: null, error: NextResponse.json({ detail: "Admin only" }, { status: 403 }) }
  return { user, error: null }
}

export async function requireSuperAdmin(req: NextRequest): Promise<AuthResult> {
  const { user, error } = await requireAuth(req)
  if (error) return { user: null, error }
  if (user!.role !== "admin")
    return { user: null, error: NextResponse.json({ detail: "Super admin only" }, { status: 403 }) }
  return { user, error: null }
}
