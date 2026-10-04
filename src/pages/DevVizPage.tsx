import { useMemo } from 'react';
import { PageShell } from '../components/layout/index.ts';
import { ArrayCells, Legend, VizPlayer } from '../components/viz/index.ts';
import type { CellTone } from '../components/viz/index.ts';
import type { VizStep } from '../types/content.ts';
import { usePageMeta } from '../utils/pageMeta.ts';

/** Demo-only frame state. The engine never sees this shape (state is opaque). */
interface LinearSearchState {
  values: number[];
  cursor: number;
  found: boolean;
  done: boolean;
}

const VALUES = [4, 7, 2, 9, 5];
const TARGET = 9;

/** Precompute every frame of a linear search (demo fixture, not topic content). */
function buildLinearSearchSteps(values: number[], target: number): VizStep[] {
  const steps: VizStep[] = [
    {
      id: 'start',
      description: `Search for ${target} in [${values.join(', ')}], scanning left to right.`,
      state: { values, cursor: -1, found: false, done: false } satisfies LinearSearchState,
    },
  ];

  for (let i = 0; i < values.length; i += 1) {
    if (values[i] === target) {
      steps.push({
        id: `found-${i}`,
        description: `Check index ${i}: ${values[i]} equals ${target} — found!`,
        state: { values, cursor: i, found: true, done: false } satisfies LinearSearchState,
        highlight: [i],
      });
      break;
    }
    steps.push({
      id: `check-${i}`,
      description: `Check index ${i}: ${values[i]} is not ${target}, move on.`,
      state: { values, cursor: i, found: false, done: false } satisfies LinearSearchState,
      highlight: [i],
    });
  }

  const last = steps[steps.length - 1]?.state as LinearSearchState;
  steps.push({
    id: 'done',
    description: last.found
      ? `Done — ${target} found at index ${last.cursor}.`
      : `Done — ${target} is not in the array.`,
    state: { ...last, done: true } satisfies LinearSearchState,
    highlight: last.cursor >= 0 ? [last.cursor] : [],
  });

  return steps;
}

function renderStep(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const state = step.state as LinearSearchState;
  const tones: CellTone[] = state.values.map((_, i) => {
    if (state.done) return state.found && i === state.cursor ? 'swapped' : 'done';
    if (i === state.cursor) return state.found ? 'swapped' : 'active';
    return 'default';
  });
  const pointers = state.cursor >= 0 ? [{ label: 'i', index: state.cursor }] : [];
  return <ArrayCells values={state.values} tones={tones} pointers={pointers} />;
}

/** Engine demo: proves VizPlayer + primitives work end to end. */
export default function DevVizPage() {
  const steps = useMemo(() => buildLinearSearchSteps(VALUES, TARGET), []);

  usePageMeta('Visualization engine demo', 'Developer demo of the step-engine player.');

  return (
    <PageShell
      title="Viz engine demo"
      description={`Linear search for ${TARGET} — exercises every player control.`}
    >
      <VizPlayer steps={steps} render={renderStep} />
      <Legend />
      <p>
        <strong>Try it:</strong> focus the player and press Space to play/pause, ←/→ to
        step. Drag the speed slider from 0.5x to 3x.
      </p>
    </PageShell>
  );
}
