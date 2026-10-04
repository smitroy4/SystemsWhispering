import { useEffect, useMemo, useRef, useState } from 'react';
import { tokenizeJava } from './javaHighlight.ts';
import './ui.css';

interface CodeBlockProps {
  title?: string;
  description?: string;
  code: string;
}

/** Java code display with hand-written highlighting + copy button. */
export default function CodeBlock({ title, description, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);
  const lines = useMemo(() => {
    const raw = code.split('\n');
    // A trailing newline would render one phantom empty line; drop it.
    const trimmed =
      raw.length > 0 && raw[raw.length - 1] === '' ? raw.slice(0, -1) : raw;
    return trimmed.map((line) => tokenizeJava(line));
  }, [code]);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Clipboard API unavailable (permissions/insecure context): fallback.
      const area = document.createElement('textarea');
      area.value = code;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
    }
    setCopied(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <figure className="ui-codeblock">
      <figcaption className="ui-codeblock__header">
        <span className="ui-codeblock__title">{title ?? 'Java'}</span>
        <span className="ui-codeblock__actions">
          <span className="ui-codeblock__lang">java</span>
          <button
            type="button"
            className="ui-codeblock__copy"
            onClick={copyCode}
            aria-live="polite"
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </span>
      </figcaption>
      {description ? <p className="ui-codeblock__desc">{description}</p> : null}
      <pre className="ui-codeblock__pre">
        <code>
          {lines.map((tokens, li) => (
            <span key={li} className="ui-code-line">
              {tokens.map((token, i) =>
                token.kind === 'plain' ? (
                  <span key={i}>{token.text}</span>
                ) : (
                  <span key={i} className={`tok-${token.kind}`}>
                    {token.text}
                  </span>
                ),
              )}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
