import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from '../algo/StatePanel.tsx';
import type { StateEntry } from '../algo/StatePanel.tsx';
import { ArrayCells, StackView } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';
import './concepts.css';

interface MonoState {
  values: number[];
  tones: CellTone[];
  answer: Array<number | string>;
  answerTones: CellTone[];
  stack: number[];
  stackTones: CellTone[];
  cursor: number;
  panel: StateEntry[];
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const S: CellTone = 'swapped';
const DONE: CellTone = 'done';

/** Next greater element on [4, 5, 2, 10, 8]: scan right→left, pop smaller. */
function buildSteps(): VizStep[] {
  const values = [4, 5, 2, 10, 8];
  const answer: Array<number | string> = new Array<string | number>(values.length).fill('');
  const stack: number[] = [];
  const steps: VizStep[] = [];

  const snap = (id: string, description: string, cursor: number, panel: StateEntry[]): void => {
    steps.push({
      id,
      description,
      state: {
        values: [...values],
        tones: values.map((_, k) => {
          if (k === cursor) return A;
          if (k > cursor || answer[k] !== '') return DONE;
          return D;
        }),
        answer: [...answer],
        answerTones: answer.map((v) => (v === '' ? D : S)),
        stack: [...stack],
        stackTones: stack.map(() => D),
        cursor,
        panel: [...panel],
      } satisfies MonoState,
      highlight: cursor >= 0 && cursor < values.length ? [cursor] : [],
    });
  };

  snap('start', 'Next greater element of [4, 5, 2, 10, 8]. Scan right → left, keeping a stack of candidates in increasing order.', -1, [
    { label: 'answer', value: '[?, ?, ?, ?, ?]' },
    { label: 'stack', value: '[]' },
  ]);

  for (let i = values.length - 1; i >= 0; i--) {
    const x = values[i];
    const popped: number[] = [];
    while (stack.length > 0 && stack[stack.length - 1] <= x) {
      popped.push(stack.pop()!);
    }
    const nge = stack.length === 0 ? -1 : stack[stack.length - 1];
    answer[i] = nge;
    stack.push(x);
    snap(
      `i-${i}`,
      popped.length > 0
        ? `x = ${x}: pop ${popped.join(', ')} (≤ ${x}, useless to the left), top is ${nge === -1 ? 'empty' : nge} → answer[${i}] = ${nge}. Push ${x}.`
        : `x = ${x}: top ${nge === -1 ? 'is empty' : `is ${nge} (>${x})`} → answer[${i}] = ${nge}. Push ${x}.`,
      i,
      [
        { label: 'i / x', value: `${i} / ${x}` },
        { label: 'popped', value: popped.length === 0 ? 'none' : popped.join(', ') },
        { label: 'stack', value: `[${stack.join(', ')}]` },
        { label: 'answer', value: `[${answer.map((v) => (v === '' ? '?' : v)).join(', ')}]` },
      ],
    );
  }

  steps.push({
    id: 'done',
    description: `Done: next greater = [${answer.join(', ')}]. Each element pushes and pops once: O(n) total.`,
    state: {
      values: [...values],
      tones: values.map(() => DONE),
      answer: [...answer],
      answerTones: answer.map(() => DONE),
      stack: [...stack],
      stackTones: stack.map(() => DONE),
      cursor: -1,
      panel: [
        { label: 'answer', value: `[${answer.join(', ')}]` },
        { label: 'cost', value: 'O(n): one push + one pop each' },
      ],
    } satisfies MonoState,
    highlight: [],
  });
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as MonoState;
  return (
    <div className="algo-scene">
      <div>
        <p className="viz-array-label">input (scanning ←)</p>
        <ArrayCells
          values={state.values}
          tones={state.tones}
          pointers={state.cursor >= 0 ? [{ label: 'i', index: state.cursor }] : []}
        />
        <p className="viz-array-label">next greater answer</p>
        <ArrayCells values={state.answer} tones={state.answerTones} pointers={[]} />
        <p className="viz-array-label">monotonic stack (increasing)</p>
        <StackView values={state.stack} tones={state.stackTones} topLabel="top" ariaLabel="Monotonic stack" />
      </div>
      <StatePanel entries={state.panel} />
    </div>
  );
}

export default function MonotonicStackViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
    </>
  );
}
