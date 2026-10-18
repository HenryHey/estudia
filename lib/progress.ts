"use client";

import type { ComarquesScoreId } from "@/content/comarques/ca";
import { readGameData, useGameData, writeGameData } from "@/lib/game-storage";

export type AppId = "mates" | ComarquesScoreId;

/** Score persisted in localStorage (last run or personal best, depending on writer). */
export type StoredScore = {
  correct: number;
  total: number;
};

/** @deprecated Use `StoredScore`. */
export type LastScore = StoredScore;

function parseScore(data: unknown): StoredScore | null {
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
  return { correct: parsed.correct, total: parsed.total };
}

export function readScore(app: AppId): StoredScore | null {
  return parseScore(readGameData(app));
}

export function writeScore(app: AppId, score: StoredScore) {
  writeGameData(app, score);
}

function beatsStoredBest(prev: StoredScore, next: StoredScore) {
  if (next.correct !== prev.correct) return next.correct > prev.correct;
  return next.total > prev.total;
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
