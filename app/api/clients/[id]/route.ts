import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getClientById, updateClient, deleteClient, getHostedSitesByClientId } from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Não autorizado." }, { status: 401 });
    }

    const { id } = await context.params;
    const client = getClientById(id, user.id);
    if (!client) {
      return NextResponse.json({ success: false, error: "Cliente não encontrado." }, { status: 404 });
    }

    const sites = getHostedSitesByClientId(client.id);

    return NextResponse.json({
      success: true,
      client,
      sites,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Não autorizado." }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();

    const updated = updateClient(id, user.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Cliente não encontrado ou não atualizado." }, { status: 404 });
    }

    return NextResponse.json({ success: true, client: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Não autorizado." }, { status: 401 });
    }

    const { id } = await context.params;
    const deleted = deleteClient(id, user.id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Cliente não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Cliente e sites removidos com sucesso." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
