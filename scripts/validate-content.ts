/**
 * Build-time content validator (runs via `prebuild`).
 * Fails the build if any SheetDay references an unknown topic slug or
 * problem id. Topic-level references are reported as warnings.
 */
import { sheets } from '../src/content/sheets/index.ts';
import { dataStructures } from '../src/content/dataStructures/index.ts';
import { algorithms } from '../src/content/algorithms/index.ts';
import { concepts } from '../src/content/concepts/index.ts';
import { problems } from '../src/content/problems/index.ts';

const topicSlugs = new Set<string>();
for (const topic of [...dataStructures, ...algorithms, ...concepts]) {
  if (topicSlugs.has(topic.slug)) {
    console.error(`Duplicate topic slug: ${topic.slug}`);
    process.exitCode = 1;
  }
  topicSlugs.add(topic.slug);
}

const problemIds = new Set<string>();
for (const problem of problems) {
  problemIds.add(problem.id);
  problemIds.add(problem.slug);
}

const VALID_GROUPS = new Set(['linear', 'non-linear', 'collections', 'concurrent']);
const VALID_STATUS = new Set(['draft', 'complete']);

let errors = 0;
let warnings = 0;

function fail(message: string): void {
  console.error(`ERROR: ${message}`);
  errors += 1;
}

function warn(message: string): void {
  console.warn(`WARNING: ${message}`);
  warnings += 1;
}

const seenSheetSlugs = new Set<string>();
for (const sheet of sheets) {
  if (!sheet.slug || seenSheetSlugs.has(sheet.slug)) {
    fail(`Sheet has missing or duplicate slug: '${sheet.slug}'`);
  }
  seenSheetSlugs.add(sheet.slug);
  if (sheet.days.length === 0) {
    fail(`Sheet '${sheet.slug}' has no days`);
  }

  sheet.days.forEach((day, index) => {
    const where = `Sheet '${sheet.slug}' day ${day.day}`;
    if (day.day !== index + 1) {
      fail(`${where}: days must be sequential starting at 1 (found ${day.day} at position ${index + 1})`);
    }
    if (!day.title) fail(`${where}: missing title`);
    if (!day.goal) fail(`${where}: missing goal`);
    if (day.topicSlugs.length === 0) fail(`${where}: no topicSlugs`);
    if (day.problemIds.length === 0) fail(`${where}: no problemIds`);
    for (const slug of day.topicSlugs) {
      if (!topicSlugs.has(slug)) fail(`${where}: unknown topic slug '${slug}'`);
    }
    for (const id of day.problemIds) {
      if (!problemIds.has(id)) fail(`${where}: unknown problem id '${id}'`);
    }
  });
}

// Non-failing audit of topic-level references.
for (const topic of [...dataStructures, ...algorithms, ...concepts]) {
  for (const slug of topic.prerequisites) {
    if (!topicSlugs.has(slug)) warn(`Topic '${topic.slug}' has unknown prerequisite '${slug}'`);
  }
  for (const id of topic.problemIds) {
    if (!problemIds.has(id)) warn(`Topic '${topic.slug}' has unknown problem id '${id}'`);
  }
  if (topic.group !== undefined && !VALID_GROUPS.has(topic.group)) {
    fail(`Topic '${topic.slug}' has invalid group '${topic.group}'`);
  }
  if (topic.status !== undefined && !VALID_STATUS.has(topic.status)) {
    fail(`Topic '${topic.slug}' has invalid status '${topic.status}'`);
  }
}

// Every data-structure topic must declare its structural group.
for (const topic of dataStructures) {
  if (topic.group === undefined) {
    fail(`Data-structure topic '${topic.slug}' is missing required 'group'`);
  }
}

console.log(
  `Validated ${sheets.length} sheets, ${topicSlugs.size} topics, ${problems.length} problems: ${errors} error(s), ${warnings} warning(s).`,
);
if (errors > 0) {
  process.exit(1);
}
