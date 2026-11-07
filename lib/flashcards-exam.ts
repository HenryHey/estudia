import type { Flashcard } from "@/content/flashcards/ca";
import { shuffle } from "@/lib/shuffle";

/** One card per comarca. Exams always ask for the capital and show the comarca name. */
export function flashcardsForExam(deck: Flashcard[]): Flashcard[] {
  const groups = new Map<string, Flashcard[]>();

  for (const card of deck) {
    const paired = card.id.match(/-(comarca|capital)-(.+)$/);
    const key = paired ? paired[2]! : card.id;
    const list = groups.get(key) ?? [];
    list.push(card);
    groups.set(key, list);
  }

  const picked: Flashcard[] = [];
  for (const group of groups.values()) {
    const capital = group.find((card) => /-capital-/.test(card.id));
    picked.push(capital ?? group[0]!);
  }

  return shuffle(picked);
}
