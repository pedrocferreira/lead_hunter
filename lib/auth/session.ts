// ============================================================
// Gerenciamento de Sessão de Usuário
// ============================================================

import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt, TokenPayload } from "./jwt";
import { findUserById } from "../db";
import { UserRecord } from "../db/types";

export const AUTH_COOKIE_NAME = "lh_auth_token";

/**
 * Obtém o usuário atual a partir do cookie ou header Authorization
 */
export async function getSessionUser(req?: NextRequest): Promise<UserRecord | null> {
  let token: string | undefined;

  if (req) {
    // 1. Tenta pegar do cookie da requisição
    token = req.cookies.get(AUTH_COOKIE_NAME)?.value;

    // 2. Tenta pegar do header Authorization Bearer
    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }
  } else {
    // Se chamado em Server Component / Server Action
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    } catch {
      // silencioso
    }
  }

  if (!token) return null;

  const payload: TokenPayload | null = await verifyJwt(token);
  if (!payload || !payload.userId) return null;

  return findUserById(payload.userId);
}
