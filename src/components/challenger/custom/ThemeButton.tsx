"use client";

import * as React from "react";
import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import {
  MenubarShortcut,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarItem,
} from "@/components/ui/menubar";

export function ThemeButton() {
  const { setTheme } = useTheme();

  return (
    <MenubarSub>
      <MenubarSubTrigger>Thème</MenubarSubTrigger>
      <MenubarSubContent>
        <MenubarItem onClick={() => setTheme("light")}>
          Clair
          <MenubarShortcut>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          </MenubarShortcut>
        </MenubarItem>
        <MenubarItem onClick={() => setTheme("dark")}>
          Sombre
          <MenubarShortcut>
            <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          </MenubarShortcut>
        </MenubarItem>
        <MenubarItem onClick={() => setTheme("system")}>
          Système
          <MenubarShortcut>
            <SunMoon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          </MenubarShortcut>
        </MenubarItem>
      </MenubarSubContent>
    </MenubarSub>
  );
}
