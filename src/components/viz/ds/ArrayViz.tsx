import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { ArrayCells } from '../primitives.tsx';
import type { CellPointer, CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface ArrayOpsState {
  cells: Array<number | string>;
  tones: CellTone[];
  pointers: CellPointer[];
}

function frame(
  id: string,
  description: string,
  cells: Array<number | string>,
  tones: CellTone[],
  pointers: CellPointer[] = [],
): VizStep {
  return {
    id,
    description,
    state: { cells, tones, pointers } satisfies ArrayOpsState,
    highlight: pointers.map((p) => p.index),
  };
}

const D = 'default';
const A = 'active';
const C = 'compared';
const S = 'swapped';
const DONE = 'done';

/** Insert 25 at index 2, then delete index 1 — every shift shown. */
function buildSteps(): VizStep[] {
  return [
    frame(
      'start',
      'Start: [10, 20, 30, 40] in a capacity-6 array. Goal: insert 25 at index 2.',
      [10, 20, 30, 40, '', ''],
      [D, D, D, D, D, D],
      [{ label: 'insert@2', index: 2 }],
    ),
    frame(
      'shift-40',
      'Make room from the right: copy 40 from index 3 to index 4.',
      [10, 20, 30, '', 40, ''],
      [D, D, D, C, A, D],
      [{ label: 'insert@2', index: 2 }],
    ),
    frame(
      'shift-30',
      'Copy 30 from index 2 to index 3. Index 2 is now free.',
      [10, 20, '', 30, 40, ''],
      [D, D, C, A, D, D],
      [{ label: 'insert@2', index: 2 }],
    ),
    frame(
      'place-25',
      'Write 25 into the free slot at index 2. Insert cost 2 shifts: O(n).',
      [10, 20, 25, 30, 40, ''],
      [D, D, S, D, D, D],
      [{ label: 'insert@2', index: 2 }],
    ),
    frame(
      'delete-start',
      'Next goal: delete index 1. Everything right of it must shift left.',
      [10, 20, 25, 30, 40, ''],
      [D, D, D, D, D, D],
      [{ label: 'delete@1', index: 1 }],
    ),
    frame(
      'shift-25',
      'Copy 25 from index 2 to index 1, overwriting 20.',
      [10, 25, '', 30, 40, ''],
      [D, A, C, D, D, D],
      [{ label: 'delete@1', index: 1 }],
    ),
    frame(
      'shift-30-left',
      'Copy 30 from index 3 to index 2.',
      [10, 25, 30, '', 40, ''],
      [D, D, A, C, D, D],
      [{ label: 'delete@1', index: 1 }],
    ),
    frame(
      'shift-40-left',
      'Copy 40 from index 4 to index 3. Track size = 4; the tail is garbage.',
      [10, 25, 30, 40, '', ''],
      [D, D, D, A, C, D],
      [{ label: 'delete@1', index: 1 }],
    ),
    frame(
      'done',
      'Done: [10, 25, 30, 40]. Inserts and deletes shift O(n) elements.',
      [10, 25, 30, 40, '', ''],
      [DONE, DONE, DONE, DONE, D, D],
    ),
  ];
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as ArrayOpsState;
  return <ArrayCells values={state.cells} tones={state.tones} pointers={state.pointers} />;
}

export default function ArrayViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
