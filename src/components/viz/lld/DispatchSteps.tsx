import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import { lScene, renderLScene } from './lldScene.tsx';

/** Reference promises Animal, the Dog object delivers speak(). */
function buildSteps() {
  const base = {
    width: 560,
    height: 250,
    label: 'Dynamic dispatch of speak()',
    arrows: [{ x1: 280, y1: 108, x2: 280, y2: 132, label: 'speak()', active: false }],
    notes: [{ x: 280, y: 228, text: 'Reference type promises — runtime object delivers.' }],
  };
  return [
    lScene('ref', 'Reference: Animal animal — the compiler only knows Animal.', {
      ...base,
      boxes: [{ x: 200, y: 40, w: 160, title: 'Animal animal', rows: ['promises speak()'] }],
    }),
    lScene('obj', 'Object: new Dog() — the heap holds a Dog with its own speak().', {
      ...base,
      boxes: [
        { x: 200, y: 40, w: 160, title: 'Animal animal', rows: ['promises speak()'] },
        { x: 200, y: 132, w: 160, title: 'Dog object', rows: ['speak(): "dog"'], tone: 'good' },
      ],
    }),
    lScene('run', 'Runtime: the call lands on Dog.speak(). Stable caller, varying behavior.', {
      ...base,
      arrows: [{ x1: 280, y1: 108, x2: 280, y2: 132, label: 'speak()', active: true }],
      boxes: [
        { x: 200, y: 40, w: 160, title: 'Animal animal', rows: ['promises speak()'] },
        { x: 200, y: 132, w: 160, title: 'Dog object', rows: ['speak(): "dog"'], tone: 'good' },
      ],
    }),
  ];
}

export default function DispatchSteps() {
  const steps = useMemo(() => buildSteps(), []);
  return <VizPlayer steps={steps} render={renderLScene} />;
}
