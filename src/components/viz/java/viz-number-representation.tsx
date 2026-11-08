/**
 * number-representation — 3 visuals.
 * 1. 8-bit two's complement bit toggler with live decimal (interactive).
 * 2. Number-wheel overflow wraparound (animated).
 * 3. IEEE-754 float breakdown with input box (interactive).
 */
import { useState } from 'react';
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: two's complement bit toggler ---------------- */

function TwosComplement() {
  const [bits, setBits] = useState<number[]>([0, 0, 1, 0, 1, 0, 1, 0]); // 42
  const signed = bits.reduce((acc, b, i) => acc + b * (i === 0 ? -128 : 1 << (7 - i)), 0);
  const unsigned = parseInt(bits.join(''), 2);
  const toggle = (i: number) => setBits((prev) => prev.map((v, idx) => (idx === i ? 1 - v : v)));
  return (
    <svg className="viz-svg" viewBox="0 0 560 300" role="img" aria-label="8-bit two's complement bit toggler">
      <JBox x={40} y={20} w={480} h={50} title="8-bit byte — toggle bits, signed value updates live" />
      {bits.map((b, i) => {
        const x = 90 + i * 56;
        return (
          <g key={i}>
            <rect x={x} y={90} width={40} height={40} rx={6} fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth={2} />
            <text x={x + 20} y={116} textAnchor="middle" fill="var(--viz-ink)" fontSize={20} fontWeight={700} style={{ cursor: 'pointer' }} onClick={() => toggle(i)}>
              {b}
            </text>
            <text x={x + 20} y={142} textAnchor="middle" fill="var(--color-text-muted)" fontSize={11}>
              {i === 0 ? '-128' : String(1 << (7 - i))}
            </text>
          </g>
        );
      })}
      <JBox x={40} y={170} w={480} title={'Signed value: ' + signed} rows={['Unsigned: ' + unsigned]} />
      <JNote x={40} y={250}>
        Negation = invert all bits then add one (-x == ~x + 1). One zero; asymmetric range -128..127.
      </JNote>
    </svg>
  );
}

/* ---------------- Visual 2: overflow number wheel ---------------- */

const WHEEL_STEPS: VizStep[] = [
  { id: 'start', description: 'byte b = 127; bits 01111111.', state: { value: 127 } },
  { id: 'inc', description: 'b++ adds 1 → 10000000, which wraps to -128.', state: { value: -128 } },
  { id: 'int', description: 'int: Integer.MAX_VALUE + 1 → Integer.MIN_VALUE (modulo 2^32).', state: { value: -2147483648 } },
];

function renderWheel(step: VizStep | undefined) {
  const v = step?.state as { value?: number } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 500 260" role="img" aria-label="Integer overflow wraparound wheel">
      <JBox x={40} y={20} w={420} h={50} title="byte arithmetic wraps modulo 2^8" />
      <circle cx={250} cy={150} r={70} fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth={2} />
      <text x={250} y={155} textAnchor="middle" fill="var(--viz-ink)" fontSize={22} fontWeight={700}>
        {v.value === undefined ? 127 : v.value}
      </text>
      <JArrow x1={250} y1={80} x2={250} y2={100} tone="active" />
      <JNote x={40} y={225}>
        Java integer overflow wraps silently (defined, modulo 2^width) — never throws. Use Math.addExact to detect.
      </JNote>
    </svg>
  );
}

function OverflowWheel() {
  return <VizPlayer steps={WHEEL_STEPS} render={renderWheel} autoPlay={false} />;
}

/* ---------------- Visual 3: IEEE-754 float breakdown ---------------- */

function FloatBreakdown() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 260" role="img" aria-label="IEEE-754 float sign exponent mantissa">
      <JBox x={40} y={20} w={480} h={50} title="float = 1 sign | 8 exponent | 23 mantissa (bias 127)" />
      <rect x={60} y={95} width={20} height={34} fill="var(--color-surface)" stroke="var(--color-border)" />
      <text x={70} y={113} textAnchor="start" fontSize={11} fill="var(--color-text-muted)">S</text>
      <rect x={82} y={95} width={78} height={34} fill="var(--color-surface)" stroke="var(--color-border)" />
      <text x={84} y={113} textAnchor="start" fontSize={11} fill="var(--color-text-muted)">exponent (bias 127)</text>
      <rect x={162} y={95} width={338} height={34} fill="var(--color-surface)" stroke="var(--color-border)" />
      <text x={164} y={113} textAnchor="start" fontSize={11} fill="var(--color-text-muted)">mantissa (23 bits, implicit leading 1)</text>
      <JBox x={40} y={150} w={480} h={60} title="5.5 = 1.011 × 2² → 0 | 10000001 | 01100000000000000000000" rows={['0x40B00000']} />
      <JNote x={40} y={225}>
        0.1 and 0.2 repeat in binary — never compare floats with ==; use BigDecimal for money.
      </JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: "Two's complement bit toggler",
    caption: 'Flip bits; signed decimal updates live (weights -128,64,32,16,8,4,2,1).',
    notice: 'Negation is invert-plus-one; range is asymmetric (-128 has no positive match).',
    component: TwosComplement,
  },
  {
    title: 'Overflow number wheel',
    caption: 'Wraparound: 127 + 1 → -128 for byte; MAX_VALUE + 1 → MIN_VALUE for int.',
    notice: 'Overflow is defined modulo 2^width — silent, deterministic, no exception.',
    component: OverflowWheel,
  },
  {
    title: 'IEEE-754 float breakdown',
    caption: 'Sign / biased exponent / mantissa (5.5 worked example).',
    notice: 'Most decimal fractions repeat in binary — money belongs in BigDecimal.',
    component: FloatBreakdown,
  },
];
