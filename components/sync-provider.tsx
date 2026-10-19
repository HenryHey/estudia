"use client";

import { useEffect, type ReactNode } from "react";
import { hydrateSync } from "@/lib/sync-store";

export function SyncProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    void hydrateSync();
  }, []);

  return children;
}
