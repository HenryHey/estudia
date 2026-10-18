import { Suspense } from "react";
import { notFound } from "next/navigation";
import { FlashcardGame } from "@/components/flashcard-game";
import { Shell } from "@/components/shell";
import {
  comarquesScoreId,
  flashcardsForProvincia,
  getProvincia,
  provincies,
  type ProvinciaId,
} from "@/content/comarques/ca";

export function generateStaticParams() {
  return provincies.map((provincia) => ({ provincia: provincia.id }));
}

function ComarquesProvinciaFallback() {
  return (
    <Shell title="…" backHref="/geografia/comarques">
      <div className="mx-auto mb-6 h-7 max-w-xs animate-pulse rounded bg-muted" />
      <div className="grid gap-3">
        <div className="h-12 animate-pulse rounded-lg bg-muted" />
        <div className="h-12 animate-pulse rounded-lg bg-muted" />
      </div>
    </Shell>
  );
}

async function ComarquesProvinciaContent({
  params,
}: {
  params: Promise<{ provincia: string }>;
}) {
  const { provincia: provinciaParam } = await params;
  const provincia = getProvincia(provinciaParam);

  if (!provincia) {
    notFound();
  }

  const provinciaId = provincia.id as ProvinciaId;

  return (
    <FlashcardGame
      title={provincia.name}
      flashcards={flashcardsForProvincia(provinciaId)}
      scoreId={comarquesScoreId(provinciaId)}
      backHref="/geografia/comarques"
    />
  );
}

export default function ComarquesProvinciaPage({
  params,
}: {
  params: Promise<{ provincia: string }>;
}) {
  return (
    <Suspense fallback={<ComarquesProvinciaFallback />}>
      <ComarquesProvinciaContent params={params} />
    </Suspense>
  );
}
