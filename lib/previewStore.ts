// ─── Preview Store ────────────────────────────────────────────────────────────
// Salva e recupera dados de um lead localmente e sincroniza com o servidor
// para permitir compartilhamento público com validade de 6 horas.

import { Lead } from "./types";

const PREFIX = "lead_preview_";

export interface SharedLeadResponse {
  lead: Lead | null;
  expiresAt?: number;
  remainingMs?: number;
  isExpired: boolean;
  error?: string;
}

// `useSyncExternalStore` compara snapshots por identidade — devolver um objeto
// novo a cada leitura entraria em loop de render. Este cache garante a mesma
// referência para o mesmo id dentro da sessão.
const snapshotCache = new Map<string, Lead | null>();

/**
 * Salva o lead no cache local e envia para o backend para criar o link público de 6h
 */
export function saveLeadForPreview(
  lead: Lead,
  type: "cartao" | "preview" = "cartao"
): void {
  snapshotCache.set(lead.id, lead);

  // 1. Salvar no localStorage do navegador do admin
  try {
    localStorage.setItem(PREFIX + lead.id, JSON.stringify(lead));
  } catch {
    // localStorage indisponível (SSR ou modo privado) — silencioso
  }

  // 2. Persistir no servidor para permitir acesso público por 6 horas
  if (typeof window !== "undefined") {
    fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead, type }),
    }).catch((err) => {
      console.warn("Aviso: Falha ao sincronizar share com o servidor:", err);
    });
  }
}

/**
 * Lê do localStorage
 */
export function getLeadForPreview(id: string): Lead | null {
  try {
    const raw = localStorage.getItem(PREFIX + id);
    if (!raw) return null;
    return JSON.parse(raw) as Lead;
  } catch {
    return null;
  }
}

/**
 * Obtém o snapshot local
 */
export function getLeadSnapshot(id: string): Lead | null {
  if (!snapshotCache.has(id)) {
    snapshotCache.set(id, getLeadForPreview(id));
  }
  return snapshotCache.get(id) ?? null;
}

/**
 * Busca os dados do lead no servidor (usado por quem abre o link público compartilhado)
 */
export async function fetchSharedLead(id: string): Promise<SharedLeadResponse> {
  // Se já temos em cache local, podemos retornar rápido, mas ainda podemos validar no servidor
  try {
    const res = await fetch(`/api/share/${id}`, {
      cache: "no-store",
    });

    if (res.status === 410) {
      return { lead: null, isExpired: true, error: "Link expirado (limite de 6 horas)" };
    }

    if (!res.ok) {
      return { lead: null, isExpired: false, error: "Cartão não encontrado" };
    }

    const data = await res.json();
    if (data.success && data.lead) {
      // Atualiza o snapshot cache local
      snapshotCache.set(id, data.lead);
      return {
        lead: data.lead,
        expiresAt: data.expiresAt,
        remainingMs: data.remainingMs,
        isExpired: false,
      };
    }

    return { lead: null, isExpired: false, error: data.error };
  } catch (error) {
    console.error("Erro ao buscar lead compartilhado:", error);
    // Fallback: se houver no localStorage
    const local = getLeadForPreview(id);
    if (local) {
      return { lead: local, isExpired: false };
    }
    return { lead: null, isExpired: false, error: "Erro de conexão" };
  }
}

export function clearLeadPreview(id: string): void {
  snapshotCache.delete(id);
  try {
    localStorage.removeItem(PREFIX + id);
  } catch {
    // silencioso
  }
}
