/**
 * type-conversion-and-casting — 3 visuals.
 * 1. Widening / narrowing arrow chart (static).
 * 2. Binary promotion / byte trap animation (animated).
 * 3. Reference upcast / downcast diagram (static, hover).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: widening / narrowing arrow chart ---------------- */

function WideningChart() {
  const chain = ['byte', 'short', 'int', 'long', 'float', 'double'];
  return (
    <svg className="viz-svg" viewBox="0 0 700 220" role="img" aria-label="Widening conversion chain byte to double">
      <JBox x={40} y={20} w={620} h={44} title="Widening is implicit; narrowing needs an explicit cast" />
      {chain.map((t, i) => {
        const x = 80 + i * 104;
        return (
          <g key={i}>
            <rect x={x} y={80} width={80} height={40} rx={6} fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth={2} />
            <text x={x + 40} y={103} textAnchor="middle" fill="var(--viz-ink)" fontSize={14} fontWeight={600}>
              {t}
            </text>
            {i < chain.length - 1 && <JArrow x1={x + 80} y1={100} x2={x + 104} y2={100} tone="default" />}
          </g>
        );
      })}
      <JNote x={40} y={170}>
        int → float widens range but can lose precision (24-bit significand). boolean converts to nothing.
      </JNote>
    </svg>
  );
}

/* ---------------- Visual 2: binary promotion byte trap (animated) ---------------- */

const PROMO_STEPS: VizStep[] = [
  { id: 'a', description: 'byte a = 10, b = 20; a + b promotes both operands to int.', state: { stage: 'promote' } },
  { id: 'cast', description: 'The int result cannot go back to byte without a cast: byte sum = (byte)(a + b);', state: { stage: 'cast' } },
  { id: 'compound', description: 'a += 100 hides the cast (a = (byte)(a + 100)) and may silently wrap.', state: { stage: 'wrap' } },
];

function renderPromo(_step: VizStep | undefined) {
  return (
    <svg className="viz-svg" viewBox="0 0 600 240" role="img" aria-label="Byte trap binary promotion">
      <JBox x={40} y={20} w={520} h={44} title="All byte/short/char arithmetic is promoted to int" />
      <JBox x={40} y={80} w={250} h={60} title="byte a = 10, b = 20" rows={['a + b → int 30', 'byte sum = a + b  ✗ compile error']} tone="bad" />
      <JBox x={310} y={80} w={250} h={60} title="byte sum = (byte)(a + b)" rows={['explicit cast back to byte', '30 fits → sum = 30']} tone="good" />
      <JArrow x1={290} y1={110} x2={310} y2={110} />
      <JNote x={40} y={170}>
        Compound assignment a += 100 performs an implicit narrowing cast — can wrap without warning.
      </JNote>
    </svg>
  );
}

function Promotion() {
  return <VizPlayer steps={PROMO_STEPS} render={renderPromo} autoPlay={false} />;
}

/* ---------------- Visual 3: reference upcast / downcast ---------------- */

function ReferenceCast() {
  return (
    <svg className="viz-svg" viewBox="0 0 600 300" role="img" aria-label="Reference upcast and downcast">
      <JBox x={40} y={20} w={520} h={44} title="Upcast implicit (safe); downcast explicit, checked at runtime" />
      <JBox x={60} y={80} w={160} h={56} title="Object" rows={[]} />
      <JBox x={260} y={80} w={160} h={56} title="Shape" rows={[]} tone="good" />
      <JBox x={460} y={80} w={80} h={56} title="Circle" rows={[]} tone="good" />
      <JArrow x1={140} y1={108} x2={260} y2={108} label="implicit upcast" />
      <JArrow x1={420} y1={108} x2={340} y2={108} label="(Circle) downcast" tone="bad" />
      <JBox x={60} y={170} w={250} h={70} title="Safe" rows={['Object o = new Circle();', 'Circle c = (Circle) o;']} tone="good" />
      <JBox x={330} y={170} w={250} h={70} title="ClassCastException" rows={['Object o = Integer.valueOf(1);', '(String) o → throws']} tone="bad" />
      <JNote x={40} y={260}>{'instanceof pattern (Java 16+) removes most casts: if (o instanceof Circle c) { ... }'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Widening / narrowing arrow chart',
    caption: 'byte → short → int → long → float → double; narrowing needs a cast.',
    notice: 'int → float widens range but can lose low bits (24-bit significand).',
    component: WideningChart,
  },
  {
    title: 'Binary promotion (the byte trap)',
    caption: 'byte + byte promotes to int; assigning back needs a cast.',
    notice: 'Compound assignment += hides the cast and can silently wrap.',
    component: Promotion,
  },
  {
    title: 'Reference upcast / downcast',
    caption: 'Upcast implicit and safe; downcast is runtime-checked (ClassCastException).',
    notice: 'Prefer instanceof pattern matching over explicit casts.',
    component: ReferenceCast,
  },
];
