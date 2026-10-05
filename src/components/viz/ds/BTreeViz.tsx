import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { VizEdge } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface BTreeNode {
  keys: number[];
  /** Child node indices in the nodes array. */
  children: number[];
  level: number;
  slot: number;
}

interface BTreeState {
  nodes: BTreeNode[];
  activeNode: number;
  activeKey: number;
  status: string;
}

function frame(
  id: string,
  description: string,
  nodes: BTreeNode[],
  activeNode: number,
  activeKey: number,
  status: string,
): VizStep {
  return { id, description, state: { nodes, activeNode, activeKey, status } satisfies BTreeState, highlight: [] };
}

/** Fill a degree-2 root, overflow it, split the median up. */
function buildSteps(): VizStep[] {
  return [
    frame('start', 'Start: degree-2 root holding [10, 20]. Nodes keep 1–3 keys.', [{ keys: [10, 20], children: [], level: 0, slot: 0 }], 0, -1, 'root = [10, 20]'),
    frame('insert-5', 'Insert 5: room in the root — lands sorted at the front.', [{ keys: [5, 10, 20], children: [], level: 0, slot: 0 }], 0, 0, 'root = [5, 10, 20]'),
    frame('overflow', 'Insert 6: four keys, room for three — OVERFLOW. The node must split.', [{ keys: [5, 6, 10, 20], children: [], level: 0, slot: 0 }], 0, 1, 'overflow: 4 keys, max 3'),
    frame('split', 'Split: median 6 rises, [5] and [10, 20] become children. Height grows, balance holds.', [
      { keys: [6], children: [1, 2], level: 0, slot: 0 },
      { keys: [5], children: [], level: 1, slot: 0 },
      { keys: [10, 20], children: [], level: 1, slot: 1 },
    ], 0, 0, 'root = [6], leaves = [5] [10, 20]'),
    frame('search', 'Search 6: binary-search the root — found at key 0. One node visit.', [
      { keys: [6], children: [1, 2], level: 0, slot: 0 },
      { keys: [5], children: [], level: 1, slot: 0 },
      { keys: [10, 20], children: [], level: 1, slot: 1 },
    ], 0, 0, 'found 6 in the root'),
    frame('done', 'Done: wide nodes, shallow tree — one disk page per level, ever balanced.', [
      { keys: [6], children: [1, 2], level: 0, slot: 0 },
      { keys: [5], children: [], level: 1, slot: 0 },
      { keys: [10, 20], children: [], level: 1, slot: 1 },
    ], -1, -1, 'height 2 for any growth'),
  ];
}

const WIDTH = 560;
const KEY_W = 44;
const NODE_H = 44;
const LEVEL_Y = [70, 200];

function nodeWidth(keys: number[]): number {
  return keys.length * KEY_W + 16;
}

function nodeX(node: BTreeNode): number {
  if (node.level === 0) return WIDTH / 2;
  return node.slot === 0 ? WIDTH * 0.25 : WIDTH * 0.75;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as BTreeState;
  const height = 290;

  return (
    <>
      <svg
        className="viz-svg"
        viewBox={`0 0 ${WIDTH} ${height}`}
        role="img"
        aria-label={`B-tree with ${state.nodes.length} nodes`}
      >
        {state.nodes.map((node, ni) =>
          node.children.map((child) => {
            const target = state.nodes[child];
            if (!target) return null;
            return (
              <VizEdge
                key={`e${ni}-${child}`}
                x1={nodeX(node)}
                y1={LEVEL_Y[node.level] + NODE_H / 2}
                x2={nodeX(target)}
                y2={LEVEL_Y[target.level] - NODE_H / 2}
                trim={4}
                tone="default"
              />
            );
          }),
        )}
        {state.nodes.map((node, ni) => {
          const w = nodeWidth(node.keys);
          const x = nodeX(node) - w / 2;
          const y = LEVEL_Y[node.level] - NODE_H / 2;
          const active = state.activeNode === ni;
          return (
            <g key={ni}>
              <g
                className={`viz-anim viz-cell viz-tone-${active ? 'active' : 'default'}`}
                style={{ transform: `translate(${x}px, ${y}px)` }}
              >
                <rect width={w} height={NODE_H} rx={8} />
                {node.keys.map((key, ki) => (
                  <g key={ki}>
                    {ki > 0 ? (
                      <line
                        x1={8 + ki * KEY_W}
                        y1={8}
                        x2={8 + ki * KEY_W}
                        y2={NODE_H - 8}
                        stroke="var(--viz-default-stroke)"
                        strokeWidth={1}
                        opacity={0.5}
                      />
                    ) : null}
                    <text
                      x={8 + ki * KEY_W + KEY_W / 2}
                      y={NODE_H / 2 + 5}
                      textAnchor="middle"
                      className={state.activeNode === ni && state.activeKey === ki ? 'viz-pointer-label' : 'viz-cell-value'}
                    >
                      {key}
                    </text>
                  </g>
                ))}
              </g>
              <text x={nodeX(node)} y={y + NODE_H + 18} textAnchor="middle" className="viz-cell-index">
                {node.level === 0 ? 'root' : `leaf ${node.slot}`}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="viz-statusline">{state.status}</p>
    </>
  );
}

export default function BTreeViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
