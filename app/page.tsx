"use client";

import Link from "next/link";
import { defaultLocale, t, type MessageKey } from "@/lib/i18n";
import { useLastScore, type AppId } from "@/lib/progress";

const apps: {
  id: AppId;
  href: "/flashcards" | "/mates";
  title: MessageKey;
  description: MessageKey;
  mark: string;
  markClass: string;
}[] = [
  {
    id: "flashcards",
    href: "/flashcards",
    title: "apps.flashcards.title",
    description: "apps.flashcards.description",
    mark: "Aa",
    markClass: "bg-teal-700",
  },
  {
    id: "mates",
    href: "/mates",
    title: "apps.mates.title",
    description: "apps.mates.description",
    mark: "×",
    markClass: "bg-amber-700",
  },
];

function ScoreLine({ app }: { app: AppId }) {
  const score = useLastScore(app);
  if (!score) return t(defaultLocale, "home.scoreNone");
  return t(defaultLocale, "home.scoreLast", {
    correct: score.correct,
    total: score.total,
  });
}

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-10 sm:py-16">
      <header className="mb-8">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {t(defaultLocale, "home.title")}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-muted">{t(defaultLocale, "home.intro")}</p>
      </header>
      <main>
        <ul className="grid gap-4 sm:grid-cols-2">
          {apps.map((app) => (
            <li key={app.id}>
              <Link
                href={app.href}
                className="flex min-h-56 flex-col justify-between rounded-3xl bg-card p-5 shadow-sm ring-1 ring-line transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
              >
                <span
                  className={`grid size-12 place-items-center rounded-2xl text-xl font-semibold text-white ${app.markClass}`}
                  aria-hidden="true"
                >
                  {app.mark}
                </span>
                <span>
                  <span className="block text-xl font-semibold">
                    {t(defaultLocale, app.title)}
                  </span>
                  <span className="mt-1 block text-base text-muted">
                    {t(defaultLocale, app.description)}
                  </span>
                </span>
                <span className="text-sm text-muted">
                  <ScoreLine app={app.id} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
