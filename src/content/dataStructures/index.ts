import type { Topic } from '../../types/content.ts';
import { arrayTopic } from './array.ts';
import { dynamicArrayTopic } from './dynamicArray.ts';
import { stringTopic } from './string.ts';
import { singlyLinkedListTopic } from './singlyLinkedList.ts';
import { doublyLinkedListTopic } from './doublyLinkedList.ts';
import { stackTopic } from './stack.ts';
import { queueDequeTopic } from './queueDeque.ts';
import { hashTableTopic } from './hashTable.ts';
import { hashSetTopic } from './hashSet.ts';
import { binaryTreeTopic } from './binaryTree.ts';
import { bstTopic } from './bst.ts';
import { heapTopic } from './heap.ts';
import { trieTopic } from './trie.ts';
import { segmentTreeTopic } from './segmentTree.ts';
import { fenwickTreeTopic } from './fenwickTree.ts';
import { unionFindTopic } from './unionFind.ts';
import { graphRepresentationsTopic } from './graphRepresentations.ts';
import { weightedGraphTopic } from './weightedGraph.ts';
import { advancedGraphsTopic } from './advancedGraphs.ts';

/** Data-structure topics. Entries land here in later steps. */
export const dataStructures: Topic[] = [arrayTopic, dynamicArrayTopic, stringTopic, singlyLinkedListTopic, doublyLinkedListTopic, stackTopic, queueDequeTopic, hashTableTopic, hashSetTopic, binaryTreeTopic, bstTopic, heapTopic, trieTopic, segmentTreeTopic, fenwickTreeTopic, unionFindTopic, graphRepresentationsTopic, weightedGraphTopic, advancedGraphsTopic];

export function getDataStructure(slug: string): Topic | undefined {
  return dataStructures.find((t) => t.slug === slug);
}
