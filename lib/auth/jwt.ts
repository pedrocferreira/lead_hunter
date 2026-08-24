// ============================================================
// Autenticação JWT com jose — Criptografia Web Crypto segura
// ============================================================

import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "leadhunter-super-secret-production-key-2026-xyz";
const secret = new TextEncoder().encode(JWT_SECRET_STRING);

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: "admin" | "user";
  plan: string;
}

/**
 * Assina um token JWT com validade de 7 dias
 */
export async function signJwt(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

/**
 * Verifica e decodifica um token JWT
 */
export async function verifyJwt(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as "admin" | "user",
      plan: payload.plan as string,
    };
  } catch {
    return null;
  }
}
