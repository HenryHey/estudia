import {
  ANONYMOUS_PROFILE_ID,
  parseStoredProfiles,
  type StoredProfile,
} from "@/lib/profile-model";

export const SYNC_STATE_VERSION = 1 as const;

export type EstudiaSyncState = {
  version: typeof SYNC_STATE_VERSION;
  profiles: StoredProfile[];
  activeProfileId: string;
  /** profileId → gameId → saved payload */
  games: Record<string, Record<string, unknown>>;
};

export function emptySyncState(): EstudiaSyncState {
  return {
    version: SYNC_STATE_VERSION,
    profiles: [],
    activeProfileId: ANONYMOUS_PROFILE_ID,
    games: {},
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

export function parseSyncState(raw: unknown): EstudiaSyncState | null {
  if (!isRecord(raw)) return null;
  if (raw.version !== SYNC_STATE_VERSION) return null;

  const profiles = parseStoredProfiles(JSON.stringify(raw.profiles ?? []));
  let activeProfileId =
    typeof raw.activeProfileId === "string" ? raw.activeProfileId : ANONYMOUS_PROFILE_ID;

  if (activeProfileId !== ANONYMOUS_PROFILE_ID && !profiles.some((p) => p.id === activeProfileId)) {
    activeProfileId = ANONYMOUS_PROFILE_ID;
  }

  const games: Record<string, Record<string, unknown>> = {};
  if (isRecord(raw.games)) {
    for (const [profileId, gameMap] of Object.entries(raw.games)) {
      if (!isRecord(gameMap)) continue;
      games[profileId] = { ...gameMap };
    }
  }

  return {
    version: SYNC_STATE_VERSION,
    profiles,
    activeProfileId,
    games,
  };
}
