import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import { ArrayCells } from '../primitives.tsx';
import type { CellPointer, CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface LinearState {
  values: number[];
  tones: CellTone[];
  pointers: CellPointer[];
  panel: StateEntry[];
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const C: CellTone = 'compared';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

/** Scan [7, 2, 9, 4, 6] for target 4 — found at index 3. */
function buildSteps(): VizStep[] {
  const values = [7, 2, 9, 4, 6];
  const target = 4;
  const steps: VizStep[] = [
    {
      id: 'start',
      description: `Search for ${target} in [${values.join(', ')}]. Check each element in order.`,
      state: {
        values,
        tones: values.map(() => D),
        pointers: [{ label: 'i=0', index: 0 }],
        panel: [
          { label: 'target', value: String(target) },
          { label: 'i', value: '0' },
          { label: 'checks', value: '0' },
        ],
      } satisfies LinearState,
      highlight: [0],
    },
  ];

  let checks = 0;
  for (let i = 0; i < values.length; i++) {
    checks++;
    if (values[i] === target) {
      steps.push({
        id: `found-${i}`,
        description: `a[${i}] == ${target}: found after ${checks} checks.`,
        state: {
          values,
          tones: values.map((_, k) => (k === i ? S : k < i ? C : D)),
          pointers: [{ label: `i=${i}`, index: i }],
          panel: [
            { label: 'target', value: String(target) },
            { label: 'i', value: String(i) },
            { label: 'checks', value: String(checks) },
            { label: 'result', value: String(i) },
          ],
        } satisfies LinearState,
        highlight: [i],
      });
      break;
    }
    steps.push({
      id: `miss-${i}`,
      description: `a[${i}] = ${values[i]} ≠ ${target}: move on.`,
      state: {
        values,
        tones: values.map((_, k) => (k === i ? A : k < i ? C : D)),
        pointers: [{ label: `i=${i}`, index: i }],
        panel: [
          { label: 'target', value: String(target) },
          { label: 'i', value: String(i) },
          { label: 'checks', value: String(checks) },
        ],
      } satisfies LinearState,
      highlight: [i],
    });
  }

  steps.push({
    id: 'done',
    description: `Done: target ${target} found at index 3 in ${checks} checks. Worst case visits all n elements: O(n).`,
    state: {
      values,
      tones: values.map((_, k) => (k <= 3 ? DONE : D)),
      pointers: [],
      panel: [
        { label: 'target', value: String(target) },
        { label: 'checks', value: String(checks) },
        { label: 'result', value: '3' },
      ],
    } satisfies LinearState,
    highlight: [],
  });
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as LinearState;
  return (
    <div className="algo-scene">
      <ArrayCells values={state.values} tones={state.tones} pointers={state.pointers} />
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function LinearSearchViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
