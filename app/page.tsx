"use client";

import { Calculator, Map, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { HubIcon } from "@/components/hub-icon";
import { SubjectHub, hubCardLinkClassTall } from "@/components/subject-hub";
import { defaultLocale, t, type MessageKey } from "@/lib/i18n";
import { useStoredScore, type AppId } from "@/lib/progress";

const subjects: {
  id?: AppId;
  href: "/geografia" | "/mates";
  title: MessageKey;
  description: MessageKey;
  icon: LucideIcon;
  iconClass: string;
  scoreVariant?: "best" | "last";
}[] = [
  {
    href: "/geografia",
    title: "subjects.geography.title",
    description: "subjects.geography.description",
    icon: Map,
    iconClass: "bg-indigo-800",
  },
  {
    id: "mates",
    href: "/mates",
    title: "subjects.math.title",
    description: "subjects.math.description",
    icon: Calculator,
    iconClass: "bg-amber-700",
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
              <HubIcon icon={subject.icon} className={subject.iconClass} />
              <span>
                <span className="block text-xl font-semibold">
                  {t(defaultLocale, subject.title)}
                </span>
                <span className="mt-1 block text-base text-muted-foreground">
                  {t(defaultLocale, subject.description)}
                </span>
              </span>
              <span className="text-sm text-muted-foreground">
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
