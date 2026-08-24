import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getHostedSiteById, updateHostedSiteCode, getClientById } from "@/lib/db";

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
    const site = getHostedSiteById(id, user.id);
    if (!site) {
      return NextResponse.json({ success: false, error: "Site não encontrado." }, { status: 404 });
    }

    const client = getClientById(site.clientId);

    return NextResponse.json({
      success: true,
      site,
      client,
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

    const updated = updateHostedSiteCode(id, user.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Site não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: true, site: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
