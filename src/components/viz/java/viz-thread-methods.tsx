/**
 * thread-methods — 2 visuals.
 * 1. sleep / join / yield / interrupt — one timeline per method (animated).
 * 2. Interrupt flag animation (animated).
 */
import { JBox, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: thread methods (animated) ---------------- */

const METHOD_STEPS: VizStep[] = [
  { id: 'sleep', description: 'sleep(ms): thread enters TIMED_WAITING, then wakes.', state: { method: 'sleep' } },
  { id: 'join', description: 'join(): wait for another thread to finish.', state: { method: 'join' } },
  { id: 'yield', description: 'yield(): hint to scheduler; not a command.', state: { method: 'yield' } },
  { id: 'interrupt', description: 'interrupt(): sets the interrupt flag; target checks it.', state: { method: 'interrupt' } },
];

function renderMethod(step: VizStep | undefined) {
  const s = step?.state as { method?: string } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 520 200" role="img" aria-label="Thread methods sleep join yield interrupt">
      <JBox x={40} y={20} w={440} h={44} title="sleep / join / yield / interrupt — each moves thread state differently" />
      <JBox x={40} y={80} w={440} title={s.method ?? 'sleep'} rows={[]} tone="good" />
      <JNote x={40} y={160}>{'Interruption is cooperative: the target thread decides how to respond to the flag.'}</JNote>
    </svg>
  );
}

function ThreadMethods() {
  return <VizPlayer steps={METHOD_STEPS} render={renderMethod} autoPlay={false} />;
}

/* ---------------- Visual 2: interrupt flag animation (animated) ---------------- */

const FLAG_STEPS: VizStep[] = [
  { id: 'a', description: 'Thread A sets interrupt flag on Thread B.', state: { flag: false } },
  { id: 'b', description: 'Thread B checks Thread.interrupted() → true, handles shutdown.', state: { flag: true } },
];

function renderFlag(step: VizStep | undefined) {
  const s = step?.state as { flag?: boolean } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 520 180" role="img" aria-label="Interrupt flag animation">
      <JBox x={40} y={20} w={440} h={44} title="The interrupt flag is a cooperative shutdown signal" />
      <JBox x={40} y={80} w={440} title={'interrupted = ' + s.flag} rows={[]} tone={s.flag ? 'bad' : 'good'} />
      <JNote x={40} y={155}>{'An interrupt does not kill a thread; it sets a flag the target must poll.'}</JNote>
    </svg>
  );
}

function InterruptFlag() {
  return <VizPlayer steps={FLAG_STEPS} render={renderFlag} autoPlay={false} />;
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Thread methods sleep / join / yield / interrupt',
    caption: 'One timeline per method showing the state each moves a thread into.',
    notice: 'yield is advice, not a command; interrupt is cooperative.',
    component: ThreadMethods,
  },
  {
    title: 'Interrupt flag animation',
    caption: 'interrupt() sets a flag; the target thread polls it.',
    notice: 'Never rely on interrupt to forcibly stop a thread.',
    component: InterruptFlag,
  },
];
