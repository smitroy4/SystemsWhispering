/**
 * lambdas-and-functional-interfaces — 2 visuals.
 * 1. Anonymous class → lambda transformation steps (animated).
 * 2. Function / Predicate / Consumer / Supplier input-output shape cards (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: anonymous class → lambda (animated) ---------------- */

const LAMBDA_STEPS: VizStep[] = [
  { id: 'a', description: 'Anonymous class: new Runnable() { public void run() { ... } };', state: { stage: 'anon' } },
  { id: 'b', description: 'Lambda: () -> { ... } — same target type, less boilerplate.', state: { stage: 'lambda' } },
  { id: 'c', description: 'Target typing infers the functional interface from context.', state: { stage: 'target' } },
];

function renderLambda(step: VizStep | undefined) {
  const s = step?.state as { stage?: string } ?? {};
  const label = s.stage === 'anon' ? 'anonymous class (boilerplate)' : s.stage === 'lambda' ? 'lambda (concise)' : 'target-typed';
  return (
    <svg className="viz-svg" viewBox="0 0 520 220" role="img" aria-label="Anonymous class to lambda transformation">
      <JBox x={40} y={20} w={440} h={44} title="A lambda is a concise anonymous implementation of a functional interface" />
      <JBox x={40} y={80} w={440} title={label} rows={[]} tone="good" />
      <JNote x={40} y={160}>{'Captured local variables must be effectively final.'}</JNote>
    </svg>
  );
}

function LambdaTransform() {
  return <VizPlayer steps={LAMBDA_STEPS} render={renderLambda} autoPlay={false} />;
}

/* ---------------- Visual 2: standard functional interfaces ---------------- */

function Shapes() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 260" role="img" aria-label="Functional interface input-output shapes">
      <JBox x={40} y={20} w={480} h={44} title="The java.util.function functional interfaces" />
      <JBox x={40} y={80} w={120} title="Predicate<T>" rows={['T → boolean']} tone="good" />
      <JBox x={180} y={80} w={120} title="Consumer<T>" rows={['T → void']} />
      <JBox x={320} y={80} w={120} title="Function<T,R>" rows={['T → R']} tone="good" />
      <JBox x={460} y={80} w={80} title="Supplier<T>" rows={['() → T']} />
      <JArrow x1={160} y1={120} x2={180} y2={120} />
      <JArrow x1={300} y1={120} x2={320} y2={120} />
      <JArrow x1={440} y1={120} x2={460} y2={120} />
      <JNote x={40} y={180}>{'Each is a single-abstract-method interface — a lambda target.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Anonymous class → lambda',
    caption: 'Boilerplate removed; same target type, concise syntax.',
    notice: 'A lambda targets a functional interface (one abstract method).',
    component: LambdaTransform,
  },
  {
    title: 'Function / Predicate / Consumer / Supplier',
    caption: 'Input-output shape cards for the standard functional interfaces.',
    notice: 'Predicate tests, Consumer acts, Function transforms, Supplier produces.',
    component: Shapes,
  },
];
