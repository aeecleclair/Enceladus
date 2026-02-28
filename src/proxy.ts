// middleware.js ou middleware.ts

import { NextResponse } from "next/server";

// Mappings des sous-domaines vers les chemins de base de l'App Router
const SUBDOMAIN_ROUTES = {
  rentree: "/rentree",
  pmf: "/pmf",
  "raid-registering": "/raid-registering",
  sg: "/sg",
};

export function proxy(request: Request) {
  const host = request.headers.get("host")?.split(".")[0]; // Extraire le sous-domaine
  const url = new URL(request.url);
  const pathname = url.pathname;
  if (!host || !(host in SUBDOMAIN_ROUTES)) {
    // Si ce n'est pas un des sous-domaines cibles, on laisse Next.js gérer
    return NextResponse.next();
  }

  const basePath = SUBDOMAIN_ROUTES[host as keyof typeof SUBDOMAIN_ROUTES];
  if (pathname.startsWith(basePath)) {
    // Si le chemin commence déjà par la basePath, on ne fait rien
    return NextResponse.next();
  }
  // Modifier le pathname pour inclure la basePath
  url.pathname = basePath + url.pathname;
  return NextResponse.rewrite(url);
}

// 4. Configuration du Matcher
export const config = {
  matcher: [
    // Fait correspondre toutes les routes, mais ignore les ressources statiques et les API
    "/",
    "/((?!api|_next/static|_next/image|favicon.ico|assets|public|.*\\..*).*)",
  ],
};
