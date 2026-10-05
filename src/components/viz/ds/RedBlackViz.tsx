import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { treeLayout } from './treeScene.tsx';
import { VizEdge } from '../primitives.tsx';
import type { TreeSceneEdge } from './treeScene.tsx';
import type { VizStep } from '../../../types/content.ts';

type RbColor = 'red' | 'black';

interface RbNode {
  index: number;
  value: number;
  color: RbColor;
}

interface RbState {
  nodes: RbNode[];
  activeEdge: TreeSceneEdge | null;
  activeNode: number;
}

function frame(
  id: string,
  description: string,
  nodes: RbNode[],
  activeEdge: TreeSceneEdge | null = null,
  activeNode = -1,
): VizStep {
  return {
    id,
    description,
    state: { nodes, activeEdge, activeNode } satisfies RbState,
    highlight: [],
  };
}

const N = (index: number, value: number, color: RbColor): RbNode => ({ index, value, color });

/** Insert 10, 20, 30 — red-red violation, rotate, recolor. */
function buildSteps(): VizStep[] {
  return [
    frame('start', 'Start: empty red-black tree. New nodes arrive RED; the root must stay BLACK.', []),
    frame('insert-10', 'Insert 10: first node — painted BLACK (the root rule).', [N(0, 10, 'black')], null, 0),
    frame('insert-20', 'Insert 20: red, right of 10. Red child of black — legal.', [N(0, 10, 'black'), N(2, 20, 'red')], null, 2),
    frame('insert-30', 'Insert 30: red, right of 20. RED-RED violation — and the uncle (null) is BLACK.', [N(0, 10, 'black'), N(2, 20, 'red'), N(6, 30, 'red')], { from: 2, to: 6 }, 6),
    frame('rotate', 'Black uncle → rotate LEFT at 10, then swap colors: 20 black, children red.', [N(0, 20, 'black'), N(1, 10, 'red'), N(2, 30, 'red')], { from: 0, to: 1 }, 0),
    frame('done', 'Done: black root, no double-red, every path holds 1 black node. O(log n) locked in.', [N(0, 20, 'black'), N(1, 10, 'red'), N(2, 30, 'red')]),
  ];
}

const WIDTH = 560;
const RADIUS = 19;

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as RbState;
  const pos = new Map(state.nodes.map((n) => [n.index, treeLayout(n.index, WIDTH)]));
  const maxDepth = state.nodes.reduce((m, n) => Math.max(m, Math.floor(Math.log2(n.index + 1))), 0);
  const height = 52 * 2 + maxDepth * 72;

  return (
    <svg
      className="viz-svg"
      viewBox={`0 0 ${WIDTH} ${height}`}
      role="img"
      aria-label={`Red-black tree with ${state.nodes.length} nodes`}
    >
      {state.nodes.map((n) => {
        if (n.index === 0) return null;
        const parent = (n.index - 1) >> 1;
        const a = pos.get(parent);
        const b = pos.get(n.index);
        if (!a || !b) return null;
        const active =
          state.activeEdge !== null &&
          ((state.activeEdge.from === parent && state.activeEdge.to === n.index) ||
            (state.activeEdge.from === n.index && state.activeEdge.to === parent));
        return (
          <VizEdge
            key={`e${parent}-${n.index}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            trim={RADIUS + 2}
            tone={active ? 'active' : 'default'}
          />
        );
      })}
      {state.nodes.map((n) => {
        const p = pos.get(n.index);
        if (!p) return null;
        return (
          <g
            key={n.index}
            className={`viz-anim viz-node ${n.color === 'red' ? 'viz-rb-red' : 'viz-rb-black'}`}
            style={{ transform: `translate(${p.x}px, ${p.y}px)` }}
          >
            <circle r={RADIUS} />
            <text textAnchor="middle" dy="0.35em" className="viz-node-value">
              {n.value}
            </text>
            {state.activeNode === n.index ? (
              <text textAnchor="middle" y={RADIUS + 16} className="viz-pointer-label">
                ●
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

export default function RedBlackViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
