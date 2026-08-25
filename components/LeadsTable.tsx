"use client";

import { useState, useEffect } from "react";
import { Lead } from "@/lib/types";
import { LeadBadge } from "./LeadBadge";
import { isLeadContacted, getContactedMap, ContactedLeadInfo } from "@/lib/contactedLeads";
import {
  MessageCircle, Eye, Star, Globe, Phone, MapPin, BrainCircuit,
  AtSign, Users, CheckCheck, Bot, Clock
} from "lucide-react";

interface LeadsTableProps {
  leads: Lead[];
  onMessage: (lead: Lead) => void;
  onPreview: (lead: Lead) => void;
  onDeepCrawl: (lead: Lead) => void;
  onConvertClient?: (lead: Lead) => void;
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const frac = rating % 1 >= 0.5;
  return (
    <span className="flex items-center gap-1 text-amber-400 text-sm">
      <Star className="w-3.5 h-3.5 fill-amber-400" />
      <span className="font-semibold text-white">{rating.toFixed(1)}</span>
    </span>
  );
}

function formatHora(isoString: string): string {
  try {
    const d = new Date(isoString);
    return `${d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} às ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  } catch {
    return "";
  }
}

export function LeadsTable({ leads, onMessage, onPreview, onDeepCrawl, onConvertClient }: LeadsTableProps) {
  const [contactedMap, setContactedMap] = useState<Record<string, ContactedLeadInfo>>({});

  useEffect(() => {
    setContactedMap(getContactedMap());

    const onUpdate = () => setContactedMap(getContactedMap());
    window.addEventListener("lead_hunter_contacted_updated", onUpdate);
    return () => window.removeEventListener("lead_hunter_contacted_updated", onUpdate);
  }, []);

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-lg font-medium">Nenhum lead encontrado</p>
        <p className="text-sm mt-1">Tente outro nicho ou cidade</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700/50 text-left">
            <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Empresa</th>
            <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
            <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Avaliação</th>
            <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Contato</th>
            <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Localização</th>
            <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {leads.map((lead) => {
            const contacted = isLeadContacted(lead, contactedMap);

            return (
              <tr
                key={lead.id}
                className={`group transition-all ${
                  contacted
                    ? "bg-emerald-950/20 hover:bg-emerald-950/30 border-l-2 border-l-emerald-500"
                    : "hover:bg-slate-800/30"
                }`}
              >
                {/* Empresa */}
                <td className="py-3.5 pr-4 pl-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white group-hover:text-violet-300 transition-colors">
                      {lead.title}
                    </span>
                    {contacted && (
                      <span
                        title={`Mensagem enviada em ${formatHora(contacted.contactedAt)} (${contacted.type === "bot" ? "Lucas IA" : "WhatsApp"})`}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                      >
                        <CheckCheck className="w-3 h-3 text-emerald-400" />
                        {contacted.type === "bot" ? "Lucas IA" : "Contatado"}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{lead.category}</div>
                </td>

                {/* Status */}
                <td className="py-3.5 pr-4">
                  <LeadBadge status={lead.analyzedStatus} />
                  {lead.originalWebsite && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <Globe className="w-3 h-3 text-slate-600" />
                      <span className="text-xs text-slate-600 truncate max-w-[140px]">
                        {lead.originalWebsite.replace(/^https?:\/\//, "")}
                      </span>
                    </div>
                  )}
                </td>

                {/* Avaliação */}
                <td className="py-3.5 pr-4">
                  <StarRating rating={lead.rating} />
                  <div className="text-xs text-slate-500 mt-0.5">
                    {lead.reviewsCount} avaliações
                  </div>
                </td>

                {/* Contato */}
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-mono text-xs">{lead.phone}</span>
                  </div>
                  {/* Perfis descobertos pela IA — âncora da abordagem */}
                  {lead.instagramHandle && (
                    <a
                      href={`https://instagram.com/${lead.instagramHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 mt-1.5 text-xs text-pink-400/80 hover:text-pink-300 transition-colors"
                    >
                      <AtSign className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[130px]">@{lead.instagramHandle}</span>
                    </a>
                  )}
                  {lead.facebookHandle && (
                    <a
                      href={`https://facebook.com/${lead.facebookHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 mt-1 text-xs text-blue-400/80 hover:text-blue-300 transition-colors"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[130px]">/{lead.facebookHandle}</span>
                    </a>
                  )}
                </td>

                {/* Localização */}
                <td className="py-3.5 pr-4">
                  <div className="flex items-start gap-1.5 text-slate-400 text-xs">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-500" />
                    <div>
                      <div>{lead.address}</div>
                      <div className="text-slate-500">{lead.city}</div>
                    </div>
                  </div>
                </td>

                {/* Ações */}
                <td className="py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5 flex-wrap">
                    {onConvertClient && (
                      <button
                        id={`btn-convert-${lead.id}`}
                        onClick={() => onConvertClient(lead)}
                        title="Transformar em Cliente e Hospedar Site"
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold transition-all shadow-sm cursor-pointer"
                      >
                        <span>🎯 Virar Cliente</span>
                      </button>
                    )}
                    
                    {/* Botão de Abordagem / Contatado */}
                    <button
                      id={`btn-message-${lead.id}`}
                      onClick={() => onMessage(lead)}
                      title={contacted ? `Lead já contatado em ${formatHora(contacted.contactedAt)}. Clique para ver/reenviar.` : "Iniciar Abordagem Comercial"}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        contacted
                          ? "bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200"
                          : "bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 text-green-400 hover:text-green-300"
                      }`}
                    >
                      {contacted ? (
                        <>
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Contatado</span>
                        </>
                      ) : (
                        <>
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Abordar</span>
                        </>
                      )}
                    </button>

                    <button
                      id={`btn-preview-${lead.id}`}
                      onClick={() => onPreview(lead)}
                      title="Preview da Landing Page"
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 hover:border-violet-500/40 text-violet-400 hover:text-violet-300 rounded-lg text-xs font-medium transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </button>
                    <button
                      id={`btn-deep-crawl-${lead.id}`}
                      onClick={() => onDeepCrawl(lead)}
                      title="Análise Profunda & Extrair Prompt"
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-400 hover:text-indigo-300 rounded-lg text-xs font-medium transition-all"
                    >
                      <BrainCircuit className="w-3.5 h-3.5" />
                      IA
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
