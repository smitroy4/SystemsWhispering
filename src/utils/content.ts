import type {
  Problem,
  ProblemDifficulty,
  Topic,
  TopicCategory,
} from '../types/content.ts';
import { dataStructures } from '../content/dataStructures/index.ts';
import { algorithms } from '../content/algorithms/index.ts';
import { concepts } from '../content/concepts/index.ts';
import { problems } from '../content/problems/index.ts';

const topicsByCategory: Record<TopicCategory, Topic[]> = {
  'data-structures': dataStructures,
  algorithms,
  concepts,
};

/** All topics in a category, sorted by `order`. */
export function getAllTopics(category: TopicCategory): Topic[] {
  return [...topicsByCategory[category]].sort((a, b) => a.order - b.order);
}

/** A single topic by category + slug. */
export function getTopic(category: TopicCategory, slug: string): Topic | undefined {
  return topicsByCategory[category].find((topic) => topic.slug === slug);
}

/** A single practice problem by id. */
export function getProblem(id: string): Problem | undefined {
  return problems.find((problem) => problem.id === id);
}

/** Find a topic by slug across all categories (for cross-links). */
export function findTopicBySlug(slug: string): { category: TopicCategory; topic: Topic } | undefined {
  const categories = Object.keys(topicsByCategory) as TopicCategory[];
  for (const category of categories) {
    const topic = topicsByCategory[category].find((t) => t.slug === slug);
    if (topic) return { category, topic };
  }
  return undefined;
}

export interface ProblemFilter {
  /** Match problems tagged with this data structure. */
  ds?: string;
  difficulty?: ProblemDifficulty;
}

/** Problems matching all provided filters (empty filter returns all). */
export function filterProblems({ ds, difficulty }: ProblemFilter): Problem[] {
  return problems.filter((problem) => {
    if (ds !== undefined && !problem.dataStructures.includes(ds)) return false;
    if (difficulty !== undefined && problem.difficulty !== difficulty) return false;
    return true;
  });
}
