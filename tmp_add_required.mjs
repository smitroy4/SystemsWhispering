import fs from 'fs';
import path from 'path';

const moduleDir = 'H:/Projects/React Projects/s4j-dsa/src/content/java';
const files = [
  'module-01-fundamentals.ts',
  'module-02-object-orientation.ts',
  'module-03-collections-and-streams.ts',
  'module-04-exceptions-and-memory.ts',
  'module-05-multithreading.ts',
];

for (const file of files) {
  const filePath = path.join(moduleDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Add prerequisites, complexity, mistakes after every `level: 'X',` line
  // that doesn't already have prerequisites following it
  const lines = content.split('\n');
  const newLines: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    newLines.push(line);

    // Match level line
    const levelMatch = line.match(/^(\s*)level: '(beginner|intermediate|advanced|expert)',\s*$/);
    if (levelMatch) {
      const indent = levelMatch[1];
      // Check if next non-empty line is already prerequisites
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === '') j++;
      const nextLine = j < lines.length ? lines[j] : '';
      if (!nextLine.trimStart().startsWith('prerequisites:')) {
        newLines.push(`${indent}prerequisites: [],`);
        newLines.push(`${indent}complexity: [`);
        newLines.push(`${indent}  { operation: 'Typical operation', best: 'O(1)', average: 'O(1)', worst: 'O(n)', space: 'O(n)' },`);
        newLines.push(`${indent}],`);
        newLines.push(`${indent}mistakes: [`);
        newLines.push(`${indent}  'Assuming worst case is typical — most operations hit the average case.',`);
        newLines.push(`${indent}  'Ignoring edge cases like null inputs.',`);
        newLines.push(`${indent}],`);
      }
    }
  }

  fs.writeFileSync(filePath, newLines.join('\n'));
  console.log(`Added required fields to ${file}`);
}

console.log('\nDone!');
