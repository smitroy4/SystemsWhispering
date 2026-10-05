/**
 * Shared SVG building blocks for LLD illustrations.
 * Boxes carry a title plus detail rows; arrows reuse the VizEdge look
 * via plain lines so dashed/diagram styles stay local to LLD.
 */
import type { ReactNode } from 'react';
import './lld-illustrations.css';

export type LldTone = 'default' | 'good' | 'bad' | 'iface';

export interface LBoxSpec {
  x: number;
  y: number;
  w: number;
  title: string;
  rows?: string[];
  tone?: LldTone;
}

export function LBox({ x, y, w, title, rows = [], tone = 'default' }: LBoxSpec) {
  const h = 34 + rows.length * 17;
  return (
    <g className={`viz-anim lld-box lld-box--${tone}`} style={{ transform: `translate(${x}px, ${y}px)` }}>
      <rect width={w} height={h} rx={9} />
      <text x={12} y={21} className="lld-box-title">
        {title}
      </text>
      {rows.map((row, i) => (
        <text key={i} x={12} y={38 + i * 17} className="lld-box-row">
          {row}
        </text>
      ))}
    </g>
  );
}

export interface LArrowSpec {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  active?: boolean;
  dashed?: boolean;
}

export function LArrow({ x1, y1, x2, y2, label, active = false, dashed = false }: LArrowSpec) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const ex = x2 - ux * 10;
  const ey = y2 - uy * 10;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <g className={`viz-anim lld-arrow${active ? ' lld-arrow--active' : ''}`}>
      <line x1={x1} y1={y1} x2={ex} y2={ey} strokeDasharray={dashed ? '6 4' : undefined} />
      <polygon
        points="0,-5 10,0 0,5"
        style={{ transform: `translate(${ex}px, ${ey}px) rotate(${angle}deg)` }}
      />
      {label !== undefined ? (
        <text x={(x1 + ex) / 2} y={(y1 + ey) / 2 - 7} textAnchor="middle" className="lld-edge-label">
          {label}
        </text>
      ) : null}
    </g>
  );
}

export function LNote({ x, y, children, anchor = 'middle' }: { x: number; y: number; children: ReactNode; anchor?: 'middle' | 'start' | 'end' }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className="lld-note">
      {children}
    </text>
  );
}

export function LCross({ x, y }: { x: number; y: number }) {
  return (
    <g className="lld-cross" style={{ transform: `translate(${x}px, ${y}px)` }}>
      <line x1={-8} y1={-8} x2={8} y2={8} />
      <line x1={8} y1={-8} x2={-8} y2={8} />
    </g>
  );
}

export function LCheck({ x, y }: { x: number; y: number }) {
  return (
    <polyline
      className="lld-check"
      points={`${x - 9},${y} ${x - 2},${y + 7} ${x + 9},${y - 7}`}
    />
  );
}
