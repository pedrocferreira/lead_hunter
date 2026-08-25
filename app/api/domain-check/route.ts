import { NextRequest, NextResponse } from "next/server";
import dns from "dns";
import { promisify } from "util";

// ─── Domain Check API ─────────────────────────────────────────────────────────
// Verifica se um domínio customizado está apontando corretamente para o servidor.
// GET /api/domain-check?domain=www.meurestaurante.com.br
// → { ok: true, ip: "123.45.67.89" } | { ok: false, error: "..." }

const lookup = promisify(dns.lookup);

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get("domain");

  if (!domain) {
    return NextResponse.json({ ok: false, error: "domain parameter required" }, { status: 400 });
  }

  // Sanitiza: apenas hostname
  const cleanDomain = domain
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .split(":")[0]
    .trim();

  if (!cleanDomain || !/^[a-z0-9.-]+$/.test(cleanDomain)) {
    return NextResponse.json({ ok: false, error: "Formato de domínio inválido" }, { status: 400 });
  }

  try {
    // Tenta resolver endereço IP (Tipo A / AAAA)
    const result = await lookup(cleanDomain);
    
    let cnameTarget = "";
    try {
      const cnames = await promisify(dns.resolveCname)(cleanDomain);
      if (cnames && cnames.length > 0) {
        cnameTarget = cnames[0];
      }
    } catch {
      // Nem todo domínio tem CNAME direto (pode ser registro A)
    }

    return NextResponse.json({
      ok: true,
      domain: cleanDomain,
      ip: result.address,
      cname: cnameTarget || null,
      family: result.family === 4 ? "IPv4" : "IPv6",
      message: `DNS ativo! Apontando para ${result.address}${cnameTarget ? ` (CNAME: ${cnameTarget})` : ""}`,
    });
  } catch (err: any) {
    const isNotFound =
      err.code === "ENOTFOUND" ||
      err.code === "ENODATA" ||
      err.code === "ESERVFAIL";

    return NextResponse.json({
      ok: false,
      domain: cleanDomain,
      error: isNotFound
        ? "Domínio ainda não respondeu ao DNS. Se você acabou de salvar no Registro.br, aguarde de 5 a 30 minutos para propagação."
        : `Erro ao verificar DNS: ${err.message}`,
      code: err.code,
    });
  }
}
