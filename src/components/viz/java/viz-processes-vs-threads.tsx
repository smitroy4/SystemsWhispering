/**
 * processes-vs-threads — 2 visuals.
 * 1. Process vs thread memory model (static).
 * 2. Concurrency vs parallelism timeline (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: process vs thread memory model ---------------- */

function Model() {
  return (
    <svg className="viz-svg" viewBox="0 0 600 300" role="img" aria-label="Process vs thread memory model">
      <JBox x={40} y={20} w={520} h={44} title="A process owns an address space; threads share it and have their own stacks" />
      <JBox x={40} y={80} w={260} title="Process" rows={['own address space', 'heap + code', 'one or more threads']} tone="good" />
      <JBox x={320} y={80} w={240} title="Threads (share heap)" rows={['each: stack + PC', 'share heap/objects', 'scheduled independently']} tone="good" />
      <JArrow x1={300} y1={140} x2={320} y2={140} />
      <JNote x={40} y={220}>{'Threads within a process share the heap; each thread has a private stack and program counter.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: concurrency vs parallelism ---------------- */

function ConcurrencyParallel() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 220" role="img" aria-label="Concurrency vs parallelism timeline">
      <JBox x={40} y={20} w={480} h={44} title="Concurrency = interleaving; parallelism = simultaneous execution" />
      <JBox x={40} y={80} w={240} title="Concurrent" rows={['one core', 'interleaved', 'context switch']} tone="good" />
      <JBox x={300} y={80} w={220} title="Parallel" rows={['multiple cores', 'simultaneous', 'true at once']} tone="good" />
      <JArrow x1={280} y1={120} x2={300} y2={120} />
      <JNote x={40} y={175}>{'Concurrency is about structure; parallelism is about execution at the same instant.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Process vs thread memory model',
    caption: 'Shared heap, per-thread stacks.',
    notice: 'Threads share the process heap; each has a private stack.',
    component: Model,
  },
  {
    title: 'Concurrency vs parallelism',
    caption: 'Interleaving on one core vs simultaneous execution on many cores.',
    notice: 'Concurrency does not require multiple cores; parallelism does.',
    component: ConcurrencyParallel,
  },
];
