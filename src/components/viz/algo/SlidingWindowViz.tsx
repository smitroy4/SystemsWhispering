import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import { ArrayCells } from '../primitives.tsx';
import type { CellPointer, CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface WindowState {
  values: number[];
  tones: CellTone[];
  pointers: CellPointer[];
  panel: StateEntry[];
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

/** Max sum of k=3 on [2, 1, 5, 1, 3, 2]: windows 8, 7, 9, 6 → best 9. */
function buildSteps(): VizStep[] {
  const values = [2, 1, 5, 1, 3, 2];
  const k = 3;
  const steps: VizStep[] = [];
  let window = 0;
  let best = 0;

  const snap = (id: string, description: string, left: number, right: number, tone: CellTone): void => {
    steps.push({
      id,
      description,
      state: {
        values,
        tones: values.map((_, idx) => (idx >= left && idx <= right ? tone : D)),
        pointers: [
          { label: `left=${left}`, index: left },
          { label: `right=${right}`, index: right },
        ],
        panel: [
          { label: 'k', value: String(k) },
          { label: 'window', value: `[${left}, ${right}]` },
          { label: 'sum', value: String(window) },
          { label: 'best', value: String(best) },
        ],
      } satisfies WindowState,
      highlight: [left, right],
    });
  };

  snap(`intro`, `Max sum of ${k} consecutive in [${values.join(', ')}]. Expand right to build the first window.`, 0, 0, D);
  for (let right = 0; right < values.length; right++) {
    window += values[right];
    if (right < k - 1) {
      snap(`grow-${right}`, `Add a[${right}] = ${values[right]}: sum = ${window}, window not full yet.`, 0, right, A);
      continue;
    }
    if (right === k - 1) {
      best = window;
      snap(`first-${right}`, `Window [0, ${right}] complete: sum = ${window}. Best = ${best}.`, 0, right, S);
      continue;
    }
    const left = right - k + 1;
    window -= values[left - 1];
    const improved = window > best;
    if (improved) best = window;
    snap(
      `slide-${right}`,
      `Slide to [${left}, ${right}]: +${values[right]}, −${values[left - 1]} → sum = ${window}.${improved ? ` New best ${best}!` : ` Best stays ${best}.`}`,
      left,
      right,
      improved ? S : A,
    );
  }

  steps.push({
    id: 'done',
    description: `Done: best window sum = ${best}. Each element added and removed once: O(n).`,
    state: {
      values,
      tones: values.map((_, idx) => (idx >= 1 && idx <= 3 ? DONE : D)),
      pointers: [],
      panel: [
        { label: 'k', value: String(k) },
        { label: 'best', value: String(best) },
        { label: 'window', value: '[1, 3]' },
      ],
    } satisfies WindowState,
    highlight: [],
  });
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as WindowState;
  return (
    <div className="algo-scene">
      <ArrayCells values={state.values} tones={state.tones} pointers={state.pointers} />
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function SlidingWindowViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
