import type { StoredScore } from "@/lib/progress";

/** Minimum accuracy (inclusive) to show elapsed time on leaderboards. */
export const LEADERBOARD_TIME_MIN_ACCURACY = 0.8;

export function scoreAccuracy(score: StoredScore): number {
  if (score.total <= 0) return 0;
  return score.correct / score.total;
}

export function showLeaderboardTime(score: StoredScore): boolean {
  return (
    scoreAccuracy(score) >= LEADERBOARD_TIME_MIN_ACCURACY &&
    typeof score.durationMs === "number" &&
    Number.isFinite(score.durationMs) &&
    score.durationMs >= 0
  );
}

export function formatDurationMs(ms: number): string {
  const totalSeconds = Math.max(0, ms) / 1000;
  return `${totalSeconds.toFixed(2)} s`;
}
