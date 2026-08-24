"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  MapPin,
  Globe,
  Code2,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Zap,
  Star,
  ChevronRight,
  TrendingUp,
  LayoutDashboard,
} from "lucide-react";

export default function SalesLandingPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data.user) {
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-violet-500 selection:text-white relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-violet-600/20 via-indigo-600/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-[1600px] left-0 w-[500px] h-[500px] bg-violet-600/10 blur-[140px] pointer-events-none" />

      {/* ── Header / Navigation ── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/70 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-violet-200">
              LeadHunter <span className="text-violet-400 font-semibold text-xs px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20">PRO SAAS</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300 font-medium">
            <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a>
            <a href="#hospedagem" className="hover:text-white transition-colors">Hub de Hospedagem</a>
            <a href="#precos" className="hover:text-white transition-colors">Preços</a>
          </nav>

          <div className="flex items-center gap-3">
            {!loading && user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-violet-600/25"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Ir para o Dashboard ({user.name.split(" ")[0]})</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-slate-300 hover:text-white text-sm font-semibold transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-violet-600/25 cursor-pointer"
                >
                  <span>Começar Agora</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative pt-20 pb-24 px-6 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-violet-400" />
            <span>A Plataforma All-in-One de Prospecção, Geração e Hospedagem</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Prospecte Leads, Crie Sites e{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400">
              Cobre Mensalidades Recorrentes
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
            Encontre empresas sem site no Google Maps, gere páginas profissionais e cartões digitais
            com inteligência artificial em segundos e hospede tudo com links personalizados para WhatsApp e Bio de Instagram.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 hover:opacity-95 text-white font-bold text-base rounded-2xl shadow-xl shadow-violet-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Criar Minha Conta Grátis</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/80 text-slate-200 font-semibold text-base rounded-2xl transition-all"
            >
              Acessar Demonstração
            </Link>
          </div>

          {/* Social Proof Badges */}
          <div className="pt-10 flex items-center justify-center gap-8 text-xs text-slate-400 flex-wrap">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Crawler Real do Google Maps</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Hospedagem Própria Ilimitada</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Editor Live HTML/CSS/JS</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Multi-usuários com login isolado</span>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Mockup Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 relative mx-auto max-w-5xl rounded-2xl p-2 bg-gradient-to-b from-slate-700/50 via-slate-800/30 to-slate-900/80 shadow-2xl border border-slate-700/50"
        >
          <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-6 text-left">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-xs text-slate-500 font-mono ml-2">painel.leadhunter.pro/dashboard</span>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Serviço de Hospedagem Ativo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                <div className="text-slate-400 text-xs font-semibold uppercase">Leads Mapeados</div>
                <div className="text-2xl font-bold text-white mt-1">1.420 empresas</div>
                <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> 84% sem site próprio no Google
                </div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                <div className="text-slate-400 text-xs font-semibold uppercase">Clientes & Sites Ativos</div>
                <div className="text-2xl font-bold text-violet-400 mt-1">38 clientes</div>
                <div className="text-xs text-slate-400 mt-2">Hospedados em links curtos</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                <div className="text-slate-400 text-xs font-semibold uppercase">Receita Recorrente Mensal</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">R$ 3.762/mês</div>
                <div className="text-xs text-slate-400 mt-2">Cobranças ativas de hospedagem</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Features Section ── */}
      <section id="recursos" className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold text-violet-400 tracking-wider uppercase">Funcionalidades do Sistema</h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Tudo o que você precisa para faturar com criação de sites
          </p>
          <p className="text-slate-400 text-base">
            Elimine processos manuais. Do mapeamento da oportunidade até a hospedagem final com cobrança mensal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-violet-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-6 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Lead Hunter do Maps</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Busca automática de estabelecimentos em qualquer cidade e nicho, identificando na hora quem não tem site ou usa link quebrado.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-violet-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Geração Instantânea com IA</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Extrai fotos reais, logo, paleta de cores e telefones para construir o site e o cartão de visita digital em menos de 10 segundos.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-violet-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Hub de Hospedagem Própria</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Hospede os sites dos seus clientes na sua própria URL com slugs customizados (ex: <code>/s/padaria-estrela</code>) prontos para Instagram e WhatsApp.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-violet-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Live Editor HTML / CSS / JS</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Altere qualquer detalhe do site ou cartão do cliente direto pelo navegador com pré-visualização em tempo real e download em ZIP.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-violet-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-pink-600/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">CRM de Clientes & 1-Click Convert</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Transforme um lead prospectado em cliente definitivo com 1 clique, gerenciando histórico, status de hospedagem e contatos.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-violet-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Gestão de Mensalidades</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Ative e desative o site ou cartão do cliente a qualquer momento. Se o cliente cancelar, você desativa a hospedagem com 1 clique.
            </p>
          </div>
        </div>
      </section>

      {/* ── Pricing Section ── */}
      <section id="precos" className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold text-violet-400 tracking-wider uppercase">Planos e Acesso</h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Escolha o plano ideal para a sua escala
          </p>
          <p className="text-slate-400 text-base">
            Todos os planos incluem crawler real, geração de sites, cartões e hub de hospedagem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plan 1 */}
          <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Iniciante</h3>
              <p className="text-xs text-slate-400 mt-1">Para quem está começando a prospectar</p>
              <div className="mt-6 mb-6">
                <span className="text-4xl font-extrabold text-white">R$ 67</span>
                <span className="text-slate-400 text-sm">/mês</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-400" /> Até 100 leads por dia</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-400" /> Até 5 sites hospedados</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-400" /> Links públicos de 6h e permanentes</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-400" /> Editor HTML/CSS/JS</li>
              </ul>
            </div>
            <Link
              href="/register"
              className="mt-8 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-center text-sm transition-all"
            >
              Começar no Iniciante
            </Link>
          </div>

          {/* Plan 2 - Highlight */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-violet-900/40 via-slate-900/80 to-slate-900 border-2 border-violet-500 flex flex-col justify-between shadow-2xl shadow-violet-500/10 relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-violet-500 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Mais Popular
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Profissional</h3>
              <p className="text-xs text-violet-300 mt-1">Ideal para consultores e freelancers</p>
              <div className="mt-6 mb-6">
                <span className="text-4xl font-extrabold text-white">R$ 147</span>
                <span className="text-slate-400 text-sm">/mês</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-200">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Leads Ilimitados</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Até 30 sites e cartões hospedados</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Slugs Personalizados ilimitados</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Enriquecimento com IA & Deep Crawl</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Live Code Editor completo</li>
              </ul>
            </div>
            <Link
              href="/register"
              className="mt-8 w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-center text-sm transition-all shadow-lg shadow-violet-600/30"
            >
              Assinar Plano Pro
            </Link>
          </div>

          {/* Plan 3 */}
          <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Agência</h3>
              <p className="text-xs text-slate-400 mt-1">Para operações em escala e equipes</p>
              <div className="mt-6 mb-6">
                <span className="text-4xl font-extrabold text-white">R$ 297</span>
                <span className="text-slate-400 text-sm">/mês</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-400" /> Tudo do Plano Pro</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-400" /> Sites e Cartões Ilimitados</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-400" /> Suporte Prioritário</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-400" /> Gestão de cobranças de clientes</li>
              </ul>
            </div>
            <Link
              href="/register"
              className="mt-8 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-center text-sm transition-all"
            >
              Começar como Agência
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800/80 py-12 px-6 text-center text-sm text-slate-500 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs font-bold">
              LH
            </div>
            <span className="font-bold text-slate-300">Lead Hunter Pro</span>
            <span>— Todos os direitos reservados © {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <Link href="/login" className="hover:text-slate-300 transition-colors">Área de Login</Link>
            <Link href="/register" className="hover:text-slate-300 transition-colors">Criar Conta</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
