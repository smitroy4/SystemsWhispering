import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import { StackView } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';

interface StackState {
  values: number[];
  tones: CellTone[];
}

function frame(id: string, description: string, values: number[], tones: CellTone[]): VizStep {
  return { id, description, state: { values, tones } satisfies StackState, highlight: [] };
}

const D: CellTone = 'default';
const S: CellTone = 'swapped';
const C: CellTone = 'compared';
const DONE: CellTone = 'done';

/** Push 10, 20, 30 — peek — then pop back down. */
function buildSteps(): VizStep[] {
  return [
    frame('start', 'Start: empty stack. Only the top end is accessible (LIFO).', [], []),
    frame('push-10', 'push(10): it becomes the top.', [10], [S]),
    frame('push-20', 'push(20): 10 is buried — only 20 is reachable now.', [10, 20], [D, S]),
    frame('push-30', 'push(30): the top moves up again. Push is O(1).', [10, 20, 30], [D, D, S]),
    frame('peek', 'peek(): read 30 without removing it. The stack is unchanged.', [10, 20, 30], [D, D, C]),
    frame('pop-30', 'pop(): 30 leaves, 20 is the top again.', [10, 20], [D, S]),
    frame('pop-20', 'pop(): 20 leaves, 10 resurfaces.', [10], [S]),
    frame('done', 'Done: pops mirror pushes in reverse. Push/pop/peek are all O(1).', [10], [DONE]),
  ];
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as StackState;
  return <StackView values={state.values} tones={state.tones} />;
}

export default function StackViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
