/**
 * Generic SVG primitives for visualizations.
 * Props-driven and topic-agnostic: they render whatever values, tones,
 * and labels they receive. All motion is CSS (transform/opacity 300ms).
 */
import './primitives.css';

export type CellTone = 'default' | 'active' | 'compared' | 'swapped' | 'done';

export interface CellPointer {
  label: string;
  index: number;
}

const CELL_W = 52;
const CELL_H = 52;
const CELL_GAP = 8;
const SVG_PAD = 16;
const POINTER_ROW_H = 24;

function toneAt(tones: CellTone[] | undefined, index: number): CellTone {
  return tones?.[index] ?? 'default';
}

function inRange(index: number, length: number): boolean {
  return Number.isInteger(index) && index >= 0 && index < length;
}

/** Stacked pointer labels above one cell (handles several pointers per index). */
function PointerStack({ pointers, x }: { pointers: CellPointer[]; x: number }) {
  return (
    <g className="viz-anim" style={{ transform: `translate(${x}px, 0px)` }}>
      {pointers.map((pointer, row) => (
        <g key={`${pointer.label}-${row}`}>
          <text
            className="viz-pointer-label"
            x={CELL_W / 2}
            y={SVG_PAD + row * POINTER_ROW_H + 14}
            textAnchor="middle"
          >
            {pointer.label}
          </text>
          <polygon
            className="viz-pointer-arrow"
            points={`${CELL_W / 2 - 5},${SVG_PAD + row * POINTER_ROW_H + 17} ${CELL_W / 2 + 5},${SVG_PAD + row * POINTER_ROW_H + 17} ${CELL_W / 2},${SVG_PAD + row * POINTER_ROW_H + 23}`}
          />
        </g>
      ))}
    </g>
  );
}

interface ArrayCellsProps {
  values: Array<number | string>;
  tones?: CellTone[];
  pointers?: CellPointer[];
  ariaLabel?: string;
}

