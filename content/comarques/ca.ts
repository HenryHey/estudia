import type { Flashcard } from "@/content/flashcards/ca";

export const provincies = [
  { id: "barcelona", name: "Barcelona" },
  { id: "lleida", name: "Lleida" },
  { id: "tarragona", name: "Tarragona" },
  { id: "girona", name: "Girona" },
] as const;

export type ProvinciaId = (typeof provincies)[number]["id"];

type ComarcaRow = {
  comarca: string;
  capital: string;
  provincia: string;
};

/** Source: Generalitat t15902 (comarques de Catalunya). */
const rows: ComarcaRow[] = [
  { comarca: "Alt Camp", capital: "Valls", provincia: "Tarragona" },
  { comarca: "Alt Empordà", capital: "Figueres", provincia: "Girona" },
  { comarca: "Alt Penedès", capital: "Vilafranca del Penedès", provincia: "Barcelona" },
  { comarca: "Alt Urgell", capital: "La Seu d'Urgell", provincia: "Lleida" },
  { comarca: "Alta Ribagorça", capital: "El Pont de Suert", provincia: "Lleida" },
  { comarca: "Anoia", capital: "Igualada", provincia: "Barcelona" },
  { comarca: "Vall d'Aran", capital: "Vielha", provincia: "Lleida" },
  { comarca: "Bages", capital: "Manresa", provincia: "Barcelona" },
  { comarca: "Baix Camp", capital: "Reus", provincia: "Tarragona" },
  { comarca: "Baix Ebre", capital: "Tortosa", provincia: "Tarragona" },
  { comarca: "Baix Empordà", capital: "La Bisbal d'Empordà", provincia: "Girona" },
  { comarca: "Baix Llobregat", capital: "St. Feliu de Llobregat", provincia: "Barcelona" },
  { comarca: "Baix Penedès", capital: "El Vendrell", provincia: "Tarragona" },
  { comarca: "Barcelonès", capital: "Barcelona", provincia: "Barcelona" },
  { comarca: "Berguedà", capital: "Berga", provincia: "Barcelona" },
  { comarca: "Cerdanya", capital: "Puigcerdà", provincia: "Girona" },
  { comarca: "Conca de Barberà", capital: "Montblanc", provincia: "Tarragona" },
  { comarca: "Garraf", capital: "Vilanova i la Geltrú", provincia: "Barcelona" },
  { comarca: "Garrigues", capital: "Les Borges Blanques", provincia: "Lleida" },
  { comarca: "Garrotxa", capital: "Olot", provincia: "Girona" },
  { comarca: "Gironès", capital: "Girona", provincia: "Girona" },
  { comarca: "Lluçanès", capital: "Prats de Lluçanès", provincia: "Barcelona" },
  { comarca: "Maresme", capital: "Mataró", provincia: "Barcelona" },
  { comarca: "Moianès", capital: "Moià", provincia: "Barcelona" },
  { comarca: "Montsià", capital: "Amposta", provincia: "Tarragona" },
  { comarca: "Noguera", capital: "Balaguer", provincia: "Lleida" },
  { comarca: "Osona", capital: "Vic", provincia: "Barcelona" },
  { comarca: "Pallars Jussà", capital: "Tremp", provincia: "Lleida" },
  { comarca: "Pallars Sobirà", capital: "Sort", provincia: "Lleida" },
  { comarca: "Pla d'Urgell", capital: "Mollerussa", provincia: "Lleida" },
  { comarca: "Pla de l'Estany", capital: "Banyoles", provincia: "Girona" },
  { comarca: "Priorat", capital: "Falset", provincia: "Tarragona" },
  { comarca: "Ribera d'Ebre", capital: "Móra d'Ebre", provincia: "Tarragona" },
  { comarca: "Ripollès", capital: "Ripoll", provincia: "Girona" },
  { comarca: "Segarra", capital: "Cervera", provincia: "Lleida" },
  { comarca: "Segrià", capital: "Lleida", provincia: "Lleida" },
  { comarca: "Selva", capital: "Sta. Coloma de Farners", provincia: "Girona" },
  { comarca: "Solsonès", capital: "Solsona", provincia: "Lleida" },
  { comarca: "Tarragonès", capital: "Tarragona", provincia: "Tarragona" },
  { comarca: "Terra Alta", capital: "Gandesa", provincia: "Tarragona" },
  { comarca: "Urgell", capital: "Tàrrega", provincia: "Lleida" },
  { comarca: "Vallès Occidental", capital: "Sabadell i Terrassa", provincia: "Barcelona" },
  { comarca: "Vallès Oriental", capital: "Granollers", provincia: "Barcelona" },
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
