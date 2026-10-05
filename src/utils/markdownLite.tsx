import type { ReactNode } from 'react';

/**
 * Minimal markdown-lite renderer for Section bodies:
 * blank-line separated paragraphs, "- " list items, "|"-row tables,
 * inline `code` and **bold**. Content stays plain strings; this only presents.
 */

function isTableSeparator(line: string): boolean {
  const cells = line.split('|').filter((c) => c.trim() !== '');
  return cells.length > 0 && cells.every((c) => /^:?-+:?$/.test(c.trim()));
}

function parseRow(line: string): string[] {
  let cells = line.split('|').map((c) => c.trim());
  if (cells.length > 0 && cells[0] === '') cells = cells.slice(1);
  if (cells.length > 0 && cells[cells.length - 1] === '') cells = cells.slice(0, -1);
  return cells;
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return <code key={key}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    return <span key={key}>{part}</span>;
  });
}

export function renderMarkdownLite(body: string): ReactNode[] {
  const blocks = body.split(/\n\s*\n/);
  const nodes: ReactNode[] = [];

  blocks.forEach((block, b) => {
    const lines = block.split('\n').map((l) => l.trim()).filter((l) => l !== '');
    if (lines.length === 0) return;
    if (lines.length >= 2 && lines.every((l) => l.includes('|'))) {
      const header = parseRow(lines[0]);
      const bodyRows = lines.slice(1).filter((l) => !isTableSeparator(l)).map(parseRow);
      nodes.push(
        <table key={b} className="md-table">
          <thead>
            <tr>
              {header.map((cell, i) => (
                <th key={i}>{renderInline(cell, `${b}-h${i}`)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, i) => (
                  <td key={i}>{renderInline(cell, `${b}-${r}-${i}`)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>,
      );
    } else if (lines.every((l) => l.startsWith('- '))) {
      nodes.push(
        <ul key={b}>
          {lines.map((line, i) => (
            <li key={i}>{renderInline(line.slice(2), `${b}-${i}`)}</li>
          ))}
        </ul>,
      );
    } else {
      lines.forEach((line, i) => {
        nodes.push(<p key={`${b}-${i}`}>{renderInline(line, `${b}-${i}`)}</p>);
      });
    }
  });

  return nodes;
}
