export const SYNC_ID_PARAM = "sync";
export const SYNC_ID_STORAGE_KEY = "estudia:sync-id";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidSyncId(value: string): boolean {
  return UUID_RE.test(value);
}
