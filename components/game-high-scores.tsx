"use client";

import { CircleHelp } from "lucide-react";
import { ProfileEmoji } from "@/components/profile-emoji";
import { useHighScores } from "@/lib/high-scores";
import { defaultLocale, t } from "@/lib/i18n";
import type { AppId } from "@/lib/progress";
import { useActiveProfileId } from "@/lib/profile";
import {
  formatDurationMs,
  LEADERBOARD_TIME_MIN_ACCURACY,
  showLeaderboardTime,
} from "@/lib/score-display";
import { cn } from "@/lib/utils";

function LeaderboardTimeColumnHint({ message }: { message: string }) {
  return (
    <span className="group/hint relative inline-flex items-center">
      <button
        type="button"
        className="rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        aria-label={message}
      >
        <CircleHelp className="size-3.5 shrink-0" aria-hidden />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute top-full right-0 z-10 mt-1 hidden w-max max-w-[14rem] rounded-md bg-popover px-2 py-1.5 text-left text-xs font-normal normal-case tracking-normal text-popover-foreground shadow-md ring-1 ring-border group-focus-within/hint:block group-hover/hint:block"
      >
        {message}
      </span>
    </span>
  );
}

export function GameHighScores({
  gameId,
  className,
}: {
  gameId: AppId;
  className?: string;
}) {
  const anonymousUsername = t(defaultLocale, "profile.anonymous");
  const entries = useHighScores(gameId);
  const activeProfileId = useActiveProfileId();
  const timeColumnHint = t(defaultLocale, "highScores.timeColumnHint", {
    minPercent: Math.round(LEADERBOARD_TIME_MIN_ACCURACY * 100),
  });

  return (
    <section className={cn("mt-8", className)} aria-labelledby="high-scores-heading">
      <h2
        id="high-scores-heading"
        className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
      >
        {t(defaultLocale, "highScores.title")}
      </h2>
      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t(defaultLocale, "highScores.empty")}
        </p>
      ) : (
        <div className="rounded-2xl bg-card ring-1 ring-border">
          <div className="grid grid-cols-[1.5rem_1.35rem_minmax(0,1fr)_5.5rem_5rem] items-center gap-x-3 border-b border-border py-2 pl-4 pr-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <span />
            <span />
            <span />
            <span className="text-right">{t(defaultLocale, "highScores.columnCorrect")}</span>
            <span className="inline-flex items-center justify-end gap-2 text-right">
              {t(defaultLocale, "highScores.columnTime")}
              <LeaderboardTimeColumnHint message={timeColumnHint} />
            </span>
          </div>
          <ol className="divide-y divide-border">
            {entries.map((entry, index) => {
              const showTime = showLeaderboardTime(entry.score);

              return (
                <li
                  key={entry.profileId}
                  className={cn(
                    "grid grid-cols-[1.5rem_1.35rem_minmax(0,1fr)_5.5rem_5rem] items-center gap-x-3 py-3 pl-4 pr-6 text-sm",
                    entry.profileId === activeProfileId && "bg-muted/40",
                  )}
                >
                  <span className="tabular-nums text-muted-foreground">{index + 1}</span>
                  <ProfileEmoji emoji={entry.emoji} size="1.35rem" />
                  <span className="min-w-0 truncate font-medium">
                    {entry.isAnonymous ? anonymousUsername : entry.username}
                  </span>
                  <span className="text-right tabular-nums text-muted-foreground">
                    {t(defaultLocale, "highScores.entry", {
                      correct: entry.score.correct,
                      total: entry.score.total,
                    })}
                  </span>
                  <span className="text-right tabular-nums text-muted-foreground">
                    {showTime ? formatDurationMs(entry.score.durationMs!) : "-"}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </section>
  );
}
