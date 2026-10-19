"use client";

import { useSyncExternalStore } from "react";
import {
  ANONYMOUS_EMOJI,
  ANONYMOUS_PROFILE_ID,
  anonymousProfile as buildAnonymousProfile,
  parseStoredProfiles,
  profileFromStored as mapProfileFromStored,
  type Profile,
  type StoredProfile,
} from "@/lib/profile-model";
import {
  clearProfileGames,
  getSyncState,
  subscribeSync,
  updateSyncState,
} from "@/lib/sync-store";

export {
  ANONYMOUS_EMOJI,
  ANONYMOUS_PROFILE_ID,
  PROFILES_STORAGE_KEY,
  ACTIVE_PROFILE_STORAGE_KEY,
  type Profile,
  type StoredProfile,
} from "@/lib/profile-model";

const PROFILE_EVENT = "estudia-profile";

function subscribe(onStoreChange: () => void) {
  const notify = () => onStoreChange();
  window.addEventListener(PROFILE_EVENT, notify);
  const unsubSync = subscribeSync(notify);
  return () => {
    window.removeEventListener(PROFILE_EVENT, notify);
    unsubSync();
  };
}

function notifyProfiles() {
  window.dispatchEvent(new Event(PROFILE_EVENT));
}

export function profileFromStored(stored: StoredProfile, anonymousUsername: string): Profile {
  return mapProfileFromStored(stored, anonymousUsername);
}

export function anonymousProfile(anonymousUsername: string): Profile {
  return buildAnonymousProfile(anonymousUsername);
}

export function readStoredProfiles(): StoredProfile[] {
  if (typeof window === "undefined") return [];
  return getSyncState().profiles;
}

export function readActiveProfileId(): string {
  if (typeof window === "undefined") return ANONYMOUS_PROFILE_ID;
  return getSyncState().activeProfileId;
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
    updateSyncState((draft) => {
      draft.activeProfileId = ANONYMOUS_PROFILE_ID;
    });
    notifyProfiles();
    return;
  }

  const exists = readStoredProfiles().some((p) => p.id === id);
  if (!exists) return;

  updateSyncState((draft) => {
    draft.activeProfileId = id;
  });
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

  updateSyncState((draft) => {
    draft.profiles = [...draft.profiles, profile];
    draft.activeProfileId = profile.id;
  });
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

  updateSyncState((draft) => {
    const i = draft.profiles.findIndex((p) => p.id === id);
    if (i === -1) return;
    draft.profiles[i] = { ...draft.profiles[i], username: trimmed, emoji };
  });
  notifyProfiles();
  return true;
}

export function deleteProfile(id: string) {
  if (id === ANONYMOUS_PROFILE_ID) return;

  updateSyncState((draft) => {
    draft.profiles = draft.profiles.filter((p) => p.id !== id);
    if (draft.activeProfileId === id) {
      draft.activeProfileId = ANONYMOUS_PROFILE_ID;
    }
  });

  clearProfileGames(id);
  notifyProfiles();
}

function readProfilesRaw(): string {
  if (typeof window === "undefined") return "[]";
  return JSON.stringify(getSyncState().profiles);
}

export function useStoredProfilesList(): StoredProfile[] {
  const raw = useSyncExternalStore(subscribe, readProfilesRaw, () => "[]");
  return parseStoredProfiles(raw);
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
