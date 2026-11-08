/**
 * methods-recursion-overloading — 3 visuals.
 * 1. Pass-by-value stack frames for primitives vs references (animated).
 * 2. Recursion call-stack push/pop (factorial) (animated).
 * 3. Overload resolution decision flow (static).
 */
import { JBox, JArrow, JNote, JStack } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: pass-by-value stack frames ---------------- */

function PassByValue() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 300" role="img" aria-label="Pass-by-value stack frames primitives vs references">
      <JBox x={40} y={20} w={480} h={44} title="Java is pass-by-value: primitives copy the value, references copy the handle" />
      <JBox x={40} y={80} w={250} title="Primitive int" rows={['int x = 5;', 'foo(x);', 'x still 5']} tone="good" />
      <JBox x={320} y={80} w={200} title="Reference int[]" rows={['int[] a = {1, 2};', 'foo(a);', 'a[0] may change']} tone="default" />
      <JArrow x1={290} y1={108} x2={320} y2={108} />
      <JNote x={40} y={160}>{'A reference is a value: the handle is copied, so the callee sees the same object but cannot reassign the caller’s variable.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: recursion call-stack (animated) ---------------- */

const RECURSION_STEPS: VizStep[] = [
  { id: 'fact3', description: 'factorial(3) pushes frame fact(3).', state: { n: 3, stack: ['fact(3)'] } },
  { id: 'fact2', description: 'fact(3) calls fact(2) — push frame.', state: { n: 2, stack: ['fact(3)', 'fact(2)'] } },
  { id: 'fact1', description: 'fact(2) calls fact(1) — push frame.', state: { n: 1, stack: ['fact(3)', 'fact(2)', 'fact(1)'] } },
  { id: 'base', description: 'fact(1) returns 1 — pop frames and multiply.', state: { n: 1, stack: ['fact(3)', 'fact(2)'] } },
];

function renderRecursion(step: VizStep | undefined) {
  const s = step?.state as { n?: number; stack?: string[] } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 500 300" role="img" aria-label="Recursion call-stack push/pop factorial">
      <JBox x={40} y={20} w={420} h={44} title="factorial(n): each call pushes a stack frame; base case pops" />
      <JStack values={s.stack ?? []} topLabel="top" />
      <JNote x={40} y={240}>{'Deep recursion can overflow the fixed-size stack → StackOverflowError.'}</JNote>
    </svg>
  );
}

function RecursionStack() {
  return <VizPlayer steps={RECURSION_STEPS} render={renderRecursion} autoPlay={false} />;
}

/* ---------------- Visual 3: overload resolution decision flow ---------------- */

function OverloadFlow() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 260" role="img" aria-label="Overload resolution decision flow">
      <JBox x={40} y={20} w={480} h={44} title="Overload resolution: pick the most specific applicable method" />
      <JBox x={40} y={80} w={160} title="Argument" rows={['int literal']} tone="good" />
      <JBox x={220} y={80} w={160} title="Candidates" rows={['m(int)', 'm(long)', 'm(Object)']} />
      <JBox x={400} y={80} w={120} title="Chosen" rows={['m(int)']} tone="good" />
      <JArrow x1={200} y1={108} x2={220} y2={108} />
      <JArrow x1={380} y1={108} x2={400} y2={108} />
      <JBox x={40} y={160} w={480} title="Tie-breakers" rows={['exact match beats widening', 'widening beats boxing', 'boxing beats varargs']} />
      <JNote x={40} y={235}>{'The compiler picks the most specific applicable overload at compile time.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Pass-by-value stack frames',
    caption: 'Primitives copy the value; references copy the handle.',
    notice: 'Java is always pass-by-value — even for object references.',
    component: PassByValue,
  },
  {
    title: 'Recursion call-stack push/pop',
    caption: 'factorial(n) pushes a frame per call, pops on the base case.',
    notice: 'Deep recursion overflows the stack (StackOverflowError).',
    component: RecursionStack,
  },
  {
    title: 'Overload resolution',
    caption: 'Compile-time selection of the most specific applicable method.',
    notice: 'Exact match beats widening beats boxing beats varargs.',
    component: OverloadFlow,
  },
];
