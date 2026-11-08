/**
 * loops-and-jump-statements — 2 visuals.
 * 1. for / while / do-while flowcharts with iteration counter (animated).
 * 2. Labeled break / continue path on nested loops (animated).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: loop flowcharts (animated) ---------------- */

const LOOP_STEPS: VizStep[] = [
  { id: 'for', description: 'for (int i=0; i<3; i++): init once, test, body, increment, retest.', state: { loop: 'for', i: 0 } },
  { id: 'while', description: 'while (i < 3): test before every body execution (entry-controlled).', state: { loop: 'while', i: 0 } },
  { id: 'dowhile', description: 'do { body } while (i < 3): body runs at least once (exit-controlled).', state: { loop: 'do-while', i: 0 } },
];

function renderLoop(step: VizStep | undefined) {
  const s = step?.state as { loop?: string; i?: number } ?? {};
  const i = s.i ?? 0;
  const testResult = i < 3;
  return (
    <svg className="viz-svg" viewBox="0 0 560 240" role="img" aria-label="Loop flowcharts">
      <JBox x={40} y={20} w={480} h={44} title={s.loop + ' loop — iteration counter i = ' + i} />
      <JBox x={40} y={80} w={160} title="init" rows={['i = 0']} />
      <JBox x={220} y={80} w={160} title="test i < 3" rows={['i < 3 → ' + testResult]} tone="active" />
      <JBox x={220} y={140} w={160} title="body" rows={['i = ' + i]} />
      <JBox x={400} y={80} w={120} title="increment" rows={['i++']} />
      <JArrow x1={200} y1={106} x2={220} y2={106} />
      <JArrow x1={380} y1={106} x2={400} y2={106} />
      <JArrow x1={380} y1={166} x2={220} y2={166} />
      <JNote x={40} y={205}>{'for/while test before the body (entry-controlled); do-while runs the body first.'}</JNote>
    </svg>
  );
}

function LoopFlowcharts() {
  return <VizPlayer steps={LOOP_STEPS} render={renderLoop} autoPlay={false} />;
}

/* ---------------- Visual 2: labeled break / continue ---------------- */

const JUMP_STEPS: VizStep[] = [
  { id: 'outer', description: 'Outer loop i=0, inner loop j=0..2.', state: { i: 0, j: 0, action: null } },
  { id: 'continue', description: 'continue outer skips to the next outer iteration.', state: { i: 0, j: 1, action: 'continue outer' } },
  { id: 'break', description: 'break outer exits both loops entirely.', state: { i: 1, j: 0, action: 'break outer' } },
];

function renderJump(step: VizStep | undefined) {
  const s = step?.state as { i?: number; j?: number; action?: string } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 560 240" role="img" aria-label="Labeled break/continue on nested loops">
      <JBox x={40} y={20} w={480} h={44} title={'Nested loops with label outer: i = ' + (s.i ?? 0) + ', j = ' + (s.j ?? 0)} />
      <JBox x={40} y={80} w={220} title="outer loop" rows={['for i']} />
      <JBox x={280} y={80} w={240} title="inner loop" rows={['for j']} />
      <JArrow x1={260} y1={106} x2={280} y2={106} />
      <JNote x={40} y={160}>{s.action || 'Labels let break/continue target a specific loop, not just the innermost.'}</JNote>
    </svg>
  );
}

function LabeledJump() {
  return <VizPlayer steps={JUMP_STEPS} render={renderJump} autoPlay={false} />;
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Loop flowcharts',
    caption: 'for, while and do-while with an iteration counter.',
    notice: 'for and while test before the body; do-while executes the body at least once.',
    component: LoopFlowcharts,
  },
  {
    title: 'Labeled break / continue',
    caption: 'Labels let break/continue target a specific loop in nested loops.',
    notice: 'break outer exits both loops; continue outer starts the next outer iteration.',
    component: LabeledJump,
  },
];
