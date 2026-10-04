import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import { ArrayCells } from '../primitives.tsx';
import type { CellPointer, CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface TwoPointerState {
  values: number[];
  tones: CellTone[];
  pointers: CellPointer[];
  panel: StateEntry[];
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

/** Two Sum II on [2, 7, 11, 15], target 9: 2+15 too big, then 2+7 hits. */
function buildSteps(): VizStep[] {
  const values = [2, 7, 11, 15];
  const target = 9;
  const steps: VizStep[] = [];
  let left = 0;
  let right = values.length - 1;

  const snap = (id: string, description: string, l: number, r: number, tone: CellTone): void => {
    steps.push({
      id,
      description,
      state: {
        values,
        tones: values.map((_, k) => (k === l || k === r ? tone : D)),
        pointers: [
          { label: `left=${l}`, index: l },
          { label: `right=${r}`, index: r },
        ],
        panel: [
          { label: 'target', value: String(target) },
          { label: 'left', value: `${l} (${values[l]})` },
          { label: 'right', value: `${r} (${values[r]})` },
          { label: 'sum', value: String(values[l] + values[r]) },
        ],
      } satisfies TwoPointerState,
      highlight: [l, r],
    });
  };

  snap('start', `Find two summing to ${target} in sorted [${values.join(', ')}]. Pointers start at both ends.`, left, right, A);

  while (left < right) {
    const sum = values[left] + values[right];
    if (sum === target) {
      snap(`found-${left}-${right}`, `${values[left]} + ${values[right]} = ${target}: answer [${left + 1}, ${right + 1}] (1-based).`, left, right, S);
      break;
    }
    if (sum > target) {
      snap(`shrink-${left}-${right}`, `${values[left]} + ${values[right]} = ${sum} > ${target}: ${values[right]} is too big with anyone — right--.`, left, right, A);
      right--;
    } else {
      snap(`grow-${left}-${right}`, `${values[left]} + ${values[right]} = ${sum} < ${target}: ${values[left]} is too small with anyone — left++.`, left, right, A);
      left++;
    }
  }

  steps.push({
    id: 'done',
    description: `Done: indices [1, 2] in one pass. Each step discards a candidate: O(n), O(1) space.`,
    state: {
      values,
      tones: values.map((_, k) => (k === 0 || k === 1 ? DONE : D)),
      pointers: [],
      panel: [
        { label: 'target', value: String(target) },
        { label: 'result', value: '[1, 2]' },
      ],
    } satisfies TwoPointerState,
    highlight: [],
  });
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as TwoPointerState;
  return (
    <div className="algo-scene">
      <ArrayCells values={state.values} tones={state.tones} pointers={state.pointers} />
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function TwoPointersViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
