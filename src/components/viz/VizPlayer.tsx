import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import type { VizStep } from '../../types/content.ts';
import './VizPlayer.css';

interface VizPlayerProps {
  /** Precomputed frames driving the animation. Engine is generic: steps are data. */
  steps: VizStep[];
  /** Renders the current frame (SVG scene). Receives undefined when there are no steps. */
  render: (step: VizStep | undefined) => ReactNode;
  /** Start playing as soon as the player mounts. */
  autoPlay?: boolean;
}

const MIN_SPEED = 0.5;
const MAX_SPEED = 3;
const SPEED_STEP = 0.5;

/** Autoplay is disabled when the user prefers reduced motion. */
function autoPlayAllowed(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Generic step-engine player: Play, Pause, Next, Prev, Reset, Speed,
 * step counter, progress bar, caption, and keyboard controls.
 * Topic-specific drawing happens in `render`; this component owns only playback.
 */
export default function VizPlayer({ steps, render, autoPlay = false }: VizPlayerProps) {
  const total = steps.length;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(() => autoPlay && autoPlayAllowed() && total > 0);
  const [speed, setSpeed] = useState(1);
  const timer = useRef<number | null>(null);

  const current = total > 0 ? steps[Math.min(index, total - 1)] : undefined;

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      setPlaying(false);
      setIndex(Math.max(0, Math.min(next, total - 1)));
    },
    [total],
  );

  const toggle = useCallback(() => {
    if (total === 0) return;
    setPlaying((prev) => {
      // Restart from the beginning when pressing play at the last frame.
      if (!prev && index >= total - 1) setIndex(0);
      return !prev;
    });
  }, [total, index]);

  const reset = useCallback(() => {
    setPlaying(false);
    setIndex(0);
  }, []);

  useEffect(() => {
    if (!playing || total === 0) return;
    if (index >= total - 1) {
      setPlaying(false);
      return;
    }
    timer.current = window.setTimeout(() => {
      setIndex((i) => Math.min(i + 1, total - 1));
    }, 1000 / speed);
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [playing, index, speed, total]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;
    const tag = target?.tagName;
    // Let native controls (slider, select, text fields) handle their own keys.
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
    // A focused button already activates on Space — don't double-handle it.
    if (event.key === ' ' && tag === 'BUTTON') return;
    if (event.key === ' ' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      if (event.key === ' ') toggle();
      else if (event.key === 'ArrowRight') goTo(index + 1);
      else goTo(index - 1);
    }
  }

  const progress = total === 0 ? 0 : ((index + 1) / total) * 100;

  return (
    <div
      className="viz-player"
      tabIndex={0}
      role="region"
      aria-label="Visualization player. Press Space to play or pause, arrow keys to step."
      onKeyDown={handleKeyDown}
    >
      <div className="viz-player__stage" aria-live="polite">
        {render(current)}
      </div>
      <p className="viz-player__caption">
        {current?.description ?? 'No steps to show yet.'}
      </p>
      <div
        className="viz-player__progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={total === 0 ? 0 : index + 1}
        aria-label="Playback progress"
      >
        <div className="viz-player__progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="viz-player__controls">
        <button
          type="button"
          onClick={toggle}
          disabled={total === 0}
          aria-pressed={playing}
          aria-label={playing ? 'Pause animation' : 'Play animation'}
        >
          {playing ? 'Pause' : 'Play'}
        </button>
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={total === 0 || index === 0}
          aria-label="Previous step"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={total === 0 || index >= total - 1}
          aria-label="Next step"
        >
          Next
        </button>
        <button type="button" onClick={reset} disabled={total === 0} aria-label="Reset animation">
          Reset
        </button>
        <label className="viz-player__speed">
          Speed
          <input
            type="range"
            min={MIN_SPEED}
            max={MAX_SPEED}
            step={SPEED_STEP}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            aria-label="Playback speed"
          />
          <span className="viz-player__speed-value">{speed.toFixed(1)}x</span>
        </label>
        <span className="viz-player__count" aria-label="Step counter">
          {total === 0 ? '0 / 0' : `${index + 1} / ${total}`}
        </span>
      </div>
    </div>
  );
}
