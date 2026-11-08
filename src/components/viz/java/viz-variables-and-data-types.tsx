/**
 * variables-and-data-types — 3 visuals.
 * 1. Primitive classification tree with size & range cards (static).
 * 2. Variable declaration → memory slot animation (animated).
 * 3. Default values table (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import type { JTone } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: primitive classification tree ---------------- */

function PrimitiveTree() {
  return (
    <svg className="viz-svg" viewBox="0 0 640 420" role="img" aria-label="Eight primitive types classified by family">
      <JBox x={30} y={20} w={580} h={44} title="Primitive types (fixed width on every platform)" />
      <JBox x={30} y={80} w={175} title="Integral" rows={['byte 8 bits']} tone="good" />
      <JBox x={30} y={140} w={175} title="" rows={['short 16 bits']} tone="good" />
      <JBox x={30} y={200} w={175} title="" rows={['int 32 bits']} tone="good" />
      <JBox x={30} y={260} w={175} title="" rows={['long 64 bits']} tone="good" />
      <JBox x={30} y={320} w={175} title="" rows={['char 16 bits unsigned']} tone="good" />
      <JBox x={225} y={80} w={175} title="Floating point" rows={['float 32 bits']} tone="good" />
      <JBox x={225} y={140} w={175} title="" rows={['double 64 bits']} tone="good" />
      <JBox x={420} y={80} w={190} title="Boolean" rows={['boolean true / false']} tone="good" />
      <JBox x={420} y={140} w={190} title="" rows={['no defined size']} tone="good" />
      <JArrow x1={205} y1={130} x2={225} y2={130} />
      <JArrow x1={400} y1={130} x2={420} y2={130} />
      <JBox x={30} y={380} w={175} title="byte" rows={['-128 .. 127', 'default 0']} />
      <JBox x={225} y={380} w={175} title="int" rows={['-2.1B .. 2.1B', 'default 0']} />
      <JBox x={420} y={380} w={190} title="double" rows={['~15-16 digits', 'default 0.0']} />
      <JNote x={30} y={490}>
        char is the only unsigned integral type; boolean has no defined size. int/long are the default counter types.
      </JNote>
    </svg>
  );
}

/* ---------------- Visual 2: declaration → memory slot (animated) ---------------- */

const MEM_STEPS: VizStep[] = [
  { id: 'declare', description: 'int count; declares a slot on the stack frame. No value yet.', state: { slot: 'count', value: undefined, tone: 'default' } },
  { id: 'init', description: 'int count = 5; initializes the slot with 5.', state: { slot: 'count', value: 5, tone: 'active' } },
  { id: 'assign', description: 'count = 9; reassigns the slot. Primitives hold the value itself.', state: { slot: 'count', value: 9, tone: 'done' } },
];

function renderMem(step: VizStep | undefined) {
  const s = step?.state as { slot?: string; value?: number | undefined; tone?: JTone } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 420 220" role="img" aria-label="Variable declaration and memory slot">
      <JBox x={40} y={40} w={160} h={60} title="Stack frame (main)" />
      <JBox x={40} y={110} w={140} h={44} title={s.slot ?? 'count'} rows={[`${s.value === undefined ? '—' : s.value}`]} tone={s.tone ?? 'default'} />
      <JNote x={40} y={180}>
        Locals have no default — reading before assignment is a compile error. Fields are zero-initialized.
      </JNote>
    </svg>
  );
}

function MemorySlot() {
  return <VizPlayer steps={MEM_STEPS} render={renderMem} autoPlay={false} />;
}

/* ---------------- Visual 3: default values table ---------------- */

function DefaultValues() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 260" role="img" aria-label="Default field values by primitive type">
      <JBox x={40} y={20} w={480} h={50} title="Fields get defaults; locals do not" />
      <JBox x={40} y={90} w={230} h={120} title="Field defaults" rows={['byte/short/int/long → 0']} />
      <JBox x={40} y={170} w={230} h={60} title="" rows={['float/double → 0.0', 'char → \\u0000', 'boolean → false', 'reference → null']} />
      <JBox x={290} y={90} w={230} h={120} title="Local variables" rows={['No default value']} tone="active" />
      <JBox x={290} y={170} w={230} h={60} title="" rows={['Must assign before read', 'Compile error otherwise', 'final = assign once']} />
      <JNote x={40} y={245}>
        Array elements are always zero-initialized, so new int[1000] is not free.
      </JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Primitive classification tree',
    caption: 'Eight primitives grouped: integral, floating point, boolean.',
    notice: 'Widths are fixed by the spec — unlike C, int is always 32 bits.',
    component: PrimitiveTree,
  },
  {
    title: 'Declaration → memory slot',
    caption: 'A primitive variable owns a stack slot; value copied on assignment.',
    notice: 'Locals start uninitialized; fields start zeroed.',
    component: MemorySlot,
  },
  {
    title: 'Default values',
    caption: 'Default field values per type versus uninitialized locals.',
    notice: 'Reading an uninitialized local is a compile-time error.',
    component: DefaultValues,
  },
];
