import { NextResponse } from "next/server";

import { readSyncBlob, writeSyncBlob } from "@/lib/sync-blob";
import { isValidSyncId } from "@/lib/sync-id-core";
import { emptySyncState, parseSyncState } from "@/lib/sync-state";

export async function GET(request: Request) {
  const syncId = new URL(request.url).searchParams.get("syncId");
  if (!syncId || !isValidSyncId(syncId)) {
    return NextResponse.json({ error: "Invalid sync id" }, { status: 400 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Blob storage is not configured" }, { status: 503 });
  }

  const blob = await readSyncBlob(syncId);
  if (blob.kind === "invalid") {
    return NextResponse.json({ error: "Stored sync data is invalid" }, { status: 500 });
  }
  if (blob.kind === "missing") {
    return NextResponse.json({ found: false as const, state: emptySyncState() });
  }

  return NextResponse.json(
    { found: true as const, state: blob.state },
    { headers: { ETag: blob.etag } },
  );
}

export async function PUT(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { syncId, state } = body as { syncId?: unknown; state?: unknown };
  if (typeof syncId !== "string" || !isValidSyncId(syncId)) {
    return NextResponse.json({ error: "Invalid sync id" }, { status: 400 });
  }

  const parsed = parseSyncState(state);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Blob storage is not configured" }, { status: 503 });
  }

  const etag = await writeSyncBlob(syncId, parsed);
  return NextResponse.json({ ok: true }, { headers: { ETag: etag } });
}
