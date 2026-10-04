import type { Topic } from '../../types/content.ts';

/** Interval problems: sort by start, then sweep and merge. */
export const intervalsTopic: Topic = {
  slug: 'interval-problems',
  title: 'Interval Problems',
  category: 'concepts',
  order: 10,
  summary: 'Sort by start, sweep once, merge overlaps: merging, inserting, and scheduling intervals in O(n log n).',
  level: 'intermediate',
  prerequisites: ['comparable-vs-comparator', 'dynamic-array'],
  sections: [
    {
      heading: 'Sort first, think later',
      body: 'Nearly every interval problem starts the same way: **sort by start time**. Sorted intervals turn chaos into a single left-to-right sweep where only the *previous* merged interval matters.\n\nMerging: walk the sorted list, extending the current `[start, end]` while the next start ≤ end; otherwise close it and start fresh. Insert Interval is the same sweep with one newcomer spliced in.',
    },
    {
      heading: 'The sweep-line mindset',
      body: 'Treat starts as +1 and ends as −1 events on a timeline: sweep in order, track concurrent count, and answer "how many overlap?" or "is the room free?". Meeting Rooms II counts maximum overlap; Non-overlapping Intervals greedily keeps earliest finishers.\n\nHalf-open vs closed ends decide ties: `[1,2]` and `[2,3]` overlap if closed, touch if half-open — read the statement, then encode ends consistently.',
    },
    {
      heading: 'Representing intervals in Java',
      body: 'Use `int[][]` for LeetCode signatures, records (`record Span(int start, int end)`) for readable code. Sort with `Arrays.sort(spans, Comparator.comparingInt(s -> s[0]))`, and mind the overflow trap: compare with `Integer.compare`, never subtraction.\n\nMerge into a `List<int[]>` and finish with `toArray(new int[0][])` — the standard shape interviewers expect back.',
    },
  ],
  complexity: [
    { operation: 'Sort by start', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    { operation: 'Merge / insert sweep', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    { operation: 'Overlap counting', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
  ],
  javaCode: [
    {
      title: 'Merge intervals from scratch',
      description: 'Sort by start, extend-or-close sweep.',
      code: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

public class MergeIntervals {
    static int[][] merge(int[][] spans) {
        Arrays.sort(spans, Comparator.comparingInt(s -> s[0]));
        List<int[]> out = new ArrayList<>();
        for (int[] s : spans) {
            if (out.isEmpty() || s[0] > out.get(out.size() - 1)[1]) {
                out.add(new int[]{s[0], s[1]});
            } else {
                int[] last = out.get(out.size() - 1);
                last[1] = Math.max(last[1], s[1]);
            }
        }
        return out.toArray(new int[0][]);
    }

    public static void main(String[] args) {
        int[][] spans = {{1, 3}, {2, 6}, {8, 10}, {15, 18}};
        System.out.println(Arrays.deepToString(merge(spans)));
        // [[1, 6], [8, 10], [15, 18]]
    }
}
`,
    },
    {
      title: 'Insert interval variant',
      description: 'Same sweep with one newcomer merged in flight.',
      code: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class InsertInterval {
    static int[][] insert(int[][] spans, int[] added) {
        List<int[]> out = new ArrayList<>();
        int i = 0;
        while (i < spans.length && spans[i][1] < added[0]) {
            out.add(spans[i++]); // entirely before
        }
        while (i < spans.length && spans[i][0] <= added[1]) {
            added[0] = Math.min(added[0], spans[i][0]); // absorb overlap
            added[1] = Math.max(added[1], spans[i][1]);
            i++;
        }
        out.add(added);
        while (i < spans.length) {
            out.add(spans[i++]); // entirely after
        }
        return out.toArray(new int[0][]);
    }

    public static void main(String[] args) {
        int[][] spans = {{1, 3}, {6, 9}};
        System.out.println(Arrays.deepToString(insert(spans, new int[]{2, 5})));
        // [[1, 5], [6, 9]]
    }
}
`,
    },
  ],
  mistakes: [
    'Skipping the sort: unsorted intervals break every sweep — sort by start first, always.',
    'Merging on < instead of ≤: touching intervals ([1,2],[2,3]) merge under closed semantics — match the statement.',
    'Mutating input rows: write merged output into fresh arrays, or callers see corrupted spans.',
    'Subtracting in comparators: s[0] - t[0] overflows — use Integer.compare / comparingInt.',
    'Forgetting the trailing interval: the last open merge must be flushed after the loop.',
  ],
  problemIds: ['merge-intervals', 'insert-interval', 'non-overlapping-intervals'],
};
