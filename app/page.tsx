"use client";

import Link from "next/link";
import { SubjectHub, hubCardLinkClassTall } from "@/components/subject-hub";
import { defaultLocale, t, type MessageKey } from "@/lib/i18n";
import { useStoredScore, type AppId } from "@/lib/progress";

const subjects: {
  id?: AppId;
  href: "/geografia" | "/mates";
  title: MessageKey;
  description: MessageKey;
  mark: string;
  markClass: string;
  scoreVariant?: "best" | "last";
}[] = [
  {
    href: "/geografia",
    title: "subjects.geography.title",
    description: "subjects.geography.description",
    mark: "Ca",
    markClass: "bg-indigo-800",
  },
  {
    id: "mates",
    href: "/mates",
    title: "subjects.math.title",
    description: "subjects.math.description",
    mark: "×",
    markClass: "bg-amber-700",
    scoreVariant: "last",
  },
];

function ScoreLine({ app, variant }: { app: AppId; variant: "best" | "last" }) {
  const score = useStoredScore(app);
  if (!score) return t(defaultLocale, "home.scoreNone");
  const key = variant === "best" ? "home.scoreBest" : "home.scoreLast";
  return t(defaultLocale, key, {
    correct: score.correct,
    total: score.total,
  });
}

export default function HomePage() {
  return (
    <SubjectHub
      title={t(defaultLocale, "home.title")}
      subtitle={t(defaultLocale, "home.intro")}
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {subjects.map((subject) => (
          <li key={subject.href}>
            <Link href={subject.href} className={hubCardLinkClassTall}>
              <span
                className={`grid size-12 place-items-center rounded-2xl text-xl font-semibold text-white ${subject.markClass}`}
                aria-hidden="true"
              >
                {subject.mark}
              </span>
              <span>
                <span className="block text-xl font-semibold">
                  {t(defaultLocale, subject.title)}
                </span>
                <span className="mt-1 block text-base text-muted">
                  {t(defaultLocale, subject.description)}
                </span>
              </span>
              <span className="text-sm text-muted">
                {subject.id && subject.scoreVariant ? (
                  <ScoreLine app={subject.id} variant={subject.scoreVariant} />
                ) : (
                  t(defaultLocale, "subjects.pickTopic")
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </SubjectHub>
  );
}
