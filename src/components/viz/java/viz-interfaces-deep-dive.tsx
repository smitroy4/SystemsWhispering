/**
 * interfaces-deep-dive — 2 visuals.
 * 1. Interface kinds classification: default / static / functional / marker (static).
 * 2. Default-method diamond resolution flow (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: interface kinds classification ---------------- */

function Kinds() {
  return (
    <svg className="viz-svg" viewBox="0 0 600 280" role="img" aria-label="Interface kinds classification">
      <JBox x={40} y={20} w={520} h={44} title="Interface kinds: default, static, functional, marker" />
      <JBox x={40} y={80} w={140} title="default" rows={['body provided', 'inherited']} tone="good" />
      <JBox x={200} y={80} w={140} title="static" rows={['no instance access', 'utility methods']} />
      <JBox x={360} y={80} w={140} title="functional" rows={['one abstract method', 'lambda target']} tone="good" />
      <JBox x={40} y={170} w={140} title="marker" rows={['no methods', 'JVM tag']} />
      <JArrow x1={180} y1={120} x2={200} y2={120} />
      <JArrow x1={340} y1={120} x2={360} y2={120} />
      <JNote x={40} y={270}>{'Default methods let interfaces evolve without breaking implementors.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: default-method diamond resolution ---------------- */

function Diamond() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 240" role="img" aria-label="Default method diamond resolution">
      <JBox x={40} y={20} w={480} h={44} title="Diamond conflict: same default method in two interfaces" />
      <JBox x={40} y={80} w={240} title="Interface A" rows={['default foo() {...}']} />
      <JBox x={300} y={80} w={240} title="Interface B" rows={['default foo() {...}']} />
      <JBox x={40} y={170} w={480} title="Class must override foo() to resolve the diamond" rows={[]} tone="good" />
      <JArrow x1={280} y1={120} x2={300} y2={120} />
      <JNote x={40} y={230}>{'When a class inherits conflicting defaults, it must override and choose.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Interface kinds classification',
    caption: 'default, static, functional, marker — each serves a distinct role.',
    notice: 'Functional interfaces are lambda targets; markers are JVM tags.',
    component: Kinds,
  },
  {
    title: 'Default-method diamond resolution',
    caption: 'Conflicting default methods must be overridden by the class.',
    notice: 'The class body wins over any inherited default.',
    component: Diamond,
  },
];
