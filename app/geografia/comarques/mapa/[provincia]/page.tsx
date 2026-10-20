import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MapLocationGame } from "@/components/map-location-game";
import { Shell } from "@/components/shell";
import {
  comarquesMapScoreId,
  getProvincia,
  mapQuestionsForProvincia,
  provincies,
  type ProvinciaId,
} from "@/content/comarques/ca";
import { defaultLocale, t } from "@/lib/i18n";

export function generateStaticParams() {
  return provincies.map((provincia) => ({ provincia: provincia.id }));
}

function MapFallback() {
  return (
    <Shell title="…" backHref="/geografia/comarques" wide>
      <div className="mx-auto mb-6 h-7 max-w-xs animate-pulse rounded bg-muted" />
      <div className="h-80 animate-pulse rounded-2xl bg-muted" />
    </Shell>
  );
}

async function MapProvinciaContent({
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
    <MapLocationGame
      title={t(defaultLocale, "geography.mapTitle", { name: provincia.name })}
      questions={mapQuestionsForProvincia(provinciaId)}
      scoreId={comarquesMapScoreId(provinciaId)}
      backHref="/geografia/comarques"
    />
  );
}

export default function ComarquesMapPage({
  params,
}: {
  params: Promise<{ provincia: string }>;
}) {
  return (
    <Suspense fallback={<MapFallback />}>
      <MapProvinciaContent params={params} />
    </Suspense>
  );
}
