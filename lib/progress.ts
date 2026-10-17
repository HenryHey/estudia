"use client";

import { useSyncExternalStore } from "react";
import type { ComarquesScoreId } from "@/content/comarques/ca";

export type AppId = "mates" | ComarquesScoreId;

/** Score persisted in localStorage (last run or personal best, depending on writer). */
export type StoredScore = {
  correct: number;
  total: number;
};

function storageKey(app: AppId) {
  return `estudia:${app}`;
}

const PROGRESS_EVENT = "estudia-progress";

function subscribe(onStoreChange: () => void) {
  const notify = () => onStoreChange();
  window.addEventListener(PROGRESS_EVENT, notify);
  window.addEventListener("storage", notify);
  return () => {
    window.removeEventListener(PROGRESS_EVENT, notify);
    window.removeEventListener("storage", notify);
  };
}

function notifyProgress() {
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

/** @deprecated Use `StoredScore`. */
export type LastScore = StoredScore;

function parseScore(raw: string | null): StoredScore | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<StoredScore>;
    if (
      typeof parsed.correct !== "number" ||
      typeof parsed.total !== "number" ||
      !Number.isFinite(parsed.correct) ||
      !Number.isFinite(parsed.total)
    ) {
      return null;
    }
    return { correct: parsed.correct, total: parsed.total };
  } catch {
    return null;
  }
}

export function readScore(app: AppId): StoredScore | null {
  if (typeof window === "undefined") return null;
  return parseScore(window.localStorage.getItem(storageKey(app)));
}

export function writeScore(app: AppId, score: StoredScore) {
  window.localStorage.setItem(storageKey(app), JSON.stringify(score));
  notifyProgress();
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
  const raw = useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(storageKey(app)),
    () => null,
  );
  return parseScore(raw);
}

/** @deprecated Use `useStoredScore`. */
export function useLastScore(app: AppId): StoredScore | null {
  return useStoredScore(app);
}
