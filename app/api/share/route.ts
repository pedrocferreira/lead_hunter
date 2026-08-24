import { NextRequest, NextResponse } from "next/server";
import { saveSharedLead } from "@/lib/serverShareStore";
import { Lead } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lead, type } = body as { lead?: Lead; type?: "cartao" | "preview" };

    if (!lead || !lead.id) {
      return NextResponse.json(
        { success: false, error: "Lead inválido ou sem ID" },
        { status: 400 }
      );
    }

    const payload = saveSharedLead(lead, type || "cartao");

    return NextResponse.json({
      success: true,
      id: payload.id,
      type: payload.type,
      expiresAt: payload.expiresAt,
      remainingMs: payload.expiresAt - payload.createdAt,
    });
  } catch (error) {
    console.error("Erro na rota /api/share:", error);
    return NextResponse.json(
      { success: false, error: "Falha ao salvar link público" },
      { status: 500 }
    );
  }
}
