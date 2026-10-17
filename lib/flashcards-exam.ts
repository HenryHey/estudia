import type { Flashcard } from "@/content/flashcards/ca";
import { shuffle } from "@/lib/shuffle";

/** One card per logical item (e.g. comarca OR capital, not both). */
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
    const index = Math.floor(Math.random() * group.length);
    picked.push(group[index]!);
  }

  return shuffle(picked);
}
