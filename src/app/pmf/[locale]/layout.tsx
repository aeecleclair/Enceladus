import "../../globals.css";

import { routing } from "@/i18n/routing";
import { Suspense } from "react";
import { Locale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import TopBar from "./topbar";
import type { Metadata } from "next";
import { AuthInterceptor } from "@/app/provider";
import QueryProvider from "../../QueryProvider";
import Script from "next/script";
import { ThemeProvider } from "../../theme-provider";

import { Toaster } from "@/components/ui/toaster";
import { Outfit } from "next/font/google";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const inter = Outfit({ subsets: ["latin-ext"] });

export async function generateMetadata(props: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "pmf" });

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
  const t = await getTranslations({ locale, namespace: "pmf" });
  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <title>{t("metadata.title")}</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>

      <Script
        defer
        data-domain="pmf.myecl.fr"
        src="https://plausible.eclair.ec-lyon.fr/js/script.js"
        strategy="lazyOnload"
      />
      <body className={inter.className}>
        <AuthInterceptor>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Suspense fallback={<div>Loading...</div>}>
              <QueryProvider>
                <NextIntlClientProvider locale={locale}>

                  <TopBar />
                  {children}

                  <Toaster />
                </NextIntlClientProvider>
              </QueryProvider>
            </Suspense>
          </ThemeProvider>
        </AuthInterceptor>
      </body>
    </html>
  );
}
