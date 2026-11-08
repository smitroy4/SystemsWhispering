/**
 * operators — 3 visuals.
 * 1. Operator family precedence ladder (static).
 * 2. Short-circuit && / || flow animation (animated).
 * 3. Bitwise AND / OR / XOR and shift animator on bit rows (animated).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: precedence ladder ---------------- */

function PrecedenceLadder() {
  const tiers = [
    ['Postfix', '() [] . (method access)'],
    ['Unary', '++ -- + - ! ~ (cast)'],
    ['Multiplicative', '* / %'],
    ['Additive', '+ -'],
    ['Shift', '<< >> >>>'],
    ['Relational', '< <= > >= instanceof'],
    ['Equality', '== !='],
    ['Logical AND', '& &&'],
    ['Logical XOR', '^'],
    ['Logical OR', '| ||'],
    ['Ternary', '? :'],
    ['Assignment', '= += -= *= /= %= <<= >>= >>>= &= ^= |='],
  ];
  return (
    <svg className="viz-svg" viewBox="0 0 660 520" role="img" aria-label="Operator precedence ladder">
      <JBox x={40} y={20} w={580} h={40} title="Operator precedence — higher binds tighter (evaluate top to bottom)" />
      {tiers.map((tier, i) => {
        const y = 75 + i * 36;
        return (
          <g key={i}>
            <text x={40} y={y + 10} fill="var(--color-text-muted)" fontSize={11} fontWeight={600}>
              {tier[0]}
            </text>
            <JBox x={150} y={y - 6} w={470} h={30} rows={[tier[1]]} />
          </g>
        );
      })}
      <JNote x={40} y={505}>
        Parentheses override precedence. Use them liberally to make intent obvious.
      </JNote>
    </svg>
  );
}

/* ---------------- Visual 2: short-circuit flow (animated) ---------------- */

const SHORT_STEPS: VizStep[] = [
  { id: 'and', description: 'false && expensive() — right side never runs (short-circuits).', state: { op: '&&', left: 'false', runs: false } },
  { id: 'or', description: 'true || expensive() — right side never runs (short-circuits).', state: { op: '||', left: 'true', runs: false } },
  { id: 'both', description: 'true && expensive() — both sides run.', state: { op: '&&', left: 'true', runs: true } },
];

function renderShort(step: VizStep | undefined) {
  const s = step?.state as { op?: string; left?: string; runs?: boolean } ?? {};
  const rightText = s.runs ? 'executes' : 'SKIPPED (short-circuit)';
  return (
    <svg className="viz-svg" viewBox="0 0 540 200" role="img" aria-label="Short-circuit evaluation flow">
      <JBox x={40} y={20} w={460} h={44} title={`${s.left || '...'} ${s.op || '&&'} expensive()`} />
      <JBox x={40} y={80} w={220} title="Left operand" rows={[`${s.left || '?'} — result known`]} />
      <JBox x={280} y={80} w={220} title="Right operand" rows={[rightText]} tone={s.runs ? 'good' : 'bad'} />
      <JArrow x1={260} y1={108} x2={280} y2={108} tone={s.runs ? 'active' : 'default'} />
      <JNote x={40} y={155}>{'&& stops at the first false; || stops at the first true. Use for guards (s != null && s.length > 0).'}</JNote>
    </svg>
  );
}

function ShortCircuit() {
  return <VizPlayer steps={SHORT_STEPS} render={renderShort} autoPlay={false} />;
}

/* ---------------- Visual 3: bitwise animator ---------------- */

function BitwiseAnimator() {
  const rows = [
    { label: 'AND (&)', a: '0101', b: '0011', result: '0001', note: '1 only where both are 1' },
    { label: 'OR (|)', a: '0101', b: '0011', result: '0111', note: '1 where either is 1' },
    { label: 'XOR (^)', a: '0101', b: '0011', result: '0110', note: '1 where they differ' },
  ];
  return (
    <svg className="viz-svg" viewBox="0 0 560 330" role="img" aria-label="Bitwise AND OR XOR bit rows">
      <JBox x={40} y={20} w={480} h={44} title="Bitwise ops operate on each bit position independently" />
      {rows.map((row, i) => {
        const y = 85 + i * 60;
        return (
          <g key={i}>
            <JBox x={40} y={y} w={120} h={44} title={row.label} rows={[`${row.a} ${row.b}`]} />
            <JArrow x1={162} y1={y + 22} x2={200} y2={y + 22} />
            <JBox x={200} y={y} w={120} h={44} title="result" rows={[row.result]} tone="good" />
            <JNote x={330} y={y + 8} w={210}>
              {row.note}
            </JNote>
          </g>
        );
      })}
      <JBox x={40} y={265} w={480} h={44} title="Shifts: << left, >> signed right, >>> unsigned right (distance masked to n & 31 for int)" />
      <JNote x={40} y={315}>
        Use bitwise on flags/masks; shifts are multiplication/division by powers of two.
      </JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Operator precedence ladder',
    caption: 'Twelve tiers from postfix to assignment; parentheses override.',
    notice: 'Higher tiers bind tighter — `1 + 2 * 3` is `1 + (2 * 3)`.',
    component: PrecedenceLadder,
  },
  {
    title: 'Short-circuit && / || flow',
    caption: 'Evaluation stops once the result is known.',
    notice: 'Right-hand side may not run — never place side effects there.',
    component: ShortCircuit,
  },
  {
    title: 'Bitwise AND / OR / XOR animator',
    caption: 'Bit-by-bit results plus shift distance rules.',
    notice: '>>> fills with zeros (unsigned); >> preserves the sign bit.',
    component: BitwiseAnimator,
  },
];
