import { lazy } from 'react';
import type { ComponentType } from 'react';

/** A topic visualization: owns its own steps + VizPlayer, takes no props. */
export type VizComponent = ComponentType;

/**
 * Maps Topic.vizId → visualization component.
 * Each viz is lazy-loaded per route so topic pages only download
 * the animation they actually render.
 * TopicPage renders the match (inside Suspense), or a "Coming soon" box when missing.
 */
export const vizRegistry: Record<string, VizComponent> = {
  'array-ops': lazy(() => import('./ds/ArrayViz.tsx')),
  'dynamic-array-growth': lazy(() => import('./ds/DynamicArrayViz.tsx')),
  'string-builder': lazy(() => import('./ds/StringViz.tsx')),
  'sll-ops': lazy(() => import('./ds/SinglyLinkedListViz.tsx')),
  'dll-ops': lazy(() => import('./ds/DoublyLinkedListViz.tsx')),
  'stack-push-pop': lazy(() => import('./ds/StackViz.tsx')),
  'queue-deque-ops': lazy(() => import('./ds/QueueViz.tsx')),
  'hash-collision': lazy(() => import('./ds/HashViz.tsx')),
  'hash-set-ops': lazy(() => import('./ds/HashSetViz.tsx')),
  'binary-tree-traversals': lazy(() => import('./ds/BinaryTreeViz.tsx')),
  'bst-ops': lazy(() => import('./ds/BstViz.tsx')),
  'heap-ops': lazy(() => import('./ds/HeapViz.tsx')),
  'trie-ops': lazy(() => import('./ds/TrieViz.tsx')),
  'segment-tree-query': lazy(() => import('./ds/SegmentTreeViz.tsx')),
  'fenwick-ops': lazy(() => import('./ds/FenwickViz.tsx')),
  'union-find-ops': lazy(() => import('./ds/UnionFindViz.tsx')),
  'graph-representations': lazy(() => import('./ds/GraphRepViz.tsx')),
  'dijkstra-steps': lazy(() => import('./ds/DijkstraViz.tsx')),
  'advanced-graphs-tour': lazy(() => import('./ds/AdvancedGraphsViz.tsx')),
  'linear-search-steps': lazy(() => import('./algo/LinearSearchViz.tsx')),
  'binary-search-steps': lazy(() => import('./algo/BinarySearchViz.tsx')),
  'bubble-sort-steps': lazy(() => import('./algo/BubbleSortViz.tsx')),
  'selection-sort-steps': lazy(() => import('./algo/SelectionSortViz.tsx')),
  'insertion-sort-steps': lazy(() => import('./algo/InsertionSortViz.tsx')),
  'merge-sort-steps': lazy(() => import('./algo/MergeSortViz.tsx')),
  'quick-sort-steps': lazy(() => import('./algo/QuickSortViz.tsx')),
  'heap-sort-steps': lazy(() => import('./algo/HeapSortViz.tsx')),
  'counting-sort-steps': lazy(() => import('./algo/CountingSortViz.tsx')),
  'two-pointers-steps': lazy(() => import('./algo/TwoPointersViz.tsx')),
  'sliding-window-steps': lazy(() => import('./algo/SlidingWindowViz.tsx')),
  'prefix-sum-steps': lazy(() => import('./algo/PrefixSumViz.tsx')),
  'fast-slow-steps': lazy(() => import('./algo/FastSlowViz.tsx')),
  'recursion-tree-steps': lazy(() => import('./algo/RecursionTreeViz.tsx')),
  'backtracking-steps': lazy(() => import('./algo/BacktrackingViz.tsx')),
  'divide-and-conquer-steps': lazy(() => import('./algo/DivideConquerViz.tsx')),
  'greedy-steps': lazy(() => import('./algo/GreedyViz.tsx')),
  'bfs-steps': lazy(() => import('./algo/BfsViz.tsx')),
  'dfs-steps': lazy(() => import('./algo/DfsViz.tsx')),
  'topological-sort-steps': lazy(() => import('./algo/TopoSortViz.tsx')),
  'dijkstra-algo-steps': lazy(() => import('./algo/DijkstraViz.tsx')),
  'bellman-ford-steps': lazy(() => import('./algo/BellmanFordViz.tsx')),
  'union-find-cycle-steps': lazy(() => import('./algo/UnionFindCycleViz.tsx')),
  'kruskal-steps': lazy(() => import('./algo/KruskalViz.tsx')),
  'prim-steps': lazy(() => import('./algo/PrimViz.tsx')),
  'dp-1d-steps': lazy(() => import('./algo/Dp1dViz.tsx')),
  'dp-2d-steps': lazy(() => import('./algo/Dp2dViz.tsx')),
  'knapsack-steps': lazy(() => import('./algo/KnapsackViz.tsx')),
  'big-o-curves': lazy(() => import('./concepts/BigOCurvesViz.tsx')),
  'recursion-call-stack': lazy(() => import('./concepts/CallStackViz.tsx')),
  'bit-operations': lazy(() => import('./concepts/BitOpsViz.tsx')),
  'monotonic-stack-steps': lazy(() => import('./concepts/MonotonicStackViz.tsx')),
};

export function getViz(vizId: string): VizComponent | undefined {
  return vizRegistry[vizId];
}
