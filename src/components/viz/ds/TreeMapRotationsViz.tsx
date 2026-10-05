import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import TreeScene from './treeScene.tsx';
import type { TreeSceneEdge } from './treeScene.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface TreeMapState {
  values: Array<number | null>;
  tones: CellTone[];
  edge: TreeSceneEdge | null;
  status: string;
}

function frame(
  id: string,
  description: string,
  values: Array<number | null>,
  tones: CellTone[],
  edge: TreeSceneEdge | null,
  status: string,
): VizStep {
  return { id, description, state: { values, tones, edge, status } satisfies TreeMapState, highlight: [] };
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const C: CellTone = 'compared';
const DONE: CellTone = 'done';

function tones(active: number[], settled: number[]): CellTone[] {
  return Array.from({ length: 7 }, (_, i) => {
    if (active.includes(i)) return S;
    if (settled.includes(i)) return DONE;
    return D;
  });
}

function place(pairs: Array<[number, number]>): Array<number | null> {
  const v: Array<number | null> = Array.from({ length: 7 }, () => null);
  for (const [index, value] of pairs) v[index] = value;
  return v;
}

/** Insert 30, 10, 20 — zig-zag triggers the double rotation TreeMap hides. */
function buildSteps(): VizStep[] {
  return [
    frame('start', 'Start: empty TreeMap. Keys stay sorted — the tree rebalances invisibly.', place([]), tones([], []), null, 'inorder = []'),
    frame('insert-30', 'put(30): root. Every later key routes left or right from here.', place([[0, 30]]), tones([0], []), null, 'inorder = [30]'),
    frame('insert-10', 'put(10): left of 30. Still balanced — no rotation yet.', place([[0, 30], [1, 10]]), tones([1], [0]), { from: 0, to: 1 }, 'inorder = [10, 30]'),
    frame('insert-20', 'put(20): right of 10 — a zig-zag. The path leans; red-black rules fire.', place([[0, 30], [1, 10], [4, 20]]), tones([0, 1, 4], []), { from: 1, to: 4 }, 'zig-zag at 10 → 20'),
    frame('rotate', 'Double rotation: 20 rises, 10 and 30 settle as children. Sorted order untouched.', place([[0, 20], [1, 10], [2, 30]]), tones([0], [1, 2]), { from: 0, to: 1 }, 'inorder = [10, 20, 30]'),
    frame('neighbor', 'floorKey(25): walk down — 20 is the greatest key ≤ 25. Neighbours in O(log n).', place([[0, 20], [1, 10], [2, 30]]), [D, C, C, D, D, D, D], { from: 0, to: 2 }, 'floorKey(25) = 20'),
    frame('done', 'Done: rotations keep depth logarithmic; inorder walks stay sorted forever.', place([[0, 20], [1, 10], [2, 30]]), [DONE, DONE, DONE, D, D, D, D], null, 'inorder = [10, 20, 30]'),
  ];
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as TreeMapState;
  return (
    <>
      <TreeScene values={state.values} tones={state.tones} activeEdge={state.edge} />
      <p className="viz-statusline">{state.status}</p>
    </>
  );
}

export default function TreeMapRotationsViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
