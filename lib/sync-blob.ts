import { get, put } from "@vercel/blob";

import { parseSyncState, type EstudiaSyncState } from "@/lib/sync-state";
import { isValidSyncId } from "@/lib/sync-id-core";

export function syncBlobPathname(syncId: string): string {
  return `profiles/${syncId}.json`;
}

export type ReadSyncBlobResult =
  | { kind: "missing" }
  | { kind: "invalid" }
  | { kind: "ok"; state: EstudiaSyncState; etag: string };

export async function readSyncBlob(syncId: string): Promise<ReadSyncBlobResult> {
  if (!isValidSyncId(syncId)) return { kind: "missing" };

  const pathname = syncBlobPathname(syncId);
  const result = await get(pathname, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200 || !result.stream) return { kind: "missing" };

  const text = await new Response(result.stream).text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { kind: "invalid" };
  }

  const state = parseSyncState(parsed);
  if (!state) return { kind: "invalid" };

  return { kind: "ok", state, etag: result.blob.etag };
}

export async function writeSyncBlob(syncId: string, state: EstudiaSyncState): Promise<string> {
  if (!isValidSyncId(syncId)) {
    throw new Error("Invalid sync id");
  }

  const body = JSON.stringify(state);
  const result = await put(syncBlobPathname(syncId), body, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });

  return result.etag;
}
