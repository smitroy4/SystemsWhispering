/**
 * constructors — 2 visuals.
 * 1. this(...) chaining path (animated).
 * 2. Initialization order timeline: static → instance blocks → constructors (animated).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: this(...) chaining (animated) ---------------- */

const CHAIN_STEPS: VizStep[] = [
  { id: 'a', description: 'Point(int x, int y) delegates to this(0, 0) then sets fields.', state: { ctor: 'Point(x, y)', delegating: true } },
  { id: 'b', description: 'this(0, 0) runs first — default constructor body.', state: { ctor: 'Point()', delegating: false } },
  { id: 'c', description: 'Control returns to Point(x, y) — x = xArg; y = yArg;.', state: { ctor: 'Point(x, y)', delegating: false } },
];

function renderChain(step: VizStep | undefined) {
  const s = step?.state as { ctor?: string; delegating?: boolean } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 520 240" role="img" aria-label="Constructor this chaining">
      <JBox x={40} y={20} w={440} h={44} title="this(...) chains to another constructor in the same class" />
      <JBox x={40} y={80} w={220} title="Point(x, y)" rows={['calls this(0, 0) first']} tone={s.ctor === 'Point(x, y)' ? 'active' : 'default'} />
      <JBox x={280} y={80} w={200} title="Point()" rows={['default constructor']} tone={s.ctor === 'Point()' ? 'active' : 'default'} />
      <JArrow x1={260} y1={108} x2={280} y2={108} tone="active" />
      <JNote x={40} y={160}>{'this(...) must be the first statement; it delegates before the current body runs.'}</JNote>
    </svg>
  );
}

function ThisChain() {
  return <VizPlayer steps={CHAIN_STEPS} render={renderChain} autoPlay={false} />;
}

/* ---------------- Visual 2: initialization order timeline ---------------- */

const ORDER_STEPS: VizStep[] = [
  { id: 'static', description: 'Class loading: static fields and static blocks run (top to bottom).', state: { phase: 'static' } },
  { id: 'instance', description: 'Object creation: instance fields and instance initializer blocks run.', state: { phase: 'instance' } },
  { id: 'ctor', description: 'Constructor body runs last.', state: { phase: 'constructor' } },
];

function renderOrder(step: VizStep | undefined) {
  const s = step?.state as { phase?: string } ?? {};
  const active = (p: string) => s.phase === p ? 'active' : 'default';
  return (
    <svg className="viz-svg" viewBox="0 0 520 240" role="img" aria-label="Initialization order timeline">
      <JBox x={40} y={20} w={440} h={44} title="Initialization order: static → instance fields/blocks → constructor" />
      <JBox x={40} y={80} w={140} title="1. Static" rows={['static fields', 'static blocks']} tone={active('static')} />
      <JBox x={190} y={80} w={160} title="2. Instance" rows={['instance fields', 'instance blocks']} tone={active('instance')} />
      <JBox x={360} y={80} w={120} title="3. Constructor" rows={['constructor body']} tone={active('constructor')} />
      <JArrow x1={180} y1={108} x2={190} y2={108} tone={active('instance')} />
      <JArrow x1={350} y1={108} x2={360} y2={108} tone={active('constructor')} />
      <JNote x={40} y={160}>{'static members initialize once at class load; instance members initialize per new.'}</JNote>
    </svg>
  );
}

function InitOrder() {
  return <VizPlayer steps={ORDER_STEPS} render={renderOrder} autoPlay={false} />;
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'this(...) chaining path',
    caption: 'A constructor can delegate to another in the same class via this(...).',
    notice: 'this(...) must be the first statement in the constructor.',
    component: ThisChain,
  },
  {
    title: 'Initialization order timeline',
    caption: 'static → instance fields/blocks → constructor body.',
    notice: 'Static members run once at class load; instance members run per object.',
    component: InitOrder,
  },
];
