import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function HubIcon({
  icon: Icon,
  className,
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid size-12 place-items-center rounded-2xl text-white",
        className,
      )}
      aria-hidden
    >
      <Icon className="size-6" strokeWidth={2} />
    </span>
  );
}
