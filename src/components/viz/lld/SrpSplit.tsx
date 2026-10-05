import { useMemo } from 'react';
import VizPlayer from '../VizPlayer.tsx';
import { lScene, renderLScene } from './lldScene.tsx';

/** God service fans out into owned collaborators. */
function buildSteps() {
  const god = {
    width: 560,
    height: 260,
    label: 'Splitting a god service',
    arrows: [] as Array<{ x1: number; y1: number; x2: number; y2: number; active?: boolean }>,
    notes: [{ x: 280, y: 244, text: 'Coordination stays; implementation moves out.' }],
  };
  const split = {
    ...god,
    arrows: [0, 1, 2, 3, 4].map((i) => ({
      x1: 100,
      y1: 120,
      x2: 300,
      y2: 40 + i * 40,
      active: true,
    })),
  };
  return [
    lScene('god', 'Before: CheckoutService validates, prices, charges, reserves, saves, and notifies.', {
      ...god,
      boxes: [{ x: 30, y: 80, w: 170, title: 'CheckoutService', rows: ['does everything'], tone: 'bad' }],
    }),
    lScene('split', 'After: six collaborators own six concerns; checkout only coordinates.', {
      ...split,
      boxes: [
        { x: 30, y: 80, w: 170, title: 'CheckoutService', rows: ['coordinates'], tone: 'good' },
        { x: 300, y: 16, w: 200, title: 'Validator', rows: [], tone: 'good' },
        { x: 300, y: 56, w: 200, title: 'PricingService', rows: [], tone: 'good' },
        { x: 300, y: 96, w: 200, title: 'PaymentGateway', rows: [], tone: 'good' },
        { x: 300, y: 136, w: 200, title: 'InventoryService', rows: [], tone: 'good' },
        { x: 300, y: 176, w: 200, title: 'OrderRepository', rows: [], tone: 'good' },
      ],
    }),
  ];
}

export default function SrpSplit() {
  const steps = useMemo(() => buildSteps(), []);
  return <VizPlayer steps={steps} render={renderLScene} />;
}
