import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import { ArrayCells } from '../primitives.tsx';
import type { CellPointer, CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface BinaryState {
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

/** Search 12 in [2, 4, 7, 9, 12, 15, 21]: mids 9, 15, then 12. */
function buildSteps(): VizStep[] {
  const values = [2, 4, 7, 9, 12, 15, 21];
  const target = 12;
  const steps: VizStep[] = [];
  let left = 0;
  let right = values.length - 1;
  let checks = 0;

  const snapshot = (
    id: string,
    description: string,
    mid: number,
    midTone: CellTone,
    extra: StateEntry[] = [],
  ): VizStep => ({
    id,
    description,
    state: {
      values,
      tones: values.map((_, k) => {
        if (k === mid) return midTone;
        if (k >= left && k <= right) return C;
        return D;
      }),
      pointers: [
        { label: `left=${left}`, index: left },
        { label: `mid=${mid}`, index: mid },
        { label: `right=${right}`, index: right },
      ],
      panel: [
        { label: 'target', value: String(target) },
        { label: 'left', value: String(left) },
        { label: 'mid', value: String(mid) },
        { label: 'right', value: String(right) },
        { label: 'checks', value: String(checks) },
        ...extra,
      ],
    } satisfies BinaryState,
    highlight: [mid],
  });

  steps.push(
    snapshot('start', `Search for ${target} in a sorted array of ${values.length}. Range starts whole: [0, 6].`, 3, A),
  );

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    checks++;
    if (values[mid] === target) {
      steps.push(
        snapshot(`found-${mid}`, `a[${mid}] == ${target}: found in ${checks} checks. log₂7 ≈ 3 — that is the point.`, mid, S, [
          { label: 'result', value: String(mid) },
        ]),
      );
      break;
    }
    if (values[mid] < target) {
      steps.push(
        snapshot(`go-right-${mid}`, `a[${mid}] = ${values[mid]} < ${target}: discard the left half, left = ${mid + 1}.`, mid, A),
      );
      left = mid + 1;
    } else {
      steps.push(
        snapshot(`go-left-${mid}`, `a[${mid}] = ${values[mid]} > ${target}: discard the right half, right = ${mid - 1}.`, mid, A),
      );
      right = mid - 1;
    }
  }

  steps.push({
    id: 'done',
    description: `Done: ${target} at index 4 after ${checks} checks. Each step halves n: O(log n).`,
    state: {
      values,
      tones: values.map((_, k) => (k === 4 ? DONE : D)),
      pointers: [],
      panel: [
        { label: 'target', value: String(target) },
        { label: 'checks', value: String(checks) },
        { label: 'result', value: '4' },
      ],
    } satisfies BinaryState,
    highlight: [],
  });
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as BinaryState;
  return (
    <div className="algo-scene">
      <ArrayCells values={state.values} tones={state.tones} pointers={state.pointers} />
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function BinarySearchViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
