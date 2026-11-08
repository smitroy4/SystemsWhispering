/**
 * conditional-statements — 2 visuals.
 * 1. if-else ladder flowchart that walks a chosen input (animated).
 * 2. Switch fall-through vs arrow-label comparison (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: if-else ladder (animated) ---------------- */

const LADDER_STEPS: VizStep[] = [
  { id: 'start', description: 'Input score = 85. Evaluate the if-else ladder top to bottom.', state: { score: 85, branch: null } },
  { id: 'a', description: 'score >= 90? 85 >= 90 is false — skip the A branch.', state: { score: 85, branch: 'skipA' } },
  { id: 'b', description: 'score >= 80? 85 >= 80 is true — take the B branch.', state: { score: 85, branch: 'takeB' } },
];

function renderLadder(step: VizStep | undefined) {
  const s = step?.state as { score: number; branch?: string } ?? { score: 85, branch: null };
  const highlightA = s.branch === 'skipA' ? 'compared' : 'default';
  const highlightB = s.branch === 'takeB' ? 'active' : 'default';
  const aResult = s.score >= 90;
  const bResult = s.score >= 80;
  return (
    <svg className="viz-svg" viewBox="0 0 560 280" role="img" aria-label="if-else ladder flowchart">
      <JBox x={40} y={20} w={480} h={44} title="if-else ladder — first true branch wins, rest skipped" />
      <JBox x={60} y={80} w={200} title="score >= 90" rows={[`score >= 90 → ${aResult}`]} tone={highlightA} />
      <JBox x={60} y={140} w={200} title="score >= 80" rows={[`score >= 80 → ${bResult}`]} tone={highlightB} />
      <JBox x={280} y={80} w={220} title="Grade: A" rows={[]} tone="default" />
      <JBox x={280} y={140} w={220} title="Grade: B" rows={[]} tone={highlightB} />
      <JArrow x1={260} y1={106} x2={280} y2={106} tone="default" />
      <JArrow x1={260} y1={166} x2={280} y2={166} tone={s.branch === 'takeB' ? 'active' : 'default'} />
      <JNote x={40} y={235}>{'Only the first matching branch runs; later else-if branches are skipped.'}</JNote>
    </svg>
  );
}

function IfElseLadder() {
  return <VizPlayer steps={LADDER_STEPS} render={renderLadder} autoPlay={false} />;
}

/* ---------------- Visual 2: switch fall-through vs arrow labels ---------------- */

function SwitchChart() {
  return (
    <svg className="viz-svg" viewBox="0 0 600 300" role="img" aria-label="Switch fall-through vs arrow labels">
      <JBox x={40} y={20} w={520} h={44} title="Classic switch (fall-through) vs switch expression (arrow labels)" />
      <JBox x={40} y={80} w={260} title="Classic switch" rows={['case 1:', '  println(1)', '  // falls through!', 'case 2:', '  println(2)', 'break;']} tone="bad" />
      <JBox x={320} y={80} w={240} title="Arrow switch" rows={['case 1 ->', '  println(1)', 'case 2 ->', '  println(2)', '// no fall-through']} tone="good" />
      <JArrow x1={300} y1={135} x2={320} y2={135} />
      <JNote x={40} y={210}>{'Arrow labels (case 1 ->) execute only the matching arm — no fall-through.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'if-else ladder flowchart',
    caption: 'Walks a chosen input through branches top to bottom.',
    notice: 'First true branch wins; the rest are skipped.',
    component: IfElseLadder,
  },
  {
    title: 'Switch fall-through vs arrow labels',
    caption: 'Classic switch can fall through; arrow labels cannot.',
    notice: 'Prefer arrow switch expressions to avoid fall-through bugs.',
    component: SwitchChart,
  },
];
