"use client";

import { useEffect, useState } from "react";
import { makeProblems, type Problem } from "@/content/mates/ca";
import { RoundEnd, Shell } from "@/components/shell";
import { primaryButton } from "@/components/ui";
import { defaultLocale, t } from "@/lib/i18n";
import { writeScore } from "@/lib/progress";

type Session = {
  problems: Problem[];
  index: number;
  correct: number;
  draft: string;
  status: "answering" | "feedback" | "done";
  lastOk: boolean;
};

function createSession(): Session {
  return {
    problems: makeProblems(),
    index: 0,
    correct: 0,
    draft: "",
    status: "answering",
    lastOk: false,
  };
}

export default function TaulesPage() {
  const title = t(defaultLocale, "topics.timesTables.title");
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(createSession());
  }, []);

  if (!session) {
    return (
      <Shell title={title} backHref="/mates">
        <div className="min-h-64 rounded-3xl bg-card ring-1 ring-line" />
      </Shell>
    );
  }

  const round = session;

  if (round.status === "done") {
    return (
      <Shell title={title} backHref="/mates">
        <RoundEnd
          correct={round.correct}
          total={round.problems.length}
          onAgain={() => setSession(createSession())}
        />
      </Shell>
    );
  }

  const problem = round.problems[round.index];
  if (!problem) return null;

  const draftIsNumber = /^\d+$/.test(round.draft);

  function check() {
    if (!draftIsNumber) return;
    const lastOk = Number(round.draft) === problem.answer;
    setSession({
      ...round,
      status: "feedback",
      lastOk,
      correct: round.correct + (lastOk ? 1 : 0),
    });
  }

  function next() {
    const nextIndex = round.index + 1;
    if (nextIndex >= round.problems.length) {
      writeScore("mates", {
        correct: round.correct,
        total: round.problems.length,
      });
      setSession({ ...round, status: "done" });
      return;
    }
    setSession({
      ...round,
      index: nextIndex,
      draft: "",
      status: "answering",
      lastOk: false,
    });
  }

  return (
    <Shell title={title} backHref="/mates">
      <p className="mb-6 text-center text-sm text-muted">
        {t(defaultLocale, "session.progress", {
          current: round.index + 1,
          total: round.problems.length,
        })}
      </p>
      <div className="flex flex-1 flex-col items-center justify-center rounded-3xl bg-card px-6 py-10 ring-1 ring-line">
        <p className="text-5xl font-semibold tabular-nums">
          {problem.left} {problem.symbol} {problem.right}
        </p>
        <label className="mt-8 flex items-center gap-3 text-4xl font-semibold" htmlFor="answer">
          <span aria-hidden="true">=</span>
          <span className="sr-only">{t(defaultLocale, "mates.answerLabel")}</span>
          <input
            id="answer"
            inputMode="numeric"
            autoComplete="off"
            value={round.draft}
            disabled={round.status === "feedback"}
            onChange={(event) =>
              setSession({ ...round, draft: event.target.value.replace(/\D/g, "") })
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") check();
            }}
            className="h-16 w-28 rounded-2xl bg-background text-center ring-1 ring-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800 disabled:opacity-70"
          />
        </label>
        <p className="mt-6 min-h-14 text-center text-lg" aria-live="polite">
          {round.status === "feedback" ? (
            round.lastOk ? (
              t(defaultLocale, "session.correct")
            ) : (
              <>
                {t(defaultLocale, "session.incorrect")}{" "}
                {t(defaultLocale, "session.answerIs", { answer: problem.answer })}
              </>
            )
          ) : null}
        </p>
      </div>
      <div className="mt-4">
        {round.status === "answering" ? (
          <button type="button" onClick={check} disabled={!draftIsNumber} className={primaryButton}>
            {t(defaultLocale, "actions.check")}
          </button>
        ) : (
          <button type="button" onClick={next} className={primaryButton}>
            {t(defaultLocale, "actions.next")}
          </button>
        )}
      </div>
    </Shell>
  );
}
