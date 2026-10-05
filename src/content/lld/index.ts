import type { LldModule, LldTopic } from '../../types/lld.ts';
import { module01 } from './module-01-introduction-to-software-design.ts';
import { module02 } from './module-02-oop-fundamentals.ts';
import { module03 } from './module-03-core-design-principles.ts';

export const lldModules: LldModule[] = [module01, module02, module03].sort((a, b) => a.order - b.order);

export function getLldModule(slug: string): LldModule | undefined {
  return lldModules.find((m) => m.slug === slug);
}

export function getLldTopic(moduleSlug: string, topicSlug: string): LldTopic | undefined {
  const module = getLldModule(moduleSlug);
  return module?.topics.find((t) => t.slug === topicSlug);
}
