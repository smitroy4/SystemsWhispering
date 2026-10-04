import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import Legend from '../Legend.tsx';
import StatePanel from '../algo/StatePanel.tsx';
import type { StateEntry } from '../algo/StatePanel.tsx';
import { StackView } from '../primitives.tsx';
import type { CellTone } from '../primitives.tsx';
import type { VizStep } from '../../../types/content.ts';
import './concepts.css';

interface StackState {
  frames: string[];
  tones: CellTone[];
  panel: StateEntry[];
}

const D: CellTone = 'default';
const A: CellTone = 'active';
const DONE: CellTone = 'done';

/** factorial(4): frames pile up to fact(0), then results unwind. */
function buildSteps(): VizStep[] {
  const calls = ['fact(4)', 'fact(3)', 'fact(2)', 'fact(1)', 'fact(0)'];
  const results = ['1', '1', '2', '6', '24'];
  const steps: VizStep[] = [];

  const snap = (
    id: string,
    description: string,
    depth: number,
    returning: boolean,
    result: string,
  ): VizStep => {
    const frames = calls.slice(0, depth + 1);
    if (returning) {
      frames[frames.length - 1] = `${frames[frames.length - 1]} = ${result}`;
    }
    return {
      id,
      description,
      state: {
        frames,
        tones: frames.map((_, k) => (k === frames.length - 1 ? A : D)),
        panel: [
          { label: 'depth', value: String(depth + 1) },
          { label: 'top frame', value: frames[frames.length - 1] ?? '—' },
          ...(returning ? [{ label: 'returns', value: result }] : []),
        ],
      } satisfies StackState,
      highlight: [],
    };
  };

  steps.push(snap('call-4', 'Call fact(4): a frame with n = 4 lands on the call stack.', 0, false, ''));
  steps.push(snap('call-3', 'fact(4) calls fact(3): new frame on top. Nothing returns yet.', 1, false, ''));
  steps.push(snap('call-2', 'fact(3) calls fact(2): the stack keeps growing downward.', 2, false, ''));
  steps.push(snap('call-1', 'fact(2) calls fact(1): four frames waiting on one answer.', 3, false, ''));
  steps.push(snap('call-0', 'fact(1) calls fact(0): base case hits — no deeper call.', 4, false, ''));
  steps.push(snap('ret-0', 'fact(0) returns 1. Its frame pops; fact(1) resumes.', 4, true, results[0]));
  steps.push(snap('ret-1', 'fact(1) returns 1 × 1 = 1. Frame pops.', 3, true, results[1]));
  steps.push(snap('ret-2', 'fact(2) returns 2 × 1 = 2. Frame pops.', 2, true, results[2]));
  steps.push(snap('ret-3', 'fact(3) returns 3 × 2 = 6. Frame pops.', 1, true, results[3]));
  steps.push({
    id: 'ret-4',
    description: 'fact(4) returns 4 × 6 = 24. Stack empty — max depth was 5, so recursion costs O(n) space.',
    state: {
      frames: ['fact(4) = 24'],
      tones: [DONE],
      panel: [
        { label: 'depth', value: '0' },
        { label: 'answer', value: '24' },
        { label: 'max depth', value: '5' },
      ],
    } satisfies StackState,
    highlight: [],
  });
  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as StackState;
  return (
    <div className="algo-scene">
      <StackView values={state.frames} tones={state.tones} topLabel="top" ariaLabel="Call stack frames" />
      <StatePanel title="Call stack" entries={state.panel} />
    </div>
  );
}

export default function CallStackViz() {
  const steps = useMemo(() => buildSteps(), []);
  return (
    <>
      <VizPlayer steps={steps} render={renderStep} />
      <Legend
        items={[
          { tone: 'default', label: 'Default', hint: 'Waiting frame' },
          { tone: 'active', label: 'Active', hint: 'Running frame' },
          { tone: 'compared', label: 'Compared', hint: 'Unused here' },
          { tone: 'swapped', label: 'Swapped / Found', hint: 'Unused here' },
          { tone: 'done', label: 'Done', hint: 'Final answer' },
        ]}
      />
    </>
  );
}
