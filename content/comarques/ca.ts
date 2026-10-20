import type { Flashcard } from "@/content/flashcards/ca";

export const provincies = [
  { id: "barcelona", name: "Barcelona" },
  { id: "lleida", name: "Lleida" },
  { id: "tarragona", name: "Tarragona" },
  { id: "girona", name: "Girona" },
] as const;

export type ProvinciaId = (typeof provincies)[number]["id"];

/** Position of a capital square on `public/maps/catalunya_blank.png`, normalized 0–1. */
export type MapPoint = {
  x: number;
  y: number;
};

type CapitalPoint = MapPoint & {
  /** Set when the comarca has more than one capital. */
  name?: string;
};

type ComarcaRow = {
  comarca: string;
  capital: string;
  provincia: string;
  /** Capital markers. The comarca is located at the same points. */
  points: CapitalPoint[];
};

/**
 * Source: Generalitat t15902 (comarques de Catalunya).
 * Coordinates: capital squares on the ICGC comarques map (setembre 2025).
 */
const rows: ComarcaRow[] = [
  { comarca: "Alt Camp", capital: "Valls", provincia: "Tarragona", points: [{ x: 0.27197, y: 0.67372 }] },
  { comarca: "Alt Empordà", capital: "Figueres", provincia: "Girona", points: [{ x: 0.66895, y: 0.28526 }] },
  { comarca: "Alt Penedès", capital: "Vilafranca del Penedès", provincia: "Barcelona", points: [{ x: 0.37598, y: 0.65192 }] },
  { comarca: "Alt Urgell", capital: "La Seu d'Urgell", provincia: "Lleida", points: [{ x: 0.32471, y: 0.24295 }] },
  { comarca: "Alta Ribagorça", capital: "El Pont de Suert", provincia: "Lleida", points: [{ x: 0.16309, y: 0.21859 }] },
  { comarca: "Anoia", capital: "Igualada", provincia: "Barcelona", points: [{ x: 0.3585, y: 0.55526 }] },
  { comarca: "Vall d'Aran", capital: "Vielha", provincia: "Lleida", points: [{ x: 0.1792, y: 0.10192 }] },
  { comarca: "Bages", capital: "Manresa", provincia: "Barcelona", points: [{ x: 0.4082, y: 0.49731 }] },
  { comarca: "Baix Camp", capital: "Reus", provincia: "Tarragona", points: [{ x: 0.2373, y: 0.72603 }] },
  { comarca: "Baix Ebre", capital: "Tortosa", provincia: "Tarragona", points: [{ x: 0.09854, y: 0.86141 }] },
  { comarca: "Baix Empordà", capital: "La Bisbal d'Empordà", provincia: "Girona", points: [{ x: 0.68604, y: 0.40769 }] },
  { comarca: "Baix Llobregat", capital: "St. Feliu de Llobregat", provincia: "Barcelona", points: [{ x: 0.45654, y: 0.6391 }] },
  { comarca: "Baix Penedès", capital: "El Vendrell", provincia: "Tarragona", points: [{ x: 0.33691, y: 0.70192 }] },
  { comarca: "Barcelonès", capital: "Barcelona", provincia: "Barcelona", points: [{ x: 0.48389, y: 0.63654 }] },
  { comarca: "Berguedà", capital: "Berga", provincia: "Barcelona", points: [{ x: 0.4126, y: 0.35 }] },
  { comarca: "Cerdanya", capital: "Puigcerdà", provincia: "Lleida", points: [{ x: 0.43252, y: 0.21782 }] },
  { comarca: "Conca de Barberà", capital: "Montblanc", provincia: "Tarragona", points: [{ x: 0.25195, y: 0.63718 }] },
  { comarca: "Garraf", capital: "Vilanova i la Geltrú", provincia: "Barcelona", points: [{ x: 0.38105, y: 0.70205 }] },
  { comarca: "Garrigues", capital: "Les Borges Blanques", provincia: "Lleida", points: [{ x: 0.18604, y: 0.57821 }] },
  { comarca: "Garrotxa", capital: "Olot", provincia: "Girona", points: [{ x: 0.56006, y: 0.31795 }] },
  { comarca: "Gironès", capital: "Girona", provincia: "Girona", points: [{ x: 0.63477, y: 0.40064 }] },
  { comarca: "Lluçanès", capital: "Prats de Lluçanès", provincia: "Barcelona", points: [{ x: 0.45459, y: 0.38718 }] },
  { comarca: "Maresme", capital: "Mataró", provincia: "Barcelona", points: [{ x: 0.54736, y: 0.57564 }] },
  { comarca: "Moianès", capital: "Moià", provincia: "Barcelona", points: [{ x: 0.46973, y: 0.46795 }] },
  { comarca: "Montsià", capital: "Amposta", provincia: "Tarragona", points: [{ x: 0.11133, y: 0.90192 }] },
  { comarca: "Noguera", capital: "Balaguer", provincia: "Lleida", points: [{ x: 0.17422, y: 0.46897 }] },
  { comarca: "Osona", capital: "Vic", provincia: "Barcelona", points: [{ x: 0.50537, y: 0.42051 }] },
  { comarca: "Pallars Jussà", capital: "Tremp", provincia: "Lleida", points: [{ x: 0.19629, y: 0.31795 }] },
  { comarca: "Pallars Sobirà", capital: "Sort", provincia: "Lleida", points: [{ x: 0.25049, y: 0.22628 }] },
  { comarca: "Pla d'Urgell", capital: "Mollerussa", provincia: "Lleida", points: [{ x: 0.19238, y: 0.53372 }] },
  { comarca: "Pla de l'Estany", capital: "Banyoles", provincia: "Girona", points: [{ x: 0.62305, y: 0.34449 }] },
  { comarca: "Priorat", capital: "Falset", provincia: "Tarragona", points: [{ x: 0.17139, y: 0.72821 }] },
  { comarca: "Ribera d'Ebre", capital: "Móra d'Ebre", provincia: "Tarragona", points: [{ x: 0.12979, y: 0.74859 }] },
  { comarca: "Ripollès", capital: "Ripoll", provincia: "Girona", points: [{ x: 0.49121, y: 0.3109 }] },
  { comarca: "Segarra", capital: "Cervera", provincia: "Lleida", points: [{ x: 0.27744, y: 0.51808 }] },
  { comarca: "Segrià", capital: "Lleida", provincia: "Lleida", points: [{ x: 0.13037, y: 0.5359 }] },
  { comarca: "Selva", capital: "Sta. Coloma de Farners", provincia: "Girona", points: [{ x: 0.59951, y: 0.44731 }] },
  { comarca: "Solsonès", capital: "Solsona", provincia: "Lleida", points: [{ x: 0.33691, y: 0.39103 }] },
  { comarca: "Tarragonès", capital: "Tarragona", provincia: "Tarragona", points: [{ x: 0.27002, y: 0.74167 }] },
  { comarca: "Terra Alta", capital: "Gandesa", provincia: "Tarragona", points: [{ x: 0.08203, y: 0.76218 }] },
  { comarca: "Urgell", capital: "Tàrrega", provincia: "Lleida", points: [{ x: 0.24912, y: 0.52679 }] },
  {
    comarca: "Vallès Occidental",
    capital: "Sabadell i Terrassa",
    provincia: "Barcelona",
    points: [
      { name: "Sabadell", x: 0.46973, y: 0.57179 },
      { name: "Terrassa", x: 0.4502, y: 0.56538 },
    ],
  },
  { comarca: "Vallès Oriental", capital: "Granollers", provincia: "Barcelona", points: [{ x: 0.51133, y: 0.54718 }] },
];

