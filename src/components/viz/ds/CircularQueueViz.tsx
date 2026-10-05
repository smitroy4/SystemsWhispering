import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { ArrayCells } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface RingState {
  cells: Array<number | string>;
  tones: CellTone[];
  head: number;
  tail: number;
  size: number;
}

const CAP = 5;
const EMPTY = '·';

function frame(
  id: string,
  description: string,
  cells: Array<number | string>,
  tones: CellTone[],
  head: number,
  tail: number,
  size: number,
): VizStep {
  return {
    id,
    description,
    state: { cells, tones, head, tail, size } satisfies RingState,
    highlight: [],
  };
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

function tonesFor(active: number[]): CellTone[] {
  return Array.from({ length: CAP }, (_, i) => (active.includes(i) ? S : D));
}

/** Fill, drain from the front, wrap the tail, then hit FULL. */
function buildSteps(): VizStep[] {
  return [
    frame('start', 'Start: capacity 5, head = tail = 0, size = 0. Empty — not full.', [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY], tonesFor([]), 0, 0, 0),
    frame('offer-10', 'offer(10): write at tail=0, tail → 1, size → 1.', [10, EMPTY, EMPTY, EMPTY, EMPTY], tonesFor([0]), 0, 1, 1),
    frame('offer-20', 'offer(20): write at tail=1, tail → 2, size → 2.', [10, 20, EMPTY, EMPTY, EMPTY], tonesFor([1]), 0, 2, 2),
    frame('offer-30', 'offer(30): write at tail=2, tail → 3, size → 3.', [10, 20, 30, EMPTY, EMPTY], tonesFor([2]), 0, 3, 3),
    frame('poll-10', 'poll(): read head=0 (10), clear it, head → 1. Slot 0 is free again.', [EMPTY, 20, 30, EMPTY, EMPTY], tonesFor([0]), 1, 3, 2),
    frame('poll-20', 'poll(): 20 leaves, head → 2. The head chases forward, never shifting.', [EMPTY, EMPTY, 30, EMPTY, EMPTY], tonesFor([1]), 2, 3, 1),
    frame('offer-40', 'offer(40): write at tail=3, tail → 4. Only 30 and 40 wait.', [EMPTY, EMPTY, 30, 40, EMPTY], tonesFor([3]), 2, 4, 2),
    frame('offer-50', 'offer(50): write at tail=4, tail wraps (4+1) % 5 = 0. The ring bends.', [EMPTY, EMPTY, 30, 40, 50], tonesFor([4]), 2, 0, 3),
    frame('offer-60', 'offer(60): write at wrapped tail=0 — the freed slot is reused. tail → 1.', [60, EMPTY, 30, 40, 50], tonesFor([0]), 2, 1, 4),
    frame('offer-70', 'offer(70): tail → 2, size = 5 = capacity. head == tail now means FULL (size says so).', [60, 70, 30, 40, 50], tonesFor([1]), 2, 2, 5),
    frame('done', 'Done: no shifting, no growth — head and tail chase forever in O(1).', [60, 70, 30, 40, 50], [DONE, DONE, DONE, DONE, DONE], 2, 2, 5),
  ];
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as RingState;
  const full = state.size === CAP;
  const empty = state.size === 0;
  return (
    <>
      <ArrayCells
        values={state.cells}
        tones={state.tones}
        pointers={[
          { label: 'head', index: state.head },
          { label: 'tail', index: state.tail },
        ]}
        ariaLabel={`Ring buffer with ${state.size} of ${CAP} slots used`}
      />
      <p className="viz-statusline">
        size = <strong>{state.size} / {CAP}</strong>
        {' · '}
        {full ? <strong>FULL — offer fails</strong> : empty ? <strong>EMPTY — poll fails</strong> : 'space available'}
      </p>
    </>
  );
}

export default function CircularQueueViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
