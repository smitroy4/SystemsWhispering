/**
 * exception-hierarchy-and-custom-exceptions — 2 visuals.
 * 1. Throwable tree Error / Exception / RuntimeException with checked labels (static).
 * 2. throw vs throws (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: Throwable tree ---------------- */

function Hierarchy() {
  return (
    <svg className="viz-svg" viewBox="0 0 600 280" role="img" aria-label="Throwable hierarchy Error Exception RuntimeException">
      <JBox x={40} y={20} w={520} h={44} title="Throwable tree: checked vs unchecked, Errors vs Exceptions" />
      <JBox x={40} y={80} w={160} title="Throwable" rows={['root']} tone="good" />
      <JBox x={220} y={80} w={160} title="Error" rows={['unchecked, serious']} tone="bad" />
      <JBox x={400} y={80} w={160} title="Exception" rows={['checked by default']} tone="good" />
      <JBox x={40} y={160} w={160} title="RuntimeException" rows={['unchecked', 'programming errors']} tone="bad" />
      <JArrow x1={200} y1={108} x2={220} y2={108} />
      <JArrow x1={380} y1={108} x2={400} y2={108} />
      <JArrow x1={120} y1={135} x2={40} y2={160} />
      <JNote x={40} y={235}>{'Checked exceptions must be caught or declared; unchecked (RuntimeException, Error) need not be.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: throw vs throws ---------------- */

function ThrowThrows() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 220" role="img" aria-label="throw vs throws">
      <JBox x={40} y={20} w={480} h={44} title="throw raises an exception; throws declares what a method may throw" />
      <JBox x={40} y={80} w={240} title="throw" rows={['throw new IOException();', 'inside a method body']} tone="good" />
      <JBox x={300} y={80} w={220} title="throws" rows={['void m() throws IOException', 'in the method signature']} tone="good" />
      <JArrow x1={280} y1={120} x2={300} y2={120} />
      <JNote x={40} y={175}>{'throw = create and raise; throws = declare a contract for callers.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Throwable hierarchy',
    caption: 'Error / Exception / RuntimeException — checked vs unchecked labels.',
    notice: 'Errors are serious JVM problems; exceptions are recoverable conditions.',
    component: Hierarchy,
  },
  {
    title: 'throw vs throws',
    caption: 'throw raises an exception; throws declares it in a signature.',
    notice: 'Checked exceptions must be caught or declared.',
    component: ThrowThrows,
  },
];
