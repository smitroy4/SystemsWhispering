/**
 * collection-framework — 3 visuals.
 * 1. Clickable collection framework hierarchy (top, links to each topic).
 * 2. Collection hierarchy tree (static).
 * 3. Which collection should I use decision chart (static).
 */
import { JBox, JArrow, JNote } from './javaPrimitives.tsx';
import { useNavigate } from 'react-router-dom';
import type { JavaVisualSpec } from './VisualBlock.tsx';

/* ---------------- Visual 1: clickable collection framework hierarchy (top) ---------------- */

function ClickableHierarchy() {
  const navigate = useNavigate();
  const goTo = (topic: string) => () => navigate(`/java/collections-and-streams/${topic}`);
  return (
    <svg className="viz-svg" viewBox="0 0 620 300" role="img" aria-label="Java Collections Framework hierarchy, clickable to each topic">
      <JBox x={40} y={20} w={540} h={44} title="Collection framework — click any topic to open its page" />
      <JBox x={40} y={80} w={150} title="Iterable" rows={['iterator()']} />
      <JBox x={210} y={80} w={170} title="Collection" rows={['add, remove, contains']} tone="good" onClick={goTo('collection-interface')} />
      <JBox x={40} y={150} w={150} title="List" rows={['ordered, duplicates']} onClick={goTo('list-implementations')} />
      <JBox x={210} y={150} w={150} title="Set" rows={['no duplicates']} onClick={goTo('map-and-set-internals')} />
      <JBox x={380} y={150} w={150} title="Queue/Deque" rows={['offer, poll, peek']} onClick={goTo('queue-and-priorityqueue')} />
      <JBox x={420} y={80} w={160} title="Map" rows={['put, get, keySet', 'NOT a Collection']} onClick={goTo('map-and-set-internals')} />
      <JBox x={210} y={230} w={150} title="Specialized maps" rows={['EnumMap, IdentityHashMap', 'WeakHashMap, ConcurrentHashMap']} onClick={goTo('specialized-maps')} />
      <JArrow x1={190} y1={108} x2={210} y2={108} />
      <JArrow x1={115} y1={180} x2={40} y2={180} />
      <JArrow x1={115} y1={180} x2={210} y2={180} />
      <JArrow x1={115} y1={180} x2={380} y2={180} />
      <JArrow x1={385} y1={180} x2={385} y2={230} />
      <JNote x={40} y={280}>{'Click a box to open that topic. Map sits outside the Collection hierarchy.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 2: collection hierarchy tree ---------------- */

function Hierarchy() {
  return (
    <svg className="viz-svg" viewBox="0 0 620 320" role="img" aria-label="Java Collections Framework hierarchy">
      <JBox x={40} y={20} w={540} h={44} title="Collection hierarchy — Iterable → Collection → List / Set / Queue; Map is separate" />
      <JBox x={40} y={80} w={170} title="Iterable" rows={['iterator()']} />
      <JBox x={230} y={80} w={170} title="Collection" rows={['add, remove, contains']} tone="good" />
      <JBox x={40} y={160} w={160} title="List" rows={['ordered, duplicates']} tone="good" />
      <JBox x={220} y={160} w={160} title="Set" rows={['no duplicates']} />
      <JBox x={400} y={160} w={160} title="Queue/Deque" rows={['offer, poll, peek']} />
      <JBox x={420} y={80} w={160} title="Map" rows={['put, get, keySet', 'NOT a Collection']} />
      <JArrow x1={210} y1={108} x2={230} y2={108} />
      <JArrow x1={120} y1={190} x2={40} y2={190} />
      <JArrow x1={120} y1={190} x2={220} y2={190} />
      <JArrow x1={120} y1={190} x2={400} y2={190} />
      <JNote x={40} y={270}>{'Program to the interface. Map is separate — it does not extend Collection.'}</JNote>
    </svg>
  );
}

/* ---------------- Visual 3: which collection should I use ---------------- */

function Decision() {
  return (
    <svg className="viz-svg" viewBox="0 0 560 260" role="img" aria-label="Which collection should I use decision chart">
      <JBox x={40} y={20} w={480} h={44} title="Pick a collection by how you access and modify elements" />
      <JBox x={40} y={80} w={160} title="Need duplicates?" rows={['yes → List']} />
      <JBox x={220} y={80} w={160} title="Unique elements?" rows={['yes → Set']} />
      <JBox x={400} y={80} w={120} title="FIFO order?" rows={['yes → Queue']} />
      <JBox x={40} y={160} w={160} title="Key → value lookup?" rows={['yes → Map']} />
      <JBox x={220} y={160} w={160} title="Sorted order?" rows={['yes → TreeSet/TreeMap']} />
      <JNote x={40} y={230}>{'ArrayList is the default List; HashMap the default Map; HashSet the default Set.'}</JNote>
    </svg>
  );
}

export const visuals: JavaVisualSpec[] = [
  {
    title: 'Collection framework — click to topic',
    caption: 'Hierarchy where each box links to its topic page.',
    notice: 'Click Iterable / Collection / List / Set / Queue / Map / Specialized maps to jump to that topic.',
    component: ClickableHierarchy,
  },
  {
    title: 'Collection hierarchy tree',
    caption: 'Iterable → Collection → List / Set / Queue; Map is separate.',
    notice: 'Map sits outside the Collection hierarchy.',
    component: Hierarchy,
  },
  {
    title: 'Which collection should I use',
    caption: 'Decision chart by access pattern and constraints.',
    notice: 'ArrayList / HashMap / HashSet are the sensible defaults.',
    component: Decision,
  },
];
