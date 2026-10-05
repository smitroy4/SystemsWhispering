import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import TreeScene from './treeScene.tsx';
import type { TreeSceneEdge } from './treeScene.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface AvlState {
  values: Array<number | null>;
  tones: CellTone[];
  edge: TreeSceneEdge | null;
}

/** Heap slots for 4 levels (inserting 4 reaches depth 3). */
const N = 15;

function frame(
  id: string,
  description: string,
  values: Array<number | null>,
  tones: CellTone[],
  edge: TreeSceneEdge | null = null,
): VizStep {
  return { id, description, state: { values, tones, edge } satisfies AvlState, highlight: [] };
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

function empty(): Array<number | null> {
  return Array.from({ length: N }, () => null);
}

function tones(active: number[], settled: number[]): CellTone[] {
  return Array.from({ length: N }, (_, i) => {
    if (active.includes(i)) return S;
    if (settled.includes(i)) return DONE;
    return D;
  });
}

function place(pairs: Array<[number, number]>): Array<number | null> {
  const v = empty();
  for (const [index, value] of pairs) v[index] = value;
  return v;
}

/** Insert 10, 20, 30 (RR → left rotate), then 5, 4 (LL → right rotate). */
function buildSteps(): VizStep[] {
  return [
    frame('start', 'Start: empty AVL. Every insert ends with a balance check.', empty(), tones([], [])),
    frame('insert-10', 'Insert 10: empty tree, it becomes the root. Height 1, balance 0.', place([[0, 10]]), tones([0], [])),
    frame('insert-20', 'Insert 20: right of 10. Balance(10) = -1 — legal, no fix.', place([[0, 10], [2, 20]]), tones([2], [0])),
    frame('insert-30', 'Insert 30: right of 20. Balance(10) = -2 — RR case, right-heavy line.', place([[0, 10], [2, 20], [6, 30]]), tones([0, 2, 6], []), { from: 0, to: 2 }),
    frame('rotate-left', 'Left rotation: 20 rises, 10 drops left. Balance restored everywhere.', place([[0, 20], [1, 10], [2, 30]]), tones([], [0, 1, 2])),
    frame('insert-5', 'Insert 5: left of 10. Balance(10) = +1 — legal, heights updated upward.', place([[0, 20], [1, 10], [2, 30], [3, 5]]), tones([3], [0, 1, 2])),
    frame('insert-4', 'Insert 4: left of 5. Balance(10) = +2 — LL case, left-heavy line.', place([[0, 20], [1, 10], [2, 30], [3, 5], [7, 4]]), tones([1, 3, 7], [0, 2]), { from: 1, to: 3 }),
    frame('rotate-right', 'Right rotation at 10: 5 rises with children 4 and 10. Tree stays O(log n) tall.', place([[0, 20], [1, 5], [2, 30], [3, 4], [4, 10]]), tones([], [0, 1, 2, 3, 4])),
    frame('done', 'Done: sorted input, height 3 — never the 5-high stick a plain BST would grow.', place([[0, 20], [1, 5], [2, 30], [3, 4], [4, 10]]), tones([], [0, 1, 2, 3, 4])),
  ];
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as AvlState;
  return <TreeScene values={state.values} tones={state.tones} activeEdge={state.edge} />;
}

export default function AvlViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
