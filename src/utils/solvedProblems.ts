import { useCallback, useState } from 'react';

const STORAGE_KEY = 's4j-dsa-solved-problems';

function loadSolved(): Set<string> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id): id is string => typeof id === 'string'));
  } catch {
    return new Set();
  }
}

/** Solved-problem ids persisted in localStorage across refreshes. */
export function useSolvedProblems() {
  const [solved, setSolved] = useState<Set<string>>(loadSolved);

  const toggleSolved = useCallback((id: string) => {
    setSolved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // Storage unavailable (private mode, quota): keep in-memory state.
      }
      return next;
    });
  }, []);

  return { solved, toggleSolved };
}
