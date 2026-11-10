import type { Topic } from '../../types/content.ts';

/** Graph in Python using adjacency list (dict of lists). */
export const pythonGraphTopic: Topic = {
  slug: 'python-graph',
  title: 'Graph (Adjacency List)',
  category: 'data-structures',
  order: 108,
  summary: 'A network of vertices and edges — represented in Python as a dict mapping each vertex to its neighbors. BFS and DFS are the core traversals.',
  section: 'core',
  level: 'intermediate',
  group: 'python',
  prerequisites: ['python-queue'],
  sections: [
    {
      heading: 'What is a graph?',
      body: 'A **graph** is a set of **vertices** (nodes) and **edges** (connections). Edges can be directed or undirected, weighted or unweighted.\n\nIn Python, the most common representation is an **adjacency list**: a `dict` where each key is a vertex and each value is a list of neighboring vertices.\n\n- **Adjacency list**: O(V + E) space, fast to iterate neighbors — best for sparse graphs.\n- **Adjacency matrix**: O(V²) space, O(1) edge check — best for dense graphs.',
    },
    {
      heading: 'Traversals',
      body: '- **BFS** (breadth-first): explore level by level using a queue. Finds shortest paths in unweighted graphs.\n- **DFS** (depth-first): explore as deep as possible using recursion or a stack. Good for cycle detection and path existence.',
    },
    {
      heading: 'Complexity',
      body: 'Both BFS and DFS visit every vertex and edge once: **O(V + E)** time, **O(V)** space for the visited set and queue/stack.',
    },
  ],
  complexity: [
    { operation: 'Add vertex', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'Add edge', best: 'O(1)', average: 'O(1)', worst: 'O(1)', space: 'O(1)' },
    { operation: 'BFS / DFS traversal', best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' },
    { operation: 'Check edge exists', best: 'O(degree)', average: 'O(degree)', worst: 'O(V)', space: 'O(1)' },
  ],
  pythonCode: [
    {
      title: 'Graph with BFS and DFS',
      description: 'Adjacency list using dict, with BFS and DFS traversals.',
      code: `from collections import deque


class Graph:
    def __init__(self):
        # Adjacency list: vertex -> list of neighbors
        self._adj = {}

    def add_vertex(self, v):
        # O(1)
        if v not in self._adj:
            self._adj[v] = []

    def add_edge(self, u, v, undirected=True):
        # O(1)
        self.add_vertex(u)
        self.add_vertex(v)
        self._adj[u].append(v)
        if undirected:
            self._adj[v].append(u)

    def neighbors(self, v):
        # O(degree of v)
        return self._adj.get(v, [])

    def bfs(self, start):
        # O(V + E): level-by-level with a queue
        visited = set()
        q = deque([start])
        visited.add(start)
        order = []
        while q:
            node = q.popleft()
            order.append(node)
            for nb in self._adj[node]:
                if nb not in visited:
                    visited.add(nb)
                    q.append(nb)
        return order

    def dfs(self, start):
        # O(V + E): depth-first with a stack
        visited = set()
        stack = [start]
        order = []
        while stack:
            node = stack.pop()
            if node not in visited:
                visited.add(node)
                order.append(node)
                # Push neighbors in reverse so they visit in order
                for nb in reversed(self._adj[node]):
                    if nb not in visited:
                        stack.append(nb)
        return order


# Demo: undirected graph
g = Graph()
g.add_edge('A', 'B')
g.add_edge('A', 'C')
g.add_edge('B', 'D')
g.add_edge('C', 'D')
g.add_edge('D', 'E')

print('BFS from A:', g.bfs('A'))  # ['A', 'B', 'C', 'D', 'E']
print('DFS from A:', g.dfs('A'))  # ['A', 'C', 'D', 'E', 'B'] (order varies)
`,
    },
  ],
  mistakes: [
    "Forgetting to track visited nodes — BFS/DFS loops forever on cyclic graphs.",
    "Using a list as a queue for BFS (`pop(0)`) — O(n) per dequeue. Use `collections.deque`.",
    "Adding edges only one way in an undirected graph — add both directions.",
    "Assuming DFS recursion won't overflow — deep graphs can exceed Python's recursion limit; use an explicit stack.",
  ],
  vizId: 'graph-representations',
  problemIds: ['number-of-islands', 'clone-graph', 'course-schedule'],
};
