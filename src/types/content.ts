/**
 * Shared content types for "Systems Whispering".
 * All topic content lives in /src/content as typed data files.
 * Pages render these types and never hardcode content.
 */

export type TopicCategory = 'data-structures' | 'algorithms' | 'concepts';

export type TopicLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface Section {
  heading: string;
  /** Markdown-lite string. */
  body: string;
}

export interface CodeSnippet {
  title: string;
  description: string;
  code: string;
}

export interface ComplexityRow {
  operation: string;
  best: string;
  average: string;
  worst: string;
  space?: string;
}

export type TopicSection = 'core' | 'collections' | 'concurrent' | 'advanced';

export interface Topic {
  slug: string;
  title: string;
  category: TopicCategory;
  order: number;
  summary: string;
  level: TopicLevel;
  section?: TopicSection;
  prerequisites: string[];
  sections: Section[];
  complexity: ComplexityRow[];
  javaCode: CodeSnippet[];
  mistakes: string[];
  vizId?: string;
  problemIds: string[];
  /** Ids of Concept Gallery visuals for this topic (populated by gallery steps). */
  illustrations?: string[];
  /** JDK classes covered by this topic, e.g. `java.util.ArrayList`. */
  javaBuiltIn?: string[];
  /** Related topic slugs for cross-linking. */
  related?: string[];
}

export interface Problem {
  id: string;
  title: string;
  /** Real LeetCode slug, e.g. "two-sum". */
  slug: string;
  leetcodeUrl: string;
  difficulty: ProblemDifficulty;
  dataStructures: string[];
  patterns: string[];
  sheets?: string[];
}

export interface SheetDay {
  day: number;
  title: string;
  topicSlugs: string[];
  problemIds: string[];
  goal: string;
}

export interface Sheet {
  slug: string;
  title: string;
  description: string;
  days: SheetDay[];
}

export interface VizStep {
  id: string;
  description: string;
  /** Opaque per-frame visualization state, interpreted by the viz component. */
  state: unknown;
  highlight?: number[];
}

/** Canonical LeetCode URL for a problem slug. Never invent slugs. */
export function leetCodeUrl(slug: string): string {
  return `https://leetcode.com/problems/${slug}/`;
}
