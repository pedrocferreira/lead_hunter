// ============================================================
// Server Share Store — Persistência pública de links de cartão / preview
// Validade padrão: 6 horas a partir da geração
// ============================================================

import fs from "fs";
import path from "path";
import { Lead } from "./types";

export const SHARE_TTL_MS = 6 * 60 * 60 * 1000; // 6 horas em milissegundos

export interface SharedLeadPayload {
  id: string;
  lead: Lead;
  type: "cartao" | "preview";
  createdAt: number;
  expiresAt: number;
}

const SHARES_DIR = path.join(process.cwd(), "data", "shares");

function ensureDir() {
  if (!fs.existsSync(SHARES_DIR)) {
    fs.mkdirSync(SHARES_DIR, { recursive: true });
  }
}

// Cache em memória para acesso ultrarrápido
const memoryCache = new Map<string, SharedLeadPayload>();

/**
 * Salva um lead para compartilhamento público com validade de 6 horas
 */
export function saveSharedLead(
  lead: Lead,
  type: "cartao" | "preview" = "cartao"
): SharedLeadPayload {
  ensureDir();

  const now = Date.now();
  const expiresAt = now + SHARE_TTL_MS;

  const payload: SharedLeadPayload = {
    id: lead.id,
    lead,
    type,
    createdAt: now,
    expiresAt,
  };

  memoryCache.set(lead.id, payload);

  try {
    const filePath = path.join(SHARES_DIR, `${lead.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf-8");
  } catch (err) {
    console.error("Erro ao salvar share em disco:", err);
  }

  return payload;
}

/**
 * Recupera um lead compartilhado verificando a expiração de 6 horas
 */
export function getSharedLead(id: string): {
  payload: SharedLeadPayload | null;
  isExpired: boolean;
  remainingMs: number;
} {
  const now = Date.now();

  // 1. Tentar ler da memória
  let data = memoryCache.get(id);

  // 2. Se não estiver na memória, tentar ler do arquivo
  if (!data) {
    try {
      const filePath = path.join(SHARES_DIR, `${id}.json`);
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        data = JSON.parse(raw) as SharedLeadPayload;
        if (data) {
          memoryCache.set(id, data);
        }
      }
    } catch (err) {
      console.error("Erro ao ler share do disco:", err);
    }
  }

  if (!data) {
    return { payload: null, isExpired: false, remainingMs: 0 };
  }

  const isExpired = now >= data.expiresAt;
  const remainingMs = Math.max(0, data.expiresAt - now);

  if (isExpired) {
    // Se expirou, remove da memória e tenta apagar arquivo
    memoryCache.delete(id);
    try {
      const filePath = path.join(SHARES_DIR, `${id}.json`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch {
      // silencioso
    }
    return { payload: null, isExpired: true, remainingMs: 0 };
  }

  return { payload: data, isExpired: false, remainingMs };
}

/**
 * Remove periodicamente arquivos com mais de 6 horas
 */
export function cleanExpiredShares(): void {
  try {
    if (!fs.existsSync(SHARES_DIR)) return;
    const now = Date.now();
    const files = fs.readdirSync(SHARES_DIR);

    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const filePath = path.join(SHARES_DIR, file);
      try {
        const content = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(content) as SharedLeadPayload;
        if (now >= parsed.expiresAt) {
          fs.unlinkSync(filePath);
          memoryCache.delete(parsed.id);
        }
      } catch {
        // Se corrompido, limpa
        fs.unlinkSync(filePath);
      }
    }
  } catch (err) {
    console.error("Erro ao limpar shares expirados:", err);
  }
}
