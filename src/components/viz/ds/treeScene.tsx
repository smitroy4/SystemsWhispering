import { VizEdge, VizNode } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';

export interface TreeSceneEdge {
  from: number;
  to: number;
}

interface TreeSceneProps {
  /** Heap-indexed values; null means "no node here". */
  values: Array<number | string | null>;
  tones?: CellTone[];
  /** The edge currently being traversed (heap indices). */
  activeEdge?: TreeSceneEdge | null;
  /** Values visited so far, shown as an order strip below the tree. */
  visited?: Array<number | string>;
  ariaLabel?: string;
}

const NODE_Y0 = 52;
const LEVEL_H = 72;
const RADIUS = 19;

/** Level-based auto-layout: depth d spreads 2^d slots across the width. */
export function treeLayout(index: number, width: number): { x: number; y: number; depth: number } {
  const depth = Math.floor(Math.log2(index + 1));
  const first = 2 ** depth - 1;
  const slots = 2 ** depth;
  return {
    x: ((index - first + 0.5) * width) / slots,
    y: NODE_Y0 + depth * LEVEL_H,
    depth,
  };
}

export default function TreeScene({ values, tones, activeEdge, visited = [], ariaLabel }: TreeSceneProps) {
  const width = 560;
  const present = values
    .map((v, i) => (v === null ? -1 : i))
    .filter((i) => i >= 0);
  const maxDepth = present.reduce((m, i) => Math.max(m, Math.floor(Math.log2(i + 1))), 0);
  const height = NODE_Y0 * 2 + maxDepth * LEVEL_H + (visited.length > 0 ? 34 : 0);
  const pos = present.map((i) => ({ i, ...treeLayout(i, width) }));
  const at = new Map(pos.map((p) => [p.i, p]));

  function tone(i: number): CellTone {
    return tones?.[i] ?? 'default';
  }

  return (
    <svg
      className="viz-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel ?? `Binary tree with ${present.length} nodes`}
    >
      {present.map((i) => {
        if (i === 0) return null;
        const parent = (i - 1) >> 1;
        if (values[parent] === null || values[parent] === undefined) return null;
        const a = at.get(parent);
        const b = at.get(i);
        if (!a || !b) return null;
        const active =
          activeEdge !== null &&
          activeEdge !== undefined &&
          ((activeEdge.from === parent && activeEdge.to === i) ||
            (activeEdge.from === i && activeEdge.to === parent));
        return (
          <VizEdge
            key={`e${parent}-${i}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            trim={RADIUS + 2}
            tone={active ? 'active' : 'default'}
          />
        );
      })}
      {pos.map((p) => (
        <VizNode
          key={p.i}
          x={p.x}
          y={p.y}
          value={values[p.i] as number | string}
          tone={tone(p.i)}
          radius={RADIUS}
        />
      ))}
      {visited.length > 0 ? (
        <text
          x={width / 2}
          y={NODE_Y0 + maxDepth * LEVEL_H + 52}
          textAnchor="middle"
          className="viz-edge-label"
        >
          {`visit order: ${visited.join(' → ')}`}
        </text>
      ) : null}
    </svg>
  );
}
