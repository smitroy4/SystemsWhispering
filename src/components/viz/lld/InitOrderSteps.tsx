import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import { lScene, renderLScene } from './lldScene.tsx';
import type { LScene } from './lldScene.tsx';

const W = 560;
const H = 250;
const STAGES = ['1. allocate', '2. defaults', '3. initializers', '4. constructor'];

function scene(active: number): LScene {
  return {
    width: W,
    height: H,
    label: 'Object initialization order',
    boxes: STAGES.map((title, i) => ({
      x: 14 + i * 136,
      y: 60,
      w: 124,
      title,
      rows: i === 0 ? ['memory'] : i === 1 ? ['null / 0'] : i === 2 ? ['= "a"'] : ['validate'],
      tone: i === active ? 'good' : 'default',
    })),
    arrows: STAGES.slice(0, -1).map((_, i) => ({
      x1: 138 + i * 136,
      y1: 105,
      x2: 150 + i * 136,
      y2: 105,
      active: i < active,
    })),
    notes: [{ x: W / 2, y: 210, text: 'Last writer wins — constructor body runs last.' }],
  };
}

/** Four construction stages, one frame at a time. */
function buildSteps() {
  return [
    lScene('allocate', 'Allocate: raw memory for the object appears first.', scene(0)),
    lScene('defaults', 'Defaults: fields become null and 0 before any of your code runs.', scene(1)),
    lScene('initializers', 'Initializers: field assignments and instance blocks execute.', scene(2)),
    lScene('constructor', 'Constructor: validation and final assignment complete the object.', scene(3)),
  ];
}

export default function InitOrderSteps() {
  const steps = useMemo(() => buildSteps(), []);
  return <VizPlayer steps={steps} render={renderLScene} />;
}
