"use client";

import { useSellers } from "@/hooks/siarnaq/useSellers";
import { useStatus } from "@/hooks/siarnaq/useStatus";
import { useYear } from "@/hooks/siarnaq/useYear";
import { usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useLocaleStore } from "@/stores/locale";
import { useTokenStore } from "@/stores/token";

import { CaretSortIcon, ExitIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { Locale, useLocale } from "next-intl";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { HiOutlineLibrary } from "react-icons/hi";
import { HiMiniTicket } from "react-icons/hi2";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useMeUser } from "@/hooks/useMeUser";
import { useHasTicketingPermission } from "@/hooks/sg/useHasTicketingPermission";

export default function TopBar() {
  const t = useTranslations("sg");
  const { setToken, setRefreshToken } = useTokenStore();
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const { user } = useMeUser();
  const { isTicketingAdmin } = useHasTicketingPermission();
  const { sellers } = useSellers();

  const isInASellerGroup = user?.groups?.some((group) =>
    sellers.some((seller) => seller.group_id === group.id)
  );

  return (
    <div className="p-6 bg-muted/40 flex flex-row flex-nowrap gap-x-4 justify-between">
      <div className="flex flex-row gap-x-4 shrink-0">
        <LocaleDropdown />
        <ThemeToggle />
      </div>
      <div className="flex gap-x-4">
        {pathname === "/" && (isTicketingAdmin || isInASellerGroup) && (
          <Button
            variant="secondary"
            onClick={() => router.push(`/${locale}/admin`)}
          >
            <HiOutlineLibrary className="mr-2" />
            {t("topbar.admin")}
          </Button>
        )}
        {pathname === "/admin" && (
          <Button variant="secondary" onClick={() => router.push(`/${locale}`)}>
            <HiMiniTicket className="mr-2" />
            {t("topbar.user")}
          </Button>
        )}
        {["/", "/admin"].includes(pathname) && (
          <Button
            variant="secondary"
            onClick={() => {
              setRefreshToken(null);
              setToken(null);
            }}
          >
            <ExitIcon className="mr-2" />
            {t("topbar.logout")}
          </Button>
        )}
      </div>
    </div>
  );
}

function LocaleDropdown() {
  const locale = useLocale();
  const { localeStore, setLocaleStore } = useLocaleStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sellerId = searchParams.get("sellerId") ?? "";
  if (!localeStore) setLocaleStore(locale);

  const localeName = {
    en: "English",
    fr: "Français",
  };

  const onSetLocale = (l: string) => {
    if (l !== locale) {
      router.push(`/${l}${pathname}${sellerId ? `?sellerId=${sellerId}` : ""}`);
      setLocaleStore(l as Locale);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex flex-row p-1">
        <Image
          src={`/${locale}.svg`}
          alt={localeName[locale]}
          width={30}
          height={30}
          className="rounded-2xs mr-2"
        />
        <span className="self-center">{localeName[locale]}</span>
        <CaretSortIcon className="ml-2 size-6 self-center" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={locale} onValueChange={onSetLocale}>
          {routing.locales.map((l) => (
            <DropdownMenuRadioItem key={l} value={l}>
              <Image
                src={`/${l}.svg`}
                alt={localeName[l]}
                width={30}
                height={30}
                className="rounded-2xs border border-border mr-2"
              />
              <span>{localeName[l]}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(resolvedTheme! === "light" ? "dark" : "light")}
      className="inline-flex items-center justify-center text-foreground"
    >
      <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}