const provinciaNameById: Record<ProvinciaId, string> = {
  barcelona: "Barcelona",
  lleida: "Lleida",
  tarragona: "Tarragona",
  girona: "Girona",
};

function slug(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getProvincia(id: string): (typeof provincies)[number] | undefined {
  return provincies.find((p) => p.id === id);
}

export function flashcardsForProvincia(provinciaId: ProvinciaId): Flashcard[] {
  const provinciaName = provinciaNameById[provinciaId];
  const filtered = rows.filter((row) => row.provincia === provinciaName);
  const cards: Flashcard[] = [];

  for (const row of filtered) {
    const base = slug(row.comarca);
    cards.push({
      id: `${provinciaId}-comarca-${base}`,
      front: `Comarca\n${row.capital}`,
      back: row.comarca,
    });
    cards.push({
      id: `${provinciaId}-capital-${base}`,
      front: `Capital de comarca\n${row.comarca}`,
      back: row.capital,
    });
  }

  return cards;
}

export function comarquesScoreId(provinciaId: ProvinciaId) {
  return `comarques:${provinciaId}` as const;
}

export type ComarquesScoreId = ReturnType<typeof comarquesScoreId>;

export const catalunyaMapSrc = "/maps/catalunya_blank.png";

export type MapQuestionKind = "comarca" | "capital";

export type MapQuestion = {
  id: string;
  kind: MapQuestionKind;
  prompt: string;
  targets: MapPoint[];
};

function namedCapitals(row: ComarcaRow): { name: string; x: number; y: number }[] {
  return row.points.map((point) => ({
    name: point.name ?? row.capital,
    x: point.x,
    y: point.y,
  }));
}

/** Every capital marker on the Catalonia map, used to reject a click closer to another place. */
export function catalunyaCapitalMarkers(): MapPoint[] {
  return rows.flatMap((row) => row.points.map(({ x, y }) => ({ x, y })));
}

/** One prompt per comarca in a province. The target is that comarca’s capital. */
export function mapQuestionsForProvincia(provinciaId: ProvinciaId): MapQuestion[] {
  const provinciaName = provinciaNameById[provinciaId];
  const questions: MapQuestion[] = [];

  for (const row of rows) {
    if (row.provincia !== provinciaName) continue;
    questions.push({
      id: `${provinciaId}-map-comarca-${slug(row.comarca)}`,
      kind: "comarca",
      prompt: row.comarca,
      targets: namedCapitals(row).map(({ x, y }) => ({ x, y })),
    });
  }

  return questions;
}

export function comarquesMapScoreId(provinciaId: ProvinciaId) {
  return `comarques-mapa:${provinciaId}` as const;
}

export type ComarquesMapScoreId = ReturnType<typeof comarquesMapScoreId>;
