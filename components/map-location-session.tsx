"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { RoundEnd, Shell } from "@/components/shell";
import { primaryButton } from "@/components/app-ui";
import {
  catalunyaMapSrc,
  type MapPoint,
  type MapQuestion,
} from "@/content/comarques/ca";
import {
  CATALUNYA_MAP_HEIGHT,
  CATALUNYA_MAP_WIDTH,
  isMapHit,
  mapMissPoint,
  mapOptionFrame,
  nearestMapPoint,
} from "@/lib/map-hit";
import { defaultLocale, t } from "@/lib/i18n";
import { writeBestScore, type AppId } from "@/lib/progress";
import { shuffle } from "@/lib/shuffle";
import { cn } from "@/lib/utils";

type Phase = "ask" | "feedback" | "done";

function optionPoints(questions: readonly MapQuestion[]): MapPoint[] {
  const seen = new Set<string>();
  const points: MapPoint[] = [];
  for (const question of questions) {
    for (const target of question.targets) {
      const key = `${target.x}:${target.y}`;
      if (seen.has(key)) continue;
      seen.add(key);
      points.push(target);
    }
  }
  return points;
}

function OptionCircle({ point }: { point: MapPoint }) {
  return (
    <span
      className="pointer-events-none absolute size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-black bg-white"
      style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%` }}
    />
  );
}

function Pin({ point, tone }: { point: MapPoint; tone: "ok" | "bad" }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white shadow-md",
        tone === "ok" ? "bg-teal-600" : "bg-red-600",
      )}
      style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%` }}
    />
  );
}

