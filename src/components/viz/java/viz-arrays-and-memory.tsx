/**
 * arrays-and-memory — 3 visuals.
 * 1. Array on heap with reference on stack and indexed cells (static).
 * 2. Rectangular vs jagged 2D layout (static).
 * 3. Out-of-bounds animation (animated).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: array on heap, reference on stack ---------------- */

function ArrayMemory() {
  return (
    <svg className="viz-svg" viewBox="0 0 620 300" role="img" aria-label="Array on heap with reference on stack">
      <JBox x={40} y={20} w={540} h={44} title="int[] arr = {10, 20, 30, 40}; reference on the stack, cells on the heap" />
      <JBox x={40} y={80} w={180} title="Stack" rows={['arr → 0x1000']} />
      <JBox x={260} y={80} w={320} title="Heap — array object" rows={['length = 4', '[10] [20] [30] [40]', 'index  0    1    2    3']} tone="good" />
      <JArrow x1={220} y1={108} x2={260} y2={108} />
      <JNote x={40} y={250}>{'The reference variable holds a handle to the heap object; copying the reference copies the handle, not the array.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: rectangular vs jagged 2D ---------------- */

function TwoDLayout() {
  return (
    <svg className="viz-svg" viewBox="0 0 600 300" role="img" aria-label="Rectangular vs jagged 2D array layout">
      <JBox x={40} y={20} w={520} h={44} title="Java 2D arrays are arrays of arrays — rectangular or jagged" />
      <JBox x={40} y={80} w={260} title="Rectangular int[3][4]" rows={['3 rows × 4 cols', 'fixed width per row', 'one contiguous object']} tone="good" />
      <JBox x={320} y={80} w={240} title="Jagged int[][]" rows={['row 0: 2 cols', 'row 1: 5 cols', 'row 2: 1 col', 'each row its own object']} tone="default" />
      <JArrow x1={300} y1={145} x2={320} y2={145} />
      <JNote x={40} y={235}>{'int[][] is an array of references to int[] rows; rows may have different lengths.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 3: out-of-bounds (animated) ---------------- */

const OOB_STEPS: VizStep[] = [
  { id: 'ok', description: 'arr[2] reads index 2 — within bounds 0..3, returns 30.', state: { index: 2, ok: true } },
  { id: 'bad', description: 'arr[4] reads index 4 — beyond length 4 → ArrayIndexOutOfBoundsException.', state: { index: 4, ok: false } },
];

function renderOob(step: VizStep | undefined) {
  const s = step?.state as { index?: number; ok?: boolean } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 520 240" role="img" aria-label="Array out-of-bounds check">
      <JBox x={40} y={20} w={440} h={44} title="Array access is bounds-checked at runtime" />
      <JBox x={40} y={80} w={440} title="Heap array [10, 20, 30, 40]  length = 4" rows={[]} tone="good" />
      <JBox x={40} y={150} w={200} title={'index ' + (s.index ?? 0)} rows={[(s.ok ? 'in bounds' : 'OUT OF BOUNDS')]} tone={s.ok ? 'good' : 'bad'} />
      <JBox x={260} y={150} w={220} title="Result" rows={[s.ok ? 'returns value' : 'throws ArrayIndexOutOfBoundsException']} tone={s.ok ? 'good' : 'bad'} />
      <JArrow x1={240} y1={176} x2={260} y2={176} tone={s.ok ? 'good' : 'bad'} />
      <JNote x={40} y={220}>{'Valid indexes are 0 to length-1. Java always checks bounds — no silent buffer overruns.'}</JNote>
    </svg>
  );
}

function OutOfBounds() {
  return <VizPlayer steps={OOB_STEPS} render={renderOob} autoPlay={false} />;
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Array on heap, reference on stack',
    caption: 'The reference holds a handle; indexed cells live on the heap.',
    notice: 'Copying a reference copies the handle, not the array contents.',
    component: ArrayMemory,
  },
  {
    title: 'Rectangular vs jagged 2D layout',
    caption: 'Java 2D arrays are arrays of arrays; rows may differ in length.',
    notice: 'int[][] is an array of references to int[] row objects.',
    component: TwoDLayout,
  },
  {
    title: 'Out-of-bounds',
    caption: 'Index 0..length-1 is valid; anything else throws ArrayIndexOutOfBoundsException.',
    notice: 'Java bounds-checks every array access at runtime.',
    component: OutOfBounds,
  },
];
