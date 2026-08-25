import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import path from "path";

// ─── Domain Lookup API ────────────────────────────────────────────────────────
// Público (sem auth). Chamado pelo middleware Edge para resolver qual site
// corresponde a um host (domínio customizado).
// GET /api/domain-lookup?host=www.meurestaurante.com.br
// → { slug: "meu-restaurante", type: "site" } | 404

interface HostedSiteRecord {
  id: string;
  slug: string;
  type: "site" | "card";
  customDomain?: string;
  status: string;
}

interface DatabaseSchema {
  hostedSites: HostedSiteRecord[];
}

function loadSites(): HostedSiteRecord[] {
  try {
    const dbFile = path.join(process.cwd(), "data", "app_database.json");
    if (!existsSync(dbFile)) return [];
    const raw = readFileSync(dbFile, "utf-8");
    const parsed = JSON.parse(raw) as DatabaseSchema;
    return parsed.hostedSites || [];
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const host = req.nextUrl.searchParams.get("host") || req.nextUrl.searchParams.get("domain");

  if (!host) {
    return NextResponse.json({ error: "host or domain parameter required" }, { status: 400 });
  }

  // Normaliza o host (remove porta, protocolo, lowercase)
  const normalizedHost = host
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .split(":")[0]
    .split("/")[0]
    .trim();

  const sites = loadSites();

  // 1. Busca exata
  let match = sites.find((s) => {
    if (!s.customDomain) return false;
    const cleanDbDomain = s.customDomain
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .split(":")[0]
      .split("/")[0]
      .trim();
    return cleanDbDomain === normalizedHost;
  });

  // 2. Fallback: se buscou com www e no banco está sem www, ou vice-versa
  if (!match) {
    const isWww = normalizedHost.startsWith("www.");
    const altHost = isWww ? normalizedHost.replace(/^www\./, "") : `www.${normalizedHost}`;

    match = sites.find((s) => {
      if (!s.customDomain) return false;
      const cleanDbDomain = s.customDomain
        .toLowerCase()
        .replace(/^https?:\/\//, "")
        .split(":")[0]
        .split("/")[0]
        .trim();
      return cleanDbDomain === altHost;
    });
  }

  if (!match) {
    return NextResponse.json({ error: "Domain not found" }, { status: 404 });
  }

  // 200 OK — Serve tanto para o Next.js Middleware quanto para o Caddy On-Demand TLS Ask Endpoint
  return NextResponse.json({
    ok: true,
    slug: match.slug,
    type: match.type,
    status: match.status,
    id: match.id,
    customDomain: match.customDomain,
  });
}
