"use client";

import { MapPinned } from "lucide-react";
import Link from "next/link";
import { HubIcon } from "@/components/hub-icon";
import { SubjectHub, hubCardLinkClass } from "@/components/subject-hub";
import { defaultLocale, t } from "@/lib/i18n";

const topics = [
  {
    href: "/geografia/comarques",
    title: "topics.comarques.title" as const,
    description: "topics.comarques.description" as const,
    icon: MapPinned,
    iconClass: "bg-indigo-800",
  },
];

export default function GeografiaPage() {
  return (
    <SubjectHub
      back={{ href: "/", label: t(defaultLocale, "nav.home") }}
      title={t(defaultLocale, "subjects.geography.title")}
      subtitle={t(defaultLocale, "subjects.pickTopic")}
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {topics.map((topic) => (
          <li key={topic.href}>
            <Link href={topic.href} className={hubCardLinkClass}>
              <HubIcon icon={topic.icon} className={topic.iconClass} />
              <span>
                <span className="block text-xl font-semibold">
                  {t(defaultLocale, topic.title)}
                </span>
                <span className="mt-1 block text-base text-muted-foreground">
                  {t(defaultLocale, topic.description)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </SubjectHub>
  );
}
