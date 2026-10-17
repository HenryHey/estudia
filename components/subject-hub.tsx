import { ChevronLeft, Home } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { navButtonClassName } from "@/components/app-ui";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const backLinkClass = cn(
  navButtonClassName,
  "inline-flex items-center gap-1.5 px-0 text-primary hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
);

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
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {back ? (
              <Link href={back.href} className={backLinkClass}>
                {back.href === "/" ? (
                  <Home className="size-5 shrink-0" aria-hidden />
                ) : (
                  <ChevronLeft className="size-5 shrink-0" aria-hidden />
                )}
                {back.label}
              </Link>
            ) : null}
            <h1
              className={`text-4xl font-semibold tracking-tight sm:text-5xl${back ? " mt-2" : ""}`}
            >
              {title}
            </h1>
            <p className="mt-3 max-w-xl text-lg text-muted-foreground">{subtitle}</p>
          </div>
          <ThemeToggle className="shrink-0" />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

export const hubCardLinkClass =
  "flex min-h-44 flex-col justify-between rounded-3xl bg-card p-5 shadow-sm ring-1 ring-border transition-transform hover:-translate-y-0.5 hover:bg-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export const hubCardLinkClassTall =
  "flex min-h-56 flex-col justify-between rounded-3xl bg-card p-5 shadow-sm ring-1 ring-border transition-transform hover:-translate-y-0.5 hover:bg-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
