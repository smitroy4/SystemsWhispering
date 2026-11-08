/**
 * synchronized-and-monitor-locks — 2 visuals.
 * 1. Monitor acquire/release animation with entry set (animated).
 * 2. Object lock vs class lock (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: monitor acquire/release (animated) ---------------- */

const MONITOR_STEPS: VizStep[] = [
  { id: 'a', description: 'Thread A enters monitor; lock acquired, others wait in entry set.', state: { holder: 'A' } },
  { id: 'b', description: 'A exits; lock released; B acquires from entry set.', state: { holder: 'B' } },
];

function renderMonitor(step: VizStep | undefined) {
  const s = step?.state as { holder?: string } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 520 200" role="img" aria-label="Monitor acquire release animation">
      <JBox x={40} y={20} w={440} h={44} title="synchronized = monitor lock; entry set holds blocked threads" />
      <JBox x={40} y={80} w={440} title={'lock held by ' + (s.holder ?? 'none')} rows={[]} tone="good" />
      <JNote x={40} y={160}>{'Reentrant: the same thread can re-enter; hold count tracks depth.'}</JNote>
    </svg>
  );
}

function MonitorLock() {
  return <VizPlayer steps={MONITOR_STEPS} render={renderMonitor} autoPlay={false} />;
}

/* ---------------- Visual 2: object lock vs class lock ---------------- */

function ObjectVsClassLock() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 240" role="img" aria-label="Object lock vs class lock">
      <JBox x={40} y={20} w={480} h={44} title="synchronized(instance) locks the object; synchronized static locks the Class object" />
      <JBox x={40} y={80} w={240} title="Instance lock" rows={['synchronized(this)', 'per object']} tone="good" />
      <JBox x={300} y={80} w={220} title="Class lock" rows={['synchronized static', 'one per Class']} tone="good" />
      <JArrow x1={280} y1={120} x2={300} y2={120} />
      <JNote x={40} y={175}>{'Static synchronization locks the Class object, not any instance.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Monitor acquire / release animation',
    caption: 'synchronized monitor with an entry set of blocked threads.',
    notice: 'Only one thread holds a monitor at a time; others block.',
    component: MonitorLock,
  },
  {
    title: 'Object lock vs class lock',
    caption: 'synchronized(instance) locks the object; synchronized static locks the Class object.',
    notice: 'Instance and class locks are independent — they do not block each other.',
    component: ObjectVsClassLock,
  },
];
