import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import { ArrayCells } from '../primitives.tsx';
import type { CellPointer, CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface GreedyState {
  values: number[];
  tones: CellTone[];
  pointers: CellPointer[];
  panel: StateEntry[];
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

/** Jump Game II on [2, 3, 1, 1, 4]: stretch reach, jump on exhaustion. */
function buildSteps(): VizStep[] {
  const values = [2, 3, 1, 1, 4];
  const steps: VizStep[] = [];
  let jumps = 0;
  let end = 0;
  let farthest = 0;

  const snap = (id: string, description: string, i: number, tone: CellTone): void => {
    steps.push({
      id,
      description,
      state: {
        values,
        tones: values.map((_, k) => {
          if (k === i) return tone;
          if (k <= end) return DONE;
          return D;
        }),
        pointers: [
          { label: `i=${i}`, index: i },
          { label: `end=${end}`, index: end },
        ],
        panel: [
          { label: 'i', value: String(i) },
          { label: 'reach', value: String(farthest) },
          { label: 'end', value: String(end) },
          { label: 'jumps', value: String(jumps) },
        ],
      } satisfies GreedyState,
      highlight: [i],
    });
  };

  snap('start', `Min jumps across [${values.join(', ')}]. Track farthest reach; jump when position exhausts the current leap.`, 0, A);

  for (let i = 0; i < values.length - 1; i++) {
    farthest = Math.max(farthest, i + values[i]);
    if (i === end) {
      jumps++;
      end = farthest;
      snap(`jump-${i}`, `i = ${i} reached the leap edge: JUMP ${jumps}, new edge = ${end}. Farthest seen: ${farthest}.`, i, S);
    } else {
      snap(`scan-${i}`, `i = ${i}: reach stretches to ${farthest} (via +${values[i]}). No jump yet — edge is ${end}.`, i, A);
    }
  }

  steps.push({
    id: 'done',
    description: `Done: ${jumps} jumps. One pass, three variables: O(n) time, O(1) space.`,
    state: {
      values,
      tones: values.map(() => DONE),
      pointers: [],
      panel: [
        { label: 'jumps', value: String(jumps) },
        { label: 'reach', value: String(farthest) },
      ],
    } satisfies GreedyState,
    highlight: [],
  });
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as GreedyState;
  return (
    <div className="algo-scene">
      <ArrayCells values={state.values} tones={state.tones} pointers={state.pointers} />
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function GreedyViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
