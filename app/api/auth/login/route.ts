import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "@/lib/db";
import { signJwt } from "@/lib/auth/jwt";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const user = findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Email ou senha incorretos." },
        { status: 401 }
      );
    }

    const match = bcrypt.compareSync(password, user.passwordHash);
    if (!match) {
      return NextResponse.json(
        { success: false, error: "Email ou senha incorretos." },
        { status: 401 }
      );
    }

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

    res.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return res;
  } catch (error: any) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Falha ao realizar login." },
      { status: 500 }
    );
  }
}
