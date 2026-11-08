import type { JavaModule, JavaTopic } from '../../types/java.ts';
import { module01 } from './module-01-fundamentals.ts';
import { module02 } from './module-02-object-orientation.ts';
import { module03 } from './module-03-collections-and-streams.ts';
import { module05 } from './module-05-multithreading.ts';

export const javaModules: JavaModule[] = [
  module01,
  module02,
  module03,
  module05,
].sort((a, b) => a.order - b.order);

export function getJavaModule(slug: string): JavaModule | undefined {
  return javaModules.find((m) => m.slug === slug);
}

export function getJavaTopic(moduleSlug: string, topicSlug: string): JavaTopic | undefined {
  const module = getJavaModule(moduleSlug);
  return module?.topics.find((t) => t.slug === topicSlug);
}

export function getAllJavaTopics(): JavaTopic[] {
  return javaModules.flatMap((m) => m.topics);
}