import fs from 'fs';
import path from 'path';
import { dataStructuresRoadmap } from '../src/content/dataStructures/roadmap.ts';

const CONTENT_DIR = path.join(process.cwd(), 'src/content/dataStructures');

function validate() {
  const slugs = new Set();
  const errors: string[] = [];

  // 1. Check for duplicate slugs in roadmap
  dataStructuresRoadmap.forEach(entry => {
    if (slugs.has(entry.slug)) {
      errors.push(`Duplicate slug in roadmap: ${entry.slug}`);
    }
    slugs.add(entry.slug);
  });

  // 2. Check 'done' entries have content files
  dataStructuresRoadmap.filter(e => e.status === 'done').forEach(entry => {
    const filePath = path.join(CONTENT_DIR, `${entry.slug}.ts`);
    if (!fs.existsSync(filePath)) {
      errors.push(`Roadmap entry marked 'done' but file missing: ${filePath}`);
    }
  });

  // 3. Check content files have roadmap entries
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'roadmap.ts');
  files.forEach(file => {
    const slug = path.basename(file, '.ts');
    if (!dataStructuresRoadmap.find(e => e.slug === slug)) {
      errors.push(`Content file exists but no roadmap entry found for slug: ${slug}`);
    }
  });

  if (errors.length > 0) {
    console.error('Roadmap validation failed:');
    errors.forEach(err => console.error(`- ${err}`));
    process.exit(1);
  }

  console.log('Roadmap validated successfully!');
}

validate();
