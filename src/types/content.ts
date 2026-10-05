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

/** "Choose this when / avoid when" box rendered under the topic header. */
export interface ChoiceBox {
  choose: string[];
  avoid: string[];
}

export interface ComplexityRow {
  operation: string;
  best: string;
  average: string;
  worst: string;
  space?: string;
}

export type TopicSection = 'core' | 'collections' | 'concurrent' | 'advanced';

/** Structural grouping for data-structure topics (index page + sidebar). */
export type TopicGroup = 'linear' | 'non-linear' | 'collections' | 'concurrent';

/** Publication status. Stubs are 'draft' until their content step marks them 'complete'. */
export type TopicStatus = 'draft' | 'complete';

export interface Topic {
  slug: string;
  title: string;
  category: TopicCategory;
  order: number;
  summary: string;
  level: TopicLevel;
  section?: TopicSection;
  /** Structural group. Required for data-structure topics, unused elsewhere. */
  group?: TopicGroup;
  /** Omitted status means a complete (fully written) topic. */
  status?: TopicStatus;
  prerequisites: string[];
  sections: Section[];
  complexity: ComplexityRow[];
  javaCode: CodeSnippet[];
  mistakes: string[];
  vizId?: string;
  problemIds: string[];
  /**
   * Shown above the practice list for concept-level topics where fewer than
   * three relevant LeetCode problems exist (e.g. Skip List, Bloom Filter).
   */
  practiceNote?: string;
  /** Ids of Concept Gallery visuals for this topic (populated by gallery steps). */
  illustrations?: string[];
  /** "Choose this when / avoid when" box (Collections + Concurrent topics). */
  choiceBox?: ChoiceBox;
  /** JDK classes covered by this topic, e.g. `java.util.ArrayList`. */
  javaBuiltIn?: string[];
  /** Related topic slugs for cross-linking. */
  related?: string[];
}

export interface Problem {
  /** LeetCode problem number as a string, e.g. "1" for Two Sum. Unique. */
  id: string;
  title: string;
  /** Real LeetCode slug, e.g. "two-sum". Unique. */
  slug: string;
  leetcodeUrl: string;
  difficulty: ProblemDifficulty;
  dataStructures: string[];
  patterns: string[];
  sheets?: string[];
  /** Hiring companies, only when certain — otherwise omitted. */
  companies?: string[];
}

export interface SheetDay {
  day: number;
  title: string;
  topicSlugs: string[];
  problemIds: string[];
  goal: string;
}

export type SheetDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Veteran';

export interface Sheet {
  slug: string;
  title: string;
  description: string;
  /** Displayed on the Sheets cards (study intensity). */
  difficulty: SheetDifficulty;
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
