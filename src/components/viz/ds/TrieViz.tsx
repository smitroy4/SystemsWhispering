import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { VizEdge, VizNode } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface TrieNode {
  ch: string;
  depth: number;
  end: boolean;
}

interface TrieState {
  nodes: TrieNode[];
  edges: Array<[number, number]>;
  tones: CellTone[];
  activeEdge: [number, number] | null;
}

function frame(
  id: string,
  description: string,
  nodes: TrieNode[],
  edges: Array<[number, number]>,
  tones: CellTone[],
  activeEdge: [number, number] | null = null,
): VizStep {
  return {
    id,
    description,
    state: { nodes, edges, tones, activeEdge } satisfies TrieState,
    highlight: [],
  };
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

const ROOT: TrieNode = { ch: '·', depth: 0, end: false };

/** Insert "cat", then "car" (shares "ca"), then "dog" (fresh branch). */
function buildSteps(): VizStep[] {
  const cat: TrieNode[] = [
    ROOT,
    { ch: 'c', depth: 1, end: false },
    { ch: 'a', depth: 2, end: false },
    { ch: 't', depth: 3, end: true },
  ];
  const catEdges: Array<[number, number]> = [[0, 1], [1, 2], [2, 3]];
  const car: TrieNode[] = [...cat, { ch: 'r', depth: 3, end: true }];
  const carEdges: Array<[number, number]> = [...catEdges, [2, 4]];
  const dog: TrieNode[] = [
    ...car,
    { ch: 'd', depth: 1, end: false },
    { ch: 'o', depth: 2, end: false },
    { ch: 'g', depth: 3, end: true },
  ];
  const dogEdges: Array<[number, number]> = [...carEdges, [0, 5], [5, 6], [6, 7]];
  const settled = (n: number): CellTone[] => Array.from({ length: n }, () => DONE);

  return [
    frame('start', 'Start: one empty root. Insert "cat" — one node per character.', [ROOT], [], [D]),
    frame('c', 'Create c. New branch, new nodes.', cat.slice(0, 2), [[0, 1]], [D, S], [0, 1]),
    frame('ca', 'Create a under c.', cat.slice(0, 3), [[0, 1], [1, 2]], [D, D, S], [1, 2]),
    frame('cat', 'Create t and mark end-of-word (dot). "cat" is stored.', cat, catEdges, [D, D, D, S]),
    frame('car-c', 'Insert "car": c exists — REUSE it, no new node.', car.slice(0, 4), carEdges.slice(0, 3), [D, A, D, DONE], [0, 1]),
    frame('car-a', 'a exists too — reuse. Sharing prefixes is the whole point.', car.slice(0, 4), carEdges.slice(0, 3), [D, DONE, A, DONE], [1, 2]),
    frame('car-r', 'r is new: branch under a and mark end. "car" and "cat" coexist.', car, carEdges, [D, D, D, DONE, S], [2, 4]),
    frame('dog-d', 'Insert "dog": no d child — start a fresh branch from the root.', [...car, dog[5]], [...carEdges, [0, 5]], [...settled(5), S], [0, 5]),
    frame('dog-o', 'Create o under d.', [...car, dog[5], dog[6]], [...carEdges, [0, 5], [5, 6]], [...settled(6), S], [5, 6]),
    frame('dog-g', 'Create g, mark end. Three words share 8 nodes instead of 9.', dog, dogEdges, [...settled(7), S], [6, 7]),
    frame('done', 'Done. Every insert/search walks one character path: O(m) regardless of word count.', dog, dogEdges, settled(8)),
  ];
}

const WIDTH = 560;
const Y0 = 54;
const LEVEL_H = 74;
const RADIUS = 18;

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as TrieState;
  const byDepth = new Map<number, number[]>();
  state.nodes.forEach((n, i) => {
    const list = byDepth.get(n.depth) ?? [];
    list.push(i);
    byDepth.set(n.depth, list);
  });
  const pos = new Map<number, { x: number; y: number }>();
  byDepth.forEach((list, depth) => {
    list.forEach((nodeIdx, k) => {
      pos.set(nodeIdx, {
        x: ((k + 0.5) * WIDTH) / list.length,
        y: Y0 + depth * LEVEL_H,
      });
    });
  });
  const maxDepth = Math.max(...state.nodes.map((n) => n.depth));
  const height = Y0 * 2 + maxDepth * LEVEL_H;

  return (
    <svg
      className="viz-svg"
      viewBox={`0 0 ${WIDTH} ${height}`}
      role="img"
      aria-label={`Trie with ${state.nodes.length} nodes`}
    >
      {state.edges.map(([from, to], k) => {
        const a = pos.get(from);
        const b = pos.get(to);
        if (!a || !b) return null;
        const active =
          state.activeEdge !== null && state.activeEdge[0] === from && state.activeEdge[1] === to;
        return (
          <VizEdge key={k} x1={a.x} y1={a.y} x2={b.x} y2={b.y} trim={RADIUS + 2} tone={active ? 'active' : 'default'} />
        );
      })}
      {state.nodes.map((n, i) => {
        const p = pos.get(i);
        if (!p) return null;
        return (
          <g key={i}>
            <VizNode x={p.x} y={p.y} value={n.ch} tone={state.tones[i] ?? 'default'} radius={RADIUS} />
            {n.end ? (
              <circle cx={p.x + RADIUS - 3} cy={p.y - RADIUS + 3} r={5} className="viz-end-dot" />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

export default function TrieViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
