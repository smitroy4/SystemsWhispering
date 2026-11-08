/**
 * exception-handling-basics — 2 visuals.
 * 1. try/catch/finally control flow for both paths (animated).
 * 2. Stack unwinding as frames pop (animated).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import VizPlayer from '../VizPlayer.tsx';
import type { VizStep } from '../../../types/content.ts';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: try/catch/finally control flow (animated) ---------------- */

const TRY_STEPS: VizStep[] = [
  { id: 'a', description: 'try block runs; no exception → skip catch, run finally.', state: { path: 'noException' } },
  { id: 'b', description: 'Exception thrown → jump to matching catch, then finally.', state: { path: 'exception' } },
];

function renderTry(step: VizStep | undefined) {
  const s = step?.state as { path?: string } ?? {};
  const catchActive = s.path === 'exception' ? 'active' : 'default';
  return (
    <svg className="viz-svg" viewBox="0 0 520 220" role="img" aria-label="try catch finally control flow">
      <JBox x={40} y={20} w={440} h={44} title="try/catch/finally: finally always runs" />
      <JBox x={40} y={80} w={200} title="try" rows={['body']} tone="good" />
      <JBox x={260} y={80} w={220} title="catch" rows={['handler']} tone={catchActive} />
      <JBox x={40} y={150} w={440} title="finally" rows={['always runs']} />
      <JArrow x1={240} y1={108} x2={260} y2={108} tone={catchActive} />
      <JNote x={40} y={220}>{'finally runs whether or not an exception occurred — use it for cleanup.'}</JNote>
    </svg>
  );
}

function TryCatch() {
  return <VizPlayer steps={TRY_STEPS} render={renderTry} autoPlay={false} />;
}

/* ---------------- Visual 2: stack unwinding frames pop (animated) ---------------- */

const UNWIND_STEPS: VizStep[] = [
  { id: 'a', description: 'Exception thrown in method C; unwinding begins.', state: { frame: 'C' } },
  { id: 'b', description: 'Frame C popped; continue to B.', state: { frame: 'B' } },
  { id: 'c', description: 'Frame B popped; continue to A which has catch.', state: { frame: 'A' } },
];

function renderUnwind(step: VizStep | undefined) {
  const s = step?.state as { frame?: string } ?? {};
  return (
    <svg className="viz-svg" viewBox="0 0 520 220" role="img" aria-label="Stack unwinding frames pop">
      <JBox x={40} y={20} w={440} h={44} title="Exception propagates up the call stack, popping frames" />
      <JBox x={40} y={80} w={440} title={'Stack: A → B → ' + (s.frame === 'C' ? 'C (throwing)' : s.frame === 'B' ? 'B' : 'A (catch)')} rows={[]} tone="bad" />
      <JNote x={40} y={160}>{'Each frame is popped until a catch block handles the exception or the thread terminates.'}</JNote>
    </svg>
  );
}

function StackUnwind() {
  return <VizPlayer steps={UNWIND_STEPS} render={renderUnwind} autoPlay={false} />;
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'try/catch/finally control flow',
    caption: 'Both the normal path (skip catch) and the exception path (catch then finally).',
    notice: 'finally always runs — use it for resource cleanup.',
    component: TryCatch,
  },
  {
    title: 'Stack unwinding frames pop',
    caption: 'An exception propagates up the call stack, popping frames.',
    notice: 'Unwinding continues until a matching catch is found.',
    component: StackUnwind,
  },
];
