"use client";

import Link from "next/link";
import { SubjectHub, hubCardLinkClass } from "@/components/subject-hub";
import { defaultLocale, t } from "@/lib/i18n";
import { useStoredScore } from "@/lib/progress";

const topics = [
  {
    href: "/mates/taules",
    title: "topics.timesTables.title" as const,
    description: "topics.timesTables.description" as const,
    mark: "×",
    markClass: "bg-amber-700",
  },
];

function ScoreLine() {
  const score = useStoredScore("mates");
  if (!score) return t(defaultLocale, "home.scoreNone");
  return t(defaultLocale, "home.scoreLast", {
    correct: score.correct,
    total: score.total,
  });
}

export default function MatesPage() {
  return (
    <SubjectHub
      back={{ href: "/", label: t(defaultLocale, "nav.home") }}
      title={t(defaultLocale, "subjects.math.title")}
      subtitle={t(defaultLocale, "subjects.pickTopic")}
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {topics.map((topic) => (
          <li key={topic.href}>
            <Link href={topic.href} className={hubCardLinkClass}>
              <span
                className={`grid size-12 place-items-center rounded-2xl text-xl font-semibold text-white ${topic.markClass}`}
                aria-hidden="true"
              >
                {topic.mark}
              </span>
              <span>
                <span className="block text-xl font-semibold">
                  {t(defaultLocale, topic.title)}
                </span>
                <span className="mt-1 block text-base text-muted">
                  {t(defaultLocale, topic.description)}
                </span>
              </span>
              <span className="text-sm text-muted">
                <ScoreLine />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </SubjectHub>
  );
}
