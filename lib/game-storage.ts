"use client";

import { useSyncExternalStore } from "react";
import {
  ANONYMOUS_PROFILE_ID,
  readActiveProfileId,
  subscribeProfiles,
} from "@/lib/profile";

const PROGRESS_EVENT = "estudia-progress";

/** Legacy key before profiles (migrated into the anonymous profile). */
function legacyStorageKey(gameId: string) {
  return `estudia:${gameId}`;
}

/** Per-profile game payload keyed by game id in localStorage. */
export function gameStorageKey(profileId: string, gameId: string) {
  return `estudia:${profileId}:game:${gameId}`;
}

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

function notifyGameStorage() {
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

function migrateLegacyGameData(gameId: string) {
  const legacy = window.localStorage.getItem(legacyStorageKey(gameId));
  if (!legacy) return;

  const target = gameStorageKey(ANONYMOUS_PROFILE_ID, gameId);
  if (!window.localStorage.getItem(target)) {
    window.localStorage.setItem(target, legacy);
  }
  window.localStorage.removeItem(legacyStorageKey(gameId));
}

export function readGameData<T>(gameId: string, profileId?: string): T | null {
  if (typeof window === "undefined") return null;

  migrateLegacyGameData(gameId);

  const pid = profileId ?? readActiveProfileId();
  const raw = window.localStorage.getItem(gameStorageKey(pid, gameId));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeGameData<T>(gameId: string, data: T, profileId?: string) {
  const pid = profileId ?? readActiveProfileId();
  window.localStorage.setItem(gameStorageKey(pid, gameId), JSON.stringify(data));
  notifyGameStorage();
}

export function useGameData<T>(gameId: string): T | null {
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      migrateLegacyGameData(gameId);
      const pid = readActiveProfileId();
      return window.localStorage.getItem(gameStorageKey(pid, gameId));
    },
    () => null,
  );

  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