export function ArrayCells({ values, tones, pointers = [], ariaLabel }: ArrayCellsProps) {
  const validPointers = pointers.filter((p) => inRange(p.index, values.length));
  const rowsPerCell = new Map<number, CellPointer[]>();
  for (const pointer of validPointers) {
    const list = rowsPerCell.get(pointer.index) ?? [];
    list.push(pointer);
    rowsPerCell.set(pointer.index, list);
  }
  const pointerRows = Math.max(
    0,
    ...[...rowsPerCell.values()].map((list) => list.length),
  );
  const topPad = SVG_PAD + pointerRows * POINTER_ROW_H;
  const width = SVG_PAD * 2 + values.length * CELL_W + Math.max(0, values.length - 1) * CELL_GAP;
  const height = topPad + CELL_H + SVG_PAD + 22;

  return (
    <svg
      className="viz-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel ?? `Array with ${values.length} cells`}
    >
      {[...rowsPerCell.entries()].map(([index, list]) => (
        <PointerStack
          key={index}
          pointers={list}
          x={SVG_PAD + index * (CELL_W + CELL_GAP)}
        />
      ))}
      {values.map((value, i) => {
        const x = SVG_PAD + i * (CELL_W + CELL_GAP);
        return (
          <g
            key={i}
            className={`viz-anim viz-cell viz-tone-${toneAt(tones, i)}`}
            style={{ transform: `translate(${x}px, ${topPad}px)` }}
          >
            <rect width={CELL_W} height={CELL_H} rx={8} />
            <text x={CELL_W / 2} y={CELL_H / 2 + 5} textAnchor="middle" className="viz-cell-value">
              {value}
            </text>
            <text x={CELL_W / 2} y={CELL_H + 16} textAnchor="middle" className="viz-cell-index">
              {i}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

interface VizNodeProps {
  x: number;
  y: number;
  value: number | string;
  tone?: CellTone;
  radius?: number;
}

/** A single node circle. Compose inside a host <svg> with VizEdge. */
export function VizNode({ x, y, value, tone = 'default', radius = 18 }: VizNodeProps) {
  return (
    <g
      className={`viz-anim viz-node viz-tone-${tone}`}
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      <circle r={radius} />
      <text textAnchor="middle" dy="0.35em" className="viz-node-value">
        {value}
      </text>
    </g>
  );
}

interface VizEdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  tone?: CellTone;
  /** Pixels trimmed from each end (e.g. to stop at node borders). */
  trim?: number;
  width?: number;
}

/** A directed edge with a polygon arrowhead (no <defs> needed). */
export function VizEdge({
  x1,
  y1,
  x2,
  y2,
  label,
  tone = 'default',
  trim = 0,
  width = 2,
}: VizEdgeProps) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const sx = x1 + ux * trim;
  const sy = y1 + uy * trim;
  const ex = x2 - ux * (trim + 9);
  const ey = y2 - uy * (trim + 9);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const midX = (sx + ex) / 2;
  const midY = (sy + ey) / 2;

  return (
    <g className={`viz-anim viz-edge viz-tone-${tone}`}>
      <line x1={sx} y1={sy} x2={ex} y2={ey} strokeWidth={width} />
      <polygon
        points="0,-5 10,0 0,5"
        style={{ transform: `translate(${ex}px, ${ey}px) rotate(${angle}deg)` }}
      />
      {label !== undefined ? (
        <text x={midX} y={midY - 6} textAnchor="middle" className="viz-edge-label">
          {label}
        </text>
      ) : null}
    </g>
  );
}

interface ArrowLabelProps {
  x: number;
  y: number;
  label: string;
  /** Which way the arrow tip points (label sits on the opposite side). */
  direction?: 'up' | 'down';
}

/** A standalone pointer/arrow label for any scene. */
export function ArrowLabel({ x, y, label, direction = 'down' }: ArrowLabelProps) {
  const flip = direction === 'up' ? -1 : 1;
  return (
    <g className="viz-anim" style={{ transform: `translate(${x}px, ${y}px)` }}>
      <text textAnchor="middle" y={flip * -8} className="viz-pointer-label">
        {label}
      </text>
      <polygon
        className="viz-pointer-arrow"
        points={`-5,${flip * 0} 5,${flip * 0} 0,${flip * 8}`}
      />
    </g>
  );
}

interface StackViewProps {
  /** values[0] is the bottom of the stack. */
  values: Array<number | string>;
  tones?: CellTone[];
  topLabel?: string;
  ariaLabel?: string;
}

export function StackView({ values, tones, topLabel = 'top', ariaLabel }: StackViewProps) {
  const w = 104;
  const h = 40;
  const gap = 6;
  const labelW = 52;
  const width = SVG_PAD * 2 + labelW + w;
  const height = SVG_PAD * 2 + values.length * h + Math.max(0, values.length - 1) * gap;

  return (
    <svg
      className="viz-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel ?? `Stack with ${values.length} items`}
    >
      {values.map((value, i) => {
        const fromBottom = values.length - 1 - i;
        const y = SVG_PAD + fromBottom * (h + gap);
        const x = SVG_PAD + labelW;
        const isTop = i === values.length - 1;
        return (
          <g key={i}>
            <g
              className={`viz-anim viz-cell viz-tone-${toneAt(tones, i)}`}
              style={{ transform: `translate(${x}px, ${y}px)` }}
            >
              <rect width={w} height={h} rx={8} />
              <text x={w / 2} y={h / 2 + 5} textAnchor="middle" className="viz-cell-value">
                {value}
              </text>
            </g>
            {isTop && values.length > 0 ? (
              <text x={SVG_PAD + labelW - 8} y={y + h / 2 + 5} textAnchor="end" className="viz-pointer-label">
                {topLabel} ▸
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

interface QueueViewProps {
  /** values[0] is the front of the queue. */
  values: Array<number | string>;
  tones?: CellTone[];
  frontLabel?: string;
  rearLabel?: string;
  ariaLabel?: string;
}

export function QueueView({
  values,
  tones,
  frontLabel = 'front',
  rearLabel = 'rear',
  ariaLabel,
}: QueueViewProps) {
  const width = SVG_PAD * 2 + values.length * CELL_W + Math.max(0, values.length - 1) * CELL_GAP;
  const height = SVG_PAD + CELL_H + 26 + SVG_PAD;

  return (
    <svg
      className="viz-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel ?? `Queue with ${values.length} items`}
    >
      {values.map((value, i) => {
        const x = SVG_PAD + i * (CELL_W + CELL_GAP);
        return (
          <g
            key={i}
            className={`viz-anim viz-cell viz-tone-${toneAt(tones, i)}`}
            style={{ transform: `translate(${x}px, ${SVG_PAD}px)` }}
          >
            <rect width={CELL_W} height={CELL_H} rx={8} />
            <text x={CELL_W / 2} y={CELL_H / 2 + 5} textAnchor="middle" className="viz-cell-value">
              {value}
            </text>
          </g>
        );
      })}
      {values.length > 0 ? (
        <>
          <text
            x={SVG_PAD + CELL_W / 2}
            y={SVG_PAD + CELL_H + 18}
            textAnchor="middle"
            className="viz-pointer-label"
          >
            ▴ {frontLabel}
          </text>
          <text
            x={SVG_PAD + (values.length - 1) * (CELL_W + CELL_GAP) + CELL_W / 2}
            y={SVG_PAD + CELL_H + 18}
            textAnchor="middle"
            className="viz-pointer-label"
          >
            ▴ {rearLabel}
          </text>
        </>
      ) : null}
    </svg>
  );
}

interface BarChartProps {
  values: number[];
  tones?: CellTone[];
  pointers?: CellPointer[];
  maxHeight?: number;
  ariaLabel?: string;
}

export function BarChart({
  values,
  tones,
  pointers = [],
  maxHeight = 140,
  ariaLabel,
}: BarChartProps) {
  const barW = 40;
  const gap = 10;
  const topPad = SVG_PAD + POINTER_ROW_H + 20;
  const bottomPad = 26;
  const max = Math.max(1, ...values);
  const width = SVG_PAD * 2 + values.length * barW + Math.max(0, values.length - 1) * gap;
  const height = topPad + maxHeight + bottomPad;

  return (
    <svg
      className="viz-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel ?? `Bar chart with ${values.length} bars`}
    >
      {values.map((value, i) => {
        const barH = Math.max(2, (value / max) * maxHeight);
        const x = SVG_PAD + i * (barW + gap);
        const y = topPad + (maxHeight - barH);
        const pointer = pointers.find((p) => p.index === i);
        return (
          <g key={i}>
            {pointer ? (
              <text x={x + barW / 2} y={SVG_PAD + 14} textAnchor="middle" className="viz-pointer-label">
                {pointer.label} ▾
              </text>
            ) : null}
            <g className={`viz-anim viz-bar viz-tone-${toneAt(tones, i)}`}>
              <rect x={x} y={y} width={barW} height={barH} rx={6} />
              <text x={x + barW / 2} y={y - 6} textAnchor="middle" className="viz-bar-value">
                {value}
              </text>
              <text
                x={x + barW / 2}
                y={topPad + maxHeight + 18}
                textAnchor="middle"
                className="viz-cell-index"
              >
                {i}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
