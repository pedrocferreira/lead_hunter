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
  Link2,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Info,
  Wifi,
  WifiOff,
} from "lucide-react";

// ─── Modal de Domínio Customizado ─────────────────────────────────────────────

interface DomainModalProps {
  site: any;
  onClose: () => void;
  onSaved: (siteId: string, domain: string) => void;
}

function DomainModal({ site, onClose, onSaved }: DomainModalProps) {
  const [domain, setDomain] = useState(site.customDomain || "");
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedTarget, setCopiedTarget] = useState<string | null>(null);
  const [dnsStatus, setDnsStatus] = useState<{
    checked: boolean;
    ok: boolean;
    message: string;
    ip?: string;
  } | null>(null);

  const platformHost =
    typeof window !== "undefined" ? window.location.host.split(":")[0] : "suaplataforma.com.br";

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedTarget(id);
    setTimeout(() => setCopiedTarget(null), 2000);
  }

  async function handleSave() {
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];

    try {
      const res = await fetch(`/api/sites/${site.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customDomain: cleanDomain || null }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Erro ao salvar.");
      setSaveSuccess(true);
      onSaved(site.id, cleanDomain);
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleCheckDns() {
    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
    if (!cleanDomain) return;

    setChecking(true);
    setDnsStatus(null);

    try {
      const res = await fetch(
        `/api/domain-check?domain=${encodeURIComponent(cleanDomain)}`
      );
      const data = await res.json();
      setDnsStatus({
        checked: true,
        ok: data.ok,
        message: data.ok ? (data.message || `DNS OK — resolvendo para ${data.ip}`) : data.error,
        ip: data.ip,
      });
    } catch {
      setDnsStatus({
        checked: true,
        ok: false,
        message: "Não foi possível verificar no momento. Tente novamente.",
      });
    } finally {
      setChecking(false);
    }
  }

  function handleRemoveDomain() {
    setDomain("");
    setDnsStatus(null);
    setSaveSuccess(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}
    >
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Conectar Domínio Próprio</h2>
              <p className="text-xs text-slate-400 truncate max-w-[320px]">
                {site.title} ({site.type === "site" ? "Landing Page" : "Cartão Bio"})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="px-6 py-5 space-y-5 overflow-y-auto custom-scrollbar flex-1">

          {/* Campo de Domínio */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Domínio do Cliente (ex: comprado no Registro.br, Hostinger, GoDaddy)
            </label>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 focus-within:border-violet-500 rounded-2xl px-3.5 py-3 transition-colors">
              <span className="text-slate-500 text-xs font-mono shrink-0">https://</span>
              <input
                type="text"
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value);
                  setDnsStatus(null);
                  setSaveSuccess(false);
                }}
                placeholder="www.meuclienteVip.com.br"
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 focus:outline-none min-w-0 font-medium"
              />
              {domain && (
                <button
                  onClick={handleRemoveDomain}
                  className="text-slate-500 hover:text-red-400 p-1 transition-colors shrink-0"
                  title="Limpar domínio"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Recomendamos usar com <span className="text-slate-300 font-mono">www.</span> para facilitar o apontamento CNAME no Registro.br.
            </p>
          </div>

          {/* Status DNS */}
          {dnsStatus && (
            <div
              className={`flex items-start gap-2.5 p-3.5 rounded-2xl border text-xs leading-relaxed ${
                dnsStatus.ok
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-300"
              }`}
            >
              {dnsStatus.ok ? (
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" />
              )}
              <div className="flex-1">
                <span className="font-semibold">{dnsStatus.ok ? "Apontamento Detectado!" : "Aguardando DNS"}</span>
                <p className="mt-0.5 text-[11px] opacity-90">{dnsStatus.message}</p>
              </div>
            </div>
          )}

          {/* Guia Passo a Passo Registro.br */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <Info className="w-3.5 h-3.5 text-violet-400" />
                Como configurar no Registro.br (Passo a Passo)
              </span>
              <a
                href="https://registro.br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-violet-400 hover:text-violet-300 flex items-center gap-1 font-semibold hover:underline"
              >
                Abrir Registro.br
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-3 text-xs">
              {/* Passo 1 */}
              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div className="space-y-1 flex-1">
                  <p className="text-slate-200 font-semibold">Acesse o painel do domínio</p>
                  <p className="text-[11px] text-slate-400">
                    Faça login no <strong>Registro.br</strong> → clique no domínio desejado → role até <strong>DNS</strong> e clique em <strong>Editar Zona</strong> (ou Modo Avançado).
                  </p>
                </div>
              </div>

              {/* Passo 2 */}
              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div className="space-y-2 flex-1">
                  <p className="text-slate-200 font-semibold">Crie o registro CNAME para o subdomínio</p>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1.5 font-mono text-[11px]">
                    <div className="grid grid-cols-3 text-slate-500 text-[10px] uppercase font-bold tracking-wider pb-1 border-b border-slate-800">
                      <span>Tipo</span>
                      <span>Nome</span>
                      <span>Valor / Destino</span>
                    </div>
                    <div className="grid grid-cols-3 text-slate-200 items-center pt-1">
                      <span className="text-amber-400 font-semibold">CNAME</span>
                      <span className="text-emerald-400 font-semibold">www</span>
                      <div className="flex items-center justify-between gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                        <span className="text-violet-300 truncate">{platformHost}</span>
                        <button
                          onClick={() => copyToClipboard(platformHost, "cname")}
                          title="Copiar destino CNAME"
                          className="text-slate-400 hover:text-white shrink-0 p-0.5"
                        >
                          {copiedTarget === "cname" ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passo 3 */}
              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div className="space-y-1 flex-1">
                  <p className="text-slate-200 font-semibold">Redirecionamento da raiz (Opcional)</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    No Registro.br você pode configurar o <strong>Redirecionamento de Domínio</strong> de <span className="text-slate-300 font-mono">meudominio.com.br</span> para <span className="text-slate-300 font-mono">www.meudominio.com.br</span> para garantir que visitantes sem o &quot;www&quot; também cheguem ao site.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback */}
          {saveSuccess && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              Domínio vinculado com sucesso! Assim que o DNS propagar, o site responderá diretamente nele.
            </div>
          )}
          {saveError && (
            <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              {saveError}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/80 shrink-0">
          <button
            onClick={handleCheckDns}
            disabled={!domain.trim() || checking}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {checking ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : dnsStatus?.ok ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            ) : dnsStatus ? (
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Wifi className="w-3.5 h-3.5 text-slate-400" />
            )}
            Testar DNS Agora
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              Fechar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-600/25"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              {saving ? "Salvando..." : "Salvar Configuração"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Página Principal ─────────────────────────────────────────────────────────

export default function HostedSitesPage() {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [domainModalSite, setDomainModalSite] = useState<any | null>(null);

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

  function handleDomainSaved(siteId: string, domain: string) {
    setSites((prev) =>
      prev.map((s) => (s.id === siteId ? { ...s, customDomain: domain } : s))
    );
  }

  const filtered = sites.filter(
    (s) =>
      s.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalViews = sites.reduce((acc, s) => acc + (s.viewsCount || 0), 0);

  return (
    <>
      {/* Modal de Domínio */}
      {domainModalSite && (
        <DomainModal
          site={domainModalSite}
          onClose={() => setDomainModalSite(null)}
          onSaved={handleDomainSaved}
        />
      )}

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
              const hasCustomDomain = !!site.customDomain;

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

                    {/* URL pública da plataforma */}
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

                    {/* Domínio Customizado */}
                    <div
                      className={`mt-2.5 p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                        hasCustomDomain
                          ? "bg-emerald-500/10 border-emerald-500/30"
                          : "bg-slate-950/40 border-slate-800 hover:border-violet-500/30"
                      }`}
                    >
                      <button
                        onClick={() => setDomainModalSite(site)}
                        className="flex-1 flex items-center gap-2 min-w-0 text-left"
                      >
                        <Link2
                          className={`w-3.5 h-3.5 shrink-0 ${
                            hasCustomDomain ? "text-emerald-400" : "text-slate-500"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <span
                            className={`text-xs font-mono block truncate ${
                              hasCustomDomain ? "text-emerald-300 font-semibold" : "text-slate-400"
                            }`}
                          >
                            {hasCustomDomain ? site.customDomain : "Conectar domínio próprio"}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-violet-400 hover:text-violet-300 shrink-0 px-2 py-0.5 rounded bg-violet-600/20">
                          {hasCustomDomain ? "Configurar" : "+ Adicionar"}
                        </span>
                      </button>

                      {hasCustomDomain && (
                        <a
                          href={`https://${site.customDomain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Abrir no domínio próprio"
                          className="ml-2 p-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors shrink-0"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
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
                      href={hasCustomDomain ? `https://${site.customDomain}` : publicPath}
                      target="_blank"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all"
                    >
                      <span>{hasCustomDomain ? "Abrir Domínio" : "Abrir Página"}</span>
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
    </>
  );
}
