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

export function anonymousProfile(anonymousUsername: string): Profile {
  return {
    id: ANONYMOUS_PROFILE_ID,
    username: anonymousUsername,
    emoji: ANONYMOUS_EMOJI,
    isAnonymous: true,
  };
}

export function profileFromStored(stored: StoredProfile, anonymousUsername: string): Profile {
  if (stored.id === ANONYMOUS_PROFILE_ID) {
    return anonymousProfile(anonymousUsername);
  }
  return { ...stored, isAnonymous: false };
}

export function parseStoredProfiles(raw: string | null): StoredProfile[] {
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
