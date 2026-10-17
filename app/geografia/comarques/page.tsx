"use client";

import { MapPin } from "lucide-react";
import Link from "next/link";
import { HubIcon } from "@/components/hub-icon";
import { SubjectHub, hubCardLinkClass } from "@/components/subject-hub";
import { provincies, comarquesScoreId } from "@/content/comarques/ca";
import { defaultLocale, t } from "@/lib/i18n";
import { useStoredScore } from "@/lib/progress";

function ScoreLine({ provinciaId }: { provinciaId: (typeof provincies)[number]["id"] }) {
  const score = useStoredScore(comarquesScoreId(provinciaId));
  if (!score) return t(defaultLocale, "home.scoreNone");
  return t(defaultLocale, "home.scoreBest", {
    correct: score.correct,
    total: score.total,
  });
}

export default function ComarquesTopicPage() {
  return (
    <SubjectHub
      back={{ href: "/geografia", label: t(defaultLocale, "nav.back") }}
      title={t(defaultLocale, "topics.comarques.title")}
      subtitle={t(defaultLocale, "topics.comarques.description")}
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {provincies.map((provincia) => (
          <li key={provincia.id}>
            <Link href={`/geografia/comarques/${provincia.id}`} className={hubCardLinkClass}>
              <HubIcon icon={MapPin} className="bg-indigo-800" />
              <span>
                <span className="block text-xl font-semibold">{provincia.name}</span>
                <span className="mt-1 block text-base text-muted-foreground">
                  {t(defaultLocale, "geography.provinceDescription")}
                </span>
              </span>
              <span className="text-sm text-muted-foreground">
                <ScoreLine provinciaId={provincia.id} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </SubjectHub>
  );
}
