"use client";

import { ChevronLeft, Home, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { navButtonClassName, sessionButtonClassName } from "@/components/app-ui";
import { ProfileMenu } from "@/components/profile-menu";
import { Button } from "@/components/ui/button";
import { defaultLocale, t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const backControlClass = cn(
  navButtonClassName,
  "inline-flex items-center gap-1.5 text-primary hover:bg-muted",
);

export function Shell({
  title,
  children,
  backHref = "/",
  onBack,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  backHref?: string;
  /** When set, back stays in-app (e.g. mode picker) instead of navigating away. */
  onBack?: () => void;
  /** Wider column for games that need a map. */
  wide?: boolean;
}) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  const isHome = !onBack && backHref === "/";
  const backLabel = isHome
    ? t(defaultLocale, "nav.home")
    : t(defaultLocale, "nav.back");
  const BackIcon = isHome ? Home : ChevronLeft;

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col px-4 py-6 sm:py-10",
        wide ? "max-w-3xl" : "max-w-xl",
      )}
    >
      <header className="mb-6 flex items-center gap-4">
        {onBack ? (
          <button type="button" onClick={onBack} className={backControlClass}>
            <BackIcon className="size-5 shrink-0" aria-hidden />
            {backLabel}
          </button>
        ) : (
          <Link href={backHref} className={backControlClass}>
            <BackIcon className="size-5 shrink-0" aria-hidden />
            {backLabel}
          </Link>
        )}
        <div className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-2">
          <h1 className="truncate text-2xl font-semibold tracking-tight">{title}</h1>
          <ProfileMenu />
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}

export function RoundEnd({
  correct,
  total,
  onAgain,
}: {
  correct: number;
  total: number;
  onAgain: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <p className="text-3xl font-semibold">{t(defaultLocale, "session.done")}</p>
      <p className="text-xl">{t(defaultLocale, "session.score", { correct, total })}</p>
      <Button type="button" onClick={onAgain} className={`${sessionButtonClassName} gap-2`}>
        <RotateCcw className="size-5 shrink-0" aria-hidden />
        {t(defaultLocale, "actions.anotherRound")}
      </Button>
    </div>
  );
}
