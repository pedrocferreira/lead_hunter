import { NextRequest, NextResponse } from "next/server";

const BOT_URL = process.env.WA_BOT_URL || "http://localhost:3010";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, nome, empresa, segmento, cidade, obs } = body;

    if (!phone) {
      return NextResponse.json(
        { error: "Campo 'phone' é obrigatório" },
        { status: 400 }
      );
    }

    const res = await fetch(`${BOT_URL}/disparar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, nome, empresa, segmento, cidade, obs }),
      signal: AbortSignal.timeout(15000),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || "Erro ao ativar bot", success: false },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[API /api/bot/disparar] Erro:", error.message);
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      return NextResponse.json(
        { error: "Bot demorou demais para responder.", success: false },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: "Bot indisponível na porta 3010.", success: false },
      { status: 503 }
    );
  }
}
