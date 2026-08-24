"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Phone,
  Globe,
  CreditCard,
  Code2,
  ExternalLink,
  Save,
  Trash2,
  Sparkles,
  Eye,
  Clock,
  Palette,
} from "lucide-react";

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [client, setClient] = useState<any>(null);
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    companyName: "",
    slug: "",
    category: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "",
    status: "active",
    monthlyFee: "99",
    dueDay: "10",
    notes: "",
  });

  useEffect(() => {
    if (!id) return;
    fetch(`/api/clients/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.client) {
          setClient(data.client);
          setSites(data.sites || []);
          setForm({
            companyName: data.client.companyName || "",
            slug: data.client.slug || "",
            category: data.client.category || "",
            phone: data.client.phone || "",
            whatsapp: data.client.whatsapp || "",
            address: data.client.address || "",
            city: data.client.city || "",
            status: data.client.status || "active",
            monthlyFee: String(data.client.monthlyFee || "99"),
            dueDay: String(data.client.dueDay || "10"),
            notes: data.client.notes || "",
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          monthlyFee: Number(form.monthlyFee) || 99,
          dueDay: Number(form.dueDay) || 10,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setClient(data.client);
        setMessage("Dados do cliente atualizados com sucesso!");
        setTimeout(() => setMessage(null), 3000);
      } else {
        alert(data.error || "Erro ao salvar alterações.");
      }
    } catch (err) {
      alert("Erro ao conectar ao servidor.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm">Carregando dados do cliente...</div>
    );
  }

  if (!client) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-slate-400">Cliente não encontrado.</p>
        <Link href="/dashboard/clients" className="text-violet-400 text-sm">Voltar</Link>
      </div>
    );
  }

  const website = sites.find((s) => s.type === "site");
  const card = sites.find((s) => s.type === "card");

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      {/* ── Top Navigation ── */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/clients"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Clientes</span>
        </Link>

        <div className="flex items-center gap-2">
          {website && (
            <Link
              href={`/dashboard/editor/${website.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600/15 hover:bg-violet-600/25 border border-violet-500/30 text-violet-300 rounded-xl text-xs font-semibold transition-all"
            >
              <Code2 className="w-4 h-4" />
              <span>Editar Código do Site</span>
            </Link>
          )}
        </div>
      </div>

      {/* ── Title & Status Header ── */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{client.companyName}</h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                client.status === "active"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : client.status === "maintenance"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  : "bg-red-500/10 text-red-400 border-red-500/30"
              }`}
            >
              {client.status === "active" ? "🟢 No Ar" : client.status === "maintenance" ? "🟡 Manutenção" : "🔴 Desativado"}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cadastrado em {new Date(client.createdAt).toLocaleDateString("pt-BR")} • Slug: <code className="text-violet-300 font-mono">/s/{client.slug}</code>
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-3">
          <a
            href={`/s/${client.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-violet-400" />
            <span>Abrir Site</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
          <a
            href={`/c/${client.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-all"
          >
            <CreditCard className="w-3.5 h-3.5 text-pink-400" />
            <span>Abrir Cartão</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </div>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold">
          {message}
        </div>
      )}

      {/* ── Edit Form ── */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3">
            Editar Informações e Configurações de Hospedagem
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nome da Empresa</label>
              <input
                type="text"
                required
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Slug da URL (ex: /s/slug)</label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Telefone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">WhatsApp</label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Status da Hospedagem</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
              >
                <option value="active">🟢 Ativo (No ar)</option>
                <option value="maintenance">🟡 Em Manutenção</option>
                <option value="inactive">🔴 Desativado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Mensalidade (R$/mês)</label>
              <input
                type="number"
                value={form.monthlyFee}
                onChange={(e) => setForm({ ...form, monthlyFee: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Endereço</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cidade</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Observações Internas</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Anotações sobre reuniões, fechamento de contrato ou preferências do cliente..."
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Salvando..." : "Salvar Alterações"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
