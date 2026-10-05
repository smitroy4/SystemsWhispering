import { Link } from 'react-router-dom';
import Legend from '../Legend.tsx';

/** Clickable node in the framework map. `to` is a data-structures topic slug. */
interface MapNode {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  w?: number;
  kind: 'iface' | 'class' | 'legacy';
  to?: string;
}

const NODE_H = 40;

const NODES: MapNode[] = [
  { id: 'iterable', label: 'Iterable', x: 430, y: 28, w: 160, kind: 'iface' },
  { id: 'collection', label: 'Collection', x: 240, y: 108, w: 150, kind: 'iface' },
  { id: 'iterator', label: 'Iterator', sub: 'cursors', x: 560, y: 108, w: 140, kind: 'iface', to: 'iterable-iterator' },
  { id: 'map', label: 'Map', sub: 'not a Collection', x: 810, y: 108, w: 140, kind: 'iface' },
  { id: 'list', label: 'List', x: 110, y: 188, w: 110, kind: 'iface' },
  { id: 'set', label: 'Set', x: 300, y: 188, w: 110, kind: 'iface' },
  { id: 'queue', label: 'Queue / Deque', x: 490, y: 188, w: 140, kind: 'iface' },
  { id: 'arraylist', label: 'ArrayList', x: 110, y: 268, kind: 'class', to: 'arraylist-jcf' },
  { id: 'linkedlist', label: 'LinkedList', x: 110, y: 324, kind: 'class', to: 'linkedlist-jcf' },
  { id: 'vector', label: 'Vector', sub: 'legacy', x: 110, y: 380, kind: 'legacy', to: 'vector-stack-legacy' },
  { id: 'stack', label: 'Stack', sub: 'legacy', x: 110, y: 436, kind: 'legacy', to: 'vector-stack-legacy' },
  { id: 'hashset', label: 'HashSet', x: 300, y: 268, kind: 'class', to: 'hashset-jcf' },
  { id: 'linkedhashset', label: 'LinkedHashSet', x: 300, y: 324, kind: 'class', to: 'linkedhashset' },
  { id: 'treeset', label: 'TreeSet', x: 300, y: 380, kind: 'class', to: 'treeset-navigableset' },
  { id: 'enumset', label: 'EnumSet', x: 300, y: 436, kind: 'class', to: 'enummap-enumset' },
  { id: 'arraydeque', label: 'ArrayDeque', x: 490, y: 268, kind: 'class', to: 'arraydeque-jcf' },
  { id: 'priorityqueue', label: 'PriorityQueue', x: 490, y: 324, kind: 'class', to: 'priorityqueue-jcf' },
  { id: 'hashmap', label: 'HashMap', x: 810, y: 188, kind: 'class', to: 'hashmap-internals' },
  { id: 'linkedhashmap', label: 'LinkedHashMap', x: 810, y: 244, kind: 'class', to: 'linkedhashmap-lru' },
  { id: 'treemap', label: 'TreeMap', x: 810, y: 300, kind: 'class', to: 'treemap-navigablemap' },
  { id: 'enummap', label: 'EnumMap', x: 810, y: 356, kind: 'class', to: 'enummap-enumset' },
  { id: 'identityhashmap', label: 'IdentityHashMap', x: 810, y: 412, kind: 'class', to: 'identityhashmap-weakhashmap' },
  { id: 'weakhashmap', label: 'WeakHashMap', x: 810, y: 468, kind: 'class', to: 'identityhashmap-weakhashmap' },
];

const EDGES: Array<[string, string, boolean]> = [
  ['iterable', 'collection', false],
  ['iterable', 'iterator', true],
  ['collection', 'list', false],
  ['collection', 'set', false],
  ['collection', 'queue', false],
  ['list', 'arraylist', false],
  ['list', 'linkedlist', false],
  ['list', 'vector', false],
  ['list', 'stack', false],
  ['set', 'hashset', false],
  ['set', 'linkedhashset', false],
  ['set', 'treeset', false],
  ['set', 'enumset', false],
  ['queue', 'arraydeque', false],
  ['queue', 'priorityqueue', false],
  ['map', 'hashmap', false],
  ['map', 'linkedhashmap', false],
  ['map', 'treemap', false],
  ['map', 'enummap', false],
  ['map', 'identityhashmap', false],
  ['map', 'weakhashmap', false],
];

const ALSO_IN_GROUP: Array<[string, string]> = [
  ['collections-utility', 'Collections utility'],
  ['arrays-utility', 'Arrays utility'],
  ['immutable-collections', 'Immutable factories'],
  ['streams-with-collections', 'Streams'],
  ['fail-fast-fail-safe', 'Fail-fast vs fail-safe'],
];

/** Interactive hierarchy: every class box links its topic page. */
export default function FrameworkMapViz() {
  const byId = new Map(NODES.map((n) => [n.id, n]));
  const boxW = (n: MapNode) => n.w ?? 150;

  return (
    <>
      <svg
        className="viz-svg"
        viewBox="0 0 980 528"
        role="img"
        aria-label="Java Collections Framework hierarchy, clickable to each topic"
      >
        {EDGES.map(([from, to, dashed]) => {
          const a = byId.get(from);
          const b = byId.get(to);
          if (!a || !b) return null;
          const x1 = a.x;
          const y1 = a.y + NODE_H / 2;
          const x2 = b.x;
          const y2 = b.y - NODE_H / 2;
          return (
            <line
              key={`${from}-${to}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              className="viz-map-edge"
              strokeDasharray={dashed ? '6 4' : undefined}
            />
          );
        })}
        {NODES.map((node) => {
          const w = boxW(node);
          const box = (
            <g className={`viz-anim viz-map-box viz-map-box--${node.kind}`}>
              <rect x={node.x - w / 2} y={node.y - NODE_H / 2} width={w} height={NODE_H} rx={9} />
              <text x={node.x} y={node.y + (node.sub ? -1 : 5)} textAnchor="middle" className="viz-map-label">
                {node.label}
              </text>
              {node.sub ? (
                <text x={node.x} y={node.y + 14} textAnchor="middle" className="viz-map-sub">
                  {node.sub}
                </text>
              ) : null}
            </g>
          );
          return node.to ? (
            <Link key={node.id} to={`/data-structures/${node.to}`} aria-label={`${node.label} topic`}>
              {box}
            </Link>
          ) : (
            <g key={node.id}>{box}</g>
          );
        })}
      </svg>
      <p className="viz-statusline">
        Also in this group:{' '}
        {ALSO_IN_GROUP.map(([slug, label], i) => (
          <span key={slug}>
            {i > 0 ? ' · ' : null}
            <Link to={`/data-structures/${slug}`}>{label}</Link>
          </span>
        ))}
        {' · '}
        <Link to="/data-structures/concurrent-overview">Thread-safe? See Concurrent →</Link>
      </p>
      <Legend />
    </>
  );
}
