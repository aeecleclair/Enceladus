"use client";

import * as React from "react";

import {
  MenubarItem,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from "@/components/ui/menubar";

import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

export function ThemeButton() {
  const t = useTranslations("raid.common");
  const { setTheme } = useTheme();

  return (
    <MenubarSub>
      <MenubarSubTrigger>{t("theme")}</MenubarSubTrigger>
      <MenubarSubContent>
        <MenubarItem onClick={() => setTheme("light")}>
          {t("themeLight")}
          <MenubarShortcut>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          </MenubarShortcut>
        </MenubarItem>
        <MenubarItem onClick={() => setTheme("dark")}>
          {t("themeDark")}
          <MenubarShortcut>
            <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          </MenubarShortcut>
        </MenubarItem>
        <MenubarItem onClick={() => setTheme("system")}>
          {t("themeSystem")}
          <MenubarShortcut>
            <SunMoon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          </MenubarShortcut>
        </MenubarItem>
      </MenubarSubContent>
    </MenubarSub>
  );
}
