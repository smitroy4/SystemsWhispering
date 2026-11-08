/**
 * wildcards — 2 visuals.
 * 1. ? / ? extends / ? super subtype diagram (static).
 * 2. PECS producer / consumer arrows (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: wildcard subtype diagram ---------------- */

function Diagram() {
  return (
    <svg className="viz-svg" viewBox="0 0 600 240" role="img" aria-label="Wildcard subtype diagram">
      <JBox x={40} y={20} w={520} h={44} title="? / ? extends / ? super — what each wildcard admits" />
      <JBox x={40} y={80} w={160} title="? extends T" rows={['T and subtypes']} tone="good" />
      <JBox x={220} y={80} w={160} title="?" rows={['any type']} />
      <JBox x={400} y={80} w={160} title="? super T" rows={['T and supertypes']} tone="good" />
      <JArrow x1={200} y1={120} x2={220} y2={120} />
      <JArrow x1={380} y1={120} x2={400} y2={120} />
      <JNote x={40} y={175}>{'? extends T reads; ? super T writes.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: PECS producer / consumer ---------------- */

function Pecs() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 220" role="img" aria-label="PECS producer consumer arrows">
      <JBox x={40} y={20} w={480} h={44} title="PECS: Producer Extends, Consumer Super" />
      <JBox x={40} y={80} w={240} title="Producer" rows={['? extends T', 'read only', 'source of T']} tone="good" />
      <JBox x={300} y={80} w={240} title="Consumer" rows={['? super T', 'write only', 'sink for T']} tone="good" />
      <JArrow x1={280} y1={120} x2={300} y2={120} />
      <JNote x={40} y={175}>{'Use extends for producers, super for consumers.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: '? / ? extends / ? super subtype diagram',
    caption: 'Each wildcard admits a different part of the type hierarchy.',
    notice: '? extends is covariant (read); ? super is contravariant (write).',
    component: Diagram,
  },
  {
    title: 'PECS producer / consumer arrows',
    caption: 'Producer extends, consumer super — choose by read vs write.',
    notice: 'Use ? extends T when you only read, ? super T when you only write.',
    component: Pecs,
  },
];
