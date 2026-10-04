import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { ArrowLabel, VizEdge, VizNode } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface DllState {
  values: number[];
  tones: CellTone[];
  /** Forward edge i (node i → node i+1) currently being rewired. */
  activeFwd: number;
  /** Backward edge into node j (node j → node j-1) currently being rewired. */
  activeBack: number;
}

function frame(
  id: string,
  description: string,
  values: number[],
  tones: CellTone[],
  activeFwd = -1,
  activeBack = -1,
): VizStep {
  return {
    id,
    description,
    state: { values, tones, activeFwd, activeBack } satisfies DllState,
    highlight: [...(activeFwd >= 0 ? [activeFwd] : []), ...(activeBack >= 0 ? [activeBack] : [])],
  };
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

/** Insert 25 between 20 and 30 — all four pointer writes shown. */
function buildSteps(): VizStep[] {
  return [
    frame('start', 'Start: 10 ⇄ 20 ⇄ 30. Goal: insert 25 between 20 and 30.', [10, 20, 30], [D, D, D]),
    frame(
      'new-next',
      'Write 1 of 4: the new node’s next → 30. New node first, neighbours later.',
      [10, 20, 25, 30],
      [D, D, S, D],
      2,
    ),
    frame(
      'new-prev',
      'Write 2 of 4: the new node’s prev → 20. 25 is now fully linked outward.',
      [10, 20, 25, 30],
      [D, D, S, D],
      -1,
      2,
    ),
    frame(
      'swing-fwd',
      'Write 3 of 4: swing 20.next → 25. Forward chain is spliced.',
      [10, 20, 25, 30],
      [D, A, S, D],
      1,
    ),
    frame(
      'swing-back',
      'Write 4 of 4: swing 30.prev → 25. Backward chain is spliced — insert done.',
      [10, 20, 25, 30],
      [D, D, S, A],
      -1,
      3,
    ),
    frame(
      'done',
      'Done: 10 ⇄ 20 ⇄ 25 ⇄ 30. Four writes, O(1) — plus the O(n) walk to find the spot.',
      [10, 20, 25, 30],
      [DONE, DONE, DONE, DONE],
    ),
  ];
}

const NODE_GAP = 104;
const NODE_Y = 92;
const RADIUS = 20;
const LANE = 30;

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as DllState;
  const xs = state.values.map((_, i) => 56 + i * NODE_GAP);
  const width = 56 * 2 + Math.max(0, state.values.length - 1) * NODE_GAP;
  const height = 196;

  return (
    <svg
      className="viz-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Doubly linked list with ${state.values.length} nodes`}
    >
      {xs.length > 0 ? (
        <>
          <ArrowLabel x={xs[0]} y={NODE_Y - RADIUS - 40} label="head" direction="down" />
          <ArrowLabel x={xs[xs.length - 1]} y={NODE_Y + RADIUS + 40} label="tail" direction="up" />
        </>
      ) : null}
      {state.values.map((value, i) => (
        <VizNode key={`${i}-${value}`} x={xs[i]} y={NODE_Y} value={value} tone={state.tones[i] ?? 'default'} radius={RADIUS} />
      ))}
      {state.values.slice(0, -1).map((_, i) => (
        <VizEdge
          key={`f${i}`}
          x1={xs[i]}
          y1={NODE_Y - LANE}
          x2={xs[i + 1]}
          y2={NODE_Y - LANE}
          trim={10}
          tone={state.activeFwd === i ? 'active' : 'default'}
        />
      ))}
      {state.values.slice(0, -1).map((_, i) => (
        <VizEdge
          key={`b${i}`}
          x1={xs[i + 1]}
          y1={NODE_Y + LANE}
          x2={xs[i]}
          y2={NODE_Y + LANE}
          trim={10}
          tone={state.activeBack === i + 1 ? 'active' : 'default'}
        />
      ))}
    </svg>
  );
}

export default function DoublyLinkedListViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
