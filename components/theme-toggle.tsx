"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { navButtonClassName } from "@/components/app-ui";
import { cn } from "@/lib/utils";
import { defaultLocale, t } from "@/lib/i18n";
import {
  readStoredTheme,
  storeTheme,
  subscribeTheme,
  type ThemePreference,
} from "@/lib/theme";

function nextPreference(current: ThemePreference): ThemePreference {
  if (current === "system") return "light";
  if (current === "light") return "dark";
  return "system";
}

function labelFor(preference: ThemePreference): string {
  if (preference === "light") return t(defaultLocale, "theme.modeLight");
  if (preference === "dark") return t(defaultLocale, "theme.modeDark");
  return t(defaultLocale, "theme.modeSystem");
}

export function ThemeToggle({ className }: { className?: string }) {
  const preference = useSyncExternalStore(
    subscribeTheme,
    readStoredTheme,
    () => "system" as ThemePreference,
  );

  function cycle() {
    storeTheme(nextPreference(preference));
  }

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={cycle}
      className={cn(navButtonClassName, "aspect-square w-12 px-0 text-primary", className)}
      aria-label={t(defaultLocale, "theme.cycle")}
      title={labelFor(preference)}
    >
      {preference === "light" ? (
        <Sun className="size-5" aria-hidden />
      ) : preference === "dark" ? (
        <Moon className="size-5" aria-hidden />
      ) : (
        <Monitor className="size-5" aria-hidden />
      )}
    </Button>
  );
}
