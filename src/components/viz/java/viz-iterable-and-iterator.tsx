/**
 * iterable-and-iterator — 2 visuals.
 * 1. Iterator cursor stepping through a list (animated).
 * 2. modCount fail-fast (animated).
 */
import { JBox, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: iterator cursor stepping (animated) ---------------- */

const ITER_STEPS: VizStep[] = [
  { id: 'a', description: 'iterator created before first element; hasNext() true.', state: { cursor: 0, hasNext: true } },
  { id: 'b', description: 'next() returns element at cursor 0 and advances to 1.', state: { cursor: 1, hasNext: true } },
  { id: 'c', description: 'next() returns element at cursor 1 and advances to 2.', state: { cursor: 2, hasNext: true } },
  { id: 'd', description: 'hasNext() false — iteration done.', state: { cursor: 3, hasNext: false } },
];

function renderIter(step: VizStep | undefined) {
  const s = step?.state as { cursor?: number; hasNext?: boolean } ?? {};
  const cursor = s.cursor ?? 0;
  return (
    <svg className="viz-svg" viewBox="0 0 520 220" role="img" aria-label="Iterator cursor stepping through a list">
      <JBox x={40} y={20} w={440} h={44} title="Iterator cursor moves through [A, B, C]; hasNext/next drive it" />
      <JBox x={40} y={80} w={440} title="[A] [B] [C]" rows={['index 0 1 2']} tone="good" />
      <JBox x={40} y={150} w={200} title={'cursor = ' + cursor} rows={['hasNext = ' + s.hasNext]} />
      <JNote x={40} y={215}>{'for-each over a List compiles to an Iterator with hasNext/next.'}</JNote>
    </svg>
  );
}

function IteratorStep() {
  return <VizPlayer steps={ITER_STEPS} render={renderIter} autoPlay={false} />;
}

/* ---------------- Visual 2: modCount fail-fast (animated) ---------------- */

const FAIL_STEPS: VizStep[] = [
  { id: 'start', description: 'Iterator created; modCount = 3 matches expectedModCount = 3.', state: { modCount: 3, expected: 3, ok: true } },
  { id: 'mutate', description: 'List modified directly (add/remove) → modCount becomes 4.', state: { modCount: 4, expected: 3, ok: false } },
  { id: 'next', description: 'next() checks modCount ≠ expectedModCount → ConcurrentModificationException.', state: { modCount: 4, expected: 3, ok: false } },
];

function renderFail(step: VizStep | undefined) {
  const s = step?.state as { modCount?: number; expected?: number; ok?: boolean } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 520 200" role="img" aria-label="modCount fail-fast">
      <JBox x={40} y={20} w={440} h={44} title="Structural modification during iteration throws ConcurrentModificationException" />
      <JBox x={40} y={80} w={200} title={'modCount = ' + s.modCount} rows={[]} />
      <JBox x={260} y={80} w={220} title={'expectedModCount = ' + s.expected} rows={[]} />
      <JBox x={40} y={150} w={440} title={s.ok ? 'iteration safe' : 'ConcurrentModificationException!'} tone={s.ok ? 'good' : 'bad'} />
      <JNote x={40} y={190}>{'Use iterator.remove() to remove safely while iterating.'}</JNote>
    </svg>
  );
}

function FailFast() {
  return <VizPlayer steps={FAIL_STEPS} render={renderFail} autoPlay={false} />;
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Iterator cursor stepping',
    caption: 'hasNext/next move a cursor through a list element by element.',
    notice: 'for-each over a List compiles to an Iterator.',
    component: IteratorStep,
  },
  {
    title: 'modCount fail-fast',
    caption: 'Direct structural modification during iteration throws ConcurrentModificationException.',
    notice: 'Use iterator.remove() to remove safely while iterating.',
    component: FailFast,
  },
];
