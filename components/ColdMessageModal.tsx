"use client";

import { Lead } from "@/lib/types";
import { resolveContact } from "@/lib/crawler/whatsappFinder";
import { isLeadContacted, markLeadContacted, unmarkLeadContacted, ContactedLeadInfo } from "@/lib/contactedLeads";
import { X, Copy, ExternalLink, Check, MessageCircle, Bot, Loader2, Clock, CheckCheck, RotateCcw } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface ColdMessageModalProps {
  lead: Lead | null;
  onClose: () => void;
}

function buildScriptA(lead: Lead): string {
  return `Olá! Tudo bem? 😊

Vi que a *${lead.title}* ainda não tem um site no Google — e isso pode estar custando clientes todos os dias para concorrentes que aparecem primeiro nas buscas.

Pessoal que pesquisa "${lead.category}" em ${lead.city} no Google não consegue te encontrar facilmente. Enquanto isso, seus concorrentes com site estão captando esses clientes.

Eu crio sites profissionais em até 7 dias, que aparecem no Google, passam confiança e geram contatos direto no seu WhatsApp.

Posso te mostrar um modelo do site que eu já faria para a *${lead.title}*? É sem compromisso! 🚀`;
}

function buildScriptB(lead: Lead): string {
  return `Olá! Tudo bem? 😊

Vi que a *${lead.title}* usa o WhatsApp como site — o que funciona, mas pode estar te custando clientes.

O problema: quando alguém pesquisa "${lead.category}" no Google e clica no seu link, cai direto no WhatsApp sem saber nada sobre seu serviço, preço ou diferenciais. Muita gente abandona antes de mandar mensagem.

Com um site profissional você tem:
✅ Catálogo de serviços
✅ Fotos do trabalho
✅ Depoimentos de clientes
✅ Botão de contato direto
✅ Aparece melhor no Google

Criei um modelo do site da *${lead.title}* — posso te mostrar agora, é de graça e sem compromisso! 🎯`;
}

