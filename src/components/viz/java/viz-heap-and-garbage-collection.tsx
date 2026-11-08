/**
 * heap-and-garbage-collection — 2 visuals.
 * 1. Young / old generation GC with minor GC, survivor swap, promotion (animated).
 * 2. Reachability mark-sweep-compact steps (animated).
 */
import { JBox, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: young/old generation GC (animated) ---------------- */

const GC_STEPS: VizStep[] = [
  { id: 'a', description: 'Minor GC: live objects in Eden/S0 copied to S1; survivors age.', state: { phase: 'minor' } },
  { id: 'b', description: 'Survivor swap: S0 and S1 roles exchange.', state: { phase: 'swap' } },
  { id: 'c', description: 'Promotion: old enough survivors move to old generation.', state: { phase: 'promote' } },
];

function renderGc(step: VizStep | undefined) {
  const s = step?.state as { phase?: string } ?? {};
  const label = s.phase === 'minor' ? 'minor GC in young gen' : s.phase === 'swap' ? 'survivor space swap' : 'promote to old gen';
  return (
    <svg className="viz-svg" viewBox="0 0 520 200" role="img" aria-label="Young old generation GC">
      <JBox x={40} y={20} w={440} h={44} title="Generational GC: young (Eden/S0/S1) and old generation" />
      <JBox x={40} y={80} w={440} title={label} rows={[]} tone="good" />
      <JNote x={40} y={160}>{'Most objects die young; minor GC is fast and stop-the-world only for young gen.'}</JNote>
    </svg>
  );
}

function GenerationalGc() {
  return <VizPlayer steps={GC_STEPS} render={renderGc} autoPlay={false} />;
}

/* ---------------- Visual 2: reachability mark-sweep-compact (animated) ---------------- */

const REACH_STEPS: VizStep[] = [
  { id: 'a', description: 'Mark: traverse from GC roots and mark reachable objects.', state: { phase: 'mark' } },
  { id: 'b', description: 'Sweep: reclaim unmarked objects.', state: { phase: 'sweep' } },
  { id: 'c', description: 'Compact: move live objects together to defragment.', state: { phase: 'compact' } },
];

function renderReach(step: VizStep | undefined) {
  const s = step?.state as { phase?: string } ?? {};
  const label = s.phase === 'mark' ? 'mark reachable from roots' : s.phase === 'sweep' ? 'sweep unreachable' : 'compact live objects';
  return (
    <svg className="viz-svg" viewBox="0 0 520 200" role="img" aria-label="Reachability mark sweep compact">
      <JBox x={40} y={20} w={440} h={44} title="Reachability graph: mark-sweep-compact" />
      <JBox x={40} y={80} w={440} title={label} rows={[]} tone="good" />
      <JNote x={40} y={160}>{'An object is collectable only when no GC root can reach it.'}</JNote>
    </svg>
  );
}

function Reachability() {
  return <VizPlayer steps={REACH_STEPS} render={renderReach} autoPlay={false} />;
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Young / old generation GC',
    caption: 'Minor GC, survivor swap, promotion to old generation.',
    notice: 'Generational hypothesis: most objects die young.',
    component: GenerationalGc,
  },
  {
    title: 'Reachability mark-sweep-compact',
    caption: 'Mark from roots, sweep unreachable, compact live objects.',
    notice: 'Only unreachable objects are reclaimed.',
    component: Reachability,
  },
];
