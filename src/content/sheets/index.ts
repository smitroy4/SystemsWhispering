import type { Sheet } from '../../types/content.ts';
import { s4j30DaysChallenge } from './s4j-30-days-challenge.ts';
import { s4j60DaysMastery } from './s4j-60-days-mastery.ts';
import { s4j90DaysSde } from './s4j-90-days-sde.ts';
import { s4j180DaysMastery } from './s4j-180-days-mastery.ts';
import { s4j365DaysVeteran } from './s4j-365-days-veteran.ts';

/** Study sheets / roadmaps, ordered by duration. */
export const sheets: Sheet[] = [
  s4j30DaysChallenge,
  s4j60DaysMastery,
  s4j90DaysSde,
  s4j180DaysMastery,
  s4j365DaysVeteran,
];

export function getSheet(slug: string): Sheet | undefined {
  return sheets.find((s) => s.slug === slug);
}
