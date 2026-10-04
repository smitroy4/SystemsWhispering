import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { ArrayCells } from '../primitives.tsx';
import TreeScene from './treeScene.tsx';
import type { TreeSceneEdge } from './treeScene.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface HeapState {
  heap: Array<number | null>;
  tones: CellTone[];
  edge: TreeSceneEdge | null;
}

function frame(
  id: string,
  description: string,
  heap: Array<number | null>,
  tones: CellTone[],
  edge: TreeSceneEdge | null = null,
): VizStep {
  return {
    id,
    description,
    state: { heap, tones, edge } satisfies HeapState,
    highlight: [],
  };
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

const T = (active: number[], settled: number[], tone: CellTone = A, n = 7): CellTone[] =>
  Array.from({ length: n }, (_, i) => {
    if (active.includes(i)) return tone;
    if (settled.includes(i)) return DONE;
    return D;
  });

/** Max-heap: insert 70 (bubble up), then extract max (bubble down). */
function buildSteps(): VizStep[] {
  return [
    frame('start', 'Start: valid max-heap [50, 30, 20, 10, 15]. Every parent ≥ its children.', [50, 30, 20, 10, 15, null, null], T([], [])),
    frame('append-70', 'Insert 70: append at the end (index 5). Its parent is 20 at index 2.', [50, 30, 20, 10, 15, 70, null], T([5], [], S)),
    frame('swap-20', '70 > parent 20: swap. Bubble up continues.', [50, 30, 70, 10, 15, 20, null], T([2, 5], [], S), { from: 2, to: 5 }),
    frame('swap-50', '70 > parent 50: swap. 70 reaches the root — insert done in O(log n).', [70, 30, 50, 10, 15, 20, null], T([0, 2], [], S), { from: 0, to: 2 }),
    frame('extract-move', 'Extract max: save 70, move the LAST element (20) to the root.', [20, 30, 50, 10, 15, null, null], T([0], [], A)),
    frame('sink-50', '20 < larger child 50: swap. Bubble down continues.', [50, 30, 20, 10, 15, null, null], T([0, 2], [], A), { from: 0, to: 2 }),
    frame('sink-stop', '20\u2019s children (10, 15) are smaller: stop. Heap restored in O(log n).', [50, 30, 20, 10, 15, null, null], T([2], [], S)),
    frame('done', 'Done: back to [50, 30, 20, 10, 15]. Array stays packed; the max always sits at index 0.', [50, 30, 20, 10, 15, null, null], T([], [0, 1, 2, 3, 4])),
  ];
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as HeapState;
  const dense = state.heap.filter((v) => v !== null) as number[];
  return (
    <div>
      <p className="viz-array-label">backing array</p>
      <ArrayCells values={dense} tones={state.tones.slice(0, dense.length)} pointers={[]} />
      <p className="viz-array-label">tree view</p>
      <TreeScene values={state.heap} tones={state.tones} activeEdge={state.edge} />
    </div>
  );
}

export default function HeapViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
