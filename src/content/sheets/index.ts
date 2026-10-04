import type { Sheet } from '../../types/content.ts';
import { s4j30DaysChallenge } from './s4j-30-days-challenge.ts';
import { s4j60DaysMastery } from './s4j-60-days-mastery.ts';
import { s4jCompleteMastery } from './s4j-complete-mastery.ts';

/** Study sheets / roadmaps. */
export const sheets: Sheet[] = [s4j30DaysChallenge, s4j60DaysMastery, s4jCompleteMastery];

export function getSheet(slug: string): Sheet | undefined {
  return sheets.find((s) => s.slug === slug);
}
