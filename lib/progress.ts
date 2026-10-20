"use client";

import type { ComarquesMapScoreId, ComarquesScoreId } from "@/content/comarques/ca";
import { readGameData, useGameData, writeGameData } from "@/lib/game-storage";

export type AppId = "mates" | ComarquesScoreId | ComarquesMapScoreId;

/** Score persisted in localStorage (last run or personal best, depending on writer). */
export type StoredScore = {
  correct: number;
  total: number;
  /** Elapsed time for the run; stored with personal bests in exam mode. */
  durationMs?: number;
};

/** @deprecated Use `StoredScore`. */
export type LastScore = StoredScore;

export function parseStoredScore(data: unknown): StoredScore | null {
  if (!data || typeof data !== "object") return null;

  const parsed = data as Partial<StoredScore>;
  if (
    typeof parsed.correct !== "number" ||
    typeof parsed.total !== "number" ||
    !Number.isFinite(parsed.correct) ||
    !Number.isFinite(parsed.total)
  ) {
    return null;
  }

  const score: StoredScore = { correct: parsed.correct, total: parsed.total };
  if (
    typeof parsed.durationMs === "number" &&
    Number.isFinite(parsed.durationMs) &&
    parsed.durationMs >= 0
  ) {
    score.durationMs = parsed.durationMs;
  }
  return score;
}

function parseScore(data: unknown): StoredScore | null {
  return parseStoredScore(data);
}

export function readScore(app: AppId): StoredScore | null {
  return parseScore(readGameData(app));
}

export function writeScore(app: AppId, score: StoredScore) {
  writeGameData(app, score);
}

function beatsStoredBest(prev: StoredScore, next: StoredScore) {
  if (next.correct !== prev.correct) return next.correct > prev.correct;
  if (next.total !== prev.total) return next.total > prev.total;
  const prevTime = prev.durationMs ?? Number.POSITIVE_INFINITY;
  const nextTime = next.durationMs ?? Number.POSITIVE_INFINITY;
  return nextTime < prevTime;
}

/** Persists only if this run beats the previous best (correct, then total). */
export function writeBestScore(app: AppId, score: StoredScore) {
  const prev = readScore(app);
  if (prev && !beatsStoredBest(prev, score)) return;
  writeScore(app, score);
}

export function useStoredScore(app: AppId): StoredScore | null {
  return parseScore(useGameData(app));
}

/** @deprecated Use `useStoredScore`. */
export function useLastScore(app: AppId): StoredScore | null {
  return useStoredScore(app);
}
