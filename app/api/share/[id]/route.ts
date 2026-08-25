import { NextRequest, NextResponse } from "next/server";
import { getSharedLead } from "@/lib/serverShareStore";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID não fornecido" },
        { status: 400 }
      );
    }

    const { payload, isExpired, remainingMs } = getSharedLead(id);

    if (isExpired) {
      return NextResponse.json(
        {
          success: false,
          error: "O link para este cartão expirou após o limite de 6 horas.",
          isExpired: true,
        },
        { status: 410 } // 410 Gone
      );
    }

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          error: "Cartão não encontrado.",
          isExpired: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      lead: payload.lead,
      type: payload.type,
      createdAt: payload.createdAt,
      expiresAt: payload.expiresAt,
      remainingMs,
    });
  } catch (error) {
    console.error("Erro na rota GET /api/share/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
