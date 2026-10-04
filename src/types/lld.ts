import type { CodeSnippet } from './content.ts';

export interface QuizItem {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface LldSubtopic {
  id: string;
  title: string;
  body: string;
  codeRefs?: number[];
}

export interface LldTopic {
  slug: string;
  title: string;
  order: number;
  summary: string;
  subtopics: LldSubtopic[];
  javaCode: CodeSnippet[];
  diagrams: string[];
  keyTakeaways: string[];
  interviewTips: string[];
  pitfalls: string[];
  quiz?: QuizItem[];
}

export interface LldModule {
  slug: string;
  title: string;
  order: number;
  summary: string;
  topics: LldTopic[];
}
