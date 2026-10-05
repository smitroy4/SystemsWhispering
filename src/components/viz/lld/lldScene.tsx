/**
 * Generic scene renderer for stepped LLD illustrations.
 * A step's state is a full LScene description; frames are precomputed
 * data driving VizPlayer like every other animation on the site.
 */
import type { VizStep } from '../../../types/content.ts';
import { LArrow, LBox, LNote } from './lldPrimitives.tsx';
import type { LArrowSpec, LBoxSpec } from './lldPrimitives.tsx';

export interface LScene {
  width: number;
  height: number;
  label: string;
  boxes: LBoxSpec[];
  arrows: LArrowSpec[];
  notes: Array<{ x: number; y: number; text: string }>;
}

export function lScene(id: string, description: string, scene: LScene): VizStep {
  return { id, description, state: scene, highlight: [] };
}

export function renderLScene(step: VizStep | undefined) {
  if (step === undefined) return <p className="viz-player__empty">No steps.</p>;
  const scene = step.state as LScene;
  return (
    <svg
      className="viz-svg"
      viewBox={`0 0 ${scene.width} ${scene.height}`}
      role="img"
      aria-label={scene.label}
    >
      {scene.arrows.map((a, i) => (
        <LArrow key={i} {...a} />
      ))}
      {scene.boxes.map((b, i) => (
        <LBox key={i} {...b} />
      ))}
      {scene.notes.map((n, i) => (
        <LNote key={i} x={n.x} y={n.y}>
          {n.text}
        </LNote>
      ))}
    </svg>
  );
}
