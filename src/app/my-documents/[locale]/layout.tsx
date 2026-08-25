import QueryProvider from "../../QueryProvider";
import "../../globals.css";
import { ThemeProvider } from "../../theme-provider";
import TopBar from "./topbar";

import { AuthProvider } from "@/app/authContext";
import { AuthInterceptor } from "@/app/authInterceptor";
import { PermissionGuard } from "@/app/permissionGuard";
import { routing } from "@/i18n/routing";

import type { Metadata } from "next";
import { Locale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Outfit } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";

import { Toaster } from "@/components/ui/toaster";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const inter = Outfit({ subsets: ["latin-ext"] });

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await props.params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "myDocuments" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "template" });
  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <title>{t("metadata.title")}</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>

      <Script
        defer
        data-domain="rentree.myecl.fr"
        src="https://plausible.eclair.ec-lyon.fr/js/script.js"
        strategy="lazyOnload"
      />
      <body className={inter.className}>
        <AuthInterceptor>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Suspense fallback={<div>Loading...</div>}>
              <QueryProvider>
                <NextIntlClientProvider locale={locale}>
                  <AuthProvider>
                    <PermissionGuard
                      permissionRequired="app"
                      noAuthRequiredPages={["/sign-document"]}
                    >
                      <TopBar />
                      {children}
                      <Toaster />
                    </PermissionGuard>
                  </AuthProvider>
                </NextIntlClientProvider>
              </QueryProvider>
            </Suspense>
          </ThemeProvider>
        </AuthInterceptor>
      </body>
    </html>
  );
}
