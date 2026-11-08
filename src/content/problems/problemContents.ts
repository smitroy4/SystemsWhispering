import type { ProblemContent } from '../../types/content.ts';

/** Auto-generated problem content from content/problems/problems.md (NeetCode 150 + companions). */
export const problemContents: ProblemContent[] = [
  {
    slug: 'contains-duplicate',
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    description: 'Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.',
    examples: [
    {
      input: 'nums = [1,2,3,4]',
      output: 'false',
      explanation: ''
    }
  ],
    constraints: '`1 <= nums.length <= 10^5` - `-10^9 <= nums[i] <= 10^9`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Compare every pair. If any two are equal, a duplicate exists.',
      algorithm: ['1. For each `i` from `0` to `n-1`.','2. For each `j` from `i+1` to `n-1`.','3. If `nums[i] == nums[j]`, return `true`.','4. Return `false`.'],
      code: "class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        for (int i = 0; i < nums.length; i++) {\n            for (int j = i + 1; j < nums.length; j++) {\n                if (nums[i] == nums[j]) {\n                    return true;\n                }\n            }\n        }\n        return false;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(1)' }
    },
    {
      label: 'Better',
      intuition: 'After sorting, any duplicate values sit next to each other, so one linear scan of neighbours is enough.',
      algorithm: ['1. Sort `nums`.','2. For each `i` from `1` to `n-1`, if `nums[i] == nums[i-1]`, return `true`.','3. Return `false`.'],
      code: "import java.util.Arrays;\n\nclass Solution {\n    public boolean containsDuplicate(int[] nums) {\n        Arrays.sort(nums);\n        for (int i = 1; i < nums.length; i++) {\n            if (nums[i] == nums[i - 1]) {\n                return true;\n            }\n        }\n        return false;\n    }\n}",
      complexity: { time: 'O(n \\log n)', space: 'O(1)' }
    },
    {
      label: 'Optimised',
      intuition: 'Put everything in a set. If the set ends up smaller than the array, some value was inserted twice.',
      algorithm: ['1. Add every element to a `HashSet`.','2. Compare `set.size()` with `nums.length`. If smaller, return `true`.'],
      code: "import java.util.HashSet;\nimport java.util.Set;\n\nclass Solution {\n    public boolean containsDuplicate(int[] nums) {\n        Set<Integer> set = new HashSet<>();\n        for (int x : nums) {\n            set.add(x);\n        }\n        return set.size() != nums.length;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Best',
      intuition: '`Set.add` returns `false` when the element is already present. So the duplicate can be detected during insertion, and we can stop immediately.',
      algorithm: ['1. For each `x` in `nums`, if `seen.add(x)` returns `false`, return `true`.','2. Return `false`.'],
      code: "import java.util.HashSet;\nimport java.util.Set;\n\nclass Solution {\n    public boolean containsDuplicate(int[] nums) {\n        Set<Integer> seen = new HashSet<>();\n        for (int x : nums) {\n            if (!seen.add(x)) {\n                return true;\n            }\n        }\n        return false;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'valid-anagram',
    title: 'Valid Anagram',
    difficulty: 'Easy',
    description: 'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise. An anagram is a word formed by rearranging the letters of another word, using every letter exactly once.',
    examples: [
    {
      input: 's = "rat"',
      output: 'false',
      explanation: 't'
    }
  ],
    constraints: '`1 <= s.length, t.length <= 5 * 10^4` - `s` and `t` consist of lowercase English letters.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Sorting puts both strings\' characters into a canonical order. Anagrams become identical after sorting.',
      algorithm: ['1. If lengths differ, return `false`.','2. Convert both strings to char arrays and sort them.','3. Return `Arrays.equals` on the two sorted arrays.'],
      code: "import java.util.Arrays;\n\nclass Solution {\n    public boolean isAnagram(String s, String t) {\n        if (s.length() != t.length()) {\n            return false;\n        }\n        char[] a = s.toCharArray();\n        char[] b = t.toCharArray();\n        Arrays.sort(a);\n        Arrays.sort(b);\n        return Arrays.equals(a, b);\n    }\n}",
      complexity: { time: 'O(n \\log n)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: 'Count each character in `s`, then subtract for each character in `t`. Anagrams end with all counts at zero. This works for any character set, not just lowercase letters.',
      algorithm: ['1. If lengths differ, return `false`.','2. For each character in `s`, increment its count in a `HashMap`.','3. For each character in `t`, decrement its count. If the count is missing or would go below zero, return `false`.','4. Return `true`.'],
      code: "import java.util.HashMap;\nimport java.util.Map;\n\nclass Solution {\n    public boolean isAnagram(String s, String t) {\n        if (s.length() != t.length()) {\n            return false;\n        }\n        Map<Character, Integer> counts = new HashMap<>();\n        for (char c : s.toCharArray()) {\n            counts.merge(c, 1, Integer::sum);\n        }\n        for (char c : t.toCharArray()) {\n            int remaining = counts.getOrDefault(c, 0) - 1;\n            if (remaining < 0) {\n                return false;\n            }\n            counts.put(c, remaining);\n        }\n        return true;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(k)' }
    },
    {
      label: 'Optimised',
      intuition: 'With only 26 lowercase letters, a plain `int[26]` replaces the hash map. Array indexing is faster than hashing and avoids boxing.',
      algorithm: ['1. If lengths differ, return `false`.','2. Count each letter of `s` into `counts[c - \'a\']`.','3. Subtract each letter of `t`. If any count goes negative, return `false`.','4. Return `true`.'],
      code: "class Solution {\n    public boolean isAnagram(String s, String t) {\n        if (s.length() != t.length()) {\n            return false;\n        }\n        int[] counts = new int[26];\n        for (int i = 0; i < s.length(); i++) {\n            counts[s.charAt(i) - 'a']++;\n        }\n        for (int i = 0; i < t.length(); i++) {\n            if (--counts[t.charAt(i) - 'a'] < 0) {\n                return false;\n            }\n        }\n        return true;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    },
    {
      label: 'Best',
      intuition: 'Since the lengths are equal, if no count ever goes negative, every count must end at zero. So one array can be incremented for `s` and decremented for `t`, and the result is determined by whether all slots are zero at the end.',
      algorithm: ['1. If lengths differ, return `false`.','2. For each index `i`, do `counts[s[i]-\'a\']++` and `counts[t[i]-\'a\']--`.','3. Scan the 26 slots. If any is non-zero, return `false`.','4. Return `true`.'],
      code: "class Solution {\n    public boolean isAnagram(String s, String t) {\n        if (s.length() != t.length()) {\n            return false;\n        }\n        int[] counts = new int[26];\n        for (int i = 0; i < s.length(); i++) {\n            counts[s.charAt(i) - 'a']++;\n            counts[t.charAt(i) - 'a']--;\n        }\n        for (int c : counts) {\n            if (c != 0) {\n                return false;\n            }\n        }\n        return true;\n    }\n}",
      complexity: { time: 'O(n + 26) = O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`. You may assume that each input has **exactly one solution**, and you **may not use the same element twice**. The answer can be returned in any order.',
    examples: [
    {
      input: 'nums = [3,2,4]',
      output: '[1,2]',
      explanation: 'nums[1] + nums[2] = 2 + 4 = 6'
    }
  ],
    constraints: '`2 <= nums.length <= 10^4` - `-10^9 <= nums[i] <= 10^9` - `-10^9 <= target <= 10^9` - Exactly one valid answer exists.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Check every possible pair. There are n(n-1)/2 pairs, so this is exhaustive and needs no extra memory.',
      algorithm: ['1. For each index `i` from `0` to `n-1`.','2. For each index `j` from `i+1` to `n-1`.','3. If `nums[i] + nums[j] == target`, return `{i, j}`.','4. If no pair matches, return an empty array (unreachable under the problem guarantee).'],
      code: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        int n = nums.length;\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                if (nums[i] + nums[j] == target) {\n                    return new int[]{i, j};\n                }\n            }\n        }\n        return new int[]{};\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(1)' }
    },
    {
      label: 'Better',
      intuition: 'On a sorted array, a pair\'s sum moves predictably. If the sum is too small, move the left pointer right to increase it. If too large, move the right pointer left to decrease it. Sorting destroys original positions, so we sort an array of **indices** by their values and report the original indices at the end.',
      algorithm: ['1. Build `idx = [0, 1, ..., n-1]` and sort `idx` by `nums[idx[k]]`.','2. Set `lo = 0`, `hi = n-1`.','3. While `lo < hi`:','- `sum = nums[idx[lo]] + nums[idx[hi]]`.','- If `sum == target`, return `{idx[lo], idx[hi]}`.','- If `sum < target`, increment `lo`. Otherwise decrement `hi`.','4. Return an empty array.'],
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        int n = nums.length;\n        Integer[] idx = new Integer[n];\n        for (int i = 0; i < n; i++) {\n            idx[i] = i;\n        }\n        Arrays.sort(idx, (a, b) -> Integer.compare(nums[a], nums[b]));\n\n        int lo = 0, hi = n - 1;\n        while (lo < hi) {\n            long sum = (long) nums[idx[lo]] + nums[idx[hi]];\n            if (sum == target) {\n                return new int[]{idx[lo], idx[hi]};\n            }\n            if (sum < target) {\n                lo++;\n            } else {\n                hi--;\n            }\n        }\n        return new int[]{};\n    }\n}",
      complexity: { time: 'O(n \\log n)', space: 'O(n)' }
    },
    {
      label: 'Optimised',
      intuition: 'Replace the inner search with a hash lookup. First index every value, then scan again and ask whether each element\'s complement exists at a different index.',
      algorithm: ['1. Pass 1: insert every `nums[i] -> i` into a `HashMap`.','2. Pass 2: for each `i`, compute `complement = target - nums[i]`.','3. If the map contains `complement` and its stored index is not `i`, return `{i, map.get(complement)}`.'],
      code: "import java.util.HashMap;\nimport java.util.Map;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> indexOf = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            indexOf.put(nums[i], i);\n        }\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            Integer j = indexOf.get(complement);\n            if (j != null && j != i) {\n                return new int[]{i, j};\n            }\n        }\n        return new int[]{};\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Best',
      intuition: 'The two-pass version is unnecessary. When processing index `i`, every earlier element is already in the map. So either the complement is among those earlier elements (we have our pair), or we store the current element for future lookups. Checking before inserting also guarantees the same element is never paired with itself.',
      algorithm: ['1. Create an empty map `seen: value -> index`.','2. For each `i` from `0` to `n-1`:','- `complement = target - nums[i]`.','- If `seen` contains `complement`, return `{seen.get(complement), i}`.','- Otherwise, store `seen.put(nums[i], i)`.','3. Return an empty array.'],
      code: "import java.util.HashMap;\nimport java.util.Map;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (seen.containsKey(complement)) {\n                return new int[]{seen.get(complement), i};\n            }\n            seen.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'Medium',
    description: 'Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.',
    examples: [
    {
      input: 'strs = [""]',
      output: '[[""]]',
      explanation: ''
    }
  ],
    constraints: '`1 <= strs.length <= 10^4` - `0 <= strs[i].length <= 100` - `strs[i]` consists of lowercase English letters.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'For each word, compare it against every existing group\'s first word using sorted equality. Add it to the first matching group, or start a new one.',
      algorithm: ['1. Keep a list of groups.','2. For each string `s`, sort its characters into `key`.','3. For each existing group, sort its first string and compare with `key`. If equal, add `s` to that group.','4. If no group matches, create a new group with `s`.'],
      code: "import java.util.ArrayList;\nimport java.util.Arrays;\nimport java.util.List;\n\nclass Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        List<List<String>> groups = new ArrayList<>();\n        for (String s : strs) {\n            String key = sorted(s);\n            boolean placed = false;\n            for (List<String> group : groups) {\n                if (sorted(group.get(0)).equals(key)) {\n                    group.add(s);\n                    placed = true;\n                    break;\n                }\n            }\n            if (!placed) {\n                List<String> fresh = new ArrayList<>();\n                fresh.add(s);\n                groups.add(fresh);\n            }\n        }\n        return groups;\n    }\n\n    private String sorted(String s) {\n        char[] chars = s.toCharArray();\n        Arrays.sort(chars);\n        return new String(chars);\n    }\n}",
      complexity: { time: 'O(n^2 \\cdot k \\log k)', space: 'O(n \\cdot k)' }
    },
    {
      label: 'Better',
      intuition: 'Sorting each word gives a canonical key. Anagrams collide on that key, so a `HashMap` collects each group in one bucket.',
      algorithm: ['1. For each string, compute `key = sorted(s)`.','2. `map.computeIfAbsent(key, ...)` and add `s` to the list.','3. Return the map\'s values.'],
      code: "import java.util.ArrayList;\nimport java.util.Arrays;\nimport java.util.HashMap;\nimport java.util.List;\nimport java.util.Map;\n\nclass Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        Map<String, List<String>> map = new HashMap<>();\n        for (String s : strs) {\n            char[] chars = s.toCharArray();\n            Arrays.sort(chars);\n            map.computeIfAbsent(new String(chars), k -> new ArrayList<>()).add(s);\n        }\n        return new ArrayList<>(map.values());\n    }\n}",
      complexity: { time: 'O(n \\cdot k \\log k)', space: 'O(n \\cdot k)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Sorting costs $O(k \\log k)$ per word, but counting letters costs $O(k)$. A 26-slot count vector identifies the anagram class just as well, so encode it as a string key such as `"a1b0c0...t1..."`. The key does not depend on letter order, so anagrams still collide.',
      algorithm: ['1. For each string, build `int[26] count` by incrementing `count[c - \'a\']`.','2. Build a key by appending each count with a separator, for example `"#1#0#0..."`.','3. Group by key with a `HashMap`.','4. Return the map\'s values.'],
      code: "import java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.List;\nimport java.util.Map;\n\nclass Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        Map<String, List<String>> map = new HashMap<>();\n        for (String s : strs) {\n            int[] count = new int[26];\n            for (char c : s.toCharArray()) {\n                count[c - 'a']++;\n            }\n            StringBuilder key = new StringBuilder();\n            for (int c : count) {\n                key.append('#').append(c);\n            }\n            map.computeIfAbsent(key.toString(), k -> new ArrayList<>()).add(s);\n        }\n        return new ArrayList<>(map.values());\n    }\n}",
      complexity: { time: 'O(n \\cdot (k + 26))', space: 'O(n \\cdot k)' }
    }
  ]
  },
  {
    slug: 'top-k-frequent-elements',
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    description: 'Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.',
    examples: [
    {
      input: 'nums = [1]',
      output: '[1]',
      explanation: ''
    }
  ],
    constraints: '`1 <= nums.length <= 10^5` - `-10^4 <= nums[i] <= 10^4` - `1 <= k <= number of distinct elements in nums` - The answer is unique.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Count every value, sort the entries by frequency descending, and take the first `k`.',
      algorithm: ['1. Build `freq: value -> count`.','2. Copy entries into a list and sort by count, descending.','3. Take the first `k` keys.'],
      code: "import java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.List;\nimport java.util.Map;\n\nclass Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        Map<Integer, Integer> freq = new HashMap<>();\n        for (int x : nums) {\n            freq.merge(x, 1, Integer::sum);\n        }\n        List<Map.Entry<Integer, Integer>> entries = new ArrayList<>(freq.entrySet());\n        entries.sort((a, b) -> b.getValue() - a.getValue());\n        int[] result = new int[k];\n        for (int i = 0; i < k; i++) {\n            result[i] = entries.get(i).getKey();\n        }\n        return result;\n    }\n}",
      complexity: { time: 'O(n + d \\log d)', space: 'O(d)' }
    },
    {
      label: 'Better',
      intuition: 'Keep a min-heap of the `k` most frequent entries seen so far. The root is the least frequent of those `k`. Any new entry more frequent than the root replaces it. The heap never grows beyond `k`.',
      algorithm: ['1. Count frequencies.','2. Push each entry into a min-heap ordered by count.','3. If the heap size exceeds `k`, poll the smallest.','4. The heap now holds the top `k`. Extract their keys.'],
      code: "import java.util.HashMap;\nimport java.util.Map;\nimport java.util.PriorityQueue;\n\nclass Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        Map<Integer, Integer> freq = new HashMap<>();\n        for (int x : nums) {\n            freq.merge(x, 1, Integer::sum);\n        }\n        PriorityQueue<Map.Entry<Integer, Integer>> minHeap =\n            new PriorityQueue<>((a, b) -> a.getValue() - b.getValue());\n        for (Map.Entry<Integer, Integer> e : freq.entrySet()) {\n            minHeap.offer(e);\n            if (minHeap.size() > k) {\n                minHeap.poll();\n            }\n        }\n        int[] result = new int[k];\n        for (int i = 0; i < k; i++) {\n            result[i] = minHeap.poll().getKey();\n        }\n        return result;\n    }\n}",
      complexity: { time: 'O(n + d \\log k)', space: 'O(d + k)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'A value\'s frequency is between 1 and `n`. Create `n+1` buckets, where bucket `f` holds all values with frequency `f`. Walk the buckets from highest frequency downward and collect until you have `k` values. No comparisons are needed.',
      algorithm: ['1. Count frequencies.','2. Create `buckets[0..n]`, each an empty list.','3. For each `(value, f)`, add `value` to `buckets[f]`.','4. Iterate `f` from `n` down to `1`, appending values from each bucket until the result has `k` items.'],
      code: "import java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.List;\nimport java.util.Map;\n\nclass Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        Map<Integer, Integer> freq = new HashMap<>();\n        for (int x : nums) {\n            freq.merge(x, 1, Integer::sum);\n        }\n        int n = nums.length;\n        List<List<Integer>> buckets = new ArrayList<>();\n        for (int i = 0; i <= n; i++) {\n            buckets.add(new ArrayList<>());\n        }\n        for (Map.Entry<Integer, Integer> e : freq.entrySet()) {\n            buckets.get(e.getValue()).add(e.getKey());\n        }\n        int[] result = new int[k];\n        int idx = 0;\n        for (int f = n; f >= 1 && idx < k; f--) {\n            for (int value : buckets.get(f)) {\n                result[idx++] = value;\n                if (idx == k) {\n                    break;\n                }\n            }\n        }\n        return result;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'product-of-array-except-self',
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    description: 'Given an integer array `nums`, return an array `answer` such that `answer[i]` equals the product of all elements of `nums` except `nums[i]`. You must write an algorithm that runs in $O(n)$ time and does **not** use the division operator.',
    examples: [
    {
      input: 'nums = [-1,1,0,-3,3]',
      output: '[0,0,9,0,0]',
      explanation: ''
    }
  ],
    constraints: '`2 <= nums.length <= 10^5` - `-30 <= nums[i] <= 30` - The product of any prefix or suffix fits in a 32-bit integer.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'For each index, multiply every other element.',
      algorithm: ['1. For each `i`, set `prod = 1`.','2. For each `j != i`, multiply `prod` by `nums[j]`.','3. Store `prod` in `answer[i]`.'],
      code: "class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        int n = nums.length;\n        int[] answer = new int[n];\n        for (int i = 0; i < n; i++) {\n            int prod = 1;\n            for (int j = 0; j < n; j++) {\n                if (j != i) {\n                    prod *= nums[j];\n                }\n            }\n            answer[i] = prod;\n        }\n        return answer;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(1)' }
    },
    {
      label: 'Better',
      intuition: '`answer[i] = prefix[i] * suffix[i]`, where `prefix[i]` is the product of `nums[0..i-1]` and `suffix[i]` is the product of `nums[i+1..n-1]`. Build both arrays with one pass each.',
      algorithm: ['1. `prefix[0] = 1`, and `prefix[i] = prefix[i-1] * nums[i-1]`.','2. `suffix[n-1] = 1`, and `suffix[i] = suffix[i+1] * nums[i+1]`.','3. `answer[i] = prefix[i] * suffix[i]`.'],
      code: "class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        int n = nums.length;\n        int[] prefix = new int[n];\n        int[] suffix = new int[n];\n        prefix[0] = 1;\n        for (int i = 1; i < n; i++) {\n            prefix[i] = prefix[i - 1] * nums[i - 1];\n        }\n        suffix[n - 1] = 1;\n        for (int i = n - 2; i >= 0; i--) {\n            suffix[i] = suffix[i + 1] * nums[i + 1];\n        }\n        int[] answer = new int[n];\n        for (int i = 0; i < n; i++) {\n            answer[i] = prefix[i] * suffix[i];\n        }\n        return answer;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'The output array can hold the prefix products. Then a single right-to-left pass with one running variable multiplies in the suffix product, so the separate suffix array is unnecessary.',
      algorithm: ['1. Pass left to right: `answer[i] = product of nums[0..i-1]`, tracked with a running `left`.','2. Pass right to left with a running `right = 1`: `answer[i] *= right`, then `right *= nums[i]`.'],
      code: "class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        int n = nums.length;\n        int[] answer = new int[n];\n        int left = 1;\n        for (int i = 0; i < n; i++) {\n            answer[i] = left;\n            left *= nums[i];\n        }\n        int right = 1;\n        for (int i = n - 1; i >= 0; i--) {\n            answer[i] *= right;\n            right *= nums[i];\n        }\n        return answer;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'valid-sudoku',
    title: 'Valid Sudoku',
    difficulty: 'Medium',
    description: 'Determine if a `9 x 9` Sudoku board is valid. Only the **filled** cells need to be validated, according to the following rules: 1. Each row must contain the digits `1-9` without repetition. 2. Each column must contain the digits `1-9` without repetition. 3. Each of the nine `3 x 3` sub-boxes must contain the digits `1-9` without repetition. The board is not required to be solvable. Empty cells are represented by `\'.\'`.',
    examples: [
    {
      input: 'Same as Example 1, but `board[0][0] = "8"`.',
      output: 'false',
      explanation: ''
    }
  ],
    constraints: '`board.length == 9`, `board[i].length == 9` - `board[i][j]` is a digit `\'1\'`-`\'9\'` or `\'.\'`.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'For each filled cell, scan its row, column, and box for another cell with the same digit.',
      algorithm: ['1. For each cell `(r, c)` with a digit `d`.','2. Scan the other cells in row `r`, column `c`, and the box containing `(r, c)`. If any holds `d`, return `false`.','3. Return `true` after all cells pass.'],
      code: "class Solution {\n    public boolean isValidSudoku(char[][] board) {\n        for (int r = 0; r < 9; r++) {\n            for (int c = 0; c < 9; c++) {\n                char d = board[r][c];\n                if (d == '.') continue;\n                for (int k = 0; k < 9; k++) {\n                    if (k != c && board[r][k] == d) return false;\n                    if (k != r && board[k][c] == d) return false;\n                }\n                int br = (r / 3) * 3, bc = (c / 3) * 3;\n                for (int i = br; i < br + 3; i++) {\n                    for (int j = bc; j < bc + 3; j++) {\n                        if ((i != r || j != c) && board[i][j] == d) return false;\n                    }\n                }\n            }\n        }\n        return true;\n    }\n}",
      complexity: { time: 'O(81 \\cdot 27) = O(1)', space: 'O(1)' }
    },
    {
      label: 'Better',
      intuition: 'Record each placement as a string such as `"5 in row 0"`, `"5 in col 0"`, and `"5 in box 0"`. Any repeated string means a conflict. One set replaces all the scanning.',
      algorithm: ['1. For each filled cell `(r, c)` with digit `d`, build three keys: row, column, and box.','2. Try `seen.add(key)` for each. If it returns `false`, return `false`.','3. Return `true`.'],
      code: "import java.util.HashSet;\nimport java.util.Set;\n\nclass Solution {\n    public boolean isValidSudoku(char[][] board) {\n        Set<String> seen = new HashSet<>();\n        for (int r = 0; r < 9; r++) {\n            for (int c = 0; c < 9; c++) {\n                char d = board[r][c];\n                if (d == '.') continue;\n                int box = (r / 3) * 3 + (c / 3);\n                if (!seen.add(d + \" in row \" + r)) return false;\n                if (!seen.add(d + \" in col \" + c)) return false;\n                if (!seen.add(d + \" in box \" + box)) return false;\n            }\n        }\n        return true;\n    }\n}",
      complexity: { time: 'O(1)', space: 'O(1)' }
    },
    {
      label: 'Optimised',
      intuition: 'Replace string keys with three `boolean[9][9]` tables indexed by `[group][digit]`. Array access is cheaper than string building and hashing.',
      algorithm: ['1. For each filled cell with digit `d` (converted to index `d - \'1\'`):','2. If `rows[r][d]`, `cols[c][d]`, or `boxes[box][d]` is already set, return `false`.','3. Otherwise, set all three to `true`.'],
      code: "class Solution {\n    public boolean isValidSudoku(char[][] board) {\n        boolean[][] rows = new boolean[9][9];\n        boolean[][] cols = new boolean[9][9];\n        boolean[][] boxes = new boolean[9][9];\n        for (int r = 0; r < 9; r++) {\n            for (int c = 0; c < 9; c++) {\n                char ch = board[r][c];\n                if (ch == '.') continue;\n                int d = ch - '1';\n                int box = (r / 3) * 3 + (c / 3);\n                if (rows[r][d] || cols[c][d] || boxes[box][d]) {\n                    return false;\n                }\n                rows[r][d] = cols[c][d] = boxes[box][d] = true;\n            }\n        }\n        return true;\n    }\n}",
      complexity: { time: 'O(1)', space: 'O(1)' }
    },
    {
      label: 'Best',
      intuition: 'Each group needs only 9 bits, one per digit. Store each row, column, and box as a single `int` bitmask. Setting bit `d` marks digit `d` as used, and `(mask >> d) & 1` checks it. This uses the least memory and fewest memory accesses.',
      algorithm: ['1. Keep `int[] rows = new int[9]`, `cols`, and `boxes`.','2. For digit `d` (as `0..8`), let `bit = 1 << d`.','3. If `rows[r] & bit`, `cols[c] & bit`, or `boxes[box] & bit` is set, return `false`.','4. Otherwise OR the bit into all three masks.'],
      code: "class Solution {\n    public boolean isValidSudoku(char[][] board) {\n        int[] rows = new int[9];\n        int[] cols = new int[9];\n        int[] boxes = new int[9];\n        for (int r = 0; r < 9; r++) {\n            for (int c = 0; c < 9; c++) {\n                char ch = board[r][c];\n                if (ch == '.') continue;\n                int bit = 1 << (ch - '1');\n                int box = (r / 3) * 3 + (c / 3);\n                if ((rows[r] & bit) != 0 || (cols[c] & bit) != 0 || (boxes[box] & bit) != 0) {\n                    return false;\n                }\n                rows[r] |= bit;\n                cols[c] |= bit;\n                boxes[box] |= bit;\n            }\n        }\n        return true;\n    }\n}",
      complexity: { time: 'O(1)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'longest-consecutive-sequence',
    title: 'Longest Consecutive Sequence',
    difficulty: 'Medium',
    description: 'Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in $O(n)$ time.',
    examples: [
    {
      input: 'nums = [0,3,7,2,5,8,4,6,0,1]',
      output: '9',
      explanation: ''
    }
  ],
    constraints: '`0 <= nums.length <= 10^5` - `-10^9 <= nums[i] <= 10^9`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'For each number, keep looking for `x+1`, `x+2`, and so on with a linear search. Track the longest run.',
      algorithm: ['1. For each `x` in `nums`, set `len = 1` and `cur = x`.','2. While `cur + 1` exists in `nums` (linear scan), increment `cur` and `len`.','3. Track the maximum `len`.'],
      code: "class Solution {\n    public int longestConsecutive(int[] nums) {\n        int best = 0;\n        for (int x : nums) {\n            int cur = x, len = 1;\n            while (contains(nums, cur + 1)) {\n                cur++;\n                len++;\n            }\n            best = Math.max(best, len);\n        }\n        return best;\n    }\n\n    private boolean contains(int[] nums, int target) {\n        for (int v : nums) {\n            if (v == target) return true;\n        }\n        return false;\n    }\n}",
      complexity: { time: 'O(n^3)', space: 'O(1)' }
    },
    {
      label: 'Better',
      intuition: 'After sorting, a consecutive run is a block of adjacent elements that differ by exactly 1. Duplicates must be skipped. Scan once and track the current run length.',
      algorithm: ['1. If empty, return `0`.','2. Sort `nums`.','3. Scan `i` from `1`. If `nums[i] == nums[i-1]`, skip. If `nums[i] == nums[i-1] + 1`, extend the run. Otherwise, reset the run to `1`.','4. Track the maximum run length.'],
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int longestConsecutive(int[] nums) {\n        if (nums.length == 0) return 0;\n        Arrays.sort(nums);\n        int best = 1, cur = 1;\n        for (int i = 1; i < nums.length; i++) {\n            if (nums[i] == nums[i - 1]) continue;\n            if (nums[i] == nums[i - 1] + 1) {\n                cur++;\n            } else {\n                cur = 1;\n            }\n            best = Math.max(best, cur);\n        }\n        return best;\n    }\n}",
      complexity: { time: 'O(n \\log n)', space: 'O(1)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Put all numbers in a set. Start counting only from `x` where `x - 1` is absent, which guarantees each run is walked exactly once. Every element is touched at most twice (once as a candidate start, once inside a run), so the total work is linear.',
      algorithm: ['1. Insert all numbers into `set`.','2. For each `x` in `set`: if `set` contains `x - 1`, skip it.','3. Otherwise, count `len` by checking `x+1`, `x+2`, ... in the set.','4. Track the maximum length.'],
      code: "import java.util.HashSet;\nimport java.util.Set;\n\nclass Solution {\n    public int longestConsecutive(int[] nums) {\n        Set<Integer> set = new HashSet<>();\n        for (int x : nums) {\n            set.add(x);\n        }\n        int best = 0;\n        for (int x : set) {\n            if (set.contains(x - 1)) continue;\n            int len = 1;\n            while (set.contains(x + len)) {\n                len++;\n            }\n            best = Math.max(best, len);\n        }\n        return best;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'encode-and-decode-strings',
    title: 'Encode and Decode Strings',
    difficulty: 'Medium',
    description: 'Design an algorithm to encode a list of strings into a single string, and decode that string back into the original list. The strings may contain any valid ASCII characters, including the delimiter you choose. The encoding must be reversible. Implement: - `String encode(List<String> strs)` - `List<String> decode(String str)`',
    examples: [
    {
      input: 'strs = ["we","say",":","yes"]',
      output: 'decode(encode(strs)) == ["we","say",":","yes"]',
      explanation: ''
    }
  ],
    constraints: '`0 <= strs.length < 100` - `0 <= strs[i].length < 200` - `strs[i]` contains any ASCII character.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Use `,` as the separator. Escape any `,` or `\\` inside a string with a preceding `\\`. The decoder reads characters, honours escapes, and splits on unescaped commas.',
      algorithm: ['1. Encode: for each string, write each character, prefixing `\\` when the character is `,` or `\\`. Then append an unescaped `,`.','2. Decode: walk the string. On `\\`, take the next character literally. On an unescaped `,`, finish the current item. Otherwise, append the character.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public String encode(List<String> strs) {\n        StringBuilder sb = new StringBuilder();\n        for (String s : strs) {\n            for (char c : s.toCharArray()) {\n                if (c == ',' || c == '\\\\') sb.append('\\\\');\n                sb.append(c);\n            }\n            sb.append(',');\n        }\n        return sb.toString();\n    }\n\n    public List<String> decode(String str) {\n        List<String> result = new ArrayList<>();\n        StringBuilder cur = new StringBuilder();\n        for (int i = 0; i < str.length(); i++) {\n            char c = str.charAt(i);\n            if (c == '\\\\') {\n                cur.append(str.charAt(++i));\n            } else if (c == ',') {\n                result.add(cur.toString());\n                cur.setLength(0);\n            } else {\n                cur.append(c);\n            }\n        }\n        return result;\n    }\n}",
      complexity: { time: 'O(T)', space: 'O(T)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Write each string as `length#content`. The decoder reads digits up to `#`, knows exactly how many characters follow, and jumps there. It never inspects the content, so any character, including `#` and digits, is safe.',
      algorithm: ['1. Encode: for each `s`, append `s.length()`, then `#`, then `s`.','2. Decode: keep index `i`. Find the next `#` at `j`. Parse `len = str[i..j)`. Take `str[j+1 .. j+1+len)`. Set `i = j + 1 + len`.','3. Repeat until the end of the string.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public String encode(List<String> strs) {\n        StringBuilder sb = new StringBuilder();\n        for (String s : strs) {\n            sb.append(s.length()).append('#').append(s);\n        }\n        return sb.toString();\n    }\n\n    public List<String> decode(String str) {\n        List<String> result = new ArrayList<>();\n        int i = 0;\n        while (i < str.length()) {\n            int j = str.indexOf('#', i);\n            int len = Integer.parseInt(str.substring(i, j));\n            result.add(str.substring(j + 1, j + 1 + len));\n            i = j + 1 + len;\n        }\n        return result;\n    }\n}",
      complexity: { time: 'O(T)', space: 'O(T)' }
    }
  ]
  },
  {
    slug: 'valid-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string `s`, return `true` if it is a palindrome, or `false` otherwise.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Filter out non-alphanumeric characters, convert to lowercase, and reverse the string to check equality.',
      algorithm: undefined,
      code: "class Solution {\n    public boolean isPalindrome(String s) {\n        StringBuilder filtered = new StringBuilder();\n        for (char c : s.toCharArray()) {\n            if (Character.isLetterOrDigit(c)) {\n                filtered.append(Character.toLowerCase(c));\n            }\n        }\n        return filtered.toString().equals(filtered.reverse().toString());\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Use `left` and `right` pointers meeting in the middle, skipping non-alphanumeric characters without extra memory.',
      algorithm: undefined,
      code: "class Solution {\n    public boolean isPalindrome(String s) {\n        int left = 0, right = s.length() - 1;\n        while (left < right) {\n            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {\n                left++;\n            }\n            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {\n                right--;\n            }\n            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {\n                return false;\n            }\n            left++;\n            right--;\n        }\n        return true;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'two-sum-ii-input-array-is-sorted',
    title: 'Two Sum II - Input Array Is Sorted',
    difficulty: 'Medium',
    description: 'Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number. Return the indices of the two numbers, `index1` and `index2`, added by one as an integer array `[index1, index2]` of length 2.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Better',
      intuition: 'For each element `numbers[i]`, binary search for `target - numbers[i]` in the subarray `numbers[i+1...n-1]`.',
      algorithm: undefined,
      code: "class Solution {\n    public int[] twoSum(int[] numbers, int target) {\n        for (int i = 0; i < numbers.length; i++) {\n            int complement = target - numbers[i];\n            int low = i + 1, high = numbers.length - 1;\n            while (low <= high) {\n                int mid = low + (high - low) / 2;\n                if (numbers[mid] == complement) return new int[]{i + 1, mid + 1};\n                else if (numbers[mid] < complement) low = mid + 1;\n                else high = mid - 1;\n            }\n        }\n        return new int[]{-1, -1};\n    }\n}",
      complexity: { time: 'O(n \\log n)', space: 'O(1)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Initialize `left = 0`, `right = numbers.length - 1`. If sum is too small, increment `left`; if too large, decrement `right`.',
      algorithm: undefined,
      code: "class Solution {\n    public int[] twoSum(int[] numbers, int target) {\n        int left = 0, right = numbers.length - 1;\n        while (left < right) {\n            int sum = numbers[left] + numbers[right];\n            if (sum == target) {\n                return new int[]{left + 1, right + 1};\n            } else if (sum < target) {\n                left++;\n            } else {\n                right--;\n            }\n        }\n        return new int[]{-1, -1};\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: '3sum',
    title: '3Sum',
    difficulty: 'Medium',
    description: 'Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`. The solution set must not contain duplicate triplets.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Better',
      intuition: 'Sort the array. For each index `i`, run two pointers `left = i + 1`, `right = n - 1`. Skip duplicate values for `i`, `left`, and `right`.',
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        List<List<Integer>> res = new ArrayList<>();\n        Arrays.sort(nums);\n        for (int i = 0; i < nums.length - 2; i++) {\n            if (nums[i] > 0) break; // impossible to sum to 0\n            if (i > 0 && nums[i] == nums[i - 1]) continue;\n            int left = i + 1, right = nums.length - 1;\n            while (left < right) {\n                int sum = nums[i] + nums[left] + nums[right];\n                if (sum == 0) {\n                    res.add(Arrays.asList(nums[i], nums[left], nums[right]));\n                    while (left < right && nums[left] == nums[left + 1]) left++;\n                    while (left < right && nums[right] == nums[right - 1]) right--;\n                    left++;\n                    right--;\n                } else if (sum < 0) {\n                    left++;\n                } else {\n                    right--;\n                }\n            }\n        }\n        return res;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'container-with-most-water',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    description: 'Given `n` non-negative integers `height` where each represents a point at coordinate `(i, height[i])`. Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Calculate area for all possible pairs $(i, j)$ and track the maximum.',
      algorithm: undefined,
      code: "class Solution {\n    public int maxArea(int[] height) {\n        int max = 0;\n        for (int i = 0; i < height.length; i++) {\n            for (int j = i + 1; j < height.length; j++) {\n                int area = Math.min(height[i], height[j]) * (j - i);\n                max = Math.max(max, area);\n            }\n        }\n        return max;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(1)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Place pointers at ends `left = 0`, `right = n - 1`. Area is constrained by the shorter line, so move the pointer pointing to the shorter line inward.',
      algorithm: undefined,
      code: "class Solution {\n    public int maxArea(int[] height) {\n        int left = 0, right = height.length - 1;\n        int maxArea = 0;\n        while (left < right) {\n            int h = Math.min(height[left], height[right]);\n            maxArea = Math.max(maxArea, h * (right - left));\n            while (left < right && height[left] <= h) left++;\n            while (left < right && height[right] <= h) right--;\n        }\n        return maxArea;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    description: 'Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Better',
      intuition: 'Precompute `leftMax[i]` and `rightMax[i]` in two linear passes.',
      algorithm: undefined,
      code: "class Solution {\n    public int trap(int[] height) {\n        int n = height.length;\n        if (n == 0) return 0;\n        int[] leftMax = new int[n];\n        int[] rightMax = new int[n];\n        leftMax[0] = height[0];\n        for (int i = 1; i < n; i++) leftMax[i] = Math.max(leftMax[i - 1], height[i]);\n        rightMax[n - 1] = height[n - 1];\n        for (int i = n - 2; i >= 0; i--) rightMax[i] = Math.max(rightMax[i + 1], height[i]);\n        int trapped = 0;\n        for (int i = 0; i < n; i++) {\n            trapped += Math.min(leftMax[i], rightMax[i]) - height[i];\n        }\n        return trapped;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: 'Maintain indices of bars in a stack. When a taller bar is found, pop and calculate trapped water layer by layer.',
      algorithm: undefined,
      code: "import java.util.Stack;\n\nclass Solution {\n    public int trap(int[] height) {\n        Stack<Integer> stack = new Stack<>();\n        int trapped = 0;\n        for (int i = 0; i < height.length; i++) {\n            while (!stack.isEmpty() && height[i] > height[stack.peek()]) {\n                int bottom = stack.pop();\n                if (stack.isEmpty()) break;\n                int distance = i - stack.peek() - 1;\n                int boundedHeight = Math.min(height[i], height[stack.peek()]) - height[bottom];\n                trapped += distance * boundedHeight;\n            }\n            stack.push(i);\n        }\n        return trapped;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Best',
      intuition: 'Maintain `leftMax` and `rightMax`. Advance the pointer with the smaller max, adding trapped water on the fly.',
      algorithm: undefined,
      code: "class Solution {\n    public int trap(int[] height) {\n        int left = 0, right = height.length - 1;\n        int leftMax = 0, rightMax = 0;\n        int trapped = 0;\n        while (left < right) {\n            if (height[left] < height[right]) {\n                if (height[left] >= leftMax) {\n                    leftMax = height[left];\n                } else {\n                    trapped += leftMax - height[left];\n                }\n                left++;\n            } else {\n                if (height[right] >= rightMax) {\n                    rightMax = height[right];\n                } else {\n                    trapped += rightMax - height[right];\n                }\n                right--;\n            }\n        }\n        return trapped;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    description: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the $i^{\\text{th}}$ day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Keep track of minimum purchase price seen so far. At each day, update `maxProfit = max(maxProfit, price - minPrice)`.',
      algorithm: undefined,
      code: "class Solution {\n    public int maxProfit(int[] prices) {\n        int minPrice = Integer.MAX_VALUE;\n        int maxProfit = 0;\n        for (int price : prices) {\n            if (price < minPrice) {\n                minPrice = price;\n            } else if (price - minPrice > maxProfit) {\n                maxProfit = price - minPrice;\n            }\n        }\n        return maxProfit;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    description: 'Given a string `s`, find the length of the longest substring without repeating characters.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Better',
      intuition: 'Expand `right` pointer. If character already in set, increment `left` and remove characters until duplicate is gone.',
      algorithm: undefined,
      code: "import java.util.HashSet;\nimport java.util.Set;\n\nclass Solution {\n    public int lengthOfLongestSubstring(String s) {\n        Set<Character> set = new HashSet<>();\n        int left = 0, maxLen = 0;\n        for (int right = 0; right < s.length(); right++) {\n            while (set.contains(s.charAt(right))) {\n                set.remove(s.charAt(left));\n                left++;\n            }\n            set.add(s.charAt(right));\n            maxLen = Math.max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n}",
      complexity: { time: 'O(2n) = O(n)', space: 'O(\\min(n, m))' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Directly jump `left` to `lastSeen[c] + 1` whenever duplicate is found, avoiding step-by-step shrink.',
      algorithm: undefined,
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int lengthOfLongestSubstring(String s) {\n        int[] lastIndex = new int[128];\n        Arrays.fill(lastIndex, -1);\n        int maxLen = 0, left = 0;\n        for (int right = 0; right < s.length(); right++) {\n            char c = s.charAt(right);\n            if (lastIndex[c] >= left) {\n                left = lastIndex[c] + 1;\n            }\n            lastIndex[c] = right;\n            maxLen = Math.max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'longest-repeating-character-replacement',
    title: 'Longest Repeating Character Replacement',
    difficulty: 'Medium',
    description: 'You are given a string `s` and an integer `k`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most `k` times. Return the length of the longest substring containing the same letter you can get after performing the operations.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'A window is valid if `(windowLength - maxFreq) <= k`. Expand `right`, update `maxFreq`. If invalid, shift `left` forward by 1.',
      algorithm: undefined,
      code: "class Solution {\n    public int characterReplacement(String s, int k) {\n        int[] count = new int[26];\n        int maxCount = 0;\n        int left = 0, maxLength = 0;\n        for (int right = 0; right < s.length(); right++) {\n            count[s.charAt(right) - 'A']++;\n            maxCount = Math.max(maxCount, count[s.charAt(right) - 'A']);\n            while ((right - left + 1) - maxCount > k) {\n                count[s.charAt(left) - 'A']--;\n                left++;\n            }\n            maxLength = Math.max(maxLength, right - left + 1);\n        }\n        return maxLength;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'permutation-in-string',
    title: 'Permutation in String',
    difficulty: 'Medium',
    description: 'Given two strings `s1` and `s2`, return `true` if `s2` contains a permutation of `s1`, or `false` otherwise. In other words, return `true` if one of `s1`\'s permutations is the substring of `s2`.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Better',
      intuition: 'Sliding window of fixed length `s1.length()`. Compare 26-element array equality at each step.',
      algorithm: undefined,
      code: "import java.util.Arrays;\n\nclass Solution {\n    public boolean checkInclusion(String s1, String s2) {\n        if (s1.length() > s2.length()) return false;\n        int[] s1Count = new int[26];\n        int[] s2Count = new int[26];\n        for (int i = 0; i < s1.length(); i++) {\n            s1Count[s1.charAt(i) - 'a']++;\n            s2Count[s2.charAt(i) - 'a']++;\n        }\n        if (Arrays.equals(s1Count, s2Count)) return true;\n        for (int i = s1.length(); i < s2.length(); i++) {\n            s2Count[s2.charAt(i) - 'a']++;\n            s2Count[s2.charAt(i - s1.length()) - 'a']--;\n            if (Arrays.equals(s1Count, s2Count)) return true;\n        }\n        return false;\n    }\n}",
      complexity: { time: 'O(26 \\cdot n) = O(n)', space: 'O(1)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Track the number of matching character frequencies (out of 26). When `matches == 26`, return `true`.',
      algorithm: undefined,
      code: "class Solution {\n    public boolean checkInclusion(String s1, String s2) {\n        if (s1.length() > s2.length()) return false;\n        int[] s1Map = new int[26];\n        int[] s2Map = new int[26];\n        for (int i = 0; i < s1.length(); i++) {\n            s1Map[s1.charAt(i) - 'a']++;\n            s2Map[s2.charAt(i) - 'a']++;\n        }\n        int matches = 0;\n        for (int i = 0; i < 26; i++) {\n            if (s1Map[i] == s2Map[i]) matches++;\n        }\n        for (int i = 0; i < s2.length() - s1.length(); i++) {\n            if (matches == 26) return true;\n            int r = s2.charAt(i + s1.length()) - 'a';\n            int l = s2.charAt(i) - 'a';\n            s2Map[r]++;\n            if (s2Map[r] == s1Map[r]) matches++;\n            else if (s2Map[r] == s1Map[r] + 1) matches--;\n            s2Map[l]--;\n            if (s2Map[l] == s1Map[l]) matches++;\n            else if (s2Map[l] == s1Map[l] - 1) matches--;\n        }\n        return matches == 26;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'minimum-window-substring',
    title: 'Minimum Window Substring',
    difficulty: 'Hard',
    description: 'Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `""`.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Use frequency map for `t`. Expand `right` to fulfill requirement, then contract `left` while valid to minimize window.',
      algorithm: undefined,
      code: "class Solution {\n    public String minWindow(String s, String t) {\n        if (s.length() < t.length()) return \"\";\n        int[] target = new int[128];\n        for (char c : t.toCharArray()) target[c]++;\n        int required = 0;\n        for (int count : target) if (count > 0) required++;\n        int[] window = new int[128];\n        int formed = 0;\n        int left = 0, minLen = Integer.MAX_VALUE, startIdx = 0;\n        for (int right = 0; right < s.length(); right++) {\n            char c = s.charAt(right);\n            window[c]++;\n            if (target[c] > 0 && window[c] == target[c]) formed++;\n            while (left <= right && formed == required) {\n                if (right - left + 1 < minLen) {\n                    minLen = right - left + 1;\n                    startIdx = left;\n                }\n                char leftChar = s.charAt(left);\n                window[leftChar]--;\n                if (target[leftChar] > 0 && window[leftChar] < target[leftChar]) formed--;\n                left++;\n            }\n        }\n        return minLen == Integer.MAX_VALUE ? \"\" : s.substring(startIdx, startIdx + minLen);\n    }\n}",
      complexity: { time: 'O(m + n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'sliding-window-maximum',
    title: 'Sliding Window Maximum',
    difficulty: 'Hard',
    description: 'You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position. Return the max sliding window.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Better',
      intuition: 'Store `[val, index]` in a max-heap. Pop stale elements outside the window.',
      algorithm: undefined,
      code: "import java.util.PriorityQueue;\n\nclass Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        int n = nums.length;\n        int[] res = new int[n - k + 1];\n        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> b[0] - a[0]);\n        for (int i = 0; i < n; i++) {\n            pq.offer(new int[]{nums[i], i});\n            while (pq.peek()[1] <= i - k) pq.poll();\n            if (i >= k - 1) res[i - k + 1] = pq.peek()[0];\n        }\n        return res;\n    }\n}",
      complexity: { time: 'O(n \\log n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Store indices in a `Deque`. Maintain strictly decreasing order by removing smaller elements from back before inserting. Front is always maximum.',
      algorithm: undefined,
      code: "import java.util.ArrayDeque;\nimport java.util.Deque;\n\nclass Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        int n = nums.length;\n        int[] res = new int[n - k + 1];\n        Deque<Integer> deque = new ArrayDeque<>();\n        for (int i = 0; i < n; i++) {\n            if (!deque.isEmpty() && deque.peekFirst() <= i - k) {\n                deque.pollFirst();\n            }\n            while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[i]) {\n                deque.pollLast();\n            }\n            deque.offerLast(i);\n            if (i >= k - 1) {\n                res[i - k + 1] = nums[deque.peekFirst()];\n            }\n        }\n        return res;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(k)' }
    }
  ]
  },
  {
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    description: 'Given a string `s` containing just the characters `\'(\'`, `\')\'`, `\'{\'`, `\'}\'`, `\'[\'` and `\']\'`, determine if the input string is valid. Open brackets must be closed by the same type of brackets in the correct order.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Using an array as stack avoids the overhead of `java.util.Stack`.',
      algorithm: undefined,
      code: "class Solution {\n    public boolean isValid(String s) {\n        char[] stack = new char[s.length()];\n        int head = 0;\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack[head++] = ')';\n            else if (c == '{') stack[head++] = '}';\n            else if (c == '[') stack[head++] = ']';\n            else {\n                if (head == 0 || stack[--head] != c) return false;\n            }\n        }\n        return head == 0;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'min-stack',
    title: 'Min Stack',
    difficulty: 'Medium',
    description: 'Design a stack that supports `push`, `pop`, `top`, and retrieving the minimum element in constant time $O(1)$.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Two Stacks',
      intuition: 'Maintain a main data stack and a min stack storing current minimum.',
      algorithm: undefined,
      code: "import java.util.Stack;\n\nclass MinStack {\n    private Stack<Integer> stack = new Stack<>();\n    private Stack<Integer> minStack = new Stack<>();\n\n    public MinStack() {}\n\n    public void push(int val) {\n        stack.push(val);\n        if (minStack.isEmpty() || val <= minStack.peek()) {\n            minStack.push(val);\n        }\n    }\n\n    public void pop() {\n        if (stack.peek().equals(minStack.peek())) {\n            minStack.pop();\n        }\n        stack.pop();\n    }\n\n    public int top() {\n        return stack.peek();\n    }\n\n    public int getMin() {\n        return minStack.peek();\n    }\n}",
      complexity: { time: 'O(1)', space: 'O(n)' }
    },
    {
      label: 'Best',
      intuition: 'Store value and current minimum together in custom nodes.',
      algorithm: undefined,
      code: "class MinStack {\n    private static class Node {\n        int val;\n        int min;\n        Node next;\n        Node(int val, int min, Node next) {\n            this.val = val;\n            this.min = min;\n            this.next = next;\n        }\n    }\n    private Node head;\n\n    public MinStack() {}\n\n    public void push(int val) {\n        if (head == null) head = new Node(val, val, null);\n        else head = new Node(val, Math.min(val, head.min), head);\n    }\n\n    public void pop() {\n        head = head.next;\n    }\n\n    public int top() {\n        return head.val;\n    }\n\n    public int getMin() {\n        return head.min;\n    }\n}",
      complexity: { time: 'O(1)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'evaluate-reverse-polish-notation',
    title: 'Evaluate Reverse Polish Notation',
    difficulty: 'Medium',
    description: 'Evaluate the value of an arithmetic expression in Reverse Polish Notation (Postfix). Valid operators are `+`, `-`, `*`, and `/`. Each operand may be an integer or another expression. Division truncates toward zero.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int evalRPN(String[] tokens) {\n        int[] stack = new int[tokens.length];\n        int top = 0;\n        for (String t : tokens) {\n            switch (t) {\n                case \"+\":\n                    stack[top - 2] += stack[top - 1];\n                    top--;\n                    break;\n                case \"-\":\n                    stack[top - 2] -= stack[top - 1];\n                    top--;\n                    break;\n                case \"*\":\n                    stack[top - 2] *= stack[top - 1];\n                    top--;\n                    break;\n                case \"/\":\n                    stack[top - 2] /= stack[top - 1];\n                    top--;\n                    break;\n                default:\n                    stack[top++] = Integer.parseInt(t);\n                    break;\n            }\n        }\n        return stack[0];\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'generate-parentheses',
    title: 'Generate Parentheses',
    difficulty: 'Medium',
    description: 'Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Add `\'(\'` if `open < n`; add `\')\'` if `close < open`.',
      algorithm: undefined,
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public List<String> generateParenthesis(int n) {\n        List<String> res = new ArrayList<>();\n        backtrack(res, new StringBuilder(), 0, 0, n);\n        return res;\n    }\n\n    private void backtrack(List<String> res, StringBuilder sb, int open, int close, int max) {\n        if (sb.length() == max * 2) {\n            res.add(sb.toString());\n            return;\n        }\n        if (open < max) {\n            sb.append('(');\n            backtrack(res, sb, open + 1, close, max);\n            sb.deleteCharAt(sb.length() - 1);\n        }\n        if (close < open) {\n            sb.append(')');\n            backtrack(res, sb, open, close + 1, max);\n            sb.deleteCharAt(sb.length() - 1);\n        }\n    }\n}",
      complexity: { time: 'O(\\frac{4^n}{\\sqrt{n}})', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'daily-temperatures',
    title: 'Daily Temperatures',
    difficulty: 'Medium',
    description: 'Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the $i^{\\text{th}}$ day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Monotonic Decreasing Stack',
      intuition: 'Push indices onto stack. When current temperature is higher than top, pop and compute day difference.',
      algorithm: undefined,
      code: "import java.util.Stack;\n\nclass Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        int n = temperatures.length;\n        int[] res = new int[n];\n        Stack<Integer> stack = new Stack<>();\n        for (int i = 0; i < n; i++) {\n            while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {\n                int prevDay = stack.pop();\n                res[prevDay] = i - prevDay;\n            }\n            stack.push(i);\n        }\n        return res;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Best',
      intuition: 'Traverse backwards jumping through existing answers to reach $O(1)$ extra space beyond result.',
      algorithm: undefined,
      code: "class Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        int n = temperatures.length;\n        int[] res = new int[n];\n        for (int i = n - 2; i >= 0; i--) {\n            int j = i + 1;\n            while (j < n && temperatures[j] <= temperatures[i]) {\n                if (res[j] == 0) {\n                    j = n; // no warmer day exists\n                } else {\n                    j += res[j];\n                }\n            }\n            if (j < n) res[i] = j - i;\n        }\n        return res;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'car-fleet',
    title: 'Car Fleet',
    difficulty: 'Medium',
    description: 'There are `n` cars going to the same destination along a one-lane road. The destination is `target` miles away. You are given two integer arrays `position` and `speed`. A car can never pass another car ahead of it, but it can catch up to it and drive bumper to bumper at the same speed. The distance between them is ignored. Return the number of car fleets that will arrive at the destination.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Sort cars by starting position descending. Calculate arrival time $(target - pos) / speed$. If a car behind arrives earlier or at the same time as the fleet ahead, it merges.',
      algorithm: undefined,
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int carFleet(int target, int[] position, int[] speed) {\n        int n = position.length;\n        double[][] cars = new double[n][2];\n        for (int i = 0; i < n; i++) {\n            cars[i][0] = position[i];\n            cars[i][1] = (double)(target - position[i]) / speed[i];\n        }\n        Arrays.sort(cars, (a, b) -> Double.compare(b[0], a[0]));\n        int fleets = 0;\n        double currentFleetTime = 0.0;\n        for (double[] car : cars) {\n            if (car[1] > currentFleetTime) {\n                fleets++;\n                currentFleetTime = car[1];\n            }\n        }\n        return fleets;\n    }\n}",
      complexity: { time: 'O(n \\log n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'largest-rectangle-in-histogram',
    title: 'Largest Rectangle in Histogram',
    difficulty: 'Hard',
    description: 'Given an array of integers `heights` representing the histogram\'s bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Maintain indices of bars with increasing heights. When a smaller bar appears, pop until monotonic property is restored, computing the area with the popped bar as the minimum height.',
      algorithm: undefined,
      code: "import java.util.ArrayDeque;\nimport java.util.Deque;\n\nclass Solution {\n    public int largestRectangleArea(int[] heights) {\n        int n = heights.length;\n        Deque<Integer> stack = new ArrayDeque<>();\n        int maxArea = 0;\n        for (int i = 0; i <= n; i++) {\n            int h = (i == n) ? 0 : heights[i];\n            while (!stack.isEmpty() && h < heights[stack.peek()]) {\n                int height = heights[stack.pop()];\n                int width = stack.isEmpty() ? i : i - stack.peek() - 1;\n                maxArea = Math.max(maxArea, height * width);\n            }\n            stack.push(i);\n        }\n        return maxArea;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    description: 'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Brute Force',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int search(int[] nums, int target) {\n        for (int i = 0; i < nums.length; i++) {\n            if (nums[i] == target) return i;\n        }\n        return -1;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    },
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int search(int[] nums, int target) {\n        int left = 0, right = nums.length - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            else if (nums[mid] < target) left = mid + 1;\n            else right = mid - 1;\n        }\n        return -1;\n    }\n}",
      complexity: { time: 'O(\\log n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'search-a-2d-matrix',
    title: 'Search a 2D Matrix',
    difficulty: 'Medium',
    description: 'You are given an `m x n` integer matrix `matrix` with the properties: 1. Integers in each row are sorted from left to right. 2. The first integer of each row is greater than the last integer of the previous row. Given an integer `target`, return `true` if `target` is in `matrix` or `false` otherwise.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Treat matrix as a virtual 1D array of size $m \\times n$. Coordinate mapping: `row = mid / n`, `col = mid % n`.',
      algorithm: undefined,
      code: "class Solution {\n    public boolean searchMatrix(int[][] matrix, int target) {\n        int m = matrix.length, n = matrix[0].length;\n        int left = 0, right = m * n - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            int val = matrix[mid / n][mid % n];\n            if (val == target) return true;\n            else if (val < target) left = mid + 1;\n            else right = mid - 1;\n        }\n        return false;\n    }\n}",
      complexity: { time: 'O(\\log(m \\cdot n))', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'koko-eating-bananas',
    title: 'Koko Eating Bananas',
    difficulty: 'Medium',
    description: 'Koko loves to eat bananas. There are `n` piles of bananas, the $i^{\\text{th}}$ pile has `piles[i]` bananas. The guards will come back in `h` hours. Koko can decide her bananas-per-hour eating speed of `k`. Each hour, she chooses some pile and eats `k` bananas from that pile. Return the minimum integer `k` such that she can eat all bananas within `h` hours.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Lower bound `left = 1`, upper bound `right = max(piles)`. If she can finish in $\\le h$ hours, try a slower speed (`right = mid - 1`).',
      algorithm: undefined,
      code: "class Solution {\n    public int minEatingSpeed(int[] piles, int h) {\n        int left = 1, right = 1;\n        for (int p : piles) right = Math.max(right, p);\n        int ans = right;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            long hours = 0;\n            for (int p : piles) {\n                hours += (p + mid - 1) / mid;\n            }\n            if (hours <= h) {\n                ans = mid;\n                right = mid - 1;\n            } else {\n                left = mid + 1;\n            }\n        }\n        return ans;\n    }\n}",
      complexity: { time: 'O(n \\log(\\max(\\text{piles})))', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'find-minimum-in-rotated-sorted-array',
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: 'Medium',
    description: 'Suppose an array of length `n` sorted in ascending order is rotated between 1 and `n` times. Given the sorted rotated array `nums` of unique elements, return the minimum element of this array. Algorithm must run in $O(\\log n)$ time.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Compare `nums[mid]` with `nums[right]`. If `nums[mid] > nums[right]`, the min lies strictly in the right half (`left = mid + 1`). Otherwise `right = mid`.',
      algorithm: undefined,
      code: "class Solution {\n    public int findMin(int[] nums) {\n        int left = 0, right = nums.length - 1;\n        while (left < right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] > nums[right]) {\n                left = mid + 1;\n            } else {\n                right = mid;\n            }\n        }\n        return nums[left];\n    }\n}",
      complexity: { time: 'O(\\log n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'search-in-rotated-sorted-array',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    description: 'Given the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`. Algorithm must run in $O(\\log n)$ time.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'At any `mid`, at least one half (left or right) is guaranteed to be normally sorted. Check if `target` falls in the sorted half; if so, search there, else search the other half.',
      algorithm: undefined,
      code: "class Solution {\n    public int search(int[] nums, int target) {\n        int left = 0, right = nums.length - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[left] <= nums[mid]) { // Left half sorted\n                if (target >= nums[left] && target < nums[mid]) {\n                    right = mid - 1;\n                } else {\n                    left = mid + 1;\n                }\n            } else { // Right half sorted\n                if (target > nums[mid] && target <= nums[right]) {\n                    left = mid + 1;\n                } else {\n                    right = mid - 1;\n                }\n            }\n        }\n        return -1;\n    }\n}",
      complexity: { time: 'O(\\log n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'time-based-key-value-store',
    title: 'Time Based Key-Value Store',
    difficulty: 'Medium',
    description: 'Design a time-based key-value data structure that can store multiple values for the same key at different time stamps and retrieve the key\'s value at a certain timestamp. - `set(String key, String value, int timestamp)`: Stores key with value at timestamp. - `get(String key, int timestamp)`: Returns value with largest `timestamp_prev <= timestamp`. If no such timestamp, returns `""`.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Since timestamps in `set` are strictly increasing, each key\'s list is sorted by timestamp. Binary search `floor` timestamp in $O(\\log n)$.',
      algorithm: undefined,
      code: "import java.util.*;\n\nclass TimeMap {\n    private static class Entry {\n        int timestamp;\n        String value;\n        Entry(int timestamp, String value) {\n            this.timestamp = timestamp;\n            this.value = value;\n        }\n    }\n\n    private Map<String, List<Entry>> map;\n\n    public TimeMap() {\n        map = new HashMap<>();\n    }\n\n    public void set(String key, String value, int timestamp) {\n        map.computeIfAbsent(key, k -> new ArrayList<>()).add(new Entry(timestamp, value));\n    }\n\n    public String get(String key, int timestamp) {\n        if (!map.containsKey(key)) return \"\";\n        List<Entry> list = map.get(key);\n        int left = 0, right = list.size() - 1;\n        String res = \"\";\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (list.get(mid).timestamp <= timestamp) {\n                res = list.get(mid).value;\n                left = mid + 1;\n            } else {\n                right = mid - 1;\n            }\n        }\n        return res;\n    }\n}",
      complexity: { time: '`set`: O(1), `get`: O(\\log n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'median-of-two-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    description: 'Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays. The overall run time complexity should be $O(\\log(m+n))$.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Binary search the partition index `i` in smaller array `nums1` and compute `j = (m + n + 1) / 2 - i`. Partition is valid if `nums1[i-1] <= nums2[j]` and `nums2[j-1] <= nums1[i]`.',
      algorithm: undefined,
      code: "class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        if (nums1.length > nums2.length) {\n            return findMedianSortedArrays(nums2, nums1);\n        }\n        int m = nums1.length, n = nums2.length;\n        int left = 0, right = m;\n        while (left <= right) {\n            int i = left + (right - left) / 2;\n            int j = (m + n + 1) / 2 - i;\n            int maxLeft1 = (i == 0) ? Integer.MIN_VALUE : nums1[i - 1];\n            int minRight1 = (i == m) ? Integer.MAX_VALUE : nums1[i];\n            int maxLeft2 = (j == 0) ? Integer.MIN_VALUE : nums2[j - 1];\n            int minRight2 = (j == n) ? Integer.MAX_VALUE : nums2[j];\n\n            if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {\n                if ((m + n) % 2 == 1) {\n                    return Math.max(maxLeft1, maxLeft2);\n                } else {\n                    return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2.0;\n                }\n            } else if (maxLeft1 > minRight2) {\n                right = i - 1;\n            } else {\n                left = i + 1;\n            }\n        }\n        return 0.0;\n    }\n}",
      complexity: { time: 'O(\\log(\\min(m, n)))', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    description: 'Given the `head` of a singly linked list, reverse the list, and return the reversed list.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Iterative Pointer Reversal',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null, curr = head;\n        while (curr != null) {\n            ListNode next = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    },
    {
      label: 'Recursive',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public ListNode reverseList(ListNode head) {\n        if (head == null || head.next == null) return head;\n        ListNode newHead = reverseList(head.next);\n        head.next.next = head;\n        head.next = null;\n        return newHead;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'merge-two-sorted-lists',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    description: 'Merge Two Sorted Lists. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Iterative with Dummy Node',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        ListNode dummy = new ListNode(0);\n        ListNode curr = dummy;\n        while (list1 != null && list2 != null) {\n            if (list1.val <= list2.val) {\n                curr.next = list1;\n                list1 = list1.next;\n            } else {\n                curr.next = list2;\n                list2 = list2.next;\n            }\n            curr = curr.next;\n        }\n        curr.next = (list1 != null) ? list1 : list2;\n        return dummy.next;\n    }\n}",
      complexity: { time: 'O(n + m)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'reorder-list',
    title: 'Reorder List',
    difficulty: 'Medium',
    description: 'You are given the head of a singly linked-list: $L_0 \\to L_1 \\to \\dots \\to L_{n-1} \\to L_n$. Reorder to: $L_0 \\to L_n \\to L_1 \\to L_{n-1} \\to L_2 \\dots$',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public void reorderList(ListNode head) {\n        if (head == null || head.next == null) return;\n        // 1. Find middle\n        ListNode slow = head, fast = head;\n        while (fast.next != null && fast.next.next != null) {\n            slow = slow.next;\n            fast = fast.next.next;\n        }\n        // 2. Reverse second half\n        ListNode prev = null, curr = slow.next;\n        slow.next = null;\n        while (curr != null) {\n            ListNode next = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = next;\n        }\n        // 3. Merge two halves\n        ListNode first = head, second = prev;\n        while (second != null) {\n            ListNode t1 = first.next, t2 = second.next;\n            first.next = second;\n            second.next = t1;\n            first = t1;\n            second = t2;\n        }\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'remove-nth-node-from-end-of-list',
    title: 'Remove Nth Node From End of List',
    difficulty: 'Medium',
    description: 'Remove Nth Node From End of List. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public ListNode removeNthFromEnd(ListNode head, int n) {\n        ListNode dummy = new ListNode(0);\n        dummy.next = head;\n        ListNode fast = dummy, slow = dummy;\n        for (int i = 0; i <= n; i++) {\n            fast = fast.next;\n        }\n        while (fast != null) {\n            fast = fast.next;\n            slow = slow.next;\n        }\n        slow.next = slow.next.next;\n        return dummy.next;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'copy-list-with-random-pointer',
    title: 'Copy List with Random Pointer',
    difficulty: 'Medium',
    description: 'Copy List with Random Pointer. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Better',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.HashMap;\nimport java.util.Map;\n\nclass Solution {\n    public Node copyRandomList(Node head) {\n        if (head == null) return null;\n        Map<Node, Node> map = new HashMap<>();\n        Node curr = head;\n        while (curr != null) {\n            map.put(curr, new Node(curr.val));\n            curr = curr.next;\n        }\n        curr = head;\n        while (curr != null) {\n            map.get(curr).next = map.get(curr.next);\n            map.get(curr).random = map.get(curr.random);\n            curr = curr.next;\n        }\n        return map.get(head);\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public Node copyRandomList(Node head) {\n        if (head == null) return null;\n        Node curr = head;\n        while (curr != null) {\n            Node copy = new Node(curr.val);\n            copy.next = curr.next;\n            curr.next = copy;\n            curr = copy.next;\n        }\n        curr = head;\n        while (curr != null) {\n            if (curr.random != null) {\n                curr.next.random = curr.random.next;\n            }\n            curr = curr.next.next;\n        }\n        curr = head;\n        Node dummy = new Node(0);\n        Node copyCurr = dummy;\n        while (curr != null) {\n            copyCurr.next = curr.next;\n            curr.next = curr.next.next;\n            copyCurr = copyCurr.next;\n            curr = curr.next;\n        }\n        return dummy.next;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'add-two-numbers',
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    description: 'Add Two Numbers. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n        ListNode dummy = new ListNode(0);\n        ListNode curr = dummy;\n        int carry = 0;\n        while (l1 != null || l2 != null || carry != 0) {\n            int sum = carry;\n            if (l1 != null) {\n                sum += l1.val;\n                l1 = l1.next;\n            }\n            if (l2 != null) {\n                sum += l2.val;\n                l2 = l2.next;\n            }\n            carry = sum / 10;\n            curr.next = new ListNode(sum % 10);\n            curr = curr.next;\n        }\n        return dummy.next;\n    }\n}",
      complexity: { time: 'O(\\max(m, n))', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'linked-list-cycle',
    title: 'Linked List Cycle',
    difficulty: 'Easy',
    description: 'Linked List Cycle. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "public class Solution {\n    public boolean hasCycle(ListNode head) {\n        if (head == null) return false;\n        ListNode slow = head, fast = head;\n        while (fast != null && fast.next != null) {\n            slow = slow.next;\n            fast = fast.next.next;\n            if (slow == fast) return true;\n        }\n        return false;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'find-the-duplicate-number',
    title: 'Find the Duplicate Number',
    difficulty: 'Medium',
    description: 'Find the Duplicate Number. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Treat array as linked list where node $i$ points to `nums[i]`.',
      algorithm: undefined,
      code: "class Solution {\n    public int findDuplicate(int[] nums) {\n        int slow = nums[0];\n        int fast = nums[0];\n        do {\n            slow = nums[slow];\n            fast = nums[nums[fast]];\n        } while (slow != fast);\n        fast = nums[0];\n        while (slow != fast) {\n            slow = nums[slow];\n            fast = nums[fast];\n        }\n        return slow;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'lru-cache',
    title: 'LRU Cache',
    difficulty: 'Medium',
    description: 'LRU Cache. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.HashMap;\nimport java.util.Map;\n\nclass LRUCache {\n    private static class Node {\n        int key, val;\n        Node prev, next;\n        Node(int key, int val) { this.key = key; this.val = val; }\n    }\n\n    private final int capacity;\n    private final Map<Integer, Node> map;\n    private final Node head, tail;\n\n    public LRUCache(int capacity) {\n        this.capacity = capacity;\n        this.map = new HashMap<>();\n        head = new Node(0, 0);\n        tail = new Node(0, 0);\n        head.next = tail;\n        tail.prev = head;\n    }\n\n    private void remove(Node node) {\n        node.prev.next = node.next;\n        node.next.prev = node.prev;\n    }\n\n    private void insertToHead(Node node) {\n        node.next = head.next;\n        node.prev = head;\n        head.next.prev = node;\n        head.next = node;\n    }\n\n    public int get(int key) {\n        if (!map.containsKey(key)) return -1;\n        Node node = map.get(key);\n        remove(node);\n        insertToHead(node);\n        return node.val;\n    }\n\n    public void put(int key, int value) {\n        if (map.containsKey(key)) {\n            Node node = map.get(key);\n            node.val = value;\n            remove(node);\n            insertToHead(node);\n        } else {\n            if (map.size() == capacity) {\n                Node lru = tail.prev;\n                remove(lru);\n                map.remove(lru.key);\n            }\n            Node newNode = new Node(key, value);\n            map.put(key, newNode);\n            insertToHead(newNode);\n        }\n    }\n}",
      complexity: { time: 'O(1)', space: 'O(\\text{capacity})' }
    }
  ]
  },
  {
    slug: 'merge-k-sorted-lists',
    title: 'Merge k Sorted Lists',
    difficulty: 'Hard',
    description: 'Merge k Sorted Lists. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Min-Heap',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.PriorityQueue;\n\nclass Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        if (lists == null || lists.length == 0) return null;\n        PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> a.val - b.val);\n        for (ListNode node : lists) {\n            if (node != null) pq.offer(node);\n        }\n        ListNode dummy = new ListNode(0);\n        ListNode curr = dummy;\n        while (!pq.isEmpty()) {\n            ListNode minNode = pq.poll();\n            curr.next = minNode;\n            curr = curr.next;\n            if (minNode.next != null) pq.offer(minNode.next);\n        }\n        return dummy.next;\n    }\n}",
      complexity: { time: 'O(N \\log k)', space: 'O(k)' }
    },
    {
      label: 'Best',
      intuition: 'Merge pairs iteratively in-place.',
      algorithm: undefined,
      code: "class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        if (lists == null || lists.length == 0) return null;\n        int interval = 1;\n        while (interval < lists.length) {\n            for (int i = 0; i + interval < lists.length; i += interval * 2) {\n                lists[i] = mergeTwo(lists[i], lists[i + interval]);\n            }\n            interval *= 2;\n        }\n        return lists[0];\n    }\n\n    private ListNode mergeTwo(ListNode l1, ListNode l2) {\n        ListNode dummy = new ListNode(0);\n        ListNode curr = dummy;\n        while (l1 != null && l2 != null) {\n            if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }\n            else { curr.next = l2; l2 = l2.next; }\n            curr = curr.next;\n        }\n        curr.next = (l1 != null) ? l1 : l2;\n        return dummy.next;\n    }\n}",
      complexity: { time: 'O(N \\log k)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'reverse-nodes-in-k-group',
    title: 'Reverse Nodes in k-Group',
    difficulty: 'Hard',
    description: 'Reverse Nodes in k-Group. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public ListNode reverseKGroup(ListNode head, int k) {\n        ListNode dummy = new ListNode(0);\n        dummy.next = head;\n        ListNode groupPrev = dummy;\n        while (true) {\n            ListNode kth = getKth(groupPrev, k);\n            if (kth == null) break;\n            ListNode groupNext = kth.next;\n            ListNode prev = kth.next, curr = groupPrev.next;\n            while (curr != groupNext) {\n                ListNode tmp = curr.next;\n                curr.next = prev;\n                prev = curr;\n                curr = tmp;\n            }\n            ListNode tmp = groupPrev.next;\n            groupPrev.next = kth;\n            groupPrev = tmp;\n        }\n        return dummy.next;\n    }\n\n    private ListNode getKth(ListNode curr, int k) {\n        while (curr != null && k > 0) {\n            curr = curr.next;\n            k--;\n        }\n        return curr;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'invert-binary-tree',
    title: 'Invert Binary Tree',
    difficulty: 'Easy',
    description: 'Invert Binary Tree. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Recursive DFS',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        if (root == null) return null;\n        TreeNode left = invertTree(root.left);\n        TreeNode right = invertTree(root.right);\n        root.left = right;\n        root.right = left;\n        return root;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(h)' }
    },
    {
      label: 'Iterative BFS',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.LinkedList;\nimport java.util.Queue;\n\nclass Solution {\n    public TreeNode invertTree(TreeNode root) {\n        if (root == null) return null;\n        Queue<TreeNode> queue = new LinkedList<>();\n        queue.offer(root);\n        while (!queue.isEmpty()) {\n            TreeNode curr = queue.poll();\n            TreeNode temp = curr.left;\n            curr.left = curr.right;\n            curr.right = temp;\n            if (curr.left != null) queue.offer(curr.left);\n            if (curr.right != null) queue.offer(curr.right);\n        }\n        return root;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(w)' }
    }
  ]
  },
  {
    slug: 'maximum-depth-of-binary-tree',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    description: 'Maximum Depth of Binary Tree. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Recursive DFS',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int maxDepth(TreeNode root) {\n        if (root == null) return 0;\n        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(h)' }
    }
  ]
  },
  {
    slug: 'diameter-of-binary-tree',
    title: 'Diameter of Binary Tree',
    difficulty: 'Easy',
    description: 'Diameter of Binary Tree. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    private int maxDiameter = 0;\n\n    public int diameterOfBinaryTree(TreeNode root) {\n        height(root);\n        return maxDiameter;\n    }\n\n    private int height(TreeNode node) {\n        if (node == null) return 0;\n        int leftH = height(node.left);\n        int rightH = height(node.right);\n        maxDiameter = Math.max(maxDiameter, leftH + rightH);\n        return 1 + Math.max(leftH, rightH);\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(h)' }
    }
  ]
  },
  {
    slug: 'balanced-binary-tree',
    title: 'Balanced Binary Tree',
    difficulty: 'Easy',
    description: 'Balanced Binary Tree. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public boolean isBalanced(TreeNode root) {\n        return checkHeight(root) != -1;\n    }\n\n    private int checkHeight(TreeNode node) {\n        if (node == null) return 0;\n        int left = checkHeight(node.left);\n        if (left == -1) return -1;\n        int right = checkHeight(node.right);\n        if (right == -1) return -1;\n        if (Math.abs(left - right) > 1) return -1;\n        return 1 + Math.max(left, right);\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(h)' }
    }
  ]
  },
  {
    slug: 'same-tree',
    title: 'Same Tree',
    difficulty: 'Easy',
    description: 'Same Tree. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Recursive DFS',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public boolean isSameTree(TreeNode p, TreeNode q) {\n        if (p == null && q == null) return true;\n        if (p == null || q == null || p.val != q.val) return false;\n        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(h)' }
    }
  ]
  },
  {
    slug: 'subtree-of-another-tree',
    title: 'Subtree of Another Tree',
    difficulty: 'Easy',
    description: 'Subtree of Another Tree. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Recursive Tree Matching',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public boolean isSubtree(TreeNode root, TreeNode subRoot) {\n        if (root == null) return false;\n        if (isSame(root, subRoot)) return true;\n        return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);\n    }\n\n    private boolean isSame(TreeNode s, TreeNode t) {\n        if (s == null && t == null) return true;\n        if (s == null || t == null || s.val != t.val) return false;\n        return isSame(s.left, t.left) && isSame(s.right, t.right);\n    }\n}",
      complexity: { time: 'O(n \\cdot m)', space: 'O(h)' }
    }
  ]
  },
  {
    slug: 'lowest-common-ancestor-of-a-binary-search-tree',
    title: 'Lowest Common Ancestor of a Binary Search Tree',
    difficulty: 'Medium',
    description: 'Lowest Common Ancestor of a Binary Search Tree. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        TreeNode curr = root;\n        while (curr != null) {\n            if (p.val > curr.val && q.val > curr.val) {\n                curr = curr.right;\n            } else if (p.val < curr.val && q.val < curr.val) {\n                curr = curr.left;\n            } else {\n                return curr; // Split point\n            }\n        }\n        return null;\n    }\n}",
      complexity: { time: 'O(h)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'binary-tree-level-order-traversal',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    description: 'Binary Tree Level Order Traversal. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        List<List<Integer>> res = new ArrayList<>();\n        if (root == null) return res;\n        Queue<TreeNode> queue = new LinkedList<>();\n        queue.offer(root);\n        while (!queue.isEmpty()) {\n            int levelSize = queue.size();\n            List<Integer> currentLevel = new ArrayList<>(levelSize);\n            for (int i = 0; i < levelSize; i++) {\n                TreeNode node = queue.poll();\n                currentLevel.add(node.val);\n                if (node.left != null) queue.offer(node.left);\n                if (node.right != null) queue.offer(node.right);\n            }\n            res.add(currentLevel);\n        }\n        return res;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(w)' }
    }
  ]
  },
  {
    slug: 'binary-tree-right-side-view',
    title: 'Binary Tree Right Side View',
    difficulty: 'Medium',
    description: 'Binary Tree Right Side View. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Traverse root $\\to$ right $\\to$ left. The first node visited at each depth level is the rightmost node.',
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public List<Integer> rightSideView(TreeNode root) {\n        List<Integer> res = new ArrayList<>();\n        dfs(root, 0, res);\n        return res;\n    }\n\n    private void dfs(TreeNode node, int depth, List<Integer> res) {\n        if (node == null) return;\n        if (depth == res.size()) {\n            res.add(node.val);\n        }\n        dfs(node.right, depth + 1, res);\n        dfs(node.left, depth + 1, res);\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(h)' }
    }
  ]
  },
  {
    slug: 'count-good-nodes-in-binary-tree',
    title: 'Count Good Nodes in Binary Tree',
    difficulty: 'Medium',
    description: 'Count Good Nodes in Binary Tree. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Preorder DFS Tracking Path Max',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int goodNodes(TreeNode root) {\n        return dfs(root, root.val);\n    }\n\n    private int dfs(TreeNode node, int maxSoFar) {\n        if (node == null) return 0;\n        int count = 0;\n        if (node.val >= maxSoFar) {\n            count = 1;\n            maxSoFar = node.val;\n        }\n        return count + dfs(node.left, maxSoFar) + dfs(node.right, maxSoFar);\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(h)' }
    }
  ]
  },
  {
    slug: 'validate-binary-search-tree',
    title: 'Validate Binary Search Tree',
    difficulty: 'Medium',
    description: 'Validate Binary Search Tree. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Recursive Range Constraints',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public boolean isValidBST(TreeNode root) {\n        return validate(root, null, null);\n    }\n\n    private boolean validate(TreeNode node, Integer min, Integer max) {\n        if (node == null) return true;\n        if ((min != null && node.val <= min) || (max != null && node.val >= max)) {\n            return false;\n        }\n        return validate(node.left, min, node.val) && validate(node.right, node.val, max);\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(h)' }
    },
    {
      label: 'Best',
      intuition: 'In-order traversal of a valid BST must produce strictly increasing values.',
      algorithm: undefined,
      code: "class Solution {\n    private Integer prev = null;\n\n    public boolean isValidBST(TreeNode root) {\n        if (root == null) return true;\n        if (!isValidBST(root.left)) return false;\n        if (prev != null && root.val <= prev) return false;\n        prev = root.val;\n        return isValidBST(root.right);\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(h)' }
    }
  ]
  },
  {
    slug: 'kth-smallest-element-in-a-bst',
    title: 'Kth Smallest Element in a BST',
    difficulty: 'Medium',
    description: 'Kth Smallest Element in a BST. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.Stack;\n\nclass Solution {\n    public int kthSmallest(TreeNode root, int k) {\n        Stack<TreeNode> stack = new Stack<>();\n        TreeNode curr = root;\n        while (curr != null || !stack.isEmpty()) {\n            while (curr != null) {\n                stack.push(curr);\n                curr = curr.left;\n            }\n            curr = stack.pop();\n            k--;\n            if (k == 0) return curr.val;\n            curr = curr.right;\n        }\n        return -1;\n    }\n}",
      complexity: { time: 'O(h + k)', space: 'O(h)' }
    }
  ]
  },
  {
    slug: 'construct-binary-tree-from-preorder-and-inorder-traversal',
    title: 'Construct Binary Tree from Preorder and Inorder Traversal',
    difficulty: 'Medium',
    description: 'Construct Binary Tree from Preorder and Inorder Traversal. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Preorder gives root first. Inorder separates left and right subtrees.',
      algorithm: undefined,
      code: "import java.util.HashMap;\nimport java.util.Map;\n\nclass Solution {\n    private int preIdx = 0;\n    private Map<Integer, Integer> inMap = new HashMap<>();\n\n    public TreeNode buildTree(int[] preorder, int[] inorder) {\n        for (int i = 0; i < inorder.length; i++) {\n            inMap.put(inorder[i], i);\n        }\n        return helper(preorder, 0, inorder.length - 1);\n    }\n\n    private TreeNode helper(int[] preorder, int inStart, int inEnd) {\n        if (inStart > inEnd) return null;\n        int rootVal = preorder[preIdx++];\n        TreeNode root = new TreeNode(rootVal);\n        int mid = inMap.get(rootVal);\n        root.left = helper(preorder, inStart, mid - 1);\n        root.right = helper(preorder, mid + 1, inEnd);\n        return root;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'binary-tree-maximum-path-sum',
    title: 'Binary Tree Maximum Path Sum',
    difficulty: 'Hard',
    description: 'Binary Tree Maximum Path Sum. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'At each node, compute max gain from left and right children (clamped to 0). Combined path through current node is `node.val + leftGain + rightGain`. Return single-branch gain `node.val + max(leftGain, rightGain)` to parent.',
      algorithm: undefined,
      code: "class Solution {\n    private int maxSum = Integer.MIN_VALUE;\n\n    public int maxPathSum(TreeNode root) {\n        gain(root);\n        return maxSum;\n    }\n\n    private int gain(TreeNode node) {\n        if (node == null) return 0;\n        int leftGain = Math.max(0, gain(node.left));\n        int rightGain = Math.max(0, gain(node.right));\n        maxSum = Math.max(maxSum, node.val + leftGain + rightGain);\n        return node.val + Math.max(leftGain, rightGain);\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(h)' }
    }
  ]
  },
  {
    slug: 'serialize-and-deserialize-binary-tree',
    title: 'Serialize and Deserialize Binary Tree',
    difficulty: 'Hard',
    description: 'Serialize and Deserialize Binary Tree. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\npublic class Codec {\n    // Encodes a tree to a single string.\n    public String serialize(TreeNode root) {\n        StringBuilder sb = new StringBuilder();\n        buildString(root, sb);\n        return sb.toString();\n    }\n\n    private void buildString(TreeNode node, StringBuilder sb) {\n        if (node == null) {\n            sb.append(\"N,\");\n            return;\n        }\n        sb.append(node.val).append(\",\");\n        buildString(node.left, sb);\n        buildString(node.right, sb);\n    }\n\n    // Decodes your encoded data to tree.\n    public TreeNode deserialize(String data) {\n        Queue<String> nodes = new LinkedList<>(Arrays.asList(data.split(\",\")));\n        return buildTree(nodes);\n    }\n\n    private TreeNode buildTree(Queue<String> nodes) {\n        String val = nodes.poll();\n        if (val.equals(\"N\")) return null;\n        TreeNode node = new TreeNode(Integer.parseInt(val));\n        node.left = buildTree(nodes);\n        node.right = buildTree(nodes);\n        return node;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'kth-largest-element-in-a-stream',
    title: 'Kth Largest Element in a Stream',
    difficulty: 'Easy',
    description: 'Kth Largest Element in a Stream. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.PriorityQueue;\n\nclass KthLargest {\n    private final PriorityQueue<Integer> minHeap;\n    private final int k;\n\n    public KthLargest(int k, int[] nums) {\n        this.k = k;\n        this.minHeap = new PriorityQueue<>(k);\n        for (int n : nums) {\n            add(n);\n        }\n    }\n\n    public int add(int val) {\n        if (minHeap.size() < k) {\n            minHeap.offer(val);\n        } else if (val > minHeap.peek()) {\n            minHeap.poll();\n            minHeap.offer(val);\n        }\n        return minHeap.peek();\n    }\n}",
      complexity: { time: 'Constructor O(n \\log k), `add` O(\\log k)', space: 'O(k)' }
    }
  ]
  },
  {
    slug: 'last-stone-weight',
    title: 'Last Stone Weight',
    difficulty: 'Easy',
    description: 'Last Stone Weight. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.PriorityQueue;\n\nclass Solution {\n    public int lastStoneWeight(int[] stones) {\n        PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> b - a);\n        for (int stone : stones) maxHeap.offer(stone);\n        while (maxHeap.size() > 1) {\n            int y = maxHeap.poll();\n            int x = maxHeap.poll();\n            if (y > x) maxHeap.offer(y - x);\n        }\n        return maxHeap.isEmpty() ? 0 : maxHeap.peek();\n    }\n}",
      complexity: { time: 'O(n \\log n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'k-closest-points-to-origin',
    title: 'K Closest Points to Origin',
    difficulty: 'Medium',
    description: 'K Closest Points to Origin. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Max-Heap of Size $k$',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.PriorityQueue;\n\nclass Solution {\n    public int[][] kClosest(int[][] points, int k) {\n        PriorityQueue<int[]> maxHeap = new PriorityQueue<>(\n            (a, b) -> (b[0] * b[0] + b[1] * b[1]) - (a[0] * a[0] + a[1] * a[1])\n        );\n        for (int[] p : points) {\n            maxHeap.offer(p);\n            if (maxHeap.size() > k) maxHeap.poll();\n        }\n        int[][] res = new int[k][2];\n        for (int i = 0; i < k; i++) res[i] = maxHeap.poll();\n        return res;\n    }\n}",
      complexity: { time: 'O(n \\log k)', space: 'O(k)' }
    }
  ]
  },
  {
    slug: 'kth-largest-element-in-an-array',
    title: 'Kth Largest Element in an Array',
    difficulty: 'Medium',
    description: 'Kth Largest Element in an Array. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Min-Heap of Size $k$',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.PriorityQueue;\n\nclass Solution {\n    public int findKthLargest(int[] nums, int k) {\n        PriorityQueue<Integer> minHeap = new PriorityQueue<>(k);\n        for (int n : nums) {\n            minHeap.offer(n);\n            if (minHeap.size() > k) minHeap.poll();\n        }\n        return minHeap.peek();\n    }\n}",
      complexity: { time: 'O(n \\log k)', space: 'O(k)' }
    },
    {
      label: 'Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.Random;\n\nclass Solution {\n    public int findKthLargest(int[] nums, int k) {\n        int targetIdx = nums.length - k;\n        return quickSelect(nums, 0, nums.length - 1, targetIdx);\n    }\n\n    private int quickSelect(int[] nums, int left, int right, int k) {\n        if (left == right) return nums[left];\n        int pivotIndex = left + new Random().nextInt(right - left + 1);\n        pivotIndex = partition(nums, left, right, pivotIndex);\n        if (pivotIndex == k) return nums[k];\n        else if (pivotIndex < k) return quickSelect(nums, pivotIndex + 1, right, k);\n        else return quickSelect(nums, left, pivotIndex - 1, k);\n    }\n\n    private int partition(int[] nums, int left, int right, int pivotIndex) {\n        int pivot = nums[pivotIndex];\n        swap(nums, pivotIndex, right);\n        int storeIdx = left;\n        for (int i = left; i < right; i++) {\n            if (nums[i] < pivot) {\n                swap(nums, storeIdx, i);\n                storeIdx++;\n            }\n        }\n        swap(nums, storeIdx, right);\n        return storeIdx;\n    }\n\n    private void swap(int[] nums, int i, int j) {\n        int tmp = nums[i]; nums[i] = nums[j]; nums[j] = tmp;\n    }\n}",
      complexity: { time: 'Average O(n), Worst O(n^2)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'task-scheduler',
    title: 'Task Scheduler',
    difficulty: 'Medium',
    description: 'Task Scheduler. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'The task with the maximum frequency `maxFreq` forms `(maxFreq - 1)` chunks of size `(n + 1)`. Total slots = $\\max(\\text{tasks.length}, (\\text{maxFreq} - 1) \\times (n + 1) + \\text{countMaxFreq})$.',
      algorithm: undefined,
      code: "class Solution {\n    public int leastInterval(char[] tasks, int n) {\n        int[] count = new int[26];\n        int maxFreq = 0;\n        for (char c : tasks) {\n            count[c - 'A']++;\n            maxFreq = Math.max(maxFreq, count[c - 'A']);\n        }\n        int maxCount = 0;\n        for (int c : count) {\n            if (c == maxFreq) maxCount++;\n        }\n        int emptySlots = (maxFreq - 1) * (n + 1) + maxCount;\n        return Math.max(tasks.length, emptySlots);\n    }\n}",
      complexity: { time: 'O(\\text{tasks.length})', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'design-twitter',
    title: 'Design Twitter',
    difficulty: 'Medium',
    description: 'Design Twitter. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Twitter {\n    private static int timestamp = 0;\n\n    private static class Tweet {\n        int id, time;\n        Tweet next;\n        Tweet(int id, int time) { this.id = id; this.time = time; }\n    }\n\n    private static class User {\n        int id;\n        Set<Integer> followed;\n        Tweet tweetHead;\n        User(int id) {\n            this.id = id;\n            followed = new HashSet<>();\n            follow(id); // Follow self\n        }\n        void follow(int id) { followed.add(id); }\n        void unfollow(int id) { followed.remove(id); }\n        void post(int id) {\n            Tweet t = new Tweet(id, timestamp++);\n            t.next = tweetHead;\n            tweetHead = t;\n        }\n    }\n\n    private Map<Integer, User> userMap = new HashMap<>();\n\n    public Twitter() {}\n\n    public void postTweet(int userId, int tweetId) {\n        userMap.computeIfAbsent(userId, User::new).post(tweetId);\n    }\n\n    public List<Integer> getNewsFeed(int userId) {\n        List<Integer> res = new ArrayList<>();\n        if (!userMap.containsKey(userId)) return res;\n        Set<Integer> users = userMap.get(userId).followed;\n        PriorityQueue<Tweet> pq = new PriorityQueue<>((a, b) -> b.time - a.time);\n        for (int uid : users) {\n            User u = userMap.get(uid);\n            if (u != null && u.tweetHead != null) {\n                pq.offer(u.tweetHead);\n            }\n        }\n        int count = 0;\n        while (!pq.isEmpty() && count < 10) {\n            Tweet t = pq.poll();\n            res.add(t.id);\n            count++;\n            if (t.next != null) pq.offer(t.next);\n        }\n        return res;\n    }\n\n    public void follow(int followerId, int followeeId) {\n        userMap.computeIfAbsent(followerId, User::new);\n        userMap.computeIfAbsent(followeeId, User::new);\n        userMap.get(followerId).follow(followeeId);\n    }\n\n    public void unfollow(int followerId, int followeeId) {\n        if (userMap.containsKey(followerId) && followerId != followeeId) {\n            userMap.get(followerId).unfollow(followeeId);\n        }\n    }\n}",
      complexity: { time: '`postTweet`, `follow`, `unfollow`: O(1); `getNewsFeed`: O(F \\log F + 10 \\log F) where F is followed users', space: 'O(U + T)' }
    }
  ]
  },
  {
    slug: 'find-median-from-data-stream',
    title: 'Find Median from Data Stream',
    difficulty: 'Hard',
    description: 'Find Median from Data Stream. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.PriorityQueue;\n\nclass MedianFinder {\n    private PriorityQueue<Integer> small; // Max-heap (stores smaller half)\n    private PriorityQueue<Integer> large; // Min-heap (stores larger half)\n\n    public MedianFinder() {\n        small = new PriorityQueue<>((a, b) -> b - a);\n        large = new PriorityQueue<>();\n    }\n\n    public void addNum(int num) {\n        small.offer(num);\n        large.offer(small.poll());\n        if (large.size() > small.size()) {\n            small.offer(large.poll());\n        }\n    }\n\n    public double findMedian() {\n        if (small.size() > large.size()) {\n            return small.peek();\n        } else {\n            return (small.peek() + large.peek()) / 2.0;\n        }\n    }\n}",
      complexity: { time: '`addNum`: O(\\log n), `findMedian`: O(1)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'subsets',
    title: 'Subsets',
    difficulty: 'Medium',
    description: 'Subsets. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Backtracking',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        List<List<Integer>> res = new ArrayList<>();\n        backtrack(nums, 0, new ArrayList<>(), res);\n        return res;\n    }\n\n    private void backtrack(int[] nums, int start, List<Integer> curr, List<List<Integer>> res) {\n        res.add(new ArrayList<>(curr));\n        for (int i = start; i < nums.length; i++) {\n            curr.add(nums[i]);\n            backtrack(nums, i + 1, curr, res);\n            curr.remove(curr.size() - 1);\n        }\n    }\n}",
      complexity: { time: 'O(n \\cdot 2^n)', space: 'O(n)' }
    },
    {
      label: 'Bit Manipulation',
      intuition: 'Each subset corresponds to an integer from $0$ to $2^n - 1$.',
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        int n = nums.length;\n        int total = 1 << n;\n        List<List<Integer>> res = new ArrayList<>(total);\n        for (int mask = 0; mask < total; mask++) {\n            List<Integer> sub = new ArrayList<>();\n            for (int i = 0; i < n; i++) {\n                if ((mask & (1 << i)) != 0) sub.add(nums[i]);\n            }\n            res.add(sub);\n        }\n        return res;\n    }\n}",
      complexity: { time: 'O(n \\cdot 2^n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'combination-sum',
    title: 'Combination Sum',
    difficulty: 'Medium',
    description: 'Combination Sum. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> combinationSum(int[] candidates, int target) {\n        List<List<Integer>> res = new ArrayList<>();\n        Arrays.sort(candidates);\n        backtrack(candidates, 0, target, new ArrayList<>(), res);\n        return res;\n    }\n\n    private void backtrack(int[] candidates, int start, int remain, List<Integer> curr, List<List<Integer>> res) {\n        if (remain == 0) {\n            res.add(new ArrayList<>(curr));\n            return;\n        }\n        for (int i = start; i < candidates.length; i++) {\n            if (candidates[i] > remain) break; // Pruning\n            curr.add(candidates[i]);\n            backtrack(candidates, i, remain - candidates[i], curr, res); // Reuse index i\n            curr.remove(curr.size() - 1);\n        }\n    }\n}",
      complexity: { time: 'O(2^{\\text{target} / \\min})', space: 'O(\\text{target} / \\min)' }
    }
  ]
  },
  {
    slug: 'combination-sum-ii',
    title: 'Combination Sum II',
    difficulty: 'Medium',
    description: 'Combination Sum II. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> combinationSum2(int[] candidates, int target) {\n        List<List<Integer>> res = new ArrayList<>();\n        Arrays.sort(candidates);\n        backtrack(candidates, 0, target, new ArrayList<>(), res);\n        return res;\n    }\n\n    private void backtrack(int[] candidates, int start, int remain, List<Integer> curr, List<List<Integer>> res) {\n        if (remain == 0) {\n            res.add(new ArrayList<>(curr));\n            return;\n        }\n        for (int i = start; i < candidates.length; i++) {\n            if (candidates[i] > remain) break;\n            if (i > start && candidates[i] == candidates[i - 1]) continue; // Skip duplicates\n            curr.add(candidates[i]);\n            backtrack(candidates, i + 1, remain - candidates[i], curr, res);\n            curr.remove(curr.size() - 1);\n        }\n    }\n}",
      complexity: { time: 'O(2^n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'permutations',
    title: 'Permutations',
    difficulty: 'Medium',
    description: 'Permutations. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Backtracking with Visited Boolean Array',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> permute(int[] nums) {\n        List<List<Integer>> res = new ArrayList<>();\n        boolean[] used = new boolean[nums.length];\n        backtrack(nums, used, new ArrayList<>(), res);\n        return res;\n    }\n\n    private void backtrack(int[] nums, boolean[] used, List<Integer> curr, List<List<Integer>> res) {\n        if (curr.size() == nums.length) {\n            res.add(new ArrayList<>(curr));\n            return;\n        }\n        for (int i = 0; i < nums.length; i++) {\n            if (used[i]) continue;\n            used[i] = true;\n            curr.add(nums[i]);\n            backtrack(nums, used, curr, res);\n            curr.remove(curr.size() - 1);\n            used[i] = false;\n        }\n    }\n}",
      complexity: { time: 'O(n \\cdot n!)', space: 'O(n)' }
    },
    {
      label: 'Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> permute(int[] nums) {\n        List<List<Integer>> res = new ArrayList<>();\n        backtrack(nums, 0, res);\n        return res;\n    }\n\n    private void backtrack(int[] nums, int start, List<List<Integer>> res) {\n        if (start == nums.length) {\n            List<Integer> list = new ArrayList<>();\n            for (int n : nums) list.add(n);\n            res.add(list);\n            return;\n        }\n        for (int i = start; i < nums.length; i++) {\n            swap(nums, start, i);\n            backtrack(nums, start + 1, res);\n            swap(nums, start, i);\n        }\n    }\n\n    private void swap(int[] nums, int i, int j) {\n        int t = nums[i]; nums[i] = nums[j]; nums[j] = t;\n    }\n}",
      complexity: { time: 'O(n \\cdot n!)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'subsets-ii',
    title: 'Subsets II',
    difficulty: 'Medium',
    description: 'Subsets II. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> subsetsWithDup(int[] nums) {\n        List<List<Integer>> res = new ArrayList<>();\n        Arrays.sort(nums);\n        backtrack(nums, 0, new ArrayList<>(), res);\n        return res;\n    }\n\n    private void backtrack(int[] nums, int start, List<Integer> curr, List<List<Integer>> res) {\n        res.add(new ArrayList<>(curr));\n        for (int i = start; i < nums.length; i++) {\n            if (i > start && nums[i] == nums[i - 1]) continue;\n            curr.add(nums[i]);\n            backtrack(nums, i + 1, curr, res);\n            curr.remove(curr.size() - 1);\n        }\n    }\n}",
      complexity: { time: 'O(n \\cdot 2^n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'word-search',
    title: 'Word Search',
    difficulty: 'Medium',
    description: 'Word Search. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public boolean exist(char[][] board, String word) {\n        int m = board.length, n = board[0].length;\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                if (board[r][c] == word.charAt(0) && dfs(board, r, c, word, 0)) {\n                    return true;\n                }\n            }\n        }\n        return false;\n    }\n\n    private boolean dfs(char[][] board, int r, int c, String word, int idx) {\n        if (idx == word.length()) return true;\n        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length || board[r][c] != word.charAt(idx)) {\n            return false;\n        }\n        char temp = board[r][c];\n        board[r][c] = '#'; // Mark visited\n        boolean found = dfs(board, r + 1, c, word, idx + 1) ||\n                        dfs(board, r - 1, c, word, idx + 1) ||\n                        dfs(board, r, c + 1, word, idx + 1) ||\n                        dfs(board, r, c - 1, word, idx + 1);\n        board[r][c] = temp; // Backtrack\n        return found;\n    }\n}",
      complexity: { time: 'O(m \\cdot n \\cdot 3^L)', space: 'O(L)' }
    }
  ]
  },
  {
    slug: 'palindrome-partitioning',
    title: 'Palindrome Partitioning',
    difficulty: 'Medium',
    description: 'Palindrome Partitioning. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Backtracking with Two-Pointer Palindrome Check',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public List<List<String>> partition(String s) {\n        List<List<String>> res = new ArrayList<>();\n        backtrack(s, 0, new ArrayList<>(), res);\n        return res;\n    }\n\n    private void backtrack(String s, int start, List<String> curr, List<List<String>> res) {\n        if (start == s.length()) {\n            res.add(new ArrayList<>(curr));\n            return;\n        }\n        for (int end = start; end < s.length(); end++) {\n            if (isPalindrome(s, start, end)) {\n                curr.add(s.substring(start, end + 1));\n                backtrack(s, end + 1, curr, res);\n                curr.remove(curr.size() - 1);\n            }\n        }\n    }\n\n    private boolean isPalindrome(String s, int l, int r) {\n        while (l < r) {\n            if (s.charAt(l++) != s.charAt(r--)) return false;\n        }\n        return true;\n    }\n}",
      complexity: { time: 'O(n \\cdot 2^n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'letter-combinations-of-a-phone-number',
    title: 'Letter Combinations of a Phone Number',
    difficulty: 'Medium',
    description: 'Letter Combinations of a Phone Number. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    private static final String[] MAPPING = {\n        \"\", \"\", \"abc\", \"def\", \"ghi\", \"jkl\", \"mno\", \"pqrs\", \"tuv\", \"wxyz\"\n    };\n\n    public List<String> letterCombinations(String digits) {\n        List<String> res = new ArrayList<>();\n        if (digits == null || digits.isEmpty()) return res;\n        dfs(digits, 0, new StringBuilder(), res);\n        return res;\n    }\n\n    private void dfs(String digits, int idx, StringBuilder sb, List<String> res) {\n        if (idx == digits.length()) {\n            res.add(sb.toString());\n            return;\n        }\n        String letters = MAPPING[digits.charAt(idx) - '0'];\n        for (char c : letters.toCharArray()) {\n            sb.append(c);\n            dfs(digits, idx + 1, sb, res);\n            sb.deleteCharAt(sb.length() - 1);\n        }\n    }\n}",
      complexity: { time: 'O(4^n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'n-queens',
    title: 'N-Queens',
    difficulty: 'Hard',
    description: 'N-Queens. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public List<List<String>> solveNQueens(int n) {\n        List<List<String>> res = new ArrayList<>();\n        char[][] board = new char[n][n];\n        for (char[] row : board) Arrays.fill(row, '.');\n        boolean[] cols = new boolean[n];\n        boolean[] diag1 = new boolean[2 * n]; // r - c + n\n        boolean[] diag2 = new boolean[2 * n]; // r + c\n        backtrack(0, n, board, cols, diag1, diag2, res);\n        return res;\n    }\n\n    private void backtrack(int r, int n, char[][] board, boolean[] cols, boolean[] d1, boolean[] d2, List<List<String>> res) {\n        if (r == n) {\n            List<String> list = new ArrayList<>();\n            for (char[] row : board) list.add(new String(row));\n            res.add(list);\n            return;\n        }\n        for (int c = 0; c < n; c++) {\n            if (cols[c] || d1[r - c + n] || d2[r + c]) continue;\n            board[r][c] = 'Q';\n            cols[c] = d1[r - c + n] = d2[r + c] = true;\n            backtrack(r + 1, n, board, cols, d1, d2, res);\n            board[r][c] = '.';\n            cols[c] = d1[r - c + n] = d2[r + c] = false;\n        }\n    }\n}",
      complexity: { time: 'O(n!)', space: 'O(n^2)' }
    }
  ]
  },
  {
    slug: 'implement-trie-prefix-tree',
    title: 'Implement Trie (Prefix Tree)',
    difficulty: 'Medium',
    description: 'Implement Trie (Prefix Tree). Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Trie {\n    private static class Node {\n        Node[] children = new Node[26];\n        boolean isEnd = false;\n    }\n\n    private final Node root;\n\n    public Trie() {\n        root = new Node();\n    }\n\n    public void insert(String word) {\n        Node curr = root;\n        for (char c : word.toCharArray()) {\n            int idx = c - 'a';\n            if (curr.children[idx] == null) {\n                curr.children[idx] = new Node();\n            }\n            curr = curr.children[idx];\n        }\n        curr.isEnd = true;\n    }\n\n    public boolean search(String word) {\n        Node node = find(word);\n        return node != null && node.isEnd;\n    }\n\n    public boolean startsWith(String prefix) {\n        return find(prefix) != null;\n    }\n\n    private Node find(String s) {\n        Node curr = root;\n        for (char c : s.toCharArray()) {\n            int idx = c - 'a';\n            if (curr.children[idx] == null) return null;\n            curr = curr.children[idx];\n        }\n        return curr;\n    }\n}",
      complexity: { time: '`insert`, `search`, `startsWith`: O(L) where L is word length', space: 'O(26 \\cdot \\Sigma L)' }
    }
  ]
  },
  {
    slug: 'design-add-and-search-words-data-structure',
    title: 'Design Add and Search Words Data Structure',
    difficulty: 'Medium',
    description: 'Design Add and Search Words Data Structure. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class WordDictionary {\n    private static class Node {\n        Node[] children = new Node[26];\n        boolean isEnd = false;\n    }\n\n    private final Node root;\n\n    public WordDictionary() {\n        root = new Node();\n    }\n\n    public void addWord(String word) {\n        Node curr = root;\n        for (char c : word.toCharArray()) {\n            int idx = c - 'a';\n            if (curr.children[idx] == null) curr.children[idx] = new Node();\n            curr = curr.children[idx];\n        }\n        curr.isEnd = true;\n    }\n\n    public boolean search(String word) {\n        return match(word, 0, root);\n    }\n\n    private boolean match(String word, int idx, Node node) {\n        if (node == null) return false;\n        if (idx == word.length()) return node.isEnd;\n        char c = word.charAt(idx);\n        if (c == '.') {\n            for (Node child : node.children) {\n                if (child != null && match(word, idx + 1, child)) return true;\n            }\n            return false;\n        } else {\n            return match(word, idx + 1, node.children[c - 'a']);\n        }\n    }\n}",
      complexity: { time: '`addWord`: O(L); `search`: O(L) for exact, O(26^L) worst wildcard', space: 'O(26 \\cdot \\Sigma L)' }
    }
  ]
  },
  {
    slug: 'word-search-ii',
    title: 'Word Search II',
    difficulty: 'Hard',
    description: 'Word Search II. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    private static class TrieNode {\n        TrieNode[] children = new TrieNode[26];\n        String word = null;\n    }\n\n    public List<String> findWords(char[][] board, String[] words) {\n        TrieNode root = new TrieNode();\n        for (String w : words) {\n            TrieNode curr = root;\n            for (char c : w.toCharArray()) {\n                int idx = c - 'a';\n                if (curr.children[idx] == null) curr.children[idx] = new TrieNode();\n                curr = curr.children[idx];\n            }\n            curr.word = w;\n        }\n\n        List<String> res = new ArrayList<>();\n        int m = board.length, n = board[0].length;\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                dfs(board, r, c, root, res);\n            }\n        }\n        return res;\n    }\n\n    private void dfs(char[][] board, int r, int c, TrieNode node, List<String> res) {\n        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length || board[r][c] == '#') return;\n        char ch = board[r][c];\n        int idx = ch - 'a';\n        if (node.children[idx] == null) return;\n        TrieNode nextNode = node.children[idx];\n        if (nextNode.word != null) {\n            res.add(nextNode.word);\n            nextNode.word = null; // Prevent duplicates\n        }\n\n        board[r][c] = '#';\n        dfs(board, r + 1, c, nextNode, res);\n        dfs(board, r - 1, c, nextNode, res);\n        dfs(board, r, c + 1, nextNode, res);\n        dfs(board, r, c - 1, nextNode, res);\n        board[r][c] = ch;\n    }\n}",
      complexity: { time: 'O(m \\cdot n \\cdot 4^{L})', space: 'O(\\Sigma L)' }
    }
  ]
  },
  {
    slug: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'Medium',
    description: 'Number of Islands. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int numIslands(char[][] grid) {\n        int m = grid.length, n = grid[0].length;\n        int count = 0;\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                if (grid[r][c] == '1') {\n                    count++;\n                    sink(grid, r, c);\n                }\n            }\n        }\n        return count;\n    }\n\n    private void sink(char[][] grid, int r, int c) {\n        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') return;\n        grid[r][c] = '0';\n        sink(grid, r + 1, c);\n        sink(grid, r - 1, c);\n        sink(grid, r, c + 1);\n        sink(grid, r, c - 1);\n    }\n}",
      complexity: { time: 'O(m \\cdot n)', space: 'O(m \\cdot n)' }
    }
  ]
  },
  {
    slug: 'max-area-of-island',
    title: 'Max Area of Island',
    difficulty: 'Medium',
    description: 'Max Area of Island. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int maxAreaOfIsland(int[][] grid) {\n        int maxArea = 0;\n        for (int r = 0; r < grid.length; r++) {\n            for (int c = 0; c < grid[0].length; c++) {\n                if (grid[r][c] == 1) {\n                    maxArea = Math.max(maxArea, area(grid, r, c));\n                }\n            }\n        }\n        return maxArea;\n    }\n\n    private int area(int[][] grid, int r, int c) {\n        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != 1) return 0;\n        grid[r][c] = 0;\n        return 1 + area(grid, r + 1, c) + area(grid, r - 1, c) + area(grid, r, c + 1) + area(grid, r, c - 1);\n    }\n}",
      complexity: { time: 'O(m \\cdot n)', space: 'O(m \\cdot n)' }
    }
  ]
  },
  {
    slug: 'clone-graph',
    title: 'Clone Graph',
    difficulty: 'Medium',
    description: 'Clone Graph. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    private Map<Node, Node> visited = new HashMap<>();\n\n    public Node cloneGraph(Node node) {\n        if (node == null) return null;\n        if (visited.containsKey(node)) return visited.get(node);\n        Node clone = new Node(node.val);\n        visited.put(node, clone);\n        for (Node neighbor : node.neighbors) {\n            clone.neighbors.add(cloneGraph(neighbor));\n        }\n        return clone;\n    }\n}",
      complexity: { time: 'O(V + E)', space: 'O(V)' }
    }
  ]
  },
  {
    slug: 'walls-and-gates',
    title: 'Walls and Gates',
    difficulty: 'Medium',
    description: 'Walls and Gates. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.LinkedList;\nimport java.util.Queue;\n\nclass Solution {\n    public void wallsAndGates(int[][] rooms) {\n        int m = rooms.length, n = rooms[0].length;\n        Queue<int[]> queue = new LinkedList<>();\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                if (rooms[r][c] == 0) queue.offer(new int[]{r, c});\n            }\n        }\n        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};\n        while (!queue.isEmpty()) {\n            int[] cell = queue.poll();\n            int r = cell[0], c = cell[1];\n            for (int[] d : dirs) {\n                int nr = r + d[0], nc = c + d[1];\n                if (nr >= 0 && nr < m && nc >= 0 && nc < n && rooms[nr][nc] == Integer.MAX_VALUE) {\n                    rooms[nr][nc] = rooms[r][c] + 1;\n                    queue.offer(new int[]{nr, nc});\n                }\n            }\n        }\n    }\n}",
      complexity: { time: 'O(m \\cdot n)', space: 'O(m \\cdot n)' }
    }
  ]
  },
  {
    slug: 'rotting-oranges',
    title: 'Rotting Oranges',
    difficulty: 'Medium',
    description: 'Rotting Oranges. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.LinkedList;\nimport java.util.Queue;\n\nclass Solution {\n    public int orangesRotting(int[][] grid) {\n        int m = grid.length, n = grid[0].length;\n        Queue<int[]> queue = new LinkedList<>();\n        int fresh = 0;\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                if (grid[r][c] == 2) queue.offer(new int[]{r, c});\n                else if (grid[r][c] == 1) fresh++;\n            }\n        }\n        if (fresh == 0) return 0;\n        int minutes = 0;\n        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};\n        while (!queue.isEmpty() && fresh > 0) {\n            int size = queue.size();\n            for (int i = 0; i < size; i++) {\n                int[] curr = queue.poll();\n                for (int[] d : dirs) {\n                    int nr = curr[0] + d[0], nc = curr[1] + d[1];\n                    if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] == 1) {\n                        grid[nr][nc] = 2;\n                        fresh--;\n                        queue.offer(new int[]{nr, nc});\n                    }\n                }\n            }\n            minutes++;\n        }\n        return fresh == 0 ? minutes : -1;\n    }\n}",
      complexity: { time: 'O(m \\cdot n)', space: 'O(m \\cdot n)' }
    }
  ]
  },
  {
    slug: 'pacific-atlantic-water-flow',
    title: 'Pacific Atlantic Water Flow',
    difficulty: 'Medium',
    description: 'Pacific Atlantic Water Flow. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> pacificAtlantic(int[][] heights) {\n        List<List<Integer>> res = new ArrayList<>();\n        int m = heights.length, n = heights[0].length;\n        boolean[][] pac = new boolean[m][n];\n        boolean[][] atl = new boolean[m][n];\n        for (int i = 0; i < m; i++) {\n            dfs(heights, i, 0, pac, heights[i][0]);\n            dfs(heights, i, n - 1, atl, heights[i][n - 1]);\n        }\n        for (int j = 0; j < n; j++) {\n            dfs(heights, 0, j, pac, heights[0][j]);\n            dfs(heights, m - 1, j, atl, heights[m - 1][j]);\n        }\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                if (pac[r][c] && atl[r][c]) {\n                    res.add(Arrays.asList(r, c));\n                }\n            }\n        }\n        return res;\n    }\n\n    private void dfs(int[][] h, int r, int c, boolean[][] visited, int prevH) {\n        if (r < 0 || r >= h.length || c < 0 || c >= h[0].length || visited[r][c] || h[r][c] < prevH) return;\n        visited[r][c] = true;\n        dfs(h, r + 1, c, visited, h[r][c]);\n        dfs(h, r - 1, c, visited, h[r][c]);\n        dfs(h, r, c + 1, visited, h[r][c]);\n        dfs(h, r, c - 1, visited, h[r][c]);\n    }\n}",
      complexity: { time: 'O(m \\cdot n)', space: 'O(m \\cdot n)' }
    }
  ]
  },
  {
    slug: 'surrounded-regions',
    title: 'Surrounded Regions',
    difficulty: 'Medium',
    description: 'Surrounded Regions. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public void solve(char[][] board) {\n        int m = board.length, n = board[0].length;\n        for (int i = 0; i < m; i++) {\n            if (board[i][0] == 'O') dfs(board, i, 0);\n            if (board[i][n - 1] == 'O') dfs(board, i, n - 1);\n        }\n        for (int j = 0; j < n; j++) {\n            if (board[0][j] == 'O') dfs(board, 0, j);\n            if (board[m - 1][j] == 'O') dfs(board, m - 1, j);\n        }\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                if (board[r][c] == 'O') board[r][c] = 'X';\n                else if (board[r][c] == 'E') board[r][c] = 'O';\n            }\n        }\n    }\n\n    private void dfs(char[][] board, int r, int c) {\n        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length || board[r][c] != 'O') return;\n        board[r][c] = 'E'; // Mark escaped\n        dfs(board, r + 1, c);\n        dfs(board, r - 1, c);\n        dfs(board, r, c + 1);\n        dfs(board, r, c - 1);\n    }\n}",
      complexity: { time: 'O(m \\cdot n)', space: 'O(m \\cdot n)' }
    }
  ]
  },
  {
    slug: 'number-of-connected-components-in-an-undirected-graph',
    title: 'Number of Connected Components in an Undirected Graph',
    difficulty: 'Medium',
    description: 'Number of Connected Components in an Undirected Graph. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int countComponents(int n, int[][] edges) {\n        int[] parent = new int[n];\n        for (int i = 0; i < n; i++) parent[i] = i;\n        int components = n;\n        for (int[] edge : edges) {\n            int r1 = find(parent, edge[0]);\n            int r2 = find(parent, edge[1]);\n            if (r1 != r2) {\n                parent[r1] = r2;\n                components--;\n            }\n        }\n        return components;\n    }\n\n    private int find(int[] parent, int i) {\n        if (parent[i] == i) return i;\n        return parent[i] = find(parent, parent[i]);\n    }\n}",
      complexity: { time: 'O(E \\cdot \\alpha(V))', space: 'O(V)' }
    }
  ]
  },
  {
    slug: 'graph-valid-tree',
    title: 'Graph Valid Tree',
    difficulty: 'Medium',
    description: 'Graph Valid Tree. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public boolean validTree(int n, int[][] edges) {\n        if (edges.length != n - 1) return false;\n        int[] parent = new int[n];\n        for (int i = 0; i < n; i++) parent[i] = i;\n        for (int[] e : edges) {\n            int p1 = find(parent, e[0]);\n            int p2 = find(parent, e[1]);\n            if (p1 == p2) return false; // Cycle detected\n            parent[p1] = p2;\n        }\n        return true;\n    }\n\n    private int find(int[] parent, int i) {\n        if (parent[i] == i) return i;\n        return parent[i] = find(parent, parent[i]);\n    }\n}",
      complexity: { time: 'O(V \\cdot \\alpha(V))', space: 'O(V)' }
    }
  ]
  },
  {
    slug: 'word-ladder',
    title: 'Word Ladder',
    difficulty: 'Hard',
    description: 'Word Ladder. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'BFS with Word Mutation',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public int ladderLength(String beginWord, String endWord, List<String> wordList) {\n        Set<String> wordSet = new HashSet<>(wordList);\n        if (!wordSet.contains(endWord)) return 0;\n        Queue<String> queue = new LinkedList<>();\n        queue.offer(beginWord);\n        int level = 1;\n        while (!queue.isEmpty()) {\n            int size = queue.size();\n            for (int i = 0; i < size; i++) {\n                char[] curr = queue.poll().toCharArray();\n                for (int j = 0; j < curr.length; j++) {\n                    char orig = curr[j];\n                    for (char c = 'a'; c <= 'z'; c++) {\n                        curr[j] = c;\n                        String next = new String(curr);\n                        if (next.equals(endWord)) return level + 1;\n                        if (wordSet.remove(next)) {\n                            queue.offer(next);\n                        }\n                    }\n                    curr[j] = orig;\n                }\n            }\n            level++;\n        }\n        return 0;\n    }\n}",
      complexity: { time: 'O(M^2 \\cdot N)', space: 'O(M \\cdot N)' }
    }
  ]
  },
  {
    slug: 'course-schedule',
    title: 'Course Schedule',
    difficulty: 'Medium',
    description: 'Course Schedule. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        List<List<Integer>> adj = new ArrayList<>();\n        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());\n        int[] inDegree = new int[numCourses];\n        for (int[] p : prerequisites) {\n            adj.get(p[1]).add(p[0]);\n            inDegree[p[0]]++;\n        }\n        Queue<Integer> queue = new LinkedList<>();\n        for (int i = 0; i < numCourses; i++) {\n            if (inDegree[i] == 0) queue.offer(i);\n        }\n        int processed = 0;\n        while (!queue.isEmpty()) {\n            int curr = queue.poll();\n            processed++;\n            for (int next : adj.get(curr)) {\n                if (--inDegree[next] == 0) queue.offer(next);\n            }\n        }\n        return processed == numCourses;\n    }\n}",
      complexity: { time: 'O(V + E)', space: 'O(V + E)' }
    }
  ]
  },
  {
    slug: 'course-schedule-ii',
    title: 'Course Schedule II',
    difficulty: 'Medium',
    description: 'Course Schedule II. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public int[] findOrder(int numCourses, int[][] prerequisites) {\n        List<List<Integer>> adj = new ArrayList<>();\n        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());\n        int[] inDegree = new int[numCourses];\n        for (int[] p : prerequisites) {\n            adj.get(p[1]).add(p[0]);\n            inDegree[p[0]]++;\n        }\n        Queue<Integer> queue = new LinkedList<>();\n        for (int i = 0; i < numCourses; i++) {\n            if (inDegree[i] == 0) queue.offer(i);\n        }\n        int[] order = new int[numCourses];\n        int idx = 0;\n        while (!queue.isEmpty()) {\n            int curr = queue.poll();\n            order[idx++] = curr;\n            for (int next : adj.get(curr)) {\n                if (--inDegree[next] == 0) queue.offer(next);\n            }\n        }\n        return idx == numCourses ? order : new int[0];\n    }\n}",
      complexity: { time: 'O(V + E)', space: 'O(V + E)' }
    }
  ]
  },
  {
    slug: 'redundant-connection',
    title: 'Redundant Connection',
    difficulty: 'Medium',
    description: 'Redundant Connection. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int[] findRedundantConnection(int[][] edges) {\n        int n = edges.length;\n        int[] parent = new int[n + 1];\n        for (int i = 1; i <= n; i++) parent[i] = i;\n        for (int[] edge : edges) {\n            int p1 = find(parent, edge[0]);\n            int p2 = find(parent, edge[1]);\n            if (p1 == p2) return edge; // Redundant edge closing a cycle\n            parent[p1] = p2;\n        }\n        return new int[0];\n    }\n\n    private int find(int[] parent, int i) {\n        if (parent[i] == i) return i;\n        return parent[i] = find(parent, parent[i]);\n    }\n}",
      complexity: { time: 'O(V \\cdot \\alpha(V))', space: 'O(V)' }
    }
  ]
  },
  {
    slug: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    description: 'Climbing Stairs. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int climbStairs(int n) {\n        if (n <= 2) return n;\n        int prev2 = 1, prev1 = 2;\n        for (int i = 3; i <= n; i++) {\n            int curr = prev1 + prev2;\n            prev2 = prev1;\n            prev1 = curr;\n        }\n        return prev1;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'min-cost-climbing-stairs',
    title: 'Min Cost Climbing Stairs',
    difficulty: 'Easy',
    description: 'Min Cost Climbing Stairs. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int minCostClimbingStairs(int[] cost) {\n        int downOne = 0, downTwo = 0;\n        for (int i = 2; i <= cost.length; i++) {\n            int curr = Math.min(downOne + cost[i - 1], downTwo + cost[i - 2]);\n            downTwo = downOne;\n            downOne = curr;\n        }\n        return downOne;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'house-robber',
    title: 'House Robber',
    difficulty: 'Medium',
    description: 'House Robber. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int rob(int[] nums) {\n        int rob1 = 0, rob2 = 0;\n        for (int num : nums) {\n            int newRob = Math.max(rob1 + num, rob2);\n            rob1 = rob2;\n            rob2 = newRob;\n        }\n        return rob2;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'house-robber-ii',
    title: 'House Robber II',
    difficulty: 'Medium',
    description: 'House Robber II. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Compare stealing from houses $0$ to $n-2$ vs houses $1$ to $n-1$.',
      algorithm: undefined,
      code: "class Solution {\n    public int rob(int[] nums) {\n        if (nums.length == 1) return nums[0];\n        return Math.max(robSimple(nums, 0, nums.length - 2), robSimple(nums, 1, nums.length - 1));\n    }\n\n    private int robSimple(int[] nums, int start, int end) {\n        int rob1 = 0, rob2 = 0;\n        for (int i = start; i <= end; i++) {\n            int newRob = Math.max(rob1 + nums[i], rob2);\n            rob1 = rob2;\n            rob2 = newRob;\n        }\n        return rob2;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'longest-palindromic-substring',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    description: 'Longest Palindromic Substring. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public String longestPalindrome(String s) {\n        if (s == null || s.length() < 1) return \"\";\n        int start = 0, end = 0;\n        for (int i = 0; i < s.length(); i++) {\n            int len1 = expand(s, i, i);     // Odd length\n            int len2 = expand(s, i, i + 1); // Even length\n            int len = Math.max(len1, len2);\n            if (len > end - start) {\n                start = i - (len - 1) / 2;\n                end = i + len / 2;\n            }\n        }\n        return s.substring(start, end + 1);\n    }\n\n    private int expand(String s, int left, int right) {\n        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {\n            left--;\n            right++;\n        }\n        return right - left - 1;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'palindromic-substrings',
    title: 'Palindromic Substrings',
    difficulty: 'Medium',
    description: 'Palindromic Substrings. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int countSubstrings(String s) {\n        int count = 0;\n        for (int i = 0; i < s.length(); i++) {\n            count += expand(s, i, i);     // Odd\n            count += expand(s, i, i + 1); // Even\n        }\n        return count;\n    }\n\n    private int expand(String s, int l, int r) {\n        int res = 0;\n        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {\n            res++;\n            l--;\n            r++;\n        }\n        return res;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'decode-ways',
    title: 'Decode Ways',
    difficulty: 'Medium',
    description: 'Decode Ways. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int numDecodings(String s) {\n        if (s == null || s.length() == 0 || s.charAt(0) == '0') return 0;\n        int n = s.length();\n        int prev2 = 1, prev1 = 1;\n        for (int i = 1; i < n; i++) {\n            int curr = 0;\n            int singleDigit = s.charAt(i) - '0';\n            int twoDigits = Integer.parseInt(s.substring(i - 1, i + 1));\n            if (singleDigit != 0) curr += prev1;\n            if (twoDigits >= 10 && twoDigits <= 26) curr += prev2;\n            prev2 = prev1;\n            prev1 = curr;\n        }\n        return prev1;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'coin-change',
    title: 'Coin Change',
    difficulty: 'Medium',
    description: 'Coin Change. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int coinChange(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for (int a = 1; a <= amount; a++) {\n            for (int c : coins) {\n                if (a - c >= 0) {\n                    dp[a] = Math.min(dp[a], 1 + dp[a - c]);\n                }\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n}",
      complexity: { time: 'O(\\text{amount} \\times \\text{coins.length})', space: 'O(\\text{amount})' }
    }
  ]
  },
  {
    slug: 'maximum-product-subarray',
    title: 'Maximum Product Subarray',
    difficulty: 'Medium',
    description: 'Maximum Product Subarray. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Negative numbers can turn minimum product into maximum.',
      algorithm: undefined,
      code: "class Solution {\n    public int maxProduct(int[] nums) {\n        int max = nums[0];\n        int curMin = 1, curMax = 1;\n        for (int n : nums) {\n            int temp = curMax * n;\n            curMax = Math.max(n, Math.max(curMax * n, curMin * n));\n            curMin = Math.min(n, Math.min(temp, curMin * n));\n            max = Math.max(max, curMax);\n        }\n        return max;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'word-break',
    title: 'Word Break',
    difficulty: 'Medium',
    description: 'Word Break. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public boolean wordBreak(String s, List<String> wordDict) {\n        Set<String> dict = new HashSet<>(wordDict);\n        boolean[] dp = new boolean[s.length() + 1];\n        dp[0] = true;\n        for (int i = 1; i <= s.length(); i++) {\n            for (int j = 0; j < i; j++) {\n                if (dp[j] && dict.contains(s.substring(j, i))) {\n                    dp[i] = true;\n                    break;\n                }\n            }\n        }\n        return dp[s.length()];\n    }\n}",
      complexity: { time: 'O(n^3)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    description: 'Longest Increasing Subsequence. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: '$O(n^2)$ Dynamic Programming',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int lengthOfLIS(int[] nums) {\n        int[] dp = new int[nums.length];\n        Arrays.fill(dp, 1);\n        int max = 1;\n        for (int i = 1; i < nums.length; i++) {\n            for (int j = 0; j < i; j++) {\n                if (nums[j] < nums[i]) {\n                    dp[i] = Math.max(dp[i], dp[j] + 1);\n                }\n            }\n            max = Math.max(max, dp[i]);\n        }\n        return max;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(n)' }
    },
    {
      label: 'Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int lengthOfLIS(int[] nums) {\n        int[] tails = new int[nums.length];\n        int size = 0;\n        for (int x : nums) {\n            int i = 0, j = size;\n            while (i != j) {\n                int mid = (i + j) / 2;\n                if (tails[mid] < x) i = mid + 1;\n                else j = mid;\n            }\n            tails[i] = x;\n            if (i == size) size++;\n        }\n        return size;\n    }\n}",
      complexity: { time: 'O(n \\log n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'partition-equal-subset-sum',
    title: 'Partition Equal Subset Sum',
    difficulty: 'Medium',
    description: 'Partition Equal Subset Sum. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Find if there is a subset summing to `sum / 2`.',
      algorithm: undefined,
      code: "class Solution {\n    public boolean canPartition(int[] nums) {\n        int sum = 0;\n        for (int n : nums) sum += n;\n        if (sum % 2 != 0) return false;\n        int target = sum / 2;\n        boolean[] dp = new boolean[target + 1];\n        dp[0] = true;\n        for (int n : nums) {\n            for (int i = target; i >= n; i--) {\n                dp[i] = dp[i] || dp[i - n];\n            }\n        }\n        return dp[target];\n    }\n}",
      complexity: { time: 'O(n \\times \\text{target})', space: 'O(\\text{target})' }
    }
  ]
  },
  {
    slug: 'unique-paths',
    title: 'Unique Paths',
    difficulty: 'Medium',
    description: 'Unique Paths. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int uniquePaths(int m, int n) {\n        int[] row = new int[n];\n        Arrays.fill(row, 1);\n        for (int r = 1; r < m; r++) {\n            for (int c = 1; c < n; c++) {\n                row[c] += row[c - 1];\n            }\n        }\n        return row[n - 1];\n    }\n}",
      complexity: { time: 'O(m \\cdot n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'longest-common-subsequence',
    title: 'Longest Common Subsequence',
    difficulty: 'Medium',
    description: 'Longest Common Subsequence. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int longestCommonSubsequence(String text1, String text2) {\n        int m = text1.length(), n = text2.length();\n        int[] prev = new int[n + 1];\n        int[] curr = new int[n + 1];\n        for (int i = 1; i <= m; i++) {\n            for (int j = 1; j <= n; j++) {\n                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {\n                    curr[j] = 1 + prev[j - 1];\n                } else {\n                    curr[j] = Math.max(prev[j], curr[j - 1]);\n                }\n            }\n            int[] temp = prev;\n            prev = curr;\n            curr = temp;\n        }\n        return prev[n];\n    }\n}",
      complexity: { time: 'O(m \\cdot n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'best-time-to-buy-and-sell-stock-with-cooldown',
    title: 'Best Time to Buy and Sell Stock with Cooldown',
    difficulty: 'Medium',
    description: 'Best Time to Buy and Sell Stock with Cooldown. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int maxProfit(int[] prices) {\n        int sold = 0, held = Integer.MIN_VALUE, reset = 0;\n        for (int price : prices) {\n            int prevSold = sold;\n            sold = held + price;\n            held = Math.max(held, reset - price);\n            reset = Math.max(reset, prevSold);\n        }\n        return Math.max(sold, reset);\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'coin-change-ii',
    title: 'Coin Change II',
    difficulty: 'Medium',
    description: 'Coin Change II. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Iterating coins outer loop ensures distinct combinations without permutations.',
      algorithm: undefined,
      code: "class Solution {\n    public int change(int amount, int[] coins) {\n        int[] dp = new int[amount + 1];\n        dp[0] = 1;\n        for (int coin : coins) {\n            for (int i = coin; i <= amount; i++) {\n                dp[i] += dp[i - coin];\n            }\n        }\n        return dp[amount];\n    }\n}",
      complexity: { time: 'O(\\text{amount} \\times \\text{coins.length})', space: 'O(\\text{amount})' }
    }
  ]
  },
  {
    slug: 'target-sum',
    title: 'Target Sum',
    difficulty: 'Medium',
    description: 'Target Sum. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Let $P$ be positive set and $N$ be negative set. $P - N = \\text{target} \\implies 2P = \\text{target} + \\text{totalSum}$.',
      algorithm: undefined,
      code: "class Solution {\n    public int findTargetSumWays(int[] nums, int target) {\n        int sum = 0;\n        for (int n : nums) sum += n;\n        if (Math.abs(target) > sum || (sum + target) % 2 != 0) return 0;\n        int subsetSum = (sum + target) / 2;\n        int[] dp = new int[subsetSum + 1];\n        dp[0] = 1;\n        for (int n : nums) {\n            for (int i = subsetSum; i >= n; i--) {\n                dp[i] += dp[i - n];\n            }\n        }\n        return dp[subsetSum];\n    }\n}",
      complexity: { time: 'O(n \\times \\text{subsetSum})', space: 'O(\\text{subsetSum})' }
    }
  ]
  },
  {
    slug: 'interleaving-string',
    title: 'Interleaving String',
    difficulty: 'Medium',
    description: 'Interleaving String. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public boolean isInterleave(String s1, String s2, String s3) {\n        if (s1.length() + s2.length() != s3.length()) return false;\n        boolean[] dp = new boolean[s2.length() + 1];\n        dp[0] = true;\n        for (int j = 1; j <= s2.length(); j++) {\n            dp[j] = dp[j - 1] && s2.charAt(j - 1) == s3.charAt(j - 1);\n        }\n        for (int i = 1; i <= s1.length(); i++) {\n            dp[0] = dp[0] && s1.charAt(i - 1) == s3.charAt(i - 1);\n            for (int j = 1; j <= s2.length(); j++) {\n                char c = s3.charAt(i + j - 1);\n                dp[j] = (dp[j] && s1.charAt(i - 1) == c) || (dp[j - 1] && s2.charAt(j - 1) == c);\n            }\n        }\n        return dp[s2.length()];\n    }\n}",
      complexity: { time: 'O(m \\cdot n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'longest-increasing-path-in-a-matrix',
    title: 'Longest Increasing Path in a Matrix',
    difficulty: 'Hard',
    description: 'Longest Increasing Path in a Matrix. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Since path is strictly increasing, cycles are impossible; the grid forms a DAG.',
      algorithm: undefined,
      code: "class Solution {\n    private int[][] memo;\n    private int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};\n\n    public int longestIncreasingPath(int[][] matrix) {\n        int m = matrix.length, n = matrix[0].length;\n        memo = new int[m][n];\n        int maxLen = 0;\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                maxLen = Math.max(maxLen, dfs(matrix, r, c));\n            }\n        }\n        return maxLen;\n    }\n\n    private int dfs(int[][] matrix, int r, int c) {\n        if (memo[r][c] != 0) return memo[r][c];\n        int max = 1;\n        for (int[] d : dirs) {\n            int nr = r + d[0], nc = c + d[1];\n            if (nr >= 0 && nr < matrix.length && nc >= 0 && nc < matrix[0].length && matrix[nr][nc] > matrix[r][c]) {\n                max = Math.max(max, 1 + dfs(matrix, nr, nc));\n            }\n        }\n        return memo[r][c] = max;\n    }\n}",
      complexity: { time: 'O(m \\cdot n)', space: 'O(m \\cdot n)' }
    }
  ]
  },
  {
    slug: 'distinct-subsequences',
    title: 'Distinct Subsequences',
    difficulty: 'Hard',
    description: 'Distinct Subsequences. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int numDistinct(String s, String t) {\n        int m = s.length(), n = t.length();\n        int[] dp = new int[n + 1];\n        dp[0] = 1;\n        for (int i = 1; i <= m; i++) {\n            for (int j = n; j >= 1; j--) {\n                if (s.charAt(i - 1) == t.charAt(j - 1)) {\n                    dp[j] += dp[j - 1];\n                }\n            }\n        }\n        return dp[n];\n    }\n}",
      complexity: { time: 'O(m \\cdot n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'edit-distance',
    title: 'Edit Distance',
    difficulty: 'Medium',
    description: 'Edit Distance. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int minDistance(String word1, String word2) {\n        int m = word1.length(), n = word2.length();\n        int[] dp = new int[n + 1];\n        for (int j = 0; j <= n; j++) dp[j] = j;\n        for (int i = 1; i <= m; i++) {\n            int prev = dp[0];\n            dp[0] = i;\n            for (int j = 1; j <= n; j++) {\n                int temp = dp[j];\n                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {\n                    dp[j] = prev;\n                } else {\n                    dp[j] = 1 + Math.min(prev, Math.min(dp[j], dp[j - 1]));\n                }\n                prev = temp;\n            }\n        }\n        return dp[n];\n    }\n}",
      complexity: { time: 'O(m \\cdot n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'burst-balloons',
    title: 'Burst Balloons',
    difficulty: 'Hard',
    description: 'Burst Balloons. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Think in reverse: which balloon is burst LAST in range $(i, j)$?',
      algorithm: undefined,
      code: "class Solution {\n    public int maxCoins(int[] nums) {\n        int n = nums.length;\n        int[] arr = new int[n + 2];\n        arr[0] = 1;\n        arr[n + 1] = 1;\n        System.arraycopy(nums, 0, arr, 1, n);\n        int[][] dp = new int[n + 2][n + 2];\n        for (int len = 1; len <= n; len++) {\n            for (int left = 1; left <= n - len + 1; left++) {\n                int right = left + len - 1;\n                for (int k = left; k <= right; k++) {\n                    int coins = arr[left - 1] * arr[k] * arr[right + 1] + dp[left][k - 1] + dp[k + 1][right];\n                    dp[left][right] = Math.max(dp[left][right], coins);\n                }\n            }\n        }\n        return dp[1][n];\n    }\n}",
      complexity: { time: 'O(n^3)', space: 'O(n^2)' }
    }
  ]
  },
  {
    slug: 'regular-expression-matching',
    title: 'Regular Expression Matching',
    difficulty: 'Hard',
    description: 'Regular Expression Matching. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public boolean isMatch(String s, String p) {\n        int m = s.length(), n = p.length();\n        boolean[][] dp = new boolean[m + 1][n + 1];\n        dp[0][0] = true;\n        for (int j = 2; j <= n; j += 2) {\n            if (p.charAt(j - 1) == '*') {\n                dp[0][j] = dp[0][j - 2];\n            }\n        }\n        for (int i = 1; i <= m; i++) {\n            for (int j = 1; j <= n; j++) {\n                char sc = s.charAt(i - 1), pc = p.charAt(j - 1);\n                if (pc == '.' || pc == sc) {\n                    dp[i][j] = dp[i - 1][j - 1];\n                } else if (pc == '*') {\n                    dp[i][j] = dp[i][j - 2]; // 0 occurrences\n                    char prevChar = p.charAt(j - 2);\n                    if (prevChar == '.' || prevChar == sc) {\n                        dp[i][j] = dp[i][j] || dp[i - 1][j];\n                    }\n                }\n            }\n        }\n        return dp[m][n];\n    }\n}",
      complexity: { time: 'O(m \\cdot n)', space: 'O(m \\cdot n)' }
    }
  ]
  },
  {
    slug: 'maximum-subarray',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    description: 'Maximum Subarray. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'If running sum drops below zero, reset running sum to 0.',
      algorithm: undefined,
      code: "class Solution {\n    public int maxSubArray(int[] nums) {\n        int max = nums[0];\n        int sum = 0;\n        for (int n : nums) {\n            sum += n;\n            max = Math.max(max, sum);\n            if (sum < 0) sum = 0;\n        }\n        return max;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'jump-game',
    title: 'Jump Game',
    difficulty: 'Medium',
    description: 'Jump Game. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public boolean canJump(int[] nums) {\n        int maxReach = 0;\n        for (int i = 0; i < nums.length; i++) {\n            if (i > maxReach) return false;\n            maxReach = Math.max(maxReach, i + nums[i]);\n            if (maxReach >= nums.length - 1) return true;\n        }\n        return true;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'jump-game-ii',
    title: 'Jump Game II',
    difficulty: 'Medium',
    description: 'Jump Game II. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Track the current window boundary `curEnd` and the furthest reachable index `farthest`. When `i == curEnd`, increment jumps and set `curEnd = farthest`.',
      algorithm: undefined,
      code: "class Solution {\n    public int jump(int[] nums) {\n        int jumps = 0, curEnd = 0, farthest = 0;\n        for (int i = 0; i < nums.length - 1; i++) {\n            farthest = Math.max(farthest, i + nums[i]);\n            if (i == curEnd) {\n                jumps++;\n                curEnd = farthest;\n                if (curEnd >= nums.length - 1) break;\n            }\n        }\n        return jumps;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'gas-station',
    title: 'Gas Station',
    difficulty: 'Medium',
    description: 'Gas Station. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'If total gas < total cost, return -1. Otherwise, whenever tank < 0, candidate starting index must be `i + 1`.',
      algorithm: undefined,
      code: "class Solution {\n    public int canCompleteCircuit(int[] gas, int[] cost) {\n        int totalTank = 0, currTank = 0, start = 0;\n        for (int i = 0; i < gas.length; i++) {\n            int net = gas[i] - cost[i];\n            totalTank += net;\n            currTank += net;\n            if (currTank < 0) {\n                start = i + 1;\n                currTank = 0;\n            }\n        }\n        return totalTank >= 0 ? start : -1;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'hand-of-straights',
    title: 'Hand of Straights',
    difficulty: 'Medium',
    description: 'Hand of Straights. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public boolean isNStraightHand(int[] hand, int groupSize) {\n        if (hand.length % groupSize != 0) return false;\n        Map<Integer, Integer> count = new HashMap<>();\n        for (int card : hand) count.put(card, count.getOrDefault(card, 0) + 1);\n        Arrays.sort(hand);\n        for (int card : hand) {\n            if (count.get(card) > 0) {\n                for (int i = 0; i < groupSize; i++) {\n                    int next = card + i;\n                    if (count.getOrDefault(next, 0) <= 0) return false;\n                    count.put(next, count.get(next) - 1);\n                }\n            }\n        }\n        return true;\n    }\n}",
      complexity: { time: 'O(n \\log n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'merge-triplets-to-form-target-triplet',
    title: 'Merge Triplets to Form Target Triplet',
    difficulty: 'Medium',
    description: 'Merge Triplets to Form Target Triplet. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Ignore triplets that have any component strictly greater than target. Collect match flags for positions 0, 1, 2.',
      algorithm: undefined,
      code: "class Solution {\n    public boolean mergeTriplets(int[][] triplets, int[] target) {\n        boolean match0 = false, match1 = false, match2 = false;\n        for (int[] t : triplets) {\n            if (t[0] <= target[0] && t[1] <= target[1] && t[2] <= target[2]) {\n                if (t[0] == target[0]) match0 = true;\n                if (t[1] == target[1]) match1 = true;\n                if (t[2] == target[2]) match2 = true;\n                if (match0 && match1 && match2) return true;\n            }\n        }\n        return match0 && match1 && match2;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'partition-labels',
    title: 'Partition Labels',
    difficulty: 'Medium',
    description: 'Partition Labels. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public List<Integer> partitionLabels(String s) {\n        int[] last = new int[26];\n        for (int i = 0; i < s.length(); i++) {\n            last[s.charAt(i) - 'a'] = i;\n        }\n        List<Integer> res = new ArrayList<>();\n        int start = 0, end = 0;\n        for (int i = 0; i < s.length(); i++) {\n            end = Math.max(end, last[s.charAt(i) - 'a']);\n            if (i == end) {\n                res.add(end - start + 1);\n                start = i + 1;\n            }\n        }\n        return res;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'valid-parenthesis-string',
    title: 'Valid Parenthesis String',
    difficulty: 'Medium',
    description: 'Valid Parenthesis String. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Treat `\'*\'` as `(`, `)`, or empty. Maintain possible range of open parentheses count.',
      algorithm: undefined,
      code: "class Solution {\n    public boolean checkValidString(String s) {\n        int cMin = 0, cMax = 0;\n        for (char c : s.toCharArray()) {\n            if (c == '(') {\n                cMin++;\n                cMax++;\n            } else if (c == ')') {\n                cMin--;\n                cMax--;\n            } else { // '*'\n                cMin--;\n                cMax++;\n            }\n            if (cMax < 0) return false;\n            cMin = Math.max(0, cMin);\n        }\n        return cMin == 0;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'insert-interval',
    title: 'Insert Interval',
    difficulty: 'Medium',
    description: 'Insert Interval. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public int[][] insert(int[][] intervals, int[] newInterval) {\n        List<int[]> res = new ArrayList<>();\n        int i = 0, n = intervals.length;\n        // 1. Add all intervals before newInterval\n        while (i < n && intervals[i][1] < newInterval[0]) {\n            res.add(intervals[i++]);\n        }\n        // 2. Merge overlapping intervals\n        while (i < n && intervals[i][0] <= newInterval[1]) {\n            newInterval[0] = Math.min(newInterval[0], intervals[i][0]);\n            newInterval[1] = Math.max(newInterval[1], intervals[i][1]);\n            i++;\n        }\n        res.add(newInterval);\n        // 3. Add remaining intervals\n        while (i < n) {\n            res.add(intervals[i++]);\n        }\n        return res.toArray(new int[res.size()][]);\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    description: 'Merge Intervals. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public int[][] merge(int[][] intervals) {\n        if (intervals.length <= 1) return intervals;\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n        List<int[]> res = new ArrayList<>();\n        int[] curr = intervals[0];\n        res.add(curr);\n        for (int[] next : intervals) {\n            if (next[0] <= curr[1]) {\n                curr[1] = Math.max(curr[1], next[1]);\n            } else {\n                curr = next;\n                res.add(curr);\n            }\n        }\n        return res.toArray(new int[res.size()][]);\n    }\n}",
      complexity: { time: 'O(n \\log n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'non-overlapping-intervals',
    title: 'Non-overlapping Intervals',
    difficulty: 'Medium',
    description: 'Non-overlapping Intervals. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int eraseOverlapIntervals(int[][] intervals) {\n        if (intervals.length == 0) return 0;\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));\n        int count = 0;\n        int prevEnd = intervals[0][1];\n        for (int i = 1; i < intervals.length; i++) {\n            if (intervals[i][0] < prevEnd) {\n                count++;\n            } else {\n                prevEnd = intervals[i][1];\n            }\n        }\n        return count;\n    }\n}",
      complexity: { time: 'O(n \\log n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'meeting-rooms',
    title: 'Meeting Rooms',
    difficulty: 'Easy',
    description: 'Meeting Rooms. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.Arrays;\n\nclass Solution {\n    public boolean canAttendMeetings(int[][] intervals) {\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n        for (int i = 1; i < intervals.length; i++) {\n            if (intervals[i][0] < intervals[i - 1][1]) {\n                return false;\n            }\n        }\n        return true;\n    }\n}",
      complexity: { time: 'O(n \\log n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'meeting-rooms-ii',
    title: 'Meeting Rooms II',
    difficulty: 'Medium',
    description: 'Meeting Rooms II. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Two Pointers Chronological Scan',
      intuition: 'Sort start times and end times independently. Advance start pointer; if start < end, allocate room, else room freed.',
      algorithm: undefined,
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int minMeetingRooms(int[][] intervals) {\n        int n = intervals.length;\n        int[] starts = new int[n];\n        int[] ends = new int[n];\n        for (int i = 0; i < n; i++) {\n            starts[i] = intervals[i][0];\n            ends[i] = intervals[i][1];\n        }\n        Arrays.sort(starts);\n        Arrays.sort(ends);\n        int rooms = 0, endIdx = 0;\n        for (int i = 0; i < n; i++) {\n            if (starts[i] < ends[endIdx]) {\n                rooms++;\n            } else {\n                endIdx++;\n            }\n        }\n        return rooms;\n    }\n}",
      complexity: { time: 'O(n \\log n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'minimum-interval-to-include-each-query',
    title: 'Minimum Interval to Include Each Query',
    difficulty: 'Hard',
    description: 'Minimum Interval to Include Each Query. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Sort intervals and queries. Use min-heap ordered by interval size. Remove intervals that end before current query.',
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public int[] minInterval(int[][] intervals, int[] queries) {\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n        int qLen = queries.length;\n        int[][] sortedQ = new int[qLen][2];\n        for (int i = 0; i < qLen; i++) {\n            sortedQ[i][0] = queries[i];\n            sortedQ[i][1] = i;\n        }\n        Arrays.sort(sortedQ, (a, b) -> Integer.compare(a[0], b[0]));\n\n        PriorityQueue<int[]> minHeap = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));\n        int[] res = new int[qLen];\n        int i = 0;\n        for (int[] q : sortedQ) {\n            int qVal = q[0], qIdx = q[1];\n            while (i < intervals.length && intervals[i][0] <= qVal) {\n                int left = intervals[i][0], right = intervals[i][1];\n                minHeap.offer(new int[]{right - left + 1, right});\n                i++;\n            }\n            while (!minHeap.isEmpty() && minHeap.peek()[1] < qVal) {\n                minHeap.poll();\n            }\n            res[qIdx] = minHeap.isEmpty() ? -1 : minHeap.peek()[0];\n        }\n        return res;\n    }\n}",
      complexity: { time: 'O(N \\log N + Q \\log Q)', space: 'O(N + Q)' }
    }
  ]
  },
  {
    slug: 'rotate-image',
    title: 'Rotate Image',
    difficulty: 'Medium',
    description: 'Rotate Image. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Rotate $90^\\circ$ clockwise is equivalent to transposing the matrix along main diagonal, then reversing each row horizontally.',
      algorithm: undefined,
      code: "class Solution {\n    public void rotate(int[][] matrix) {\n        int n = matrix.length;\n        // 1. Transpose\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                int temp = matrix[i][j];\n                matrix[i][j] = matrix[j][i];\n                matrix[j][i] = temp;\n            }\n        }\n        // 2. Reverse each row\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < n / 2; j++) {\n                int temp = matrix[i][j];\n                matrix[i][j] = matrix[i][n - 1 - j];\n                matrix[i][n - 1 - j] = temp;\n            }\n        }\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'spiral-matrix',
    title: 'Spiral Matrix',
    difficulty: 'Medium',
    description: 'Spiral Matrix. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public List<Integer> spiralOrder(int[][] matrix) {\n        List<Integer> res = new ArrayList<>();\n        if (matrix == null || matrix.length == 0) return res;\n        int top = 0, bottom = matrix.length - 1;\n        int left = 0, right = matrix[0].length - 1;\n\n        while (top <= bottom && left <= right) {\n            for (int c = left; c <= right; c++) res.add(matrix[top][c]);\n            top++;\n            for (int r = top; r <= bottom; r++) res.add(matrix[r][right]);\n            right--;\n            if (top <= bottom) {\n                for (int c = right; c >= left; c--) res.add(matrix[bottom][c]);\n                bottom--;\n            }\n            if (left <= right) {\n                for (int r = bottom; r >= top; r--) res.add(matrix[r][left]);\n                left++;\n            }\n        }\n        return res;\n    }\n}",
      complexity: { time: 'O(m \\cdot n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'set-matrix-zeroes',
    title: 'Set Matrix Zeroes',
    difficulty: 'Medium',
    description: 'Set Matrix Zeroes. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Use `matrix[0][0...n-1]` and `matrix[0...m-1][0]` as marker arrays, plus one boolean flag `rowZero`.',
      algorithm: undefined,
      code: "class Solution {\n    public void setZeroes(int[][] matrix) {\n        int m = matrix.length, n = matrix[0].length;\n        boolean rowZero = false;\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                if (matrix[r][c] == 0) {\n                    matrix[0][c] = 0;\n                    if (r > 0) matrix[r][0] = 0;\n                    else rowZero = true;\n                }\n            }\n        }\n        for (int r = 1; r < m; r++) {\n            for (int c = 1; c < n; c++) {\n                if (matrix[0][c] == 0 || matrix[r][0] == 0) {\n                    matrix[r][c] = 0;\n                }\n            }\n        }\n        if (matrix[0][0] == 0) {\n            for (int r = 0; r < m; r++) matrix[r][0] = 0;\n        }\n        if (rowZero) {\n            for (int c = 0; c < n; c++) matrix[0][c] = 0;\n        }\n    }\n}",
      complexity: { time: 'O(m \\cdot n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'happy-number',
    title: 'Happy Number',
    difficulty: 'Easy',
    description: 'Happy Number. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public boolean isHappy(int n) {\n        int slow = n, fast = sumOfSquares(n);\n        while (fast != 1 && slow != fast) {\n            slow = sumOfSquares(slow);\n            fast = sumOfSquares(sumOfSquares(fast));\n        }\n        return fast == 1;\n    }\n\n    private int sumOfSquares(int n) {\n        int sum = 0;\n        while (n > 0) {\n            int digit = n % 10;\n            sum += digit * digit;\n            n /= 10;\n        }\n        return sum;\n    }\n}",
      complexity: { time: 'O(\\log n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'plus-one',
    title: 'Plus One',
    difficulty: 'Easy',
    description: 'Plus One. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int[] plusOne(int[] digits) {\n        for (int i = digits.length - 1; i >= 0; i--) {\n            if (digits[i] < 9) {\n                digits[i]++;\n                return digits;\n            }\n            digits[i] = 0;\n        }\n        int[] res = new int[digits.length + 1];\n        res[0] = 1;\n        return res;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'powx-n',
    title: 'Pow(x, n)',
    difficulty: 'Medium',
    description: 'Pow(x, n). Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public double myPow(double x, int n) {\n        long N = n;\n        if (N < 0) {\n            x = 1 / x;\n            N = -N;\n        }\n        double ans = 1.0;\n        double currentProd = x;\n        for (long i = N; i > 0; i /= 2) {\n            if (i % 2 == 1) {\n                ans *= currentProd;\n            }\n            currentProd *= currentProd;\n        }\n        return ans;\n    }\n}",
      complexity: { time: 'O(\\log n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'multiply-strings',
    title: 'Multiply Strings',
    difficulty: 'Medium',
    description: 'Multiply Strings. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Indices $i$ and $j$ place their product at index $i + j$ and $i + j + 1$.',
      algorithm: undefined,
      code: "class Solution {\n    public String multiply(String num1, String num2) {\n        if (num1.equals(\"0\") || num2.equals(\"0\")) return \"0\";\n        int m = num1.length(), n = num2.length();\n        int[] pos = new int[m + n];\n        for (int i = m - 1; i >= 0; i--) {\n            for (int j = n - 1; j >= 0; j--) {\n                int mul = (num1.charAt(i) - '0') * (num2.charAt(j) - '0');\n                int p1 = i + j, p2 = i + j + 1;\n                int sum = mul + pos[p2];\n                pos[p1] += sum / 10;\n                pos[p2] = sum % 10;\n            }\n        }\n        StringBuilder sb = new StringBuilder();\n        for (int p : pos) {\n            if (!(sb.length() == 0 && p == 0)) sb.append(p);\n        }\n        return sb.length() == 0 ? \"0\" : sb.toString();\n    }\n}",
      complexity: { time: 'O(m \\cdot n)', space: 'O(m + n)' }
    }
  ]
  },
  {
    slug: 'detect-squares',
    title: 'Detect Squares',
    difficulty: 'Medium',
    description: 'Detect Squares. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass DetectSquares {\n    private int[][] counts = new int[1001][1001];\n    private List<int[]> points = new ArrayList<>();\n\n    public DetectSquares() {}\n\n    public void add(int[] point) {\n        counts[point[0]][point[1]]++;\n        points.add(point);\n    }\n\n    public int count(int[] point) {\n        int x1 = point[0], y1 = point[1];\n        int totalSquares = 0;\n        for (int[] p : points) {\n            int x3 = p[0], y3 = p[1];\n            if (Math.abs(x1 - x3) == 0 || Math.abs(x1 - x3) != Math.abs(y1 - y3)) {\n                continue; // Not a valid non-zero diagonal\n            }\n            totalSquares += counts[x1][y3] * counts[x3][y1];\n        }\n        return totalSquares;\n    }\n}",
      complexity: { time: '`add`: O(1), `count`: O(N)', space: 'O(N)' }
    }
  ]
  },
  {
    slug: 'single-number',
    title: 'Single Number',
    difficulty: 'Easy',
    description: 'Single Number. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int singleNumber(int[] nums) {\n        int res = 0;\n        for (int n : nums) res ^= n;\n        return res;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'number-of-1-bits',
    title: 'Number of 1 Bits',
    difficulty: 'Easy',
    description: 'Number of 1 Bits. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Clears lowest set bit in each iteration.',
      algorithm: undefined,
      code: "class Solution {\n    public int hammingWeight(int n) {\n        int count = 0;\n        while (n != 0) {\n            n &= (n - 1);\n            count++;\n        }\n        return count;\n    }\n}",
      complexity: { time: 'O(k)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'counting-bits',
    title: 'Counting Bits',
    difficulty: 'Easy',
    description: 'Counting Bits. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int[] countBits(int n) {\n        int[] dp = new int[n + 1];\n        for (int i = 1; i <= n; i++) {\n            dp[i] = dp[i >> 1] + (i & 1);\n        }\n        return dp;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'reverse-bits',
    title: 'Reverse Bits',
    difficulty: 'Easy',
    description: 'Reverse Bits. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "public class Solution {\n    public int reverseBits(int n) {\n        int res = 0;\n        for (int i = 0; i < 32; i++) {\n            res = (res << 1) | (n & 1);\n            n >>>= 1;\n        }\n        return res;\n    }\n}",
      complexity: { time: 'O(1)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'missing-number',
    title: 'Missing Number',
    difficulty: 'Easy',
    description: 'Missing Number. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Gauss Sum Formula',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int missingNumber(int[] nums) {\n        int n = nums.length;\n        int expectedSum = n * (n + 1) / 2;\n        int actualSum = 0;\n        for (int x : nums) actualSum += x;\n        return expectedSum - actualSum;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    },
    {
      label: 'Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int missingNumber(int[] nums) {\n        int xor = nums.length;\n        for (int i = 0; i < nums.length; i++) {\n            xor ^= i ^ nums[i];\n        }\n        return xor;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'sum-of-two-integers',
    title: 'Sum of Two Integers',
    difficulty: 'Medium',
    description: 'Sum of Two Integers. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int getSum(int a, int b) {\n        while (b != 0) {\n            int carry = (a & b) << 1;\n            a = a ^ b;\n            b = carry;\n        }\n        return a;\n    }\n}",
      complexity: { time: 'O(1)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'reverse-integer',
    title: 'Reverse Integer',
    difficulty: 'Medium',
    description: 'Reverse Integer. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int reverse(int x) {\n        int rev = 0;\n        while (x != 0) {\n            int pop = x % 10;\n            x /= 10;\n            if (rev > Integer.MAX_VALUE / 10 || (rev == Integer.MAX_VALUE / 10 && pop > 7)) return 0;\n            if (rev < Integer.MIN_VALUE / 10 || (rev == Integer.MIN_VALUE / 10 && pop < -8)) return 0;\n            rev = rev * 10 + pop;\n        }\n        return rev;\n    }\n}",
      complexity: { time: 'O(\\log_{10} x)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'reconstruct-itinerary',
    title: 'Reconstruct Itinerary',
    difficulty: 'Hard',
    description: 'Reconstruct Itinerary. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public List<String> findItinerary(List<List<String>> tickets) {\n        Map<String, PriorityQueue<String>> adj = new HashMap<>();\n        for (List<String> t : tickets) {\n            adj.computeIfAbsent(t.get(0), k -> new PriorityQueue<>()).offer(t.get(1));\n        }\n        LinkedList<String> route = new LinkedList<>();\n        dfs(\"JFK\", adj, route);\n        return route;\n    }\n\n    private void dfs(String airport, Map<String, PriorityQueue<String>> adj, LinkedList<String> route) {\n        PriorityQueue<String> pq = adj.get(airport);\n        while (pq != null && !pq.isEmpty()) {\n            dfs(pq.poll(), adj, route);\n        }\n        route.addFirst(airport);\n    }\n}",
      complexity: { time: 'O(E \\log E)', space: 'O(V + E)' }
    }
  ]
  },
  {
    slug: 'min-cost-to-connect-all-points',
    title: 'Min Cost to Connect All Points',
    difficulty: 'Medium',
    description: 'Min Cost to Connect All Points. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Maintain minimum distance to visited tree in an array $O(V^2)$ (faster than PQ for dense complete graph).',
      algorithm: undefined,
      code: "class Solution {\n    public int minCostConnectPoints(int[][] points) {\n        int n = points.length;\n        int[] minDist = new int[n];\n        for (int i = 1; i < n; i++) minDist[i] = Integer.MAX_VALUE;\n        boolean[] visited = new boolean[n];\n        int totalCost = 0;\n\n        for (int step = 0; step < n; step++) {\n            int u = -1;\n            for (int i = 0; i < n; i++) {\n                if (!visited[i] && (u == -1 || minDist[i] < minDist[u])) {\n                    u = i;\n                }\n            }\n            visited[u] = true;\n            totalCost += minDist[u];\n            for (int v = 0; v < n; v++) {\n                if (!visited[v]) {\n                    int dist = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);\n                    minDist[v] = Math.min(minDist[v], dist);\n                }\n            }\n        }\n        return totalCost;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'network-delay-time',
    title: 'Network Delay Time',
    difficulty: 'Medium',
    description: 'Network Delay Time. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public int networkDelayTime(int[][] times, int n, int k) {\n        Map<Integer, List<int[]>> adj = new HashMap<>();\n        for (int[] t : times) {\n            adj.computeIfAbsent(t[0], x -> new ArrayList<>()).add(new int[]{t[1], t[2]});\n        }\n        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);\n        pq.offer(new int[]{k, 0});\n        Map<Integer, Integer> dist = new HashMap<>();\n\n        while (!pq.isEmpty()) {\n            int[] curr = pq.poll();\n            int u = curr[0], d = curr[1];\n            if (dist.containsKey(u)) continue;\n            dist.put(u, d);\n            if (adj.containsKey(u)) {\n                for (int[] edge : adj.get(u)) {\n                    int v = edge[0], weight = edge[1];\n                    if (!dist.containsKey(v)) {\n                        pq.offer(new int[]{v, d + weight});\n                    }\n                }\n            }\n        }\n        if (dist.size() != n) return -1;\n        int maxDist = 0;\n        for (int d : dist.values()) maxDist = Math.max(maxDist, d);\n        return maxDist;\n    }\n}",
      complexity: { time: 'O(E \\log V)', space: 'O(V + E)' }
    }
  ]
  },
  {
    slug: 'swim-in-rising-water',
    title: 'Swim in Rising Water',
    difficulty: 'Hard',
    description: 'Swim in Rising Water. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.PriorityQueue;\n\nclass Solution {\n    public int swimInWater(int[][] grid) {\n        int n = grid.length;\n        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[2] - b[2]);\n        boolean[][] visited = new boolean[n][n];\n        pq.offer(new int[]{0, 0, grid[0][0]});\n        visited[0][0] = true;\n        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};\n\n        while (!pq.isEmpty()) {\n            int[] curr = pq.poll();\n            int r = curr[0], c = curr[1], maxWater = curr[2];\n            if (r == n - 1 && c == n - 1) return maxWater;\n            for (int[] d : dirs) {\n                int nr = r + d[0], nc = c + d[1];\n                if (nr >= 0 && nr < n && nc >= 0 && nc < n && !visited[nr][nc]) {\n                    visited[nr][nc] = true;\n                    pq.offer(new int[]{nr, nc, Math.max(maxWater, grid[nr][nc])});\n                }\n            }\n        }\n        return -1;\n    }\n}",
      complexity: { time: 'O(n^2 \\log n)', space: 'O(n^2)' }
    }
  ]
  },
  {
    slug: 'alien-dictionary',
    title: 'Alien Dictionary',
    difficulty: 'Hard',
    description: 'Alien Dictionary. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.*;\n\nclass Solution {\n    public String foreignDictionary(String[] words) {\n        Map<Character, Set<Character>> adj = new HashMap<>();\n        Map<Character, Integer> inDegree = new HashMap<>();\n        for (String w : words) {\n            for (char c : w.toCharArray()) inDegree.put(c, 0);\n        }\n\n        for (int i = 0; i < words.length - 1; i++) {\n            String w1 = words[i], w2 = words[i + 1];\n            if (w1.length() > w2.length() && w1.startsWith(w2)) return \"\"; // Invalid prefix order\n            for (int j = 0; j < Math.min(w1.length(), w2.length()); j++) {\n                char c1 = w1.charAt(j), c2 = w2.charAt(j);\n                if (c1 != c2) {\n                    adj.computeIfAbsent(c1, k -> new HashSet<>());\n                    if (adj.get(c1).add(c2)) {\n                        inDegree.put(c2, inDegree.get(c2) + 1);\n                    }\n                    break;\n                }\n            }\n        }\n\n        Queue<Character> queue = new LinkedList<>();\n        for (char c : inDegree.keySet()) {\n            if (inDegree.get(c) == 0) queue.offer(c);\n        }\n\n        StringBuilder sb = new StringBuilder();\n        while (!queue.isEmpty()) {\n            char curr = queue.poll();\n            sb.append(curr);\n            if (adj.containsKey(curr)) {\n                for (char next : adj.get(curr)) {\n                    inDegree.put(next, inDegree.get(next) - 1);\n                    if (inDegree.get(next) == 0) queue.offer(next);\n                }\n            }\n        }\n\n        return sb.length() == inDegree.size() ? sb.toString() : \"\";\n    }\n}",
      complexity: { time: 'O(C)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'cheapest-flights-within-k-stops',
    title: 'Cheapest Flights Within K Stops',
    difficulty: 'Medium',
    description: 'Cheapest Flights Within K Stops. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {\n        int[] prices = new int[n];\n        Arrays.fill(prices, Integer.MAX_VALUE);\n        prices[src] = 0;\n\n        for (int i = 0; i <= k; i++) {\n            int[] tmpPrices = Arrays.copyOf(prices, n);\n            for (int[] flight : flights) {\n                int s = flight[0], d = flight[1], p = flight[2];\n                if (prices[s] == Integer.MAX_VALUE) continue;\n                if (prices[s] + p < tmpPrices[d]) {\n                    tmpPrices[d] = prices[s] + p;\n                }\n            }\n            prices = tmpPrices;\n        }\n        return prices[dst] == Integer.MAX_VALUE ? -1 : prices[dst];\n    }\n}",
      complexity: { time: 'O(K \\cdot E)', space: 'O(V)' }
    }
  ]
  },
  {
    slug: 'move-zeroes',
    title: 'Move Zeroes',
    difficulty: 'Easy',
    description: 'Given an integer array `nums`, move all `0`\'s to the end of it while maintaining the relative order of the non-zero elements. You must do this in-place without making a copy of the array.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public void moveZeroes(int[] nums) {\n        int insertPos = 0;\n        for (int i = 0; i < nums.length; i++) {\n            if (nums[i] != 0) {\n                if (i != insertPos) {\n                    nums[insertPos] = nums[i];\n                    nums[i] = 0;\n                }\n                insertPos++;\n            }\n        }\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'remove-duplicates-from-sorted-array',
    title: 'Remove Duplicates from Sorted Array',
    difficulty: 'Easy',
    description: 'Remove Duplicates from Sorted Array. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int removeDuplicates(int[] nums) {\n        if (nums.length == 0) return 0;\n        int insertIdx = 1;\n        for (int i = 1; i < nums.length; i++) {\n            if (nums[i] != nums[i - 1]) {\n                nums[insertIdx++] = nums[i];\n            }\n        }\n        return insertIdx;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'majority-element',
    title: 'Majority Element',
    difficulty: 'Easy',
    description: 'Majority Element. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class Solution {\n    public int majorityElement(int[] nums) {\n        int candidate = nums[0];\n        int count = 0;\n        for (int num : nums) {\n            if (count == 0) {\n                candidate = num;\n            }\n            count += (num == candidate) ? 1 : -1;\n        }\n        return candidate;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'print-in-order',
    title: 'Print in Order',
    difficulty: 'Easy',
    description: 'Print in Order. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'AtomicInteger Spin Lock',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.concurrent.atomic.AtomicInteger;\n\nclass Foo {\n    private AtomicInteger stage = new AtomicInteger(0);\n\n    public Foo() {}\n\n    public void first(Runnable printFirst) throws InterruptedException {\n        printFirst.run();\n        stage.incrementAndGet();\n    }\n\n    public void second(Runnable printSecond) throws InterruptedException {\n        while (stage.get() < 1) {} // Spin wait\n        printSecond.run();\n        stage.incrementAndGet();\n    }\n\n    public void third(Runnable printThird) throws InterruptedException {\n        while (stage.get() < 2) {} // Spin wait\n        printThird.run();\n    }\n}",
      complexity: { time: 'O(1)', space: 'O(1)' }
    },
    {
      label: 'Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.concurrent.Semaphore;\n\nclass Foo {\n    private Semaphore s2 = new Semaphore(0);\n    private Semaphore s3 = new Semaphore(0);\n\n    public Foo() {}\n\n    public void first(Runnable printFirst) throws InterruptedException {\n        printFirst.run();\n        s2.release();\n    }\n\n    public void second(Runnable printSecond) throws InterruptedException {\n        s2.acquire();\n        printSecond.run();\n        s3.release();\n    }\n\n    public void third(Runnable printThird) throws InterruptedException {\n        s3.acquire();\n        printThird.run();\n    }\n}",
      complexity: { time: 'O(1)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'print-foobar-alternately',
    title: 'Print FooBar Alternately',
    difficulty: 'Medium',
    description: 'Print FooBar Alternately. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Dual Semaphores',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.concurrent.Semaphore;\n\nclass FooBar {\n    private int n;\n    private Semaphore fooSem = new Semaphore(1);\n    private Semaphore barSem = new Semaphore(0);\n\n    public FooBar(int n) {\n        this.n = n;\n    }\n\n    public void foo(Runnable printFoo) throws InterruptedException {\n        for (int i = 0; i < n; i++) {\n            fooSem.acquire();\n            printFoo.run();\n            barSem.release();\n        }\n    }\n\n    public void bar(Runnable printBar) throws InterruptedException {\n        for (int i = 0; i < n; i++) {\n            barSem.acquire();\n            printBar.run();\n            fooSem.release();\n        }\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'print-zero-even-odd',
    title: 'Print Zero Even Odd',
    difficulty: 'Medium',
    description: 'Print Zero Even Odd. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.concurrent.Semaphore;\nimport java.util.function.IntConsumer;\n\nclass ZeroEvenOdd {\n    private int n;\n    private Semaphore zeroSem = new Semaphore(1);\n    private Semaphore oddSem = new Semaphore(0);\n    private Semaphore evenSem = new Semaphore(0);\n\n    public ZeroEvenOdd(int n) {\n        this.n = n;\n    }\n\n    public void zero(IntConsumer printNumber) throws InterruptedException {\n        for (int i = 1; i <= n; i++) {\n            zeroSem.acquire();\n            printNumber.accept(0);\n            if (i % 2 == 1) {\n                oddSem.release();\n            } else {\n                evenSem.release();\n            }\n        }\n    }\n\n    public void even(IntConsumer printNumber) throws InterruptedException {\n        for (int i = 2; i <= n; i += 2) {\n            evenSem.acquire();\n            printNumber.accept(i);\n            zeroSem.release();\n        }\n    }\n\n    public void odd(IntConsumer printNumber) throws InterruptedException {\n        for (int i = 1; i <= n; i += 2) {\n            oddSem.acquire();\n            printNumber.accept(i);\n            zeroSem.release();\n        }\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'building-h2o',
    title: 'Building H2O',
    difficulty: 'Medium',
    description: 'Building H2O. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.concurrent.CyclicBarrier;\nimport java.util.concurrent.Semaphore;\n\nclass H2O {\n    private Semaphore hSem = new Semaphore(2);\n    private Semaphore oSem = new Semaphore(1);\n    private CyclicBarrier barrier = new CyclicBarrier(3);\n\n    public H2O() {}\n\n    public void hydrogen(Runnable releaseHydrogen) throws InterruptedException {\n        hSem.acquire();\n        try {\n            barrier.await();\n        } catch (Exception e) {}\n        releaseHydrogen.run();\n        hSem.release();\n    }\n\n    public void oxygen(Runnable releaseOxygen) throws InterruptedException {\n        oSem.acquire();\n        try {\n            barrier.await();\n        } catch (Exception e) {}\n        releaseOxygen.run();\n        oSem.release();\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'fizz-buzz-multithreaded',
    title: 'Fizz Buzz Multithreaded',
    difficulty: 'Medium',
    description: 'Fizz Buzz Multithreaded. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.concurrent.locks.Condition;\nimport java.util.concurrent.locks.ReentrantLock;\nimport java.util.function.IntConsumer;\n\nclass FizzBuzz {\n    private int n;\n    private int curr = 1;\n    private ReentrantLock lock = new ReentrantLock();\n    private Condition cond = lock.newCondition();\n\n    public FizzBuzz(int n) {\n        this.n = n;\n    }\n\n    public void fizz(Runnable printFizz) throws InterruptedException {\n        while (true) {\n            lock.lock();\n            try {\n                while (curr <= n && !(curr % 3 == 0 && curr % 5 != 0)) {\n                    cond.await();\n                }\n                if (curr > n) return;\n                printFizz.run();\n                curr++;\n                cond.signalAll();\n            } finally {\n                lock.unlock();\n            }\n        }\n    }\n\n    public void buzz(Runnable printBuzz) throws InterruptedException {\n        while (true) {\n            lock.lock();\n            try {\n                while (curr <= n && !(curr % 5 == 0 && curr % 3 != 0)) {\n                    cond.await();\n                }\n                if (curr > n) return;\n                printBuzz.run();\n                curr++;\n                cond.signalAll();\n            } finally {\n                lock.unlock();\n            }\n        }\n    }\n\n    public void fizzbuzz(Runnable printFizzBuzz) throws InterruptedException {\n        while (true) {\n            lock.lock();\n            try {\n                while (curr <= n && !(curr % 15 == 0)) {\n                    cond.await();\n                }\n                if (curr > n) return;\n                printFizzBuzz.run();\n                curr++;\n                cond.signalAll();\n            } finally {\n                lock.unlock();\n            }\n        }\n    }\n\n    public void number(IntConsumer printNumber) throws InterruptedException {\n        while (true) {\n            lock.lock();\n            try {\n                while (curr <= n && (curr % 3 == 0 || curr % 5 == 0)) {\n                    cond.await();\n                }\n                if (curr > n) return;\n                printNumber.accept(curr);\n                curr++;\n                cond.signalAll();\n            } finally {\n                lock.unlock();\n            }\n        }\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'the-dining-philosophers',
    title: 'The Dining Philosophers',
    difficulty: 'Medium',
    description: 'The Dining Philosophers. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Resource Ordering',
      intuition: 'Philosopher with odd ID picks left fork first; even ID picks right fork first to prevent circular wait deadlock.',
      algorithm: undefined,
      code: "import java.util.concurrent.locks.ReentrantLock;\n\nclass DiningPhilosophers {\n    private ReentrantLock[] forks = new ReentrantLock[5];\n\n    public DiningPhilosophers() {\n        for (int i = 0; i < 5; i++) {\n            forks[i] = new ReentrantLock();\n        }\n    }\n\n    public void wantsToEat(int philosopher,\n                           Runnable pickLeftFork,\n                           Runnable pickRightFork,\n                           Runnable eat,\n                           Runnable putLeftFork,\n                           Runnable putRightFork) throws InterruptedException {\n        int left = philosopher;\n        int right = (philosopher + 1) % 5;\n\n        // Resource hierarchy: always pick lower numbered lock first\n        int first = Math.min(left, right);\n        int second = Math.max(left, right);\n\n        forks[first].lock();\n        forks[second].lock();\n        try {\n            pickLeftFork.run();\n            pickRightFork.run();\n            eat.run();\n            putLeftFork.run();\n            putRightFork.run();\n        } finally {\n            forks[second].unlock();\n            forks[first].unlock();\n        }\n    }\n}",
      complexity: { time: 'O(1)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'design-bounded-blocking-queue',
    title: 'Design Bounded Blocking Queue',
    difficulty: 'Medium',
    description: 'Design Bounded Blocking Queue. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "import java.util.concurrent.locks.Condition;\nimport java.util.concurrent.locks.ReentrantLock;\n\nclass BoundedBlockingQueue {\n    private int[] elements;\n    private int head = 0, tail = 0, size = 0, capacity;\n    private ReentrantLock lock = new ReentrantLock();\n    private Condition notFull = lock.newCondition();\n    private Condition notEmpty = lock.newCondition();\n\n    public BoundedBlockingQueue(int capacity) {\n        this.capacity = capacity;\n        this.elements = new int[capacity];\n    }\n\n    public void enqueue(int element) throws InterruptedException {\n        lock.lock();\n        try {\n            while (size == capacity) {\n                notFull.await();\n            }\n            elements[tail] = element;\n            tail = (tail + 1) % capacity;\n            size++;\n            notEmpty.signal();\n        } finally {\n            lock.unlock();\n        }\n    }\n\n    public int dequeue() throws InterruptedException {\n        lock.lock();\n        try {\n            while (size == 0) {\n                notEmpty.await();\n            }\n            int val = elements[head];\n            head = (head + 1) % capacity;\n            size--;\n            notFull.signal();\n            return val;\n        } finally {\n            lock.unlock();\n        }\n    }\n\n    public int size() {\n        lock.lock();\n        try {\n            return size;\n        } finally {\n            lock.unlock();\n        }\n    }\n}",
      complexity: { time: 'O(1)', space: 'O(\\text{capacity})' }
    }
  ]
  },
  {
    slug: 'traffic-light-controlled-intersection',
    title: 'Traffic Light Controlled Intersection',
    difficulty: 'Easy',
    description: 'Traffic Light Controlled Intersection. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class TrafficLight {\n    private int currentGreenRoad = 1; // 1 for Road A, 2 for Road B\n\n    public TrafficLight() {}\n\n    public synchronized void carArrived(\n        int carId,           // ID of the car\n        int roadId,          // ID of the road the car travels on. Can be 1 (road A) or 2 (road B)\n        int direction,       // Direction of the car\n        Runnable turnGreen,  // Use turnGreen.run() to turn light to green on current road\n        Runnable crossCar    // Use crossCar.run() to make car cross the intersection\n    ) {\n        if (currentGreenRoad != roadId) {\n            turnGreen.run();\n            currentGreenRoad = roadId;\n        }\n        crossCar.run();\n    }\n}",
      complexity: { time: 'O(1)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'lfu-cache',
    title: 'LFU Cache',
    difficulty: 'Hard',
    description: 'LFU Cache. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: 'Maintain `keyToVal`, `keyToCount`, `countToLRU`, and `minFreq`.',
      algorithm: undefined,
      code: "import java.util.*;\n\nclass LFUCache {\n    private static class Node {\n        int key, val, count;\n        Node prev, next;\n        Node(int key, int val) {\n            this.key = key;\n            this.val = val;\n            this.count = 1;\n        }\n    }\n\n    private static class DLList {\n        Node head, tail;\n        int size = 0;\n        DLList() {\n            head = new Node(0, 0);\n            tail = new Node(0, 0);\n            head.next = tail;\n            tail.prev = head;\n        }\n        void add(Node node) {\n            node.next = head.next;\n            node.prev = head;\n            head.next.prev = node;\n            head.next = node;\n            size++;\n        }\n        void remove(Node node) {\n            node.prev.next = node.next;\n            node.next.prev = node.prev;\n            size--;\n        }\n        Node removeLast() {\n            if (size > 0) {\n                Node node = tail.prev;\n                remove(node);\n                return node;\n            }\n            return null;\n        }\n    }\n\n    private final int capacity;\n    private int minFreq = 0;\n    private final Map<Integer, Node> nodeMap = new HashMap<>();\n    private final Map<Integer, DLList> countMap = new HashMap<>();\n\n    public LFUCache(int capacity) {\n        this.capacity = capacity;\n    }\n\n    public int get(int key) {\n        Node node = nodeMap.get(key);\n        if (node == null) return -1;\n        update(node);\n        return node.val;\n    }\n\n    public void put(int key, int value) {\n        if (capacity == 0) return;\n        if (nodeMap.containsKey(key)) {\n            Node node = nodeMap.get(key);\n            node.val = value;\n            update(node);\n        } else {\n            if (nodeMap.size() == capacity) {\n                DLList minList = countMap.get(minFreq);\n                Node removed = minList.removeLast();\n                nodeMap.remove(removed.key);\n            }\n            Node newNode = new Node(key, value);\n            nodeMap.put(key, newNode);\n            minFreq = 1;\n            countMap.computeIfAbsent(1, k -> new DLList()).add(newNode);\n        }\n    }\n\n    private void update(Node node) {\n        DLList oldList = countMap.get(node.count);\n        oldList.remove(node);\n        if (node.count == minFreq && oldList.size == 0) {\n            minFreq++;\n        }\n        node.count++;\n        countMap.computeIfAbsent(node.count, k -> new DLList()).add(node);\n    }\n}",
      complexity: { time: 'O(1)', space: 'O(\\text{capacity})' }
    }
  ]
  },
  {
    slug: 'design-hit-counter',
    title: 'Design Hit Counter',
    difficulty: 'Medium',
    description: 'Design Hit Counter. Solve this LeetCode problem efficiently.',
    examples: [],
    constraints: undefined,
    solutions: [
    {
      label: 'Optimised / Best',
      intuition: undefined,
      algorithm: undefined,
      code: "class HitCounter {\n    private int[] times;\n    private int[] hits;\n\n    public HitCounter() {\n        times = new int[300];\n        hits = new int[300];\n    }\n\n    public void hit(int timestamp) {\n        int idx = timestamp % 300;\n        if (times[idx] != timestamp) {\n            times[idx] = timestamp;\n            hits[idx] = 1;\n        } else {\n            hits[idx]++;\n        }\n    }\n\n    public int getHits(int timestamp) {\n        int total = 0;\n        for (int i = 0; i < 300; i++) {\n            if (timestamp - times[i] < 300) {\n                total += hits[i];\n            }\n        }\n        return total;\n    }\n}",
      complexity: { time: '`hit`: O(1), `getHits`: O(300) = O(1)', space: 'O(1)' }
    }
  ]
  },
];
