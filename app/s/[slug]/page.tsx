import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getHostedSiteBySlugAndType, getClientById, incrementSiteView } from "@/lib/db";
import { Wrench, ShieldAlert, Phone, MessageCircle, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const site = getHostedSiteBySlugAndType(params.slug, "site");
  if (!site) return { title: "Site não encontrado" };
  return {
    title: `${site.title} — Site Oficial`,
    description: `Acesse o site oficial de ${site.title}. Informações de contato, serviços e localização.`,
  };
}

export default async function PublicHostedSitePage(props: PageProps) {
  const params = await props.params;
  const site = getHostedSiteBySlugAndType(params.slug, "site");

  if (!site) {
    notFound();
  }

  // Incrementa contador de visualizações
  incrementSiteView(site.id);
  const client = getClientById(site.clientId);

  // Status: Manutenção
  if (site.status === "maintenance") {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 shadow-xl">
          <Wrench className="w-10 h-10 animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold mb-3">{site.title}</h1>
        <p className="text-slate-400 max-w-md mb-6">
          Nosso site está passando por atualizações técnicas e melhorias para melhor atender você.
          Estaremos de volta em breve!
        </p>

        {client?.whatsapp && (
          <a
            href={`https://wa.me/${client.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-600/20"
          >
            <MessageCircle className="w-5 h-5" />
            Falar pelo WhatsApp
          </a>
        )}
      </div>
    );
  }

  // Status: Desativado / Inativo
  if (site.status === "inactive") {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-6 shadow-xl">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{site.title}</h1>
        <p className="text-slate-400 max-w-md mb-6 text-sm">
          Este site está temporariamente indisponível. Se você é o proprietário, acesse o painel
          para reativar o serviço de hospedagem.
        </p>

        {client?.phone && (
          <div className="flex items-center gap-2 text-slate-300 text-sm bg-slate-900 border border-slate-800 rounded-lg px-4 py-2">
            <Phone className="w-4 h-4 text-violet-400" />
            <span>Contato: {client.phone}</span>
          </div>
        )}
      </div>
    );
  }

  // Status: Ativo — Renderiza o HTML/CSS/JS completo
  // Combina o HTML com os estilos CSS e scripts JS
  const fullHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${site.title}</title>
  <style>
    ${site.cssContent || ""}
  </style>
</head>
<body>
  ${site.htmlContent || "<h1>Site em construção</h1>"}
  <script>
    ${site.jsContent || ""}
  </script>
</body>
</html>
  `.trim();

  return (
    <iframe
      srcDoc={fullHtml}
      title={site.title}
      className="w-full h-screen border-0 m-0 p-0 block bg-white"
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation"
    />
  );
}
