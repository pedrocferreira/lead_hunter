"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Code2,
  Save,
  RotateCcw,
  ExternalLink,
  Smartphone,
  Monitor,
  Globe,
  CreditCard,
  Check,
  Download,
  Settings,
  Sparkles,
} from "lucide-react";
import { createZip } from "@/lib/export/zip";

export default function LiveCodeEditorPage() {
  const params = useParams();
  const router = useRouter();
  const siteId = params?.siteId as string;

  const [site, setSite] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Editor states
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js" | "settings">("html");
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<"active" | "inactive" | "maintenance">("active");
  const [customDomain, setCustomDomain] = useState("");

  // Preview viewport mode: 'desktop' | 'mobile'
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    if (!siteId) return;
    fetch(`/api/sites/${siteId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.site) {
          setSite(data.site);
          setClient(data.client);
          setHtmlCode(data.site.htmlContent || "");
          setCssCode(data.site.cssContent || "");
          setJsCode(data.site.jsContent || "");
          setSlug(data.site.slug || "");
          setStatus(data.site.status || "active");
          setCustomDomain(data.site.customDomain || "");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [siteId]);

  // Live rendered document
  const previewDoc = useMemo(() => {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${site?.title || "Live Preview"}</title>
  <style>
    ${cssCode}
  </style>
</head>
<body>
  ${htmlCode}
  <script>
    try {
      ${jsCode}
    } catch(e) {
      console.error(e);
    }
  </script>
</body>
</html>
    `.trim();
  }, [htmlCode, cssCode, jsCode, site?.title]);

  async function handleSave() {
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch(`/api/sites/${siteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          htmlContent: htmlCode,
          cssContent: cssCode,
          jsContent: jsCode,
          slug,
          status,
          customDomain,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSite(data.site);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert(data.error || "Erro ao salvar alterações no código.");
      }
    } catch (err) {
      alert("Erro ao conectar ao servidor.");
    } finally {
      setSaving(false);
    }
  }

  function handleDownloadZip() {
    const files = [
      { name: "index.html", content: htmlCode },
      { name: "styles.css", content: cssCode },
      { name: "script.js", content: jsCode },
    ];
    const zip = createZip(files);
    const blob = new Blob([zip as BlobPart], { type: "application/zip" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug || "site"}-customizado.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3 text-sm">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <span>Carregando Live Editor...</span>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="p-8 text-center text-slate-400 space-y-4">
        <p>Site não encontrado para edição.</p>
        <Link href="/dashboard/sites" className="text-violet-400 text-sm font-semibold">Voltar</Link>
      </div>
    );
  }

  const publicUrl = `/${site.type === "site" ? "s" : "c"}/${slug}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      {/* ── Editor Toolbar ── */}
      <header className="h-16 px-4 md:px-6 bg-[#0f1422] border-b border-slate-800 flex items-center justify-between gap-4 shrink-0 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/sites"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Voltar"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm text-white tracking-tight truncate max-w-[200px] md:max-w-md">
                {site.title}
              </h1>
              <span className="text-[11px] font-mono text-violet-400 bg-violet-950/60 px-2 py-0.5 rounded border border-violet-800/40">
                {publicUrl}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Live Web Code Editor • HTML5 / CSS3 / JS</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Viewport switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewport("desktop")}
              title="Visualização Desktop"
              className={`p-1.5 rounded-md transition-colors ${
                viewport === "desktop" ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport("mobile")}
              title="Visualização Mobile (Celular)"
              className={`p-1.5 rounded-md transition-colors ${
                viewport === "mobile" ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleDownloadZip}
            title="Baixar ZIP do código completo"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Baixar ZIP</span>
          </button>

          <a
            href={publicUrl}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-all"
          >
            <span>Ver no Ar</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer ${
              savedSuccess
                ? "bg-emerald-600 text-white"
                : "bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/20"
            }`}
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Salvo!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? "Salvando..." : "Salvar Alterações"}</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ── Main Split View ── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Code Editor with Tabs */}
        <div className="w-full lg:w-1/2 flex flex-col bg-[#0b0e17] border-b lg:border-b-0 lg:border-r border-slate-800 h-[450px] lg:h-auto">
          {/* Tabs */}
          <div className="flex items-center bg-[#131929] border-b border-slate-800 px-2 shrink-0">
            <button
              onClick={() => setActiveTab("html")}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === "html"
                  ? "border-orange-500 text-orange-400 bg-slate-900/50"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span>index.html</span>
            </button>

            <button
              onClick={() => setActiveTab("css")}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === "css"
                  ? "border-blue-500 text-blue-400 bg-slate-900/50"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>styles.css</span>
            </button>

            <button
              onClick={() => setActiveTab("js")}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === "js"
                  ? "border-yellow-500 text-yellow-400 bg-slate-900/50"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              <span>script.js</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ml-auto ${
                activeTab === "settings"
                  ? "border-violet-500 text-violet-400 bg-slate-900/50"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Configurações</span>
            </button>
          </div>

          {/* Code Area */}
          <div className="flex-1 p-0 relative overflow-hidden flex">
            {activeTab === "html" && (
              <textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                spellCheck={false}
                placeholder="Insira seu código HTML aqui..."
                className="w-full h-full p-4 bg-[#0b0e17] text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none selection:bg-orange-500/30"
              />
            )}

            {activeTab === "css" && (
              <textarea
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                spellCheck={false}
                placeholder="Insira seus estilos CSS aqui..."
                className="w-full h-full p-4 bg-[#0b0e17] text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none selection:bg-blue-500/30"
              />
            )}

            {activeTab === "js" && (
              <textarea
                value={jsCode}
                onChange={(e) => setJsCode(e.target.value)}
                spellCheck={false}
                placeholder="Insira seu JavaScript interativo aqui..."
                className="w-full h-full p-4 bg-[#0b0e17] text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none selection:bg-yellow-500/30"
              />
            )}

            {activeTab === "settings" && (
              <div className="p-6 space-y-6 overflow-y-auto w-full">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
                  Configurações de Publicação e Domínio
                </h3>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Slug da URL na nossa plataforma
                    </label>
                    <div className="flex items-center">
                      <span className="bg-slate-800 px-3 py-2 border border-r-0 border-slate-700 rounded-l-xl text-xs text-slate-400 font-mono">
                        /{site.type === "site" ? "s" : "c"}/
                      </span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-r-xl text-xs text-white font-mono focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Status da Hospedagem
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                    >
                      <option value="active">🟢 No Ar (Ativo)</option>
                      <option value="maintenance">🟡 Em Manutenção</option>
                      <option value="inactive">🔴 Desativado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Domínio Próprio do Cliente (Opcional)
                    </label>
                    <input
                      type="text"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder="ex: www.padariabella.com.br"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      O cliente pode apontar um CNAME para o IP da sua VPS para exibir este site.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Live Iframe Preview */}
        <div className="w-full lg:w-1/2 bg-slate-900/50 flex flex-col items-center justify-center p-4 lg:p-6 overflow-hidden">
          <div
            className={`transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-white flex flex-col ${
              viewport === "mobile"
                ? "w-[375px] h-[667px] max-h-full"
                : "w-full h-full max-h-full"
            }`}
          >
            {/* Mockup browser bar */}
            <div className="h-7 bg-slate-800 px-3 flex items-center justify-between shrink-0">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {viewport === "mobile" ? "Mobile 375px" : "Live Sandbox Preview"}
              </span>
              <div className="w-4" />
            </div>

            <iframe
              srcDoc={previewDoc}
              title="Live Code Preview"
              className="w-full flex-1 border-0 m-0 p-0 block bg-white"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
