import type { Problem } from '../../types/content.ts';
import { starterProblems } from './starter.ts';
import { neetcodeProblems } from './problems.ts';

/**
 * Curated practice-problem list. Starter entries come first; the
 * NeetCode bank fills in the rest. Duplicates resolve to the first
 * occurrence so every `id` is unique.
 */
const seen = new Set<string>();
export const problems: Problem[] = [...starterProblems, ...neetcodeProblems].filter(
  (problem) => {
    if (seen.has(problem.id)) return false;
    seen.add(problem.id);
    return true;
  },
);
