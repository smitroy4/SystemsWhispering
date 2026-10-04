import { useCallback, useState } from 'react';

function storageKey(sheetSlug: string): string {
  return `s4j-sheet-progress-${sheetSlug}`;
}

function loadCompleted(sheetSlug: string): Set<number> {
  try {
    const raw = window.localStorage.getItem(storageKey(sheetSlug));
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(
      parsed.filter((day): day is number => typeof day === 'number' && Number.isInteger(day)),
    );
  } catch {
    return new Set();
  }
}

/** Per-day completion for one sheet, persisted in localStorage. */
export function useSheetProgress(sheetSlug: string) {
  const [completed, setCompleted] = useState<Set<number>>(() => loadCompleted(sheetSlug));

  const toggleDay = useCallback(
    (day: number) => {
      setCompleted((prev) => {
        const next = new Set(prev);
        if (next.has(day)) {
          next.delete(day);
        } else {
          next.add(day);
        }
        try {
          window.localStorage.setItem(storageKey(sheetSlug), JSON.stringify([...next]));
        } catch {
          // Storage unavailable (private mode, quota): keep in-memory state.
        }
        return next;
      });
    },
    [sheetSlug],
  );

  return { completed, toggleDay };
}
