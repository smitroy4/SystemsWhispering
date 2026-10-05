import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { ArrayCells } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface ArraysOpsState {
  values: number[];
  tones: CellTone[];
  status: string;
}

function frame(
  id: string,
  description: string,
  values: number[],
  tones: CellTone[],
  status: string,
): VizStep {
  return { id, description, state: { values, tones, status } satisfies ArraysOpsState, highlight: [] };
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

function toneRow(n: number, on: number[], tone: CellTone): CellTone[] {
  return Array.from({ length: n }, (_, i) => (on.includes(i) ? tone : D));
}

/** fill → copyOf (pads) → fill range. Mirrors the ArraysIdioms snippet. */
function buildSteps(): VizStep[] {
  return [
    frame('start', 'Start: new int[5] — zeros by default. Every slot defined, none chosen.', [0, 0, 0, 0, 0], toneRow(5, [], D), 'new int[5]'),
    frame('fill', 'Arrays.fill(a, 7): one call, no loop. All five slots chosen at once.', [7, 7, 7, 7, 7], toneRow(5, [0, 1, 2, 3, 4], S), 'fill(a, 7)'),
    frame('copy', 'copyOf(a, 8): fresh array, contents copied, tail padded with 0s.', [7, 7, 7, 7, 7, 0, 0, 0], toneRow(8, [5, 6, 7], S), 'copyOf(a, 8) — new array!'),
    frame('range', 'fill(a, 5, 8, -1): ranges are [from, to) — the tail becomes sentinels.', [7, 7, 7, 7, 7, -1, -1, -1], toneRow(8, [5, 6, 7], S), 'fill(a, 5, 8, -1)'),
    frame('done', 'Done: fill, copy, range-fill — and the original never changed size. Assign the copy.', [7, 7, 7, 7, 7, -1, -1, -1], toneRow(8, [], D).map(() => DONE), 'copyOf returns — assign it'),
  ];
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as ArraysOpsState;
  return (
    <>
      <ArrayCells values={state.values} tones={state.tones} ariaLabel="Arrays fill and copy" />
      <p className="viz-statusline">{state.status}</p>
    </>
  );
}

export default function ArraysFillCopyViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
