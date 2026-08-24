"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  MapPin,
  Users,
  Globe,
  Code2,
  LogOut,
  PlusCircle,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.status === 401) {
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.authenticated && data.user) {
          setUser(data.user);
        } else {
          router.push("/login");
        }
        setLoading(false);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Carregando painel do Lead Hunter...</p>
      </div>
    );
  }

  const navItems = [
    {
      label: "Prospecção Maps",
      href: "/dashboard",
      icon: MapPin,
      exact: true,
    },
    {
      label: "Meus Clientes (CRM)",
      href: "/dashboard/clients",
      icon: Users,
    },
    {
      label: "Hub de Hospedagem",
      href: "/dashboard/sites",
      icon: Globe,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row">
      {/* ── Mobile Header ── */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white">LeadHunter PRO</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Sidebar ── */}
      <aside
        className={`${
          mobileOpen ? "flex" : "hidden"
        } md:flex flex-col w-full md:w-64 bg-[#0e131f] border-r border-slate-800/80 shrink-0 sticky top-0 h-auto md:h-screen z-30 justify-between`}
      >
        <div>
          {/* Brand Logo */}
          <div className="p-6 border-b border-slate-800/80">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-violet-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-white block leading-tight">
                  LeadHunter <span className="text-violet-400 font-semibold text-xs">PRO</span>
                </span>
                <span className="text-[10px] text-slate-400">Hub de Prospecção & Hospedagem</span>
              </div>
            </Link>
          </div>

          {/* Quick Action Button */}
          <div className="p-4">
            <Link
              href="/dashboard/clients/new"
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-semibold text-xs transition-all shadow-md shadow-violet-600/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Adicionar Cliente</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "bg-violet-600/15 border border-violet-500/30 text-violet-200"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? "text-violet-400" : "text-slate-500"}`} />
                    <span>{item.label}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-violet-400" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{user?.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
              </div>
            </div>
            <span className="text-[10px] bg-violet-500/10 text-violet-300 border border-violet-500/20 px-2 py-0.5 rounded font-semibold uppercase">
              {user?.plan || "PRO"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-medium transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Ver Landing</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 min-w-0 overflow-y-auto bg-slate-950">
        {children}
      </main>
    </div>
  );
}
