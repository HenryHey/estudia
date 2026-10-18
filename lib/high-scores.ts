"use client";

import { useMemo, useSyncExternalStore } from "react";
import { readGameData } from "@/lib/game-storage";
import {
  ANONYMOUS_EMOJI,
  ANONYMOUS_PROFILE_ID,
  readStoredProfiles,
  subscribeProfiles,
} from "@/lib/profile";
import { parseStoredScore, type AppId, type StoredScore } from "@/lib/progress";

export type HighScoreEntry = {
  profileId: string;
  username: string;
  emoji: string;
  isAnonymous: boolean;
  score: StoredScore;
};

const PROGRESS_EVENT = "estudia-progress";

function subscribe(onStoreChange: () => void) {
  const notify = () => onStoreChange();
  window.addEventListener(PROGRESS_EVENT, notify);
  window.addEventListener("storage", notify);
  const unsubProfile = subscribeProfiles(notify);
  return () => {
    window.removeEventListener(PROGRESS_EVENT, notify);
    window.removeEventListener("storage", notify);
    unsubProfile();
  };
}

function compareScores(a: StoredScore, b: StoredScore): number {
  if (b.correct !== a.correct) return b.correct - a.correct;
  if (b.total !== a.total) return b.total - a.total;
  const timeA = a.durationMs ?? Number.POSITIVE_INFINITY;
  const timeB = b.durationMs ?? Number.POSITIVE_INFINITY;
  return timeA - timeB;
}

export function readHighScores(gameId: AppId): HighScoreEntry[] {
  if (typeof window === "undefined") return [];

  const entries: HighScoreEntry[] = [];

  const anonScore = parseStoredScore(readGameData(gameId, ANONYMOUS_PROFILE_ID));
  if (anonScore) {
    entries.push({
      profileId: ANONYMOUS_PROFILE_ID,
      username: "",
      emoji: ANONYMOUS_EMOJI,
      isAnonymous: true,
      score: anonScore,
    });
  }

  for (const profile of readStoredProfiles()) {
    const score = parseStoredScore(readGameData(gameId, profile.id));
    if (!score) continue;
    entries.push({
      profileId: profile.id,
      username: profile.username,
      emoji: profile.emoji,
      isAnonymous: false,
      score,
    });
  }

  entries.sort((a, b) => {
    const byScore = compareScores(a.score, b.score);
    if (byScore !== 0) return byScore;
    return a.profileId.localeCompare(b.profileId);
  });
  return entries;
}

const EMPTY_HIGH_SCORES_SNAPSHOT = "[]";

function highScoresSnapshot(gameId: AppId): string {
  return JSON.stringify(readHighScores(gameId));
}

export function useHighScores(gameId: AppId): HighScoreEntry[] {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => highScoresSnapshot(gameId),
    () => EMPTY_HIGH_SCORES_SNAPSHOT,
  );

  return useMemo(() => {
    try {
      const parsed = JSON.parse(snapshot) as HighScoreEntry[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [snapshot]);
}
