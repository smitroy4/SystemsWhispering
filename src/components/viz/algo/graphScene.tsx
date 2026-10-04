import { VizEdge, VizNode } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';

export interface SceneNode {
  id: string;
  x: number;
  y: number;
  /** Small caption under the node (distance, discovery time, component). */
  sub?: string;
}

export interface SceneEdge {
  from: number;
  to: number;
  label?: string;
}

interface GraphSceneProps {
  nodes: SceneNode[];
  edges: SceneEdge[];
  tones?: CellTone[];
  /** Edge indices highlighted as traversed/relaxed. */
  activeEdges?: number[];
  width?: number;
  height?: number;
  ariaLabel?: string;
}

/**
 * Fixed-coordinate graph renderer for algorithm viz.
 * Coordinates live in step state (per the engine contract);
 * this component only draws them with Node/Edge primitives.
 */
export default function GraphScene({
  nodes,
  edges,
  tones,
  activeEdges = [],
  width = 560,
  height = 300,
  ariaLabel,
}: GraphSceneProps) {
  const byIndex = new Map(nodes.map((n, i) => [i, n]));
  return (
    <svg
      className="viz-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel ?? `Graph with ${nodes.length} nodes`}
    >
      {edges.map((e, k) => {
        const a = byIndex.get(e.from);
        const b = byIndex.get(e.to);
        if (!a || !b) return null;
        return (
          <VizEdge
            key={k}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            trim={22}
            label={e.label}
            tone={activeEdges.includes(k) ? 'active' : 'default'}
          />
        );
      })}
      {nodes.map((n, i) => (
        <g key={n.id}>
          <VizNode x={n.x} y={n.y} value={n.id} tone={tones?.[i] ?? 'default'} radius={19} />
          {n.sub !== undefined ? (
            <text x={n.x} y={n.y + 36} textAnchor="middle" className="viz-cell-index">
              {n.sub}
            </text>
          ) : null}
        </g>
      ))}
    </svg>
  );
}
