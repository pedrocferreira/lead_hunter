import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/db";
import { signJwt } from "@/lib/auth/jwt";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, plan } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Nome, email e senha são obrigatórios." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "A senha deve ter no mínimo 6 caracteres." },
        { status: 400 }
      );
    }

    const existing = findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Este email já está cadastrado." },
        { status: 400 }
      );
    }

    const user = createUser({
      name,
      email,
      password,
      plan: plan || "pro",
    });

    const token = await signJwt({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      plan: user.plan,
    });

    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
      },
    });

    // Seta cookie seguro HTTP-Only
    res.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      path: "/",
    });

    return res;
  } catch (error: any) {
    console.error("Erro no registro:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Falha ao registrar usuário." },
      { status: 500 }
    );
  }
}
