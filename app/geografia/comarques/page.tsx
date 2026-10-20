"use client";

import { LocateFixed, MapPin } from "lucide-react";
import Link from "next/link";
import { HubIcon } from "@/components/hub-icon";
import { SubjectHub, hubCardLinkClass } from "@/components/subject-hub";
import {
  provincies,
  comarquesMapScoreId,
  comarquesScoreId,
  type ProvinciaId,
} from "@/content/comarques/ca";
import { defaultLocale, t } from "@/lib/i18n";
import { useStoredScore, type AppId } from "@/lib/progress";

function ScoreLine({ scoreId }: { scoreId: AppId }) {
  const score = useStoredScore(scoreId);
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
                <ScoreLine scoreId={comarquesScoreId(provincia.id)} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="mt-10 text-lg font-semibold">{t(defaultLocale, "geography.mapSection")}</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {provincies.map((provincia) => (
          <li key={`map-${provincia.id}`}>
            <Link
              href={`/geografia/comarques/mapa/${provincia.id}`}
              className={hubCardLinkClass}
            >
              <HubIcon icon={LocateFixed} className="bg-teal-800" />
              <span>
                <span className="block text-xl font-semibold">
                  {t(defaultLocale, "geography.mapTitle", { name: provincia.name })}
                </span>
                <span className="mt-1 block text-base text-muted-foreground">
                  {t(defaultLocale, "geography.mapDescription")}
                </span>
              </span>
              <span className="text-sm text-muted-foreground">
                <ScoreLine scoreId={comarquesMapScoreId(provincia.id as ProvinciaId)} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </SubjectHub>
  );
}
