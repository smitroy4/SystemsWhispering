import type { ComponentType } from 'react';

export type VizComponent = ComponentType;

import AtomicsCASIllustration from './AtomicsCASIllustration.tsx';
import CASRetryABAIllustration from './CASRetryABAIllustration.tsx';
import CollectionFrameworkIllustration from './CollectionFrameworkIllustration.tsx';
import CollectionInterfaceIllustration from './CollectionInterfaceIllustration.tsx';
import CompletableFutureIllustration from './CompletableFutureIllustration.tsx';
import ComparableComparatorIllustration from './ComparableComparatorIllustration.tsx';
import ConcurrencyProblemsIllustration from './ConcurrencyProblemsIllustration.tsx';
import EnumsIllustration from './EnumsIllustration.tsx';
import ExecutorFrameworkIllustration from './ExecutorFrameworkIllustration.tsx';
import ExplicitLocksIllustration from './ExplicitLocksIllustration.tsx';
import ForkJoinIllustration from './ForkJoinIllustration.tsx';
import GenericsIllustration from './GenericsIllustration.tsx';
import InterThreadCommunicationIllustration from './InterThreadCommunicationIllustration.tsx';
import InterfacesIllustration from './InterfacesIllustration.tsx';
import IterableIteratorIllustration from './IterableIteratorIllustration.tsx';
import LambdasFunctionalInterfacesIllustration from './LambdasFunctionalInterfacesIllustration.tsx';
import ListImplementationsIllustration from './ListImplementationsIllustration.tsx';
import MethodReferencesIllustration from './MethodReferencesIllustration.tsx';
import ObjectClassContractIllustration from './ObjectClassContractIllustration.tsx';
import OptionalIllustration from './OptionalIllustration.tsx';
import ParallelStreamsIllustration from './ParallelStreamsIllustration.tsx';
import ProcessesVsThreadsIllustration from './ProcessesVsThreadsIllustration.tsx';
import QueuePriorityQueueIllustration from './QueuePriorityQueueIllustration.tsx';
import SpecializedMapsIllustration from './SpecializedMapsIllustration.tsx';
import StreamOperationsIllustration from './StreamOperationsIllustration.tsx';
import StreamsCreationIllustration from './StreamsCreationIllustration.tsx';
import StringMethodsIllustration from './StringMethodsIllustration.tsx';
import StringsPoolIllustration from './StringsPoolIllustration.tsx';
import SynchronizedMonitorLockIllustration from './SynchronizedMonitorLockIllustration.tsx';
import ThreadCreationIllustration from './ThreadCreationIllustration.tsx';
import ThreadLocalIllustration from './ThreadLocalIllustration.tsx';
import ThreadMethodsIllustration from './ThreadMethodsIllustration.tsx';
import VirtualThreadsIllustration from './VirtualThreadsIllustration.tsx';
import WildcardsIllustration from './WildcardsIllustration.tsx';

export interface JavaDiagramEntry {
  title: string;
  Component: ComponentType;
}

export const javaDiagrams: Record<string, JavaDiagramEntry> = {
  'atomics-cas': { title: 'Atomic variables and CAS', Component: AtomicsCASIllustration },
  'cas-retry-aba': { title: 'CAS retry loops and ABA problem', Component: CASRetryABAIllustration },
  'collection-framework': { title: 'Collections Framework hierarchy', Component: CollectionFrameworkIllustration },
  'collection-interface': { title: 'Collection interface core methods', Component: CollectionInterfaceIllustration },
  'completable-future': { title: 'CompletableFuture composition', Component: CompletableFutureIllustration },
  'comparable-comparator': { title: 'Comparable and Comparator', Component: ComparableComparatorIllustration },
  'concurrency-problems': { title: 'Race conditions, visibility, reordering', Component: ConcurrencyProblemsIllustration },
  'enums': { title: 'Enums with fields, methods, EnumMap, EnumSet', Component: EnumsIllustration },
  'executor-framework': { title: 'Executor framework and thread pools', Component: ExecutorFrameworkIllustration },
  'explicit-locks': { title: 'ReentrantLock, ReadWriteLock, Semaphore', Component: ExplicitLocksIllustration },
  'forkjoin': { title: 'ForkJoinPool and work stealing', Component: ForkJoinIllustration },
  'generics': { title: 'Generics and bounded types', Component: GenericsIllustration },
  'inter-thread-communication': { title: 'wait, notify, notifyAll', Component: InterThreadCommunicationIllustration },
  'interfaces': { title: 'Default, functional, marker interfaces', Component: InterfacesIllustration },
  'iterable-iterator': { title: 'Iterable, Iterator, fail-fast', Component: IterableIteratorIllustration },
  'lambdas-functional-interfaces': { title: 'Lambdas and functional interfaces', Component: LambdasFunctionalInterfacesIllustration },
  'list-implementations': { title: 'List implementations: ArrayList to Stack', Component: ListImplementationsIllustration },
  'method-references': { title: 'Method references and composition', Component: MethodReferencesIllustration },
  'object-class-contract': { title: 'Object class: equals, hashCode, toString', Component: ObjectClassContractIllustration },
  'optional': { title: 'Optional usage patterns', Component: OptionalIllustration },
  'parallel-streams': { title: 'Parallel streams and primitive optionals', Component: ParallelStreamsIllustration },
  'processes-threads': { title: 'Process vs thread memory model', Component: ProcessesVsThreadsIllustration },
  'queue-priorityqueue': { title: 'Queue, Deque, ArrayDeque, PriorityQueue', Component: QueuePriorityQueueIllustration },
  'specialized-maps': { title: 'EnumMap, IdentityHashMap, WeakHashMap, LinkedHashMap', Component: SpecializedMapsIllustration },
  'stream-operations': { title: 'Stream intermediate and terminal operations', Component: StreamOperationsIllustration },
  'streams-creation': { title: 'Stream creation methods', Component: StreamsCreationIllustration },
  'string-methods': { title: 'String methods, StringBuilder, StringBuffer', Component: StringMethodsIllustration },
  'strings-pool': { title: 'String pool and immutability', Component: StringsPoolIllustration },
  'synchronized-monitor-lock': { title: 'synchronized and monitor locks', Component: SynchronizedMonitorLockIllustration },
  'thread-creation': { title: 'Thread creation and lifecycle', Component: ThreadCreationIllustration },
  'thread-local': { title: 'ThreadLocal and memory leaks', Component: ThreadLocalIllustration },
  'thread-methods': { title: 'Thread methods: sleep, join, yield, interrupt', Component: ThreadMethodsIllustration },
  'virtual-threads': { title: 'Virtual threads (Project Loom)', Component: VirtualThreadsIllustration },
  'wildcards': { title: 'Wildcards: ?, extends, super', Component: WildcardsIllustration },
};

export function getJavaDiagram(id: string): JavaDiagramEntry | undefined {
  return javaDiagrams[id];
}
