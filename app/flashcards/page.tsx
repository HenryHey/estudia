"use client";

import { useRef, useState } from "react";
import { flashcards, type Flashcard } from "@/content/flashcards/ca";
import { RoundEnd, Shell } from "@/components/shell";
import { primaryButton, secondaryButton } from "@/components/ui";
import { defaultLocale, t } from "@/lib/i18n";
import { writeScore } from "@/lib/progress";
import { shuffle } from "@/lib/shuffle";

export default function FlashcardsPage() {
  const title = t(defaultLocale, "apps.flashcards.title");
  const [queue, setQueue] = useState<Flashcard[]>(() => [...flashcards]);
  const [phase, setPhase] = useState<"front" | "back" | "done">("front");
  const [correct, setCorrect] = useState(0);
  const missed = useRef(new Set<string>());
  const total = flashcards.length;

  function restart() {
    missed.current = new Set();
    setCorrect(0);
    setPhase("front");
    setQueue(shuffle(flashcards));
  }

  if (total === 0) {
    return (
      <Shell title={title}>
        <p className="text-lg">{t(defaultLocale, "flashcards.empty")}</p>
      </Shell>
    );
  }

  if (phase === "done") {
    return (
      <Shell title={title}>
        <RoundEnd correct={correct} total={total} onAgain={restart} />
      </Shell>
    );
  }

  const current = queue[0];
  if (!current) return null;

  function mark(known: boolean) {
    if (!current) return;
    const rest = queue.slice(1);

    if (known) {
      const firstTry = !missed.current.has(current.id);
      const nextCorrect = correct + (firstTry ? 1 : 0);
      if (rest.length === 0) {
        writeScore("flashcards", { correct: nextCorrect, total });
        setCorrect(nextCorrect);
        setQueue([]);
        setPhase("done");
        return;
      }
      setCorrect(nextCorrect);
      setQueue(rest);
      setPhase("front");
      return;
    }

    missed.current.add(current.id);
    setQueue([...rest, current]);
    setPhase("front");
  }

  return (
    <Shell title={title}>
      <p className="mb-4 text-center text-sm text-muted">
        {t(defaultLocale, "session.progress", {
          current: total - queue.length + 1,
          total,
        })}
      </p>
      <button
        type="button"
        onClick={() => setPhase(phase === "front" ? "back" : "front")}
        className="flex min-h-64 flex-col items-center justify-center rounded-3xl bg-card px-6 py-10 text-center shadow-sm ring-1 ring-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
      >
        <span
          className={
            phase === "front"
              ? "text-4xl font-semibold tracking-tight"
              : "text-2xl font-semibold leading-snug"
          }
        >
          {phase === "front" ? current.front : current.back}
        </span>
        <span className="mt-6 text-base text-muted">
          {phase === "front"
            ? t(defaultLocale, "flashcards.tapToFlip")
            : t(defaultLocale, "flashcards.didYouKnow")}
        </span>
      </button>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {phase === "front" ? (
          <button
            type="button"
            onClick={() => setPhase("back")}
            className={`${primaryButton} col-span-2`}
          >
            {t(defaultLocale, "actions.flip")}
          </button>
        ) : (
          <>
            <button type="button" onClick={() => mark(false)} className={secondaryButton}>
              {t(defaultLocale, "actions.again")}
            </button>
            <button type="button" onClick={() => mark(true)} className={primaryButton}>
              {t(defaultLocale, "actions.known")}
            </button>
          </>
        )}
      </div>
    </Shell>
  );
}
