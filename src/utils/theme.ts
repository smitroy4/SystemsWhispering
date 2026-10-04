import { useCallback, useEffect, useState } from 'react';

export type ThemeMode = 'system' | 'light' | 'dark';
export type Theme = 'light' | 'dark';

const STORAGE_KEY = 's4j-dsa-theme';

const MODE_ORDER: ThemeMode[] = ['system', 'light', 'dark'];

function prefersDark(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  // Migrate the previous light/dark-only preference.
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  return 'system';
}

function resolveTheme(mode: ThemeMode): Theme {
  if (mode === 'light') return 'light';
  if (mode === 'dark') return 'dark';
  return prefersDark() ? 'dark' : 'light';
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);
  const [resolved, setResolved] = useState<Theme>(() => resolveTheme(getInitialMode()));

  useEffect(() => {
    const apply = (next: Theme) => {
      setResolved(next);
      document.documentElement.setAttribute('data-theme', next);
    };
    apply(resolveTheme(mode));
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Storage unavailable: theme still applies for this session.
    }
    if (mode !== 'system' || typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => apply(query.matches ? 'dark' : 'light');
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [mode]);

  const cycleMode = useCallback(() => {
    // Advance to the next mode whose *resolved* theme actually differs.
    // Otherwise dark → system (on a dark OS) would look like a dead click.
    setMode((prev) => {
      const current = resolveTheme(prev);
      for (let step = 1; step <= MODE_ORDER.length; step += 1) {
        const candidate =
          MODE_ORDER[(MODE_ORDER.indexOf(prev) + step) % MODE_ORDER.length] ?? 'system';
        if (resolveTheme(candidate) !== current) return candidate;
      }
      return prev;
    });
  }, []);

  return { mode, resolved, setMode, cycleMode };
}
