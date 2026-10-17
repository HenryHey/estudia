"use client";

import { useSyncExternalStore } from "react";

export type AppId = "flashcards" | "mates";

export type LastScore = {
  correct: number;
  total: number;
};

function storageKey(app: AppId) {
  return `estudia:${app}`;
}

function subscribe() {
  return () => {};
}

function parseScore(raw: string | null): LastScore | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<LastScore>;
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

export function readScore(app: AppId): LastScore | null {
  if (typeof window === "undefined") return null;
  return parseScore(window.localStorage.getItem(storageKey(app)));
}

export function writeScore(app: AppId, score: LastScore) {
  window.localStorage.setItem(storageKey(app), JSON.stringify(score));
}

export function useLastScore(app: AppId): LastScore | null {
  const raw = useSyncExternalStore(
    subscribe,
    () => window.localStorage.getItem(storageKey(app)),
    () => null,
  );
  return parseScore(raw);
}
