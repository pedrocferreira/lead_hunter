import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getHostedSitesByUserId, getClientById } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Não autorizado." }, { status: 401 });
    }

    const sites = getHostedSitesByUserId(user.id);
    const enriched = sites.map((s) => {
      const client = getClientById(s.clientId);
      return {
        ...s,
        companyName: client?.companyName || s.title,
        clientStatus: client?.status || s.status,
      };
    });

    return NextResponse.json({ success: true, sites: enriched });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
