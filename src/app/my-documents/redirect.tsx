"use client";

import { useLocaleStore } from "@/stores/locale";

import { usePathname } from "next/navigation";
import { permanentRedirect } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function RedirectPage() {
  return (
    <Suspense>
      <html>
        <body>
          <RedirectPageInternal />
        </body>
      </html>
    </Suspense>
  );
}

function RedirectPageInternal() {
  const pathname = usePathname();
  const { localeStore, setLocaleStore } = useLocaleStore();

  useEffect(() => {
    const navigatorLocale = navigator.language.startsWith("fr") ? "fr" : "en";
    if (!localeStore) setLocaleStore(navigatorLocale);
    permanentRedirect(`/${localeStore ?? navigatorLocale}${pathname}`);
  });

  return <></>;
}
