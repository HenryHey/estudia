"use client";

import { SYNC_ID_PARAM, SYNC_ID_STORAGE_KEY, isValidSyncId } from "@/lib/sync-id-core";

export { isValidSyncId, SYNC_ID_PARAM, SYNC_ID_STORAGE_KEY };

export function readSyncId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(SYNC_ID_STORAGE_KEY);
    if (value && isValidSyncId(value)) return value;
  } catch {
    /* ignore */
  }
  return null;
}

export function writeSyncId(syncId: string) {
  if (!isValidSyncId(syncId)) return;
  window.localStorage.setItem(SYNC_ID_STORAGE_KEY, syncId);
}

export function ensureSyncId(): string {
  const existing = readSyncId();
  if (existing) return existing;

  const syncId = crypto.randomUUID();
  writeSyncId(syncId);
  return syncId;
}

/** Applies `?sync=<uuid>` from the URL, then removes the query param. */
export function adoptSyncIdFromUrl(): string | null {
  if (typeof window === "undefined") return null;

  const url = new URL(window.location.href);
  const fromUrl = url.searchParams.get(SYNC_ID_PARAM);
  if (!fromUrl || !isValidSyncId(fromUrl)) return null;

  writeSyncId(fromUrl);
  url.searchParams.delete(SYNC_ID_PARAM);
  const next = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState(null, "", next);
  return fromUrl;
}

export function buildShareUrl(syncId: string): string {
  if (typeof window === "undefined") return `/?${SYNC_ID_PARAM}=${syncId}`;
  const url = new URL(window.location.origin);
  url.searchParams.set(SYNC_ID_PARAM, syncId);
  return url.toString();
}
