import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { ArrowLabel, VizEdge, VizNode } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface SllState {
  values: number[];
  tones: CellTone[];
  /** Edge index (from node i to node i+1) highlighted as rewired/traversed. */
  activeEdge: number;
}

function frame(
  id: string,
  description: string,
  values: number[],
  tones: CellTone[],
  activeEdge = -1,
): VizStep {
  return {
    id,
    description,
    state: { values, tones, activeEdge } satisfies SllState,
    highlight: activeEdge >= 0 ? [activeEdge] : [],
  };
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

/** Insert 25 after 20, then unlink 20 — every rewiring shown. */
function buildSteps(): VizStep[] {
  return [
    frame('start', 'Start: 10 → 20 → 30 → null. Goal: insert 25 after 20.', [10, 20, 30], [D, D, D]),
    frame('walk-10', 'Walk from head: 10 is not the insertion point, follow its edge.', [10, 20, 30], [A, D, D], 0),
    frame('walk-20', 'Reach 20 — the node after which 25 belongs. Stop here.', [10, 20, 30], [D, A, D]),
    frame(
      'link-new',
      'Allocate 25 and point 20 → 25. The old edge 20 → 30 is replaced.',
      [10, 20, 25, 30],
      [D, D, S, D],
      1,
    ),
    frame(
      'link-rest',
      'Point 25 → 30 so the tail is not lost. Insert done in O(1) once located.',
      [10, 20, 25, 30],
      [D, D, S, D],
      2,
    ),
    frame('delete-start', 'Next goal: delete 20. Walk a prev/curr pair: prev=10, curr=20.', [10, 20, 25, 30], [A, A, D, D]),
    frame(
      'unlink',
      'Bypass 20: point 10 → 25. Nothing shifts; 20 is now unreachable garbage.',
      [10, 25, 30],
      [A, S, D],
      0,
    ),
    frame('done', 'Done: 10 → 25 → 30. Splicing is O(1); finding the spot costs the O(n) walk.', [10, 25, 30], [DONE, DONE, DONE]),
  ];
}

const NODE_GAP = 104;
const NODE_Y = 76;
const RADIUS = 20;

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as SllState;
  const xs = state.values.map((_, i) => 56 + i * NODE_GAP);
  const width = 56 * 2 + Math.max(0, state.values.length - 1) * NODE_GAP + 64;
  const height = 156;

  return (
    <svg
      className="viz-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Linked list with ${state.values.length} nodes`}
    >
      {xs.length > 0 ? (
        <ArrowLabel x={xs[0]} y={NODE_Y - RADIUS - 12} label="head" direction="down" />
      ) : null}
      {state.values.map((value, i) => (
        <VizNode key={`${i}-${value}`} x={xs[i]} y={NODE_Y} value={value} tone={state.tones[i] ?? 'default'} radius={RADIUS} />
      ))}
      {state.values.slice(0, -1).map((_, i) => (
        <VizEdge
          key={`e${i}`}
          x1={xs[i]}
          y1={NODE_Y}
          x2={xs[i + 1]}
          y2={NODE_Y}
          trim={RADIUS + 2}
          tone={state.activeEdge === i ? 'active' : 'default'}
        />
      ))}
      {xs.length > 0 ? (
        <>
          <VizEdge
            x1={xs[xs.length - 1]}
            y1={NODE_Y}
            x2={xs[xs.length - 1] + 52}
            y2={NODE_Y}
            trim={RADIUS + 2}
            tone="default"
          />
          <text x={xs[xs.length - 1] + 60} y={NODE_Y + 5} className="viz-edge-label">
            null
          </text>
        </>
      ) : null}
    </svg>
  );
}

export default function SinglyLinkedListViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
