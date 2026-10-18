"use client";

import { cn } from "@/lib/utils";

export function ProfileEmoji({
  emoji,
  size = "1.5rem",
  className,
}: {
  emoji: string;
  size?: string;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center leading-none", className)}
      aria-hidden
      style={{ fontSize: size }}
    >
      {emoji}
    </span>
  );
}
