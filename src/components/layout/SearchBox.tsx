import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { TopicCategory } from '../../types/content.ts';
import { getAllTopics } from '../../utils/content.ts';
import { problems } from '../../content/problems/index.ts';
import './SearchBox.css';

interface SearchHit {
  key: string;
  to: string;
  title: string;
  kind: 'Topic' | 'Problem';
  detail: string;
}

const CATEGORIES: Array<{ category: TopicCategory; label: string }> = [
  { category: 'data-structures', label: 'Data Structures' },
  { category: 'algorithms', label: 'Algorithms' },
  { category: 'concepts', label: 'Concepts' },
];

function buildIndex(): SearchHit[] {
  const hits: SearchHit[] = [];
  for (const { category, label } of CATEGORIES) {
    for (const topic of getAllTopics(category)) {
      hits.push({
        key: `${category}/${topic.slug}`,
        to: `/${category}/${topic.slug}`,
        title: topic.title,
        kind: 'Topic',
        detail: label,
      });
    }
  }
  for (const problem of problems) {
    hits.push({
      key: `problem/${problem.id}`,
      to: `/problems?q=${encodeURIComponent(problem.title)}`,
      title: problem.title,
      kind: 'Problem',
      detail: problem.difficulty,
    });
  }
  return hits;
}

export default function SearchBox({ onNavigate }: { onNavigate?: () => void }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const location = useLocation();

  const index = useMemo(() => buildIndex(), []);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return index.filter((hit) => hit.title.toLowerCase().includes(q)).slice(0, 8);
  }, [index, query]);

  // Close (and clear) on route change.
  useEffect(() => {
    setOpen(false);
    setQuery('');
  }, [location.pathname, location.search]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open ]);

  const close = () => {
    setOpen(false);
    setQuery('');
    onNavigate?.();
  };

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') {
      setOpen(false);
      setQuery('');
      inputRef.current?.blur();
    } else if (event.key === 'ArrowDown' && results.length > 0) {
      event.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (event.key === 'ArrowUp' && results.length > 0) {
      event.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === 'Enter' && results.length > 0) {
      const hit = results[active] ?? results[0];
      if (hit) {
        // Let the Link handle navigation; mirror its target here for keyboard users.
        document.getElementById(`search-hit-${hit.key}`)?.click();
      }
    }
  }

  return (
    <div className="search-box" ref={boxRef}>
      <label className="search-box__label" htmlFor="site-search">
        Search topics and problems
      </label>
      <input
        id="site-search"
        ref={inputRef}
        type="search"
        className="search-box__input"
        placeholder="Search topics, problems…"
        autoComplete="off"
        role="combobox"
        aria-expanded={open && results.length > 0}
        aria-controls={listId}
        aria-activedescendant={results.length > 0 ? `search-hit-${results[active]?.key}` : undefined}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {open && results.length > 0 ? (
        <ul className="search-box__results" id={listId} role="listbox" aria-label="Search results">
          {results.map((hit, i) => (
            <li key={hit.key} role="option" aria-selected={i === active} id={`search-hit-${hit.key}`}>
              <Link
                to={hit.to}
                className={`search-box__hit${i === active ? ' search-box__hit--active' : ''}`}
                onClick={close}
                tabIndex={-1}
              >
                <span className="search-box__hit-title">{hit.title}</span>
                <span className="search-box__hit-meta">
                  {hit.kind} · {hit.detail}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {open && query.trim().length >= 2 && results.length === 0 ? (
        <p className="search-box__empty" role="status">
          No matches for “{query.trim()}”.
        </p>
      ) : null}
    </div>
  );
}
