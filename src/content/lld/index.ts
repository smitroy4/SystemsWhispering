import type { LldModule } from '../../types/lld.ts';
import { module01 } from './module-01-introduction-to-software-design.ts';

export const lldModules: LldModule[] = [module01];

export function getLldModule(slug: string): LldModule | undefined {
  return lldModules.find((m) => m.slug === slug);
}

export function getLldTopic(moduleSlug: string, topicSlug: string): any {
  const module = getLldModule(moduleSlug);
  return module?.topics.find((t) => t.slug === topicSlug);
}
