"use client";

import { useSyncExternalStore } from "react";

export const PROFILES_STORAGE_KEY = "estudia:profiles";
export const ACTIVE_PROFILE_STORAGE_KEY = "estudia:active-profile";

export const ANONYMOUS_PROFILE_ID = "anonymous";

/** Built-in profile used when no custom profile is selected. */
export const ANONYMOUS_EMOJI = "😴";

export type StoredProfile = {
  id: string;
  username: string;
  emoji: string;
};

export type Profile = StoredProfile & {
  isAnonymous: boolean;
};

const PROFILE_EVENT = "estudia-profile";

function subscribe(onStoreChange: () => void) {
  const notify = () => onStoreChange();
  window.addEventListener(PROFILE_EVENT, notify);
  window.addEventListener("storage", notify);
  return () => {
    window.removeEventListener(PROFILE_EVENT, notify);
    window.removeEventListener("storage", notify);
  };
}

function notifyProfiles() {
  window.dispatchEvent(new Event(PROFILE_EVENT));
}

function parseProfiles(raw: string | null): StoredProfile[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is StoredProfile => {
      if (!item || typeof item !== "object") return false;
      const row = item as Partial<StoredProfile>;
      return (
        typeof row.id === "string" &&
        row.id !== ANONYMOUS_PROFILE_ID &&
        typeof row.username === "string" &&
        row.username.trim().length > 0 &&
        typeof row.emoji === "string" &&
        row.emoji.length > 0
      );
    });
  } catch {
    return [];
  }
}

export function readStoredProfiles(): StoredProfile[] {
  if (typeof window === "undefined") return [];
  return parseProfiles(window.localStorage.getItem(PROFILES_STORAGE_KEY));
}

export function readActiveProfileId(): string {
  if (typeof window === "undefined") return ANONYMOUS_PROFILE_ID;

  try {
    const value = window.localStorage.getItem(ACTIVE_PROFILE_STORAGE_KEY);
    if (!value) return ANONYMOUS_PROFILE_ID;
    if (value === ANONYMOUS_PROFILE_ID) return ANONYMOUS_PROFILE_ID;
    const profiles = readStoredProfiles();
    if (profiles.some((p) => p.id === value)) return value;
  } catch {
    /* ignore */
  }

  return ANONYMOUS_PROFILE_ID;
}

export function profileFromStored(
  stored: StoredProfile,
  anonymousUsername: string,
): Profile {
  if (stored.id === ANONYMOUS_PROFILE_ID) {
    return {
      id: ANONYMOUS_PROFILE_ID,
      username: anonymousUsername,
      emoji: ANONYMOUS_EMOJI,
      isAnonymous: true,
    };
  }
  return { ...stored, isAnonymous: false };
}

export function anonymousProfile(anonymousUsername: string): Profile {
  return {
    id: ANONYMOUS_PROFILE_ID,
    username: anonymousUsername,
    emoji: ANONYMOUS_EMOJI,
    isAnonymous: true,
  };
}

export function readActiveProfile(anonymousUsername: string): Profile {
  const activeId = readActiveProfileId();
  if (activeId === ANONYMOUS_PROFILE_ID) {
    return anonymousProfile(anonymousUsername);
  }
  const stored = readStoredProfiles().find((p) => p.id === activeId);
  if (!stored) return anonymousProfile(anonymousUsername);
  return profileFromStored(stored, anonymousUsername);
}

export function setActiveProfileId(id: string) {
  if (id === ANONYMOUS_PROFILE_ID) {
    window.localStorage.setItem(ACTIVE_PROFILE_STORAGE_KEY, ANONYMOUS_PROFILE_ID);
    notifyProfiles();
    return;
  }

  const exists = readStoredProfiles().some((p) => p.id === id);
  if (!exists) return;

  window.localStorage.setItem(ACTIVE_PROFILE_STORAGE_KEY, id);
  notifyProfiles();
}

export function createProfile(username: string, emoji: string): StoredProfile | null {
  const trimmed = username.trim();
  if (!trimmed || !emoji) return null;

  const profile: StoredProfile = {
    id: crypto.randomUUID(),
    username: trimmed,
    emoji,
  };

  const next = [...readStoredProfiles(), profile];
  window.localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(next));
  window.localStorage.setItem(ACTIVE_PROFILE_STORAGE_KEY, profile.id);
  notifyProfiles();
  return profile;
}

export function updateProfile(id: string, username: string, emoji: string): boolean {
  if (id === ANONYMOUS_PROFILE_ID) return false;

  const trimmed = username.trim();
  if (!trimmed || !emoji) return false;

  const profiles = readStoredProfiles();
  const index = profiles.findIndex((p) => p.id === id);
  if (index === -1) return false;

  const next = [...profiles];
  next[index] = { ...next[index], username: trimmed, emoji };
  window.localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(next));
  notifyProfiles();
  return true;
}

export function deleteProfile(id: string) {
  if (id === ANONYMOUS_PROFILE_ID) return;

  const next = readStoredProfiles().filter((p) => p.id !== id);
  window.localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(next));

  if (readActiveProfileId() === id) {
    window.localStorage.setItem(ACTIVE_PROFILE_STORAGE_KEY, ANONYMOUS_PROFILE_ID);
  }

  notifyProfiles();
}

function readProfilesRaw(): string {
  if (typeof window === "undefined") return "[]";
  return window.localStorage.getItem(PROFILES_STORAGE_KEY) ?? "[]";
}

export function useStoredProfilesList(): StoredProfile[] {
  const raw = useSyncExternalStore(subscribe, readProfilesRaw, () => "[]");
  return parseProfiles(raw);
}

export function useActiveProfileId(): string {
  return useSyncExternalStore(
    subscribe,
    readActiveProfileId,
    () => ANONYMOUS_PROFILE_ID,
  );
}

/** Subscribe to profile changes (active user or profile list). */
export function subscribeProfiles(onChange: () => void): () => void {
  return subscribe(onChange);
}
