import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import { VizEdge, VizNode } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface FixedNode {
  id: number;
  x: number;
  y: number;
}

interface FastSlowState {
  nodes: FixedNode[];
  slow: number;
  fast: number;
  met: boolean;
  panel: StateEntry[];
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';

const NODES: FixedNode[] = [0, 1, 2, 3, 4].map((id) => ({ id, x: 56 + id * 104, y: 84 }));
const NEXT = [1, 2, 3, 4, 2];
const RADIUS = 19;

/** Chain 0→1→2→3→4→2 (cycle at 2): slow/fast meet at node 4. */
function buildSteps(): VizStep[] {
  const pairs: Array<[number, number]> = [[0, 0], [1, 2], [2, 4], [3, 2], [4, 4]];
  const steps: VizStep[] = pairs.map(([slow, fast], round) => ({
    id: `round-${round}`,
    description:
      round === 0
        ? 'Both pointers start at node 0. Slow moves 1 step, fast moves 2 per round.'
        : round === pairs.length - 1
          ? `Round ${round}: slow = ${slow}, fast = ${fast} — SAME node. Cycle confirmed.`
          : `Round ${round}: slow = ${slow}, fast = ${fast}. Fast laps the cycle, slow plods.`,
    state: {
      nodes: NODES,
      slow,
      fast,
      met: round === pairs.length - 1,
      panel: [
        { label: 'slow', value: String(slow) },
        { label: 'fast', value: String(fast) },
        { label: 'round', value: String(round) },
      ],
    } satisfies FastSlowState,
    highlight: [slow, fast],
  }));

  steps.push({
    id: 'done',
    description: 'Done: meeting proves a cycle in O(n) time with O(1) space. No meeting by the end means a straight road.',
    state: {
      nodes: NODES,
      slow: 4,
      fast: 4,
      met: true,
      panel: [
        { label: 'slow', value: '4' },
        { label: 'fast', value: '4' },
        { label: 'cycle', value: 'yes' },
      ],
    } satisfies FastSlowState,
    highlight: [],
  });
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as FastSlowState;

  const toneFor = (id: number): CellTone => {
    if (state.met && id === state.slow) return S;
    if (id === state.slow || id === state.fast) return A;
    return D;
  };

  return (
    <div className="algo-scene">
      <svg
        className="viz-svg"
        viewBox="0 0 520 190"
        role="img"
        aria-label="Linked chain with a cycle at node 2"
      >
        {NEXT.map((to, from) => {
          const a = NODES[from];
          const b = NODES[to];
          if (!a || !b) return null;
          const back = to < from;
          return (
            <VizEdge
              key={`${from}-${to}`}
              x1={a.x}
              y1={back ? a.y + 34 : a.y}
              x2={b.x}
              y2={back ? b.y + 34 : b.y}
              trim={back ? 4 : RADIUS + 2}
              tone="default"
            />
          );
        })}
        {state.nodes.map((n) => (
          <g key={n.id}>
            <VizNode x={n.x} y={n.y} value={n.id} tone={toneFor(n.id)} radius={RADIUS} />
            {n.id === state.slow ? (
              <text x={n.x} y={n.y - RADIUS - 10} textAnchor="middle" className="viz-pointer-label">
                slow
              </text>
            ) : null}
            {n.id === state.fast && state.fast !== state.slow ? (
              <text x={n.x} y={n.y + RADIUS + 18} textAnchor="middle" className="viz-pointer-label">
                fast
              </text>
            ) : null}
            {state.met && n.id === state.slow ? (
              <text x={n.x} y={n.y + RADIUS + 18} textAnchor="middle" className="viz-pointer-label">
                meet!
              </text>
            ) : null}
          </g>
        ))}
      </svg>
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function FastSlowViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
