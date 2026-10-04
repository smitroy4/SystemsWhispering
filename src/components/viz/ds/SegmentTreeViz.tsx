import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { ArrayCells } from '../primitives.tsx';
import TreeScene from './treeScene.tsx';
import type { TreeSceneEdge } from './treeScene.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface SegState {
  tones: CellTone[];
  edge: TreeSceneEdge | null;
}

const SUMS: Array<number | null> = [19, 8, 11, 7, 1, 8, 3, 2, 5];
const ARRAY = [2, 5, 1, 8, 3];

function frame(id: string, description: string, tones: CellTone[], edge: TreeSceneEdge | null = null): VizStep {
  return {
    id,
    description,
    state: { tones, edge } satisfies SegState,
    highlight: [],
  };
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const C: CellTone = 'compared';

/** Range sum over [1, 3] on [2, 5, 1, 8, 3]: split partials, take wholes, skip outsiders. */
function buildSteps(): VizStep[] {
  const T = (active: number[], taken: number[], partial: number[]): CellTone[] =>
    Array.from({ length: SUMS.length }, (_, i) => {
      if (active.includes(i)) return A;
      if (taken.includes(i)) return S;
      if (partial.includes(i)) return C;
      return D;
    });

  return [
    frame('start', 'Query sum(1, 3) on [2, 5, 1, 8, 3]. Each node caches its interval sum.', T([], [], [])),
    frame('root', 'Root [0,4] partly overlaps: split into [0,2] and [3,4].', T([0], [], []), null),
    frame('left', 'Node 8 covers [0,2]: still partial — split into [0,1] and [2,2].', T([1], [], [0]), { from: 0, to: 1 }),
    frame('node7', 'Node 7 covers [0,1]: partial again — split into [0,0] and [1,1].', T([3], [], [0, 1]), { from: 1, to: 3 }),
    frame('skip-2', 'Leaf 2 covers [0,0]: outside [1,3] — skip it (contributes 0).', T([7], [], [0, 1, 3]), { from: 3, to: 7 }),
    frame('take-5', 'Leaf 5 covers [1,1]: fully inside — TAKE it. Running total 5.', T([8], [8], [0, 1, 3]), { from: 3, to: 8 }),
    frame('take-1', 'Back up: node 1 covers [2,2]: fully inside — TAKE it. Total 5 + 1 = 6.', T([4], [8, 4], [0, 1, 3]), { from: 1, to: 4 }),
    frame('right', 'Node 11 covers [3,4]: partial — split into [3,3] and [4,4].', T([2], [8, 4], [0]), { from: 0, to: 2 }),
    frame('take-8', 'Leaf 8 covers [3,3]: fully inside — TAKE it. Total 6 + 8 = 14.', T([5], [8, 4, 5], [0, 2]), { from: 2, to: 5 }),
    frame('skip-3', 'Leaf 3 covers [4,4]: outside — skip. Only 3 leaves taken, not 5 scanned.', T([6], [8, 4, 5], [0, 2]), { from: 2, to: 6 }),
    frame('done', 'Done: 5 + 1 + 8 = 14. Taken nodes tile the range exactly: O(log n) visited.', T([], [8, 4, 5], [0, 1, 2, 3])),
  ];
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as SegState;
  return (
    <div>
      <p className="viz-array-label">array (query l=1, r=3)</p>
      <ArrayCells
        values={ARRAY}
        tones={undefined}
        pointers={[
          { label: 'l', index: 1 },
          { label: 'r', index: 3 },
        ]}
      />
      <p className="viz-array-label">segment tree (interval sums)</p>
      <TreeScene values={SUMS} tones={state.tones} activeEdge={state.edge} />
    </div>
  );
}

export default function SegmentTreeViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
