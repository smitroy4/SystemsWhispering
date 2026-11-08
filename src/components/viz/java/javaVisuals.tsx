/**
 * Topic visual registry for Java topic pages.
 *
 * Maps each topic slug -> an array of JavaVisualSpec[]. Each spec renders one
 * visual inline, right after the section it explains (see JavaTopicPage.tsx).
 *
 * Registry shape: Record<slug, JavaVisualSpec[]>. Every one of the 55 Java
 * topics must resolve here to a rendered component — nothing falls back to the
 * old shared 'stack-vs-heap'.
 */

import type { JavaVisualSpec } from './VisualBlock.tsx';

import { visuals as platformExecutionVisuals } from './viz-java-platform-and-execution.tsx';
import { visuals as variablesVisuals } from './viz-variables-and-data-types.tsx';
import { visuals as numberRepresentationVisuals } from './viz-number-representation.tsx';
import { visuals as typeConversionVisuals } from './viz-type-conversion-and-casting.tsx';
import { visuals as operatorsVisuals } from './viz-operators.tsx';
import { visuals as conditionalVisuals } from './viz-conditional-statements.tsx';
import { visuals as loopsVisuals } from './viz-loops-and-jump-statements.tsx';
import { visuals as arraysVisuals } from './viz-arrays-and-memory.tsx';
import { visuals as methodsVisuals } from './viz-methods-recursion-overloading.tsx';
import { visuals as classesObjectsVisuals } from './viz-classes-and-objects.tsx';
import { visuals as constructorsVisuals } from './viz-constructors.tsx';
import { visuals as objectMemoryVisuals } from './viz-object-memory-and-copy-semantics.tsx';
import { visuals as staticFinalVisuals } from './viz-static-and-final.tsx';
import { visuals as encapsulationVisuals } from './viz-encapsulation-inheritance-packages.tsx';
import { visuals as abstractionVisuals } from './viz-abstraction-and-polymorphism.tsx';
import { visuals as autoboxingVisuals } from './viz-autoboxing-pojos-and-public-classes.tsx';
import { visuals as nestedClassesVisuals } from './viz-nested-classes.tsx';
import { visuals as ioStreamsVisuals } from './viz-io-streams-scanner-vs-bufferedreader.tsx';
import { visuals as immutableClassesVisuals } from './viz-immutable-classes.tsx';
import { visuals as objectClassContractVisuals } from './viz-object-class-contract.tsx';
import { visuals as enumsVisuals } from './viz-enums.tsx';
import { visuals as interfacesVisuals } from './viz-interfaces-deep-dive.tsx';
import { visuals as stringsPoolVisuals } from './viz-strings-and-the-string-pool.tsx';
import { visuals as stringMethodsVisuals } from './viz-string-methods-and-builders.tsx';
import { visuals as genericsVisuals } from './viz-generics.tsx';
import { visuals as wildcardsVisuals } from './viz-wildcards.tsx';
import { visuals as collectionFrameworkVisuals } from './viz-collection-framework.tsx';
import { visuals as iterableIteratorVisuals } from './viz-iterable-and-iterator.tsx';
import { visuals as collectionInterfaceVisuals } from './viz-collection-interface.tsx';
import { visuals as listImplementationsVisuals } from './viz-list-implementations.tsx';
import { visuals as mapSetInternalsVisuals } from './viz-map-and-set-internals.tsx';
import { visuals as specializedMapsVisuals } from './viz-specialized-maps.tsx';
import { visuals as queuePriorityQueueVisuals } from './viz-queue-and-priorityqueue.tsx';
import { visuals as comparableCollectionsVisuals } from './viz-comparable-and-collections.tsx';
import { visuals as lambdasVisuals } from './viz-lambdas-and-functional-interfaces.tsx';
import { visuals as methodReferencesVisuals } from './viz-method-references-and-composition.tsx';
import { visuals as streamsCreationVisuals } from './viz-streams-creation-and-architecture.tsx';
import { visuals as streamOperationsVisuals } from './viz-stream-operations.tsx';
import { visuals as optionalVisuals } from './viz-optional.tsx';
import { visuals as parallelStreamsVisuals } from './viz-parallel-streams.tsx';
import { visuals as exceptionHandlingVisuals } from './viz-exception-handling-basics.tsx';
import { visuals as exceptionHierarchyVisuals } from './viz-exception-hierarchy-and-custom-exceptions.tsx';
import { visuals as jvmMemoryAreasVisuals } from './viz-jvm-memory-areas.tsx';
import { visuals as heapGcVisuals } from './viz-heap-and-garbage-collection.tsx';
import { visuals as processesThreadsVisuals } from './viz-processes-vs-threads.tsx';
import { visuals as threadCreationVisuals } from './viz-thread-creation-and-lifecycle.tsx';
import { visuals as threadMethodsVisuals } from './viz-thread-methods.tsx';
import { visuals as concurrencyProblemsVisuals } from './viz-concurrency-problems.tsx';
import { visuals as synchronizedMonitorLockVisuals } from './viz-synchronized-and-monitor-locks.tsx';
import { visuals as interThreadCommunicationVisuals } from './viz-inter-thread-communication.tsx';
import { visuals as explicitLocksVisuals } from './viz-explicit-locks.tsx';
import { visuals as atomicsCasVisuals } from './viz-atomics-and-cas.tsx';
import { visuals as casRetryAbaVisuals } from './viz-cas-retry-and-aba.tsx';
import { visuals as executorFrameworkVisuals } from './viz-executor-framework.tsx';
import { visuals as completableFutureVisuals } from './viz-completablefuture-forkjoin-threadlocal-and-virtual-threads.tsx';

