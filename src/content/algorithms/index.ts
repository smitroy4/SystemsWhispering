import type { Topic } from '../../types/content.ts';
import { linearSearchTopic } from './linearSearch.ts';
import { binarySearchTopic } from './binarySearch.ts';
import { bubbleSortTopic } from './bubbleSort.ts';
import { selectionSortTopic } from './selectionSort.ts';
import { insertionSortTopic } from './insertionSort.ts';
import { mergeSortTopic } from './mergeSort.ts';
import { quickSortTopic } from './quickSort.ts';
import { heapSortTopic } from './heapSort.ts';
import { countingSortTopic } from './countingSort.ts';
import { twoPointersTopic } from './twoPointers.ts';
import { slidingWindowTopic } from './slidingWindow.ts';
import { prefixSumTopic } from './prefixSum.ts';
import { fastSlowTopic } from './fastSlow.ts';
import { recursionTreeTopic } from './recursionTree.ts';
import { backtrackingTopic } from './backtracking.ts';
import { divideConquerTopic } from './divideConquer.ts';
import { greedyTopic } from './greedy.ts';
import { bfsTopic } from './bfs.ts';
import { dfsTopic } from './dfs.ts';
import { topoSortTopic } from './topoSort.ts';
import { dijkstraTopic } from './dijkstra.ts';
import { bellmanFordTopic } from './bellmanFord.ts';
import { unionFindCycleTopic } from './unionFindCycle.ts';
import { kruskalTopic } from './kruskal.ts';
import { primTopic } from './prim.ts';
import { dp1dTopic } from './dp1d.ts';
import { dp2dTopic } from './dp2d.ts';
import { knapsackTopic } from './knapsack.ts';

/** Algorithm topics. Entries land here in later steps. */
export const algorithms: Topic[] = [
  linearSearchTopic,
  binarySearchTopic,
  bubbleSortTopic,
  selectionSortTopic,
  insertionSortTopic,
  mergeSortTopic,
  quickSortTopic,
  heapSortTopic,
  countingSortTopic,
  twoPointersTopic,
  slidingWindowTopic,
  prefixSumTopic,
  fastSlowTopic,
  recursionTreeTopic,
  backtrackingTopic,
  divideConquerTopic,
  greedyTopic,
  bfsTopic,
  dfsTopic,
  topoSortTopic,
  dijkstraTopic,
  bellmanFordTopic,
  unionFindCycleTopic,
  kruskalTopic,
  primTopic,
  dp1dTopic,
  dp2dTopic,
  knapsackTopic,
];

export function getAlgorithm(slug: string): Topic | undefined {
  return algorithms.find((t) => t.slug === slug);
}
