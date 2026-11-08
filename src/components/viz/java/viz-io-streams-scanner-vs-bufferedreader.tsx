/**
 * io-streams-scanner-vs-bufferedreader — 2 visuals.
 * 1. Byte / char stream hierarchy tree (static).
 * 2. Buffered vs unbuffered read (animated).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: stream hierarchy tree ---------------- */

function Hierarchy() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 260" role="img" aria-label="Byte and char stream hierarchy">
      <JBox x={40} y={20} w={480} h={44} title="Byte streams and character streams; Scanner and BufferedReader on top" />
      <JBox x={40} y={80} w={160} title="InputStream" rows={['read()', 'byte-based']} />
      <JBox x={220} y={80} w={160} title="Reader" rows={['read()', 'char-based']} tone="good" />
      <JBox x={400} y={80} w={120} title="Scanner" rows={['parsed tokens']} />
      <JBox x={40} y={150} w={160} title="BufferedReader" rows={['readLine()', 'buffered']} tone="good" />
      <JArrow x1={200} y1={108} x2={220} y2={108} />
      <JArrow x1={200} y1={180} x2={40} y2={180} />
      <JNote x={40} y={225}>{'Use BufferedReader for large text; Scanner for parsing tokens.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: buffered vs unbuffered read (animated) ---------------- */

const BUFFER_STEPS: VizStep[] = [
  { id: 'a', description: 'Unbuffered: each read() hits the underlying source.', state: { mode: 'unbuffered' } },
  { id: 'b', description: 'Buffered: one large read fills the buffer; later reads come from memory.', state: { mode: 'buffered' } },
];

function renderBuffer(step: VizStep | undefined) {
  const s = step?.state as { mode?: string } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 520 200" role="img" aria-label="Buffered vs unbuffered read">
      <JBox x={40} y={20} w={440} h={44} title="Buffering reduces expensive underlying-source reads" />
      <JBox x={40} y={80} w={440} title={s.mode === 'buffered' ? 'buffered: few source reads' : 'unbuffered: many source reads'} rows={[]} tone={s.mode === 'buffered' ? 'good' : 'bad'} />
      <JNote x={40} y={160}>{'BufferedReader wraps a Reader and fills an internal char buffer.'}</JNote>
    </svg>
  );
}

function Buffered() {
  return <VizPlayer steps={BUFFER_STEPS} render={renderBuffer} autoPlay={false} />;
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Byte / char stream hierarchy',
    caption: 'InputStream / Reader and their subclasses; Scanner vs BufferedReader.',
    notice: 'BufferedReader.readLine() is the standard for line-based text input.',
    component: Hierarchy,
  },
  {
    title: 'Buffered vs unbuffered read',
    caption: 'Buffering reduces expensive underlying-source reads.',
    notice: 'Always wrap performance-sensitive readers in BufferedReader.',
    component: Buffered,
  },
];
