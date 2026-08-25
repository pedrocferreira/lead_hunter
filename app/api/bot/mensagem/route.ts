import { NextRequest, NextResponse } from "next/server";

const BOT_URL = process.env.WA_BOT_URL || "http://localhost:3010";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, texto } = body;

    if (!phone || !texto) {
      return NextResponse.json(
        { error: "Campos 'phone' e 'texto' são obrigatórios", success: false },
        { status: 400 }
      );
    }

    const res = await fetch(`${BOT_URL}/mensagem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, texto }),
      signal: AbortSignal.timeout(15000),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("[API /api/bot/mensagem] Erro:", error.message);
    return NextResponse.json(
      { error: "Bot indisponível na porta 3010", success: false },
      { status: 503 }
    );
  }
}
