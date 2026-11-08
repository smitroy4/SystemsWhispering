/**
 * method-references-and-composition — 2 visuals.
 * 1. Four method-reference kinds (static).
 * 2. compose / andThen chain (animated).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: four method-reference kinds ---------------- */

function Kinds() {
  return (
    <svg className="viz-svg" viewBox="0 0 600 280" role="img" aria-label="Four method reference kinds">
      <JBox x={40} y={20} w={520} h={44} title="Four method-reference forms: Class::instanceMethod, Class::staticMethod, instance::method, Class::new" />
      <JBox x={40} y={80} w={140} title="Class::instanceMethod" rows={['String::length']} tone="good" />
      <JBox x={200} y={80} w={140} title="Class::staticMethod" rows={['Integer::parseInt']} />
      <JBox x={360} y={80} w={140} title="instance::method" rows={['System.out::println']} />
      <JBox x={40} y={170} w={140} title="Class::new" rows={['ArrayList::new']} tone="good" />
      <JArrow x1={180} y1={120} x2={200} y2={120} />
      <JArrow x1={340} y1={120} x2={360} y2={120} />
      <JNote x={40} y={270}>{'A method reference is a lambda that delegates to an existing method.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: compose / andThen chain (animated) ---------------- */

const COMPOSE_STEPS: VizStep[] = [
  { id: 'a', description: 'andThen: f.andThen(g) applies f first, then g — left to right.', state: { op: 'andThen' } },
  { id: 'b', description: 'compose: f.compose(g) applies g first, then f — right to left.', state: { op: 'compose' } },
];

function renderCompose(step: VizStep | undefined) {
  const s = step?.state as { op?: string } ?? {};
  const label = s.op === 'andThen' ? 'x → f(x) → g(x)' : 'x → g(x) → f(x)';
  return (
    <svg className="viz-svg" viewBox="0 0 520 200" role="img" aria-label="compose andThen chain">
      <JBox x={40} y={20} w={440} h={44} title="andThen / compose chain functions together" />
      <JBox x={40} y={80} w={440} title={label} rows={[]} tone="good" />
      <JNote x={40} y={160}>{'andThen is left-to-right; compose is right-to-left (math order).'}</JNote>
    </svg>
  );
}

function ComposeChain() {
  return <VizPlayer steps={COMPOSE_STEPS} render={renderCompose} autoPlay={false} />;
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Four method-reference kinds',
    caption: 'Class::instanceMethod, Class::staticMethod, instance::method, Class::new.',
    notice: 'Method references are lambdas that delegate to existing methods.',
    component: Kinds,
  },
  {
    title: 'compose / andThen chain',
    caption: 'Data flows through composed functions left-to-right or right-to-left.',
    notice: 'andThen: f then g. compose: g then f.',
    component: ComposeChain,
  },
];
