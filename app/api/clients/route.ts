import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { getClientsByUserId, createClient, getHostedSitesByClientId } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Não autorizado." }, { status: 401 });
    }

    const clients = getClientsByUserId(user.id);
    
    // Anexa informações resumidas dos sites hospedados
    const clientsWithSites = clients.map((c) => {
      const sites = getHostedSitesByClientId(c.id);
      const siteObj = sites.find((s) => s.type === "site");
      const cardObj = sites.find((s) => s.type === "card");
      return {
        ...c,
        site: siteObj ? { id: siteObj.id, slug: siteObj.slug, status: siteObj.status, views: siteObj.viewsCount } : null,
        card: cardObj ? { id: cardObj.id, slug: cardObj.slug, status: cardObj.status, views: cardObj.viewsCount } : null,
      };
    });

    return NextResponse.json({ success: true, clients: clientsWithSites });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Não autorizado." }, { status: 401 });
    }

    const body = await req.json();
    const { companyName, category, phone, whatsapp, address, city } = body;

    if (!companyName || !category) {
      return NextResponse.json(
        { success: false, error: "Nome da empresa e nicho/categoria são obrigatórios." },
        { status: 400 }
      );
    }

    const result = createClient(user.id, {
      companyName,
      clientName: body.clientName || "",
      slug: body.slug || "",
      category,
      phone: phone || "",
      whatsapp: whatsapp || phone || "",
      address: address || "",
      city: city || "",
      logoUrl: body.logoUrl || "",
      brandColors: body.brandColors || {},
      instagramHandle: body.instagramHandle || "",
      facebookHandle: body.facebookHandle || "",
      originalWebsite: body.originalWebsite || "",
      rating: Number(body.rating) || 5.0,
      reviewsCount: Number(body.reviewsCount) || 1,
      services: body.services || [],
      photos: body.photos || [],
      openingHours: body.openingHours || {},
      notes: body.notes || "",
      status: body.status || "active",
      monthlyFee: Number(body.monthlyFee) || 99,
      dueDay: Number(body.dueDay) || 10,
    });

    return NextResponse.json({
      success: true,
      client: result.client,
      site: result.site,
      card: result.card,
    });
  } catch (error: any) {
    console.error("Erro ao criar cliente:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