export interface TopicVisuals {
  [slug: string]: JavaVisualSpec[];
}

export const topicVisuals: TopicVisuals = {
  // ---- Module 1: Fundamentals ----
  'java-platform-and-execution': platformExecutionVisuals,
  'variables-and-data-types': variablesVisuals,
  'number-representation': numberRepresentationVisuals,
  'type-conversion-and-casting': typeConversionVisuals,
  operators: operatorsVisuals,
  'conditional-statements': conditionalVisuals,
  'loops-and-jump-statements': loopsVisuals,
  'arrays-and-memory': arraysVisuals,
  'methods-recursion-overloading': methodsVisuals,

  // ---- Module 2: Object Orientation ----
  'classes-and-objects': classesObjectsVisuals,
  constructors: constructorsVisuals,
  'object-memory-and-copy-semantics': objectMemoryVisuals,
  'static-and-final': staticFinalVisuals,
  'encapsulation-inheritance-packages': encapsulationVisuals,
  'abstraction-and-polymorphism': abstractionVisuals,
  'autoboxing-pojos-and-public-classes': autoboxingVisuals,
  'nested-classes': nestedClassesVisuals,
  'collection-framework': collectionFrameworkVisuals,
  'io-streams-scanner-vs-bufferedreader': ioStreamsVisuals,
  'immutable-classes': immutableClassesVisuals,
  'object-class-contract': objectClassContractVisuals,
  enums: enumsVisuals,
  'interfaces-deep-dive': interfacesVisuals,
  'strings-and-the-string-pool': stringsPoolVisuals,
  'string-methods-and-builders': stringMethodsVisuals,
  generics: genericsVisuals,
  wildcards: wildcardsVisuals,

  // ---- Module 3: Collections and Streams ----
  'iterable-and-iterator': iterableIteratorVisuals,
  'collection-interface': collectionInterfaceVisuals,
  'list-implementations': listImplementationsVisuals,
  'map-and-set-internals': mapSetInternalsVisuals,
  'specialized-maps': specializedMapsVisuals,
  'queue-and-priorityqueue': queuePriorityQueueVisuals,
  'comparable-and-collections': comparableCollectionsVisuals,
  'lambdas-and-functional-interfaces': lambdasVisuals,
  'method-references-and-composition': methodReferencesVisuals,
  'streams-creation-and-architecture': streamsCreationVisuals,
  'stream-operations': streamOperationsVisuals,
  optional: optionalVisuals,
  'parallel-streams': parallelStreamsVisuals,

  // ---- Module 4: Exceptions and Memory ----
  'exception-handling-basics': exceptionHandlingVisuals,
  'exception-hierarchy-and-custom-exceptions': exceptionHierarchyVisuals,
  'jvm-memory-areas': jvmMemoryAreasVisuals,
  'heap-and-garbage-collection': heapGcVisuals,

  // ---- Module 5: Multithreading ----
  'processes-vs-threads': processesThreadsVisuals,
  'thread-creation-and-lifecycle': threadCreationVisuals,
  'thread-methods': threadMethodsVisuals,
  'concurrency-problems': concurrencyProblemsVisuals,
  'synchronized-and-monitor-locks': synchronizedMonitorLockVisuals,
  'inter-thread-communication': interThreadCommunicationVisuals,
  'explicit-locks': explicitLocksVisuals,
  'atomics-and-cas': atomicsCasVisuals,
  'cas-retry-and-aba': casRetryAbaVisuals,
  'executor-framework': executorFrameworkVisuals,
  'completablefuture-forkjoin-threadlocal-and-virtual-threads': completableFutureVisuals,
};

export function getTopicVisuals(slug: string): JavaVisualSpec[] {
  return topicVisuals[slug] ?? [];
}

export function hasTopicVisuals(slug: string): boolean {
  return slug in topicVisuals;
}