export function MapLocationSession({
  title,
  questions,
  markers,
  mode,
  scoreId,
  onExit,
}: {
  title: string;
  questions: MapQuestion[];
  markers: MapPoint[];
  mode: "study" | "exam";
  scoreId: AppId;
  onExit: () => void;
}) {
  const [queue, setQueue] = useState(() => shuffle(questions));
  const [phase, setPhase] = useState<Phase>("ask");
  const [correct, setCorrect] = useState(0);
  const [click, setClick] = useState<MapPoint | null>(null);
  const [lastOk, setLastOk] = useState(false);
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false);
  const missed = useRef(new Set<string>());
  const imageRef = useRef<HTMLImageElement>(null);
  const historyGuardActive = useRef(false);
  const skipPopState = useRef(false);
  const startedAt = useRef(0);

  const sessionTotal = questions.length;
  const examInProgress = mode === "exam" && phase !== "done";
  const current = queue[0];
  const cleared = sessionTotal - queue.length;

  function dropHistoryGuard() {
    if (!historyGuardActive.current) return;
    skipPopState.current = true;
    historyGuardActive.current = false;
    history.back();
  }

  useEffect(() => {
    if (startedAt.current === 0) startedAt.current = Date.now();
  }, []);

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

  function restart() {
    missed.current = new Set();
    startedAt.current = Date.now();
    setQueue(shuffle(questions));
    setPhase("ask");
    setCorrect(0);
    setClick(null);
    setLastOk(false);
  }

  function requestLeave() {
    if (phase === "done" || mode === "study") {
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

  function finish(nextCorrect: number) {
    if (mode === "exam") {
      writeBestScore(scoreId, {
        correct: nextCorrect,
        total: sessionTotal,
        durationMs: Date.now() - startedAt.current,
      });
    }
    setCorrect(nextCorrect);
    setQueue([]);
    setPhase("done");
  }

  function guess(point: MapPoint) {
    if (!current || phase !== "ask") return;
    const ok = isMapHit(point, current.targets, markers);
    const firstTry = !missed.current.has(current.id);
    setClick(point);
    setLastOk(ok);
    if (ok && firstTry) setCorrect((value) => value + 1);
    if (!ok) missed.current.add(current.id);
    setPhase("feedback");
  }

  function next() {
    if (!current) return;
    const rest = queue.slice(1);
    const repeat = mode === "study" && !lastOk;
    const upcoming = repeat ? [...rest, current] : rest;
    if (upcoming.length === 0) {
      finish(correct);
      return;
    }
    setQueue(upcoming);
    setClick(null);
    setPhase("ask");
  }

  function onMapClick(event: MouseEvent<HTMLDivElement>) {
    if (phase !== "ask") return;
    const image = imageRef.current;
    if (!image) return;
    const rect = image.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    if (x < 0 || y < 0 || x > 1 || y > 1) return;
    guess({ x, y });
  }

  const leaveDialog =
    mode === "exam" ? (
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
    ) : null;

  if (sessionTotal === 0) {
    return (
      <Shell title={title} onBack={onExit} wide>
        <p className="text-lg">{t(defaultLocale, "map.empty")}</p>
      </Shell>
    );
  }

  if (phase === "done" || !current) {
    return (
      <Shell title={title} onBack={onExit} wide>
        <RoundEnd correct={correct} total={sessionTotal} onAgain={restart} />
      </Shell>
    );
  }

  const options = optionPoints(questions);
  const answerPoint = click ? nearestMapPoint(click, current.targets) : null;
  const missPoint = click && !lastOk ? mapMissPoint(click, options) : null;
  const progressCurrent = cleared + 1;
  const frame = mapOptionFrame(options);

  return (
    <>
      <Shell title={title} onBack={requestLeave} wide>
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t(defaultLocale, mode === "study" ? "flashcards.modeStudy" : "flashcards.modeExam")}
        </p>
        <p className="mb-4 text-center text-sm text-muted-foreground">
          {t(defaultLocale, "session.progress", {
            current: Math.min(progressCurrent, sessionTotal),
            total: sessionTotal,
          })}
        </p>
        <div className="mb-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t(
              defaultLocale,
              current.kind === "comarca" ? "map.labelComarca" : "map.labelCapital",
            )}
          </p>
          <p className="mt-1 text-3xl font-semibold tracking-tight">{current.prompt}</p>
          <p className="mt-1 min-h-6 text-sm text-muted-foreground">
            {phase === "ask" ? t(defaultLocale, "map.clickHint") : null}
          </p>
        </div>
        <div
          onClick={onMapClick}
          className={cn(
            "relative overflow-hidden rounded-2xl bg-white ring-1 ring-border",
            phase === "ask" ? "cursor-crosshair" : "cursor-default",
          )}
          style={{ aspectRatio: `${CATALUNYA_MAP_WIDTH} / ${CATALUNYA_MAP_HEIGHT}` }}
        >
          <div
            className="absolute"
            style={{
              width: `${frame.scale * 100}%`,
              left: `${-frame.originX * frame.scale * 100}%`,
              top: `${-frame.originY * frame.scale * 100}%`,
            }}
          >
            <div className="relative">
              {/* Native img: click coordinates use this element's layout box. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imageRef}
                src={catalunyaMapSrc}
                alt=""
                draggable={false}
                className="pointer-events-none block h-auto w-full select-none"
              />
              {options.map((point) => (
                <OptionCircle key={`${point.x}:${point.y}`} point={point} />
              ))}
              {phase === "feedback" && missPoint ? <Pin point={missPoint} tone="bad" /> : null}
              {phase === "feedback" && answerPoint ? <Pin point={answerPoint} tone="ok" /> : null}
            </div>
          </div>
        </div>
        <p className="mt-3 min-h-7 text-center text-lg" aria-live="polite">
          {phase === "feedback" ? (
            lastOk ? (
              <span className="font-semibold text-teal-800 dark:text-teal-300">
                {t(defaultLocale, "session.correct")}
              </span>
            ) : (
              <span className="text-destructive">
                {t(defaultLocale, "session.incorrect")} {t(defaultLocale, "map.missed")}
              </span>
            )
          ) : null}
        </p>
        {phase === "feedback" ? (
          <button type="button" onClick={next} className={`${primaryButton} mt-3 gap-2`}>
            {t(defaultLocale, "actions.next")}
            <ArrowRight className="size-5 shrink-0" aria-hidden />
          </button>
        ) : null}
      </Shell>
      {leaveDialog}
    </>
  );
}
