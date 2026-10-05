import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { ArrayCells } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface GrowthState {
  cells: Array<number | string>;
  tones: CellTone[];
  size: number;
  capacity: number;
  status: string;
}

const EMPTY = '·';

function frame(
  id: string,
  description: string,
  size: number,
  capacity: number,
  filled: number[],
  tones: CellTone[],
  status: string,
): VizStep {
  const cells: Array<number | string> = Array.from({ length: capacity }, (_, i) =>
    filled.includes(i) ? (i + 1) * 10 : EMPTY,
  );
  return { id, description, state: { cells, tones, size, capacity, status } satisfies GrowthState, highlight: [] };
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

function toneRow(capacity: number, on: number[], tone: CellTone): CellTone[] {
  return Array.from({ length: capacity }, (_, i) => (on.includes(i) ? tone : D));
}

/** Fill capacity 4, grow 1.5× to 6, fill again — amortized O(1). */
function buildSteps(): VizStep[] {
  return [
    frame('start', 'Start: new ArrayList<>(4) — four slots, size 0. Growth is lazy but capacity is booked.', 0, 4, [], toneRow(4, [], D), 'size = 0 / 4'),
    frame('add-10', 'add(10): write at size, bump size. No copy while room remains.', 1, 4, [0], toneRow(4, [0], S), 'size = 1 / 4'),
    frame('add-20', 'add(20), add(30): same story — appends are plain stores.', 3, 4, [0, 1, 2], toneRow(4, [2], S), 'size = 3 / 4'),
    frame('full', 'add(40): size hits capacity. The next add must grow.', 4, 4, [0, 1, 2, 3], toneRow(4, [3], S), 'size = 4 / 4 FULL'),
    frame('grow', 'Grow: newCap = 4 + (4 >> 1) = 6. One copyOf moves all four references.', 4, 6, [0, 1, 2, 3], toneRow(6, [0, 1, 2, 3], S), 'grew 4 → 6 (1.5×)'),
    frame('add-50', 'add(50), add(60): back to plain stores in the roomier array.', 6, 6, [0, 1, 2, 3, 4, 5], toneRow(6, [4, 5], S), 'size = 6 / 6 FULL'),
    frame('done', 'Done: 6 appends, 1 copy — copies halve in frequency as arrays double-ish. Amortized O(1).', 6, 6, [0, 1, 2, 3, 4, 5], toneRow(6, [], D).map(() => DONE), 'amortized O(1) per add'),
  ];
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as GrowthState;
  return (
    <>
      <ArrayCells values={state.cells} tones={state.tones} ariaLabel={`ArrayList with size ${state.size} and capacity ${state.capacity}`} />
      <p className="viz-statusline">
        size = <strong>{state.size} / {state.capacity}</strong>
        {' · '}{state.status}
      </p>
    </>
  );
}

export default function ArrayListGrowthViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
