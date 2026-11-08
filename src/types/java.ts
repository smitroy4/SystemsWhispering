import type { CodeSnippet } from './content.ts';

/** A self-check question rendered at the bottom of a Java topic page. */
export interface JavaQuizItem {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

/** One conceptual section inside a Java topic page. */
export interface JavaSubtopic {
  id: string;
  title: string;
  /** Markdown-lite body: paragraphs, "- " lists, "|" tables, `code`, **bold**. */
  body: string;
}

/**
 * A submodule page in the Java curriculum. Each topic maps to one lecture
 * from the source course and becomes a full page under /java/:module/:topic.
 */
export interface JavaTopic {
  slug: string;
  title: string;
  order: number;
  summary: string;
  /** Learning level used for the module badge. */
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  subtopics: JavaSubtopic[];
  javaCode: CodeSnippet[];
  keyTakeaways: string[];
  interviewTips: string[];
  pitfalls: string[];
  quiz?: JavaQuizItem[];
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
