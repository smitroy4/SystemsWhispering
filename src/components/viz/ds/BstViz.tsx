import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import TreeScene from './treeScene.tsx';
import type { TreeSceneEdge } from './treeScene.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface BstState {
  values: Array<number | null>;
  tones: CellTone[];
  edge: TreeSceneEdge | null;
}

function frame(
  id: string,
  description: string,
  values: Array<number | null>,
  tones: CellTone[],
  edge: TreeSceneEdge | null = null,
): VizStep {
  return {
    id,
    description,
    state: { values, tones, edge } satisfies BstState,
    highlight: [],
  };
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const C: CellTone = 'compared';
const DONE: CellTone = 'done';

/** Insert 50, 30, 70, 20, 40 by comparisons, then search 40. */
function buildSteps(): VizStep[] {
  const T = (active: number[], settled: number[], activeTone: CellTone = A): CellTone[] =>
    Array.from({ length: 7 }, (_, i) => {
      if (active.includes(i)) return activeTone;
      if (settled.includes(i)) return DONE;
      return D;
    });

  let v: Array<number | null> = [null, null, null, null, null, null, null];
  const steps: VizStep[] = [
    frame('start', 'Start: empty BST. Insert 50, 30, 70, 20, 40 — smaller left, larger right.', v, T([], [])),
  ];

  v = [50, null, null, null, null, null, null];
  steps.push(frame('insert-50', 'Insert 50: empty tree, it becomes the root.', v, T([0], [], S)));
  steps.push(frame('cmp-30', 'Insert 30: compare with 50 — smaller, go LEFT.', v, T([0], []), { from: 0, to: 1 }));
  v = [50, 30, null, null, null, null, null];
  steps.push(frame('insert-30', 'Slot is empty — 30 lands as the left child.', v, T([1], [0], S)));
  steps.push(frame('cmp-70', 'Insert 70: compare with 50 — larger, go RIGHT.', v, T([0], [1]), { from: 0, to: 2 }));
  v = [50, 30, 70, null, null, null, null];
  steps.push(frame('insert-70', 'Slot is empty — 70 lands as the right child.', v, T([2], [0, 1], S)));
  steps.push(frame('walk-20a', 'Insert 20: 20 < 50, go left.', v, T([0], [1, 2]), { from: 0, to: 1 }));
  steps.push(frame('walk-20b', '20 < 30, go left again.', v, T([1], [0, 2]), { from: 1, to: 3 }));
  v = [50, 30, 70, 20, null, null, null];
  steps.push(frame('insert-20', 'Empty slot — 20 lands deep left.', v, T([3], [0, 1, 2], S)));
  steps.push(frame('walk-40', 'Insert 40: right past 50, then 40 > 30 — go right.', v, T([0, 1], [2, 3]), { from: 1, to: 4 }));
  v = [50, 30, 70, 20, 40, null, null];
  steps.push(frame('insert-40', 'Empty slot — 40 lands as the right child of 30.', v, T([4], [0, 1, 2, 3], S)));
  steps.push(frame('search-40a', 'Search 40: 40 < 50, go left.', v, T([0], [1, 2, 3, 4], C), { from: 0, to: 1 }));
  steps.push(frame('search-40b', '40 > 30, go right.', v, T([1], [0, 2, 3, 4], C), { from: 1, to: 4 }));
  steps.push(frame('search-40c', '40 == 40 — found in 3 comparisons. Depth rules the cost.', v, T([4], [0, 1, 2, 3], S)));
  steps.push(frame('done', 'Done. Every insert/search walks one root-to-leaf path: O(h).', v, T([], [0, 1, 2, 3, 4])));

  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as BstState;
  return <TreeScene values={state.values} tones={state.tones} activeEdge={state.edge} />;
}

export default function BstViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
