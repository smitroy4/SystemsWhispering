/**
 * encapsulation-inheritance-packages — 2 visuals.
 * 1. Access-modifier visibility grid (static).
 * 2. is-a vs has-a composition (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: access modifier visibility grid ---------------- */

function VisibilityGrid() {
  const cols = ['class', 'package', 'subclass', 'world'];
  const rows = [
    ['private', 'yes', 'no', 'no', 'no'],
    ['package', 'yes', 'yes', 'no', 'no'],
    ['protected', 'yes', 'yes', 'yes', 'no'],
    ['public', 'yes', 'yes', 'yes', 'yes'],
  ];
  const cellW = 100;
  const cellH = 44;
  return (
    <svg className="viz-svg" viewBox="0 0 560 300" role="img" aria-label="Access modifier visibility grid">
      <JBox x={40} y={20} w={480} h={44} title="Modifier × scope: who can access a member" />
      <JBox x={40} y={80} w={60} title="modifier" rows={[]} />
      {cols.map((c, i) => (
        <JBox key={c} x={110 + i * cellW} y={80} w={cellW} title={c} rows={[]} />
      ))}
      {rows.map((row, r) => {
        const y = 134 + r * cellH;
        return (
          <JBox key={r} x={40} y={y} w={60} title={row[0]} rows={[]} />
        );
      })}
      <JNote x={40} y={310}>{'private = same class only; package = same package; protected = + subclasses; public = everywhere.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: is-a vs has-a composition ---------------- */

function IsHasA() {
  return (
    <svg className="viz-svg" viewBox="0 0 600 260" role="img" aria-label="is-a vs has-a composition">
      <JBox x={40} y={20} w={520} h={44} title="is-a (inheritance) vs has-a (composition)" />
      <JBox x={40} y={80} w={260} title="is-a: Engine is a Machine" rows={['class Machine {...}', 'class Engine extends Machine']} tone="good" />
      <JBox x={320} y={80} w={240} title="has-a: Car has an Engine" rows={['class Car {', '  private Engine engine;', '}', 'composition']} tone="good" />
      <JArrow x1={300} y1={130} x2={320} y2={130} />
      <JNote x={40} y={195}>{'Prefer has-a (composition) over is-a (inheritance) unless you truly model a specialization.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Access-modifier visibility grid',
    caption: 'private / package / protected / public × class / package / subclass / world.',
    notice: 'Choose the most restrictive modifier that still allows correct access.',
    component: VisibilityGrid,
  },
  {
    title: 'is-a vs has-a composition',
    caption: 'Inheritance models specialization; composition models parts.',
    notice: 'Prefer composition over inheritance for flexibility.',
    component: IsHasA,
  },
];
