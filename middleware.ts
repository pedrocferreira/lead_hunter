import { NextRequest, NextResponse } from "next/server";

// ─── Middleware de Domínio Customizado ────────────────────────────────────────
// Roda no Edge Runtime antes de qualquer rota.
// Se o host da requisição for um domínio customizado cadastrado no banco,
// reescreve internamente para /s/[slug] ou /c/[slug] sem redirecionar o browser.
//
// Requisitos de DNS para o cliente:
//   CNAME www  →  suaplataforma.com.br
//   (ou A record apontando para o IP do servidor)

export const config = {
  // Roda em todas as rotas exceto assets estáticos e APIs internas
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};

// Hosts padrão de desenvolvimento e locais
const DEFAULT_LOCAL_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
]);

export async function middleware(req: NextRequest) {
  // Em produção com proxy reverso (Nginx/Caddy/Cloudflare), o host real vem em x-forwarded-host
  const rawHost =
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    "";

  const normalizedHost = rawHost
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .split(":")[0]
    .split("/")[0]
    .trim();

  // Domínios da própria plataforma configurados via ambiente
  const platformEnvDomain = process.env.PLATFORM_DOMAIN || process.env.NEXT_PUBLIC_APP_URL || "";
  const cleanPlatformEnvDomain = platformEnvDomain
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .split(":")[0]
    .split("/")[0]
    .trim();

  // 1. Se for host local ou da própria plataforma SaaS, passa direto para a rota normal da aplicação
  if (
    !normalizedHost ||
    DEFAULT_LOCAL_HOSTS.has(normalizedHost) ||
    normalizedHost.endsWith(".localhost") ||
    (cleanPlatformEnvDomain && normalizedHost === cleanPlatformEnvDomain) ||
    (cleanPlatformEnvDomain && normalizedHost === `www.${cleanPlatformEnvDomain}`)
  ) {
    return NextResponse.next();
  }

  // 2. Se já estiver acessando diretamente rotas internas de preview /s/ ou /c/, passa direto
  const pathname = req.nextUrl.pathname;
  if (pathname.startsWith("/s/") || pathname.startsWith("/c/")) {
    return NextResponse.next();
  }

  // 3. Consulta a API interna para resolver o domínio customizado
  // O lookup é feito via fetch interno para evitar importar `fs` no Edge
  try {
    const lookupUrl = new URL(
      `/api/domain-lookup?host=${encodeURIComponent(normalizedHost)}`,
      req.url
    );

    const lookupRes = await fetch(lookupUrl.toString(), {
      // Sem cache para sempre ter dados atualizados
      // Em produção com muito tráfego, considere um TTL de 60s
      cache: "no-store",
    });

    if (!lookupRes.ok) {
      // Domínio não cadastrado → passa para a rota normal (pode ser 404 do Next)
      return NextResponse.next();
    }

    const data = await lookupRes.json() as {
      slug: string;
      type: "site" | "card";
      status: string;
    };

    // 4. Reescreve internamente para a rota correta
    //    /s/[slug]  para landing pages
    //    /c/[slug]  para cartões digitais
    const prefix = data.type === "site" ? "s" : "c";
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = `/${prefix}/${data.slug}`;

    return NextResponse.rewrite(rewriteUrl);
  } catch {
    // Erro de rede ou timeout → deixa passar sem quebrar
    return NextResponse.next();
  }
}
