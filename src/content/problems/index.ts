import type { Problem } from '../../types/content.ts';
import { starterProblems } from './starter.ts';
import { neetcodeProblems } from './problems.ts';
import { arrayProblems } from './arrays.ts';

/**
 * Curated practice-problem list. Group files land here as the dataset
 * grows; the legacy banks stay until every entry migrates. Duplicates
 * resolve to the first occurrence so every `id` and `slug` is unique.
 */
const seenIds = new Set<string>();
const seenSlugs = new Set<string>();
export const problems: Problem[] = [
  ...arrayProblems,
  ...starterProblems,
  ...neetcodeProblems,
].filter((problem) => {
  if (seenIds.has(problem.id) || seenSlugs.has(problem.slug)) return false;
  seenIds.add(problem.id);
  seenSlugs.add(problem.slug);
  return true;
});
