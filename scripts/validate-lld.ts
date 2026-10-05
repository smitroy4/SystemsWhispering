import fs from 'fs';
import path from 'path';
import { lldModules } from '../src/content/lld/index.ts';

async function validateLld() {
  console.log('Validating LLD content against outline...');
  
  const outlinePath = path.join(process.cwd(), 'docs/lld-outline.md');
  if (!fs.existsSync(outlinePath)) {
    console.error('Error: docs/lld-outline.md not found.');
    process.exit(1);
  }

  const content = fs.readFileSync(outlinePath, 'utf-8');
  const lines = content.split(/\r?\n/);
  
  let currentModuleTitle = '';
  const missing = [];

  lines.forEach(line => {
    const moduleMatch = line.match(/^## Module \d+: (.+)$/);
    const topicMatch = line.match(/^- (.+)$/);
    const subtopicMatch = line.match(/^\s+- (.+)$/);

    if (moduleMatch) {
      currentModuleTitle = moduleMatch[1].trim();
      const module = lldModules.find(m => m.title === currentModuleTitle);
      if (!module) {
        missing.push(`Module missing: ${currentModuleTitle}`);
      }
    } else if (topicMatch && currentModuleTitle) {
      const topicTitle = topicMatch[1].trim();
      const module = lldModules.find(m => m.title === currentModuleTitle);
      const topic = module?.topics.find(t => t.title === topicTitle);
      if (!topic) {
        missing.push(`Topic missing in ${currentModuleTitle}: ${topicTitle}`);
      }
    }
  });

  if (missing.length > 0) {
    console.error('LLD Validation failed:');
    missing.forEach(m => console.error(`- ${m}`));
    process.exit(1);
  } else {
    console.log('LLD Validation successful!');
  }
}

validateLld();
