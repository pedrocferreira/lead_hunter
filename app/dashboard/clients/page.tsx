"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  PlusCircle,
  Search,
  Globe,
  CreditCard,
  Code2,
  ExternalLink,
  Copy,
  Check,
  Trash2,
  Edit,
  Eye,
  Phone,
  MessageCircle,
  Sparkles,
} from "lucide-react";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      if (data.success) {
        setClients(data.clients);
      }
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(clientId: string, currentStatus: string) {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setClients((prev) =>
          prev.map((c) => (c.id === clientId ? { ...c, status: nextStatus } : c))
        );
      }
    } catch (err) {
      alert("Erro ao alterar status.");
    }
  }

  async function handleDelete(clientId: string, name: string) {
    if (!confirm(`Tem certeza que deseja excluir o cliente "${name}" e todos os seus sites hospedados?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/clients/${clientId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setClients((prev) => prev.filter((c) => c.id !== clientId));
      }
    } catch (err) {
      alert("Erro ao excluir cliente.");
    }
  }

  function copyLink(type: "site" | "card", slug: string) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/${type === "site" ? "s" : "c"}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(`${type}-${slug}`);
    setTimeout(() => setCopiedSlug(null), 2500);
  }

  const filtered = clients.filter((c) =>
    c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMonthly = clients
    .filter((c) => c.status === "active")
    .reduce((acc, c) => acc + (Number(c.monthlyFee) || 0), 0);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-violet-500" />
            Meus Clientes & Sites Hospedados
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gerencie contratos, ative/desative hospedagens e personalize os links e códigos dos sites
          </p>
        </div>

        <Link
          href="/dashboard/clients/new"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-semibold text-xs transition-all shadow-md shadow-violet-600/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Novo Cliente</span>
        </Link>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="text-slate-400 text-xs font-semibold uppercase">Total de Clientes</div>
          <div className="text-2xl font-bold text-white mt-1">{clients.length} cadastrados</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="text-slate-400 text-xs font-semibold uppercase">Sites Ativos no Ar</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            {clients.filter((c) => c.status === "active").length} ativos
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="text-slate-400 text-xs font-semibold uppercase">Receita Recorrente Estimada</div>
          <div className="text-2xl font-bold text-violet-400 mt-1">
            R$ {totalMonthly.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/mês
          </div>
        </div>
      </div>

      {/* ── Search & Filter ── */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por empresa, nicho ou cidade..."
          className="w-full bg-transparent border-0 text-sm text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* ── Clients List ── */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-slate-500 text-sm">Carregando lista de clientes...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-500 space-y-3">
            <div className="text-5xl">👥</div>
            <p className="text-base font-semibold text-slate-400">Nenhum cliente encontrado</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Prospecte novos leads pelo Maps ou clique no botão &quot;Novo Cliente&quot; para cadastrar manualmente.
            </p>
            <Link
              href="/dashboard/clients/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold transition-all mt-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Cadastrar Primeiro Cliente</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Empresa / Cliente</th>
                  <th className="py-3.5 px-4">Status & Hospedagem</th>
                  <th className="py-3.5 px-4">Links Públicos (Bio/WhatsApp)</th>
                  <th className="py-3.5 px-4">Mensalidade</th>
                  <th className="py-3.5 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((client) => {
                  const isSiteCopied = copiedSlug === `site-${client.slug}`;
                  const isCardCopied = copiedSlug === `card-${client.slug}`;

                  return (
                    <tr key={client.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Empresa */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-white text-base">{client.companyName}</div>
                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{client.category}</span>
                          <span>•</span>
                          <span>{client.city}</span>
                        </div>
                        {client.phone && (
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{client.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 px-4">
                        <div className="space-y-1.5">
                          <button
                            onClick={() => handleToggleStatus(client.id, client.status)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                              client.status === "active"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                                : client.status === "maintenance"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                client.status === "active"
                                  ? "bg-emerald-400 animate-pulse"
                                  : client.status === "maintenance"
                                  ? "bg-amber-400"
                                  : "bg-red-400"
                              }`}
                            />
                            <span>
                              {client.status === "active"
                                ? "🟢 No Ar (Ativo)"
                                : client.status === "maintenance"
                                ? "🟡 Em Manutenção"
                                : "🔴 Desativado"}
                            </span>
                          </button>

                          <div className="text-[11px] text-slate-500">
                            {client.site?.views || 0} visualizações
                          </div>
                        </div>
                      </td>

                      {/* Links Públicos */}
                      <td className="py-4 px-4">
                        <div className="space-y-2">
                          {/* Site */}
                          <div className="flex items-center gap-2">
                            <a
                              href={`/s/${client.slug}`}
                              target="_blank"
                              className="text-xs text-violet-300 hover:text-violet-200 font-mono flex items-center gap-1 bg-violet-950/40 border border-violet-800/40 px-2 py-1 rounded-lg"
                            >
                              <Globe className="w-3 h-3 text-violet-400" />
                              <span>/s/{client.slug}</span>
                              <ExternalLink className="w-2.5 h-2.5 ml-1" />
                            </a>
                            <button
                              onClick={() => copyLink("site", client.slug)}
                              title="Copiar link do Site"
                              className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                            >
                              {isSiteCopied ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>

                          {/* Cartão */}
                          <div className="flex items-center gap-2">
                            <a
                              href={`/c/${client.slug}`}
                              target="_blank"
                              className="text-xs text-pink-300 hover:text-pink-200 font-mono flex items-center gap-1 bg-pink-950/40 border border-pink-800/40 px-2 py-1 rounded-lg"
                            >
                              <CreditCard className="w-3 h-3 text-pink-400" />
                              <span>/c/{client.slug}</span>
                              <ExternalLink className="w-2.5 h-2.5 ml-1" />
                            </a>
                            <button
                              onClick={() => copyLink("card", client.slug)}
                              title="Copiar link do Cartão"
                              className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                            >
                              {isCardCopied ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Mensalidade */}
                      <td className="py-4 px-4">
                        <div className="text-sm font-bold text-white">
                          R$ {Number(client.monthlyFee || 0).toFixed(2)}/mês
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Vencimento: dia {client.dueDay || 10}
                        </div>
                      </td>

                      {/* Ações */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {client.site?.id && (
                            <Link
                              href={`/dashboard/editor/${client.site.id}`}
                              title="Editar Código HTML/CSS/JS"
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/20 hover:border-violet-500/40 text-violet-300 rounded-lg text-xs font-semibold transition-all"
                            >
                              <Code2 className="w-3.5 h-3.5" />
                              <span>Live Editor</span>
                            </Link>
                          )}

                          <Link
                            href={`/dashboard/clients/${client.id}`}
                            title="Editar Dados do Cliente"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDelete(client.id, client.companyName)}
                            title="Excluir Cliente"
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
