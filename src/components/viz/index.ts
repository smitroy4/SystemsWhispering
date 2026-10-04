export { default as VizPlayer } from './VizPlayer.tsx';
export { default as Legend } from './Legend.tsx';
export type { LegendItem } from './Legend.tsx';
export {
  ArrayCells,
  VizNode,
  VizEdge,
  ArrowLabel,
  StackView,
  QueueView,
  BarChart,
} from './primitives.tsx';
export type { CellTone, CellPointer } from './primitives.tsx';
export { vizRegistry, getViz } from './registry.ts';
export type { VizComponent } from './registry.ts';
