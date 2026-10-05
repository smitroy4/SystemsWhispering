import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { ArrayCells } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface PcState {
  cells: Array<string>;
  tones: CellTone[];
  producer: string;
  consumer: string;
  status: string;
}

const CAP = 3;
const EMPTY = '·';

function frame(
  id: string,
  description: string,
  cells: Array<string>,
  tones: CellTone[],
  producer: string,
  consumer: string,
  status: string,
): VizStep {
  return { id, description, state: { cells, tones, producer, consumer, status } satisfies PcState, highlight: [] };
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const C: CellTone = 'compared';
const DONE: CellTone = 'done';

function toneRow(on: number[], tone: CellTone): CellTone[] {
  return Array.from({ length: CAP }, (_, i) => (on.includes(i) ? tone : D));
}

function cellsOf(filled: string[]): Array<string> {
  return Array.from({ length: CAP }, (_, i) => filled[i] ?? EMPTY);
}

/** Fill, block on full, drain, resume — backpressure without polling. */
function buildSteps(): VizStep[] {
  return [
    frame('start', 'Start: capacity 3, empty. take() would park; put() sails through.', cellsOf([]), toneRow([], D), 'producing', 'waiting — empty', 'size = 0 / 3'),
    frame('put-a', 'Producer puts a. Consumer wakes: take() returns instantly now.', cellsOf(['a']), toneRow([0], S), 'producing', 'taking', 'size = 1 / 3'),
    frame('put-b', 'Producer puts b. Steady state: produce and consume overlap.', cellsOf(['a', 'b']), toneRow([1], S), 'producing', 'taking', 'size = 2 / 3'),
    frame('take-a', 'Consumer takes a. take() waited for data instead of spinning.', cellsOf(['b']), toneRow([0], C), 'producing', 'taking', 'size = 1 / 3'),
    frame('full', 'Producer puts c, d — buffer FULL. Next put() parks: backpressure, not OOM.', cellsOf(['b', 'c', 'd']), toneRow([1, 2], S), 'waiting — full', 'taking', 'size = 3 / 3 FULL'),
    frame('drain', 'Consumer drains b, c: two takes, one lock each — batching amortizes handoff.', cellsOf(['d']), toneRow([0], C), 'producing', 'draining', 'size = 1 / 3'),
    frame('resume', 'Producer resumes with e. Flow, not polling: threads sleep until work exists.', cellsOf(['d', 'e']), toneRow([1], S), 'producing', 'taking', 'size = 2 / 3'),
    frame('done', 'Done: bounded buffers turn overload into waiting — observable, sheddable, safe.', cellsOf(['d', 'e']), [DONE, DONE, D], 'producing', 'taking', 'bound the queue, sleep the threads'),
  ];
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as PcState;
  return (
    <>
      <ArrayCells values={state.cells} tones={state.tones} ariaLabel={`Bounded buffer, ${state.status}`} />
      <p className="viz-statusline">
        producer: <strong>{state.producer}</strong>
        {' · '}consumer: <strong>{state.consumer}</strong>
        {' · '}{state.status}
      </p>
    </>
  );
}

export default function ProducerConsumerBoundedViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
