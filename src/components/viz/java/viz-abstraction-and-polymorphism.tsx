/**
 * abstraction-and-polymorphism — 2 visuals.
 * 1. Abstract class / interface hierarchy (static).
 * 2. Dynamic dispatch runtime resolution (animated).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: abstract class / interface hierarchy ---------------- */

function Hierarchy() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 260" role="img" aria-label="Abstract class and interface hierarchy">
      <JBox x={40} y={20} w={480} h={44} title="Abstract classes and interfaces define contracts; concrete classes implement them" />
      <JBox x={40} y={80} w={160} title="Shape" rows={['abstract']} />
      <JBox x={220} y={80} w={160} title="Circle" rows={['concrete']} tone="good" />
      <JBox x={220} y={160} w={160} title="Square" rows={['concrete']} tone="good" />
      <JBox x={400} y={80} w={120} title="Drawable" rows={['interface']} />
      <JArrow x1={200} y1={108} x2={220} y2={108} />
      <JArrow x1={200} y1={188} x2={220} y2={188} />
      <JArrow x1={120} y1={135} x2={400} y2={135} />
      <JNote x={40} y={225}>{'An abstract class cannot be instantiated; an interface is a pure contract.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: dynamic dispatch (animated) ---------------- */

const DISPATCH_STEPS: VizStep[] = [
  { id: 'call', description: 'shape.area() — compile-time type is Shape, runtime type decides.', state: { phase: 'call' } },
  { id: 'resolve', description: 'JVM looks up the actual object (Circle) and invokes Circle.area().', state: { phase: 'resolve' } },
  { id: 'result', description: 'Circle.area() runs — dynamic dispatch resolved at runtime.', state: { phase: 'result' } },
];

function renderDispatch(step: VizStep | undefined) {
  const s = step?.state as { phase?: string } ?? {};
  const active = (p: string) => s.phase === p ? 'active' : 'default';
  return (
    <svg className="viz-svg" viewBox="0 0 520 240" role="img" aria-label="Dynamic dispatch runtime resolution">
      <JBox x={40} y={20} w={440} h={44} title="Dynamic dispatch: the JVM resolves the method on the actual runtime object" />
      <JBox x={40} y={80} w={160} title="Shape shape" rows={['= new Circle()']} tone={active('call')} />
      <JBox x={220} y={80} w={160} title="Circle object" rows={['area() → 78.5']} tone={active('resolve')} />
      <JBox x={400} y={80} w={80} title="78.5" rows={[]} tone={active('result')} />
      <JArrow x1={200} y1={108} x2={220} y2={108} tone={active('resolve')} />
      <JArrow x1={380} y1={108} x2={400} y2={108} tone={active('result')} />
      <JNote x={40} y={160}>{'Overriding is resolved at runtime by the actual object type — that is polymorphism.'}</JNote>
    </svg>
  );
}

function DynamicDispatch() {
  return <VizPlayer steps={DISPATCH_STEPS} render={renderDispatch} autoPlay={false} />;
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Abstract class / interface hierarchy',
    caption: 'Abstract classes and interfaces define contracts; concrete classes implement them.',
    notice: 'An abstract class cannot be instantiated; an interface is a pure contract.',
    component: Hierarchy,
  },
  {
    title: 'Dynamic dispatch',
    caption: 'The JVM resolves an overridden call on the actual runtime object.',
    notice: 'Override = runtime polymorphism; overload = compile-time.',
    component: DynamicDispatch,
  },
];
