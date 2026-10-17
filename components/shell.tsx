"use client";

import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { defaultLocale, t } from "@/lib/i18n";
import { primaryButton } from "@/components/ui";

export function Shell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-6 sm:py-10">
      <header className="mb-6 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex h-12 items-center rounded-2xl px-3 text-base font-semibold text-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
        >
          {t(defaultLocale, "nav.home")}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
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
      <button type="button" onClick={onAgain} className={primaryButton}>
        {t(defaultLocale, "actions.anotherRound")}
      </button>
    </div>
  );
}
