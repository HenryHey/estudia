"use client";

import { useState } from "react";
import type { Flashcard } from "@/content/flashcards/ca";
import { FlashcardExamSession } from "@/components/flashcard-exam-session";
import { FlashcardStudySession } from "@/components/flashcard-study-session";
import { Shell } from "@/components/shell";
import { primaryButton, secondaryButton } from "@/components/ui";
import { defaultLocale, t } from "@/lib/i18n";
import type { AppId } from "@/lib/progress";

type GameMode = "study" | "exam";

export function FlashcardGame({
  title,
  flashcards,
  scoreId,
  backHref = "/",
}: {
  title: string;
  flashcards: Flashcard[];
  scoreId: AppId;
  backHref?: string;
}) {
  const [mode, setMode] = useState<GameMode | null>(null);

  if (flashcards.length === 0) {
    return (
      <Shell title={title} backHref={backHref}>
        <p className="text-lg">{t(defaultLocale, "flashcards.empty")}</p>
      </Shell>
    );
  }

  if (mode === "study") {
    return (
      <FlashcardStudySession
        title={title}
        flashcards={flashcards}
        onExit={() => setMode(null)}
      />
    );
  }

  if (mode === "exam") {
    return (
      <FlashcardExamSession
        title={title}
        flashcards={flashcards}
        scoreId={scoreId}
        onExit={() => setMode(null)}
      />
    );
  }

  return (
    <Shell title={title} backHref={backHref}>
      <p className="mb-6 text-center text-lg text-muted">
        {t(defaultLocale, "flashcards.pickMode")}
      </p>
      <div className="grid gap-3">
        <button type="button" onClick={() => setMode("study")} className={primaryButton}>
          {t(defaultLocale, "flashcards.modeStudy")}
        </button>
        <button type="button" onClick={() => setMode("exam")} className={secondaryButton}>
          {t(defaultLocale, "flashcards.modeExam")}
        </button>
      </div>
      <p className="mt-4 text-center text-sm text-muted">
        {t(defaultLocale, "flashcards.modeStudyHint")}
      </p>
      <p className="mt-2 text-center text-sm text-muted">
        {t(defaultLocale, "flashcards.modeExamHint")}
      </p>
    </Shell>
  );
}
