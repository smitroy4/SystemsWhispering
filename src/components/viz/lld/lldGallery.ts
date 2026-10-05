import type { ComponentType } from 'react';
import BlastRadius from './BlastRadius.tsx';
import ChangeSurface from './ChangeSurface.tsx';
import ClassObjectDiagram from './ClassObjectDiagram.tsx';
import DecisionsFlow from './DecisionsFlow.tsx';
import DependencyInversion from './DependencyInversion.tsx';
import DispatchSteps from './DispatchSteps.tsx';
import EncapsulationWall from './EncapsulationWall.tsx';
import ErasureDiagram from './ErasureDiagram.tsx';
import FragileBase from './FragileBase.tsx';
import HldLldLayers from './HldLldLayers.tsx';
import InheritanceTree from './InheritanceTree.tsx';
import InitOrderSteps from './InitOrderSteps.tsx';
import InterfaceVsAbstract from './InterfaceVsAbstract.tsx';
import IspSplit from './IspSplit.tsx';
import LayeredOnion from './LayeredOnion.tsx';
import LspRectangle from './LspRectangle.tsx';
import OcpPlugin from './OcpPlugin.tsx';
import OwnershipDiamonds from './OwnershipDiamonds.tsx';
import ReversibilityScale from './ReversibilityScale.tsx';
import SeamDiagram from './SeamDiagram.tsx';
import SimplicityTriptych from './SimplicityTriptych.tsx';
import SkippedDiagram from './SkippedDiagram.tsx';
import SrpSplit from './SrpSplit.tsx';
import StackHeapDiagram from './StackHeapDiagram.tsx';
import TrainWreck from './TrainWreck.tsx';

export interface LldDiagramEntry {
  title: string;
  Component: ComponentType;
}

/** Diagram id → illustration, rendered inside LLD topic pages. */
export const lldDiagrams: Record<string, LldDiagramEntry> = {
  'oop-memory-model': { title: 'Stack frames reference heap objects', Component: StackHeapDiagram },
  'class-object-instance': { title: 'One blueprint, independent objects', Component: ClassObjectDiagram },
  'init-order-steps': { title: 'Initialization order, step by step', Component: InitOrderSteps },
  'encapsulation-wall': { title: 'Behavior guards the wall; raw fields bypass it', Component: EncapsulationWall },
  'interface-vs-abstract': { title: 'Capability contract versus shared base', Component: InterfaceVsAbstract },
  'inheritance-tree': { title: 'Valid hierarchies and the has-a mistake', Component: InheritanceTree },
  'dispatch-steps': { title: 'Dynamic dispatch in three frames', Component: DispatchSteps },
  'ownership-diamonds': { title: 'Association, aggregation, composition', Component: OwnershipDiamonds },
  'dependency-inversion': { title: 'Inverting toward the contract', Component: DependencyInversion },
  'erasure-diagram': { title: 'Two spellings, one runtime class', Component: ErasureDiagram },
  'fragile-base': { title: 'Deep chains ripple; collaborators swap', Component: FragileBase },
  'change-surface': { title: 'Same requirement, two change surfaces', Component: ChangeSurface },
  'srp-split': { title: 'God service fans out, step by step', Component: SrpSplit },
  'ocp-plugin': { title: 'New policy arrives without edits', Component: OcpPlugin },
  'lsp-rectangle': { title: 'Broken promise beside honest capabilities', Component: LspRectangle },
  'isp-split': { title: 'Fat contract segregated by client', Component: IspSplit },
  'simplicity-triptych': { title: 'Restraint in three lessons', Component: SimplicityTriptych },
  'blast-radius': { title: 'Blast radius before and after an adapter', Component: BlastRadius },
  'train-wreck': { title: 'Chain spelunking versus delegation', Component: TrainWreck },
  'layered-onion': { title: 'Each layer decides its own concerns', Component: LayeredOnion },
  'seam-diagram': { title: 'Sockets where fakes plug in', Component: SeamDiagram },
  'design-decisions-flow': { title: 'Requirements flow into runtime', Component: DecisionsFlow },
  'hld-lld-layers': { title: 'Services versus classes', Component: HldLldLayers },
  'reversibility-scale': { title: 'Spend effort where reversal hurts', Component: ReversibilityScale },
};

export function getLldDiagram(id: string): LldDiagramEntry | undefined {
  return lldDiagrams[id] ?? SkippedDiagramEntry;
}

const SkippedDiagramEntry: LldDiagramEntry = {
  title: 'Illustration coming soon',
  Component: SkippedDiagram,
};
