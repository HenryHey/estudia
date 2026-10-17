import Link from "next/link";
import type { ReactNode } from "react";

const backLinkClass =
  "inline-flex h-12 items-center rounded-2xl px-0 text-base font-semibold text-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800";

export function SubjectHub({
  back,
  title,
  subtitle,
  children,
}: {
  back?: { href: string; label: string };
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-10 sm:py-16">
      <header className="mb-8">
        {back ? (
          <Link href={back.href} className={backLinkClass}>
            {back.label}
          </Link>
        ) : null}
        <h1
          className={`text-4xl font-semibold tracking-tight sm:text-5xl${back ? " mt-2" : ""}`}
        >
          {title}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-muted">{subtitle}</p>
      </header>
      <main>{children}</main>
    </div>
  );
}

export const hubCardLinkClass =
  "flex min-h-44 flex-col justify-between rounded-3xl bg-card p-5 shadow-sm ring-1 ring-line transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800";

export const hubCardLinkClassTall =
  "flex min-h-56 flex-col justify-between rounded-3xl bg-card p-5 shadow-sm ring-1 ring-line transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800";
