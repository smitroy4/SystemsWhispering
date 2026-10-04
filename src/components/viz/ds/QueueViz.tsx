import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { QueueView } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface QueueState {
  values: number[];
  tones: CellTone[];
}

function frame(id: string, description: string, values: number[], tones: CellTone[]): VizStep {
  return { id, description, state: { values, tones } satisfies QueueState, highlight: [] };
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const C: CellTone = 'compared';
const DONE: CellTone = 'done';

/** Enqueue/dequeue FIFO, then deque ops at both ends. */
function buildSteps(): VizStep[] {
  return [
    frame('start', 'Start: empty queue. Items leave in arrival order (FIFO).', [], []),
    frame('enq-10', 'offer(10): joins the rear.', [10], [S]),
    frame('enq-20', 'offer(20): joins behind 10.', [10, 20], [D, S]),
    frame('enq-30', 'offer(30): the line grows at the rear only.', [10, 20, 30], [D, D, S]),
    frame('deq-10', 'poll(): 10 leaves from the FRONT — first in, first out.', [20, 30], [S, D]),
    frame('addfirst-5', 'Deque mode: addFirst(5) jumps the line at the front end.', [5, 20, 30], [S, D, D]),
    frame('peek', 'peekLast(): read 30 without removing it.', [5, 20, 30], [D, D, C]),
    frame('removelast-30', 'removeLast(): 30 leaves from the rear end.', [5, 20], [D, S]),
    frame('done', 'Done: queues serve FIFO; deques open both ends — all O(1).', [5, 20], [DONE, DONE]),
  ];
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as QueueState;
  return <QueueView values={state.values} tones={state.tones} />;
}

export default function QueueViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
