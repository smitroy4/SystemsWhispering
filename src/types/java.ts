import type { CodeSnippet } from './content.ts';

export type TopicLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

/** A self-check question rendered at the bottom of a Java topic page. */
export interface JavaQuizItem {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

/** "Choose this when / Avoid when" box rendered under the topic header. */
export interface ChoiceBox {
  choose: string[];
  avoid: string[];
}

/** One row in a complexity table. */
export interface ComplexityRow {
  operation: string;
  best: string;
  average: string;
  worst: string;
  space?: string;
}

/** One detailed section inside a Java topic page. */
export interface JavaSection {
  heading: string;
  /** Markdown-lite body: paragraphs, "- " lists, "|" tables, `code`, **bold**. */
  body: string;
}

/** One submodule page in the Java curriculum. Each topic maps to one lecture
 * from the source course and becomes a full page under /java/:module/:topic. */
export interface JavaTopic {
  slug: string;
  title: string;
  order: number;
  summary: string;
  /** Learning level used for the module badge. */
  level: TopicLevel;
  /** Topics that must be understood first. */
  prerequisites?: string[];
  /** Detailed sections (replaces subtopics in the rich model). */
  sections: JavaSection[];
  /** Illustration id from the Java concept gallery. */
  vizId?: string;
  /** YouTube video explainer URLs for this topic (optional). */
  youtubeUrls?: string[];
  /** JDK classes covered by this topic, e.g. `java.util.HashMap`. */
  javaBuiltIn?: string[];
  /** Related topic slugs for cross-linking. */
  related?: string[];
  javaCode: CodeSnippet[];
  /** Complexity table rows (e.g. get/put O(1)). */
  complexity?: ComplexityRow[];
  /** Common mistakes learners make. */
  mistakes?: string[];
  /** Choose this when / Avoid when box. */
  choiceBox?: ChoiceBox;
  /** Self-check quiz items. */
  quiz?: JavaQuizItem[];
  /** JDK classes covered (alias for javaBuiltIn for consistency). */
  jdkClasses?: string[];
  /** Key takeaways (legacy field, kept for migration). */
  keyTakeaways?: string[];
  /** Interview tips (legacy field, kept for migration). */
  interviewTips?: string[];
  /** Common pitfalls (legacy field, superseded by mistakes). */
  pitfalls?: string[];
}

/** A top-level Java module. Its topics are rendered in the right sidebar. */
export interface JavaModule {
  slug: string;
  title: string;
  order: number;
  summary: string;
  /** Longer landing-page description of what the module covers. */
  overview: string;
  topics: JavaTopic[];
}
