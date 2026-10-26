"use client";

import { Moon, Sun } from "lucide-react";
import { useLang } from "@/lib/useLang";
import { useTheme } from "@/lib/useTheme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useLang();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? t.theme.toLight : t.theme.toDark}
      className="grid size-9 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-fg"
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
