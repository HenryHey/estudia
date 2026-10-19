"use client";

import { useSyncExternalStore } from "react";
import { readActiveProfileId, subscribeProfiles } from "@/lib/profile";
import {
  gameStorageKey,
  readGamePayload,
  subscribeSync,
  writeGamePayload,
} from "@/lib/sync-store";

export { gameStorageKey };

const PROGRESS_EVENT = "estudia-progress";

function subscribe(onStoreChange: () => void) {
  const notify = () => onStoreChange();
  window.addEventListener(PROGRESS_EVENT, notify);
  const unsubProfile = subscribeProfiles(notify);
  const unsubSync = subscribeSync(notify);
  return () => {
    window.removeEventListener(PROGRESS_EVENT, notify);
    unsubProfile();
    unsubSync();
  };
}

function notifyGameStorage() {
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

export function readGameData<T>(gameId: string, profileId?: string): T | null {
  if (typeof window === "undefined") return null;

  const pid = profileId ?? readActiveProfileId();
  return readGamePayload<T>(pid, gameId);
}

export function writeGameData<T>(gameId: string, data: T, profileId?: string) {
  const pid = profileId ?? readActiveProfileId();
  writeGamePayload(pid, gameId, data);
  notifyGameStorage();
}

export function useGameData<T>(gameId: string): T | null {
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      const pid = readActiveProfileId();
      const data = readGamePayload<unknown>(pid, gameId);
      return data === null ? "" : JSON.stringify(data);
    },
    () => "",
  );

  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