function formatDataContact(isoString: string): string {
  try {
    const d = new Date(isoString);
    return `${d.toLocaleDateString("pt-BR")} às ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  } catch {
    return isoString;
  }
}

export function ColdMessageModal({ lead, onClose }: ColdMessageModalProps) {
  const [activeScript, setActiveScript] = useState<"A" | "B">("A");
  const [copied, setCopied] = useState(false);
  const [botStatus, setBotStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [botMessage, setBotMessage] = useState("");
  const [contactedInfo, setContactedInfo] = useState<ContactedLeadInfo | null>(null);

  const handleClose = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!lead) return;
    if (lead.analyzedStatus === "NO_SITE") {
      setActiveScript("A");
    } else {
      setActiveScript("B");
    }
    setCopied(false);
    setBotStatus("idle");
    setBotMessage("");

    // Check if lead was already contacted
    const existing = isLeadContacted(lead);
    setContactedInfo(existing);

    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lead, handleClose]);

  if (!lead) return null;

  const scriptA = buildScriptA(lead);
  const scriptB = buildScriptB(lead);
  const currentScript = activeScript === "A" ? scriptA : scriptB;

  const contato = resolveContact(lead);
  const temTelefone = contato.hasWhatsApp;
  const waUrl = `https://wa.me/${contato.digits}?text=${encodeURIComponent(currentScript)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentScript);
    setCopied(true);
    markLeadContacted(lead, "manual_copy");
    setContactedInfo(isLeadContacted(lead));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    markLeadContacted(lead, "whatsapp_direct");
    setContactedInfo(isLeadContacted(lead));
  };

  const handleUnmark = () => {
    unmarkLeadContacted(lead);
    setContactedInfo(null);
    setBotStatus("idle");
    setBotMessage("");
  };

  const handleAtivarBot = async () => {
    if (!temTelefone) {
      setBotStatus("error");
      setBotMessage("Nenhum telefone capturado para este lead.");
      return;
    }

    setBotStatus("loading");
    setBotMessage("");

    try {
      const res = await fetch("/api/bot/disparar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: contato.digits,
          nome: lead.title,
          empresa: lead.title,
          segmento: lead.category,
          cidade: lead.city,
          obs: `Status site: ${lead.analyzedStatus}`,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setBotStatus("success");
        setBotMessage(`✅ Bot ativado! Lucas entrou em contato com ${lead.title}`);
        markLeadContacted(lead, "bot", true);
        setContactedInfo(isLeadContacted(lead));
      } else {
        setBotStatus("error");
        setBotMessage(data.error || "Erro ao ativar o bot. Verifique se o WhatsApp está conectado.");
      }
    } catch (err) {
      setBotStatus("error");
      setBotMessage("Erro de conexão com o bot. Verifique se está rodando.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-400" />
              Abordagem Comercial
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">{lead.title} — {lead.city}</p>
          </div>
          <button
            id="btn-close-modal"
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          
          {/* Banner de Lead Já Contatado */}
          {contactedInfo && (
            <div className="flex items-center justify-between p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold">Lead já contatado!</span>
                  <span className="text-emerald-300/80 ml-1">
                    Abordado em {formatDataContact(contactedInfo.contactedAt)} ({contactedInfo.type === "bot" ? "Robô Lucas IA" : contactedInfo.type === "whatsapp_direct" ? "WhatsApp Direto" : "Cópia Manual"}).
                  </span>
                </div>
              </div>
              <button
                onClick={handleUnmark}
                title="Desmarcar status de contatado"
                className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-medium transition-colors shrink-0 ml-2"
              >
                <RotateCcw className="w-3 h-3" />
                Desmarcar
              </button>
            </div>
          )}

          {/* Script Selector */}
          <div className="flex gap-2">
            <button
              id="btn-script-a"
              onClick={() => setActiveScript("A")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all ${
                activeScript === "A"
                  ? "bg-red-500/20 border-red-500/50 text-red-300"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
              }`}
            >
              🔥 Script A — Sem Site
            </button>
            <button
              id="btn-script-b"
              onClick={() => setActiveScript("B")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all ${
                activeScript === "B"
                  ? "bg-orange-500/20 border-orange-500/50 text-orange-300"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
              }`}
            >
              📱 Script B — WhatsApp/Social
            </button>
          </div>

          {/* Script Text */}
          <div className="relative">
            <pre className="whitespace-pre-wrap text-sm text-slate-300 bg-slate-800/60 border border-slate-700 rounded-xl p-4 leading-relaxed font-sans max-h-56 overflow-y-auto">
              {currentScript}
            </pre>
          </div>

          {/* Actions — Manual */}
          <div className="flex gap-3">
            <button
              id="btn-copy-script"
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white rounded-xl font-semibold text-sm transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copiado! (Marcado)</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar Mensagem
                </>
              )}
            </button>
            {temTelefone ? (
              <a
                id="btn-open-whatsapp"
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleOpenWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
              >
                <ExternalLink className="w-4 h-4" />
                Abrir no WhatsApp
              </a>
            ) : (
              <span className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 border border-slate-700 text-slate-500 rounded-xl font-semibold text-sm cursor-not-allowed">
                Sem telefone capturado
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-xs text-slate-500 font-medium">ou automatize com IA</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          {/* Bot Button */}
          <button
            id="btn-ativar-bot"
            onClick={handleAtivarBot}
            disabled={botStatus === "loading" || botStatus === "success"}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all border ${
              botStatus === "success"
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 cursor-not-allowed"
                : botStatus === "error"
                ? "bg-red-500/10 border-red-500/40 text-red-300 hover:bg-red-500/20"
                : botStatus === "loading"
                ? "bg-violet-500/20 border-violet-500/40 text-violet-300 cursor-not-allowed"
                : "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 border-transparent text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40"
            }`}
          >
            {botStatus === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Ativando Lucas (IA)...
              </>
            ) : botStatus === "success" ? (
              <>
                <Check className="w-4 h-4" />
                Bot ativado com sucesso!
              </>
            ) : contactedInfo?.type === "bot" ? (
              <>
                <Bot className="w-4 h-4" />
                🤖 Reativar Lucas (Vendedor IA)
              </>
            ) : (
              <>
                <Bot className="w-4 h-4" />
                🤖 Ativar Lucas (Vendedor IA) no WhatsApp
              </>
            )}
          </button>

          {/* Bot Feedback */}
          {botMessage && (
            <p className={`text-xs text-center ${botStatus === "error" ? "text-red-400" : "text-emerald-400"}`}>
              {botMessage}
            </p>
          )}

          <p className="text-xs text-slate-500 text-center">
            {temTelefone
              ? "💡 Personalize a mensagem manualmente ou ative o bot para atendimento automático com IA"
              : "O crawler não capturou o telefone deste lead — copie a mensagem e busque o contato no perfil da empresa"}
          </p>
        </div>
      </div>
    </div>
  );
}
