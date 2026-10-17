"use client";

import { useRef, useState } from "react";
import type { Flashcard } from "@/content/flashcards/ca";
import { FlashcardCard } from "@/components/flashcard-card";
import { RoundEnd, Shell } from "@/components/shell";
import { defaultLocale, t } from "@/lib/i18n";
import { shuffle } from "@/lib/shuffle";

export function FlashcardStudySession({
  title,
  flashcards,
  onExit,
}: {
  title: string;
  flashcards: Flashcard[];
  onExit: () => void;
}) {
  const sessionTotal = flashcards.length;
  const [queue, setQueue] = useState(() => shuffle(flashcards));
  const [phase, setPhase] = useState<"front" | "back" | "done">("front");
  const [correct, setCorrect] = useState(0);
  const missed = useRef(new Set<string>());

  function restart() {
    missed.current = new Set();
    setCorrect(0);
    setPhase("front");
    setQueue(shuffle(flashcards));
  }

  if (phase === "done") {
    return (
      <Shell title={title} onBack={onExit}>
        <RoundEnd correct={correct} total={sessionTotal} onAgain={restart} />
      </Shell>
    );
  }

  const current = queue[0];
  if (!current) {
    return (
      <Shell title={title} onBack={onExit}>
        <p className="text-lg">{t(defaultLocale, "flashcards.empty")}</p>
      </Shell>
    );
  }

  const answered = sessionTotal - queue.length;

  function mark(known: boolean) {
    const rest = queue.slice(1);

    if (known) {
      const firstTry = !missed.current.has(current.id);
      const nextCorrect = correct + (firstTry ? 1 : 0);
      if (rest.length === 0) {
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
    <Shell title={title} onBack={onExit}>
      <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-muted">
        {t(defaultLocale, "flashcards.modeStudy")}
      </p>
      <p className="mb-4 text-center text-sm text-muted">
        {t(defaultLocale, "session.progress", {
          current: answered + 1,
          total: sessionTotal,
        })}
      </p>
      <FlashcardCard
        card={current}
        phase={phase}
        onTogglePhase={() => setPhase(phase === "front" ? "back" : "front")}
        onFlip={() => setPhase("back")}
        onMark={mark}
      />
    </Shell>
  );
}
