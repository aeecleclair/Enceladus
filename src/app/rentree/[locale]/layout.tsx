import "../../globals.css";

import { routing } from "@/i18n/routing";
import { Suspense } from "react";
import { Locale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import type { Metadata } from "next";
import { AuthInterceptor } from "@/app/provider";
import QueryProvider from "../../QueryProvider";
import Script from "next/script";
import { ThemeProvider } from "../../theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Outfit } from "next/font/google";
import TopBar from "./topbar";
import { PermissionGuard } from "@/app/permissionGuard";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const inter = Outfit({ subsets: ["latin-ext"] });

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await props.params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "siarnaq" });

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
  const t = await getTranslations({ locale, namespace: "siarnaq" });
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
                  <PermissionGuard permissionRequired="access_cdr">
                    <TopBar />
                    {children}
                    <Toaster />
                  </PermissionGuard>
                </NextIntlClientProvider>
              </QueryProvider>
            </Suspense>
          </ThemeProvider>
        </AuthInterceptor>
      </body>
    </html>
  );
}
