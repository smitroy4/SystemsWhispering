import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import { ArrayCells, StackView } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface BacktrackState {
  values: number[];
  tones: CellTone[];
  path: number[];
  panel: StateEntry[];
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

/** All subsets of [1, 2, 3]: include/exclude with undo, DFS order. */
function buildSteps(): VizStep[] {
  const values = [1, 2, 3];
  const steps: VizStep[] = [];
  const found: number[][] = [];

  const snap = (id: string, description: string, index: number, path: number[], done = false): void => {
    steps.push({
      id,
      description,
      state: {
        values,
        tones: values.map((_, k) => {
          if (done) return DONE;
          if (k === index) return A;
          if (k < index && path.includes(values[k])) return S;
          if (k < index) return DONE;
          return D;
        }),
        path: [...path],
        panel: [
          { label: 'index i', value: String(index) },
          { label: 'path', value: path.length === 0 ? '[]' : `[${path.join(', ')}]` },
          { label: 'found', value: String(found.length) },
        ],
      } satisfies BacktrackState,
      highlight: index < values.length ? [index] : [],
    });
  };

  snap('start', 'Subsets of [1, 2, 3]: at each index, include the element or exclude it. Path starts empty.', 0, []);

  const dfs = (i: number, path: number[]): void => {
    if (i === values.length) {
      found.push([...path]);
      snap(`record-${found.length}`, `i = 3, end reached: record [${path.join(', ')}] (${found.length} of 8).`, i, path);
      return;
    }
    path.push(values[i]);
    snap(`include-${i}-${found.length}`, `Include ${values[i]}: path = [${path.join(', ')}]. Recurse to ${i + 1}.`, i + 1, path);
    dfs(i + 1, path);
    path.pop();
    snap(`exclude-${i}-${found.length}`, `Backtrack: remove ${values[i]}, path = [${path.join(', ')}]. Now exclude it.`, i + 1, path);
    dfs(i + 1, path);
  };
  dfs(0, []);

  steps.push({
    id: 'done',
    description: `Done: ${found.length} subsets recorded. Decision tree has 2³ leaves: O(n · 2ⁿ) with copying.`,
    state: {
      values,
      tones: values.map(() => DONE),
      path: [],
      panel: [
        { label: 'subsets', value: String(found.length) },
        { label: 'cost', value: 'O(n · 2ⁿ)' },
      ],
    } satisfies BacktrackState,
    highlight: [],
  });
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as BacktrackState;
  return (
    <div className="algo-scene">
      <div>
        <p className="viz-array-label">candidates (i = deciding index)</p>
        <ArrayCells
          values={state.values}
          tones={state.tones}
          pointers={[]}
        />
        <p className="viz-array-label">current path (undo on backtrack)</p>
        <StackView values={state.path} tones={state.path.map(() => S)} topLabel="top" />
      </div>
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function BacktrackingViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
