"use client";

import {
  ACTIVE_PROFILE_STORAGE_KEY,
  ANONYMOUS_PROFILE_ID,
  parseStoredProfiles,
  PROFILES_STORAGE_KEY,
} from "@/lib/profile-model";
import { SYNC_ID_STORAGE_KEY } from "@/lib/sync-id-core";
import { adoptSyncIdFromUrl, ensureSyncId } from "@/lib/sync-id";
import { emptySyncState, parseSyncState, type EstudiaSyncState } from "@/lib/sync-state";

const SYNC_EVENT = "estudia-sync";
const PROFILE_EVENT = "estudia-profile";
const PROGRESS_EVENT = "estudia-progress";

const FLUSH_DELAY_MS = 400;

let state: EstudiaSyncState = emptySyncState();
let hydrated = false;
let hydratePromise: Promise<void> | null = null;
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let flushInFlight: Promise<void> | null = null;

export function gameStorageKey(profileId: string, gameId: string) {
  return `estudia:${profileId}:game:${gameId}`;
}

function notifySync() {
  window.dispatchEvent(new Event(SYNC_EVENT));
  window.dispatchEvent(new Event(PROFILE_EVENT));
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

export function getSyncState(): EstudiaSyncState {
  return state;
}

export function isSyncHydrated(): boolean {
  return hydrated;
}

export function subscribeSync(onStoreChange: () => void): () => void {
  const notify = () => onStoreChange();
  window.addEventListener(SYNC_EVENT, notify);
  window.addEventListener("storage", notify);
  return () => {
    window.removeEventListener(SYNC_EVENT, notify);
    window.removeEventListener("storage", notify);
  };
}

export function updateSyncState(mutator: (draft: EstudiaSyncState) => void) {
  const next = structuredClone(state);
  mutator(next);
  state = next;
  notifySync();
  scheduleFlush();
}

function collectLegacyBareGameKeys(targetState: EstudiaSyncState) {
  const reserved = new Set([
    PROFILES_STORAGE_KEY,
    ACTIVE_PROFILE_STORAGE_KEY,
    "estudia:sync-id",
    "estudia-theme",
  ]);

  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (!key?.startsWith("estudia:") || reserved.has(key) || key.includes(":game:")) continue;

    const gameId = key.slice("estudia:".length);
    if (!gameId) continue;

    const raw = window.localStorage.getItem(key);
    if (!raw) continue;

    try {
      const profileGames = targetState.games[ANONYMOUS_PROFILE_ID] ?? {};
      if (profileGames[gameId] === undefined) {
        profileGames[gameId] = JSON.parse(raw) as unknown;
      }
      targetState.games[ANONYMOUS_PROFILE_ID] = profileGames;
    } catch {
      /* ignore */
    }
  }
}

function collectGamesFromLocalStorage(targetState: EstudiaSyncState) {
  const prefix = "estudia:";
  const gameMarker = ":game:";

  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (!key?.startsWith(prefix) || !key.includes(gameMarker)) continue;

    const rest = key.slice(prefix.length);
    const split = rest.split(gameMarker);
    if (split.length !== 2) continue;

    const [profileId, gameId] = split;
    if (!profileId || !gameId) continue;

    const raw = window.localStorage.getItem(key);
    if (!raw) continue;

    try {
      const profileGames = targetState.games[profileId] ?? {};
      if (profileGames[gameId] === undefined) {
        profileGames[gameId] = JSON.parse(raw) as unknown;
      }
      targetState.games[profileId] = profileGames;
    } catch {
      /* ignore */
    }
  }
}

function buildStateFromLocalStorage(): EstudiaSyncState {
  const profiles = parseStoredProfiles(window.localStorage.getItem(PROFILES_STORAGE_KEY));
  let activeProfileId = window.localStorage.getItem(ACTIVE_PROFILE_STORAGE_KEY) ?? ANONYMOUS_PROFILE_ID;

  if (
    activeProfileId !== ANONYMOUS_PROFILE_ID &&
    !profiles.some((p) => p.id === activeProfileId)
  ) {
    activeProfileId = ANONYMOUS_PROFILE_ID;
  }

  const next = emptySyncState();
  next.profiles = profiles;
  next.activeProfileId = activeProfileId;
  collectGamesFromLocalStorage(next);
  collectLegacyBareGameKeys(next);

  return next;
}

function clearLegacyProfileStorage() {
  window.localStorage.removeItem(PROFILES_STORAGE_KEY);
  window.localStorage.removeItem(ACTIVE_PROFILE_STORAGE_KEY);

  const reserved = new Set([
    PROFILES_STORAGE_KEY,
    ACTIVE_PROFILE_STORAGE_KEY,
    SYNC_ID_STORAGE_KEY,
    "estudia-theme",
  ]);
  const keysToRemove: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (!key?.startsWith("estudia:") || reserved.has(key)) continue;
    keysToRemove.push(key);
  }
  for (const key of keysToRemove) {
    window.localStorage.removeItem(key);
  }
}

function hasLocalSyncData(snapshot: EstudiaSyncState): boolean {
  if (snapshot.profiles.length > 0) return true;
  for (const gameMap of Object.values(snapshot.games)) {
    if (Object.keys(gameMap).length > 0) return true;
  }
  return false;
}

function scheduleFlush() {
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flushToRemote();
  }, FLUSH_DELAY_MS);
}

async function flushToRemote() {
  if (flushInFlight) {
    await flushInFlight;
    return flushToRemote();
  }

  const syncId = ensureSyncId();
  flushInFlight = (async () => {
    try {
      const res = await fetch("/api/sync", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ syncId, state }),
      });
      if (!res.ok) {
        console.warn("[estudia sync] upload failed", res.status);
      }
    } catch {
      /* retry on next change */
    }
  })();

  try {
    await flushInFlight;
  } finally {
    flushInFlight = null;
  }
}

export async function hydrateSync(): Promise<void> {
  if (hydratePromise) return hydratePromise;
  hydratePromise = doHydrate();
  return hydratePromise;
}

async function doHydrate() {
  if (typeof window === "undefined") return;

  adoptSyncIdFromUrl();
  const syncId = ensureSyncId();

  state = buildStateFromLocalStorage();
  notifySync();

  try {
    const res = await fetch(`/api/sync?syncId=${encodeURIComponent(syncId)}`);
    if (!res.ok) {
      console.warn("[estudia sync] download failed", res.status);
    } else {
      const payload = (await res.json()) as { found?: boolean; state?: unknown };
      if (payload.found === false) {
        if (hasLocalSyncData(state)) {
          clearLegacyProfileStorage();
          await flushToRemote();
        }
      } else {
        const parsed = parseSyncState(payload.state);
        if (parsed) {
          state = parsed;
          clearLegacyProfileStorage();
          notifySync();
        }
      }
    }
  } catch {
    /* stay on local snapshot */
  } finally {
    hydrated = true;
    notifySync();
  }
}

export function readGamePayload<T>(profileId: string, gameId: string): T | null {
  const raw = state.games[profileId]?.[gameId];
  if (raw === undefined) return null;
  return raw as T;
}

export function writeGamePayload<T>(profileId: string, gameId: string, data: T) {
  updateSyncState((draft) => {
    const profileGames = draft.games[profileId] ?? {};
    profileGames[gameId] = data as unknown;
    draft.games[profileId] = profileGames;
  });
}

export function clearProfileGames(profileId: string) {
  updateSyncState((draft) => {
    delete draft.games[profileId];
  });
}

if (typeof window !== "undefined") {
  state = buildStateFromLocalStorage();
}
