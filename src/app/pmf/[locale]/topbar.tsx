"use client"

import { Moon, Sun } from "lucide-react";
import { Locale, useLocale, useTranslations } from "next-intl"
import { useTheme } from "next-themes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "@/i18n/navigation";
import { useLocaleStore } from "@/stores/locale";
import Image from "next/image";
import { CaretSortIcon, ExitIcon } from "@radix-ui/react-icons";
import { routing } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useTokenStore } from "@/stores/token";



export default function TopBar() {
    const t = useTranslations("pmf");
    const pathname = usePathname();
    const { setToken, setRefreshToken } = useTokenStore();

    return (
        <div className="p-6 bg-muted/40 flex flex-row flex-nowrap gap-x-4 justify-between">
            <div className="flex flex-row gap-x-4 shrink-0">
                <LocaleDropdown />
                <ThemeToggle />
            </div>
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
    );
}

function LocaleDropdown() {
    const locale = useLocale();
    const { localeStore, setLocaleStore } = useLocaleStore();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    if (!localeStore) setLocaleStore(locale);

    const localeName = {
        en: "English",
        fr: "Français",
    };

    const onSetLocale = (l: string) => {
        if (l !== locale) {
            router.push(`/${l}${pathname}`);
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