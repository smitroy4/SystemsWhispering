import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import TreeScene from './treeScene.tsx';
import type { TreeSceneEdge } from './treeScene.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface TraversalState {
  tones: CellTone[];
  edge: TreeSceneEdge | null;
  visited: number[];
}

const VALUES: Array<number | null> = [4, 2, 6, 1, 3, 5, 7];
/** Heap indices in inorder visit order, with the edge walked to arrive. */
const VISITS: Array<{ index: number; edge: TreeSceneEdge | null }> = [
  { index: 3, edge: { from: 1, to: 3 } },
  { index: 1, edge: { from: 3, to: 1 } },
  { index: 4, edge: { from: 1, to: 4 } },
  { index: 0, edge: { from: 1, to: 0 } },
  { index: 5, edge: { from: 2, to: 5 } },
  { index: 2, edge: { from: 0, to: 2 } },
  { index: 6, edge: { from: 2, to: 6 } },
];

const D: CellTone = 'default';
const A: CellTone = 'active';
const DONE: CellTone = 'done';

function buildSteps(): VizStep[] {
  const steps: VizStep[] = [
    {
      id: 'start',
      description: 'Inorder = left, node, right. Start at the root and dive left first.',
      state: { tones: VALUES.map(() => D), edge: null, visited: [] } satisfies TraversalState,
      highlight: [],
    },
  ];
  const seen: number[] = [];
  VISITS.forEach(({ index, edge }, k) => {
    seen.push(VALUES[index] as number);
    const tones = VALUES.map((_, i) => {
      if (i === index) return A;
      if (VISITS.slice(0, k).some((v) => v.index === i)) return DONE;
      return D;
    });
    steps.push({
      id: `visit-${index}`,
      description: `Visit ${VALUES[index]} (${k + 1} of 7). Smaller values surface before larger ones.`,
      state: { tones, edge, visited: [...seen] } satisfies TraversalState,
      highlight: [index],
    });
  });
  steps.push({
    id: 'done',
    description: 'Done: 1 → 2 → 3 → 4 → 5 → 6 → 7. Inorder visits every node once: O(n).',
    state: { tones: VALUES.map(() => DONE), edge: null, visited: [...seen] } satisfies TraversalState,
    highlight: [],
  });
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as TraversalState;
  return (
    <TreeScene values={VALUES} tones={state.tones} activeEdge={state.edge} visited={state.visited} />
  );
}

export default function BinaryTreeViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
