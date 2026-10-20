"use client";

import { BookOpen, ClipboardCheck } from "lucide-react";
import { useState } from "react";
import { MapLocationSession } from "@/components/map-location-session";
import { GameHighScores } from "@/components/game-high-scores";
import { Shell } from "@/components/shell";
import { primaryButton, secondaryButton } from "@/components/app-ui";
import {
  catalunyaCapitalMarkers,
  type MapQuestion,
} from "@/content/comarques/ca";
import { defaultLocale, t } from "@/lib/i18n";
import type { AppId } from "@/lib/progress";

type GameMode = "study" | "exam";

export function MapLocationGame({
  title,
  questions,
  scoreId,
  backHref = "/",
}: {
  title: string;
  questions: MapQuestion[];
  scoreId: AppId;
  backHref?: string;
}) {
  const [mode, setMode] = useState<GameMode | null>(null);
  const markers = catalunyaCapitalMarkers();

  if (questions.length === 0) {
    return (
      <Shell title={title} backHref={backHref} wide>
        <p className="text-lg">{t(defaultLocale, "map.empty")}</p>
      </Shell>
    );
  }

  if (mode) {
    return (
      <MapLocationSession
        title={title}
        questions={questions}
        markers={markers}
        mode={mode}
        scoreId={scoreId}
        onExit={() => setMode(null)}
      />
    );
  }

  return (
    <Shell title={title} backHref={backHref} wide>
      <p className="mb-6 text-center text-lg text-muted-foreground">
        {t(defaultLocale, "flashcards.pickMode")}
      </p>
      <div className="grid gap-3">
        <button type="button" onClick={() => setMode("study")} className={`${primaryButton} gap-2`}>
          <BookOpen className="size-5 shrink-0" aria-hidden />
          {t(defaultLocale, "flashcards.modeStudy")}
        </button>
        <button type="button" onClick={() => setMode("exam")} className={`${secondaryButton} gap-2`}>
          <ClipboardCheck className="size-5 shrink-0" aria-hidden />
          {t(defaultLocale, "flashcards.modeExam")}
        </button>
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        {t(defaultLocale, "flashcards.modeStudyHint")}
      </p>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        {t(defaultLocale, "flashcards.modeExamHint")}
      </p>
      <GameHighScores gameId={scoreId} />
    </Shell>
  );
}
