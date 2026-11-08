/**
 * generics — 2 visuals.
 * 1. Type parameters substituted into a generic container (static).
 * 2. Type erasure before/after compile (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: type parameters substituted ---------------- */

function Substitution() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 240" role="img" aria-label="Type parameters substituted into generic container">
      <JBox x={40} y={20} w={480} h={44} title="Box<T> is a template; Box<String> substitutes String for T" />
      <JBox x={40} y={80} w={240} title="Box<T>" rows={['T value', 'T get()', 'void set(T)']} tone="good" />
      <JBox x={300} y={80} w={240} title="Box<String>" rows={['String value', 'String get()', 'void set(String)']} tone="good" />
      <JArrow x1={280} y1={120} x2={300} y2={120} />
      <JNote x={40} y={175}>{'Generics give compile-time type safety without casting.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: type erasure before/after ---------------- */

function Erasure() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 220" role="img" aria-label="Type erasure before after compile">
      <JBox x={40} y={20} w={480} h={44} title="Erasure: generics exist at compile time; raw types at runtime" />
      <JBox x={40} y={80} w={240} title="Source" rows={['List<String>']} tone="good" />
      <JBox x={300} y={80} w={240} title="Bytecode" rows={['List (Object)']} />
      <JArrow x1={280} y1={120} x2={300} y2={120} />
      <JNote x={40} y={175}>{'Casts are inserted automatically; generics are not reified.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Type parameters in a generic container',
    caption: 'Box<T> is a template; Box<String> substitutes String for T.',
    notice: 'Generics let you write type-safe, reusable containers.',
    component: Substitution,
  },
  {
    title: 'Type erasure before/after compile',
    caption: 'Generic type arguments are erased to Object (or bound) in bytecode.',
    notice: 'You cannot write new T() or instanceof Generic<T>.',
    component: Erasure,
  },
];
