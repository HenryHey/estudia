"use client";

import { RotateCw, ThumbsDown, ThumbsUp } from "lucide-react";
import type { Flashcard } from "@/content/flashcards/ca";
import { primaryButton, secondaryButton } from "@/components/app-ui";
import { defaultLocale, t } from "@/lib/i18n";

export function FlashcardCard({
  card,
  phase,
  onTogglePhase,
  onFlip,
  onMark,
}: {
  card: Flashcard;
  phase: "front" | "back";
  onTogglePhase: () => void;
  onFlip: () => void;
  onMark: (known: boolean) => void;
}) {
  const frontLines = card.front.split("\n");
  const frontLabel = frontLines[0] ?? card.front;
  const frontPrompt = frontLines.slice(1).join("\n") || null;

  const backLines = card.back.split("\n");
  const backMain = backLines[0] ?? card.back;

  return (
    <>
      <button
        type="button"
        onClick={onTogglePhase}
        className="flex min-h-64 flex-col items-center justify-center rounded-3xl bg-card px-6 py-10 text-center shadow-sm ring-1 ring-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
      >
        {phase === "front" ? (
          <>
            <span className="text-base font-semibold uppercase tracking-wide text-muted-foreground">
              {frontLabel}
            </span>
            {frontPrompt ? (
              <span className="mt-4 text-3xl font-semibold leading-snug tracking-tight sm:text-4xl">
                {frontPrompt}
              </span>
            ) : null}
          </>
        ) : (
          <span className="text-3xl font-semibold leading-snug sm:text-4xl">{backMain}</span>
        )}
        <span className="mt-6 text-base text-muted-foreground">
          {phase === "front"
            ? t(defaultLocale, "flashcards.tapToFlip")
            : t(defaultLocale, "flashcards.didYouKnow")}
        </span>
      </button>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {phase === "front" ? (
          <button type="button" onClick={onFlip} className={`${primaryButton} col-span-2 gap-2`}>
            <RotateCw className="size-5 shrink-0" aria-hidden />
            {t(defaultLocale, "actions.flip")}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onMark(false)}
              className={`${secondaryButton} gap-2`}
            >
              <ThumbsDown className="size-5 shrink-0" aria-hidden />
              {t(defaultLocale, "actions.again")}
            </button>
            <button
              type="button"
              onClick={() => onMark(true)}
              className={`${primaryButton} gap-2`}
            >
              <ThumbsUp className="size-5 shrink-0" aria-hidden />
              {t(defaultLocale, "actions.known")}
            </button>
          </>
        )}
      </div>
    </>
  );
}
