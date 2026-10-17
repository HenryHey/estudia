import { notFound } from "next/navigation";
import { FlashcardGame } from "@/components/flashcard-game";
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

export default async function ComarquesProvinciaPage({
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
