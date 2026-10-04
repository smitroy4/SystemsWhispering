import type { ReactNode } from 'react';

/**
 * Minimal markdown-lite renderer for Section bodies:
 * blank-line separated paragraphs, "- " list items, inline `code` and **bold**.
 * Content stays plain strings; this only presents them.
 */

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
    if (lines.every((l) => l.startsWith('- '))) {
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
