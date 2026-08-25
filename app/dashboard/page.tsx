"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Sparkles,
  Users,
  CheckCircle2,
  ExternalLink,
  Code2,
  Globe,
  PlusCircle,
  X,
  CreditCard,
  CheckCheck,
  Eye,
  Filter,
} from "lucide-react";

import { Lead, FilterType } from "@/lib/types";
import { SearchBar } from "@/components/SearchBar";
import { FilterTabs } from "@/components/FilterTabs";
import { LeadsTable } from "@/components/LeadsTable";
import { LandingPagePreview } from "@/components/LandingPagePreview";
import { ColdMessageModal } from "@/components/ColdMessageModal";
import { DeepCrawlModal } from "@/components/DeepCrawlModal";
import { getContactedMap, isLeadContacted, ContactedLeadInfo } from "@/lib/contactedLeads";

export default function DashboardProspectingPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [contactedStatusFilter, setContactedStatusFilter] = useState<"ALL" | "UNCONTACTED" | "CONTACTED">("ALL");
  const [contactedMap, setContactedMap] = useState<Record<string, ContactedLeadInfo>>({});

  const [selectedLeadForPreview, setSelectedLeadForPreview] = useState<Lead | null>(null);
  const [selectedLeadForMessage, setSelectedLeadForMessage] = useState<Lead | null>(null);
  const [selectedLeadForDeepCrawl, setSelectedLeadForDeepCrawl] = useState<Lead | null>(null);

  // Modal de confirmação de conversão em cliente
  const [convertedClient, setConvertedClient] = useState<{
    client: any;
    site: any;
    card: any;
  } | null>(null);
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    setContactedMap(getContactedMap());
    const onUpdate = () => setContactedMap(getContactedMap());
    window.addEventListener("lead_hunter_contacted_updated", onUpdate);
    return () => window.removeEventListener("lead_hunter_contacted_updated", onUpdate);
  }, []);

  async function handleSearch(niche: string, city: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, city }),
      });
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error("Erro na busca de leads:", err);
    } finally {
      setLoading(false);
    }
  }

  // Filter by website/opportunity status
  const leadsByStatus =
    activeFilter === "ALL"
      ? leads
      : leads.filter((l) => l.analyzedStatus === activeFilter);

  // Filter by contacted status
  const filteredLeads = leadsByStatus.filter((lead) => {
    const isContacted = Boolean(isLeadContacted(lead, contactedMap));
    if (contactedStatusFilter === "UNCONTACTED") return !isContacted;
    if (contactedStatusFilter === "CONTACTED") return isContacted;
    return true;
  });

  const totalContactedInList = leads.filter((l) => Boolean(isLeadContacted(l, contactedMap))).length;

  const stats = {
    total: leads.length,
    noSite: leads.filter((l) => l.analyzedStatus === "NO_SITE").length,
    redirectsWhatsapp: leads.filter((l) => l.analyzedStatus === "REDIRECTS_TO_WHATSAPP").length,
    redirectsSocial: leads.filter((l) => l.analyzedStatus === "REDIRECTS_TO_SOCIAL").length,
    siteOffline: leads.filter((l) => l.analyzedStatus === "SITE_OFFLINE").length,
    siteBroken: leads.filter((l) => l.analyzedStatus === "WEBSITE_BROKEN").length,
    contacted: totalContactedInList,
  };

  async function handleConvertClient(lead: Lead) {
    setConverting(true);
    try {
      const res = await fetch("/api/clients/convert-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead }),
      });

      const data = await res.json();
      if (data.success) {
        setConvertedClient({
          client: data.client,
          site: data.site,
          card: data.card,
        });
      } else {
        alert(data.error || "Erro ao converter lead em cliente.");
      }
    } catch (err) {
      alert("Erro ao conectar ao servidor.");
    } finally {
      setConverting(false);
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-violet-400" />
            <span>Prospecção no Google Maps</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Encontre negócios locais sem site, analise oportunidades e dispare abordagens comerciais com IA.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/clients"
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all border border-slate-700"
          >
            <Users className="w-4 h-4 text-violet-400" />
            <span>Ver Clientes (CRM)</span>
          </Link>
          <Link
            href="/dashboard/clients/new"
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-violet-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Cadastrar Manual</span>
          </Link>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <SearchBar onSearch={handleSearch} loading={loading} />
      </div>

      {/* ── Stats & Filters ── */}
      {leads.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 text-center">
              <div className="text-xl font-bold text-white">{stats.total}</div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
                Total
              </div>
            </div>
            <div className="bg-slate-900/60 border border-emerald-500/30 bg-emerald-950/10 rounded-xl p-3.5 text-center">
              <div className="text-xl font-bold text-emerald-400">{stats.contacted}</div>
              <div className="text-[11px] text-emerald-400 uppercase tracking-wider font-semibold mt-0.5">
                Já Abordados
              </div>
            </div>
            <div className="bg-slate-900/60 border border-red-500/20 rounded-xl p-3.5 text-center">
              <div className="text-xl font-bold text-red-400">{stats.noSite}</div>
              <div className="text-[11px] text-red-400/80 uppercase tracking-wider font-semibold mt-0.5">
                Sem Site
              </div>
            </div>
            <div className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-3.5 text-center">
              <div className="text-xl font-bold text-emerald-400">{stats.redirectsWhatsapp}</div>
              <div className="text-[11px] text-emerald-400/80 uppercase tracking-wider font-semibold mt-0.5">
                Só WhatsApp
              </div>
            </div>
            <div className="bg-slate-900/60 border border-pink-500/20 rounded-xl p-3.5 text-center">
              <div className="text-xl font-bold text-pink-400">{stats.redirectsSocial}</div>
              <div className="text-[11px] text-pink-400/80 uppercase tracking-wider font-semibold mt-0.5">
                Rede Social
              </div>
            </div>
            <div className="bg-slate-900/60 border border-amber-500/20 rounded-xl p-3.5 text-center">
              <div className="text-xl font-bold text-amber-400">{stats.siteOffline}</div>
              <div className="text-[11px] text-amber-400/80 uppercase tracking-wider font-semibold mt-0.5">
                Offline
              </div>
            </div>
            <div className="bg-slate-900/60 border border-orange-500/20 rounded-xl p-3.5 text-center">
              <div className="text-xl font-bold text-orange-400">{stats.siteBroken}</div>
              <div className="text-[11px] text-orange-400/80 uppercase tracking-wider font-semibold mt-0.5">
                Quebrado
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <FilterTabs
              active={activeFilter}
              onChange={(f: FilterType) => setActiveFilter(f)}
              leads={leads}
            />

            {/* Toggle de Filtro por Status de Contato */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
              <button
                onClick={() => setContactedStatusFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  contactedStatusFilter === "ALL"
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Todos ({leads.length})
              </button>
              <button
                onClick={() => setContactedStatusFilter("UNCONTACTED")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  contactedStatusFilter === "UNCONTACTED"
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>⚡ Novos / Não Abordados</span>
                <span className="opacity-80">({leads.length - stats.contacted})</span>
              </button>
              <button
                onClick={() => setContactedStatusFilter("CONTACTED")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  contactedStatusFilter === "CONTACTED"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Já Abordados</span>
                <span className="opacity-80">({stats.contacted})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Leads Table ── */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <LeadsTable
          leads={filteredLeads}
          onMessage={(lead) => setSelectedLeadForMessage(lead)}
          onPreview={(lead) => setSelectedLeadForPreview(lead)}
          onDeepCrawl={(lead) => setSelectedLeadForDeepCrawl(lead)}
          onConvertClient={handleConvertClient}
        />
      </div>

      {/* ── Modals ── */}
      <LandingPagePreview
        lead={selectedLeadForPreview}
        onClose={() => setSelectedLeadForPreview(null)}
      />

      <ColdMessageModal
        lead={selectedLeadForMessage}
        onClose={() => setSelectedLeadForMessage(null)}
      />

      <DeepCrawlModal
        lead={selectedLeadForDeepCrawl}
        onClose={() => setSelectedLeadForDeepCrawl(null)}
      />

      {/* ── Modal de Sucesso: Lead Convertido em Cliente ── */}
      <AnimatePresence>
        {convertedClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative"
            >
              <button
                onClick={() => setConvertedClient(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <h2 className="text-xl font-bold text-white">
                Cliente Cadastrado com Sucesso! 🎉
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                <strong>{convertedClient.client.companyName}</strong> agora é seu cliente oficial.
                O site e cartão de visita foram gerados e já estão no ar!
              </p>

              <div className="mt-6 space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-violet-400" />
                    Site Hospedado:
                  </span>
                  <a
                    href={`/s/${convertedClient.client.slug}`}
                    target="_blank"
                    className="text-xs text-violet-300 font-mono hover:underline flex items-center gap-1"
                  >
                    /s/{convertedClient.client.slug}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-pink-400" />
                    Cartão Digital:
                  </span>
                  <a
                    href={`/c/${convertedClient.client.slug}`}
                    target="_blank"
                    className="text-xs text-pink-300 font-mono hover:underline flex items-center gap-1"
                  >
                    /c/{convertedClient.client.slug}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <Link
                  href={`/dashboard/editor/${convertedClient.site.id}`}
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 text-white rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Code2 className="w-4 h-4" />
                  <span>Editar Código no Live Editor</span>
                </Link>
                <Link
                  href="/dashboard/clients"
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
                >
                  Ver no CRM
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
