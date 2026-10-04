import fs from 'fs';
import path from 'path';
import { dataStructuresRoadmap } from '../src/content/dataStructures/roadmap.ts';
import { algorithms } from '../src/content/algorithms/index.ts';
import { concepts } from '../src/content/concepts/index.ts';
import { problems } from '../src/content/problems/index.ts';
import type { Sheet, SheetDay } from '../src/types/content.ts';

const OUTPUT_DIR = path.join(process.cwd(), 'src/content/sheets');

interface SheetConfig {
  slug: string;
  title: string;
  description: string;
  days: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Veteran';
  audience: string;
  dailyTime: string;
}

const CONFIGS: SheetConfig[] = [
  {
    slug: 's4j-30-days-challenge',
    title: '30-Day Challenge',
    description: 'Rapid-fire introduction to the most critical DSA patterns. Ideal for a quick refresh before interviews.',
    days: 30,
    difficulty: 'Beginner',
    audience: 'Students, Job Seekers',
    dailyTime: '2-3 hours',
  },
  {
    slug: 's4j-60-days-mastery',
    title: '60-Day Mastery',
    description: 'Balanced approach covering all core data structures and algorithms with deep-dive practice.',
    days: 60,
    difficulty: 'Intermediate',
    audience: 'Aspiring SDEs',
    dailyTime: '3-4 hours',
  },
  {
    slug: 's4j-sde-mastery',
    title: 'SDE Mastery',
    description: 'Comprehensive 90-day plan targeting SDE-1/2 roles at top product companies.',
    days: 90,
    difficulty: 'Advanced',
    audience: 'Software Engineers',
    dailyTime: '4-5 hours',
  },
  {
    slug: 's4j-180-days-mastery',
    title: '180-Day Deep Dive',
    description: 'Full immersion into CS fundamentals, advanced DSA, and system design basics.',
    days: 180,
    difficulty: 'Advanced',
    audience: 'Career Switchers, Students',
    dailyTime: '3-5 hours',
  },
  {
    slug: 's4j-365-days-veteran',
    title: '365-Day Veteran',
    description: 'The ultimate journey. Mastery through consistency, including LLD, mock interviews, and monthly reviews.',
    days: 365,
    difficulty: 'Veteran',
    audience: 'Lifelong Learners',
    dailyTime: '2-4 hours',
  },
];

function generateSheet(config: SheetConfig): Sheet {
  const allTopics = [
    ...dataStructuresRoadmap.map(d => ({ slug: d.slug, title: d.title, order: d.order })),
    ...algorithms.map(a => ({ slug: a.slug, title: a.title, order: a.order })),
    ...concepts.map(c => ({ slug: c.slug, title: c.title, order: c.order })),
  ].sort((a, b) => a.order - b.order);

  const days: SheetDay[] = [];
  let topicIdx = 0;
  const usedProblems = new Set<string>();

  for (let d = 1; d <= config.days; d++) {
    const isRevisionDay = d % 7 === 0;
    const isReviewMonth = config.days === 365 && d % 30 === 0;
    const isMockDay = config.days === 365 && d % 14 === 0 && d % 7 !== 0;

    if (isReviewMonth) {
      days.push({
        day: d,
        title: `Monthly Review Checkpoint ${d / 30}`,
        goal: 'Review all concepts from the past month and solve mixed problems.',
        topicSlugs: allTopics.slice(0, topicIdx).slice(-10).map(t => t.slug),
        problemIds: problems.slice(0, 5).map(p => p.id), // Simplified
      });
      continue;
    }

    if (isMockDay) {
      days.push({
        day: d,
        title: `Mock Interview Session ${Math.floor(d / 14)}`,
        goal: 'Simulate a real interview: 1 Easy, 1 Medium problem in 45 mins.',
        topicSlugs: [],
        problemIds: problems.slice(0, 2).map(p => p.id),
      });
      continue;
    }

    if (isRevisionDay) {
      days.push({
        day: d,
        title: `Weekly Revision ${Math.floor(d / 7)}`,
        goal: 'Revisit the week\'s topics and solve gaps in understanding.',
        topicSlugs: allTopics.slice(Math.max(0, topicIdx - 10), topicIdx).map(t => t.slug),
        problemIds: problems.slice(0, 3).map(p => p.id),
      });
    } else {
      // Standard day
      const topicsPerDay = config.days <= 30 ? 2 : config.days <= 90 ? 1 : 1;
      const currentTopics = allTopics.slice(topicIdx, topicIdx + topicsPerDay);
      topicIdx += topicsPerDay;

      // LLD Integration (TODO: once LLD exists)
      // if (config.days >= 180 && d % 10 === 0) { ... }

      days.push({
        day: d,
        title: currentTopics[0]?.title || `Day ${d}: Core Practice`,
        goal: `Master ${currentTopics.map(t => t.title).join(', ')}`,
        topicSlugs: currentTopics.map(t => t.slug),
        problemIds: problems.slice(0, 3).map(p => p.id), // In real gen, would filter by topic
      });
    }
  }

  return {
    slug: config.slug,
    title: config.title,
    description: config.description,
    days,
  };
}

function main() {
  CONFIGS.forEach(config => {
    const sheet = generateSheet(config);
    const content = `import type { Sheet } from '../../types/content.ts';\n\nexport const ${config.slug.replace(/-/g, '')}Topic: Sheet = ${JSON.stringify(sheet, null, 2)};\n\nexport default ${config.slug.replace(/-/g, '')}Topic;`;
    
    // Actually, for a .ts file we should use a more idiomatic export
    const finalContent = `import type { Sheet } from '../../types/content.ts';\n\nexport const ${config.slug.replace(/-/g, '').replace('s4j', 's4j')}Sheet: Sheet = ${JSON.stringify(sheet, null, 2)};\n\nexport default ${config.slug.replace(/-/g, '').replace('s4j', 's4j')}Sheet;`;
    
    fs.writeFileSync(path.join(OUTPUT_DIR, `${config.slug}.ts`), finalContent);
    console.log(`Generated ${config.slug}.ts`);
  });
}

main();
