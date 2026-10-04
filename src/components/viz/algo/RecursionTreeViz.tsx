import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from './StatePanel.tsx';
import type { StateEntry } from './StatePanel.tsx';
import { VizEdge, VizNode } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface CallNode {
  id: number;
  label: string;
  x: number;
  y: number;
}

interface CallEdge {
  from: number;
  to: number;
}

interface RecursionState {
  nodes: CallNode[];
  edges: CallEdge[];
  values: Array<number | null>;
  tones: CellTone[];
  panel: StateEntry[];
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const DONE: CellTone = 'done';

/** fib(4) call tree: expand depth-first, then resolve bottom-up. */
function buildSteps(): VizStep[] {
  const nodes: CallNode[] = [
    { id: 0, label: 'f4', x: 260, y: 46 },
    { id: 1, label: 'f3', x: 140, y: 126 },
    { id: 2, label: 'f2', x: 390, y: 126 },
    { id: 3, label: 'f2', x: 70, y: 206 },
    { id: 4, label: 'f1', x: 210, y: 206 },
    { id: 5, label: 'f1', x: 345, y: 206 },
    { id: 6, label: 'f0', x: 445, y: 206 },
    { id: 7, label: 'f1', x: 30, y: 286 },
    { id: 8, label: 'f0', x: 115, y: 286 },
  ];
  const edges: CallEdge[] = [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 1, to: 3 },
    { from: 1, to: 4 },
    { from: 2, to: 5 },
    { from: 2, to: 6 },
    { from: 3, to: 7 },
    { from: 3, to: 8 },
  ];

  const snap = (
    id: string,
    description: string,
    active: number[],
    resolved: Map<number, number>,
    calls: number,
  ): VizStep => ({
    id,
    description,
    state: {
      nodes,
      edges,
      values: nodes.map((n) => (resolved.has(n.id) ? resolved.get(n.id)! : null)),
      tones: nodes.map((n) => {
        if (active.includes(n.id)) return A;
        if (resolved.has(n.id)) return DONE;
        return D;
      }),
      panel: [
        { label: 'calls so far', value: String(calls) },
        { label: 'resolved', value: String(resolved.size) },
      ],
    } satisfies RecursionState,
    highlight: active,
  });

  const resolved = new Map<number, number>();
  return [
    snap('call-0', 'Call fib(4): splits into fib(3) + fib(2). Depth 1.', [0], resolved, 1),
    snap('call-1', 'Call fib(3): splits into fib(2) + fib(1). Depth 2.', [0, 1], resolved, 2),
    snap('call-3', 'Call fib(2): splits into fib(1) + fib(0). Depth 3 — deepest path so far.', [0, 1, 3], resolved, 3),
    snap('leaf-7', 'fib(1) = 1: base case, returns immediately.', [7], new Map([...resolved, [7, 1]]), 4),
    snap('leaf-8', 'fib(0) = 0: base case. fib(2) = 1 + 0 = 1 resolves.', [8, 3], new Map([...resolved, [7, 1], [8, 0], [3, 1]]), 5),
    snap('leaf-4', 'fib(1) = 1. fib(3) = 1 + 1 = 2 resolves.', [4, 1], new Map([...resolved, [7, 1], [8, 0], [3, 1], [4, 1], [1, 2]]), 6),
    snap('call-2', 'Right side: call fib(2), splits into fib(1) + fib(0). Note fib(2) computed AGAIN.', [0, 2], new Map([...resolved, [7, 1], [8, 0], [3, 1], [4, 1], [1, 2]]), 7),
    snap('leaf-56', 'fib(1) = 1, fib(0) = 0: fib(2) = 1 resolves a second time.', [5, 6, 2], new Map([...resolved, [7, 1], [8, 0], [3, 1], [4, 1], [1, 2], [5, 1], [6, 0], [2, 1]]), 9),
    snap('done', 'fib(4) = 2 + 1 = 3. 9 calls for n = 4 — exponential. Memoization would compute 5 distinct values.', [0], new Map([[0, 3], [1, 2], [2, 1], [3, 1], [4, 1], [5, 1], [6, 0], [7, 1], [8, 0]]), 9),
  ];
}

const RADIUS = 20;

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as RecursionState;
  const byId = new Map(state.nodes.map((n) => [n.id, n]));

  return (
    <div className="algo-scene">
      <svg
        className="viz-svg"
        viewBox="0 0 520 330"
        role="img"
        aria-label="fib(4) recursion tree"
      >
        {state.edges.map((e, k) => {
          const a = byId.get(e.from);
          const b = byId.get(e.to);
          if (!a || !b) return null;
          return <VizEdge key={k} x1={a.x} y1={a.y} x2={b.x} y2={b.y} trim={RADIUS + 2} tone="default" />;
        })}
        {state.nodes.map((n, i) => (
          <g key={n.id}>
            <VizNode x={n.x} y={n.y} value={n.label} tone={state.tones[i] ?? 'default'} radius={RADIUS} />
            {state.values[i] !== null && state.values[i] !== undefined ? (
              <text x={n.x} y={n.y + RADIUS + 15} textAnchor="middle" className="viz-cell-index">
                {`= ${state.values[i]}`}
              </text>
            ) : null}
          </g>
        ))}
      </svg>
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function RecursionTreeViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend
        items={[
          { tone: 'default', label: 'Default', hint: 'Not called yet' },
          { tone: 'active', label: 'Active', hint: 'On the call stack' },
          { tone: 'swapped', label: 'Swapped / Found', hint: 'Unused here' },
          { tone: 'done', label: 'Done', hint: 'Resolved' },
        ]}
      />
    </>
  );
}
