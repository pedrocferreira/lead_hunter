import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { convertLeadToClient } from "@/lib/db";
import { Lead } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Não autorizado." }, { status: 401 });
    }

    const { lead, monthlyFee, notes } = await req.json() as {
      lead: Lead;
      monthlyFee?: number;
      notes?: string;
    };

    if (!lead || !lead.title) {
      return NextResponse.json(
        { success: false, error: "Dados do lead inválidos para conversão." },
        { status: 400 }
      );
    }

    const result = convertLeadToClient(user.id, lead, {
      monthlyFee: monthlyFee || 99,
      notes: notes || "Convertido do Google Maps Lead Hunter",
    });

    return NextResponse.json({
      success: true,
      message: `Cliente ${result.client.companyName} criado com sucesso!`,
      client: result.client,
      site: result.site,
      card: result.card,
    });
  } catch (error: any) {
    console.error("Erro ao converter lead em cliente:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
