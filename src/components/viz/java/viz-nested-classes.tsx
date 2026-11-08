/**
 * nested-classes — 2 visuals.
 * 1. Four-way nested-class chart: static nested, inner, local, anonymous (static).
 * 2. Variable capture diagram (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: four-way nested class chart ---------------- */

function FourWay() {
  return (
    <svg className="viz-svg" viewBox="0 0 600 320" role="img" aria-label="Four kinds of nested classes">
      <JBox x={40} y={20} w={520} h={44} title="Four ways to nest a class: static nested, inner, local, anonymous" />
      <JBox x={40} y={80} w={140} title="Static nested" rows={['no outer ref', 'like top-level']} tone="good" />
      <JBox x={200} y={80} w={140} title="Inner" rows={['holds outer ref', 'this$0']} />
      <JBox x={360} y={80} w={140} title="Local" rows={['declared in method', 'no name outside']} />
      <JBox x={40} y={170} w={140} title="Anonymous" rows={['no name', 'instantiated inline']} />
      <JBox x={200} y={170} w={140} title="Capture" rows={['effectively final', 'outer variables']} />
      <JArrow x1={180} y1={120} x2={200} y2={120} />
      <JArrow x1={340} y1={120} x2={360} y2={120} />
      <JArrow x1={110} y1={210} x2={140} y2={210} />
      <JArrow x1={340} y1={210} x2={360} y2={210} />
      <JNote x={40} y={270}>{'Inner classes hold an implicit reference to the enclosing instance; static nested classes do not.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: variable capture ---------------- */

function Capture() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 240" role="img" aria-label="Variable capture diagram">
      <JBox x={40} y={20} w={480} h={44} title="Local and anonymous classes capture only effectively final variables" />
      <JBox x={40} y={80} w={260} title="Enclosing method" rows={['void m(int x) {', '  final int y = 1;', '  class Local {', '    void f() { use(x, y); }', '  }', '}']} />
      <JBox x={320} y={80} w={200} title="Captured copy" rows={['x → value', 'y → value']} tone="good" />
      <JArrow x1={300} y1={120} x2={320} y2={120} />
      <JNote x={40} y={180}>{'Captured variables must be effectively final — they are copied into the inner class instance.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Four-way nested-class chart',
    caption: 'Static nested, inner, local, anonymous — scope and outer-reference arrows.',
    notice: 'Inner classes carry an outer reference; static nested classes do not.',
    component: FourWay,
  },
  {
    title: 'Variable capture',
    caption: 'Local and anonymous classes capture effectively final outer variables.',
    notice: 'Captured variables are copied; reassignment after capture is rejected.',
    component: Capture,
  },
];
