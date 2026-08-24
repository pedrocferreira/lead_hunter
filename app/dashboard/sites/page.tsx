"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Globe,
  CreditCard,
  ExternalLink,
  Code2,
  Copy,
  Check,
  Search,
  Eye,
  TrendingUp,
} from "lucide-react";

export default function HostedSitesPage() {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sites")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSites(data.sites || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function copyLink(type: "site" | "card", slug: string, id: string) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/${type === "site" ? "s" : "c"}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  }

  const filtered = sites.filter((s) =>
    s.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalViews = sites.reduce((acc, s) => acc + (s.viewsCount || 0), 0);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Globe className="w-7 h-7 text-violet-500" />
            Hub de Hospedagem de Sites e Cartões
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Todos os sites e cartões digitais ativos hospedados na sua URL com controle de tráfego
          </p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="text-slate-400 text-xs font-semibold uppercase">Total de Páginas Hospedadas</div>
          <div className="text-2xl font-bold text-white mt-1">{sites.length} páginas</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="text-slate-400 text-xs font-semibold uppercase">Total de Acessos / Visualizações</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <span>{totalViews} views</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="text-slate-400 text-xs font-semibold uppercase">Disponibilidade do Hub</div>
          <div className="text-2xl font-bold text-violet-400 mt-1">99.9% Online</div>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar site ou cartão por título ou slug..."
          className="w-full bg-transparent border-0 text-sm text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* ── Sites Grid ── */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm">Carregando sites hospedados...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-slate-500 space-y-3 bg-slate-900/40 rounded-2xl border border-slate-800">
          <div className="text-5xl">🌐</div>
          <p className="text-base font-semibold text-slate-400">Nenhum site hospedado no momento</p>
          <p className="text-xs text-slate-500">
            Ao converter um lead ou cadastrar um cliente, o site e o cartão são gerados e hospedados aqui.
          </p>
          <Link
            href="/dashboard"
            className="inline-block mt-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold"
          >
            Prospectar Leads Agora
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((site) => {
            const isSite = site.type === "site";
            const publicPath = `/${isSite ? "s" : "c"}/${site.slug}`;
            const isCopied = copiedId === site.id;

            return (
              <div
                key={site.id}
                className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                        isSite
                          ? "bg-violet-600/10 text-violet-300 border-violet-500/20"
                          : "bg-pink-600/10 text-pink-300 border-pink-500/20"
                      }`}
                    >
                      {isSite ? <Globe className="w-3.5 h-3.5" /> : <CreditCard className="w-3.5 h-3.5" />}
                      <span>{isSite ? "Landing Page Oficial" : "Cartão Digital Bio"}</span>
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        site.status === "active"
                          ? "text-emerald-400 bg-emerald-500/10"
                          : site.status === "maintenance"
                          ? "text-amber-400 bg-amber-500/10"
                          : "text-red-400 bg-red-500/10"
                      }`}
                    >
                      {site.status === "active" ? "🟢 Ativo" : site.status === "maintenance" ? "🟡 Manutenção" : "🔴 Desativado"}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base tracking-tight truncate">
                    {site.title}
                  </h3>

                  <div className="mt-3 p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-mono text-violet-300 truncate">
                      {publicPath}
                    </span>
                    <button
                      onClick={() => copyLink(site.type, site.slug, site.id)}
                      title="Copiar URL Pública"
                      className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <strong>{site.viewsCount || 0}</strong> visualizações
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2">
                  <a
                    href={publicPath}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all"
                  >
                    <span>Abrir Página</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  <Link
                    href={`/dashboard/editor/${site.id}`}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-violet-600/15 hover:bg-violet-600/25 border border-violet-500/30 text-violet-300 rounded-xl text-xs font-semibold transition-all"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Live Editor</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
