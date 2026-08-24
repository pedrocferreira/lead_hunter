"use client";

// ============================================================
// Página pública do preview — link que o vendedor manda para o lead.
// Suporta carregamento público do servidor com validade de 6 horas.
// ============================================================

import { useEffect, useState, useTransition } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react";

import { Lead } from "@/lib/types";
import { fetchSharedLead, getLeadSnapshot } from "@/lib/previewStore";
import { PreviewRenderer } from "@/components/preview/PreviewRenderer";
import { prepararPreview } from "@/lib/intelligence";

function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return "Expirado";
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes}min`;
}

export default function PreviewPage() {
  const params = useParams();
  const id = params?.id as string;

  const [lead, setLead] = useState<Lead | null>(() => (id ? getLeadSnapshot(id) : null));
  const [loading, setLoading] = useState<boolean>(() => (id ? !getLeadSnapshot(id) : true));
  const [isExpired, setIsExpired] = useState(false);
  const [expiresAt, setExpiresAt] = useState<number | undefined>(undefined);
  const [remainingMs, setRemainingMs] = useState<number | undefined>(undefined);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    fetchSharedLead(id).then((res) => {
      if (!isMounted) return;

      startTransition(() => {
        if (res.isExpired) {
          setIsExpired(true);
          setLead(null);
        } else if (res.lead) {
          setLead(res.lead);
          setExpiresAt(res.expiresAt);
          setRemainingMs(res.remainingMs);
          setIsExpired(false);
        }
        setLoading(false);
      });
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const remaining = expiresAt - Date.now();
      if (remaining <= 0) {
        setIsExpired(true);
        setLead(null);
        clearInterval(interval);
      } else {
        setRemainingMs(remaining);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-4">
        <motion.div
          className="w-12 h-12 rounded-full border-4 border-violet-500 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-sm text-slate-400 font-medium animate-pulse">
          Carregando demonstração do site...
        </p>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-6 px-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-4xl shadow-xl shadow-amber-500/5"
        >
          <Clock className="w-10 h-10" />
        </motion.div>

        <div className="max-w-md space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Demonstração Expirada
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Este link temporário era válido por <strong>6 horas</strong> e já expirou.
            Para acessar novamente ou gerar uma nova demonstração, acesse o painel.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900 border border-slate-800 rounded-full px-4 py-2">
          <ShieldCheck className="w-4 h-4 text-violet-400" />
          <span>Links públicos com validade de 6 horas</span>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-violet-600/30"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Lead Hunter
        </Link>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-6 px-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 text-4xl shadow-xl">
          <AlertCircle className="w-10 h-10 text-slate-500" />
        </div>

        <div className="max-w-md space-y-2">
          <h1 className="text-2xl font-bold text-white">Preview não encontrado</h1>
          <p className="text-sm text-slate-400">
            Este link pode ter expirado ou o identificador não existe.
          </p>
        </div>

        <Link
          href="/"
          className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold text-sm transition-all"
        >
          Voltar ao Dashboard
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative flex flex-col justify-between">
      {remainingMs !== undefined && remainingMs > 0 && (
        <div className="w-full bg-slate-900/90 backdrop-blur border-b border-slate-800 py-1.5 px-4 text-center z-20">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            <span>Demonstração pública temporária</span>
            <span className="text-slate-600">•</span>
            <span className="text-violet-300 font-medium">
              Válido por mais {formatTimeRemaining(remainingMs)}
            </span>
          </p>
        </div>
      )}

      <div className="flex-1">
        <PreviewRenderer lead={lead} blueprint={prepararPreview(lead).blueprint} animated />
      </div>
    </main>
  );
}
