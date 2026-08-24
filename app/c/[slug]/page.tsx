import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHostedSiteBySlugAndType, getClientById, incrementSiteView } from "@/lib/db";
import { LinkCard } from "@/components/preview/LinkCard";
import { Wrench, ShieldAlert, Phone, MessageCircle } from "lucide-react";
import { Lead } from "@/lib/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const card = getHostedSiteBySlugAndType(params.slug, "card");
  if (!card) return { title: "Cartão não encontrado" };
  return {
    title: `${card.title} — Cartão Digital`,
    description: `Acesse o cartão de visita digital e links de contato de ${card.title}.`,
  };
}

export default async function PublicHostedCardPage(props: PageProps) {
  const params = await props.params;
  const card = getHostedSiteBySlugAndType(params.slug, "card");

  if (!card) {
    notFound();
  }

  incrementSiteView(card.id);
  const client = getClientById(card.clientId);

  if (card.status === "maintenance") {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-xl">
          <Wrench className="w-8 h-8 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{client?.companyName || card.title}</h1>
        <p className="text-slate-400 max-w-sm mb-6 text-sm">
          Este cartão digital está em manutenção temporária.
        </p>
        {client?.whatsapp && (
          <a
            href={`https://wa.me/${client.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            Contato via WhatsApp
          </a>
        )}
      </div>
    );
  }

  if (card.status === "inactive") {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4 shadow-xl">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{client?.companyName || card.title}</h1>
        <p className="text-slate-400 max-w-sm mb-6 text-sm">
          Este cartão digital está temporariamente desativado.
        </p>
      </div>
    );
  }

  // Se tivermos os dados do cliente, monta o lead para renderizar o componente interativo LinkCard
  if (client) {
    const lead: Lead = {
      id: client.id,
      title: client.companyName,
      phone: client.phone,
      whatsappNumber: client.whatsapp,
      address: client.address,
      city: client.city,
      category: client.category,
      rating: client.rating,
      reviewsCount: client.reviewsCount,
      analyzedStatus: "NO_SITE",
      analyzedAt: client.createdAt,
      logoUrl: client.logoUrl,
      brandColors: client.brandColors,
      instagramHandle: client.instagramHandle,
      facebookHandle: client.facebookHandle,
      originalWebsite: client.originalWebsite,
      openingHours: client.openingHours,
      photos: client.photos,
    };

    return (
      <main className="min-h-screen bg-slate-950">
        <LinkCard lead={lead} animated />
      </main>
    );
  }

  // Fallback: se for HTML estático
  return (
    <iframe
      srcDoc={card.htmlContent}
      title={card.title}
      className="w-full h-screen border-0 m-0 p-0 block bg-slate-950"
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation"
    />
  );
}
