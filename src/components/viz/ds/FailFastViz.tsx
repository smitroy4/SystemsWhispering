import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { ArrayCells } from '../primitives.tsx';
import type { CellPointer, CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface FailFastState {
  cells: Array<number | string>;
  tones: CellTone[];
  cursor: number;
  modCount: number;
  expected: number;
  verdict: string;
}

function frame(
  id: string,
  description: string,
  cells: Array<number | string>,
  tones: CellTone[],
  cursor: number,
  modCount: number,
  expected: number,
  verdict: string,
): VizStep {
  return { id, description, state: { cells, tones, cursor, modCount, expected, verdict } satisfies FailFastState, highlight: [] };
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const C: CellTone = 'compared';
const A: CellTone = 'active';
const DONE: CellTone = 'done';

function toneRow(n: number, on: number[], tone: CellTone): CellTone[] {
  return Array.from({ length: n }, (_, i) => (on.includes(i) ? tone : D));
}

/** Iterate, mutate behind the cursor's back, trip the check, then do it right. */
function buildSteps(): VizStep[] {
  return [
    frame('start', 'Start: list [A, B, C]. iterator() snapshots expectedModCount = modCount = 0.', ['A', 'B', 'C'], toneRow(3, [], D), 0, 0, 0, 'modCount = 0 · expected = 0 — in sync'),
    frame('next-a', 'next(): cursor checks counts (match), returns A, advances to 1.', ['A', 'B', 'C'], toneRow(3, [0], S), 1, 0, 0, 'returned A · cursor = 1'),
    frame('sneak', 'list.add("D") behind the iterator’s back: modCount → 1. The cursor still expects 0.', ['A', 'B', 'C', 'D'], toneRow(4, [3], S), 1, 1, 0, 'modCount = 1 · expected = 0 — DESYNCED'),
    frame('boom', 'next(): counts differ → ConcurrentModificationException. Loud failure beats silent skipping.', ['A', 'B', 'C', 'D'], toneRow(4, [1], A), 1, 1, 0, 'next() throws ConcurrentModificationException'),
    frame('right-way', 'The fix: it.remove() after next() — the cursor deletes AND resyncs expectedModCount.', ['A', 'C', 'D'], toneRow(3, [0], C), 0, 2, 2, 'it.remove() → counts resynced, traversal continues'),
    frame('done', 'Done: iterators are single-use cursors with a tripwire — mutate through them or not at all.', ['A', 'C', 'D'], toneRow(3, [], D).map(() => DONE), 3, 2, 2, 'modCount = 2 · expected = 2 — in sync'),
  ];
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as FailFastState;
  const pointers: CellPointer[] = state.cursor < state.cells.length ? [{ label: 'cursor', index: state.cursor }] : [];
  return (
    <>
      <ArrayCells values={state.cells} tones={state.tones} pointers={pointers} ariaLabel={`List with iterator cursor at ${state.cursor}`} />
      <p className="viz-statusline">
        modCount = <strong>{state.modCount}</strong>
        {' · '}expected = <strong>{state.expected}</strong>
        {' · '}{state.verdict}
      </p>
    </>
  );
}

export default function FailFastViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
