import type { Topic } from '../../types/content.ts';
import { bigOTopic } from './bigO.ts';
import { amortizedTopic } from './amortized.ts';
import { recursionTopic } from './recursion.ts';
import { memoryTopic } from './memory.ts';
import { passByValueTopic } from './passByValue.ts';
import { equalsTopic } from './equalsHashCode.ts';
import { comparableTopic } from './comparable.ts';
import { collectionsTopic } from './collections.ts';
import { bitTopic } from './bitManipulation.ts';
import { intervalsTopic } from './intervals.ts';
import { monotonicTopic } from './monotonic.ts';
import { frameworkTopic } from './framework.ts';

/** Core CS concept topics. Entries land here in later steps. */
export const concepts: Topic[] = [
  bigOTopic,
  amortizedTopic,
  recursionTopic,
  memoryTopic,
  passByValueTopic,
  equalsTopic,
  comparableTopic,
  collectionsTopic,
  bitTopic,
  intervalsTopic,
  monotonicTopic,
  frameworkTopic,
];

export function getConcept(slug: string): Topic | undefined {
  return concepts.find((t) => t.slug === slug);
}
