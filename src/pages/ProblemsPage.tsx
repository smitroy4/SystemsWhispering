import { useMemo, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageShell } from '../components/layout/index.ts';
import { Badge } from '../components/ui/index.ts';
import type { ProblemDifficulty } from '../types/content.ts';
import { problems } from '../content/problems/index.ts';
import { useSolvedProblems } from '../utils/solvedProblems.ts';
import { usePageMeta } from '../utils/pageMeta.ts';
import './ProblemsPage.css';

const PAGE_SIZE_OPTIONS = [25, 50, 100];
const DEFAULT_PAGE_SIZE = 100;
const DIFFICULTIES: ProblemDifficulty[] = ['Easy', 'Medium', 'Hard'];

function difficultyTone(difficulty: ProblemDifficulty): 'success' | 'warning' | 'danger' {
  if (difficulty === 'Easy') return 'success';
  if (difficulty === 'Medium') return 'warning';
  return 'danger';
}

function parseList(value: string | null): string[] {
  if (!value) return [];
  return value.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
}

export default function ProblemsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { solved, toggleSolved } = useSolvedProblems();

  usePageMeta(
    'Practice Problems',
    'Curated LeetCode practice linked from every topic, with filters and progress tracking.',
  );

  const allDs = useMemo(
    () => [...new Set(problems.flatMap((p) => p.dataStructures))].sort(),
    [],
  );
  const allPatterns = useMemo(
    () => [...new Set(problems.flatMap((p) => p.patterns))].sort(),
    [],
  );

  const activeDs = parseList(searchParams.get('ds')).filter((ds) => allDs.includes(ds));
  const activeDifficulty = searchParams.get('difficulty');
  const difficulty: ProblemDifficulty | null =
    activeDifficulty === 'Easy' || activeDifficulty === 'Medium' || activeDifficulty === 'Hard'
      ? activeDifficulty
      : null;
  const activePattern = searchParams.get('pattern');
  const pattern = activePattern && allPatterns.includes(activePattern) ? activePattern : null;
  const query = (searchParams.get('q') ?? '').trim().toLowerCase();

  const pageParam = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const pageSizeParam = Number.parseInt(searchParams.get('pageSize') ?? String(DEFAULT_PAGE_SIZE), 10);
  const pageSize = PAGE_SIZE_OPTIONS.includes(pageSizeParam) ? pageSizeParam : DEFAULT_PAGE_SIZE;

  const updateParams = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams);
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === '') {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      }
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  // Reset to page 1 only when filters actually change (not on page clicks)
  const filterKey = `${activeDs.join(',')}|${difficulty ?? ''}|${pattern ?? ''}|${query}`;
  const prevFilterKeyRef = useRef(filterKey);

  useEffect(() => {
    if (prevFilterKeyRef.current !== filterKey && page > 1) {
      updateParams({ page: null });
    }
    prevFilterKeyRef.current = filterKey;
  }, [filterKey, page, updateParams]);

  const toggleDs = (ds: string) => {
    const next = activeDs.includes(ds)
      ? activeDs.filter((d) => d !== ds)
      : [...activeDs, ds];
    updateParams({ ds: next.length > 0 ? next.join(',') : null });
  };

  const filtered = problems.filter((problem) => {
    if (activeDs.length > 0 && !activeDs.some((ds) => problem.dataStructures.includes(ds))) {
      return false;
    }
    if (difficulty !== null && problem.difficulty !== difficulty) return false;
    if (pattern !== null && !problem.patterns.includes(pattern)) return false;
    if (query !== '' && !problem.title.toLowerCase().includes(query)) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);

  // Clamp page if it exceeds available pages (e.g. after filtering or page size change)
  useEffect(() => {
    if (safePage !== page) {
      updateParams({ page: String(safePage) });
    }
  }, [safePage, page, pageSize, updateParams]);

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filtered.length);
  const paged = filtered.slice(startIndex, endIndex);

  const hasFilters =
    activeDs.length > 0 || difficulty !== null || pattern !== null || query !== '';
  const clearFilters = () => setSearchParams({}, { replace: true });

  const solvedCount = problems.filter((p) => solved.has(p.id)).length;
  const percent = problems.length === 0 ? 0 : Math.round((solvedCount / problems.length) * 100);
  const byDifficulty = DIFFICULTIES.map((level) => {
    const total = problems.filter((p) => p.difficulty === level).length;
    const done = problems.filter((p) => p.difficulty === level && solved.has(p.id)).length;
    return { level, total, done };
  });

  return (
    <PageShell
      title="Problems"
      description="Curated LeetCode practice linked from every topic. Check off what you solve — progress saves in your browser."
    >
      <section className="problems-progress" aria-label="Solving progress">
        <div className="problems-progress__head">
          <strong>
            {solvedCount} / {problems.length} solved ({percent}%)
          </strong>
          <span className="problems-progress__split">
            {byDifficulty.map(({ level, total, done }) => (
              <span key={level}>
                {level}: {done}/{total}
              </span>
            ))}
          </span>
        </div>
        <div
          className="problems-progress__bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={problems.length}
          aria-valuenow={solvedCount}
          aria-label="Problems solved"
        >
          <div className="problems-progress__fill" style={{ width: `${percent}%` }} />
        </div>
      </section>

      <section className="problems-filters" aria-label="Problem filters">
        <label className="problems-filters__search">
          <span className="problems-filters__label">Search</span>
          <input
            type="search"
            placeholder="Search titles…"
            value={searchParams.get('q') ?? ''}
            onChange={(e) => updateParams({ q: e.target.value })}
          />
        </label>

        <div className="problems-filters__group">
          <span className="problems-filters__label" id="difficulty-label">
            Difficulty
          </span>
          <div className="problems-filters__options" role="group" aria-labelledby="difficulty-label">
            <button
              type="button"
              className={difficulty === null ? 'is-active' : ''}
              aria-pressed={difficulty === null}
              onClick={() => updateParams({ difficulty: null })}
            >
              All
            </button>
            {DIFFICULTIES.map((level) => (
              <button
                key={level}
                type="button"
                className={difficulty === level ? 'is-active' : ''}
                aria-pressed={difficulty === level}
                onClick={() => updateParams({ difficulty: difficulty === level ? null : level })}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <label className="problems-filters__search">
          <span className="problems-filters__label">Pattern</span>
          <select
            value={pattern ?? ''}
            onChange={(e) => updateParams({ pattern: e.target.value || null })}
          >
            <option value="">All patterns</option>
            {allPatterns.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        <label className="problems-filters__search">
          <span className="problems-filters__label">Page size</span>
          <select
            value={String(pageSize)}
            onChange={(e) => {
              const size = Number.parseInt(e.target.value, 10);
              updateParams({ pageSize: String(size), page: '1' });
            }}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={String(size)}>
                {size} per page
              </option>
            ))}
          </select>
        </label>

        <fieldset className="problems-filters__ds">
          <legend>Data structures ({activeDs.length} selected)</legend>
          <div className="problems-filters__options">
            {allDs.map((ds) => (
              <label key={ds} className="problems-filters__check">
                <input
                  type="checkbox"
                  checked={activeDs.includes(ds)}
                  onChange={() => toggleDs(ds)}
                />
                {ds}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="problems-filters__meta">
          <span aria-live="polite">
            Showing {startIndex + 1}–{endIndex} of {filtered.length} problems
          </span>
          {hasFilters ? (
            <button type="button" onClick={clearFilters}>
              Clear filters
            </button>
          ) : null}
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="placeholder">
          <h1>No problems match</h1>
          <p>Loosen the filters to see results.</p>
        </div>
      ) : (
        <>
          <ul className="problems-list">
            {paged.map((problem) => {
              const isSolved = solved.has(problem.id);
              return (
                <li key={problem.id} className={`problem-row${isSolved ? ' is-solved' : ''}`}>
                  <label className="problem-row__check">
                    <input
                      type="checkbox"
                      checked={isSolved}
                      onChange={() => toggleSolved(problem.id)}
                      aria-label={`Mark ${problem.title} as solved`}
                    />
                  </label>
                  <div className="problem-row__main">
                    <Link to={`/problems/${problem.slug}`} className="problem-row__title">
                      {problem.title}
                    </Link>
                    <span className="problem-row__tags">
                      {problem.dataStructures.map((ds) => (
                        <span key={ds} className="problem-row__tag">
                          {ds}
                        </span>
                      ))}
                    </span>
                  </div>
                  <Badge tone={difficultyTone(problem.difficulty)}>{problem.difficulty}</Badge>
                  <a
                    className="problem-row__link leet-link"
                    href={problem.leetcodeUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Solve on LeetCode ↗
                  </a>
                </li>
              );
            })}
          </ul>

          <nav className="problems-pagination" aria-label="Problem pagination">
            <button
              type="button"
              className={`problems-pagination__btn${safePage === 1 ? ' is-disabled' : ''}`}
              disabled={safePage === 1}
              onClick={() => updateParams({ page: String(safePage - 1) })}
            >
              ← Prev
            </button>

            <span className="problems-pagination__page-info">
              Page {safePage} of {totalPages}
            </span>

            <div className="problems-pagination__pages">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`problems-pagination__page${p === safePage ? ' is-active' : ''}`}
                  onClick={() => updateParams({ page: String(p) })}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              type="button"
              className={`problems-pagination__btn${safePage === totalPages ? ' is-disabled' : ''}`}
              disabled={safePage === totalPages}
              onClick={() => updateParams({ page: String(safePage + 1) })}
            >
              Next →
            </button>
          </nav>
        </>
      )}
    </PageShell>
  );
}
