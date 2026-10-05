import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { BarChart } from '../primitives.tsx';
import type { CellPointer, CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface MonotonicState {
  tones: CellTone[];
  pointers: CellPointer[];
  stack: number[];
  answers: Array<number | null>;
}

const VALUES = [4, 5, 2, 10, 8];

function frame(
  id: string,
  description: string,
  tones: CellTone[],
  pointers: CellPointer[],
  stack: number[],
  answers: Array<number | null>,
): VizStep {
  return { id, description, state: { tones, pointers, stack, answers } satisfies MonotonicState, highlight: [] };
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

function toneOf(active: number[], settled: number[]): CellTone[] {
  return VALUES.map((_, i) => {
    if (active.includes(i)) return A;
    if (settled.includes(i)) return S;
    return D;
  });
}

/** Next greater element over [4, 5, 2, 10, 8] — pop while smaller. */
function buildSteps(): VizStep[] {
  const none: Array<number | null> = [null, null, null, null, null];
  return [
    frame('start', 'Start: find each bar’s next greater element. The stack stays decreasing.', toneOf([], []), [], [], none),
    frame('i0', 'i=0 (4): stack empty — push 0. Decreasing so far: [4].', toneOf([0], []), [{ label: 'i=0', index: 0 }], [0], none),
    frame('i1', 'i=1 (5): 5 > 4 — pop 0, its answer is 5. Push 1.', toneOf([1], [0]), [{ label: 'i=1', index: 1 }], [1], [5, null, null, null, null]),
    frame('i2', 'i=2 (2): 2 < 5 — push 2. Stack [5, 2] still decreasing.', toneOf([1, 2], [0]), [{ label: 'i=2', index: 2 }], [1, 2], [5, null, null, null, null]),
    frame('i3', 'i=3 (10): pops 2, then 1 — both found 10. Push 3. Two settles, one pass.', toneOf([3], [0, 1, 2]), [{ label: 'i=3', index: 3 }], [3], [5, 10, 10, null, null]),
    frame('i4', 'i=4 (8): 8 < 10 — push 4. End of array with [10, 8] unpopped.', toneOf([3, 4], [0, 1, 2]), [{ label: 'i=4', index: 4 }], [3, 4], [5, 10, 10, null, null]),
    frame('done', 'Done: leftovers get -1 → [5, 10, 10, -1, -1]. Each index pushed and popped once: O(n).', [DONE, DONE, DONE, DONE, DONE], [], [], [5, 10, 10, -1, -1]),
  ];
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as MonotonicState;
  const settled = state.answers.map((a) => (a === null ? '·' : a > 0 ? a : -1));
  return (
    <>
      <BarChart values={VALUES} tones={state.tones} pointers={state.pointers} ariaLabel="Next greater element scan" />
      <p className="viz-statusline">
        stack = <strong>[{state.stack.join(', ')}]</strong>
        {' · '}next-greater = <strong>[{settled.join(', ')}]</strong>
      </p>
    </>
  );
}

export default function MonotonicViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
