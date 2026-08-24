"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Palette,
  Phone,
  Globe,
  DollarSign,
  Sparkles,
  Save,
  Check,
  MapPin,
  Clock,
  AtSign,
  Users,
} from "lucide-react";

export default function NewClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    companyName: "",
    clientName: "",
    slug: "",
    category: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "São Paulo, SP",
    logoUrl: "",
    primaryColor: "#7c3aed",
    secondaryColor: "#4f46e5",
    instagramHandle: "",
    facebookHandle: "",
    originalWebsite: "",
    servicesInput: "Atendimento Especializado, Orçamentos Rápidos, Garantia de Satisfação",
    openingHoursInput: "Seg-Sex: 8h às 18h | Sáb: 8h às 12h",
    monthlyFee: "99",
    dueDay: "10",
    status: "active" as "active" | "inactive" | "maintenance",
    notes: "",
  });

  function updateForm(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const services = form.servicesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const openingHours: Record<string, string> = {};
      form.openingHoursInput.split("|").forEach((item) => {
        const parts = item.split(":");
        if (parts.length >= 2) {
          openingHours[parts[0].trim()] = parts.slice(1).join(":").trim();
        }
      });

      const payload = {
        companyName: form.companyName,
        clientName: form.clientName,
        slug: form.slug,
        category: form.category,
        phone: form.phone,
        whatsapp: form.whatsapp || form.phone,
        address: form.address,
        city: form.city,
        logoUrl: form.logoUrl,
        brandColors: {
          primary: form.primaryColor,
          secondary: form.secondaryColor,
        },
        instagramHandle: form.instagramHandle.replace("@", "").trim(),
        facebookHandle: form.facebookHandle.replace("/", "").trim(),
        originalWebsite: form.originalWebsite,
        services,
        openingHours,
        status: form.status,
        monthlyFee: Number(form.monthlyFee) || 99,
        dueDay: Number(form.dueDay) || 10,
        notes: form.notes,
      };

      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Falha ao cadastrar cliente.");
        setLoading(false);
        return;
      }

      // Redireciona para a lista de clientes
      router.push("/dashboard/clients");
      router.refresh();
    } catch (err: any) {
      setError("Erro de conexão ao servidor.");
      setLoading(false);
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/clients"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Clientes</span>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Building2 className="w-7 h-7 text-violet-500" />
          Cadastrar Novo Cliente Manualmente
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Insira as informações do cliente para gerar automaticamente o site e o cartão de visita digital
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ── Seção 1: Dados Principais ── */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building2 className="w-4 h-4 text-violet-400" />
            1. Dados da Empresa
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nome da Empresa / Estabelecimento *
              </label>
              <input
                type="text"
                required
                value={form.companyName}
                onChange={(e) => updateForm("companyName", e.target.value)}
                placeholder="Ex: Padaria Bella Vista"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nicho / Categoria *
              </label>
              <input
                type="text"
                required
                value={form.category}
                onChange={(e) => updateForm("category", e.target.value)}
                placeholder="Ex: Padaria, Clínica Odontológica, Salão..."
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nome do Contato / Responsável (Opcional)
              </label>
              <input
                type="text"
                value={form.clientName}
                onChange={(e) => updateForm("clientName", e.target.value)}
                placeholder="Ex: Roberto Carlos"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Slug Personalizado (URL curta na nossa plataforma)
              </label>
              <div className="flex items-center">
                <span className="bg-slate-800 px-3 py-2.5 border border-r-0 border-slate-800 rounded-l-xl text-xs text-slate-400 font-mono">
                  /s/
                </span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => updateForm("slug", e.target.value)}
                  placeholder="padaria-bella-vista"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-r-xl text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Seção 2: Contato e Endereço ── */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Phone className="w-4 h-4 text-emerald-400" />
            2. Contato & Localização
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Telefone Comercial / Fixo
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => updateForm("phone", e.target.value)}
                placeholder="(11) 3456-7890"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                WhatsApp Principal (com DDD)
              </label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => updateForm("whatsapp", e.target.value)}
                placeholder="(11) 99999-8888"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Endereço Completo
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => updateForm("address", e.target.value)}
                placeholder="Av. Paulista, 1000 - Bela Vista"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cidade / Estado
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => updateForm("city", e.target.value)}
                placeholder="São Paulo, SP"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </div>

        {/* ── Seção 3: Identidade Visual e Redes ── */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Palette className="w-4 h-4 text-pink-400" />
            3. Identidade Visual & Redes Sociais
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                URL do Logotipo da Empresa
              </label>
              <input
                type="url"
                value={form.logoUrl}
                onChange={(e) => updateForm("logoUrl", e.target.value)}
                placeholder="https://exemplo.com/logo.png"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Cor Primária
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.primaryColor}
                    onChange={(e) => updateForm("primaryColor", e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={form.primaryColor}
                    onChange={(e) => updateForm("primaryColor", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Cor Secundária
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.secondaryColor}
                    onChange={(e) => updateForm("secondaryColor", e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={form.secondaryColor}
                    onChange={(e) => updateForm("secondaryColor", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Instagram (@handle)
              </label>
              <div className="flex items-center">
                <span className="bg-slate-800 px-3 py-2.5 border border-r-0 border-slate-800 rounded-l-xl text-xs text-slate-400">
                  @
                </span>
                <input
                  type="text"
                  value={form.instagramHandle}
                  onChange={(e) => updateForm("instagramHandle", e.target.value)}
                  placeholder="padariabellavista"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-r-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Facebook (Slug / Página)
              </label>
              <div className="flex items-center">
                <span className="bg-slate-800 px-3 py-2.5 border border-r-0 border-slate-800 rounded-l-xl text-xs text-slate-400">
                  fb.com/
                </span>
                <input
                  type="text"
                  value={form.facebookHandle}
                  onChange={(e) => updateForm("facebookHandle", e.target.value)}
                  placeholder="padariabellavista"
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-r-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Seção 4: Serviços e Contrato ── */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            4. Serviços & Mensalidade de Hospedagem
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Principais Serviços (separados por vírgula)
              </label>
              <textarea
                rows={2}
                value={form.servicesInput}
                onChange={(e) => updateForm("servicesInput", e.target.value)}
                className="w-full px-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Horários de Atendimento (separados por |)
              </label>
              <textarea
                rows={2}
                value={form.openingHoursInput}
                onChange={(e) => updateForm("openingHoursInput", e.target.value)}
                className="w-full px-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Valor da Mensalidade (R$/mês)
              </label>
              <input
                type="number"
                value={form.monthlyFee}
                onChange={(e) => updateForm("monthlyFee", e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Status da Hospedagem
              </label>
              <select
                value={form.status}
                onChange={(e) => updateForm("status", e.target.value as any)}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
              >
                <option value="active">🟢 Ativo (No ar)</option>
                <option value="maintenance">🟡 Em Manutenção</option>
                <option value="inactive">🔴 Desativado</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Submit Button ── */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/dashboard/clients"
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-violet-600/30 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Salvar & Gerar Site / Cartão</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
