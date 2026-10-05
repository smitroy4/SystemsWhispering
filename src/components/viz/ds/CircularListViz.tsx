import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { VizEdge, VizNode } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface CircularListState {
  values: number[];
  tones: CellTone[];
  /** Edge index (node i → next) highlighted; -1 for none. */
  activeEdge: number;
  /** When false, the tail dangles toward null (plain singly list). */
  closed: boolean;
}

function frame(
  id: string,
  description: string,
  values: number[],
  tones: CellTone[],
  activeEdge = -1,
  closed = true,
): VizStep {
  return {
    id,
    description,
    state: { values, tones, activeEdge, closed } satisfies CircularListState,
    highlight: activeEdge >= 0 ? [activeEdge] : [],
  };
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

/** Close 10 → 20 → 30 into a ring, walk it with a counter, splice, done. */
function buildSteps(): VizStep[] {
  return [
    frame('start', 'Start: 10 → 20 → 30 → null. A plain singly list — the tail points nowhere.', [10, 20, 30], [D, D, D], -1, false),
    frame('close', 'Close the ring: tail.next = head. One assignment, no more null.', [10, 20, 30], [D, D, S], 2),
    frame('walk-10', 'Walk with a counter, not null: visit #1 = 10, follow its edge.', [10, 20, 30], [A, D, D], 0),
    frame('walk-20', 'Visit #2 = 20. No null in sight — the counter is the stop sign.', [10, 20, 30], [D, A, D], 1),
    frame('walk-30', 'Visit #3 = 30, then follow the ring edge home to 10.', [10, 20, 30], [D, D, A], 2),
    frame('stop', 'Back at 10 after exactly size steps — stop. Counting beats null-checks here.', [10, 20, 30], [D, D, D]),
    frame('insert', 'Insert 25 after 20: same splice as a singly list, ring stays closed.', [10, 20, 25, 30], [D, D, S, D], 1),
    frame('delete', 'Delete 20: bypass it (10 → 25). One rewiring, still a ring.', [10, 25, 30], [A, S, D], 0),
    frame('done', 'Done: 10 → 25 → 30 → head. Splicing is O(1); stopping takes discipline.', [10, 25, 30], [DONE, DONE, DONE], -1),
  ];
}

const RADIUS = 20;
const CX = 170;
const CY = 128;

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as CircularListState;
  const n = state.values.length;
  const ringR = Math.max(56, n * 30);
  const width = CX * 2;
  const height = CY * 2;
  const pts = state.values.map((_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / Math.max(1, n);
    return { x: CX + ringR * Math.cos(angle), y: CY + ringR * Math.sin(angle), angle };
  });
  const edgeCount = state.closed ? n : Math.max(0, n - 1);

  return (
    <svg
      className="viz-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Circular linked list with ${n} nodes`}
    >
      {pts.slice(0, edgeCount).map((p, i) => {
        const q = pts[(i + 1) % n];
        return (
          <VizEdge
            key={`e${i}`}
            x1={p.x}
            y1={p.y}
            x2={q.x}
            y2={q.y}
            trim={RADIUS + 2}
            tone={state.activeEdge === i ? 'active' : 'default'}
          />
        );
      })}
      {!state.closed && n > 0 ? (
        <>
          <VizEdge
            x1={pts[n - 1].x}
            y1={pts[n - 1].y}
            x2={pts[n - 1].x + 44}
            y2={pts[n - 1].y}
            trim={RADIUS + 2}
            tone="default"
          />
          <text x={pts[n - 1].x + 50} y={pts[n - 1].y + 5} className="viz-edge-label">
            null
          </text>
        </>
      ) : null}
      {state.values.map((value, i) => (
        <VizNode key={`${i}-${value}`} x={pts[i].x} y={pts[i].y} value={value} tone={state.tones[i] ?? 'default'} radius={RADIUS} />
      ))}
      {n > 0 ? (
        <text
          x={pts[0].x}
          y={pts[0].y - RADIUS - 10}
          textAnchor="middle"
          className="viz-pointer-label"
        >
          head
        </text>
      ) : null}
    </svg>
  );
}

export default function CircularListViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
