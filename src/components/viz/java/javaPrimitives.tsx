/**
 * Java visualization primitives — shared, topic-agnostic SVG building blocks
 * for the Java topic pages.
 *
 * All colors come from styles/tokens.css (--viz-* vars); motion stays in
 * primitives.css (.viz-anim, viz-tone-*). No new colors, fonts or libraries.
 */
import '../primitives.css';

export type JTone = 'default' | 'active' | 'compared' | 'swapped' | 'done' | 'good' | 'bad' | 'neutral';

const SVG_PAD = 12;

/** Small SVG text. */
export function JText({
  x = 0,
  y = 0,
  children,
  fill = 'var(--viz-ink)',
  fontSize = 13,
  fontWeight = '600',
  textAnchor = 'middle',
  dy,
}: {
  x?: number;
  y?: number;
  children: string | number;
  fill?: string;
  fontSize?: number;
  fontWeight?: number | string;
  textAnchor?: 'start' | 'middle' | 'end';
  dy?: string;
}) {
  return (
    <text
      x={x}
      y={y}
      fill={fill}
      fontSize={fontSize}
      fontWeight={fontWeight}
      textAnchor={textAnchor}
      dy={dy}
    >
      {children}
    </text>
  );
}

/** Rounded box with a title row and optional value rows. */
export function JBox({
  x,
  y,
  w,
  h = 40,
  title,
  rows = [],
  tone = 'default',
  titleFill = 'var(--viz-ink)',
  onClick,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  title?: string;
  rows?: string[];
  tone?: JTone;
  titleFill?: string;
  onClick?: () => void;
}) {
  const rowH = 18;
  const height = h < rowH * rows.length ? rowH * rows.length + 10 : h;
  return (
    <g
      className={`viz-anim jbox viz-tone-${tone}`}
      style={{ transform: `translate(${x}px, ${y}px)`, cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <rect x={0} y={0} width={w} height={height} rx={8} />
      {title ? (
        <g>
          <rect x={0} y={0} width={w} height={rowH} rx={8} />
          <JText x={w / 2} y={rowH / 2 + 5} fill={titleFill} fontSize={14}>
            {title}
          </JText>
          {rows.length > 0 && (
            <line x1={0} y1={rowH} x2={w} y2={rowH} stroke="currentColor" strokeOpacity="0.25" />
          )}
        </g>
      ) : null}
      {rows.map((row, i) => {
        const yy = rowH + 14 + i * rowH;
        return (
          <JText key={i} x={10} y={yy} fontSize={12} fontWeight="400" textAnchor="start">
            {row}
          </JText>
        );
      })}
    </g>
  );
}

/** Directed arrow between two points, with an optional label beside it. */
export function JArrow({
  x1,
  y1,
  x2,
  y2,
  label,
  tone = 'default',
  trim = 10,
  width = 2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  tone?: JTone;
  trim?: number;
  width?: number;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const sx = x1 + ux * trim;
  const sy = y1 + uy * trim;
  const ex = x2 - ux * (trim + 8);
  const ey = y2 - uy * (trim + 8);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const midX = (sx + ex) / 2;
  const midY = (sy + ey) / 2;

  return (
    <g className={`viz-anim jarrow viz-tone-${tone}`}>
      <line x1={sx} y1={sy} x2={ex} y2={ey} strokeWidth={width} />
      <polygon points="0,-5 10,0 0,5" style={{ transform: `translate(${ex}px, ${ey}px) rotate(${angle}deg)` }} />
      {label !== undefined ? (
        <JText
          x={midX}
          y={midY - 10}
          fontSize={12}
          fontWeight="700"
          fill={tone === 'active' ? 'var(--viz-active-stroke)' : 'var(--viz-muted-ink)'}
        >
          {label}
        </JText>
      ) : null}
    </g>
  );
}

/** A circle node with a label inside. */
export function JCircle({
  x,
  y,
  r = 16,
  value,
  tone = 'default',
}: {
  x: number;
  y: number;
  r?: number;
  value?: string | number;
  tone?: JTone;
}) {
  return (
    <g className={`viz-anim jcircle viz-tone-${tone}`} style={{ transform: `translate(${x}px, ${y}px)` }}>
      <circle r={r} />
      {value !== undefined ? (
        <text x={0} y={r / 2 + 5} textAnchor="middle" dy="0.35em" fill="var(--viz-ink)" fontSize={13}>
          {value}
        </text>
      ) : null}
    </g>
  );
}

/** A caption note below a scene. */
export function JNote({
  x,
  y,
  children,
  w = 300,
  tone = 'muted',
}: {
  x: number;
  y: number;
  children: string;
  w?: number;
  tone?: 'muted' | 'good' | 'bad' | 'info';
}) {
  const toneColor =
    tone === 'good'
      ? 'var(--color-success)'
      : tone === 'bad'
        ? 'var(--color-danger)'
        : tone === 'info'
          ? 'var(--color-info)'
          : 'var(--color-text-muted)';
  return (
    <g className="jnote" style={{ transform: `translate(${x}px, ${y}px)` }}>
      <rect x={0} y={0} width={w} height={40} rx={6} fill="var(--color-bg-raised)" stroke="var(--color-border)" />
      <JText x={10} y={24} fill={toneColor} fontSize={12} fontWeight="500" textAnchor="start">
        {children}
      </JText>
    </g>
  );
}

/** A stack frame drawer (bottom = oldest). */
export function JStack({
  w = 140,
  h = 44,
  gap = 8,
  values,
  topLabel = 'top',
  tones,
}: {
  w?: number;
  h?: number;
  gap?: number;
  values: string[];
  topLabel?: string;
  tones?: JTone[];
}) {
  const n = values.length;
  const height = SVG_PAD * 2 + n * h + Math.max(0, n - 1) * gap;
  return (
    <svg
      className="viz-svg"
      viewBox={`0 0 ${w + SVG_PAD * 2} ${height}`}
      role="img"
      aria-label={`Stack with ${n} frames`}
    >
      {values.map((value, i) => {
        const fromBottom = n - 1 - i;
        const yy = SVG_PAD + fromBottom * (h + gap);
        return (
          <g key={i}>
            <g className={`viz-anim viz-cell viz-tone-${tones?.[i] ?? 'default'}`} style={{ transform: `translate(${SVG_PAD}px, ${yy}px)` }}>
              <rect width={w} height={h} rx={8} />
              <text x={w / 2} y={h / 2 + 5} textAnchor="middle" className="viz-cell-value">
                {value}
              </text>
            </g>
            {i === n - 1 && n > 0 ? (
              <text x={SVG_PAD - 8} y={yy + h / 2 + 5} textAnchor="end" className="viz-pointer-label">
                {topLabel} ▸
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

/** A heap object box with fields inside, positioned at (x, y). */
export function JHeapObject({
  x,
  y,
  w,
  label,
  fields = [],
  tone = 'default',
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  fields?: { name: string; value: string }[];
  tone?: JTone;
}) {
  const rowH = 20;
  const headerH = 30;
  const height = headerH + fields.length * rowH + 10;
  return (
    <g className={`viz-anim jheap viz-tone-${tone}`} style={{ transform: `translate(${x}px, ${y}px)` }}>
      <rect x={0} y={0} width={w} height={height} rx={8} />
      <rect x={0} y={0} width={w} height={headerH} rx={8} />
      <JText x={w / 2} y={headerH / 2 + 4} fontSize={13}>
        {label}
      </JText>
      {fields.map((f, i) => {
        const yy = headerH + 10 + i * rowH;
        return (
          <g key={i}>
            <JText x={10} y={yy + 5} fontSize={12} fontWeight="400" textAnchor="start">
              {f.name}
            </JText>
            <JText x={w - 10} y={yy + 5} fontSize={12} fontWeight="400" textAnchor="end">
              {f.value}
            </JText>
          </g>
        );
      })}
    </g>
  );
}

/** Respect prefers-reduced-motion: returns true when animation should be disabled. */
export function useReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
