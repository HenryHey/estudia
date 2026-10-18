"use client";

import { useEffect, useRef, useState } from "react";
import type { Flashcard } from "@/content/flashcards/ca";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { FlashcardCard } from "@/components/flashcard-card";
import { RoundEnd, Shell } from "@/components/shell";
import { flashcardsForExam } from "@/lib/flashcards-exam";
import { defaultLocale, t } from "@/lib/i18n";
import { writeBestScore, type AppId } from "@/lib/progress";

export function FlashcardExamSession({
  title,
  flashcards,
  scoreId,
  onExit,
}: {
  title: string;
  flashcards: Flashcard[];
  scoreId: AppId;
  onExit: () => void;
}) {
  const [cards, setCards] = useState(() => flashcardsForExam(flashcards));
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"front" | "back" | "done">("front");
  const [correct, setCorrect] = useState(0);
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);
  const historyGuardActive = useRef(false);
  const skipPopState = useRef(false);
  const examStartedAt = useRef(Date.now());

  const sessionTotal = cards.length;
  const examInProgress = sessionTotal > 0 && phase !== "done";

  function dropHistoryGuard() {
    if (!historyGuardActive.current) return;
    skipPopState.current = true;
    historyGuardActive.current = false;
    history.back();
  }

  useEffect(() => {
    if (!examInProgress) {
      dropHistoryGuard();
      return;
    }

    history.pushState({ estudiaExamGuard: true }, "", window.location.href);
    historyGuardActive.current = true;

    function onPopState() {
      if (skipPopState.current) {
        skipPopState.current = false;
        return;
      }
      history.pushState({ estudiaExamGuard: true }, "", window.location.href);
      setLeaveConfirmOpen(true);
    }

    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [examInProgress]);

  function requestLeave() {
    if (phase === "done") {
      onExit();
      return;
    }
    setLeaveConfirmOpen(true);
  }

  function confirmLeave() {
    setLeaveConfirmOpen(false);
    dropHistoryGuard();
    onExit();
  }

  function restart() {
    examStartedAt.current = Date.now();
    setCards(flashcardsForExam(flashcards));
    setIndex(0);
    setCorrect(0);
    setPhase("front");
  }

  const leaveDialog = (
    <ConfirmDialog
      open={leaveConfirmOpen}
      title={t(defaultLocale, "flashcards.examLeaveTitle")}
      confirmLabel={t(defaultLocale, "flashcards.examLeaveConfirm")}
      cancelLabel={t(defaultLocale, "flashcards.examLeaveCancel")}
      onConfirm={confirmLeave}
      onCancel={() => setLeaveConfirmOpen(false)}
    >
      {t(defaultLocale, "flashcards.examLeaveBody")}
    </ConfirmDialog>
  );

  if (sessionTotal === 0) {
    return (
      <Shell title={title} onBack={onExit}>
        <p className="text-lg">{t(defaultLocale, "flashcards.empty")}</p>
      </Shell>
    );
  }

  if (phase === "done") {
    return (
      <Shell title={title} onBack={onExit}>
        <RoundEnd correct={correct} total={sessionTotal} onAgain={restart} />
      </Shell>
    );
  }

  const current = cards[index];
  if (!current) {
    return (
      <Shell title={title} onBack={onExit}>
        <p className="text-lg">{t(defaultLocale, "flashcards.empty")}</p>
      </Shell>
    );
  }

  function mark(known: boolean) {
    const nextCorrect = correct + (known ? 1 : 0);
    const nextIndex = index + 1;

    if (nextIndex >= sessionTotal) {
      writeBestScore(scoreId, {
        correct: nextCorrect,
        total: sessionTotal,
        durationMs: Date.now() - examStartedAt.current,
      });
      setCorrect(nextCorrect);
      setIndex(nextIndex);
      setPhase("done");
      return;
    }

    setCorrect(nextCorrect);
    setIndex(nextIndex);
    setPhase("front");
  }

  return (
    <>
      <Shell title={title} onBack={requestLeave}>
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t(defaultLocale, "flashcards.modeExam")}
        </p>
        <p className="mb-4 text-center text-sm text-muted-foreground">
          {t(defaultLocale, "session.progress", {
            current: index + 1,
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
      {leaveDialog}
    </>
  );
}
