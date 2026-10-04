import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from '../algo/StatePanel.tsx';
import type { StateEntry } from '../algo/StatePanel.tsx';
import type { VizStep } from '../../../types/content.ts';
import './concepts.css';

interface CurveDef {
  key: string;
  label: string;
  fn: (n: number) => number;
}

const CURVES: CurveDef[] = [
  { key: 'o1', label: 'O(1)', fn: () => 1 },
  { key: 'ologn', label: 'O(log n)', fn: (n) => Math.log2(Math.max(n, 1)) },
  { key: 'on', label: 'O(n)', fn: (n) => n },
  { key: 'onlogn', label: 'O(n log n)', fn: (n) => n * Math.log2(Math.max(n, 1)) },
  { key: 'on2', label: 'O(n²)', fn: (n) => n * n },
];

const N_MAX = 100;
const Y_MAX = N_MAX * N_MAX;
const W = 560;
const H = 300;
const PAD = 36;

function x(n: number): number {
  return PAD + (n / N_MAX) * (W - PAD - 12);
}

function y(v: number): number {
  return H - PAD - (Math.min(v, Y_MAX) / Y_MAX) * (H - PAD - 12);
}

function pointsUpTo(fn: (n: number) => number, nMax: number): string {
  const pts: string[] = [];
  for (let n = 1; n <= nMax; n += 1) {
    pts.push(`${x(n).toFixed(1)},${y(fn(n)).toFixed(1)}`);
  }
  return pts.join(' ');
}

interface GrowthState {
  n: number;
  panel: StateEntry[];
}

function fmt(v: number): string {
  return v >= 100 ? Math.round(v).toString() : v.toFixed(1);
}

/** Growth curves revealed as n marches 5 → 100. */
function buildSteps(): VizStep[] {
  const stops = [5, 10, 20, 40, 60, 80, 100];
  return stops.map((n, i) => ({
    id: `n-${n}`,
    description:
      i === 0
        ? `At n = ${n} every curve still looks tame — differences are just constants.`
        : i === stops.length - 1
          ? `At n = ${n} the quadratic towers over everything while log n barely lifts off. That gap is why Big-O matters.`
          : `At n = ${n} the curves separate: O(n²) pulls away, O(n log n) bends upward, O(n) climbs steadily.`,
    state: {
      n,
      panel: CURVES.map((c) => ({ label: c.label, value: fmt(c.fn(n)) })),
    } satisfies GrowthState,
    highlight: [],
  }));
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as GrowthState;
  return (
    <div className="algo-scene">
      <svg
        className="viz-svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Growth curves up to n = ${state.n}`}
      >
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            className="viz-chart-grid"
            x1={PAD}
            y1={H - PAD - f * (H - PAD - 12)}
            x2={W - 12}
            y2={H - PAD - f * (H - PAD - 12)}
          />
        ))}
        <line className="viz-chart-axis" x1={PAD} y1={8} x2={PAD} y2={H - PAD} />
        <line className="viz-chart-axis" x1={PAD} y1={H - PAD} x2={W - 12} y2={H - PAD} />
        <text className="viz-chart-label" x={W - 12} y={H - PAD + 18} textAnchor="end">
          n (→ {state.n})
        </text>
        <text className="viz-chart-label" x={6} y={16}>
          ops
        </text>
        {CURVES.map((c) => (
          <g key={c.key}>
            <polyline className={`viz-curve viz-curve-${c.key}`} points={pointsUpTo(c.fn, state.n)} />
            <text
              className={`viz-curve-tag viz-curve-tag-${c.key}`}
              x={Math.min(x(state.n) + 4, W - 64)}
              y={Math.max(y(c.fn(state.n)) + 4, 12)}
            >
              {c.label}
            </text>
          </g>
        ))}
      </svg>
      <StatePanel title={`Operations at n = ${state.n}`} entries={state.panel} />
    </div>
  );
}

export default function BigOCurvesViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend
        items={[
          { tone: 'default', label: 'Curves', hint: 'O(1) · O(log n) · O(n) · O(n log n) · O(n²)' },
        ]}
      />
    </>
  );
}
