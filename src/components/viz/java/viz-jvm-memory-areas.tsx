/**
 * jvm-memory-areas — 2 visuals.
 * 1. JVM runtime data areas (static).
 * 2. Stack frame anatomy (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: JVM runtime data areas ---------------- */

function RuntimeAreas() {
  return (
    <svg className="viz-svg" viewBox="0 0 600 300" role="img" aria-label="JVM runtime data areas">
      <JBox x={40} y={20} w={520} h={44} title="JVM runtime data areas: per-thread and shared" />
      <JBox x={40} y={80} w={170} title="Per-thread" rows={['stack', 'PC register', 'native stack']} tone="good" />
      <JBox x={230} y={80} w={170} title="Heap" rows={['shared', 'objects and arrays']} tone="good" />
      <JBox x={420} y={80} w={140} title="Metaspace" rows={['class metadata', 'native memory']} tone="good" />
      <JArrow x1={210} y1={120} x2={230} y2={120} />
      <JArrow x1={400} y1={120} x2={420} y2={120} />
      <JNote x={40} y={180}>{'Stack and PC are per-thread; heap and metaspace are shared across all threads.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: Stack frame anatomy ---------------- */

function FrameAnatomy() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 220" role="img" aria-label="Stack frame anatomy">
      <JBox x={40} y={20} w={480} h={44} title="A stack frame holds locals, operand stack, and return address" />
      <JBox x={40} y={80} w={160} title="Local variables" rows={['method args', 'slot 0..n']} tone="good" />
      <JBox x={220} y={80} w={160} title="Operand stack" rows={['push/pop', 'expression eval']} />
      <JBox x={400} y={80} w={120} title="Frame data" rows={['return address', 'constant pool ref']} />
      <JArrow x1={200} y1={120} x2={220} y2={120} />
      <JArrow x1={380} y1={120} x2={400} y2={120} />
      <JNote x={40} y={180}>{'StackOverflowError = too many frames; OutOfMemoryError = heap exhausted.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'JVM runtime data areas',
    caption: 'Per-thread stack/PC/native stack; shared heap/metaspace.',
    notice: 'StackOverflowError is per-thread stack exhaustion, not heap.',
    component: RuntimeAreas,
  },
  {
    title: 'Stack frame anatomy',
    caption: 'Locals, operand stack, return address — one frame per method invocation.',
    notice: 'Each thread has its own stack of frames.',
    component: FrameAnatomy,
  },
];
