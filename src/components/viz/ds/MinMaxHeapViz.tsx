import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import TreeScene from './treeScene.tsx';
import type { TreeSceneEdge } from './treeScene.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface MinMaxState {
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
  return { id, description, state: { values, tones, edge } satisfies MinMaxState, highlight: [] };
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const C: CellTone = 'compared';
const DONE: CellTone = 'done';

function tones(active: number[], settled: number[], compared: number[] = []): CellTone[] {
  return Array.from({ length: 7 }, (_, i) => {
    if (active.includes(i)) return S;
    if (compared.includes(i)) return C;
    if (settled.includes(i)) return DONE;
    return D;
  });
}

function place(pairs: Array<[number, number]>, size = 7): Array<number | null> {
  const v: Array<number | null> = Array.from({ length: size }, () => null);
  for (const [index, value] of pairs) v[index] = value;
  return v;
}

/** Peek both ends, pop-min (settles fast), pop-max (trickles down). */
function buildSteps(): VizStep[] {
  const full = place([[0, 1], [1, 30], [2, 13], [3, 20], [4, 15], [5, 12]]);
  return [
    frame('start', 'Start: min levels hold minima (root 1), max levels hold maxima (30, 13). One array, both ends.', full, tones([], [])),
    frame('peek-min', 'peekMin: the root is the global minimum — O(1).', full, [A, D, D, D, D, D, D]),
    frame('peek-max', 'peekMax: compare the root’s children — max(30, 13) = 30. Still O(1).', full, tones([], [], [1, 2])),
    frame('pop-min', 'popMin: remove 1, move the last element (12) to the root.', place([[0, 12], [1, 30], [2, 13], [3, 20], [4, 15]], 5), tones([0], [])),
    frame('trickle-min', 'Trickle down through grandchildren {20, 15}: 12 already smallest — no swaps. Min side settles fast.', place([[0, 12], [1, 30], [2, 13], [3, 20], [4, 15]], 5), tones([], [0], [3, 4])),
    frame('pop-max', 'popMax: remove 30, move the last element (15) into its slot.', place([[0, 12], [1, 15], [2, 13], [3, 20]], 4), tones([1], [0])),
    frame('trickle-max', 'Child 20 > 15: swap down. Max side repairs like a max-heap below.', place([[0, 12], [1, 20], [2, 13], [3, 15]], 4), tones([1, 3], [0, 2]), { from: 1, to: 3 }),
    frame('done', 'Done: [12, 20, 13, 15] — both extremes served from one structure in O(log n).', place([[0, 12], [1, 20], [2, 13], [3, 15]], 4), [DONE, DONE, DONE, DONE, D, D, D]),
  ];
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as MinMaxState;
  return <TreeScene values={state.values} tones={state.tones} activeEdge={state.edge} />;
}

export default function MinMaxHeapViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
