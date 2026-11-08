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
    description: 'A phrase is a palindrome if, after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string `s`, return `true` if it is a palindrome, and `false` otherwise.',
    examples: [
    {
      input: 's = "race a car"',
      output: 'false',
      explanation: ''
    }
  ],
    constraints: '`1 <= s.length <= 2 * 10^5` - `s` consists only of printable ASCII characters.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Clean the string once, reverse it, and compare.',
      algorithm: ['1. Build `cleaned` by appending `Character.toLowerCase(c)` for each alphanumeric `c`.','2. Compare `cleaned` with its reverse.'],
      code: "class Solution {\n    public boolean isPalindrome(String s) {\n        StringBuilder sb = new StringBuilder();\n        for (char c : s.toCharArray()) {\n            if (Character.isLetterOrDigit(c)) {\n                sb.append(Character.toLowerCase(c));\n            }\n        }\n        String cleaned = sb.toString();\n        return cleaned.equals(sb.reverse().toString());\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: 'Store only the valid characters in a `char[]`, then run two pointers over that array. This separates the filtering step from the comparison step.',
      algorithm: ['1. Copy alphanumeric characters into a lowercase `char[]`.','2. Use `l = 0`, `r = len - 1`. While `l < r`, if `chars[l] != chars[r]`, return `false`. Otherwise move both inward.','3. Return `true`.'],
      code: "class Solution {\n    public boolean isPalindrome(String s) {\n        char[] chars = new char[s.length()];\n        int len = 0;\n        for (char c : s.toCharArray()) {\n            if (Character.isLetterOrDigit(c)) {\n                chars[len++] = Character.toLowerCase(c);\n            }\n        }\n        int l = 0, r = len - 1;\n        while (l < r) {\n            if (chars[l] != chars[r]) {\n                return false;\n            }\n            l++;\n            r--;\n        }\n        return true;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Skip non-alphanumeric characters with the pointers themselves. No copy is needed, so extra memory is constant.',
      algorithm: ['1. `l = 0`, `r = n - 1`.','2. While `l < r`:','- Advance `l` while `s[l]` is not alphanumeric.','- Retreat `r` while `s[r]` is not alphanumeric.','- If `toLowerCase(s[l]) != toLowerCase(s[r])`, return `false`.','- Move both pointers inward.','3. Return `true`.'],
      code: "class Solution {\n    public boolean isPalindrome(String s) {\n        int l = 0, r = s.length() - 1;\n        while (l < r) {\n            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;\n            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;\n            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) {\n                return false;\n            }\n            l++;\n            r--;\n        }\n        return true;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'two-sum-ii-input-array-is-sorted',
    title: 'Two Sum II - Input Array Is Sorted',
    difficulty: 'Medium',
    description: 'Given a **1-indexed** array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target`. Return the indices `[index1, index2]` (1-indexed), where `index1 < index2`. The tests are generated such that there is exactly one solution. You may not use the same element twice.',
    examples: [
    {
      input: 'numbers = [2,3,4]',
      output: '[1,3]',
      explanation: '2 + 4 = 6'
    }
  ],
    constraints: '`2 <= numbers.length <= 3 * 10^4` - `-1000 <= numbers[i] <= 1000` - `numbers` is sorted in non-decreasing order. - `-1000 <= target <= 1000` - Exactly one solution exists.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Check every pair.',
      algorithm: ['1. For each `i`, for each `j > i`, if `numbers[i] + numbers[j] == target`, return `{i+1, j+1}`.'],
      code: "class Solution {\n    public int[] twoSum(int[] numbers, int target) {\n        int n = numbers.length;\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                if (numbers[i] + numbers[j] == target) {\n                    return new int[]{i + 1, j + 1};\n                }\n            }\n        }\n        return new int[]{};\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(1)' }
    },
    {
      label: 'Better',
      intuition: 'For each `numbers[i]`, the complement is `target - numbers[i]`. Since the array is sorted, binary search finds it in $O(\\log n)$. Search only to the right of `i`, so each pair is considered once.',
      algorithm: ['1. For each `i`, compute `comp = target - numbers[i]`.','2. Binary search for `comp` in the range `(i, n)`.','3. If found at index `j`, return `{i+1, j+1}`.'],
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int[] twoSum(int[] numbers, int target) {\n        int n = numbers.length;\n        for (int i = 0; i < n; i++) {\n            int comp = target - numbers[i];\n            int j = Arrays.binarySearch(numbers, i + 1, n, comp);\n            if (j >= 0) {\n                return new int[]{i + 1, j + 1};\n            }\n        }\n        return new int[]{};\n    }\n}",
      complexity: { time: 'O(n \\log n)', space: 'O(1)' }
    },
    {
      label: 'Optimised',
      intuition: 'Ignore the sorted order and use a map of value to index, exactly as in Two Sum. It is linear, but it needs extra memory and does not exploit sortedness.',
      algorithm: ['1. For each `i`, check whether `target - numbers[i]` is in the map. If so, return `{map.get(comp) + 1, i + 1}`.','2. Otherwise store `numbers[i] -> i`.'],
      code: "import java.util.HashMap;\nimport java.util.Map;\n\nclass Solution {\n    public int[] twoSum(int[] numbers, int target) {\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < numbers.length; i++) {\n            Integer j = seen.get(target - numbers[i]);\n            if (j != null) {\n                return new int[]{j + 1, i + 1};\n            }\n            seen.put(numbers[i], i);\n        }\n        return new int[]{};\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Best',
      intuition: 'Start at both ends. If the sum is too small, the only way to increase it is to move `l` right, because `r` is already the largest remaining value. If too large, move `r` left. The first match is the answer, and no extra memory is needed.',
      algorithm: ['1. `l = 0`, `r = n - 1`.','2. While `l < r`:','- `sum = numbers[l] + numbers[r]`.','- If `sum == target`, return `{l+1, r+1}`.','- If `sum < target`, `l++`. Otherwise `r--`.'],
      code: "class Solution {\n    public int[] twoSum(int[] numbers, int target) {\n        int l = 0, r = numbers.length - 1;\n        while (l < r) {\n            int sum = numbers[l] + numbers[r];\n            if (sum == target) {\n                return new int[]{l + 1, r + 1};\n            } else if (sum < target) {\n                l++;\n            } else {\n                r--;\n            }\n        }\n        return new int[]{};\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: '3sum',
    title: '3Sum',
    difficulty: 'Medium',
    description: 'Given an integer array `nums`, return all the unique triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, `j != k`, and `nums[i] + nums[j] + nums[k] == 0`. The solution set must not contain duplicate triplets. The order of the triplets and the values within each triplet do not matter.',
    examples: [
    {
      input: 'nums = [0,1,1]',
      output: '[]',
      explanation: ''
    }
  ],
    constraints: '`3 <= nums.length <= 3000` - `-10^5 <= nums[i] <= 10^5`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Try every index triple, sort each valid triplet to canonical form, and let a set remove duplicates.',
      algorithm: ['1. For `i < j < k`, if the sum is zero, sort `[nums[i], nums[j], nums[k]]`.','2. Add the sorted list to a `HashSet`.','3. Return the set\'s contents.'],
      code: "import java.util.ArrayList;\nimport java.util.Arrays;\nimport java.util.HashSet;\nimport java.util.List;\nimport java.util.Set;\n\nclass Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        Set<List<Integer>> result = new HashSet<>();\n        int n = nums.length;\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                for (int k = j + 1; k < n; k++) {\n                    if (nums[i] + nums[j] + nums[k] == 0) {\n                        int[] t = {nums[i], nums[j], nums[k]};\n                        Arrays.sort(t);\n                        result.add(List.of(t[0], t[1], t[2]));\n                    }\n                }\n            }\n        }\n        return new ArrayList<>(result);\n    }\n}",
      complexity: { time: 'O(n^3)', space: 'O(u)' }
    },
    {
      label: 'Better',
      intuition: 'For a fixed `i`, scan `j` from `i+1`. Maintain a set of values seen so far. When `-(nums[i] + nums[j])` is already in the set, a triplet exists. Dedupe the result with a set of sorted triplets.',
      algorithm: ['1. For each `i`, create an empty `seen` set.','2. For each `j > i`: let `comp = -nums[i] - nums[j]`. If `comp` is in `seen`, add the sorted triplet to `result`.','3. Add `nums[j]` to `seen`.','4. Return the unique triplets.'],
      code: "import java.util.ArrayList;\nimport java.util.Collections;\nimport java.util.HashSet;\nimport java.util.List;\nimport java.util.Set;\n\nclass Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        Set<List<Integer>> result = new HashSet<>();\n        int n = nums.length;\n        for (int i = 0; i < n; i++) {\n            Set<Integer> seen = new HashSet<>();\n            for (int j = i + 1; j < n; j++) {\n                int comp = -nums[i] - nums[j];\n                if (seen.contains(comp)) {\n                    List<Integer> triplet = new ArrayList<>(List.of(nums[i], nums[j], comp));\n                    Collections.sort(triplet);\n                    result.add(triplet);\n                }\n                seen.add(nums[j]);\n            }\n        }\n        return new ArrayList<>(result);\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'After sorting, for a fixed `i` the remaining problem is 2Sum on a sorted subarray, solvable with two pointers. Duplicates are skipped at three points: the fixed `i`, and both pointers after a match. Since the array is sorted, a positive `nums[i]` means no later triplet can sum to zero, so the loop can stop early.',
      algorithm: ['1. Sort `nums`.','2. For each `i` from `0` to `n-3`:','- If `nums[i] > 0`, break.','- If `i > 0` and `nums[i] == nums[i-1]`, continue (skip duplicate fixed value).','- Set `l = i+1`, `r = n-1`. While `l < r`:','- `sum = nums[i] + nums[l] + nums[r]`.','- If `sum < 0`, `l++`. If `sum > 0`, `r--`.','- If `sum == 0`, record the triplet, move both pointers inward, and skip equal values on each side.','3. Return the result.'],
      code: "import java.util.ArrayList;\nimport java.util.Arrays;\nimport java.util.List;\n\nclass Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        Arrays.sort(nums);\n        List<List<Integer>> result = new ArrayList<>();\n        int n = nums.length;\n        for (int i = 0; i < n - 2; i++) {\n            if (nums[i] > 0) break;\n            if (i > 0 && nums[i] == nums[i - 1]) continue;\n            int l = i + 1, r = n - 1;\n            while (l < r) {\n                int sum = nums[i] + nums[l] + nums[r];\n                if (sum < 0) {\n                    l++;\n                } else if (sum > 0) {\n                    r--;\n                } else {\n                    result.add(List.of(nums[i], nums[l], nums[r]));\n                    l++;\n                    r--;\n                    while (l < r && nums[l] == nums[l - 1]) l++;\n                    while (l < r && nums[r] == nums[r + 1]) r--;\n                }\n            }\n        }\n        return result;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'container-with-most-water',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    description: 'You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`-th line are `(i, 0)` and `(i, height[i])`. Find two lines that, together with the x-axis, form a container that holds the most water. Return the maximum amount of water a container can store.',
    examples: [
    {
      input: 'height = [1,1]',
      output: '1',
      explanation: ''
    }
  ],
    constraints: '`2 <= n <= 10^5` - `0 <= height[i] <= 10^4`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Compute the area for every pair of lines.',
      algorithm: ['1. For each `i < j`, compute `min(height[i], height[j]) * (j - i)`.','2. Track the maximum.'],
      code: "class Solution {\n    public int maxArea(int[] height) {\n        int best = 0;\n        for (int i = 0; i < height.length; i++) {\n            for (int j = i + 1; j < height.length; j++) {\n                int area = Math.min(height[i], height[j]) * (j - i);\n                best = Math.max(best, area);\n            }\n        }\n        return best;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(1)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'A container\'s height is limited by its shorter wall. Moving the taller wall inward keeps the same limiting height but reduces the width, so it can never produce a larger area. Therefore, the shorter wall is the only one worth moving.',
      algorithm: ['1. `l = 0`, `r = n - 1`, `best = 0`.','2. While `l < r`:','- `best = max(best, min(height[l], height[r]) * (r - l))`.','- If `height[l] < height[r]`, `l++`. Otherwise `r--`.','3. Return `best`.'],
      code: "class Solution {\n    public int maxArea(int[] height) {\n        int l = 0, r = height.length - 1;\n        int best = 0;\n        while (l < r) {\n            int area = Math.min(height[l], height[r]) * (r - l);\n            best = Math.max(best, area);\n            if (height[l] < height[r]) {\n                l++;\n            } else {\n                r--;\n            }\n        }\n        return best;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    description: 'Given `n` non-negative integers `height` representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.',
    examples: [
    {
      input: 'height = [4,2,0,3,2,5]',
      output: '9',
      explanation: ''
    }
  ],
    constraints: '`1 <= n <= 2 * 10^4` - `0 <= height[i] <= 10^5`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'For each index, scan left and right to find the maxima, then add the trapped water.',
      algorithm: ['1. For each `i`, compute `maxL` as the max over `height[0..i]`.','2. Compute `maxR` as the max over `height[i..n-1]`.','3. Add `min(maxL, maxR) - height[i]`.'],
      code: "class Solution {\n    public int trap(int[] height) {\n        int n = height.length, total = 0;\n        for (int i = 0; i < n; i++) {\n            int maxL = 0, maxR = 0;\n            for (int j = 0; j <= i; j++) maxL = Math.max(maxL, height[j]);\n            for (int j = i; j < n; j++) maxR = Math.max(maxR, height[j]);\n            total += Math.min(maxL, maxR) - height[i];\n        }\n        return total;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(1)' }
    },
    {
      label: 'Better',
      intuition: 'Precompute `maxL[i]` and `maxR[i]` in two linear passes. Each index then needs only a constant-time lookup.',
      algorithm: ['1. `maxL[i] = max(maxL[i-1], height[i])`.','2. `maxR[i] = max(maxR[i+1], height[i])`.','3. Sum `min(maxL[i], maxR[i]) - height[i]` over all `i`.'],
      code: "class Solution {\n    public int trap(int[] height) {\n        int n = height.length;\n        int[] maxL = new int[n], maxR = new int[n];\n        maxL[0] = height[0];\n        for (int i = 1; i < n; i++) {\n            maxL[i] = Math.max(maxL[i - 1], height[i]);\n        }\n        maxR[n - 1] = height[n - 1];\n        for (int i = n - 2; i >= 0; i--) {\n            maxR[i] = Math.max(maxR[i + 1], height[i]);\n        }\n        int total = 0;\n        for (int i = 0; i < n; i++) {\n            total += Math.min(maxL[i], maxR[i]) - height[i];\n        }\n        return total;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'At any point, the side whose current bar is shorter determines the water level. If `height[l] < height[r]`, then `maxLeft` is the binding constraint on the left, because a taller bar exists on the right, so `maxLeft` is safe to use. Process the left side and advance `l`. Otherwise do the same on the right. This achieves the prefix/suffix result without arrays.',
      algorithm: ['1. `l = 0`, `r = n-1`, `lMax = 0`, `rMax = 0`, `total = 0`.','2. While `l < r`:','- If `height[l] < height[r]`:','- If `height[l] >= lMax`, update `lMax`. Otherwise add `lMax - height[l]`.','- `l++`.','- Else:','- If `height[r] >= rMax`, update `rMax`. Otherwise add `rMax - height[r]`.','- `r--`.','3. Return `total`.'],
      code: "class Solution {\n    public int trap(int[] height) {\n        int l = 0, r = height.length - 1;\n        int lMax = 0, rMax = 0, total = 0;\n        while (l < r) {\n            if (height[l] < height[r]) {\n                if (height[l] >= lMax) {\n                    lMax = height[l];\n                } else {\n                    total += lMax - height[l];\n                }\n                l++;\n            } else {\n                if (height[r] >= rMax) {\n                    rMax = height[r];\n                } else {\n                    total += rMax - height[r];\n                }\n                r--;\n            }\n        }\n        return total;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    description: 'You are given an array `prices` where `prices[i]` is the price of a stock on day `i`. You want to maximise profit by choosing a single day to buy and a later day to sell. Return the maximum profit. If no profit is possible, return `0`.',
    examples: [
    {
      input: 'prices = [7,6,4,3,1]',
      output: '0',
      explanation: ''
    }
  ],
    constraints: '`1 <= prices.length <= 10^5` - `0 <= prices[i] <= 10^4`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Try every pair with buy day before sell day.',
      algorithm: ['1. For each `i < j`, compute `prices[j] - prices[i]`.','2. Track the maximum, starting from `0`.'],
      code: "class Solution {\n    public int maxProfit(int[] prices) {\n        int best = 0;\n        for (int i = 0; i < prices.length; i++) {\n            for (int j = i + 1; j < prices.length; j++) {\n                best = Math.max(best, prices[j] - prices[i]);\n            }\n        }\n        return best;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(1)' }
    },
    {
      label: 'Better',
      intuition: 'Precompute `minSoFar[i]`, the lowest price up to day `i`. Then the best profit on day `i` is `prices[i] - minSoFar[i-1]`.',
      algorithm: ['1. Build `minSoFar` in one pass.','2. For each `i`, compute `prices[i] - minSoFar[i-1]`, and track the maximum.'],
      code: "class Solution {\n    public int maxProfit(int[] prices) {\n        int n = prices.length;\n        int[] minSoFar = new int[n];\n        minSoFar[0] = prices[0];\n        for (int i = 1; i < n; i++) {\n            minSoFar[i] = Math.min(minSoFar[i - 1], prices[i]);\n        }\n        int best = 0;\n        for (int i = 1; i < n; i++) {\n            best = Math.max(best, prices[i] - minSoFar[i - 1]);\n        }\n        return best;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'The prefix array is unnecessary. Keep only the minimum price seen so far, and update the best profit as you go.',
      algorithm: ['1. `minPrice = prices[0]`, `best = 0`.','2. For each price: `best = max(best, price - minPrice)`, then `minPrice = min(minPrice, price)`.','3. Return `best`.'],
      code: "class Solution {\n    public int maxProfit(int[] prices) {\n        int minPrice = prices[0], best = 0;\n        for (int price : prices) {\n            best = Math.max(best, price - minPrice);\n            minPrice = Math.min(minPrice, price);\n        }\n        return best;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    description: 'Given a string `s`, find the length of the longest substring without repeating characters.',
    examples: [
    {
      input: 's = "bbbbb"',
      output: '1',
      explanation: ''
    }
  ],
    constraints: '`0 <= s.length <= 5 * 10^4` - `s` consists of English letters, digits, symbols, and spaces (ASCII).',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'For each start index, extend the substring until a repeat appears, and record its length.',
      algorithm: ['1. For each `i`, create an empty set.','2. Extend `j` from `i` while `s[j]` is not already in the set, adding it.','3. The length is `j - i`. Track the maximum.'],
      code: "import java.util.HashSet;\nimport java.util.Set;\n\nclass Solution {\n    public int lengthOfLongestSubstring(String s) {\n        int best = 0, n = s.length();\n        for (int i = 0; i < n; i++) {\n            Set<Character> seen = new HashSet<>();\n            int j = i;\n            while (j < n && seen.add(s.charAt(j))) {\n                j++;\n            }\n            best = Math.max(best, j - i);\n        }\n        return best;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(\\min(n, m))' }
    },
    {
      label: 'Better',
      intuition: 'Maintain a set of characters in the current window. When the incoming character is already present, remove characters from the left until it is not.',
      algorithm: ['1. `left = 0`, `set` empty.','2. For each `right`:','- While `s[right]` is in `set`, remove `s[left]` and `left++`.','- Add `s[right]`.','- Update the maximum window length `right - left + 1`.'],
      code: "import java.util.HashSet;\nimport java.util.Set;\n\nclass Solution {\n    public int lengthOfLongestSubstring(String s) {\n        Set<Character> window = new HashSet<>();\n        int left = 0, best = 0;\n        for (int right = 0; right < s.length(); right++) {\n            char c = s.charAt(right);\n            while (window.contains(c)) {\n                window.remove(s.charAt(left++));\n            }\n            window.add(c);\n            best = Math.max(best, right - left + 1);\n        }\n        return best;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(\\min(n, m))' }
    },
    {
      label: 'Optimised',
      intuition: 'Instead of removing characters one by one, record each character\'s last index. When a repeat is found inside the window, jump `left` directly past the previous occurrence. The check `last >= left` matters, because an old occurrence outside the window is no longer relevant.',
      algorithm: ['1. For each `right`, let `c = s[right]`.','2. If `c` was last seen at index `p` and `p >= left`, set `left = p + 1`.','3. Store `lastSeen[c] = right`.','4. Update the maximum window length.'],
      code: "import java.util.HashMap;\nimport java.util.Map;\n\nclass Solution {\n    public int lengthOfLongestSubstring(String s) {\n        Map<Character, Integer> lastSeen = new HashMap<>();\n        int left = 0, best = 0;\n        for (int right = 0; right < s.length(); right++) {\n            char c = s.charAt(right);\n            Integer p = lastSeen.get(c);\n            if (p != null && p >= left) {\n                left = p + 1;\n            }\n            lastSeen.put(c, right);\n            best = Math.max(best, right - left + 1);\n        }\n        return best;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(\\min(n, m))' }
    },
    {
      label: 'Best',
      intuition: 'The character set is bounded (ASCII), so a plain array indexed by character code replaces the hash map. Storing `index + 1` lets a zero mean "never seen".',
      algorithm: ['1. `next[c]` holds one past the last index where `c` appeared (0 if never).','2. For each `right`, set `left = max(left, next[c])`.','3. Set `next[c] = right + 1`.','4. Update the best length.'],
      code: "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        int[] next = new int[256];\n        int left = 0, best = 0;\n        for (int right = 0; right < s.length(); right++) {\n            char c = s.charAt(right);\n            left = Math.max(left, next[c]);\n            next[c] = right + 1;\n            best = Math.max(best, right - left + 1);\n        }\n        return best;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'longest-repeating-character-replacement',
    title: 'Longest Repeating Character Replacement',
    difficulty: 'Medium',
    description: 'You are given a string `s` consisting of uppercase English letters and an integer `k`. You may choose any character and change it to any other uppercase letter, at most `k` times. Return the length of the longest substring containing the same letter you can get after performing the operations.',
    examples: [
    {
      input: 's = "AABABBA"',
      output: '4',
      explanation: ''
    }
  ],
    constraints: '`1 <= s.length <= 10^5` - `s` consists of only uppercase English letters. - `0 <= k <= s.length`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'For each start, extend the end and track the maximum frequency inside the window incrementally. Record any window that satisfies the condition.',
      algorithm: ['1. For each `i`, reset `count[26]` and `maxF = 0`.','2. For each `j >= i`, increment `count[s[j]]`, update `maxF`.','3. If `(j - i + 1) - maxF <= k`, update the answer.'],
      code: "class Solution {\n    public int characterReplacement(String s, int k) {\n        int n = s.length(), best = 0;\n        for (int i = 0; i < n; i++) {\n            int[] count = new int[26];\n            int maxF = 0;\n            for (int j = i; j < n; j++) {\n                count[s.charAt(j) - 'A']++;\n                maxF = Math.max(maxF, count[s.charAt(j) - 'A']);\n                if ((j - i + 1) - maxF <= k) {\n                    best = Math.max(best, j - i + 1);\n                }\n            }\n        }\n        return best;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(1)' }
    },
    {
      label: 'Better',
      intuition: 'Use a standard sliding window. Shrink while the window is invalid, recomputing the max frequency over the 26 letters each time. This is correct and simple, at a small constant-factor cost.',
      algorithm: ['1. For `right` from `0` to `n-1`, add `s[right]` to `count`.','2. While `windowSize - maxFreq(count) > k`, remove `s[left]` and `left++`.','3. Update the best window size.'],
      code: "class Solution {\n    public int characterReplacement(String s, int k) {\n        int[] count = new int[26];\n        int left = 0, best = 0;\n        for (int right = 0; right < s.length(); right++) {\n            count[s.charAt(right) - 'A']++;\n            while ((right - left + 1) - maxFreq(count) > k) {\n                count[s.charAt(left) - 'A']--;\n                left++;\n            }\n            best = Math.max(best, right - left + 1);\n        }\n        return best;\n    }\n\n    private int maxFreq(int[] count) {\n        int m = 0;\n        for (int c : count) m = Math.max(m, c);\n        return m;\n    }\n}",
      complexity: { time: 'O(26 \\cdot n) = O(n)', space: 'O(1)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'The answer only grows when a new window exceeds the best length so far. So the window never needs to shrink; it only slides. Keep `maxF` as the largest frequency ever seen in any window. A stale `maxF` can only overstate validity, but a window longer than the best answer requires a genuinely larger `maxF` to appear, and that is exactly what updates it. The window size therefore never decreases in a way that changes the answer.',
      algorithm: ['1. For each `right`, increment `count[s[right]]`, and update `maxF = max(maxF, count[s[right]])`.','2. If `(right - left + 1) - maxF > k`, decrement `count[s[left]]` and `left++`. The window slides rather than shrinks.','3. Return `s.length() - left` at the end (the final window size).'],
      code: "class Solution {\n    public int characterReplacement(String s, int k) {\n        int[] count = new int[26];\n        int left = 0, maxF = 0;\n        for (int right = 0; right < s.length(); right++) {\n            count[s.charAt(right) - 'A']++;\n            maxF = Math.max(maxF, count[s.charAt(right) - 'A']);\n            if ((right - left + 1) - maxF > k) {\n                count[s.charAt(left) - 'A']--;\n                left++;\n            }\n        }\n        return s.length() - left;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'permutation-in-string',
    title: 'Permutation in String',
    difficulty: 'Medium',
    description: 'Given two strings `s1` and `s2`, return `true` if `s2` contains a permutation of `s1` as a substring, and `false` otherwise. In other words, return `true` if one of `s1`\'s permutations is a substring of `s2`.',
    examples: [
    {
      input: 's1 = "ab"',
      output: 'false',
      explanation: ''
    }
  ],
    constraints: '`1 <= s1.length, s2.length <= 10^4` - `s1` and `s2` consist of lowercase English letters.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Sorting is a canonical form for permutations. Sort `s1` once, then sort each window of length `m` in `s2` and compare.',
      algorithm: ['1. If `m > n`, return `false`.','2. Sort `s1` into `target`.','3. For each start `i` in `s2`, copy `s2[i..i+m)`, sort it, and compare with `target`.'],
      code: "import java.util.Arrays;\n\nclass Solution {\n    public boolean checkInclusion(String s1, String s2) {\n        int m = s1.length(), n = s2.length();\n        if (m > n) return false;\n        char[] target = s1.toCharArray();\n        Arrays.sort(target);\n        for (int i = 0; i + m <= n; i++) {\n            char[] window = s2.substring(i, i + m).toCharArray();\n            Arrays.sort(window);\n            if (Arrays.equals(window, target)) {\n                return true;\n            }\n        }\n        return false;\n    }\n}",
      complexity: { time: 'O(n \\cdot m \\log m)', space: 'O(m)' }
    },
    {
      label: 'Better',
      intuition: 'Replace sorting with letter counts. Maintain the counts of the current window, and compare the 26-slot array with `s1`\'s counts at each step. Each step adds one character and removes one.',
      algorithm: ['1. Build `need` from `s1`.','2. For each index `i` in `s2`, add `s2[i]` to `have`. If `i >= m`, remove `s2[i-m]`.','3. Once `i >= m - 1`, the window is full. If `have` equals `need`, return `true`.'],
      code: "import java.util.Arrays;\n\nclass Solution {\n    public boolean checkInclusion(String s1, String s2) {\n        int m = s1.length(), n = s2.length();\n        if (m > n) return false;\n        int[] need = new int[26], have = new int[26];\n        for (char c : s1.toCharArray()) need[c - 'a']++;\n        for (int i = 0; i < n; i++) {\n            have[s2.charAt(i) - 'a']++;\n            if (i >= m) {\n                have[s2.charAt(i - m) - 'a']--;\n            }\n            if (i >= m - 1 && Arrays.equals(need, have)) {\n                return true;\n            }\n        }\n        return false;\n    }\n}",
      complexity: { time: 'O(26 \\cdot n) = O(n)', space: 'O(1)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Rather than comparing all 26 slots on every step, track `diff = have - need` per letter, and a counter `nonZero` of letters where `diff != 0`. The window matches exactly when `nonZero == 0`. Updates touch only one or two slots, so each step is O(1).',
      algorithm: ['1. For each character of `s1`, decrement `diff`. Count the non-zero entries into `nonZero`.','2. For each index `i` in `s2`:','- Add `s2[i]`: if `diff` was `0` before, `nonZero++`. Increment. If it is now `0`, `nonZero--`.','- If `i >= m`, remove `s2[i-m]` with the mirror logic.','- If `i >= m - 1` and `nonZero == 0`, return `true`.','3. Return `false`.'],
      code: "class Solution {\n    public boolean checkInclusion(String s1, String s2) {\n        int m = s1.length(), n = s2.length();\n        if (m > n) return false;\n        int[] diff = new int[26];\n        for (char c : s1.toCharArray()) diff[c - 'a']--;\n        int nonZero = 0;\n        for (int d : diff) if (d != 0) nonZero++;\n\n        for (int i = 0; i < n; i++) {\n            int add = s2.charAt(i) - 'a';\n            if (diff[add] == 0) nonZero++;\n            diff[add]++;\n            if (diff[add] == 0) nonZero--;\n\n            if (i >= m) {\n                int rem = s2.charAt(i - m) - 'a';\n                if (diff[rem] == 0) nonZero++;\n                diff[rem]--;\n                if (diff[rem] == 0) nonZero--;\n            }\n            if (i >= m - 1 && nonZero == 0) {\n                return true;\n            }\n        }\n        return false;\n    }\n}",
      complexity: { time: 'O(n + 26) = O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'minimum-window-substring',
    title: 'Minimum Window Substring',
    difficulty: 'Hard',
    description: 'Given two strings `s` and `t` of lengths `m` and `n`, return the **minimum window substring** of `s` such that every character in `t` (including duplicates) is included in the window. If no such substring exists, return the empty string `""`. The test cases are generated such that the answer is unique.',
    examples: [
    {
      input: 's = "a"',
      output: '"a"',
      explanation: ''
    }
  ],
    constraints: '`1 <= m, n <= 10^5` - `s` and `t` consist of uppercase and lowercase English letters.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Enumerate every substring and check whether it covers `t`. Coverage is verified by comparing counts against `t`\'s requirements.',
      algorithm: ['1. Count the required letters from `t`.','2. For each start `i`, extend `j` from `i`, maintaining window counts.','3. Whenever every required count is satisfied, record the window if it is shorter than the best so far.'],
      code: "class Solution {\n    public String minWindow(String s, String t) {\n        int[] need = new int[128];\n        for (char c : t.toCharArray()) need[c]++;\n        int n = s.length(), bestLen = Integer.MAX_VALUE, bestStart = 0;\n        for (int i = 0; i < n; i++) {\n            int[] win = new int[128];\n            for (int j = i; j < n; j++) {\n                win[s.charAt(j)]++;\n                if (covers(win, need) && j - i + 1 < bestLen) {\n                    bestLen = j - i + 1;\n                    bestStart = i;\n                }\n            }\n        }\n        return bestLen == Integer.MAX_VALUE ? \"\" : s.substring(bestStart, bestStart + bestLen);\n    }\n\n    private boolean covers(int[] win, int[] need) {\n        for (int c = 0; c < 128; c++) {\n            if (win[c] < need[c]) return false;\n        }\n        return true;\n    }\n}",
      complexity: { time: 'O(n^2 \\cdot 128)', space: 'O(1)' }
    },
    {
      label: 'Better',
      intuition: 'Maintain a window with a map of counts and a `formed` counter, the number of distinct characters whose window count meets the requirement. The window is valid when `formed == required`. Shrink from the left while valid, recording each valid window.',
      algorithm: ['1. Build `need` from `t`. Let `required = need.size()`.','2. Expand `right`: add `s[right]` to `win`. If its count now equals `need`, increment `formed`.','3. While `formed == required`: record the window if it is smaller. Remove `s[left]`. If its count drops below `need`, decrement `formed`. Advance `left`.','4. Return the best window, or `""`.'],
      code: "import java.util.HashMap;\nimport java.util.Map;\n\nclass Solution {\n    public String minWindow(String s, String t) {\n        Map<Character, Integer> need = new HashMap<>();\n        for (char c : t.toCharArray()) need.merge(c, 1, Integer::sum);\n        int required = need.size(), formed = 0;\n        Map<Character, Integer> win = new HashMap<>();\n        int left = 0, bestLen = Integer.MAX_VALUE, bestStart = 0;\n\n        for (int right = 0; right < s.length(); right++) {\n            char c = s.charAt(right);\n            win.merge(c, 1, Integer::sum);\n            if (need.containsKey(c) && win.get(c).intValue() == need.get(c).intValue()) {\n                formed++;\n            }\n            while (formed == required) {\n                if (right - left + 1 < bestLen) {\n                    bestLen = right - left + 1;\n                    bestStart = left;\n                }\n                char o = s.charAt(left);\n                win.put(o, win.get(o) - 1);\n                if (need.containsKey(o) && win.get(o) < need.get(o)) {\n                    formed--;\n                }\n                left++;\n            }\n        }\n        return bestLen == Integer.MAX_VALUE ? \"\" : s.substring(bestStart, bestStart + bestLen);\n    }\n}",
      complexity: { time: 'O(m + n)', space: 'O(\\sigma)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Same logic as the map version, with fixed 128-slot arrays in place of hash maps. Arrays are faster and avoid boxing. A character with `need[c] == 0` does not contribute to `formed`, so only required characters are checked.',
      algorithm: ['1. `need[c]` counts `t`. `required` counts distinct characters with `need > 0`.','2. Slide the window as in the map version, using `win[c]` and comparing against `need[c]`.','3. Return the minimal window.'],
      code: "class Solution {\n    public String minWindow(String s, String t) {\n        int[] need = new int[128], win = new int[128];\n        int required = 0;\n        for (char c : t.toCharArray()) {\n            if (need[c] == 0) required++;\n            need[c]++;\n        }\n        int formed = 0, left = 0, bestLen = Integer.MAX_VALUE, bestStart = 0;\n        for (int right = 0; right < s.length(); right++) {\n            char c = s.charAt(right);\n            win[c]++;\n            if (need[c] > 0 && win[c] == need[c]) formed++;\n            while (formed == required) {\n                if (right - left + 1 < bestLen) {\n                    bestLen = right - left + 1;\n                    bestStart = left;\n                }\n                char o = s.charAt(left);\n                win[o]--;\n                if (need[o] > 0 && win[o] < need[o]) formed--;\n                left++;\n            }\n        }\n        return bestLen == Integer.MAX_VALUE ? \"\" : s.substring(bestStart, bestStart + bestLen);\n    }\n}",
      complexity: { time: 'O(m + n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'sliding-window-maximum',
    title: 'Sliding Window Maximum',
    difficulty: 'Hard',
    description: 'You are given an array of integers `nums`. A sliding window of size `k` moves from the very left of the array to the very right, one position at a time. Return an array of the maximum value in each window.',
    examples: [
    {
      input: 'nums = [1]',
      output: '[1]',
      explanation: ''
    }
  ],
    constraints: '`1 <= nums.length <= 10^5` - `-10^4 <= nums[i] <= 10^4` - `1 <= k <= nums.length`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'For each window position, scan all `k` elements for the maximum.',
      algorithm: ['1. For each start `i` from `0` to `n-k`, compute the max over `nums[i..i+k)`.','2. Store it in the result.'],
      code: "class Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        int n = nums.length;\n        int[] result = new int[n - k + 1];\n        for (int i = 0; i + k <= n; i++) {\n            int m = Integer.MIN_VALUE;\n            for (int j = i; j < i + k; j++) {\n                m = Math.max(m, nums[j]);\n            }\n            result[i] = m;\n        }\n        return result;\n    }\n}",
      complexity: { time: 'O(n \\cdot k)', space: 'O(1)' }
    },
    {
      label: 'Better',
      intuition: 'A max-heap of `(value, index)` gives the current maximum quickly. Elements that have left the window are not removed immediately. They are discarded lazily when they reach the top, because their index is out of range.',
      algorithm: ['1. For each `i`, push `(nums[i], i)`.','2. While the top\'s index is `<= i - k`, pop it.','3. Once `i >= k - 1`, the top is the maximum of the current window. Record it.'],
      code: "import java.util.PriorityQueue;\n\nclass Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        int n = nums.length;\n        int[] result = new int[n - k + 1];\n        PriorityQueue<int[]> maxHeap = new PriorityQueue<>((a, b) -> b[0] - a[0]);\n        for (int i = 0; i < n; i++) {\n            maxHeap.offer(new int[]{nums[i], i});\n            while (maxHeap.peek()[1] <= i - k) {\n                maxHeap.poll();\n            }\n            if (i >= k - 1) {\n                result[i - k + 1] = maxHeap.peek()[0];\n            }\n        }\n        return result;\n    }\n}",
      complexity: { time: 'O(n \\log n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Keep a deque of indices whose values are in decreasing order from front to back. Before adding index `i`, drop any indices at the back with smaller values, because `i` is larger and outlasts them. Drop the front index once it leaves the window. The front is always the current maximum. Each index enters and leaves the deque at most once.',
      algorithm: ['1. For each `i`:','- Remove the front index if it is `<= i - k` (out of the window).','- Remove from the back while `nums[back] <= nums[i]`.','- Push `i` to the back.','2. If `i >= k - 1`, `nums[front]` is the window maximum. Record it.'],
      code: "import java.util.ArrayDeque;\nimport java.util.Deque;\n\nclass Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        int n = nums.length;\n        int[] result = new int[n - k + 1];\n        Deque<Integer> dq = new ArrayDeque<>();\n        for (int i = 0; i < n; i++) {\n            while (!dq.isEmpty() && dq.peekFirst() <= i - k) {\n                dq.pollFirst();\n            }\n            while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) {\n                dq.pollLast();\n            }\n            dq.offerLast(i);\n            if (i >= k - 1) {\n                result[i - k + 1] = nums[dq.peekFirst()];\n            }\n        }\n        return result;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(k)' }
    }
  ]
  },
  {
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    description: 'Given a string `s` containing only the characters `\'(\'`, `\')\'`, `\'{\'`, `\'}\'`, `\'[\'`, and `\']\'`, determine whether it is valid. A string is valid if: 1. Every open bracket is closed by a bracket of the same type. 2. Open brackets are closed in the correct order. 3. Every close bracket has a corresponding open bracket of the same type.',
    examples: [
    {
      input: 's = "([)]"',
      output: 'false',
      explanation: '['
    }
  ],
    constraints: '`1 <= s.length <= 10^4` - `s` consists only of `()[]{}`.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Any adjacent matching pair can be deleted without changing validity. Keep deleting pairs until no more are found. A valid string reduces to empty.',
      algorithm: ['1. While the string contains `()`, `[]`, or `{}`, remove all occurrences.','2. Return whether the result is empty.'],
      code: "class Solution {\n    public boolean isValid(String s) {\n        while (true) {\n            String t = s.replace(\"()\", \"\").replace(\"[]\", \"\").replace(\"{}\", \"\");\n            if (t.equals(s)) break;\n            s = t;\n        }\n        return s.isEmpty();\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: 'Push openers. On a closer, pop and check whether the popped opener matches it, using a lookup table. This is the standard stack solution, written with a `Deque` and a map.',
      algorithm: ['1. Map each closer to its opener.','2. For each character: if it is a closer, pop (fail if the stack is empty or the top doesn\'t match). Otherwise push.','3. Return `true` only if the stack is empty at the end.'],
      code: "import java.util.ArrayDeque;\nimport java.util.Deque;\nimport java.util.Map;\n\nclass Solution {\n    public boolean isValid(String s) {\n        Map<Character, Character> match = Map.of(')', '(', ']', '[', '}', '{');\n        Deque<Character> stack = new ArrayDeque<>();\n        for (char c : s.toCharArray()) {\n            if (match.containsKey(c)) {\n                if (stack.isEmpty() || stack.pop() != match.get(c)) {\n                    return false;\n                }\n            } else {\n                stack.push(c);\n            }\n        }\n        return stack.isEmpty();\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'The stack never holds more than `n` items, so a fixed `char[]` with an index pointer avoids boxing `Character` objects and the map lookups. The matching check becomes a direct character comparison.',
      algorithm: ['1. `stack = new char[n]`, `top = -1`.','2. For each `c`:','- If `c` is an opener, `stack[++top] = c`.','- Otherwise, if `top < 0` or the expected opener (`(`, `[`, or `{` for `)`, `]`, `}`) is not `stack[top]`, return `false`. Else `top--`.','3. Return `top == -1`.'],
      code: "class Solution {\n    public boolean isValid(String s) {\n        char[] stack = new char[s.length()];\n        int top = -1;\n        for (int i = 0; i < s.length(); i++) {\n            char c = s.charAt(i);\n            if (c == '(' || c == '[' || c == '{') {\n                stack[++top] = c;\n            } else {\n                char expected = c == ')' ? '(' : c == ']' ? '[' : '{';\n                if (top < 0 || stack[top] != expected) {\n                    return false;\n                }\n                top--;\n            }\n        }\n        return top == -1;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'min-stack',
    title: 'Min Stack',
    difficulty: 'Medium',
    description: 'Design a stack that supports `push`, `pop`, `top`, and retrieving the minimum element, all in constant time. Implement the `MinStack` class: - `MinStack()` initialises the stack. - `void push(int val)` pushes `val` onto the stack. - `void pop()` removes the element on the top. - `int top()` gets the top element. - `int getMin()` retrieves the minimum element in the stack.',
    examples: [
    {
      input: 'push(5), push(5), getMin(), pop(), getMin()',
      output: '5, 5',
      explanation: ''
    }
  ],
    constraints: '`-2^31 <= val <= 2^31 - 1` - `pop`, `top`, and `getMin` are called only on non-empty stacks. - At most `3 * 10^4` calls total.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Store values only. For `getMin`, scan the whole stack.',
      algorithm: ['1. `push` and `pop` and `top` use a standard stack.','2. `getMin` iterates over all elements and returns the smallest.'],
      code: "import java.util.ArrayDeque;\nimport java.util.Deque;\n\nclass MinStack {\n    private final Deque<Integer> stack = new ArrayDeque<>();\n\n    public void push(int val) { stack.push(val); }\n    public void pop() { stack.pop(); }\n    public int top() { return stack.peek(); }\n\n    public int getMin() {\n        int min = Integer.MAX_VALUE;\n        for (int v : stack) {\n            min = Math.min(min, v);\n        }\n        return min;\n    }\n}",
      complexity: { time: '`getMin` is O(n); other operations are O(1)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: 'Keep a second stack of minimums. When a value is pushed that is `<=` the current minimum, push it onto the min stack too. On `pop`, pop the min stack if the removed value equals its top. Using `<=` (not `<`) is what keeps duplicates correct.',
      algorithm: ['1. `push(v)`: push to `stack`. If `minStack` is empty or `v <= minStack.peek()`, push to `minStack`.','2. `pop()`: `v = stack.pop()`. If `v == minStack.peek()`, pop `minStack`.','3. `getMin()`: return `minStack.peek()`.'],
      code: "import java.util.ArrayDeque;\nimport java.util.Deque;\n\nclass MinStack {\n    private final Deque<Integer> stack = new ArrayDeque<>();\n    private final Deque<Integer> minStack = new ArrayDeque<>();\n\n    public void push(int val) {\n        stack.push(val);\n        if (minStack.isEmpty() || val <= minStack.peek()) {\n            minStack.push(val);\n        }\n    }\n\n    public void pop() {\n        int v = stack.pop();\n        if (v == minStack.peek()) {\n            minStack.pop();\n        }\n    }\n\n    public int top() { return stack.peek(); }\n    public int getMin() { return minStack.peek(); }\n}",
      complexity: { time: 'O(1)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Store each value alongside the minimum of the stack at the time it was pushed. The pair is self-contained, so pops need no synchronisation with a second stack. The minimum of the stack is always the minimum stored at the top.',
      algorithm: ['1. `push(v)`: `m = stack.isEmpty() ? v : min(v, stack.peek()[1])`. Push `{v, m}`.','2. `pop()`: remove the top pair.','3. `top()`: `stack.peek()[0]`.','4. `getMin()`: `stack.peek()[1]`.'],
      code: "import java.util.ArrayDeque;\nimport java.util.Deque;\n\nclass MinStack {\n    private final Deque<int[]> stack = new ArrayDeque<>();\n\n    public void push(int val) {\n        int m = stack.isEmpty() ? val : Math.min(val, stack.peek()[1]);\n        stack.push(new int[]{val, m});\n    }\n\n    public void pop() { stack.pop(); }\n    public int top() { return stack.peek()[0]; }\n    public int getMin() { return stack.peek()[1]; }\n}",
      complexity: { time: 'O(1)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'evaluate-reverse-polish-notation',
    title: 'Evaluate Reverse Polish Notation',
    difficulty: 'Medium',
    description: 'You are given an array of strings `tokens` that represents a valid arithmetic expression in Reverse Polish Notation. Evaluate the expression and return an integer. Operators are `+`, `-`, `*`, and `/`. Division between two integers truncates toward zero.',
    examples: [
    {
      input: 'tokens = ["4","13","5","/","+"]',
      output: '6',
      explanation: '4 + (13 / 5) = 4 + 2 = 6'
    }
  ],
    constraints: '`1 <= tokens.length <= 10^4` - Each token is an integer or one of `+`, `-`, `*`, `/`. - The expression is valid, and no division by zero occurs. - All intermediate results fit in a 32-bit integer.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Read the expression from right to left. The last token is an operator, and its operands are the expressions that end at the preceding tokens. Recursion reads each subexpression off the back of the array.',
      algorithm: ['1. `eval()` takes the token at the current index and moves the index left.','2. If the token is a number, return it.','3. Otherwise, `right = eval()`, then `left = eval()`, and return `left op right`.'],
      code: "class Solution {\n    private int pos;\n    private String[] tokens;\n\n    public int evalRPN(String[] tokens) {\n        this.tokens = tokens;\n        this.pos = tokens.length - 1;\n        return eval();\n    }\n\n    private int eval() {\n        String tok = tokens[pos--];\n        if (!isOperator(tok)) {\n            return Integer.parseInt(tok);\n        }\n        int right = eval();\n        int left = eval();\n        return apply(left, tok, right);\n    }\n\n    private boolean isOperator(String tok) {\n        return tok.length() == 1 && \"+-*/\".indexOf(tok.charAt(0)) >= 0;\n    }\n\n    private int apply(int a, String op, int b) {\n        switch (op) {\n            case \"+\": return a + b;\n            case \"-\": return a - b;\n            case \"*\": return a * b;\n            default:  return a / b;\n        }\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: 'Standard stack evaluation. Numbers are pushed. Operators pop two values and push the result.',
      algorithm: ['1. For each token: if it is a number, push its integer value.','2. If it is an operator, pop `b` then `a`, compute `a op b`, and push the result.','3. Return the single remaining value.'],
      code: "import java.util.ArrayDeque;\nimport java.util.Deque;\n\nclass Solution {\n    public int evalRPN(String[] tokens) {\n        Deque<Integer> stack = new ArrayDeque<>();\n        for (String tok : tokens) {\n            switch (tok) {\n                case \"+\" -> stack.push(stack.pop() + stack.pop());\n                case \"-\" -> {\n                    int b = stack.pop(), a = stack.pop();\n                    stack.push(a - b);\n                }\n                case \"*\" -> stack.push(stack.pop() * stack.pop());\n                case \"/\" -> {\n                    int b = stack.pop(), a = stack.pop();\n                    stack.push(a / b);\n                }\n                default -> stack.push(Integer.parseInt(tok));\n            }\n        }\n        return stack.pop();\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'The same algorithm with a primitive `int[]` stack. This removes boxing and the per-element cost of `Deque`, which matters on large inputs.',
      algorithm: ['1. `st = new int[n]`, `top = -1`.','2. For each token: if it is `+`, `-`, `*`, or `/`, compute `st[top-1] op st[top]` and decrement `top`. Otherwise push the number.','3. Return `st[0]`.'],
      code: "class Solution {\n    public int evalRPN(String[] tokens) {\n        int[] st = new int[tokens.length];\n        int top = -1;\n        for (String tok : tokens) {\n            if (tok.length() == 1) {\n                char c = tok.charAt(0);\n                if (c == '+' || c == '-' || c == '*' || c == '/') {\n                    int b = st[top--];\n                    int a = st[top];\n                    st[top] = switch (c) {\n                        case '+' -> a + b;\n                        case '-' -> a - b;\n                        case '*' -> a * b;\n                        default -> a / b;\n                    };\n                    continue;\n                }\n            }\n            st[++top] = Integer.parseInt(tok);\n        }\n        return st[0];\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'generate-parentheses',
    title: 'Generate Parentheses',
    difficulty: 'Medium',
    description: 'Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses. Return the answer in any order.',
    examples: [
    {
      input: 'n = 1',
      output: '["()"]',
      explanation: ''
    }
  ],
    constraints: '`1 <= n <= 8`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'There are $2^{2n}$ strings of length $2n$ over `(` and `)`. Enumerate them all and keep those with a non-negative running balance that ends at zero.',
      algorithm: ['1. For each bitmask `mask` in `[0, 2^(2n))`, bit `i` set means `(`, otherwise `)`.','2. Walk the string with a balance counter. If it ever goes negative, reject. At the end, keep it only if the balance is zero.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public List<String> generateParenthesis(int n) {\n        List<String> result = new ArrayList<>();\n        int len = 2 * n;\n        for (int mask = 0; mask < (1 << len); mask++) {\n            StringBuilder sb = new StringBuilder();\n            int balance = 0;\n            boolean valid = true;\n            for (int i = 0; i < len; i++) {\n                char c = ((mask >> i) & 1) == 1 ? '(' : ')';\n                sb.append(c);\n                balance += c == '(' ? 1 : -1;\n                if (balance < 0) {\n                    valid = false;\n                    break;\n                }\n            }\n            if (valid && balance == 0) {\n                result.add(sb.toString());\n            }\n        }\n        return result;\n    }\n}",
      complexity: { time: 'O(4^n \\cdot n)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: 'Only explore valid prefixes. Track how many `(` and `)` have been used. Add `(` if fewer than `n` are used. Add `)` if it would not exceed the number of `(`. Backtrack by removing the last character.',
      algorithm: ['1. `backtrack(sb, open, close)`.','2. If `sb.length() == 2n`, record the string.','3. If `open < n`, append `(` and recurse, then remove it.','4. If `close < open`, append `)` and recurse, then remove it.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public List<String> generateParenthesis(int n) {\n        List<String> result = new ArrayList<>();\n        backtrack(new StringBuilder(), 0, 0, n, result);\n        return result;\n    }\n\n    private void backtrack(StringBuilder sb, int open, int close, int n, List<String> result) {\n        if (sb.length() == 2 * n) {\n            result.add(sb.toString());\n            return;\n        }\n        if (open < n) {\n            sb.append('(');\n            backtrack(sb, open + 1, close, n, result);\n            sb.deleteCharAt(sb.length() - 1);\n        }\n        if (close < open) {\n            sb.append(')');\n            backtrack(sb, open, close + 1, n, result);\n            sb.deleteCharAt(sb.length() - 1);\n        }\n    }\n}",
      complexity: { time: 'O(4^n / \\sqrt{n})', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Write into a pre-sized `char[]` at position `pos`. Each recursive call overwrites the slot it owns, so no undo step is needed, and the final copy happens only for complete strings.',
      algorithm: ['1. `buf = new char[2n]`.','2. `dfs(pos, open, close)`:','- If `pos == 2n`, add `new String(buf)`.','- If `open < n`: `buf[pos] = \'(\'`, recurse with `open + 1`.','- If `close < open`: `buf[pos] = \')\'`, recurse with `close + 1`.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public List<String> generateParenthesis(int n) {\n        List<String> result = new ArrayList<>();\n        dfs(new char[2 * n], 0, 0, 0, n, result);\n        return result;\n    }\n\n    private void dfs(char[] buf, int pos, int open, int close, int n, List<String> result) {\n        if (pos == buf.length) {\n            result.add(new String(buf));\n            return;\n        }\n        if (open < n) {\n            buf[pos] = '(';\n            dfs(buf, pos + 1, open + 1, close, n, result);\n        }\n        if (close < open) {\n            buf[pos] = ')';\n            dfs(buf, pos + 1, open, close + 1, n, result);\n        }\n    }\n}",
      complexity: { time: 'O(4^n / \\sqrt{n})', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'daily-temperatures',
    title: 'Daily Temperatures',
    difficulty: 'Medium',
    description: 'Given an array of integers `temperatures` representing daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after day `i` to get a warmer temperature. If there is no future day for which this is possible, set `answer[i] = 0`.',
    examples: [
    {
      input: 'temperatures = [30,40,50,60]',
      output: '[1,1,1,0]',
      explanation: ''
    }
  ],
    constraints: '`1 <= temperatures.length <= 10^5` - `30 <= temperatures[i] <= 100`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'For each day, look forward until a warmer one appears.',
      algorithm: ['1. For each `i`, scan `j = i+1, ...`.','2. The first `j` with `temperatures[j] > temperatures[i]` gives `answer[i] = j - i`.','3. If none is found, `answer[i]` stays `0`.'],
      code: "class Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        int n = temperatures.length;\n        int[] answer = new int[n];\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                if (temperatures[j] > temperatures[i]) {\n                    answer[i] = j - i;\n                    break;\n                }\n            }\n        }\n        return answer;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(1)' }
    },
    {
      label: 'Optimised',
      intuition: 'Temperatures are bounded at 100. Scan from right to left, keeping `nextIdx[t]`, the nearest index to the right with temperature exactly `t`. For day `i`, the answer is the minimum `nextIdx[t] - i` over all `t` warmer than `temperatures[i]`. That is at most 70 comparisons per day, a constant.',
      algorithm: ['1. `nextIdx = new int[101]`, filled with `-1`.','2. For `i` from `n-1` down to `0`:','- For each `t` in `(temperatures[i], 100]` with `nextIdx[t] != -1`, track the smallest index.','- If found, `answer[i] = minIdx - i`.','- Set `nextIdx[temperatures[i]] = i`.'],
      code: "class Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        int n = temperatures.length;\n        int[] answer = new int[n];\n        int[] nextIdx = new int[101];\n        java.util.Arrays.fill(nextIdx, -1);\n        for (int i = n - 1; i >= 0; i--) {\n            int t0 = temperatures[i];\n            int best = Integer.MAX_VALUE;\n            for (int t = t0 + 1; t <= 100; t++) {\n                if (nextIdx[t] != -1) {\n                    best = Math.min(best, nextIdx[t]);\n                }\n            }\n            if (best != Integer.MAX_VALUE) {\n                answer[i] = best - i;\n            }\n            nextIdx[t0] = i;\n        }\n        return answer;\n    }\n}",
      complexity: { time: 'O(100 \\cdot n) = O(n)', space: 'O(1)' }
    },
    {
      label: 'Best',
      intuition: 'Maintain a stack of indices whose temperatures are in decreasing order, all still waiting for a warmer day. When day `i` is warmer than the top, pop that index and set its answer to `i - index`. Repeat, since `i` may resolve several days. Then push `i`. Every index is pushed and popped once.',
      algorithm: ['1. For each `i`:','- While the stack is not empty and `temperatures[stack.peek()] < temperatures[i]`:','- Pop `j`, set `answer[j] = i - j`.','- Push `i`.','2. Indices left on the stack keep `answer = 0`.'],
      code: "import java.util.ArrayDeque;\nimport java.util.Deque;\n\nclass Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        int n = temperatures.length;\n        int[] answer = new int[n];\n        Deque<Integer> stack = new ArrayDeque<>();\n        for (int i = 0; i < n; i++) {\n            while (!stack.isEmpty() && temperatures[stack.peek()] < temperatures[i]) {\n                int j = stack.pop();\n                answer[j] = i - j;\n            }\n            stack.push(i);\n        }\n        return answer;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'car-fleet',
    title: 'Car Fleet',
    difficulty: 'Medium',
    description: 'There are `n` cars travelling to a destination `target` miles away on a single-lane road. You are given two integer arrays: `position` (the starting mile of each car) and `speed` (the speed of each car in miles per hour). A car cannot pass another car ahead of it. If it catches up to a car, it slows down to that car\'s speed and travels together with it as a **car fleet**. A fleet is a single car or a group of cars that arrive at the destination at the same time. Return the number of car fleets that arrive at the destination.',
    examples: [
    {
      input: 'target = 10',
      output: '1',
      explanation: ''
    }
  ],
    constraints: '`n == position.length == speed.length` - `1 <= n <= 10^5` - `0 < target <= 10^6` - `0 <= position[i] < target`, and all positions are unique. - `0 < speed[i] <= 10^6`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'A car is the head of its own fleet if and only if its arrival time exceeds the arrival time of every car ahead of it. A car that is ahead, even if not adjacent, bounds the time of the cars behind it.',
      algorithm: ['1. Compute `time[i] = (target - position[i]) / speed[i]`.','2. For each car `i`, check every car `j` with `position[j] > position[i]`. If any has `time[j] >= time[i]`, car `i` merges, so skip it.','3. Count the cars that do not merge.'],
      code: "class Solution {\n    public int carFleet(int target, int[] position, int[] speed) {\n        int n = position.length;\n        double[] time = new double[n];\n        for (int i = 0; i < n; i++) {\n            time[i] = (double) (target - position[i]) / speed[i];\n        }\n        int fleets = 0;\n        for (int i = 0; i < n; i++) {\n            boolean head = true;\n            for (int j = 0; j < n; j++) {\n                if (position[j] > position[i] && time[j] >= time[i]) {\n                    head = false;\n                    break;\n                }\n            }\n            if (head) fleets++;\n        }\n        return fleets;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: 'Sort cars by position descending, so each car is processed after the cars ahead of it. Keep a stack of arrival times of the current fleet heads. A new car is a new fleet if its time exceeds the top of the stack. Otherwise it merges into the top fleet.',
      algorithm: ['1. Sort the cars by position, descending.','2. For each car with time `t`: if the stack is empty or `t > stack.peek()`, push `t`.','3. Return the stack size.'],
      code: "import java.util.ArrayDeque;\nimport java.util.Arrays;\nimport java.util.Deque;\n\nclass Solution {\n    public int carFleet(int target, int[] position, int[] speed) {\n        int n = position.length;\n        int[][] cars = new int[n][2];\n        for (int i = 0; i < n; i++) {\n            cars[i][0] = position[i];\n            cars[i][1] = speed[i];\n        }\n        Arrays.sort(cars, (a, b) -> b[0] - a[0]);\n        Deque<Double> stack = new ArrayDeque<>();\n        for (int[] car : cars) {\n            double t = (double) (target - car[0]) / car[1];\n            if (stack.isEmpty() || t > stack.peek()) {\n                stack.push(t);\n            }\n        }\n        return stack.size();\n    }\n}",
      complexity: { time: 'O(n \\log n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'The stack is only ever read at its top, which is the arrival time of the most recent fleet head. A single variable holding that value is enough. Whenever a car arrives later than it, a new fleet starts and the variable updates.',
      algorithm: ['1. Sort by position, descending.','2. `lastTime = -1`, `fleets = 0`.','3. For each car with time `t`: if `t > lastTime`, `fleets++` and `lastTime = t`.','4. Return `fleets`.'],
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int carFleet(int target, int[] position, int[] speed) {\n        int n = position.length;\n        int[][] cars = new int[n][2];\n        for (int i = 0; i < n; i++) {\n            cars[i][0] = position[i];\n            cars[i][1] = speed[i];\n        }\n        Arrays.sort(cars, (a, b) -> b[0] - a[0]);\n        double lastTime = -1;\n        int fleets = 0;\n        for (int[] car : cars) {\n            double t = (double) (target - car[0]) / car[1];\n            if (t > lastTime) {\n                fleets++;\n                lastTime = t;\n            }\n        }\n        return fleets;\n    }\n}",
      complexity: { time: 'O(n \\log n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'largest-rectangle-in-histogram',
    title: 'Largest Rectangle in Histogram',
    difficulty: 'Hard',
    description: 'Given an array of integers `heights` representing the histogram\'s bar heights, where each bar has width `1`, return the area of the largest rectangle in the histogram.',
    examples: [
    {
      input: 'heights = [2,4]',
      output: '4',
      explanation: ''
    }
  ],
    constraints: '`1 <= heights.length <= 10^5` - `0 <= heights[i] <= 10^4`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'For each bar, expand left and right while neighbours are at least as tall, and record the area.',
      algorithm: ['1. For each `i`, set `l = i`, `r = i`.','2. While `l > 0` and `heights[l-1] >= heights[i]`, decrement `l`.','3. While `r < n-1` and `heights[r+1] >= heights[i]`, increment `r`.','4. Area is `heights[i] * (r - l + 1)`. Track the maximum.'],
      code: "class Solution {\n    public int largestRectangleArea(int[] heights) {\n        int n = heights.length, best = 0;\n        for (int i = 0; i < n; i++) {\n            int l = i, r = i;\n            while (l > 0 && heights[l - 1] >= heights[i]) l--;\n            while (r < n - 1 && heights[r + 1] >= heights[i]) r++;\n            best = Math.max(best, heights[i] * (r - l + 1));\n        }\n        return best;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(1)' }
    },
    {
      label: 'Better',
      intuition: 'Compute `left[i]`, the index of the nearest bar to the left that is strictly shorter, and `right[i]`, the nearest to the right. Two stack passes do this. Then each bar\'s area is a constant-time calculation.',
      algorithm: ['1. Left pass: maintain an increasing stack. For each `i`, pop while `heights[top] >= heights[i]`. `left[i]` is the new top, or `-1`. Push `i`.','2. Right pass: symmetric, from right to left. `right[i]` is the new top, or `n` if empty.','3. Area for bar `i` is `heights[i] * (right[i] - left[i] - 1)`.'],
      code: "import java.util.ArrayDeque;\nimport java.util.Deque;\n\nclass Solution {\n    public int largestRectangleArea(int[] heights) {\n        int n = heights.length;\n        int[] left = new int[n], right = new int[n];\n        Deque<Integer> st = new ArrayDeque<>();\n        for (int i = 0; i < n; i++) {\n            while (!st.isEmpty() && heights[st.peek()] >= heights[i]) st.pop();\n            left[i] = st.isEmpty() ? -1 : st.peek();\n            st.push(i);\n        }\n        st.clear();\n        for (int i = n - 1; i >= 0; i--) {\n            while (!st.isEmpty() && heights[st.peek()] >= heights[i]) st.pop();\n            right[i] = st.isEmpty() ? n : st.peek();\n            st.push(i);\n        }\n        int best = 0;\n        for (int i = 0; i < n; i++) {\n            best = Math.max(best, heights[i] * (right[i] - left[i] - 1));\n        }\n        return best;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'The right boundary of a bar is found exactly when a shorter bar arrives, and that is when the bar is popped. So the area can be computed at pop time, using the index now on top of the stack as the left boundary. A sentinel height `0` at the end flushes the stack.',
      algorithm: ['1. For `i` from `0` to `n` inclusive, let `cur = (i == n) ? 0 : heights[i]`.','2. While the stack is not empty and `heights[top] >= cur`:','- Pop `top`, and let `h = heights[top]`.','- Left boundary: the new top, or `-1` if empty.','- Area is `h * (i - left - 1)`.','3. Push `i`.'],
      code: "import java.util.ArrayDeque;\nimport java.util.Deque;\n\nclass Solution {\n    public int largestRectangleArea(int[] heights) {\n        int n = heights.length, best = 0;\n        Deque<Integer> st = new ArrayDeque<>();\n        for (int i = 0; i <= n; i++) {\n            int cur = (i == n) ? 0 : heights[i];\n            while (!st.isEmpty() && heights[st.peek()] >= cur) {\n                int h = heights[st.pop()];\n                int left = st.isEmpty() ? -1 : st.peek();\n                best = Math.max(best, h * (i - left - 1));\n            }\n            st.push(i);\n        }\n        return best;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    description: 'Given an array of integers `nums` sorted in ascending order and an integer `target`, write a function to search for `target` in `nums`. If `target` exists, return its index. Otherwise, return `-1`. You must write an algorithm with $O(\\log n)$ runtime complexity.',
    examples: [
    {
      input: 'nums = [-1,0,3,5,9,12]',
      output: '-1',
      explanation: '2'
    }
  ],
    constraints: '`1 <= nums.length <= 10^4` - `-10^4 < nums[i], target < 10^4` - All integers in `nums` are unique and sorted in ascending order.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Check each element until a match is found. This ignores the sorted order.',
      algorithm: ['1. For each index `i`, return `i` if `nums[i] == target`.','2. Otherwise return `-1`.'],
      code: "class Solution {\n    public int search(int[] nums, int target) {\n        for (int i = 0; i < nums.length; i++) {\n            if (nums[i] == target) return i;\n        }\n        return -1;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    },
    {
      label: 'Better',
      intuition: 'Express the halving directly. Compare with the middle element and recurse into the half that can contain `target`.',
      algorithm: ['1. `search(lo, hi)`: if `lo > hi`, return `-1`.','2. `mid = lo + (hi - lo) / 2`.','3. If `nums[mid] == target`, return `mid`. If `nums[mid] < target`, recurse on `[mid+1, hi]`. Otherwise recurse on `[lo, mid-1]`.'],
      code: "class Solution {\n    public int search(int[] nums, int target) {\n        return search(nums, target, 0, nums.length - 1);\n    }\n\n    private int search(int[] nums, int target, int lo, int hi) {\n        if (lo > hi) return -1;\n        int mid = lo + (hi - lo) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[mid] < target) return search(nums, target, mid + 1, hi);\n        return search(nums, target, lo, mid - 1);\n    }\n}",
      complexity: { time: 'O(\\log n)', space: 'O(\\log n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'The same halving, written as a loop. This avoids recursion overhead. `lo + (hi - lo) / 2` avoids integer overflow that `(lo + hi) / 2` can cause on large indices.',
      algorithm: ['1. `lo = 0`, `hi = n - 1`.','2. While `lo <= hi`: compute `mid`. Return `mid` on a match. Move `lo` or `hi` past `mid`.','3. Return `-1`.'],
      code: "class Solution {\n    public int search(int[] nums, int target) {\n        int lo = 0, hi = nums.length - 1;\n        while (lo <= hi) {\n            int mid = lo + (hi - lo) / 2;\n            if (nums[mid] == target) {\n                return mid;\n            } else if (nums[mid] < target) {\n                lo = mid + 1;\n            } else {\n                hi = mid - 1;\n            }\n        }\n        return -1;\n    }\n}",
      complexity: { time: 'O(\\log n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'search-a-2d-matrix',
    title: 'Search a 2D Matrix',
    difficulty: 'Medium',
    description: 'You are given an `m x n` integer matrix `matrix` with the following properties: - Each row is sorted in non-decreasing order. - The first integer of each row is greater than the last integer of the previous row. Given an integer `target`, return `true` if `target` is in `matrix`, and `false` otherwise. You must write a solution in $O(\\log(m \\cdot n))$ time.',
    examples: [
    {
      input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]]',
      output: 'false',
      explanation: '13'
    }
  ],
    constraints: '`1 <= m, n <= 100` - `-10^4 <= matrix[i][j], target <= 10^4`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Check each cell.',
      algorithm: ['1. For each row and column, return `true` on a match.','2. Otherwise return `false`.'],
      code: "class Solution {\n    public boolean searchMatrix(int[][] matrix, int target) {\n        for (int[] row : matrix) {\n            for (int v : row) {\n                if (v == target) return true;\n            }\n        }\n        return false;\n    }\n}",
      complexity: { time: 'O(m \\cdot n)', space: 'O(1)' }
    },
    {
      label: 'Better',
      intuition: 'First find the one row that could contain `target`, by binary searching on the first and last element of each row. Then binary search within that row.',
      algorithm: ['1. Binary search over rows to find the last row whose first element is `<= target`.','2. Binary search within that row for `target`.'],
      code: "class Solution {\n    public boolean searchMatrix(int[][] matrix, int target) {\n        int m = matrix.length, n = matrix[0].length;\n        int top = 0, bottom = m - 1;\n        while (top <= bottom) {\n            int mid = top + (bottom - top) / 2;\n            if (matrix[mid][0] <= target && target <= matrix[mid][n - 1]) {\n                int lo = 0, hi = n - 1;\n                while (lo <= hi) {\n                    int c = lo + (hi - lo) / 2;\n                    if (matrix[mid][c] == target) return true;\n                    if (matrix[mid][c] < target) lo = c + 1;\n                    else hi = c - 1;\n                }\n                return false;\n            } else if (target < matrix[mid][0]) {\n                bottom = mid - 1;\n            } else {\n                top = mid + 1;\n            }\n        }\n        return false;\n    }\n}",
      complexity: { time: 'O(\\log m + \\log n)', space: 'O(1)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Treat the matrix as a sorted array of length `m*n`. A flattened index `k` maps to `matrix[k / n][k % n]`. One binary search covers both dimensions.',
      algorithm: ['1. `lo = 0`, `hi = m*n - 1`.','2. `mid = lo + (hi - lo) / 2`, and `val = matrix[mid / n][mid % n]`.','3. Compare `val` with `target` and halve the range as usual.'],
      code: "class Solution {\n    public boolean searchMatrix(int[][] matrix, int target) {\n        int m = matrix.length, n = matrix[0].length;\n        int lo = 0, hi = m * n - 1;\n        while (lo <= hi) {\n            int mid = lo + (hi - lo) / 2;\n            int val = matrix[mid / n][mid % n];\n            if (val == target) return true;\n            if (val < target) lo = mid + 1;\n            else hi = mid - 1;\n        }\n        return false;\n    }\n}",
      complexity: { time: 'O(\\log(m \\cdot n))', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'koko-eating-bananas',
    title: 'Koko Eating Bananas',
    difficulty: 'Medium',
    description: 'Koko has `n` piles of bananas. The `i`-th pile has `piles[i]` bananas. The guards will return in `h` hours. Koko eats at a constant speed `k` bananas per hour. Each hour she chooses a pile, eats `k` bananas from it. If the pile has fewer than `k` bananas, she eats them all and does not eat more that hour. Return the minimum integer speed `k` such that Koko can eat all the bananas within `h` hours.',
    examples: [
    {
      input: 'piles = [30,11,23,4,20]',
      output: '30',
      explanation: ''
    }
  ],
    constraints: '`1 <= piles.length <= 10^4` - `piles.length <= h <= 10^9` - `1 <= piles[i] <= 10^9`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Try each speed from `1` upward, and return the first one that is feasible.',
      algorithm: ['1. For `k` from `1` to `max(piles)`:','- Compute `hours = sum(ceil(piles[i] / k))`.','- If `hours <= h`, return `k`.'],
      code: "class Solution {\n    public int minEatingSpeed(int[] piles, int h) {\n        int maxPile = 0;\n        for (int p : piles) maxPile = Math.max(maxPile, p);\n        for (int k = 1; k <= maxPile; k++) {\n            long hours = 0;\n            for (int p : piles) {\n                hours += (p + k - 1) / k;\n            }\n            if (hours <= h) return k;\n        }\n        return maxPile;\n    }\n}",
      complexity: { time: 'O(n \\cdot \\max(\\text{piles}))', space: 'O(1)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Feasibility is monotone in `k`, so binary search for the smallest feasible value. Each probe costs $O(n)$. Since the range is at most $10^9$, that is about 30 probes. `hours` is accumulated in a `long` because the sum can exceed the `int` range.',
      algorithm: ['1. `lo = 1`, `hi = max(piles)`.','2. While `lo < hi`: `mid = lo + (hi - lo) / 2`. If `hoursFor(mid) <= h`, set `hi = mid`. Otherwise set `lo = mid + 1`.','3. Return `lo`.'],
      code: "class Solution {\n    public int minEatingSpeed(int[] piles, int h) {\n        int lo = 1, hi = 0;\n        for (int p : piles) hi = Math.max(hi, p);\n        while (lo < hi) {\n            int mid = lo + (hi - lo) / 2;\n            if (hoursFor(piles, mid) <= h) {\n                hi = mid;\n            } else {\n                lo = mid + 1;\n            }\n        }\n        return lo;\n    }\n\n    private long hoursFor(int[] piles, int k) {\n        long hours = 0;\n        for (int p : piles) {\n            hours += (p + k - 1) / k;\n        }\n        return hours;\n    }\n}",
      complexity: { time: 'O(n \\log(\\max(\\text{piles})))', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'find-minimum-in-rotated-sorted-array',
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: 'Medium',
    description: 'Suppose an array of length `n` sorted in ascending order is rotated between `1` and `n` times. Given the sorted rotated array `nums` of **unique** elements, return the minimum element. You must write an algorithm that runs in $O(\\log n)$ time.',
    examples: [
    {
      input: 'nums = [4,5,6,7,0,1,2]',
      output: '0',
      explanation: ''
    }
  ],
    constraints: '`1 <= n <= 5000` - `-5000 <= nums[i] <= 5000` - All integers are unique. - `nums` is sorted and rotated between `1` and `n` times.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'The minimum is the smallest value. Scan for it.',
      algorithm: ['1. Track the smallest value seen.','2. Return it.'],
      code: "class Solution {\n    public int findMin(int[] nums) {\n        int min = nums[0];\n        for (int v : nums) {\n            min = Math.min(min, v);\n        }\n        return min;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    },
    {
      label: 'Optimised',
      intuition: 'If `nums[lo] <= nums[hi]`, the current range is not rotated, so its first element is the minimum. Return immediately. Otherwise, binary search for the pivot.',
      algorithm: ['1. `lo = 0`, `hi = n - 1`.','2. While `lo < hi`:','- If `nums[lo] < nums[hi]`, return `nums[lo]`.','- `mid = lo + (hi - lo) / 2`. If `nums[mid] > nums[hi]`, `lo = mid + 1`. Otherwise `hi = mid`.','3. Return `nums[lo]`.'],
      code: "class Solution {\n    public int findMin(int[] nums) {\n        int lo = 0, hi = nums.length - 1;\n        while (lo < hi) {\n            if (nums[lo] < nums[hi]) {\n                return nums[lo];\n            }\n            int mid = lo + (hi - lo) / 2;\n            if (nums[mid] > nums[hi]) {\n                lo = mid + 1;\n            } else {\n                hi = mid;\n            }\n        }\n        return nums[lo];\n    }\n}",
      complexity: { time: 'O(\\log n)', space: 'O(1)' }
    },
    {
      label: 'Best',
      intuition: 'The standard form. It always keeps the candidate pivot inside `[lo, hi]` and never needs the early exit. Since the elements are unique, `nums[mid] > nums[hi]` means the minimum is strictly right of `mid`, and `nums[mid] <= nums[hi]` means `mid` could be the minimum, so `hi = mid` keeps it.',
      algorithm: ['1. `lo = 0`, `hi = n - 1`.','2. While `lo < hi`: `mid = lo + (hi - lo) / 2`. If `nums[mid] > nums[hi]`, `lo = mid + 1`; else `hi = mid`.','3. Return `nums[lo]`.'],
      code: "class Solution {\n    public int findMin(int[] nums) {\n        int lo = 0, hi = nums.length - 1;\n        while (lo < hi) {\n            int mid = lo + (hi - lo) / 2;\n            if (nums[mid] > nums[hi]) {\n                lo = mid + 1;\n            } else {\n                hi = mid;\n            }\n        }\n        return nums[lo];\n    }\n}",
      complexity: { time: 'O(\\log n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'search-in-rotated-sorted-array',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    description: 'An integer array `nums` sorted in ascending order (with distinct values) has been rotated at some pivot index `k`. Given the array after rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not. You must write an algorithm with $O(\\log n)$ runtime complexity.',
    examples: [
    {
      input: 'nums = [4,5,6,7,0,1,2]',
      output: '-1',
      explanation: '3'
    }
  ],
    constraints: '`1 <= nums.length <= 5000` - `-10^4 <= nums[i], target <= 10^4` - All values in `nums` are unique. - `nums` is sorted ascending and possibly rotated.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Ignore the rotation and scan.',
      algorithm: ['1. Return the index where `nums[i] == target`.','2. Return `-1` if none.'],
      code: "class Solution {\n    public int search(int[] nums, int target) {\n        for (int i = 0; i < nums.length; i++) {\n            if (nums[i] == target) return i;\n        }\n        return -1;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    },
    {
      label: 'Better',
      intuition: 'Two stages. First find the index of the minimum, which is the rotation pivot. The array is then two sorted runs, `[0, p-1]` and `[p, n-1]`. The target\'s range decides which run to binary search.',
      algorithm: ['1. Find pivot `p` = index of the minimum (binary search from Problem 5.4).','2. Determine the search range: if `target >= nums[0]`, the range is `[0, p-1]`. Otherwise, it is `[p, n-1]`. If `p == 0`, use the whole array.','3. Standard binary search in that range.'],
      code: "class Solution {\n    public int search(int[] nums, int target) {\n        int n = nums.length;\n        int lo = 0, hi = n - 1;\n        while (lo < hi) {\n            int mid = lo + (hi - lo) / 2;\n            if (nums[mid] > nums[hi]) lo = mid + 1;\n            else hi = mid;\n        }\n        int p = lo;\n\n        if (p != 0) {\n            if (target >= nums[0]) {\n                lo = 0;\n                hi = p - 1;\n            } else {\n                lo = p;\n                hi = n - 1;\n            }\n        } else {\n            lo = 0;\n            hi = n - 1;\n        }\n\n        while (lo <= hi) {\n            int mid = lo + (hi - lo) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) lo = mid + 1;\n            else hi = mid - 1;\n        }\n        return -1;\n    }\n}",
      complexity: { time: 'O(\\log n)', space: 'O(1)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'One pass suffices. At each `mid`, determine which side is sorted, using `nums[lo] <= nums[mid]`. If the left side is sorted and `target` lies in `[nums[lo], nums[mid])`, keep the left. Otherwise keep the right. If the right side is sorted, apply the mirror test with `(nums[mid], nums[hi]]`.',
      algorithm: ['1. `lo = 0`, `hi = n - 1`. While `lo <= hi`:','- If `nums[mid] == target`, return `mid`.','- If `nums[lo] <= nums[mid]` (left sorted):','- If `nums[lo] <= target < nums[mid]`, `hi = mid - 1`. Else `lo = mid + 1`.','- Else (right sorted):','- If `nums[mid] < target <= nums[hi]`, `lo = mid + 1`. Else `hi = mid - 1`.','2. Return `-1`.'],
      code: "class Solution {\n    public int search(int[] nums, int target) {\n        int lo = 0, hi = nums.length - 1;\n        while (lo <= hi) {\n            int mid = lo + (hi - lo) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[lo] <= nums[mid]) {\n                if (nums[lo] <= target && target < nums[mid]) {\n                    hi = mid - 1;\n                } else {\n                    lo = mid + 1;\n                }\n            } else {\n                if (nums[mid] < target && target <= nums[hi]) {\n                    lo = mid + 1;\n                } else {\n                    hi = mid - 1;\n                }\n            }\n        }\n        return -1;\n    }\n}",
      complexity: { time: 'O(\\log n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'time-based-key-value-store',
    title: 'Time Based Key-Value Store',
    difficulty: 'Medium',
    description: 'Design a time-based key-value data structure that can store multiple values for the same key at different timestamps, and retrieve the key\'s value at a certain timestamp. Implement the `TimeMap` class: - `TimeMap()` initialises the object. - `void set(String key, String value, int timestamp)` stores `key` with `value` at `timestamp`. Timestamps for a given key are strictly increasing. - `String get(String key, int timestamp)` returns the value of the **most recent** timestamp `prev <= timestamp`. If there is none, return `""`.',
    examples: [
    {
      input: 'set("love","high",10)',
      output: '""',
      explanation: ''
    }
  ],
    constraints: '`1 <= key.length, value.length <= 100` - `1 <= timestamp <= 10^7` - Timestamps in `set` are strictly increasing for each key. - At most `2 * 10^5` calls in total.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Store each key\'s history in a list. For `get`, walk from the newest entry backward until one has a timestamp at most the query.',
      algorithm: ['1. `set` appends `(timestamp, value)` to the key\'s list.','2. `get` iterates from the last entry to the first, returning the first with `ts <= timestamp`. Otherwise return `""`.'],
      code: "import java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.List;\nimport java.util.Map;\n\nclass TimeMap {\n    private record Pair(int ts, String val) {}\n    private final Map<String, List<Pair>> store = new HashMap<>();\n\n    public void set(String key, String value, int timestamp) {\n        store.computeIfAbsent(key, k -> new ArrayList<>()).add(new Pair(timestamp, value));\n    }\n\n    public String get(String key, int timestamp) {\n        List<Pair> list = store.get(key);\n        if (list == null) return \"\";\n        for (int i = list.size() - 1; i >= 0; i--) {\n            if (list.get(i).ts() <= timestamp) {\n                return list.get(i).val();\n            }\n        }\n        return \"\";\n    }\n}",
      complexity: { time: '`set` is O(1) amortised; `get` is O(k), where k is the number of entries for that key', space: 'O(N)' }
    },
    {
      label: 'Better',
      intuition: 'A `TreeMap` keeps timestamps sorted, and `floorEntry(ts)` returns the greatest key `<= ts` directly. This is the natural ordered-map solution.',
      algorithm: ['1. `set` puts `timestamp -> value` into the key\'s `TreeMap`.','2. `get` calls `floorEntry(timestamp)` and returns its value, or `""` if null.'],
      code: "import java.util.HashMap;\nimport java.util.Map;\nimport java.util.TreeMap;\n\nclass TimeMap {\n    private final Map<String, TreeMap<Integer, String>> store = new HashMap<>();\n\n    public void set(String key, String value, int timestamp) {\n        store.computeIfAbsent(key, k -> new TreeMap<>()).put(timestamp, value);\n    }\n\n    public String get(String key, int timestamp) {\n        TreeMap<Integer, String> tm = store.get(key);\n        if (tm == null) return \"\";\n        Map.Entry<Integer, String> e = tm.floorEntry(timestamp);\n        return e == null ? \"\" : e.getValue();\n    }\n}",
      complexity: { time: 'O(\\log N)', space: 'O(N)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Timestamps are appended in increasing order, so each key\'s timestamp list is already sorted, and a plain `ArrayList` suffices. Use binary search for the last index with `ts <= timestamp`. This avoids the tree-node overhead of `TreeMap` and is cache-friendlier.',
      algorithm: ['1. Each key maps to two parallel lists: `times` and `values`.','2. `set` appends to both.','3. `get`: binary search for the largest index `m` with `times[m] <= timestamp`. Track the best candidate found so far. Return `values[m]` or `""`.'],
      code: "import java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.List;\nimport java.util.Map;\n\nclass TimeMap {\n    private final Map<String, List<Integer>> times = new HashMap<>();\n    private final Map<String, List<String>> values = new HashMap<>();\n\n    public void set(String key, String value, int timestamp) {\n        times.computeIfAbsent(key, k -> new ArrayList<>()).add(timestamp);\n        values.computeIfAbsent(key, k -> new ArrayList<>()).add(value);\n    }\n\n    public String get(String key, int timestamp) {\n        List<Integer> ts = times.get(key);\n        if (ts == null) return \"\";\n        List<String> vs = values.get(key);\n        int lo = 0, hi = ts.size() - 1;\n        String ans = \"\";\n        while (lo <= hi) {\n            int mid = lo + (hi - lo) / 2;\n            if (ts.get(mid) <= timestamp) {\n                ans = vs.get(mid);\n                lo = mid + 1;\n            } else {\n                hi = mid - 1;\n            }\n        }\n        return ans;\n    }\n}",
      complexity: { time: 'O(\\log N)', space: 'O(N)' }
    }
  ]
  },
  {
    slug: 'median-of-two-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    description: 'Given two sorted arrays `nums1` and `nums2` of sizes `m` and `n`, return the median of the two combined sorted arrays. The overall run time complexity should be $O(\\log(m+n))$.',
    examples: [
    {
      input: 'nums1 = [1,2]',
      output: '2.5',
      explanation: ''
    }
  ],
    constraints: '`0 <= m, n <= 1000` - `1 <= m + n <= 2000` - `-10^6 <= nums1[i], nums2[i] <= 10^6`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Merge the two sorted arrays fully, then read off the middle.',
      algorithm: ['1. Merge `nums1` and `nums2` into `merged` (standard two-pointer merge).','2. If the length is odd, return the middle element. Otherwise return the average of the two middle elements.'],
      code: "class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        int m = nums1.length, n = nums2.length;\n        int[] merged = new int[m + n];\n        int i = 0, j = 0, k = 0;\n        while (i < m && j < n) {\n            merged[k++] = nums1[i] <= nums2[j] ? nums1[i++] : nums2[j++];\n        }\n        while (i < m) merged[k++] = nums1[i++];\n        while (j < n) merged[k++] = nums2[j++];\n        int total = m + n;\n        if (total % 2 == 1) {\n            return merged[total / 2];\n        }\n        return (merged[total / 2 - 1] + merged[total / 2]) / 2.0;\n    }\n}",
      complexity: { time: 'O(m + n)', space: 'O(m + n)' }
    },
    {
      label: 'Better',
      intuition: 'The median only needs the elements at positions `total/2` and `total/2 - 1`. Walk the merge process just far enough to reach those positions, keeping the previous and current values. No merged array is stored.',
      algorithm: ['1. Walk `k` from `0` to `total/2`, each step taking the smaller head of the two arrays.','2. Keep `prev` (the element before the current one) and `curr`.','3. If `total` is odd, return `curr`. Otherwise return `(prev + curr) / 2.0`.'],
      code: "class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        int m = nums1.length, n = nums2.length, total = m + n;\n        int i = 0, j = 0, prev = 0, curr = 0;\n        for (int k = 0; k <= total / 2; k++) {\n            prev = curr;\n            if (i < m && (j >= n || nums1[i] <= nums2[j])) {\n                curr = nums1[i++];\n            } else {\n                curr = nums2[j++];\n            }\n        }\n        if (total % 2 == 1) return curr;\n        return (prev + curr) / 2.0;\n    }\n}",
      complexity: { time: 'O(m + n)', space: 'O(1)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Partition `A` (the smaller array) at index `i` and `B` at index `j = half - i`, where `half` is the size of the left half. The partition is valid when every left element is at most every right element, which means `A[i-1] <= B[j]` and `B[j-1] <= A[i]`. Binary search on `i` in `A`. If `A[i-1] > B[j]`, the cut in `A` is too far right. If `B[j-1] > A[i]`, it is too far left. Sentinels `±infinity` handle empty sides.',
      algorithm: ['1. Ensure `m <= n` by swapping if needed.','2. `half = (m + n + 1) / 2`. Binary search `i` in `[0, m]`:','- `j = half - i`.','- `aLeft = i == 0 ? -inf : A[i-1]`, `aRight = i == m ? +inf : A[i]`.','- `bLeft = j == 0 ? -inf : B[j-1]`, `bRight = j == n ? +inf : B[j]`.','- If `aLeft <= bRight` and `bLeft <= aRight`: this is the partition. Return the median from the boundary values.','- If `aLeft > bRight`, `hi = i - 1`. Otherwise `lo = i + 1`.','3. For odd total, return `max(aLeft, bLeft)`. For even total, return `(max(aLeft, bLeft) + min(aRight, bRight)) / 2.0`.'],
      code: "class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        int[] A = nums1, B = nums2;\n        if (A.length > B.length) {\n            int[] tmp = A; A = B; B = tmp;\n        }\n        int m = A.length, n = B.length;\n        int half = (m + n + 1) / 2;\n        int lo = 0, hi = m;\n        while (lo <= hi) {\n            int i = lo + (hi - lo) / 2;\n            int j = half - i;\n            double aLeft = i == 0 ? Double.NEGATIVE_INFINITY : A[i - 1];\n            double aRight = i == m ? Double.POSITIVE_INFINITY : A[i];\n            double bLeft = j == 0 ? Double.NEGATIVE_INFINITY : B[j - 1];\n            double bRight = j == n ? Double.POSITIVE_INFINITY : B[j];\n\n            if (aLeft <= bRight && bLeft <= aRight) {\n                if ((m + n) % 2 == 1) {\n                    return Math.max(aLeft, bLeft);\n                }\n                return (Math.max(aLeft, bLeft) + Math.min(aRight, bRight)) / 2.0;\n            } else if (aLeft > bRight) {\n                hi = i - 1;\n            } else {\n                lo = i + 1;\n            }\n        }\n        return 0.0;\n    }\n}",
      complexity: { time: 'O(\\log \\min(m, n))', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    description: 'Given the head of a singly linked list, reverse the list and return the new head.',
    examples: [
    {
      input: 'head = [1,2]',
      output: '[2,1]',
      explanation: ''
    }
  ],
    constraints: 'The number of nodes is in the range `[0, 5000]`. - `-5000 <= Node.val <= 5000`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Read all values into an array, then write them back in reverse order into the existing nodes.',
      algorithm: ['1. Collect values into an array.','2. Walk the list again, assigning values from the end of the array.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public ListNode reverseList(ListNode head) {\n        List<Integer> vals = new ArrayList<>();\n        for (ListNode c = head; c != null; c = c.next) {\n            vals.add(c.val);\n        }\n        int i = vals.size() - 1;\n        for (ListNode c = head; c != null; c = c.next) {\n            c.val = vals.get(i--);\n        }\n        return head;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: 'Reverse the rest of the list recursively. Then make the next node point back to the current node, and cut the current node\'s forward pointer.',
      algorithm: ['1. If `head` or `head.next` is `null`, return `head`.','2. `newHead = reverseList(head.next)`.','3. `head.next.next = head`, then `head.next = null`.','4. Return `newHead`.'],
      code: "class Solution {\n    public ListNode reverseList(ListNode head) {\n        if (head == null || head.next == null) {\n            return head;\n        }\n        ListNode newHead = reverseList(head.next);\n        head.next.next = head;\n        head.next = null;\n        return newHead;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Keep `prev` (already reversed part) and `cur` (next node to process). Each step saves `cur.next`, points `cur` backward at `prev`, and advances both pointers. No recursion is used.',
      algorithm: ['1. `prev = null`, `cur = head`.','2. While `cur != null`:','- `next = cur.next`.','- `cur.next = prev`.','- `prev = cur`, `cur = next`.','3. Return `prev`.'],
      code: "class Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null, cur = head;\n        while (cur != null) {\n            ListNode next = cur.next;\n            cur.next = prev;\n            prev = cur;\n            cur = next;\n        }\n        return prev;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'merge-two-sorted-lists',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    description: 'You are given the heads of two sorted linked lists, `list1` and `list2`. Merge the two lists into one sorted list by splicing together the nodes of the first two lists. Return the head of the merged list.',
    examples: [
    {
      input: 'list1 = []',
      output: '[]',
      explanation: ''
    }
  ],
    constraints: 'The number of nodes in both lists is in the range `[0, 50]`. - `-100 <= Node.val <= 100` - Both lists are sorted in non-decreasing order.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Ignore the sortedness. Collect all values, sort them, and build a new list.',
      algorithm: ['1. Collect the values from both lists.','2. Sort them.','3. Build a new list from the sorted values.'],
      code: "import java.util.ArrayList;\nimport java.util.Collections;\nimport java.util.List;\n\nclass Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        List<Integer> vals = new ArrayList<>();\n        for (ListNode c = list1; c != null; c = c.next) vals.add(c.val);\n        for (ListNode c = list2; c != null; c = c.next) vals.add(c.val);\n        Collections.sort(vals);\n        ListNode dummy = new ListNode(), tail = dummy;\n        for (int v : vals) {\n            tail.next = new ListNode(v);\n            tail = tail.next;\n        }\n        return dummy.next;\n    }\n}",
      complexity: { time: 'O((m+n)\\log(m+n))', space: 'O(m+n)' }
    },
    {
      label: 'Better',
      intuition: 'The smaller head becomes the head of the result, and the rest is the merge of its successor with the other list.',
      algorithm: ['1. If one list is `null`, return the other.','2. If `list1.val <= list2.val`: `list1.next = merge(list1.next, list2)`, return `list1`.','3. Otherwise: `list2.next = merge(list1, list2.next)`, return `list2`.'],
      code: "class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        if (list1 == null) return list2;\n        if (list2 == null) return list1;\n        if (list1.val <= list2.val) {\n            list1.next = mergeTwoLists(list1.next, list2);\n            return list1;\n        }\n        list2.next = mergeTwoLists(list1, list2.next);\n        return list2;\n    }\n}",
      complexity: { time: 'O(m+n)', space: 'O(m+n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Use a dummy node as a fixed starting point so the first node needs no special case. Append whichever head is smaller to `tail`, then advance. Attach the leftover list at the end.',
      algorithm: ['1. `dummy`, `tail = dummy`.','2. While both lists are non-null, append the smaller head to `tail` and advance that list. Advance `tail`.','3. Attach the non-empty remainder: `tail.next = (list1 != null) ? list1 : list2`.','4. Return `dummy.next`.'],
      code: "class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        ListNode dummy = new ListNode(), tail = dummy;\n        while (list1 != null && list2 != null) {\n            if (list1.val <= list2.val) {\n                tail.next = list1;\n                list1 = list1.next;\n            } else {\n                tail.next = list2;\n                list2 = list2.next;\n            }\n            tail = tail.next;\n        }\n        tail.next = (list1 != null) ? list1 : list2;\n        return dummy.next;\n    }\n}",
      complexity: { time: 'O(m+n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'reorder-list',
    title: 'Reorder List',
    difficulty: 'Medium',
    description: 'You are given the head of a singly linked list `L0 -> L1 -> ... -> Ln-1 -> Ln`. Reorder it in place to `L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ...`. You may not modify the node values, only the `next` pointers.',
    examples: [
    {
      input: 'head = [1,2,3,4,5]',
      output: '[1,5,2,4,3]',
      explanation: ''
    }
  ],
    constraints: 'The number of nodes is in the range `[1, 5 * 10^4]`. - `1 <= Node.val <= 1000`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'With random access to nodes, index from both ends and rewire.',
      algorithm: ['1. Store every node in `nodes[]`.','2. With `i = 0` and `j = n-1`, set `nodes[i].next = nodes[j]`, then `nodes[j].next = nodes[i+1]`, moving the pointers inward until they meet.','3. Set the last node\'s `next` to `null`.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public void reorderList(ListNode head) {\n        List<ListNode> nodes = new ArrayList<>();\n        for (ListNode c = head; c != null; c = c.next) nodes.add(c);\n        int i = 0, j = nodes.size() - 1;\n        while (i < j) {\n            nodes.get(i).next = nodes.get(j);\n            i++;\n            if (i == j) break;\n            nodes.get(j).next = nodes.get(i);\n            j--;\n        }\n        nodes.get(i).next = null;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: 'Pop from a stack to get the second half in reverse order. Split the list at the middle, push the second half onto a stack, then alternately attach the front node and the popped node.',
      algorithm: ['1. Find the middle node. Cut the list there, so the first half ends at `mid`.','2. Push every node of the second half onto a stack. The top is the tail.','3. Walk the first half. Each step, pop from the stack and interleave.'],
      code: "import java.util.ArrayDeque;\nimport java.util.Deque;\n\nclass Solution {\n    public void reorderList(ListNode head) {\n        int n = 0;\n        for (ListNode c = head; c != null; c = c.next) n++;\n        int mid = (n + 1) / 2;\n\n        ListNode cur = head;\n        for (int i = 0; i < mid - 1; i++) cur = cur.next;\n        ListNode second = cur.next;\n        cur.next = null;\n\n        Deque<ListNode> stack = new ArrayDeque<>();\n        for (ListNode c = second; c != null; c = c.next) stack.push(c);\n\n        cur = head;\n        while (!stack.isEmpty()) {\n            ListNode next = cur.next;\n            ListNode top = stack.pop();\n            cur.next = top;\n            top.next = next;\n            cur = next;\n        }\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Three well-known steps, all in place. A slow/fast pointer finds the middle. Reversing the second half gives the nodes in tail-to-middle order. Then merge the two halves by alternating, which is exactly the required output order.',
      algorithm: ['1. Find the middle with `slow` and `fast`. `slow` ends at the last node of the first half.','2. `second = reverse(slow.next)`, and set `slow.next = null`.','3. Merge: alternately take a node from the first half and from `second`.'],
      code: "class Solution {\n    public void reorderList(ListNode head) {\n        ListNode slow = head, fast = head;\n        while (fast.next != null && fast.next.next != null) {\n            slow = slow.next;\n            fast = fast.next.next;\n        }\n        ListNode second = reverse(slow.next);\n        slow.next = null;\n\n        ListNode first = head;\n        while (second != null) {\n            ListNode t1 = first.next, t2 = second.next;\n            first.next = second;\n            second.next = t1;\n            first = t1;\n            second = t2;\n        }\n    }\n\n    private ListNode reverse(ListNode head) {\n        ListNode prev = null, cur = head;\n        while (cur != null) {\n            ListNode next = cur.next;\n            cur.next = prev;\n            prev = cur;\n            cur = next;\n        }\n        return prev;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'remove-nth-node-from-end-of-list',
    title: 'Remove Nth Node From End of List',
    difficulty: 'Medium',
    description: 'Given the head of a linked list, remove the `n`-th node from the end of the list and return its head.',
    examples: [
    {
      input: 'head = [1]',
      output: '[]',
      explanation: ''
    }
  ],
    constraints: 'The number of nodes is `sz`, with `1 <= sz <= 30`. - `0 <= Node.val <= 100` - `1 <= n <= sz`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'With the nodes stored in a list, the predecessor is at a known index, and unlinking it is direct.',
      algorithm: ['1. Put a dummy node in front of the head, and store all nodes including the dummy in a list.','2. The predecessor of the target is at index `size - n - 1`.','3. Relink `prev.next = prev.next.next`.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public ListNode removeNthFromEnd(ListNode head, int n) {\n        ListNode dummy = new ListNode(0, head);\n        List<ListNode> nodes = new ArrayList<>();\n        for (ListNode c = dummy; c != null; c = c.next) nodes.add(c);\n        ListNode prev = nodes.get(nodes.size() - n - 1);\n        prev.next = prev.next.next;\n        return dummy.next;\n    }\n}",
      complexity: { time: 'O(L)', space: 'O(L)' }
    },
    {
      label: 'Better',
      intuition: 'One pass counts the length `L`. The second pass walks to the predecessor at position `L - n` and removes the node after it.',
      algorithm: ['1. Count the length `L`.','2. Walk `L - n` steps from the dummy.','3. Remove the next node.'],
      code: "class Solution {\n    public ListNode removeNthFromEnd(ListNode head, int n) {\n        int L = 0;\n        for (ListNode c = head; c != null; c = c.next) L++;\n        ListNode dummy = new ListNode(0, head);\n        ListNode cur = dummy;\n        for (int i = 0; i < L - n; i++) cur = cur.next;\n        cur.next = cur.next.next;\n        return dummy.next;\n    }\n}",
      complexity: { time: 'O(L)', space: 'O(1)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Keep two pointers with a gap of `n` between them. Advance `fast` by `n+1` steps from the dummy first. Then advance both until `fast` is `null`. At that point `slow` is the predecessor of the target. The `+1` ensures `slow` stops one node before the target, not on it.',
      algorithm: ['1. `dummy`, `slow = fast = dummy`.','2. Move `fast` forward `n + 1` times.','3. While `fast != null`, move both `slow` and `fast`.','4. `slow.next = slow.next.next`.'],
      code: "class Solution {\n    public ListNode removeNthFromEnd(ListNode head, int n) {\n        ListNode dummy = new ListNode(0, head);\n        ListNode slow = dummy, fast = dummy;\n        for (int i = 0; i <= n; i++) {\n            fast = fast.next;\n        }\n        while (fast != null) {\n            slow = slow.next;\n            fast = fast.next;\n        }\n        slow.next = slow.next.next;\n        return dummy.next;\n    }\n}",
      complexity: { time: 'O(L)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'copy-list-with-random-pointer',
    title: 'Copy List with Random Pointer',
    difficulty: 'Medium',
    description: 'A linked list of length `n` is given where each node has an additional `random` pointer that may point to any node in the list, or `null`. Construct a **deep copy** of the list. The copy must consist of `n` new nodes with the same `val`, `next`, and `random` structure as the original. None of the new nodes may point to nodes in the original list. Node definition used: ```java class Node {     int val;     Node next;     Node random;     Node(int val) { this.val = val; } } ```',
    examples: [
    {
      input: 'head = [[1,1],[2,1]]',
      output: '[[1,1],[2,1]]',
      explanation: ''
    }
  ],
    constraints: '`0 <= n <= 1000` - `-10^4 <= Node.val <= 10^4` - `random` is `null` or points to a node in the list.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Build the copy chain with `next` only. For each node with a `random` pointer, find the target\'s index by walking from the head, then walk the copy to that index.',
      algorithm: ['1. Build a copy chain following `next`.','2. For each original node `o` with `random != null`, count how many steps from the head reach `o.random`.','3. Walk the copy chain the same number of steps and set `copy.random`.'],
      code: "class Solution {\n    public Node copyRandomList(Node head) {\n        if (head == null) return null;\n        Node dummy = new Node(0), tail = dummy;\n        for (Node c = head; c != null; c = c.next) {\n            tail.next = new Node(c.val);\n            tail = tail.next;\n        }\n        Node o = head, cp = dummy.next;\n        while (o != null) {\n            if (o.random != null) {\n                int idx = 0;\n                for (Node t = head; t != o.random; t = t.next) idx++;\n                Node r = dummy.next;\n                for (int i = 0; i < idx; i++) r = r.next;\n                cp.random = r;\n            }\n            o = o.next;\n            cp = cp.next;\n        }\n        return dummy.next;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(1)' }
    },
    {
      label: 'Better',
      intuition: 'Pass 1 creates a copy for every original node and records the mapping. Pass 2 sets each copy\'s `next` and `random` by looking up the mapped nodes. Each lookup is $O(1)$.',
      algorithm: ['1. For each original `c`, `map.put(c, new Node(c.val))`.','2. For each original `c`, `copy = map.get(c)`. Set `copy.next = map.get(c.next)` and `copy.random = map.get(c.random)`. `get(null)` returns `null`.'],
      code: "import java.util.HashMap;\nimport java.util.Map;\n\nclass Solution {\n    public Node copyRandomList(Node head) {\n        if (head == null) return null;\n        Map<Node, Node> map = new HashMap<>();\n        for (Node c = head; c != null; c = c.next) {\n            map.put(c, new Node(c.val));\n        }\n        for (Node c = head; c != null; c = c.next) {\n            Node copy = map.get(c);\n            copy.next = map.get(c.next);\n            copy.random = map.get(c.random);\n        }\n        return map.get(head);\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Insert each copy directly after its original, so `original.next` is its copy. Then `original.random.next` is the copy of `original.random`, with no map. Finally split the interleaved list into the two lists.',
      algorithm: ['1. For each original `c`, insert `copy` between `c` and `c.next`.','2. For each original `c` with `random != null`, set `c.next.random = c.random.next`.','3. Walk the interleaved list, detaching the copies and restoring the originals\' `next` pointers.'],
      code: "class Solution {\n    public Node copyRandomList(Node head) {\n        if (head == null) return null;\n\n        for (Node c = head; c != null; ) {\n            Node copy = new Node(c.val);\n            copy.next = c.next;\n            c.next = copy;\n            c = copy.next;\n        }\n\n        for (Node c = head; c != null; c = c.next.next) {\n            if (c.random != null) {\n                c.next.random = c.random.next;\n            }\n        }\n\n        Node dummy = new Node(0), tail = dummy;\n        Node c = head;\n        while (c != null) {\n            Node copy = c.next;\n            tail.next = copy;\n            tail = copy;\n            c.next = copy.next;\n            c = c.next;\n        }\n        return dummy.next;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'add-two-numbers',
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    description: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each node contains a single digit. Add the two numbers and return the sum as a linked list in the same reverse-order format.',
    examples: [
    {
      input: 'l1 = [9,9,9,9,9,9,9]',
      output: '[8,9,9,9,0,0,0,1]',
      explanation: '9999999 + 9999 = 10009998'
    }
  ],
    constraints: 'The number of nodes in each list is in the range `[1, 100]`. - `0 <= Node.val <= 9` - No leading zeros, except the number `0` itself.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Rebuild each number from its digits, add them with arbitrary-precision arithmetic, and split the result back into digits.',
      algorithm: ['1. For each list, collect digits in reverse, then build a `BigInteger`.','2. Add the two values.','3. Write the decimal string of the sum into a new list, starting from its least significant digit.'],
      code: "import java.math.BigInteger;\n\nclass Solution {\n    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n        BigInteger a = toNumber(l1), b = toNumber(l2);\n        String s = a.add(b).toString();\n        ListNode dummy = new ListNode(), tail = dummy;\n        for (int i = s.length() - 1; i >= 0; i--) {\n            tail.next = new ListNode(s.charAt(i) - '0');\n            tail = tail.next;\n        }\n        return dummy.next;\n    }\n\n    private BigInteger toNumber(ListNode head) {\n        StringBuilder sb = new StringBuilder();\n        for (ListNode c = head; c != null; c = c.next) {\n            sb.append(c.val);\n        }\n        return new BigInteger(sb.reverse().toString());\n    }\n}",
      complexity: { time: 'O(m+n)', space: 'O(m+n)' }
    },
    {
      label: 'Better',
      intuition: 'Add the current digits with the carry, create a node for the last digit, and recurse on the rest of both lists with the new carry. The base case is both lists exhausted with no carry left.',
      algorithm: ['1. `add(a, b, carry)`: if `a`, `b` are both `null` and `carry == 0`, return `null`.','2. `sum = carry + (a?.val) + (b?.val)`, treating missing nodes as `0`.','3. Return a node with `sum % 10`, whose `next` is `add(a.next, b.next, sum / 10)`.'],
      code: "class Solution {\n    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n        return add(l1, l2, 0);\n    }\n\n    private ListNode add(ListNode a, ListNode b, int carry) {\n        if (a == null && b == null && carry == 0) return null;\n        int sum = carry + (a != null ? a.val : 0) + (b != null ? b.val : 0);\n        ListNode node = new ListNode(sum % 10);\n        node.next = add(a != null ? a.next : null, b != null ? b.next : null, sum / 10);\n        return node;\n    }\n}",
      complexity: { time: 'O(\\max(m, n))', space: 'O(\\max(m, n))' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'The same digit-by-digit addition, written as a loop. A dummy head simplifies the first node, and the loop continues while either list has digits or a carry remains.',
      algorithm: ['1. `dummy`, `tail = dummy`, `carry = 0`.','2. While `l1 != null || l2 != null || carry != 0`:','- `sum = carry + (l1 val or 0) + (l2 val or 0)`.','- Append `sum % 10`, set `carry = sum / 10`.','- Advance `l1` and `l2` if non-null.','3. Return `dummy.next`.'],
      code: "class Solution {\n    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n        ListNode dummy = new ListNode(), tail = dummy;\n        int carry = 0;\n        while (l1 != null || l2 != null || carry != 0) {\n            int sum = carry;\n            if (l1 != null) { sum += l1.val; l1 = l1.next; }\n            if (l2 != null) { sum += l2.val; l2 = l2.next; }\n            tail.next = new ListNode(sum % 10);\n            tail = tail.next;\n            carry = sum / 10;\n        }\n        return dummy.next;\n    }\n}",
      complexity: { time: 'O(\\max(m, n))', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'linked-list-cycle',
    title: 'Linked List Cycle',
    difficulty: 'Easy',
    description: 'Given `head`, the head of a linked list, return `true` if there is a cycle in the list, and `false` otherwise. A cycle exists if some node can be reached again by continuously following `next` pointers. Internally, `pos` is the index of the node that the tail\'s `next` points to, or `-1` if there is no cycle. `pos` is not passed to your function.',
    examples: [
    {
      input: 'head = [1]',
      output: 'false',
      explanation: ''
    }
  ],
    constraints: 'The number of nodes is in the range `[0, 10^4]`. - `-10^5 <= Node.val <= 10^5` - `pos` is `-1` or a valid index.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Record each node as it is visited. If a node is seen again, a cycle exists.',
      algorithm: ['1. For each node, if it is already in the set, return `true`. Otherwise add it.','2. When the traversal reaches `null`, return `false`.'],
      code: "import java.util.HashSet;\nimport java.util.Set;\n\nclass Solution {\n    public boolean hasCycle(ListNode head) {\n        Set<ListNode> seen = new HashSet<>();\n        for (ListNode c = head; c != null; c = c.next) {\n            if (!seen.add(c)) return true;\n        }\n        return false;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Move `slow` one step and `fast` two steps each iteration. Outside a cycle, `fast` reaches `null`. Inside a cycle, `fast` gains one node on `slow` per iteration, so they must meet.',
      algorithm: ['1. `slow = fast = head`.','2. While `fast != null && fast.next != null`: move `slow` one step, `fast` two steps. If they are equal, return `true`.','3. Return `false`.'],
      code: "class Solution {\n    public boolean hasCycle(ListNode head) {\n        ListNode slow = head, fast = head;\n        while (fast != null && fast.next != null) {\n            slow = slow.next;\n            fast = fast.next.next;\n            if (slow == fast) return true;\n        }\n        return false;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'find-the-duplicate-number',
    title: 'Find the Duplicate Number',
    difficulty: 'Medium',
    description: 'Given an array `nums` containing `n + 1` integers where each integer is in the range `[1, n]` inclusive, there is exactly one repeated number. Return this repeated number. You must solve it **without modifying** the array and using only **constant extra space**.',
    examples: [
    {
      input: 'nums = [3,1,3,4,2]',
      output: '3',
      explanation: '3'
    }
  ],
    constraints: '`1 <= n <= 10^5` - `nums.length == n + 1` - `1 <= nums[i] <= n` - Exactly one integer appears more than once; others appear once.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Compare every pair.',
      algorithm: ['1. For each `i`, for each `j > i`, if `nums[i] == nums[j]`, return `nums[i]`.'],
      code: "class Solution {\n    public int findDuplicate(int[] nums) {\n        for (int i = 0; i < nums.length; i++) {\n            for (int j = i + 1; j < nums.length; j++) {\n                if (nums[i] == nums[j]) return nums[i];\n            }\n        }\n        return -1;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(1)' }
    },
    {
      label: 'Better',
      intuition: 'Record seen values. The first value seen twice is the duplicate.',
      algorithm: ['1. For each value, if `seen.add(value)` fails, return it.'],
      code: "import java.util.HashSet;\nimport java.util.Set;\n\nclass Solution {\n    public int findDuplicate(int[] nums) {\n        Set<Integer> seen = new HashSet<>();\n        for (int x : nums) {\n            if (!seen.add(x)) return x;\n        }\n        return -1;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Optimised',
      intuition: 'Binary search over the value range `[1, n]`. For a midpoint `mid`, count how many numbers are `<= mid`. If the range `[1, mid]` holds more than `mid` numbers, by pigeonhole the duplicate lies within `[1, mid]`. Otherwise it lies in `(mid, n]`. Constant extra space, no modification.',
      algorithm: ['1. `lo = 1`, `hi = n`.','2. While `lo < hi`: `mid = lo + (hi - lo) / 2`. Let `count = #{x : x <= mid}`.','3. If `count > mid`, `hi = mid`. Otherwise `lo = mid + 1`.','4. Return `lo`.'],
      code: "class Solution {\n    public int findDuplicate(int[] nums) {\n        int lo = 1, hi = nums.length - 1;\n        while (lo < hi) {\n            int mid = lo + (hi - lo) / 2;\n            int count = 0;\n            for (int x : nums) {\n                if (x <= mid) count++;\n            }\n            if (count > mid) {\n                hi = mid;\n            } else {\n                lo = mid + 1;\n            }\n        }\n        return lo;\n    }\n}",
      complexity: { time: 'O(n \\log n)', space: 'O(1)' }
    },
    {
      label: 'Best',
      intuition: 'Treat each index as a node, with `i -> nums[i]` as its next pointer. Values lie in `[1, n]` and there are `n+1` indices, so the walk starting at index `0` must enter a cycle. The duplicate is the entry point of that cycle, because two indices map to it. Floyd\'s algorithm finds the entry point in two phases: first detect the meeting point, then restart one pointer from the head and advance both one step at a time until they meet.',
      algorithm: ['1. Phase 1: `slow = fast = nums[0]`. Repeat `slow = nums[slow]`, `fast = nums[nums[fast]]` until they are equal.','2. Phase 2: `slow = nums[0]`. Repeat `slow = nums[slow]`, `fast = nums[fast]` until they are equal.','3. Return `slow`.'],
      code: "class Solution {\n    public int findDuplicate(int[] nums) {\n        int slow = nums[0], fast = nums[0];\n        do {\n            slow = nums[slow];\n            fast = nums[nums[fast]];\n        } while (slow != fast);\n\n        slow = nums[0];\n        while (slow != fast) {\n            slow = nums[slow];\n            fast = nums[fast];\n        }\n        return slow;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'lru-cache',
    title: 'LRU Cache',
    difficulty: 'Medium',
    description: 'Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**. Implement the `LRUCache` class: - `LRUCache(int capacity)` initialises the cache with a positive capacity. - `int get(int key)` returns the value of `key` if it exists, otherwise `-1`. A successful `get` makes the key most recently used. - `void put(int key, int value)` updates or inserts the value. If the cache exceeds `capacity`, evict the least recently used key. Both `get` and `put` must run in $O(1)$ average time.',
    examples: [
    {
      input: 'capacity `1`. `put(2,1)`, `get(2)`, `put(3,2)`, `get(2)`, `get(3)',
      output: '1, -1, 2',
      explanation: ''
    }
  ],
    constraints: '`1 <= capacity <= 3000` - `0 <= key <= 10^4` - `0 <= value <= 10^5` - At most `2 * 10^5` calls to `get` and `put`.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Keep the keys in a list ordered from least to most recent. Every `get` or `put` removes the key by linear search and appends it again.',
      algorithm: ['1. `values` maps keys to values. `order` lists keys, least recent first.','2. `get`: if the key is absent, return `-1`. Otherwise move the key to the end of `order`.','3. `put`: if the key exists, update it and move it to the end. Otherwise, if full, evict `order.get(0)` from both structures, then add.'],
      code: "import java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.List;\nimport java.util.Map;\n\nclass LRUCache {\n    private final int capacity;\n    private final Map<Integer, Integer> values = new HashMap<>();\n    private final List<Integer> order = new ArrayList<>();\n\n    public LRUCache(int capacity) {\n        this.capacity = capacity;\n    }\n\n    public int get(int key) {\n        if (!values.containsKey(key)) return -1;\n        touch(key);\n        return values.get(key);\n    }\n\n    public void put(int key, int value) {\n        if (values.containsKey(key)) {\n            values.put(key, value);\n            touch(key);\n            return;\n        }\n        if (values.size() == capacity) {\n            int evict = order.remove(0);\n            values.remove(evict);\n        }\n        values.put(key, value);\n        order.add(key);\n    }\n\n    private void touch(int key) {\n        order.remove(Integer.valueOf(key));\n        order.add(key);\n    }\n}",
      complexity: { time: 'O(capacity)', space: 'O(capacity)' }
    },
    {
      label: 'Better',
      intuition: 'Java\'s `LinkedHashMap` maintains insertion or access order internally. With `accessOrder = true`, every `get` moves the entry to the end. Overriding `removeEldestEntry` evicts the least recently used entry automatically.',
      algorithm: ['1. Extend `LinkedHashMap<Integer, Integer>` with access ordering enabled.','2. `get` returns the value or `-1`.','3. `put` inserts or updates, and `removeEldestEntry` returns `true` when `size() > capacity`.'],
      code: "import java.util.LinkedHashMap;\nimport java.util.Map;\n\nclass LRUCache extends LinkedHashMap<Integer, Integer> {\n    private final int capacity;\n\n    public LRUCache(int capacity) {\n        super(capacity, 0.75f, true);\n        this.capacity = capacity;\n    }\n\n    public int get(int key) {\n        return super.getOrDefault(key, -1);\n    }\n\n    public void put(int key, int value) {\n        super.put(key, value);\n    }\n\n    @Override\n    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {\n        return size() > capacity;\n    }\n}",
      complexity: { time: 'O(1)', space: 'O(capacity)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Implement what `LinkedHashMap` does explicitly. The map stores key to node. The list runs from `head` (least recent, after the sentinel) to `tail` (most recent, before the sentinel). Two sentinel nodes remove all edge cases at the ends. Moving a node is four pointer updates.',
      algorithm: ['1. `remove(node)`: unlink from its neighbours.','2. `addToTail(node)`: insert before the tail sentinel.','3. `get(key)`: if present, `remove` then `addToTail`, and return the value.','4. `put(key, value)`: if present, update the value, then move to tail. Otherwise, if full, remove `head.next` (evict) and its map entry. Then create, insert, and map the new node.'],
      code: "import java.util.HashMap;\nimport java.util.Map;\n\nclass LRUCache {\n    private static class Node {\n        int key, val;\n        Node prev, next;\n        Node(int key, int val) { this.key = key; this.val = val; }\n    }\n\n    private final int capacity;\n    private final Map<Integer, Node> map = new HashMap<>();\n    private final Node head = new Node(0, 0), tail = new Node(0, 0);\n\n    public LRUCache(int capacity) {\n        this.capacity = capacity;\n        head.next = tail;\n        tail.prev = head;\n    }\n\n    public int get(int key) {\n        Node node = map.get(key);\n        if (node == null) return -1;\n        remove(node);\n        addToTail(node);\n        return node.val;\n    }\n\n    public void put(int key, int value) {\n        Node node = map.get(key);\n        if (node != null) {\n            node.val = value;\n            remove(node);\n            addToTail(node);\n            return;\n        }\n        if (map.size() == capacity) {\n            Node lru = head.next;\n            remove(lru);\n            map.remove(lru.key);\n        }\n        Node fresh = new Node(key, value);\n        map.put(key, fresh);\n        addToTail(fresh);\n    }\n\n    private void remove(Node node) {\n        node.prev.next = node.next;\n        node.next.prev = node.prev;\n    }\n\n    private void addToTail(Node node) {\n        node.prev = tail.prev;\n        node.next = tail;\n        tail.prev.next = node;\n        tail.prev = node;\n    }\n}",
      complexity: { time: 'O(1)', space: 'O(capacity)' }
    }
  ]
  },
  {
    slug: 'merge-k-sorted-lists',
    title: 'Merge k Sorted Lists',
    difficulty: 'Hard',
    description: 'You are given an array of `k` linked lists, `lists`, where each list is sorted in ascending order. Merge all the linked lists into one sorted linked list and return it.',
    examples: [
    {
      input: 'lists = []',
      output: '[]',
      explanation: ''
    }
  ],
    constraints: '`k == lists.length` - `0 <= k <= 10^4` - `0 <= lists[i].length <= 500` - `-10^4 <= lists[i][j] <= 10^4` - `lists[i]` is sorted in ascending order. - The sum of all `lists[i].length` does not exceed `10^4`.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Ignore the existing structure. Gather all values, sort them, and build one list.',
      algorithm: ['1. Collect every value from every list.','2. Sort the values.','3. Build a new list.'],
      code: "import java.util.ArrayList;\nimport java.util.Collections;\nimport java.util.List;\n\nclass Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        List<Integer> vals = new ArrayList<>();\n        for (ListNode head : lists) {\n            for (ListNode c = head; c != null; c = c.next) vals.add(c.val);\n        }\n        Collections.sort(vals);\n        ListNode dummy = new ListNode(), tail = dummy;\n        for (int v : vals) {\n            tail.next = new ListNode(v);\n            tail = tail.next;\n        }\n        return dummy.next;\n    }\n}",
      complexity: { time: 'O(N \\log N)', space: 'O(N)' }
    },
    {
      label: 'Better',
      intuition: 'Merge the first two lists, then merge the result with the third, and so on. Each merge is linear, but the accumulated list keeps growing, so early nodes are re-walked repeatedly.',
      algorithm: ['1. `result = null`.','2. For each list, `result = mergeTwo(result, list)`.','3. Return `result`.'],
      code: "class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        ListNode result = null;\n        for (ListNode list : lists) {\n            result = mergeTwo(result, list);\n        }\n        return result;\n    }\n\n    private ListNode mergeTwo(ListNode a, ListNode b) {\n        ListNode dummy = new ListNode(), tail = dummy;\n        while (a != null && b != null) {\n            if (a.val <= b.val) {\n                tail.next = a;\n                a = a.next;\n            } else {\n                tail.next = b;\n                b = b.next;\n            }\n            tail = tail.next;\n        }\n        tail.next = (a != null) ? a : b;\n        return dummy.next;\n    }\n}",
      complexity: { time: 'O(k \\cdot N)', space: 'O(1)' }
    },
    {
      label: 'Optimised',
      intuition: 'Keep one candidate per list in a min-heap, ordered by value. Pop the smallest, append it, and push the next node from the same list. The heap never holds more than `k` nodes, so each operation costs $O(\\log k)$.',
      algorithm: ['1. Push each non-null list head into a min-heap.','2. While the heap is not empty: pop the smallest node, append it to the result, and push `node.next` if it is non-null.','3. Return the result.'],
      code: "import java.util.PriorityQueue;\n\nclass Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        PriorityQueue<ListNode> heap = new PriorityQueue<>((a, b) -> Integer.compare(a.val, b.val));\n        for (ListNode head : lists) {\n            if (head != null) heap.offer(head);\n        }\n        ListNode dummy = new ListNode(), tail = dummy;\n        while (!heap.isEmpty()) {\n            ListNode node = heap.poll();\n            tail.next = node;\n            tail = node;\n            if (node.next != null) heap.offer(node.next);\n        }\n        return dummy.next;\n    }\n}",
      complexity: { time: 'O(N \\log k)', space: 'O(k)' }
    },
    {
      label: 'Best',
      intuition: 'Repeatedly merge pairs of lists. Each round halves the number of lists, and each round touches every node once, so there are $\\log k$ rounds costing $O(N)$ each. No heap is needed, and the extra memory is only recursion depth.',
      algorithm: ['1. `solve(lists, lo, hi)`: if `lo > hi`, return `null`. If `lo == hi`, return `lists[lo]`.','2. `mid = (lo + hi) / 2`.','3. Return `mergeTwo(solve(lo, mid), solve(mid+1, hi))`.'],
      code: "class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        if (lists.length == 0) return null;\n        return solve(lists, 0, lists.length - 1);\n    }\n\n    private ListNode solve(ListNode[] lists, int lo, int hi) {\n        if (lo == hi) return lists[lo];\n        int mid = lo + (hi - lo) / 2;\n        return mergeTwo(solve(lists, lo, mid), solve(lists, mid + 1, hi));\n    }\n\n    private ListNode mergeTwo(ListNode a, ListNode b) {\n        ListNode dummy = new ListNode(), tail = dummy;\n        while (a != null && b != null) {\n            if (a.val <= b.val) {\n                tail.next = a;\n                a = a.next;\n            } else {\n                tail.next = b;\n                b = b.next;\n            }\n            tail = tail.next;\n        }\n        tail.next = (a != null) ? a : b;\n        return dummy.next;\n    }\n}",
      complexity: { time: 'O(N \\log k)', space: 'O(\\log k)' }
    }
  ]
  },
  {
    slug: 'reverse-nodes-in-k-group',
    title: 'Reverse Nodes in k-Group',
    difficulty: 'Hard',
    description: 'Given the head of a linked list, reverse the nodes of the list `k` at a time, and return the modified list. `k` is a positive integer less than or equal to the length of the list. If the number of nodes is not a multiple of `k`, the nodes left at the end remain in their original order. You may not alter the values in the list\'s nodes, only the `next` pointers.',
    examples: [
    {
      input: 'head = [1,2,3,4,5]',
      output: '[3,2,1,4,5]',
      explanation: ''
    }
  ],
    constraints: 'The number of nodes is `n`, with `1 <= k <= n <= 5000`. - `0 <= Node.val <= 1000`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Store the values in an array, reverse each complete block of `k` in that array, then write the values back into the nodes.',
      algorithm: ['1. Collect all values.','2. For `start` from `0` in steps of `k`, if `start + k <= n`, reverse `vals[start..start+k)`.','3. Write the array back into the nodes.'],
      code: "import java.util.ArrayList;\nimport java.util.Collections;\nimport java.util.List;\n\nclass Solution {\n    public ListNode reverseKGroup(ListNode head, int k) {\n        List<Integer> vals = new ArrayList<>();\n        for (ListNode c = head; c != null; c = c.next) vals.add(c.val);\n        for (int start = 0; start + k <= vals.size(); start += k) {\n            Collections.reverse(vals.subList(start, start + k));\n        }\n        int i = 0;\n        for (ListNode c = head; c != null; c = c.next) {\n            c.val = vals.get(i++);\n        }\n        return head;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: 'Check whether `k` nodes exist starting at `head`. If not, return `head` unchanged. Otherwise reverse the first `k` nodes, with their tail pointing to the result of recursively processing the rest.',
      algorithm: ['1. Count `k` nodes starting at `head`. If fewer than `k` exist, return `head`.','2. `rest = reverseKGroup(cur, k)`, where `cur` is the node after the group.','3. Reverse the group: for each of the `k` nodes, set `next` to the previous one. Start with `prev = rest`.','4. Return the new group head.'],
      code: "class Solution {\n    public ListNode reverseKGroup(ListNode head, int k) {\n        ListNode cur = head;\n        for (int i = 0; i < k; i++) {\n            if (cur == null) return head;\n            cur = cur.next;\n        }\n        ListNode prev = reverseKGroup(cur, k);\n        ListNode c = head;\n        for (int i = 0; i < k; i++) {\n            ListNode next = c.next;\n            c.next = prev;\n            prev = c;\n            c = next;\n        }\n        return prev;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n / k)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Keep a pointer `groupPrev` to the node before the current group. For each group, find the `k`-th node. If it does not exist, stop. Otherwise reverse the group between `groupPrev.next` and the `k`-th node, reconnect, and advance `groupPrev` to the old first node, which is now the tail of the reversed group.',
      algorithm: ['1. `dummy.next = head`, `groupPrev = dummy`.','2. Loop:','- `kth = groupPrev` advanced `k` times. If `kth == null`, stop.','- `groupNext = kth.next`.','- Reverse the nodes from `first = groupPrev.next` up to `kth`, with `prev` starting at `groupNext`.','- `groupPrev.next = kth` (the new head). `groupPrev = first` (the new tail).','3. Return `dummy.next`.'],
      code: "class Solution {\n    public ListNode reverseKGroup(ListNode head, int k) {\n        ListNode dummy = new ListNode(0, head);\n        ListNode groupPrev = dummy;\n\n        while (true) {\n            ListNode kth = groupPrev;\n            for (int i = 0; i < k && kth != null; i++) {\n                kth = kth.next;\n            }\n            if (kth == null) break;\n\n            ListNode groupNext = kth.next;\n            ListNode first = groupPrev.next;\n            ListNode prev = groupNext, cur = first;\n            while (cur != groupNext) {\n                ListNode next = cur.next;\n                cur.next = prev;\n                prev = cur;\n                cur = next;\n            }\n            groupPrev.next = kth;\n            groupPrev = first;\n        }\n        return dummy.next;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'invert-binary-tree',
    title: 'Invert Binary Tree',
    difficulty: 'Easy',
    description: 'Given the `root` of a binary tree, invert the tree, and return its root. Inverting swaps the left and right child of every node.',
    examples: [
    {
      input: 'root = [2,1,3]',
      output: '[2,3,1]',
      explanation: ''
    }
  ],
    constraints: 'The number of nodes is in the range `[0, 100]`. - `-100 <= Node.val <= 100`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Visit nodes level by level with a queue. At each node, swap its children, then enqueue the non-null children.',
      algorithm: ['1. If `root` is `null`, return `null`.','2. Enqueue `root`. While the queue is not empty: dequeue `n`, swap `n.left` and `n.right`, and enqueue any non-null child.','3. Return `root`.'],
      code: "import java.util.ArrayDeque;\nimport java.util.Queue;\n\nclass Solution {\n    public TreeNode invertTree(TreeNode root) {\n        if (root == null) return null;\n        Queue<TreeNode> queue = new ArrayDeque<>();\n        queue.offer(root);\n        while (!queue.isEmpty()) {\n            TreeNode n = queue.poll();\n            TreeNode tmp = n.left;\n            n.left = n.right;\n            n.right = tmp;\n            if (n.left != null) queue.offer(n.left);\n            if (n.right != null) queue.offer(n.right);\n        }\n        return root;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(w)' }
    },
    {
      label: 'Better',
      intuition: 'Invert both subtrees recursively first, then swap the results. The recursion handles every node exactly once.',
      algorithm: ['1. If `root` is `null`, return `null`.','2. `left = invertTree(root.left)`, `right = invertTree(root.right)`.','3. Set `root.left = right`, `root.right = left`. Return `root`.'],
      code: "class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        if (root == null) return null;\n        TreeNode left = invertTree(root.left);\n        TreeNode right = invertTree(root.right);\n        root.left = right;\n        root.right = left;\n        return root;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(h)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'The same swap-at-every-node idea, driven by an explicit stack instead of recursion. This avoids stack overflow on deep, skewed trees.',
      algorithm: ['1. Push `root` onto a stack.','2. While the stack is not empty: pop `n`, swap its children, and push any non-null child.','3. Return `root`.'],
      code: "import java.util.ArrayDeque;\nimport java.util.Deque;\n\nclass Solution {\n    public TreeNode invertTree(TreeNode root) {\n        if (root == null) return null;\n        Deque<TreeNode> stack = new ArrayDeque<>();\n        stack.push(root);\n        while (!stack.isEmpty()) {\n            TreeNode n = stack.pop();\n            TreeNode tmp = n.left;\n            n.left = n.right;\n            n.right = tmp;\n            if (n.left != null) stack.push(n.left);\n            if (n.right != null) stack.push(n.right);\n        }\n        return root;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(h)' }
    }
  ]
  },
  {
    slug: 'maximum-depth-of-binary-tree',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    description: 'Given the `root` of a binary tree, return its maximum depth. The maximum depth is the number of nodes along the longest path from the root down to the farthest leaf.',
    examples: [
    {
      input: 'root = [1,null,2]',
      output: '2',
      explanation: ''
    }
  ],
    constraints: 'The number of nodes is in the range `[0, 10^4]`. - `-100 <= Node.val <= 100`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Each BFS level adds one to the depth. Process one level at a time and count the levels.',
      algorithm: ['1. If `root` is `null`, return `0`.','2. Enqueue `root`. While the queue is not empty: process every node currently in the queue, enqueuing their children, then increment `depth`.','3. Return `depth`.'],
      code: "import java.util.ArrayDeque;\nimport java.util.Queue;\n\nclass Solution {\n    public int maxDepth(TreeNode root) {\n        if (root == null) return 0;\n        Queue<TreeNode> queue = new ArrayDeque<>();\n        queue.offer(root);\n        int depth = 0;\n        while (!queue.isEmpty()) {\n            for (int size = queue.size(); size > 0; size--) {\n                TreeNode n = queue.poll();\n                if (n.left != null) queue.offer(n.left);\n                if (n.right != null) queue.offer(n.right);\n            }\n            depth++;\n        }\n        return depth;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(w)' }
    },
    {
      label: 'Better',
      intuition: 'A node\'s depth is `1 + max(depth(left), depth(right))`, with `0` for `null`. Recursion computes this directly.',
      algorithm: ['1. If `root` is `null`, return `0`.','2. Return `1 + max(maxDepth(left), maxDepth(right))`.'],
      code: "class Solution {\n    public int maxDepth(TreeNode root) {\n        if (root == null) return 0;\n        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(h)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Walk the tree with a stack of `(node, depth)` pairs, and record the largest depth seen. This has the same complexity as recursion but avoids deep call stacks.',
      algorithm: ['1. Push `(root, 1)`.','2. Pop `(n, d)`, update `best = max(best, d)`, and push each non-null child with `d + 1`.','3. Return `best`.'],
      code: "import java.util.ArrayDeque;\nimport java.util.Deque;\n\nclass Solution {\n    public int maxDepth(TreeNode root) {\n        if (root == null) return 0;\n        Deque<TreeNode> nodes = new ArrayDeque<>();\n        Deque<Integer> depths = new ArrayDeque<>();\n        nodes.push(root);\n        depths.push(1);\n        int best = 0;\n        while (!nodes.isEmpty()) {\n            TreeNode n = nodes.pop();\n            int d = depths.pop();\n            best = Math.max(best, d);\n            if (n.left != null) { nodes.push(n.left); depths.push(d + 1); }\n            if (n.right != null) { nodes.push(n.right); depths.push(d + 1); }\n        }\n        return best;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(h)' }
    }
  ]
  },
  {
    slug: 'diameter-of-binary-tree',
    title: 'Diameter of Binary Tree',
    difficulty: 'Easy',
    description: 'Given the `root` of a binary tree, return the length of its diameter. The diameter is the length of the longest path between any two nodes. The path may or may not pass through the root. The length is the number of **edges** on the path.',
    examples: [
    {
      input: 'root = [1,2]',
      output: '1',
      explanation: ''
    }
  ],
    constraints: 'The number of nodes is in the range `[1, 10^4]`. - `-100 <= Node.val <= 100`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'For each node, compute the height of its left and right subtrees from scratch, and take the maximum of their sum over all nodes.',
      algorithm: ['1. For each node `v`, compute `h(v.left) + h(v.right)` using a fresh height function.','2. Return the maximum.'],
      code: "class Solution {\n    public int diameterOfBinaryTree(TreeNode root) {\n        return dfs(root, 0);\n    }\n\n    private int dfs(TreeNode node, int best) {\n        if (node == null) return best;\n        int through = height(node.left) + height(node.right);\n        best = Math.max(best, through);\n        best = Math.max(best, dfs(node.left, 0));\n        best = Math.max(best, dfs(node.right, 0));\n        return best;\n    }\n\n    private int height(TreeNode node) {\n        if (node == null) return 0;\n        return 1 + Math.max(height(node.left), height(node.right));\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(h)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Compute each node\'s height bottom-up, and at each node record `left + right` as a candidate diameter. Heights are reused, so every node is visited once.',
      algorithm: ['1. `height(node)`: return `0` for `null`. Otherwise compute `l` and `r` for the children.','2. Update `diameter = max(diameter, l + r)`.','3. Return `1 + max(l, r)`.','4. Call `height(root)` and return `diameter`.'],
      code: "class Solution {\n    private int diameter = 0;\n\n    public int diameterOfBinaryTree(TreeNode root) {\n        height(root);\n        return diameter;\n    }\n\n    private int height(TreeNode node) {\n        if (node == null) return 0;\n        int l = height(node.left);\n        int r = height(node.right);\n        diameter = Math.max(diameter, l + r);\n        return 1 + Math.max(l, r);\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(h)' }
    }
  ]
  },
  {
    slug: 'balanced-binary-tree',
    title: 'Balanced Binary Tree',
    difficulty: 'Easy',
    description: 'Given a binary tree, determine if it is **height-balanced**. A height-balanced tree is one in which, for every node, the depths of its left and right subtrees differ by no more than `1`.',
    examples: [
    {
      input: 'root = [1,2,2,3,3,null,null,4,4]',
      output: 'false',
      explanation: ''
    }
  ],
    constraints: 'The number of nodes is in the range `[0, 5000]`. - `-10^4 <= Node.val <= 10^4`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'At each node, compute both subtree heights from scratch, check the difference, then recurse into the children.',
      algorithm: ['1. If `root` is `null`, return `true`.','2. If `|height(left) - height(right)| > 1`, return `false`.','3. Return `isBalanced(left) && isBalanced(right)`.'],
      code: "class Solution {\n    public boolean isBalanced(TreeNode root) {\n        if (root == null) return true;\n        if (Math.abs(height(root.left) - height(root.right)) > 1) return false;\n        return isBalanced(root.left) && isBalanced(root.right);\n    }\n\n    private int height(TreeNode node) {\n        if (node == null) return 0;\n        return 1 + Math.max(height(node.left), height(node.right));\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(h)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Return the height from `height()`, or `-1` when the subtree is unbalanced. Once any child returns `-1`, the answer is already determined, so propagate `-1` upward. Each node is visited once.',
      algorithm: ['1. `check(node)`: return `0` for `null`.','2. `l = check(left)`, `r = check(right)`. If either is `-1`, or `|l - r| > 1`, return `-1`.','3. Otherwise return `1 + max(l, r)`.','4. The tree is balanced if `check(root) != -1`.'],
      code: "class Solution {\n    public boolean isBalanced(TreeNode root) {\n        return check(root) != -1;\n    }\n\n    private int check(TreeNode node) {\n        if (node == null) return 0;\n        int l = check(node.left);\n        if (l == -1) return -1;\n        int r = check(node.right);\n        if (r == -1) return -1;\n        if (Math.abs(l - r) > 1) return -1;\n        return 1 + Math.max(l, r);\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(h)' }
    }
  ]
  },
  {
    slug: 'same-tree',
    title: 'Same Tree',
    difficulty: 'Easy',
    description: 'Given the roots of two binary trees `p` and `q`, return `true` if they are structurally identical and the nodes have the same values, and `false` otherwise.',
    examples: [
    {
      input: 'p = [1,2]',
      output: 'false',
      explanation: ''
    }
  ],
    constraints: 'The number of nodes in each tree is in the range `[0, 100]`. - `-10^4 <= Node.val <= 10^4`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Serialize each tree in preorder, writing `#` for every null child. Two trees are identical exactly when their serializations are equal, since the null markers encode the structure.',
      algorithm: ['1. Serialize `p` and `q` in preorder with `#` for null, separated by `,`.','2. Return `equals` on the two strings.'],
      code: "class Solution {\n    public boolean isSameTree(TreeNode p, TreeNode q) {\n        return serialize(p).equals(serialize(q));\n    }\n\n    private String serialize(TreeNode node) {\n        StringBuilder sb = new StringBuilder();\n        build(node, sb);\n        return sb.toString();\n    }\n\n    private void build(TreeNode node, StringBuilder sb) {\n        if (node == null) {\n            sb.append(\"#,\");\n            return;\n        }\n        sb.append(node.val).append(',');\n        build(node.left, sb);\n        build(node.right, sb);\n    }\n}",
      complexity: { time: 'O(m + n)', space: 'O(m + n)' }
    },
    {
      label: 'Better',
      intuition: 'Compare the current nodes. If both are null, they match. If only one is null, or the values differ, they do not. Otherwise compare the children.',
      algorithm: ['1. If `p` and `q` are both `null`, return `true`.','2. If exactly one is `null`, or `p.val != q.val`, return `false`.','3. Return `isSameTree(p.left, q.left) && isSameTree(p.right, q.right)`.'],
      code: "class Solution {\n    public boolean isSameTree(TreeNode p, TreeNode q) {\n        if (p == null && q == null) return true;\n        if (p == null || q == null) return false;\n        if (p.val != q.val) return false;\n        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);\n    }\n}",
      complexity: { time: 'O(\\min(m, n))', space: 'O(h)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Keep a queue of node pairs, one from each tree at the same position. Process pairs level by level. This avoids recursion and makes the parallel nature explicit.',
      algorithm: ['1. Enqueue `{p, q}`.','2. Dequeue a pair. If both are `null`, continue. If exactly one is `null`, or the values differ, return `false`.','3. Enqueue `{p.left, q.left}` and `{p.right, q.right}`.','4. If the queue empties, return `true`.'],
      code: "import java.util.ArrayDeque;\nimport java.util.Deque;\n\nclass Solution {\n    public boolean isSameTree(TreeNode p, TreeNode q) {\n        Deque<TreeNode[]> queue = new ArrayDeque<>();\n        queue.offer(new TreeNode[]{p, q});\n        while (!queue.isEmpty()) {\n            TreeNode[] pair = queue.poll();\n            TreeNode a = pair[0], b = pair[1];\n            if (a == null && b == null) continue;\n            if (a == null || b == null || a.val != b.val) return false;\n            queue.offer(new TreeNode[]{a.left, b.left});\n            queue.offer(new TreeNode[]{a.right, b.right});\n        }\n        return true;\n    }\n}",
      complexity: { time: 'O(\\min(m, n))', space: 'O(w)' }
    }
  ]
  },
  {
    slug: 'subtree-of-another-tree',
    title: 'Subtree of Another Tree',
    difficulty: 'Easy',
    description: 'Given the roots of two binary trees `root` and `subRoot`, return `true` if there is a subtree of `root` with the same structure and node values as `subRoot`, and `false` otherwise. A subtree of a tree consists of a node in the tree and all of that node\'s descendants.',
    examples: [
    {
      input: 'root = [3,4,5,1,2,null,null,null,null,0]',
      output: 'false',
      explanation: ''
    }
  ],
    constraints: 'The number of nodes in `root` is in the range `[1, 2000]`. - The number of nodes in `subRoot` is in the range `[1, 1000]`. - `-10^4 <= root.val, subRoot.val <= 10^4`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'For every node of `root`, run the same-tree comparison against `subRoot`.',
      algorithm: ['1. For each node `v` in `root`, if `isSame(v, subRoot)`, return `true`.','2. Return `false`.'],
      code: "class Solution {\n    public boolean isSubtree(TreeNode root, TreeNode subRoot) {\n        if (root == null) return false;\n        if (isSame(root, subRoot)) return true;\n        return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);\n    }\n\n    private boolean isSame(TreeNode p, TreeNode q) {\n        if (p == null && q == null) return true;\n        if (p == null || q == null || p.val != q.val) return false;\n        return isSame(p.left, q.left) && isSame(p.right, q.right);\n    }\n}",
      complexity: { time: 'O(m \\cdot n)', space: 'O(h)' }
    },
    {
      label: 'Better',
      intuition: 'Serialize both trees with each token wrapped in brackets, such as `[3][4][#]`. Brackets mark token boundaries, so a substring match of `subRoot`\'s serialization inside `root`\'s is a genuine subtree match. The string search itself is simple but can be quadratic in the worst case.',
      algorithm: ['1. Serialize `root` and `subRoot` in preorder, wrapping each token in `[` and `]`, with `#` for null.','2. Return `rootStr.contains(subStr)`.'],
      code: "class Solution {\n    public boolean isSubtree(TreeNode root, TreeNode subRoot) {\n        return serialize(root).contains(serialize(subRoot));\n    }\n\n    private String serialize(TreeNode node) {\n        StringBuilder sb = new StringBuilder();\n        build(node, sb);\n        return sb.toString();\n    }\n\n    private void build(TreeNode node, StringBuilder sb) {\n        if (node == null) {\n            sb.append(\"[#]\");\n            return;\n        }\n        sb.append('[').append(node.val).append(']');\n        build(node.left, sb);\n        build(node.right, sb);\n    }\n}",
      complexity: { time: 'O(m + n)', space: 'O(m + n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Represent each serialization as a list of tokens. Matching is then a sequence search over tokens, where each token is compared with `equals`, so there is no string-boundary ambiguity. KMP\'s prefix table lets the search never backtrack in `root`, which gives linear time.',
      algorithm: ['1. Serialize both trees into token lists in preorder, with `#` for null.','2. Build the KMP prefix table (`lps`) for the pattern (`subRoot`\'s tokens).','3. Scan the text (`root`\'s tokens). On a mismatch, fall back using `lps`. When the full pattern matches, return `true`.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public boolean isSubtree(TreeNode root, TreeNode subRoot) {\n        List<String> text = new ArrayList<>();\n        List<String> pattern = new ArrayList<>();\n        serialize(root, text);\n        serialize(subRoot, pattern);\n        return kmpContains(text, pattern);\n    }\n\n    private void serialize(TreeNode node, List<String> out) {\n        if (node == null) {\n            out.add(\"#\");\n            return;\n        }\n        out.add(\"^\" + node.val);\n        serialize(node.left, out);\n        serialize(node.right, out);\n    }\n\n    private boolean kmpContains(List<String> text, List<String> pat) {\n        int m = pat.size();\n        int[] lps = new int[m];\n        for (int i = 1, len = 0; i < m; i++) {\n            while (len > 0 && !pat.get(i).equals(pat.get(len))) len = lps[len - 1];\n            if (pat.get(i).equals(pat.get(len))) len++;\n            lps[i] = len;\n        }\n        int j = 0;\n        for (String t : text) {\n            while (j > 0 && !t.equals(pat.get(j))) j = lps[j - 1];\n            if (t.equals(pat.get(j))) j++;\n            if (j == m) return true;\n        }\n        return false;\n    }\n}",
      complexity: { time: 'O(m + n)', space: 'O(m + n)' }
    }
  ]
  },
  {
    slug: 'lowest-common-ancestor-of-a-binary-search-tree',
    title: 'Lowest Common Ancestor of a Binary Search Tree',
    difficulty: 'Medium',
    description: 'Given a binary search tree (BST), find the lowest common ancestor (LCA) of two given nodes `p` and `q`. The LCA is the lowest node that has both `p` and `q` as descendants, where a node may be a descendant of itself.',
    examples: [
    {
      input: 'root = [6,2,8,0,4,7,9,null,null,3,5]',
      output: '2',
      explanation: '2'
    }
  ],
    constraints: 'The number of nodes is in the range `[2, 10^5]`. - `-10^9 <= Node.val <= 10^9` - All `Node.val` are unique. - `p != q`, and both exist in the BST.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Find the path from the root to `p`, and the path from the root to `q`. The LCA is the last node the two paths share.',
      algorithm: ['1. `path(root, target)` collects nodes from root to `target` using DFS with backtracking.','2. Build `pathP` and `pathQ`.','3. Walk both lists in step. The last matching node is the LCA.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        List<TreeNode> pathP = new ArrayList<>(), pathQ = new ArrayList<>();\n        findPath(root, p, pathP);\n        findPath(root, q, pathQ);\n        TreeNode lca = null;\n        for (int i = 0; i < Math.min(pathP.size(), pathQ.size()); i++) {\n            if (pathP.get(i) != pathQ.get(i)) break;\n            lca = pathP.get(i);\n        }\n        return lca;\n    }\n\n    private boolean findPath(TreeNode node, TreeNode target, List<TreeNode> path) {\n        if (node == null) return false;\n        path.add(node);\n        if (node == target) return true;\n        if (findPath(node.left, target, path) || findPath(node.right, target, path)) return true;\n        path.remove(path.size() - 1);\n        return false;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(h)' }
    },
    {
      label: 'Better',
      intuition: 'The general binary tree LCA works for any tree, and it ignores the BST property. Return `p` or `q` when found. If both subtrees return non-null, the current node is the LCA. Otherwise pass up whichever side found something. This is correct but explores more of the tree than necessary.',
      algorithm: ['1. If `root` is `null`, or `root == p`, or `root == q`, return `root`.','2. `l = lca(left)`, `r = lca(right)`.','3. If both are non-null, return `root`. Otherwise return whichever is non-null.'],
      code: "class Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        if (root == null || root == p || root == q) return root;\n        TreeNode l = lowestCommonAncestor(root.left, p, q);\n        TreeNode r = lowestCommonAncestor(root.right, p, q);\n        if (l != null && r != null) return root;\n        return l != null ? l : r;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(h)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Use the BST ordering to decide direction at each step, so only one path is followed and no recursion is needed. The walk stops at the first node that lies between `p` and `q`, or equals one of them.',
      algorithm: ['1. While `root` is not `null`:','- If both `p.val` and `q.val` are less than `root.val`, move to `root.left`.','- Else if both are greater, move to `root.right`.','- Else return `root`.'],
      code: "class Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        TreeNode cur = root;\n        while (cur != null) {\n            if (p.val < cur.val && q.val < cur.val) {\n                cur = cur.left;\n            } else if (p.val > cur.val && q.val > cur.val) {\n                cur = cur.right;\n            } else {\n                return cur;\n            }\n        }\n        return null;\n    }\n}",
      complexity: { time: 'O(h)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'binary-tree-level-order-traversal',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    description: 'Given the `root` of a binary tree, return the level order traversal of its nodes\' values. That is, traverse from left to right, one level at a time.',
    examples: [
    {
      input: 'root = [1]',
      output: '[[1]]',
      explanation: ''
    }
  ],
    constraints: 'The number of nodes is in the range `[0, 2000]`. - `-1000 <= Node.val <= 1000`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'For each level `d` from `0` to the height minus one, run a DFS that collects only the nodes at depth `d`. Simple, but each level re-walks the tree.',
      algorithm: ['1. Compute the height `h`.','2. For `d` from `0` to `h-1`, collect values at depth `d` with a DFS that recurses into children with `d-1`.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        List<List<Integer>> result = new ArrayList<>();\n        int h = height(root);\n        for (int d = 0; d < h; d++) {\n            List<Integer> level = new ArrayList<>();\n            collect(root, d, level);\n            result.add(level);\n        }\n        return result;\n    }\n\n    private void collect(TreeNode node, int depth, List<Integer> level) {\n        if (node == null) return;\n        if (depth == 0) {\n            level.add(node.val);\n            return;\n        }\n        collect(node.left, depth - 1, level);\n        collect(node.right, depth - 1, level);\n    }\n\n    private int height(TreeNode node) {\n        if (node == null) return 0;\n        return 1 + Math.max(height(node.left), height(node.right));\n    }\n}",
      complexity: { time: 'O(n \\cdot h)', space: 'O(h)' }
    },
    {
      label: 'Better',
      intuition: 'A queue drains one level at a time. Read the current queue size as the number of nodes in the level, process exactly that many, and enqueue their children for the next level.',
      algorithm: ['1. Enqueue `root` if non-null.','2. While the queue is not empty: let `size = queue.size()`. Process `size` nodes, collecting values and enqueuing children.','3. Add the level to the result.'],
      code: "import java.util.ArrayDeque;\nimport java.util.ArrayList;\nimport java.util.List;\nimport java.util.Queue;\n\nclass Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        List<List<Integer>> result = new ArrayList<>();\n        if (root == null) return result;\n        Queue<TreeNode> queue = new ArrayDeque<>();\n        queue.offer(root);\n        while (!queue.isEmpty()) {\n            List<Integer> level = new ArrayList<>();\n            for (int size = queue.size(); size > 0; size--) {\n                TreeNode n = queue.poll();\n                level.add(n.val);\n                if (n.left != null) queue.offer(n.left);\n                if (n.right != null) queue.offer(n.right);\n            }\n            result.add(level);\n        }\n        return result;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(w)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Pass the depth down the recursion. When a depth is reached for the first time, create its list. Then append each node\'s value to the list at its depth. Nodes are visited once, in pre-order, and each level\'s list fills left to right, which is exactly level order.',
      algorithm: ['1. `dfs(node, depth)`: if `null`, return.','2. If `result.size() == depth`, append a new list.','3. `result.get(depth).add(node.val)`.','4. Recurse on left and right with `depth + 1`.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        List<List<Integer>> result = new ArrayList<>();\n        dfs(root, 0, result);\n        return result;\n    }\n\n    private void dfs(TreeNode node, int depth, List<List<Integer>> result) {\n        if (node == null) return;\n        if (result.size() == depth) {\n            result.add(new ArrayList<>());\n        }\n        result.get(depth).add(node.val);\n        dfs(node.left, depth + 1, result);\n        dfs(node.right, depth + 1, result);\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(h)' }
    }
  ]
  },
  {
    slug: 'binary-tree-right-side-view',
    title: 'Binary Tree Right Side View',
    difficulty: 'Medium',
    description: 'Given the `root` of a binary tree, imagine yourself standing on the right side of it. Return the values of the nodes you can see ordered from top to bottom.',
    examples: [
    {
      input: 'root = [1,null,3]',
      output: '[1,3]',
      explanation: ''
    }
  ],
    constraints: 'The number of nodes is in the range `[0, 100]`. - `-100 <= Node.val <= 100`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Compute the full level order traversal, then take the last element of each level.',
      algorithm: ['1. Build all levels with BFS.','2. Return the last element of each level.'],
      code: "import java.util.ArrayDeque;\nimport java.util.ArrayList;\nimport java.util.List;\nimport java.util.Queue;\n\nclass Solution {\n    public List<Integer> rightSideView(TreeNode root) {\n        List<Integer> result = new ArrayList<>();\n        if (root == null) return result;\n        List<List<Integer>> levels = new ArrayList<>();\n        Queue<TreeNode> queue = new ArrayDeque<>();\n        queue.offer(root);\n        while (!queue.isEmpty()) {\n            List<Integer> level = new ArrayList<>();\n            for (int size = queue.size(); size > 0; size--) {\n                TreeNode n = queue.poll();\n                level.add(n.val);\n                if (n.left != null) queue.offer(n.left);\n                if (n.right != null) queue.offer(n.right);\n            }\n            levels.add(level);\n        }\n        for (List<Integer> level : levels) {\n            result.add(level.get(level.size() - 1));\n        }\n        return result;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: 'The brute force stores every level. Keep only the last node of the level being processed, since that is the only value needed.',
      algorithm: ['1. Run BFS by level.','2. For each level, record the last node dequeued in that level.'],
      code: "import java.util.ArrayDeque;\nimport java.util.ArrayList;\nimport java.util.List;\nimport java.util.Queue;\n\nclass Solution {\n    public List<Integer> rightSideView(TreeNode root) {\n        List<Integer> result = new ArrayList<>();\n        if (root == null) return result;\n        Queue<TreeNode> queue = new ArrayDeque<>();\n        queue.offer(root);\n        while (!queue.isEmpty()) {\n            TreeNode last = null;\n            for (int size = queue.size(); size > 0; size--) {\n                TreeNode n = queue.poll();\n                last = n;\n                if (n.left != null) queue.offer(n.left);\n                if (n.right != null) queue.offer(n.right);\n            }\n            result.add(last.val);\n        }\n        return result;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(w)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Visit the right child before the left. The first node reached at each depth is the rightmost node at that depth, because the right subtree is always explored first. Record a node only if its depth has not been recorded yet. No queue is needed.',
      algorithm: ['1. `dfs(node, depth)`: if `null`, return.','2. If `result.size() == depth`, add `node.val`.','3. Recurse on `right`, then on `left`, with `depth + 1`.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public List<Integer> rightSideView(TreeNode root) {\n        List<Integer> result = new ArrayList<>();\n        dfs(root, 0, result);\n        return result;\n    }\n\n    private void dfs(TreeNode node, int depth, List<Integer> result) {\n        if (node == null) return;\n        if (result.size() == depth) {\n            result.add(node.val);\n        }\n        dfs(node.right, depth + 1, result);\n        dfs(node.left, depth + 1, result);\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(h)' }
    }
  ]
  },
  {
    slug: 'count-good-nodes-in-binary-tree',
    title: 'Count Good Nodes in Binary Tree',
    difficulty: 'Medium',
    description: 'Given a binary tree `root`, a node `X` is **good** if, on the path from the root to `X`, no node has a value greater than `X`. Return the number of good nodes in the tree.',
    examples: [
    {
      input: 'root = [3,3,null,4,2]',
      output: '3',
      explanation: ''
    }
  ],
    constraints: 'The number of nodes is in the range `[1, 10^5]`. - `-10^4 <= Node.val <= 10^4`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'For each node, rebuild its root path and check its value against the path\'s maximum.',
      algorithm: ['1. DFS while keeping an explicit list of the current root path.','2. At each node, compare its value with the maximum of the list (including itself). If it is at least the maximum, count it.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public int goodNodes(TreeNode root) {\n        return dfs(root, new ArrayList<>());\n    }\n\n    private int dfs(TreeNode node, List<Integer> path) {\n        if (node == null) return 0;\n        path.add(node.val);\n        int max = Integer.MIN_VALUE;\n        for (int v : path) max = Math.max(max, v);\n        int count = (node.val >= max) ? 1 : 0;\n        count += dfs(node.left, path);\n        count += dfs(node.right, path);\n        path.remove(path.size() - 1);\n        return count;\n    }\n}",
      complexity: { time: 'O(n \\cdot h)', space: 'O(h)' }
    },
    {
      label: 'Better',
      intuition: 'Carry the maximum of the path so far as a parameter. A node is counted if its value is at least that maximum, and the maximum passed down is updated with the node\'s value. This removes the per-node path scan.',
      algorithm: ['1. `dfs(node, maxSoFar)`: if `null`, return `0`.','2. `good = node.val >= maxSoFar ? 1 : 0`.','3. `newMax = max(maxSoFar, node.val)`.','4. Return `good + dfs(left, newMax) + dfs(right, newMax)`.'],
      code: "class Solution {\n    public int goodNodes(TreeNode root) {\n        return dfs(root, Integer.MIN_VALUE);\n    }\n\n    private int dfs(TreeNode node, int maxSoFar) {\n        if (node == null) return 0;\n        int good = node.val >= maxSoFar ? 1 : 0;\n        int newMax = Math.max(maxSoFar, node.val);\n        return good + dfs(node.left, newMax) + dfs(node.right, newMax);\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(h)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'The same propagation, driven by an explicit stack of `(node, maxSoFar)` pairs. This avoids deep recursion on skewed trees.',
      algorithm: ['1. Push `(root, MIN_VALUE)`.','2. Pop `(n, m)`. If `n.val >= m`, increment the count. Push each non-null child with `max(m, n.val)`.','3. Return the count.'],
      code: "import java.util.ArrayDeque;\nimport java.util.Deque;\n\nclass Solution {\n    public int goodNodes(TreeNode root) {\n        if (root == null) return 0;\n        Deque<TreeNode> nodes = new ArrayDeque<>();\n        Deque<Integer> maxes = new ArrayDeque<>();\n        nodes.push(root);\n        maxes.push(Integer.MIN_VALUE);\n        int count = 0;\n        while (!nodes.isEmpty()) {\n            TreeNode n = nodes.pop();\n            int m = maxes.pop();\n            if (n.val >= m) count++;\n            int newMax = Math.max(m, n.val);\n            if (n.left != null) { nodes.push(n.left); maxes.push(newMax); }\n            if (n.right != null) { nodes.push(n.right); maxes.push(newMax); }\n        }\n        return count;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(h)' }
    }
  ]
  },
  {
    slug: 'validate-binary-search-tree',
    title: 'Validate Binary Search Tree',
    difficulty: 'Medium',
    description: 'Given the `root` of a binary tree, determine if it is a valid binary search tree. A valid BST satisfies: - The left subtree of a node contains only nodes with keys less than the node\'s key. - The right subtree contains only nodes with keys greater than the node\'s key. - Both subtrees are themselves BSTs.',
    examples: [
    {
      input: 'root = [5,1,4,null,null,3,6]',
      output: 'false',
      explanation: ''
    }
  ],
    constraints: 'The number of nodes is in the range `[1, 10^4]`. - `-2^31 <= Node.val <= 2^31 - 1`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'For each node, check that every value in its left subtree is less than it and every value in its right subtree is greater than it, then recurse to every node.',
      algorithm: ['1. `allLess(node, bound)`: true if every value in the subtree is `< bound`.','2. `allGreater(node, bound)`: true if every value is `> bound`.','3. `isBST(node)`: if `null`, true. Otherwise check `allLess(left, node.val)` and `allGreater(right, node.val)`, and recurse on both children.'],
      code: "class Solution {\n    public boolean isValidBST(TreeNode root) {\n        if (root == null) return true;\n        if (!allLess(root.left, root.val) || !allGreater(root.right, root.val)) return false;\n        return isValidBST(root.left) && isValidBST(root.right);\n    }\n\n    private boolean allLess(TreeNode node, long bound) {\n        if (node == null) return true;\n        return node.val < bound && allLess(node.left, bound) && allLess(node.right, bound);\n    }\n\n    private boolean allGreater(TreeNode node, long bound) {\n        if (node == null) return true;\n        return node.val > bound && allGreater(node.left, bound) && allGreater(node.right, bound);\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(h)' }
    },
    {
      label: 'Better',
      intuition: 'In a valid BST, the in-order traversal gives values in strictly increasing order. Collect the in-order sequence, then check that each value exceeds the one before it.',
      algorithm: ['1. Perform in-order traversal, appending each value to a list.','2. Return `true` if the list is strictly increasing.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public boolean isValidBST(TreeNode root) {\n        List<Integer> vals = new ArrayList<>();\n        inorder(root, vals);\n        for (int i = 1; i < vals.size(); i++) {\n            if (vals.get(i) <= vals.get(i - 1)) return false;\n        }\n        return true;\n    }\n\n    private void inorder(TreeNode node, List<Integer> vals) {\n        if (node == null) return;\n        inorder(node.left, vals);\n        vals.add(node.val);\n        inorder(node.right, vals);\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Each node has an open interval `(lo, hi)` derived from its ancestors. The root\'s interval is unbounded. Going left tightens `hi` to the current value, and going right tightens `lo`. A node is valid if its value lies strictly within its interval. Use `long` bounds so that `Integer.MIN_VALUE` and `Integer.MAX_VALUE` node values are handled correctly.',
      algorithm: ['1. `validate(node, lo, hi)`: if `null`, true.','2. If `node.val <= lo` or `node.val >= hi`, return `false`.','3. Return `validate(left, lo, node.val) && validate(right, node.val, hi)`.','4. Call with `Long.MIN_VALUE` and `Long.MAX_VALUE`.'],
      code: "class Solution {\n    public boolean isValidBST(TreeNode root) {\n        return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);\n    }\n\n    private boolean validate(TreeNode node, long lo, long hi) {\n        if (node == null) return true;\n        if (node.val <= lo || node.val >= hi) return false;\n        return validate(node.left, lo, node.val) && validate(node.right, node.val, hi);\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(h)' }
    }
  ]
  },
  {
    slug: 'kth-smallest-element-in-a-bst',
    title: 'Kth Smallest Element in a BST',
    difficulty: 'Medium',
    description: 'Given the `root` of a binary search tree, and an integer `k`, return the `k`-th smallest value (1-indexed) of all the node values in the tree.',
    examples: [
    {
      input: 'root = [5,3,6,2,4,null,null,1]',
      output: '3',
      explanation: ''
    }
  ],
    constraints: 'The number of nodes is `n`, with `1 <= k <= n <= 10^4`. - `0 <= Node.val <= 10^4`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Collect all values in in-order, then index into the list.',
      algorithm: ['1. In-order traverse, appending values to a list.','2. Return `list.get(k - 1)`.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public int kthSmallest(TreeNode root, int k) {\n        List<Integer> vals = new ArrayList<>();\n        inorder(root, vals);\n        return vals.get(k - 1);\n    }\n\n    private void inorder(TreeNode node, List<Integer> vals) {\n        if (node == null) return;\n        inorder(node.left, vals);\n        vals.add(node.val);\n        inorder(node.right, vals);\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: 'Do the same in-order traversal, but count nodes as they are visited. When the counter reaches `k`, record the value and stop descending.',
      algorithm: ['1. `inorder(node)`: if `null` or already found, return.','2. Recurse left.','3. Increment `count`. If it equals `k`, record `node.val` and return.','4. Recurse right.'],
      code: "class Solution {\n    private int count = 0;\n    private int answer = -1;\n\n    public int kthSmallest(TreeNode root, int k) {\n        inorder(root, k);\n        return answer;\n    }\n\n    private void inorder(TreeNode node, int k) {\n        if (node == null || answer != -1) return;\n        inorder(node.left, k);\n        if (++count == k) {\n            answer = node.val;\n            return;\n        }\n        inorder(node.right, k);\n    }\n}",
      complexity: { time: 'O(h + k)', space: 'O(h)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Simulate the in-order traversal with an explicit stack. Push the left spine, pop a node, and count it. When the count reaches `k`, return the value. This is the same early exit without recursion.',
      algorithm: ['1. `cur = root`. While `cur != null` or the stack is not empty:','- Push `cur` and all its left descendants.','- Pop a node. Increment `count`. If `count == k`, return its value.','- Set `cur` to the popped node\'s right child.'],
      code: "import java.util.ArrayDeque;\nimport java.util.Deque;\n\nclass Solution {\n    public int kthSmallest(TreeNode root, int k) {\n        Deque<TreeNode> stack = new ArrayDeque<>();\n        TreeNode cur = root;\n        int count = 0;\n        while (cur != null || !stack.isEmpty()) {\n            while (cur != null) {\n                stack.push(cur);\n                cur = cur.left;\n            }\n            cur = stack.pop();\n            if (++count == k) return cur.val;\n            cur = cur.right;\n        }\n        return -1;\n    }\n}",
      complexity: { time: 'O(h + k)', space: 'O(h)' }
    }
  ]
  },
  {
    slug: 'construct-binary-tree-from-preorder-and-inorder-traversal',
    title: 'Construct Binary Tree from Preorder and Inorder Traversal',
    difficulty: 'Medium',
    description: 'Given two integer arrays `preorder` and `inorder`, where `preorder` is the preorder traversal of a binary tree and `inorder` is the inorder traversal of the same tree, construct and return the binary tree.',
    examples: [
    {
      input: 'preorder = [-1]',
      output: '[-1]',
      explanation: ''
    }
  ],
    constraints: '`1 <= preorder.length <= 3000` - `inorder.length == preorder.length` - `-3000 <= preorder[i], inorder[i] <= 3000` - `preorder` and `inorder` consist of unique values and are valid traversals of the same tree.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Apply the divide-and-conquer split literally. Copy the left and right parts into new arrays, and find the root\'s position in inorder with a linear scan.',
      algorithm: ['1. If `preorder` is empty, return `null`.','2. `root = preorder[0]`. Find `m`, its index in `inorder`, by linear search.','3. Build the left subtree from `preorder[1..m]` and `inorder[0..m)`, and the right subtree from `preorder[m+1..]` and `inorder[m+1..]`, copying each subarray.'],
      code: "import java.util.Arrays;\n\nclass Solution {\n    public TreeNode buildTree(int[] preorder, int[] inorder) {\n        if (preorder.length == 0) return null;\n        TreeNode root = new TreeNode(preorder[0]);\n        int m = 0;\n        while (inorder[m] != preorder[0]) m++;\n        root.left = buildTree(\n            Arrays.copyOfRange(preorder, 1, m + 1),\n            Arrays.copyOfRange(inorder, 0, m));\n        root.right = buildTree(\n            Arrays.copyOfRange(preorder, m + 1, preorder.length),\n            Arrays.copyOfRange(inorder, m + 1, inorder.length));\n        return root;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(n^2)' }
    },
    {
      label: 'Better',
      intuition: 'Avoid copying by passing index ranges into the original arrays. The root search stays linear, but the copying cost disappears.',
      algorithm: ['1. `build(ps, pe, is, ie)`: preorder range `[ps, pe]`, inorder range `[is, ie]`.','2. If `ps > pe`, return `null`.','3. `root = preorder[ps]`. Find `m` in `[is, ie]` by linear search. `leftSize = m - is`.','4. Left: `build(ps+1, ps+leftSize, is, m-1)`. Right: `build(ps+leftSize+1, pe, m+1, ie)`.'],
      code: "class Solution {\n    public TreeNode buildTree(int[] preorder, int[] inorder) {\n        return build(preorder, 0, preorder.length - 1, inorder, 0, inorder.length - 1);\n    }\n\n    private TreeNode build(int[] pre, int ps, int pe, int[] in, int is, int ie) {\n        if (ps > pe) return null;\n        TreeNode root = new TreeNode(pre[ps]);\n        int m = is;\n        while (in[m] != pre[ps]) m++;\n        int leftSize = m - is;\n        root.left = build(pre, ps + 1, ps + leftSize, in, is, m - 1);\n        root.right = build(pre, ps + leftSize + 1, pe, in, m + 1, ie);\n        return root;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(h)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'The only expensive step is finding the root\'s position in inorder. Precompute a map from value to inorder index, so every root lookup is $O(1)$. Each node is created once, and the total work is linear.',
      algorithm: ['1. Build `idx: value -> index in inorder`.','2. `build(is, ie)` uses a shared pointer `preIdx` into `preorder`. The root is `preorder[preIdx++]`.','3. `m = idx.get(root)`. Build the left subtree on `[is, m-1]` and the right on `[m+1, ie]`.'],
      code: "import java.util.HashMap;\nimport java.util.Map;\n\nclass Solution {\n    private int preIdx = 0;\n    private int[] preorder;\n    private Map<Integer, Integer> idx = new HashMap<>();\n\n    public TreeNode buildTree(int[] preorder, int[] inorder) {\n        this.preorder = preorder;\n        for (int i = 0; i < inorder.length; i++) {\n            idx.put(inorder[i], i);\n        }\n        return build(0, inorder.length - 1);\n    }\n\n    private TreeNode build(int is, int ie) {\n        if (is > ie) return null;\n        int rootVal = preorder[preIdx++];\n        TreeNode root = new TreeNode(rootVal);\n        int m = idx.get(rootVal);\n        root.left = build(is, m - 1);\n        root.right = build(m + 1, ie);\n        return root;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'binary-tree-maximum-path-sum',
    title: 'Binary Tree Maximum Path Sum',
    difficulty: 'Hard',
    description: 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge. A node may appear at most once in the sequence, and the path does not need to pass through the root. The path sum is the sum of its node values. Given the `root` of a binary tree, return the maximum path sum of any non-empty path.',
    examples: [
    {
      input: 'root = [-10,9,20,null,null,15,7]',
      output: '42',
      explanation: ''
    }
  ],
    constraints: 'The number of nodes is in the range `[1, 3 * 10^4]`. - `-1000 <= Node.val <= 1000`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'For each node as the apex, compute the best downward gains of its children from scratch, without caching, and combine them.',
      algorithm: ['1. `down(x)`: return `0` for `null`. Otherwise return `x.val + max(0, down(left), down(right))`.','2. For each node `v`, candidate = `v.val + max(0, down(v.left)) + max(0, down(v.right))`.','3. Return the maximum candidate.'],
      code: "class Solution {\n    public int maxPathSum(TreeNode root) {\n        if (root == null) return Integer.MIN_VALUE;\n        int best = Integer.MIN_VALUE;\n        best = Math.max(best, candidate(root));\n        best = Math.max(best, maxPathSum(root.left));\n        best = Math.max(best, maxPathSum(root.right));\n        return best;\n    }\n\n    private int candidate(TreeNode v) {\n        return v.val + Math.max(0, down(v.left)) + Math.max(0, down(v.right));\n    }\n\n    private int down(TreeNode x) {\n        if (x == null) return 0;\n        return x.val + Math.max(0, Math.max(down(x.left), down(x.right)));\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(h)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Compute each node\'s best downward gain once, bottom-up. At each node, the path using both branches is a candidate for the global answer. Only the single-branch gain is returned to the parent, since a path cannot fork above its apex.',
      algorithm: ['1. `gain(node)`: return `0` for `null`.','2. `l = max(0, gain(left))`, `r = max(0, gain(right))`.','3. Update `best = max(best, node.val + l + r)`.','4. Return `node.val + max(l, r)`.','5. Initialise `best` to `Integer.MIN_VALUE`, and return it after `gain(root)`.'],
      code: "class Solution {\n    private int best = Integer.MIN_VALUE;\n\n    public int maxPathSum(TreeNode root) {\n        gain(root);\n        return best;\n    }\n\n    private int gain(TreeNode node) {\n        if (node == null) return 0;\n        int l = Math.max(0, gain(node.left));\n        int r = Math.max(0, gain(node.right));\n        best = Math.max(best, node.val + l + r);\n        return node.val + Math.max(l, r);\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(h)' }
    }
  ]
  },
  {
    slug: 'serialize-and-deserialize-binary-tree',
    title: 'Serialize and Deserialize Binary Tree',
    difficulty: 'Hard',
    description: 'Design an algorithm to serialize a binary tree to a string, and deserialize that string back to the original tree structure. There are no restrictions on the format, as long as the round trip reconstructs the same tree. Implement: - `String serialize(TreeNode root)` - `TreeNode deserialize(String data)`',
    examples: [
    {
      input: 'root = []',
      output: 'deserialize(serialize(root))',
      explanation: ''
    }
  ],
    constraints: 'The number of nodes is in the range `[0, 10^4]`. - `-1000 <= Node.val <= 1000`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Write nodes in BFS order, and write `#` for each missing child. To decode, read tokens in the same order with a queue, attaching each child slot to the next node in line.',
      algorithm: ['1. Serialize: BFS. For each dequeued node, append its value. If it has no left child, append `#`, otherwise enqueue it. Do the same for the right child. Join tokens with `,`.','2. Deserialize: split on `,`. Create the root from the first token. Enqueue it. For each dequeued node, read the next token for its left child and then for its right child. Create a node for any non-`#` token and enqueue it.'],
      code: "import java.util.ArrayDeque;\nimport java.util.ArrayList;\nimport java.util.List;\nimport java.util.Queue;\n\nclass Codec {\n    public String serialize(TreeNode root) {\n        if (root == null) return \"#\";\n        List<String> tokens = new ArrayList<>();\n        Queue<TreeNode> queue = new ArrayDeque<>();\n        queue.offer(root);\n        tokens.add(String.valueOf(root.val));\n        while (!queue.isEmpty()) {\n            TreeNode n = queue.poll();\n            for (TreeNode child : new TreeNode[]{n.left, n.right}) {\n                if (child == null) {\n                    tokens.add(\"#\");\n                } else {\n                    tokens.add(String.valueOf(child.val));\n                    queue.offer(child);\n                }\n            }\n        }\n        return String.join(\",\", tokens);\n    }\n\n    public TreeNode deserialize(String data) {\n        String[] t = data.split(\",\");\n        if (t[0].equals(\"#\")) return null;\n        TreeNode root = new TreeNode(Integer.parseInt(t[0]));\n        Queue<TreeNode> queue = new ArrayDeque<>();\n        queue.offer(root);\n        int i = 1;\n        while (!queue.isEmpty()) {\n            TreeNode n = queue.poll();\n            if (!t[i].equals(\"#\")) {\n                n.left = new TreeNode(Integer.parseInt(t[i]));\n                queue.offer(n.left);\n            }\n            i++;\n            if (!t[i].equals(\"#\")) {\n                n.right = new TreeNode(Integer.parseInt(t[i]));\n                queue.offer(n.right);\n            }\n            i++;\n        }\n        return root;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Pre-order serialization writes each node before its subtrees, with `#` for null. To decode, read tokens from the front. The current token is the next node in pre-order, so decode it, then recursively decode its left subtree and then its right subtree. The recursion consumes tokens in exactly the order they were written, so no index bookkeeping is needed beyond the shared queue.',
      algorithm: ['1. Serialize: `build(node)`. If `null`, append `#`. Otherwise append the value, then build left, then build right.','2. Deserialize: put the tokens in a deque. `decode()`: poll a token. If it is `#`, return `null`. Otherwise create the node, set `left = decode()`, then `right = decode()`.'],
      code: "import java.util.ArrayDeque;\nimport java.util.Arrays;\nimport java.util.Deque;\n\nclass Codec {\n    public String serialize(TreeNode root) {\n        StringBuilder sb = new StringBuilder();\n        build(root, sb);\n        return sb.toString();\n    }\n\n    private void build(TreeNode node, StringBuilder sb) {\n        if (node == null) {\n            sb.append(\"#,\");\n            return;\n        }\n        sb.append(node.val).append(',');\n        build(node.left, sb);\n        build(node.right, sb);\n    }\n\n    public TreeNode deserialize(String data) {\n        Deque<String> tokens = new ArrayDeque<>(Arrays.asList(data.split(\",\")));\n        return decode(tokens);\n    }\n\n    private TreeNode decode(Deque<String> tokens) {\n        String t = tokens.poll();\n        if (t.equals(\"#\")) return null;\n        TreeNode node = new TreeNode(Integer.parseInt(t));\n        node.left = decode(tokens);\n        node.right = decode(tokens);\n        return node;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'kth-largest-element-in-a-stream',
    title: 'Kth Largest Element in a Stream',
    difficulty: 'Easy',
    description: 'Design a class that finds the `k`-th largest element in a stream of numbers. The class is initialised with `k` and an initial array `nums`. Implement the `KthLargest` class: - `KthLargest(int k, int[] nums)` initialises the object. - `int add(int val)` appends `val` to the stream and returns the `k`-th largest element in the stream so far.',
    examples: [
    {
      input: 'k = 1',
      output: '-3, -2',
      explanation: ''
    }
  ],
    constraints: '`1 <= k <= 10^4` - `0 <= nums.length <= 10^4` - `-10^4 <= nums[i], val <= 10^4` - At least `k` elements exist in the stream when `add` is called. - At most `10^4` calls to `add`.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Store everything. On each query, sort the full list and read the `k`-th largest.',
      algorithm: ['1. The constructor stores all values.','2. `add` appends the value, sorts ascending, and returns `all.get(size - k)`.'],
      code: "import java.util.ArrayList;\nimport java.util.Collections;\nimport java.util.List;\n\nclass KthLargest {\n    private final int k;\n    private final List<Integer> all = new ArrayList<>();\n\n    public KthLargest(int k, int[] nums) {\n        this.k = k;\n        for (int x : nums) all.add(x);\n    }\n\n    public int add(int val) {\n        all.add(val);\n        Collections.sort(all);\n        return all.get(all.size() - k);\n    }\n}",
      complexity: { time: '`add` is O(n \\log n)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: 'Keep the list sorted at all times. Insertion via binary search finds the position in $O(\\log n)$, and shifting elements costs $O(n)$. After insertion, the `k`-th largest is read directly from the end.',
      algorithm: ['1. Sort the initial values.','2. `add(val)`: find the insertion point with `Collections.binarySearch`, insert, and return `sorted.get(size - k)`.'],
      code: "import java.util.ArrayList;\nimport java.util.Collections;\nimport java.util.List;\n\nclass KthLargest {\n    private final int k;\n    private final List<Integer> sorted = new ArrayList<>();\n\n    public KthLargest(int k, int[] nums) {\n        this.k = k;\n        for (int x : nums) sorted.add(x);\n        Collections.sort(sorted);\n    }\n\n    public int add(int val) {\n        int pos = Collections.binarySearch(sorted, val);\n        if (pos < 0) pos = -pos - 1;\n        sorted.add(pos, val);\n        return sorted.get(sorted.size() - k);\n    }\n}",
      complexity: { time: '`add` is O(n) because of shifting', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Only the `k` largest values matter. Keep a min-heap of exactly `k` elements. Its root is the `k`-th largest. A new value larger than the root replaces the root. A smaller value is ignored.',
      algorithm: ['1. `push(val)`: if the heap has fewer than `k` items, offer `val`. Otherwise, if `val > peek()`, poll and offer `val`.','2. Construct by pushing every initial value.','3. `add(val)`: push, and return `heap.peek()`.'],
      code: "import java.util.PriorityQueue;\n\nclass KthLargest {\n    private final int k;\n    private final PriorityQueue<Integer> minHeap = new PriorityQueue<>();\n\n    public KthLargest(int k, int[] nums) {\n        this.k = k;\n        for (int x : nums) push(x);\n    }\n\n    public int add(int val) {\n        push(val);\n        return minHeap.peek();\n    }\n\n    private void push(int val) {\n        if (minHeap.size() < k) {\n            minHeap.offer(val);\n        } else if (val > minHeap.peek()) {\n            minHeap.poll();\n            minHeap.offer(val);\n        }\n    }\n}",
      complexity: { time: '`add` is O(\\log k)', space: 'O(k)' }
    }
  ]
  },
  {
    slug: 'last-stone-weight',
    title: 'Last Stone Weight',
    difficulty: 'Easy',
    description: 'You are given an array of integers `stones`, where `stones[i]` is the weight of the `i`-th stone. Each turn, pick the two heaviest stones and smash them together. If they have equal weight, both are destroyed. If not, the lighter one is destroyed and the heavier one\'s weight becomes the difference. At the end, return the weight of the last remaining stone, or `0` if none remain.',
    examples: [
    {
      input: 'stones = [1]',
      output: '1',
      explanation: ''
    }
  ],
    constraints: '`1 <= stones.length <= 30` - `1 <= stones[i] <= 1000`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Sort the list every turn, take the last two elements, smash them, and put the difference back if it is non-zero.',
      algorithm: ['1. While the list has more than one stone: sort it, remove the last two, and add `|a - b|` if non-zero.','2. Return the remaining stone, or `0`.'],
      code: "import java.util.ArrayList;\nimport java.util.Collections;\nimport java.util.List;\n\nclass Solution {\n    public int lastStoneWeight(int[] stones) {\n        List<Integer> list = new ArrayList<>();\n        for (int s : stones) list.add(s);\n        while (list.size() > 1) {\n            Collections.sort(list);\n            int y = list.remove(list.size() - 1);\n            int x = list.remove(list.size() - 1);\n            if (y != x) list.add(y - x);\n        }\n        return list.isEmpty() ? 0 : list.get(0);\n    }\n}",
      complexity: { time: 'O(n^2 \\log n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'A max-heap yields the two heaviest stones in $O(\\log n)$ each. The surviving difference is pushed back, so each smash costs logarithmic time instead of a full sort.',
      algorithm: ['1. Offer every stone into a max-heap.','2. While the heap has at least two elements: poll `y` and `x`. If `y != x`, offer `y - x`.','3. Return the heap\'s peek, or `0` if empty.'],
      code: "import java.util.Collections;\nimport java.util.PriorityQueue;\n\nclass Solution {\n    public int lastStoneWeight(int[] stones) {\n        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());\n        for (int s : stones) maxHeap.offer(s);\n        while (maxHeap.size() > 1) {\n            int y = maxHeap.poll();\n            int x = maxHeap.poll();\n            if (y != x) maxHeap.offer(y - x);\n        }\n        return maxHeap.isEmpty() ? 0 : maxHeap.peek();\n    }\n}",
      complexity: { time: 'O(n \\log n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'k-closest-points-to-origin',
    title: 'K Closest Points to Origin',
    difficulty: 'Medium',
    description: 'Given an array of `points` where `points[i] = [xi, yi]` represents a point on the X-Y plane, and an integer `k`, return the `k` closest points to the origin `(0, 0)`. The distance is the Euclidean distance. The answer may be returned in any order, and it is guaranteed to be unique up to ordering.',
    examples: [
    {
      input: 'points = [[3,3],[5,-1],[-2,4]]',
      output: '[[3,3],[-2,4]]',
      explanation: ''
    }
  ],
    constraints: '`1 <= k <= points.length <= 10^4` - `-10^4 <= xi, yi <= 10^4`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Sort all points by squared distance and take the first `k`.',
      algorithm: ['1. Sort `points` with a comparator on `x^2 + y^2`.','2. Return the first `k` points.'],
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int[][] kClosest(int[][] points, int k) {\n        Arrays.sort(points, (a, b) -> Long.compare(dist(a), dist(b)));\n        return Arrays.copyOf(points, k);\n    }\n\n    private long dist(int[] p) {\n        return (long) p[0] * p[0] + (long) p[1] * p[1];\n    }\n}",
      complexity: { time: 'O(n \\log n)', space: 'O(\\log n)' }
    },
    {
      label: 'Better',
      intuition: 'Keep the `k` closest points seen so far in a max-heap keyed by distance. The root is the farthest of the `k`. A new point closer than the root replaces it. The heap never exceeds `k` entries.',
      algorithm: ['1. For each point, offer it into a max-heap ordered by distance.','2. If the heap size exceeds `k`, poll the farthest.','3. Return the heap\'s contents.'],
      code: "import java.util.PriorityQueue;\n\nclass Solution {\n    public int[][] kClosest(int[][] points, int k) {\n        PriorityQueue<int[]> maxHeap = new PriorityQueue<>((a, b) -> Long.compare(dist(b), dist(a)));\n        for (int[] p : points) {\n            maxHeap.offer(p);\n            if (maxHeap.size() > k) maxHeap.poll();\n        }\n        int[][] result = new int[k][];\n        for (int i = 0; i < k; i++) result[i] = maxHeap.poll();\n        return result;\n    }\n\n    private long dist(int[] p) {\n        return (long) p[0] * p[0] + (long) p[1] * p[1];\n    }\n}",
      complexity: { time: 'O(n \\log k)', space: 'O(k)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Quickselect partitions the array around a pivot in $O(n)$ expected time, and then recurses into only one side. After the process, the first `k` positions hold the `k` closest points, in any order. Random pivots keep the expected time linear.',
      algorithm: ['1. `select(lo, hi)`: pick a random pivot in `[lo, hi]`, swap it to `hi`, and partition by distance (Lomuto).','2. If the pivot\'s final index `p` equals `k`, stop. If `p < k`, search `[p+1, hi]`. Otherwise search `[lo, p-1]`.','3. Return the first `k` points.'],
      code: "import java.util.Arrays;\nimport java.util.Random;\n\nclass Solution {\n    private final Random rnd = new Random();\n\n    public int[][] kClosest(int[][] points, int k) {\n        select(points, 0, points.length - 1, k);\n        return Arrays.copyOf(points, k);\n    }\n\n    private void select(int[][] pts, int lo, int hi, int k) {\n        while (lo < hi) {\n            int r = lo + rnd.nextInt(hi - lo + 1);\n            swap(pts, r, hi);\n            int pivot = dist(pts[hi]);\n            int i = lo;\n            for (int j = lo; j < hi; j++) {\n                if (dist(pts[j]) < pivot) {\n                    swap(pts, i, j);\n                    i++;\n                }\n            }\n            swap(pts, i, hi);\n            if (i == k) return;\n            if (i < k) lo = i + 1;\n            else hi = i - 1;\n        }\n    }\n\n    private long dist(int[] p) {\n        return (long) p[0] * p[0] + (long) p[1] * p[1];\n    }\n\n    private void swap(int[][] a, int i, int j) {\n        int[] t = a[i];\n        a[i] = a[j];\n        a[j] = t;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'kth-largest-element-in-an-array',
    title: 'Kth Largest Element in an Array',
    difficulty: 'Medium',
    description: 'Given an integer array `nums` and an integer `k`, return the `k`-th largest element in the array. The `k`-th largest element is the `k`-th element in the sorted order, not the `k`-th distinct element. Solve it without sorting the full array if possible.',
    examples: [
    {
      input: 'nums = [3,2,3,1,2,4,5,5,6]',
      output: '4',
      explanation: ''
    }
  ],
    constraints: '`1 <= k <= nums.length <= 10^5` - `-10^4 <= nums[i] <= 10^4`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Sort ascending and read index `n - k`.',
      algorithm: ['1. Sort `nums`.','2. Return `nums[n - k]`.'],
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int findKthLargest(int[] nums, int k) {\n        Arrays.sort(nums);\n        return nums[nums.length - k];\n    }\n}",
      complexity: { time: 'O(n \\log n)', space: 'O(\\log n)' }
    },
    {
      label: 'Better',
      intuition: 'Keep the `k` largest values in a min-heap. Its root is the `k`-th largest once all values are processed.',
      algorithm: ['1. For each value, offer it to a min-heap. If the size exceeds `k`, poll the smallest.','2. Return the heap\'s peek.'],
      code: "import java.util.PriorityQueue;\n\nclass Solution {\n    public int findKthLargest(int[] nums, int k) {\n        PriorityQueue<Integer> minHeap = new PriorityQueue<>();\n        for (int x : nums) {\n            minHeap.offer(x);\n            if (minHeap.size() > k) minHeap.poll();\n        }\n        return minHeap.peek();\n    }\n}",
      complexity: { time: 'O(n \\log k)', space: 'O(k)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Partition around a random pivot so that all smaller values are on the left and all larger on the right. If the pivot lands at the target index `n - k`, it is the answer. Otherwise recurse into only the side containing the target.',
      algorithm: ['1. `target = n - k`. `lo = 0`, `hi = n - 1`.','2. Loop: choose a random pivot in `[lo, hi]`, swap it to `hi`, and partition (Lomuto). Let `p` be its final index.','3. If `p == target`, return `nums[p]`. If `p < target`, `lo = p + 1`. Otherwise `hi = p - 1`.'],
      code: "import java.util.Random;\n\nclass Solution {\n    private final Random rnd = new Random();\n\n    public int findKthLargest(int[] nums, int k) {\n        int target = nums.length - k;\n        int lo = 0, hi = nums.length - 1;\n        while (true) {\n            int r = lo + rnd.nextInt(hi - lo + 1);\n            swap(nums, r, hi);\n            int p = partition(nums, lo, hi);\n            if (p == target) return nums[p];\n            if (p < target) lo = p + 1;\n            else hi = p - 1;\n        }\n    }\n\n    private int partition(int[] a, int lo, int hi) {\n        int pivot = a[hi], i = lo;\n        for (int j = lo; j < hi; j++) {\n            if (a[j] < pivot) {\n                swap(a, i, j);\n                i++;\n            }\n        }\n        swap(a, i, hi);\n        return i;\n    }\n\n    private void swap(int[] a, int i, int j) {\n        int t = a[i];\n        a[i] = a[j];\n        a[j] = t;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'task-scheduler',
    title: 'Task Scheduler',
    difficulty: 'Medium',
    description: 'You are given an array of CPU `tasks`, each represented by a letter from `A` to `Z`, and a cooldown integer `n`. Each cycle, the CPU can complete one task, or stay idle. Identical tasks must be separated by at least `n` cycles. Return the minimum number of cycles needed to finish all tasks.',
    examples: [
    {
      input: 'tasks = ["A","A","A","B","B","B"]',
      output: '6',
      explanation: ''
    }
  ],
    constraints: '`1 <= tasks.length <= 10^4` - `tasks[i]` is an uppercase English letter. - `0 <= n <= 100`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Simulate cycle by cycle. Each cycle, choose the task with the highest remaining count among those whose cooldown has expired. If none is available, the cycle is idle.',
      algorithm: ['1. `cnt[26]` holds remaining counts, `readyAt[26]` holds the cycle when each task becomes available.','2. For `time = 0, 1, ...` until all tasks are done:','- Pick the available task with the highest count.','- If found, decrement its count, set `readyAt = time + n + 1`, and mark one task done.','- Advance `time`.','3. Return `time`.'],
      code: "class Solution {\n    public int leastInterval(char[] tasks, int n) {\n        int[] cnt = new int[26], readyAt = new int[26];\n        for (char t : tasks) cnt[t - 'A']++;\n        int remaining = tasks.length, time = 0;\n        while (remaining > 0) {\n            int best = -1;\n            for (int c = 0; c < 26; c++) {\n                if (cnt[c] > 0 && readyAt[c] <= time && (best == -1 || cnt[c] > cnt[best])) {\n                    best = c;\n                }\n            }\n            if (best != -1) {\n                cnt[best]--;\n                readyAt[best] = time + n + 1;\n                remaining--;\n            }\n            time++;\n        }\n        return time;\n    }\n}",
      complexity: { time: 'O(T \\cdot 26)', space: 'O(1)' }
    },
    {
      label: 'Better',
      intuition: 'Use a max-heap of remaining counts, so the most frequent available task is always at the top. When a task runs, its count moves into a cooldown queue with the time it becomes available again. Each cycle, move the queue head back into the heap if its time has arrived.',
      algorithm: ['1. Put all counts into a max-heap. `time = 0`.','2. While the heap or the cooldown queue is non-empty:','- `time++`.','- If the heap is non-empty, pop the top count, decrement it, and if it is still positive, add `{count, time + n}` to the queue.','- If the queue head\'s ready time equals `time`, push its count back into the heap.','3. Return `time`.'],
      code: "import java.util.ArrayDeque;\nimport java.util.Collections;\nimport java.util.Deque;\nimport java.util.PriorityQueue;\n\nclass Solution {\n    public int leastInterval(char[] tasks, int n) {\n        int[] cnt = new int[26];\n        for (char t : tasks) cnt[t - 'A']++;\n        PriorityQueue<Integer> heap = new PriorityQueue<>(Collections.reverseOrder());\n        for (int c : cnt) if (c > 0) heap.offer(c);\n        Deque<int[]> cooldown = new ArrayDeque<>();\n        int time = 0;\n        while (!heap.isEmpty() || !cooldown.isEmpty()) {\n            time++;\n            if (!heap.isEmpty()) {\n                int c = heap.poll() - 1;\n                if (c > 0) cooldown.offer(new int[]{c, time + n});\n            }\n            if (!cooldown.isEmpty() && cooldown.peek()[1] == time) {\n                heap.offer(cooldown.poll()[0]);\n            }\n        }\n        return time;\n    }\n}",
      complexity: { time: 'O(T \\log 26)', space: 'O(1)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Let `maxF` be the highest frequency, and `m` the number of tasks that have that frequency. The most frequent tasks form `maxF` rows with `m` tasks in the last row. The first `maxF - 1` rows each have `n + 1` slots, so the total is `(maxF - 1) * (n + 1) + m`. If the other tasks are so numerous that every slot is filled, no idle time exists, and the answer is the number of tasks.',
      algorithm: ['1. Count frequencies. Let `maxF` be the maximum, and `m` the number of letters with that count.','2. `idle = (maxF - 1) * (n + 1) + m`.','3. Return `max(tasks.length, idle)`.'],
      code: "class Solution {\n    public int leastInterval(char[] tasks, int n) {\n        int[] freq = new int[26];\n        for (char t : tasks) freq[t - 'A']++;\n        int maxF = 0;\n        for (int f : freq) maxF = Math.max(maxF, f);\n        int m = 0;\n        for (int f : freq) if (f == maxF) m++;\n        int idle = (maxF - 1) * (n + 1) + m;\n        return Math.max(tasks.length, idle);\n    }\n}",
      complexity: { time: 'O(T)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'design-twitter',
    title: 'Design Twitter',
    difficulty: 'Medium',
    description: 'Design a simplified version of Twitter with the following operations: - `postTweet(userId, tweetId)` composes a new tweet. - `getNewsFeed(userId)` retrieves the 10 most recent tweet IDs in the user\'s news feed. Each item must be from the user or from someone they follow. Tweets must be ordered from most recent to least recent. - `follow(followerId, followeeId)` makes the follower follow the followee. - `unfollow(followerId, followeeId)` makes the follower unfollow the followee. A user follows themselves implicitly, so their own tweets appear in their feed.',
    examples: [],
    constraints: '`1 <= userId, followerId, followeeId <= 500` - `0 <= tweetId <= 10^4` - At most `3 * 10^4` calls in total. - All tweet IDs are unique.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Store every tweet in one global list with its author and timestamp. For a feed, filter the list by the relevant authors, sort by time descending, and take 10.',
      algorithm: ['1. `postTweet` appends `(author, tweetId, time)`.','2. `getNewsFeed(u)`: build the set `{u} ∪ follows(u)`. Filter the global list by author membership, sort by time descending, and return the first 10 IDs.'],
      code: "import java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.HashSet;\nimport java.util.List;\nimport java.util.Map;\nimport java.util.Set;\n\nclass Twitter {\n    private record Tweet(int author, int id, int time) {}\n    private int clock = 0;\n    private final List<Tweet> all = new ArrayList<>();\n    private final Map<Integer, Set<Integer>> follows = new HashMap<>();\n\n    public void postTweet(int userId, int tweetId) {\n        all.add(new Tweet(userId, tweetId, clock++));\n    }\n\n    public List<Integer> getNewsFeed(int userId) {\n        Set<Integer> users = new HashSet<>(follows.getOrDefault(userId, Set.of()));\n        users.add(userId);\n        List<Tweet> feed = new ArrayList<>();\n        for (Tweet t : all) {\n            if (users.contains(t.author())) feed.add(t);\n        }\n        feed.sort((a, b) -> Integer.compare(b.time(), a.time()));\n        List<Integer> result = new ArrayList<>();\n        for (int i = 0; i < Math.min(10, feed.size()); i++) {\n            result.add(feed.get(i).id());\n        }\n        return result;\n    }\n\n    public void follow(int followerId, int followeeId) {\n        if (followerId != followeeId) {\n            follows.computeIfAbsent(followerId, k -> new HashSet<>()).add(followeeId);\n        }\n    }\n\n    public void unfollow(int followerId, int followeeId) {\n        Set<Integer> s = follows.get(followerId);\n        if (s != null) s.remove(followeeId);\n    }\n}",
      complexity: { time: '`getNewsFeed` is O(T \\log T), where T is the total number of tweets', space: 'O(T)' }
    },
    {
      label: 'Better',
      intuition: 'Store tweets per user, so a feed only touches relevant lists. Concatenate the lists for the user and their followees, sort by time, and take 10. This is much cheaper than scanning all tweets, but still sorts more than necessary.',
      algorithm: ['1. `tweets: userId -> List<Tweet>` in posting order.','2. `getNewsFeed(u)`: collect every tweet from each relevant user\'s list, sort by time descending, and return the first 10.'],
      code: "import java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.HashSet;\nimport java.util.List;\nimport java.util.Map;\nimport java.util.Set;\n\nclass Twitter {\n    private record Tweet(int id, int time) {}\n    private int clock = 0;\n    private final Map<Integer, List<Tweet>> tweets = new HashMap<>();\n    private final Map<Integer, Set<Integer>> follows = new HashMap<>();\n\n    public void postTweet(int userId, int tweetId) {\n        tweets.computeIfAbsent(userId, k -> new ArrayList<>()).add(new Tweet(tweetId, clock++));\n    }\n\n    public List<Integer> getNewsFeed(int userId) {\n        Set<Integer> users = new HashSet<>(follows.getOrDefault(userId, Set.of()));\n        users.add(userId);\n        List<Tweet> feed = new ArrayList<>();\n        for (int u : users) {\n            feed.addAll(tweets.getOrDefault(u, List.of()));\n        }\n        feed.sort((a, b) -> Integer.compare(b.time(), a.time()));\n        List<Integer> result = new ArrayList<>();\n        for (int i = 0; i < Math.min(10, feed.size()); i++) {\n            result.add(feed.get(i).id());\n        }\n        return result;\n    }\n\n    public void follow(int followerId, int followeeId) {\n        if (followerId != followeeId) {\n            follows.computeIfAbsent(followerId, k -> new HashSet<>()).add(followeeId);\n        }\n    }\n\n    public void unfollow(int followerId, int followeeId) {\n        Set<Integer> s = follows.get(followerId);\n        if (s != null) s.remove(followeeId);\n    }\n}",
      complexity: { time: '`getNewsFeed` is O(F \\cdot T_u \\log(F \\cdot T_u)), where F is the number of relevant users', space: 'O(T)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Each user\'s list is sorted by time. The feed is a merge of those lists, and only the top 10 items are needed. Put the most recent tweet of each relevant user into a max-heap by time. Pop the largest, and push the previous tweet from that same user. Ten pops produce the feed, and each pop costs $O(\\log F)$.',
      algorithm: ['1. Let `users` be the user and their followees.','2. For each user with tweets, push `(time, user, index)` for their last tweet.','3. Repeat up to 10 times: pop the largest time, record its tweet ID, and if the index is greater than 0, push the previous tweet of that user.'],
      code: "import java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.HashSet;\nimport java.util.List;\nimport java.util.Map;\nimport java.util.PriorityQueue;\nimport java.util.Set;\n\nclass Twitter {\n    private record Tweet(int id, int time) {}\n    private int clock = 0;\n    private final Map<Integer, List<Tweet>> tweets = new HashMap<>();\n    private final Map<Integer, Set<Integer>> follows = new HashMap<>();\n\n    public void postTweet(int userId, int tweetId) {\n        tweets.computeIfAbsent(userId, k -> new ArrayList<>()).add(new Tweet(tweetId, clock++));\n    }\n\n    public List<Integer> getNewsFeed(int userId) {\n        Set<Integer> users = new HashSet<>(follows.getOrDefault(userId, Set.of()));\n        users.add(userId);\n\n        // Entry: {time, userId, index into that user's tweet list}\n        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(b[0], a[0]));\n        for (int u : users) {\n            List<Tweet> list = tweets.get(u);\n            if (list != null && !list.isEmpty()) {\n                int last = list.size() - 1;\n                heap.offer(new int[]{list.get(last).time(), u, last});\n            }\n        }\n\n        List<Integer> result = new ArrayList<>();\n        while (!heap.isEmpty() && result.size() < 10) {\n            int[] top = heap.poll();\n            int u = top[1], idx = top[2];\n            result.add(tweets.get(u).get(idx).id());\n            if (idx > 0) {\n                int prev = idx - 1;\n                heap.offer(new int[]{tweets.get(u).get(prev).time(), u, prev});\n            }\n        }\n        return result;\n    }\n\n    public void follow(int followerId, int followeeId) {\n        if (followerId != followeeId) {\n            follows.computeIfAbsent(followerId, k -> new HashSet<>()).add(followeeId);\n        }\n    }\n\n    public void unfollow(int followerId, int followeeId) {\n        Set<Integer> s = follows.get(followerId);\n        if (s != null) s.remove(followeeId);\n    }\n}",
      complexity: { time: '`getNewsFeed` is O(F + 10 \\log F)', space: 'O(F)' }
    }
  ]
  },
  {
    slug: 'find-median-from-data-stream',
    title: 'Find Median from Data Stream',
    difficulty: 'Hard',
    description: 'The median is the middle value of an ordered list. If the list has an even length, it is the average of the two middle values. Implement the `MedianFinder` class: - `MedianFinder()` initialises the object. - `void addNum(int num)` adds an integer to the data structure. - `double findMedian()` returns the median of all elements so far.',
    examples: [],
    constraints: '`-10^5 <= num <= 10^5` - At least one element exists before `findMedian` is called. - At most `5 * 10^4` calls to `addNum` and `findMedian`.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Store every value. For a median query, sort the list and read the middle.',
      algorithm: ['1. `addNum` appends to a list.','2. `findMedian` sorts a copy of the list and returns the middle, or the average of the two middle values.'],
      code: "import java.util.ArrayList;\nimport java.util.Collections;\nimport java.util.List;\n\nclass MedianFinder {\n    private final List<Integer> nums = new ArrayList<>();\n\n    public void addNum(int num) {\n        nums.add(num);\n    }\n\n    public double findMedian() {\n        List<Integer> copy = new ArrayList<>(nums);\n        Collections.sort(copy);\n        int n = copy.size();\n        if (n % 2 == 1) return copy.get(n / 2);\n        return (copy.get(n / 2 - 1) + copy.get(n / 2)) / 2.0;\n    }\n}",
      complexity: { time: '`addNum` is O(1), `findMedian` is O(n \\log n)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: 'Keep the list sorted on insertion. Finding the position costs $O(\\log n)$ and shifting costs $O(n)$. Then every median query is $O(1)$.',
      algorithm: ['1. `addNum`: binary search for the insertion index, then insert.','2. `findMedian`: read the middle element, or average the two middle elements.'],
      code: "import java.util.ArrayList;\nimport java.util.Collections;\nimport java.util.List;\n\nclass MedianFinder {\n    private final List<Integer> sorted = new ArrayList<>();\n\n    public void addNum(int num) {\n        int pos = Collections.binarySearch(sorted, num);\n        if (pos < 0) pos = -pos - 1;\n        sorted.add(pos, num);\n    }\n\n    public double findMedian() {\n        int n = sorted.size();\n        if (n % 2 == 1) return sorted.get(n / 2);\n        return (sorted.get(n / 2 - 1) + sorted.get(n / 2)) / 2.0;\n    }\n}",
      complexity: { time: '`addNum` is O(n) because of shifting, `findMedian` is O(1)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Keep a max-heap `lo` holding the smaller half and a min-heap `hi` holding the larger half. Maintain the invariant that `lo` has the same size as `hi` or one more element, and that every value in `lo` is at most every value in `hi`. Then the median is `lo.peek()` when `lo` is larger, or the average of both tops when sizes are equal.',
      algorithm: ['1. `addNum(x)`: push `x` into `lo`. Move `lo`\'s maximum into `hi`. If `hi` is larger than `lo`, move `hi`\'s minimum back to `lo`.','2. `findMedian()`: if `lo` has more elements, return `lo.peek()`. Otherwise return `(lo.peek() + hi.peek()) / 2.0`.'],
      code: "import java.util.Collections;\nimport java.util.PriorityQueue;\n\nclass MedianFinder {\n    private final PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder());\n    private final PriorityQueue<Integer> hi = new PriorityQueue<>();\n\n    public void addNum(int num) {\n        lo.offer(num);\n        hi.offer(lo.poll());\n        if (hi.size() > lo.size()) {\n            lo.offer(hi.poll());\n        }\n    }\n\n    public double findMedian() {\n        if (lo.size() > hi.size()) return lo.peek();\n        return (lo.peek() + hi.peek()) / 2.0;\n    }\n}",
      complexity: { time: '`addNum` is O(\\log n), `findMedian` is O(1)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'subsets',
    title: 'Subsets',
    difficulty: 'Medium',
    description: 'Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution must not contain duplicate subsets. Return the solution in any order.',
    examples: [
    {
      input: 'nums = [0]',
      output: '[[],[0]]',
      explanation: ''
    }
  ],
    constraints: '`1 <= nums.length <= 10` - `-10 <= nums[i] <= 10` - All elements are unique.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Each integer from `0` to `2^n - 1` encodes a subset: bit `i` set means `nums[i]` is included.',
      algorithm: ['1. For each `mask` in `[0, 2^n)`, build a list of `nums[i]` where bit `i` of `mask` is set.','2. Add the list to the result.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        int n = nums.length;\n        List<List<Integer>> result = new ArrayList<>();\n        for (int mask = 0; mask < (1 << n); mask++) {\n            List<Integer> subset = new ArrayList<>();\n            for (int i = 0; i < n; i++) {\n                if (((mask >> i) & 1) == 1) subset.add(nums[i]);\n            }\n            result.add(subset);\n        }\n        return result;\n    }\n}",
      complexity: { time: 'O(n \\cdot 2^n)', space: 'O(n \\cdot 2^n)' }
    },
    {
      label: 'Better',
      intuition: 'Start with the empty subset. For each new element, every existing subset yields a new one with that element appended. The count doubles with each element.',
      algorithm: ['1. `result = [[]]`.','2. For each `x` in `nums`: for every subset currently in `result`, copy it, append `x`, and add the copy.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        List<List<Integer>> result = new ArrayList<>();\n        result.add(new ArrayList<>());\n        for (int x : nums) {\n            int size = result.size();\n            for (int i = 0; i < size; i++) {\n                List<Integer> copy = new ArrayList<>(result.get(i));\n                copy.add(x);\n                result.add(copy);\n            }\n        }\n        return result;\n    }\n}",
      complexity: { time: 'O(n \\cdot 2^n)', space: 'O(n \\cdot 2^n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Record the current path as a subset at every node of the recursion. To avoid permutations of the same set, only extend the path with elements at or after the current index. Each subset is generated exactly once.',
      algorithm: ['1. `dfs(start, path)`: add a copy of `path` to the result.','2. For `i` from `start` to `n-1`: append `nums[i]`, recurse with `i + 1`, then remove the last element.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        List<List<Integer>> result = new ArrayList<>();\n        dfs(nums, 0, new ArrayList<>(), result);\n        return result;\n    }\n\n    private void dfs(int[] nums, int start, List<Integer> path, List<List<Integer>> result) {\n        result.add(new ArrayList<>(path));\n        for (int i = start; i < nums.length; i++) {\n            path.add(nums[i]);\n            dfs(nums, i + 1, path, result);\n            path.remove(path.size() - 1);\n        }\n    }\n}",
      complexity: { time: 'O(n \\cdot 2^n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'combination-sum',
    title: 'Combination Sum',
    difficulty: 'Medium',
    description: 'Given an array of distinct integers `candidates` and a target integer `target`, return a list of all unique combinations of `candidates` where the chosen numbers sum to `target`. The same number may be chosen an unlimited number of times. Two combinations are unique if the frequency of at least one number differs.',
    examples: [
    {
      input: 'candidates = [2,3,5]',
      output: '[[2,2,2,2],[2,3,3],[3,5]]',
      explanation: ''
    }
  ],
    constraints: '`1 <= candidates.length <= 30` - `2 <= candidates[i] <= 40` - All candidates are distinct. - `1 <= target <= 40`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Generate every ordered sequence whose sum does not exceed the target, keep those summing to exactly the target, and deduplicate by sorting each sequence and inserting it into a set.',
      algorithm: ['1. `gen(path, sum)`: if `sum == target`, store the sorted copy of `path` in a set. If `sum > target`, return.','2. For each candidate, append, recurse with `sum + candidate`, then remove.'],
      code: "import java.util.ArrayList;\nimport java.util.Collections;\nimport java.util.HashSet;\nimport java.util.List;\nimport java.util.Set;\n\nclass Solution {\n    public List<List<Integer>> combinationSum(int[] candidates, int target) {\n        Set<List<Integer>> found = new HashSet<>();\n        gen(candidates, target, 0, new ArrayList<>(), found);\n        return new ArrayList<>(found);\n    }\n\n    private void gen(int[] c, int target, int sum, List<Integer> path, Set<List<Integer>> found) {\n        if (sum == target) {\n            List<Integer> key = new ArrayList<>(path);\n            Collections.sort(key);\n            found.add(key);\n            return;\n        }\n        if (sum > target) return;\n        for (int x : c) {\n            path.add(x);\n            gen(c, target, sum + x, path, found);\n            path.remove(path.size() - 1);\n        }\n    }\n}",
      complexity: { time: 'Exponential, bounded by the number of sequences with sum at most `target`', space: 'Exponential for the set of results' }
    },
    {
      label: 'Better',
      intuition: 'Restricting each choice to indices at or after the current one removes the permutation duplicates, so no deduplication is needed. Recursion stops when the remaining sum is zero, and prunes when it becomes negative.',
      algorithm: ['1. `dfs(start, remaining)`: if `remaining == 0`, record a copy of the path.','2. For `i` from `start` to `n-1`, if `candidates[i] <= remaining`, append it, recurse with `(i, remaining - candidates[i])`, then remove it.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public List<List<Integer>> combinationSum(int[] candidates, int target) {\n        List<List<Integer>> result = new ArrayList<>();\n        dfs(candidates, 0, target, new ArrayList<>(), result);\n        return result;\n    }\n\n    private void dfs(int[] c, int start, int remaining, List<Integer> path, List<List<Integer>> result) {\n        if (remaining == 0) {\n            result.add(new ArrayList<>(path));\n            return;\n        }\n        for (int i = start; i < c.length; i++) {\n            if (c[i] <= remaining) {\n                path.add(c[i]);\n                dfs(c, i, remaining - c[i], path, result);\n                path.remove(path.size() - 1);\n            }\n        }\n    }\n}",
      complexity: { time: 'Exponential in the worst case, bounded by the number of valid combinations', space: 'O(\\text{target})' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Sort the candidates. Once a candidate exceeds the remaining sum, every later candidate does too, so the loop can `break` instead of `continue`. This prunes a whole suffix of the search at once.',
      algorithm: ['1. Sort `candidates`.','2. `dfs(start, remaining)`: if `remaining == 0`, record a copy. For `i` from `start`, if `candidates[i] > remaining`, `break`. Otherwise append, recurse with `(i, remaining - candidates[i])`, and remove.'],
      code: "import java.util.ArrayList;\nimport java.util.Arrays;\nimport java.util.List;\n\nclass Solution {\n    public List<List<Integer>> combinationSum(int[] candidates, int target) {\n        Arrays.sort(candidates);\n        List<List<Integer>> result = new ArrayList<>();\n        dfs(candidates, 0, target, new ArrayList<>(), result);\n        return result;\n    }\n\n    private void dfs(int[] c, int start, int remaining, List<Integer> path, List<List<Integer>> result) {\n        if (remaining == 0) {\n            result.add(new ArrayList<>(path));\n            return;\n        }\n        for (int i = start; i < c.length; i++) {\n            if (c[i] > remaining) break;\n            path.add(c[i]);\n            dfs(c, i, remaining - c[i], path, result);\n            path.remove(path.size() - 1);\n        }\n    }\n}",
      complexity: { time: 'Exponential in the worst case, with pruning that cuts whole branches', space: 'O(\\text{target})' }
    }
  ]
  },
  {
    slug: 'combination-sum-ii',
    title: 'Combination Sum II',
    difficulty: 'Medium',
    description: 'Given a collection of candidate numbers `candidates` (which may contain duplicates) and a target number `target`, return all unique combinations where the candidate numbers sum to `target`. Each number may be used at most once in a combination. The solution set must not contain duplicate combinations.',
    examples: [
    {
      input: 'candidates = [2,5,2,1,2]',
      output: '[[1,2,2],[5]]',
      explanation: ''
    }
  ],
    constraints: '`1 <= candidates.length <= 100` - `1 <= candidates[i] <= 50` - `1 <= target <= 30`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Each element is included or excluded, giving all subsets. Keep the subsets summing to the target, and deduplicate by sorting and inserting into a set. This is exponential in `n`, so it only suits small inputs.',
      algorithm: ['1. `gen(i, path, sum)`: if `sum == target`, store the sorted copy of `path`. If `i == n` or `sum > target`, return.','2. Recurse with `path` excluding `c[i]`, then including it.'],
      code: "import java.util.ArrayList;\nimport java.util.Collections;\nimport java.util.HashSet;\nimport java.util.List;\nimport java.util.Set;\n\nclass Solution {\n    public List<List<Integer>> combinationSum2(int[] candidates, int target) {\n        Set<List<Integer>> found = new HashSet<>();\n        gen(candidates, target, 0, 0, new ArrayList<>(), found);\n        return new ArrayList<>(found);\n    }\n\n    private void gen(int[] c, int target, int i, int sum, List<Integer> path, Set<List<Integer>> found) {\n        if (sum == target) {\n            List<Integer> key = new ArrayList<>(path);\n            Collections.sort(key);\n            found.add(key);\n            return;\n        }\n        if (i == c.length || sum > target) return;\n        gen(c, target, i + 1, sum, path, found);\n        path.add(c[i]);\n        gen(c, target, i + 1, sum + c[i], path, found);\n        path.remove(path.size() - 1);\n    }\n}",
      complexity: { time: 'O(2^n \\cdot n)', space: 'O(2^n)' }
    },
    {
      label: 'Better',
      intuition: 'Use a start index that advances after each choice, so each element is used at most once. Duplicate combinations can still arise from equal values, so store results in a set to remove them.',
      algorithm: ['1. `dfs(start, remaining)`: if `remaining == 0`, add a sorted copy of `path` to the set.','2. For `i` from `start`, if `c[i] <= remaining`, append, recurse with `(i + 1, remaining - c[i])`, and remove.'],
      code: "import java.util.ArrayList;\nimport java.util.Collections;\nimport java.util.HashSet;\nimport java.util.List;\nimport java.util.Set;\n\nclass Solution {\n    public List<List<Integer>> combinationSum2(int[] candidates, int target) {\n        Set<List<Integer>> found = new HashSet<>();\n        dfs(candidates, 0, target, new ArrayList<>(), found);\n        return new ArrayList<>(found);\n    }\n\n    private void dfs(int[] c, int start, int remaining, List<Integer> path, Set<List<Integer>> found) {\n        if (remaining == 0) {\n            List<Integer> key = new ArrayList<>(path);\n            Collections.sort(key);\n            found.add(key);\n            return;\n        }\n        for (int i = start; i < c.length; i++) {\n            if (c[i] > remaining) continue;\n            path.add(c[i]);\n            dfs(c, i + 1, remaining - c[i], path, found);\n            path.remove(path.size() - 1);\n        }\n    }\n}",
      complexity: { time: 'Exponential in the worst case, with set overhead', space: 'O(\\text{target})' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Sort the candidates so equal values are adjacent. Within one loop, if `c[i]` equals `c[i-1]` and `i > start`, skip it. The earlier copy already explored every combination that would start with that value at this depth. Sorting also allows an early break once a candidate exceeds the remaining sum. No set is needed, because duplicates are never generated.',
      algorithm: ['1. Sort `candidates`.','2. `dfs(start, remaining)`: if `remaining == 0`, record a copy of the path.','3. For `i` from `start`:','- If `c[i] > remaining`, `break`.','- If `i > start` and `c[i] == c[i-1]`, `continue`.','- Append `c[i]`, recurse with `i + 1`, and remove.'],
      code: "import java.util.ArrayList;\nimport java.util.Arrays;\nimport java.util.List;\n\nclass Solution {\n    public List<List<Integer>> combinationSum2(int[] candidates, int target) {\n        Arrays.sort(candidates);\n        List<List<Integer>> result = new ArrayList<>();\n        dfs(candidates, 0, target, new ArrayList<>(), result);\n        return result;\n    }\n\n    private void dfs(int[] c, int start, int remaining, List<Integer> path, List<List<Integer>> result) {\n        if (remaining == 0) {\n            result.add(new ArrayList<>(path));\n            return;\n        }\n        for (int i = start; i < c.length; i++) {\n            if (c[i] > remaining) break;\n            if (i > start && c[i] == c[i - 1]) continue;\n            path.add(c[i]);\n            dfs(c, i + 1, remaining - c[i], path, result);\n            path.remove(path.size() - 1);\n        }\n    }\n}",
      complexity: { time: 'Exponential in the worst case, with pruning', space: 'O(\\text{target})' }
    }
  ]
  },
  {
    slug: 'permutations',
    title: 'Permutations',
    difficulty: 'Medium',
    description: 'Given an array `nums` of distinct integers, return all the possible permutations. You may return the answer in any order.',
    examples: [
    {
      input: 'nums = [0,1]',
      output: '[[0,1],[1,0]]',
      explanation: ''
    }
  ],
    constraints: '`1 <= nums.length <= 6` - `-10 <= nums[i] <= 10` - All integers are unique.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Generate every sequence of length `n` drawn from `nums`, including repeats, then keep the ones with all distinct values.',
      algorithm: ['1. `gen(path)`: when `path` has length `n`, check that all values are distinct, and if so, record a copy.','2. Otherwise, try each element and recurse.'],
      code: "import java.util.ArrayList;\nimport java.util.HashSet;\nimport java.util.List;\nimport java.util.Set;\n\nclass Solution {\n    public List<List<Integer>> permute(int[] nums) {\n        List<List<Integer>> result = new ArrayList<>();\n        gen(nums, new ArrayList<>(), result);\n        return result;\n    }\n\n    private void gen(int[] nums, List<Integer> path, List<List<Integer>> result) {\n        if (path.size() == nums.length) {\n            if (new HashSet<>(path).size() == nums.length) {\n                result.add(new ArrayList<>(path));\n            }\n            return;\n        }\n        for (int x : nums) {\n            path.add(x);\n            gen(nums, path, result);\n            path.remove(path.size() - 1);\n        }\n    }\n}",
      complexity: { time: 'O(n^n \\cdot n)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: 'Track which elements are already in the current path with a boolean array. Only unused elements are considered at each position, so every branch leads to a valid permutation.',
      algorithm: ['1. `dfs(path)`: if the path is full, record a copy.','2. For each index `i` not marked used: mark it, append `nums[i]`, recurse, then unmark and remove.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public List<List<Integer>> permute(int[] nums) {\n        List<List<Integer>> result = new ArrayList<>();\n        dfs(nums, new boolean[nums.length], new ArrayList<>(), result);\n        return result;\n    }\n\n    private void dfs(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> result) {\n        if (path.size() == nums.length) {\n            result.add(new ArrayList<>(path));\n            return;\n        }\n        for (int i = 0; i < nums.length; i++) {\n            if (used[i]) continue;\n            used[i] = true;\n            path.add(nums[i]);\n            dfs(nums, used, path, result);\n            path.remove(path.size() - 1);\n            used[i] = false;\n        }\n    }\n}",
      complexity: { time: 'O(n \\cdot n!)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Permute the array in place. At position `first`, try swapping each element from `first` onward into that position, recurse on the next position, then swap back. The prefix `[0, first)` is fixed, and the suffix holds the remaining elements, so no used array or path list is needed.',
      algorithm: ['1. `dfs(first)`: if `first == n`, record a copy of `nums`.','2. For `i` from `first` to `n-1`: swap `nums[first]` and `nums[i]`, recurse with `first + 1`, then swap back.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public List<List<Integer>> permute(int[] nums) {\n        List<List<Integer>> result = new ArrayList<>();\n        dfs(nums, 0, result);\n        return result;\n    }\n\n    private void dfs(int[] nums, int first, List<List<Integer>> result) {\n        if (first == nums.length) {\n            List<Integer> perm = new ArrayList<>();\n            for (int x : nums) perm.add(x);\n            result.add(perm);\n            return;\n        }\n        for (int i = first; i < nums.length; i++) {\n            swap(nums, first, i);\n            dfs(nums, first + 1, result);\n            swap(nums, first, i);\n        }\n    }\n\n    private void swap(int[] a, int i, int j) {\n        int t = a[i];\n        a[i] = a[j];\n        a[j] = t;\n    }\n}",
      complexity: { time: 'O(n \\cdot n!)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'subsets-ii',
    title: 'Subsets II',
    difficulty: 'Medium',
    description: 'Given an integer array `nums` that may contain duplicates, return all possible subsets (the power set). The solution must not contain duplicate subsets. Return the solution in any order.',
    examples: [
    {
      input: 'nums = [0]',
      output: '[[],[0]]',
      explanation: ''
    }
  ],
    constraints: '`1 <= nums.length <= 10` - `-10 <= nums[i] <= 10`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Enumerate all $2^n$ subsets, sort each, and deduplicate with a set.',
      algorithm: ['1. For each mask, build the subset, sort it, and insert it into a set.','2. Return the set\'s contents.'],
      code: "import java.util.ArrayList;\nimport java.util.Arrays;\nimport java.util.HashSet;\nimport java.util.List;\nimport java.util.Set;\n\nclass Solution {\n    public List<List<Integer>> subsetsWithDup(int[] nums) {\n        int n = nums.length;\n        Set<List<Integer>> found = new HashSet<>();\n        for (int mask = 0; mask < (1 << n); mask++) {\n            List<Integer> subset = new ArrayList<>();\n            for (int i = 0; i < n; i++) {\n                if (((mask >> i) & 1) == 1) subset.add(nums[i]);\n            }\n            subset.sort(null);\n            found.add(subset);\n        }\n        return new ArrayList<>(found);\n    }\n}",
      complexity: { time: 'O(n \\cdot 2^n \\cdot \\log n)', space: 'O(n \\cdot 2^n)' }
    },
    {
      label: 'Better',
      intuition: 'Run the standard subset backtracking, which can generate the same subset via different indices when values repeat. Store results in a set to remove those duplicates.',
      algorithm: ['1. `dfs(start, path)`: add a sorted copy of `path` to the set.','2. For `i` from `start`, append `nums[i]`, recurse with `i + 1`, and remove.'],
      code: "import java.util.ArrayList;\nimport java.util.Arrays;\nimport java.util.HashSet;\nimport java.util.List;\nimport java.util.Set;\n\nclass Solution {\n    public List<List<Integer>> subsetsWithDup(int[] nums) {\n        Set<List<Integer>> found = new HashSet<>();\n        dfs(nums, 0, new ArrayList<>(), found);\n        return new ArrayList<>(found);\n    }\n\n    private void dfs(int[] nums, int start, List<Integer> path, Set<List<Integer>> found) {\n        List<Integer> key = new ArrayList<>(path);\n        key.sort(null);\n        found.add(key);\n        for (int i = start; i < nums.length; i++) {\n            path.add(nums[i]);\n            dfs(nums, i + 1, path, found);\n            path.remove(path.size() - 1);\n        }\n    }\n}",
      complexity: { time: 'O(n \\cdot 2^n \\cdot \\log n)', space: 'O(n \\cdot 2^n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Sort first. In the loop at each depth, skip `nums[i]` when `i > start` and `nums[i] == nums[i-1]`. The earlier sibling already produced every subset that begins with this value at this depth. No set is needed, and each subset is generated exactly once.',
      algorithm: ['1. Sort `nums`.','2. `dfs(start, path)`: record a copy of `path`.','3. For `i` from `start`: if `i > start` and `nums[i] == nums[i-1]`, `continue`. Otherwise append, recurse with `i + 1`, and remove.'],
      code: "import java.util.ArrayList;\nimport java.util.Arrays;\nimport java.util.List;\n\nclass Solution {\n    public List<List<Integer>> subsetsWithDup(int[] nums) {\n        Arrays.sort(nums);\n        List<List<Integer>> result = new ArrayList<>();\n        dfs(nums, 0, new ArrayList<>(), result);\n        return result;\n    }\n\n    private void dfs(int[] nums, int start, List<Integer> path, List<List<Integer>> result) {\n        result.add(new ArrayList<>(path));\n        for (int i = start; i < nums.length; i++) {\n            if (i > start && nums[i] == nums[i - 1]) continue;\n            path.add(nums[i]);\n            dfs(nums, i + 1, path, result);\n            path.remove(path.size() - 1);\n        }\n    }\n}",
      complexity: { time: 'O(n \\cdot 2^n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'word-search',
    title: 'Word Search',
    difficulty: 'Medium',
    description: 'Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighbouring. The same cell may not be used more than once.',
    examples: [
    {
      input: 'Same board, `word = "ABCB"',
      output: 'false',
      explanation: ''
    }
  ],
    constraints: '`1 <= m, n <= 6` - `1 <= word.length <= 15` - `board` and `word` consist of uppercase and lowercase English letters.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Track the cells on the current path in a `HashSet` of coordinates. Each recursive call receives a fresh copy of the set, so no undo step is needed. Simple, but it copies state on every move.',
      algorithm: ['1. For every start cell, call `dfs(r, c, 0, new HashSet<>())`.','2. `dfs`: if `idx == len`, return `true`. If out of bounds, mismatched, or visited, return `false`.','3. Otherwise copy the visited set, add the cell, and recurse into the four neighbours with `idx + 1`.'],
      code: "import java.util.HashSet;\nimport java.util.Set;\n\nclass Solution {\n    private static final int[][] DIRS = {{1,0},{-1,0},{0,1},{0,-1}};\n\n    public boolean exist(char[][] board, String word) {\n        for (int r = 0; r < board.length; r++) {\n            for (int c = 0; c < board[0].length; c++) {\n                if (dfs(board, r, c, word, 0, new HashSet<>())) return true;\n            }\n        }\n        return false;\n    }\n\n    private boolean dfs(char[][] b, int r, int c, String word, int idx, Set<String> visited) {\n        if (idx == word.length()) return true;\n        if (r < 0 || c < 0 || r >= b.length || c >= b[0].length) return false;\n        String key = r + \",\" + c;\n        if (visited.contains(key) || b[r][c] != word.charAt(idx)) return false;\n        Set<String> next = new HashSet<>(visited);\n        next.add(key);\n        for (int[] d : DIRS) {\n            if (dfs(b, r + d[0], c + d[1], word, idx + 1, next)) return true;\n        }\n        return false;\n    }\n}",
      complexity: { time: 'O(m \\cdot n \\cdot 4^L)', space: 'O(L^2)' }
    },
    {
      label: 'Better',
      intuition: 'Replace the set with a boolean grid. Mark the cell before exploring, and unmark it after. Each cell is marked once per path, and the grid is restored exactly on return.',
      algorithm: ['1. For every start cell, run `dfs`.','2. `dfs`: check bounds, match, and not visited. If `idx` is the last character, return `true`.','3. Mark, explore the four neighbours, then unmark.'],
      code: "class Solution {\n    private static final int[][] DIRS = {{1,0},{-1,0},{0,1},{0,-1}};\n\n    public boolean exist(char[][] board, String word) {\n        boolean[][] visited = new boolean[board.length][board[0].length];\n        for (int r = 0; r < board.length; r++) {\n            for (int c = 0; c < board[0].length; c++) {\n                if (dfs(board, visited, r, c, word, 0)) return true;\n            }\n        }\n        return false;\n    }\n\n    private boolean dfs(char[][] b, boolean[][] vis, int r, int c, String word, int idx) {\n        if (r < 0 || c < 0 || r >= b.length || c >= b[0].length) return false;\n        if (vis[r][c] || b[r][c] != word.charAt(idx)) return false;\n        if (idx == word.length() - 1) return true;\n        vis[r][c] = true;\n        for (int[] d : DIRS) {\n            if (dfs(b, vis, r + d[0], c + d[1], word, idx + 1)) {\n                vis[r][c] = false;\n                return true;\n            }\n        }\n        vis[r][c] = false;\n        return false;\n    }\n}",
      complexity: { time: 'O(m \\cdot n \\cdot 4^L)', space: 'O(m \\cdot n + L)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'The board is ours to modify temporarily. Overwrite a visited cell with a sentinel character such as `#` while exploring, then restore it on return. This removes the separate visited array, so each cell check is a single comparison.',
      algorithm: ['1. For every start cell, run `dfs`.','2. `dfs`: return `false` if out of bounds or the cell does not match. If `idx` is the last character, return `true`.','3. Save `ch = board[r][c]`, set `board[r][c] = \'#\'`, explore the four neighbours, and restore `board[r][c] = ch`.'],
      code: "class Solution {\n    private static final int[][] DIRS = {{1,0},{-1,0},{0,1},{0,-1}};\n\n    public boolean exist(char[][] board, String word) {\n        for (int r = 0; r < board.length; r++) {\n            for (int c = 0; c < board[0].length; c++) {\n                if (dfs(board, r, c, word, 0)) return true;\n            }\n        }\n        return false;\n    }\n\n    private boolean dfs(char[][] b, int r, int c, String word, int idx) {\n        if (r < 0 || c < 0 || r >= b.length || c >= b[0].length) return false;\n        if (b[r][c] != word.charAt(idx)) return false;\n        if (idx == word.length() - 1) return true;\n        char saved = b[r][c];\n        b[r][c] = '#';\n        for (int[] d : DIRS) {\n            if (dfs(b, r + d[0], c + d[1], word, idx + 1)) {\n                b[r][c] = saved;\n                return true;\n            }\n        }\n        b[r][c] = saved;\n        return false;\n    }\n}",
      complexity: { time: 'O(m \\cdot n \\cdot 4^L)', space: 'O(L)' }
    }
  ]
  },
  {
    slug: 'palindrome-partitioning',
    title: 'Palindrome Partitioning',
    difficulty: 'Medium',
    description: 'Given a string `s`, partition `s` such that every substring of the partition is a palindrome. Return all possible palindrome partitionings of `s`.',
    examples: [
    {
      input: 's = "a"',
      output: '[["a"]]',
      explanation: ''
    }
  ],
    constraints: '`1 <= s.length <= 16` - `s` contains only lowercase English letters.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'With `n - 1` gaps between characters, there are $2^{n-1}$ ways to place cuts. For each cut set, split the string and check that every piece is a palindrome.',
      algorithm: ['1. For each bitmask over the `n - 1` gaps, bit `i` set means a cut after index `i`.','2. Split accordingly, and keep the partition if every piece is a palindrome.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public List<List<String>> partition(String s) {\n        int n = s.length();\n        List<List<String>> result = new ArrayList<>();\n        for (int mask = 0; mask < (1 << (n - 1)); mask++) {\n            List<String> parts = new ArrayList<>();\n            int start = 0;\n            boolean valid = true;\n            for (int i = 0; i < n; i++) {\n                boolean cutHere = (i == n - 1) || ((mask >> i) & 1) == 1;\n                if (cutHere) {\n                    String piece = s.substring(start, i + 1);\n                    if (!isPal(piece)) {\n                        valid = false;\n                        break;\n                    }\n                    parts.add(piece);\n                    start = i + 1;\n                }\n            }\n            if (valid) result.add(parts);\n        }\n        return result;\n    }\n\n    private boolean isPal(String t) {\n        int l = 0, r = t.length() - 1;\n        while (l < r) {\n            if (t.charAt(l++) != t.charAt(r--)) return false;\n        }\n        return true;\n    }\n}",
      complexity: { time: 'O(2^n \\cdot n^2)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: 'Build partitions recursively. From a starting index, try every end index such that `s[start..end]` is a palindrome, recording that piece and recursing from `end + 1`. Palindrome checks are done on demand.',
      algorithm: ['1. `dfs(start)`: if `start == n`, record a copy of the current parts.','2. For `end` from `start` to `n-1`: if `s[start..end]` is a palindrome, append it, recurse with `end + 1`, and remove.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public List<List<String>> partition(String s) {\n        List<List<String>> result = new ArrayList<>();\n        dfs(s, 0, new ArrayList<>(), result);\n        return result;\n    }\n\n    private void dfs(String s, int start, List<String> parts, List<List<String>> result) {\n        if (start == s.length()) {\n            result.add(new ArrayList<>(parts));\n            return;\n        }\n        for (int end = start; end < s.length(); end++) {\n            if (isPal(s, start, end)) {\n                parts.add(s.substring(start, end + 1));\n                dfs(s, end + 1, parts, result);\n                parts.remove(parts.size() - 1);\n            }\n        }\n    }\n\n    private boolean isPal(String s, int l, int r) {\n        while (l < r) {\n            if (s.charAt(l++) != s.charAt(r--)) return false;\n        }\n        return true;\n    }\n}",
      complexity: { time: 'O(n \\cdot 2^n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'A substring `s[i..j]` is a palindrome when `s[i] == s[j]` and `s[i+1..j-1]` is a palindrome. Fill a table `isPal[i][j]` in increasing order of length. Backtracking then checks each piece in $O(1)$.',
      algorithm: ['1. For `j` from `0` to `n-1`, and `i` from `0` to `j`: `isPal[i][j] = s[i] == s[j] && (j - i < 2 || isPal[i+1][j-1])`.','2. `dfs(start)`: as in Approach 2, but test `isPal[start][end]` instead of recomputing.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    private boolean[][] isPal;\n\n    public List<List<String>> partition(String s) {\n        int n = s.length();\n        isPal = new boolean[n][n];\n        for (int j = 0; j < n; j++) {\n            for (int i = 0; i <= j; i++) {\n                isPal[i][j] = s.charAt(i) == s.charAt(j) && (j - i < 2 || isPal[i + 1][j - 1]);\n            }\n        }\n        List<List<String>> result = new ArrayList<>();\n        dfs(s, 0, new ArrayList<>(), result);\n        return result;\n    }\n\n    private void dfs(String s, int start, List<String> parts, List<List<String>> result) {\n        if (start == s.length()) {\n            result.add(new ArrayList<>(parts));\n            return;\n        }\n        for (int end = start; end < s.length(); end++) {\n            if (isPal[start][end]) {\n                parts.add(s.substring(start, end + 1));\n                dfs(s, end + 1, parts, result);\n                parts.remove(parts.size() - 1);\n            }\n        }\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(n^2)' }
    }
  ]
  },
  {
    slug: 'letter-combinations-of-a-phone-number',
    title: 'Letter Combinations of a Phone Number',
    difficulty: 'Medium',
    description: 'Given a string `digits` containing digits from `2` to `9`, return all possible letter combinations that the number could represent, using the standard telephone keypad mapping. Return the answer in any order. If `digits` is empty, return an empty list. The mapping is `2: abc`, `3: def`, `4: ghi`, `5: jkl`, `6: mno`, `7: pqrs`, `8: tuv`, `9: wxyz`.',
    examples: [
    {
      input: 'digits = ""',
      output: '[]',
      explanation: ''
    }
  ],
    constraints: '`0 <= digits.length <= 4` - `digits[i]` is in the range `[\'2\', \'9\']`.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Each combination corresponds to an index from `0` to `total - 1`, where `total` is the product of the letter counts. Decode the index by taking remainders and divisions, one digit at a time, from the last digit to the first.',
      algorithm: ['1. If `digits` is empty, return an empty list.','2. Compute `total`, the product of letter counts.','3. For each `idx` in `[0, total)`, decode one letter per digit from the end, using `letters.charAt(idx % len)` and then `idx /= len`.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    private static final String[] MAP = {\"\", \"\", \"abc\", \"def\", \"ghi\", \"jkl\", \"mno\", \"pqrs\", \"tuv\", \"wxyz\"};\n\n    public List<String> letterCombinations(String digits) {\n        List<String> result = new ArrayList<>();\n        int n = digits.length();\n        if (n == 0) return result;\n        int total = 1;\n        for (char d : digits.toCharArray()) total *= MAP[d - '0'].length();\n        for (int idx = 0; idx < total; idx++) {\n            char[] buf = new char[n];\n            int x = idx;\n            for (int pos = n - 1; pos >= 0; pos--) {\n                String letters = MAP[digits.charAt(pos) - '0'];\n                buf[pos] = letters.charAt(x % letters.length());\n                x /= letters.length();\n            }\n            result.add(new String(buf));\n        }\n        return result;\n    }\n}",
      complexity: { time: 'O(n \\cdot 4^n)', space: 'O(n \\cdot 4^n)' }
    },
    {
      label: 'Better',
      intuition: 'Start with `[""]`. For each digit, replace every partial combination with one extended copy per letter of that digit. After the last digit, the list is complete.',
      algorithm: ['1. `result = [""]`.','2. For each digit `d` (if the digit has letters): build `next` by appending each letter to each element of `result`. Replace `result` with `next`.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    private static final String[] MAP = {\"\", \"\", \"abc\", \"def\", \"ghi\", \"jkl\", \"mno\", \"pqrs\", \"tuv\", \"wxyz\"};\n\n    public List<String> letterCombinations(String digits) {\n        List<String> result = new ArrayList<>();\n        if (digits.isEmpty()) return result;\n        result.add(\"\");\n        for (char d : digits.toCharArray()) {\n            List<String> next = new ArrayList<>();\n            for (String prefix : result) {\n                for (char ch : MAP[d - '0'].toCharArray()) {\n                    next.add(prefix + ch);\n                }\n            }\n            result = next;\n        }\n        return result;\n    }\n}",
      complexity: { time: 'O(n \\cdot 4^n)', space: 'O(n \\cdot 4^n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Recurse through the digits. At each level, try every letter for the current digit, append it, recurse to the next digit, and remove it. A single `StringBuilder` is reused, so no intermediate lists are built.',
      algorithm: ['1. `dfs(i, sb)`: if `i == n`, record `sb.toString()`.','2. Otherwise, for each letter of `digits[i]`: append, recurse with `i + 1`, and delete the last character.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    private static final String[] MAP = {\"\", \"\", \"abc\", \"def\", \"ghi\", \"jkl\", \"mno\", \"pqrs\", \"tuv\", \"wxyz\"};\n\n    public List<String> letterCombinations(String digits) {\n        List<String> result = new ArrayList<>();\n        if (digits.isEmpty()) return result;\n        dfs(digits, 0, new StringBuilder(), result);\n        return result;\n    }\n\n    private void dfs(String digits, int i, StringBuilder sb, List<String> result) {\n        if (i == digits.length()) {\n            result.add(sb.toString());\n            return;\n        }\n        for (char ch : MAP[digits.charAt(i) - '0'].toCharArray()) {\n            sb.append(ch);\n            dfs(digits, i + 1, sb, result);\n            sb.deleteCharAt(sb.length() - 1);\n        }\n    }\n}",
      complexity: { time: 'O(n \\cdot 4^n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'n-queens',
    title: 'N-Queens',
    difficulty: 'Hard',
    description: 'The `n`-queens puzzle is the problem of placing `n` queens on an `n x n` chessboard so that no two queens attack each other. Given an integer `n`, return all distinct solutions to the `n`-queens puzzle. Each solution is a board layout where `\'Q\'` marks a queen and `\'.\'` marks an empty square.',
    examples: [
    {
      input: 'n = 1',
      output: '[["Q"]]',
      explanation: ''
    }
  ],
    constraints: '`1 <= n <= 9`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'A valid solution must use each column exactly once, because one queen per row and one per column are both required. So enumerate all $n!$ column permutations, and reject those where any two queens share a diagonal.',
      algorithm: ['1. Generate permutations `perm` where `perm[r]` is the column of the queen in row `r`.','2. For each permutation, check every pair of rows `(i, j)` for `|i - j| == |perm[i] - perm[j]|`. If none conflict, build the board.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public List<List<String>> solveNQueens(int n) {\n        List<List<String>> result = new ArrayList<>();\n        int[] perm = new int[n];\n        boolean[] usedCol = new boolean[n];\n        gen(0, n, perm, usedCol, result);\n        return result;\n    }\n\n    private void gen(int row, int n, int[] perm, boolean[] usedCol, List<List<String>> result) {\n        if (row == n) {\n            if (valid(perm, n)) result.add(build(perm, n));\n            return;\n        }\n        for (int c = 0; c < n; c++) {\n            if (usedCol[c]) continue;\n            usedCol[c] = true;\n            perm[row] = c;\n            gen(row + 1, n, perm, usedCol, result);\n            usedCol[c] = false;\n        }\n    }\n\n    private boolean valid(int[] perm, int n) {\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                if (Math.abs(i - j) == Math.abs(perm[i] - perm[j])) return false;\n            }\n        }\n        return true;\n    }\n\n    private List<String> build(int[] perm, int n) {\n        List<String> board = new ArrayList<>();\n        for (int r = 0; r < n; r++) {\n            char[] row = new char[n];\n            java.util.Arrays.fill(row, '.');\n            row[perm[r]] = 'Q';\n            board.add(new String(row));\n        }\n        return board;\n    }\n}",
      complexity: { time: 'O(n! \\cdot n^2)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: 'Place queens row by row on a character board. Before placing a queen at `(r, c)`, scan the column above and both upward diagonals for an existing queen. Prune early instead of waiting for a full permutation.',
      algorithm: ['1. `solve(r)`: if `r == n`, record the board.','2. For each column `c`, if `isSafe(r, c)`, place `\'Q\'`, recurse with `r + 1`, and reset to `\'.\'`.','3. `isSafe` scans upward in column `c`, and the up-left and up-right diagonals.'],
      code: "import java.util.ArrayList;\nimport java.util.Arrays;\nimport java.util.List;\n\nclass Solution {\n    private char[][] board;\n    private List<List<String>> result;\n\n    public List<List<String>> solveNQueens(int n) {\n        board = new char[n][n];\n        for (char[] row : board) Arrays.fill(row, '.');\n        result = new ArrayList<>();\n        solve(0);\n        return result;\n    }\n\n    private void solve(int r) {\n        int n = board.length;\n        if (r == n) {\n            List<String> snapshot = new ArrayList<>();\n            for (char[] row : board) snapshot.add(new String(row));\n            result.add(snapshot);\n            return;\n        }\n        for (int c = 0; c < n; c++) {\n            if (isSafe(r, c)) {\n                board[r][c] = 'Q';\n                solve(r + 1);\n                board[r][c] = '.';\n            }\n        }\n    }\n\n    private boolean isSafe(int r, int c) {\n        for (int i = 0; i < r; i++) {\n            if (board[i][c] == 'Q') return false;\n        }\n        for (int i = r - 1, j = c - 1; i >= 0 && j >= 0; i--, j--) {\n            if (board[i][j] == 'Q') return false;\n        }\n        for (int i = r - 1, j = c + 1; i >= 0 && j < board.length; i--, j++) {\n            if (board[i][j] == 'Q') return false;\n        }\n        return true;\n    }\n}",
      complexity: { time: 'O(n!)', space: 'O(n^2)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Keep three boolean arrays: `cols[c]`, `diag1[r + c]` for anti-diagonals, and `diag2[r - c + n - 1]` for diagonals. A square is safe when all three are free, which takes $O(1)$. Marking and unmarking are constant time, so the search does no scanning.',
      algorithm: ['1. `solve(r)`: if `r == n`, build the board from the `queenCol` array and record it.','2. For each column `c`, if `!cols[c] && !d1[r+c] && !d2[r-c+n-1]`:','- Set `queenCol[r] = c`, mark all three arrays.','- Recurse with `r + 1`, then unmark.'],
      code: "import java.util.ArrayList;\nimport java.util.Arrays;\nimport java.util.List;\n\nclass Solution {\n    private int n;\n    private boolean[] cols, d1, d2;\n    private int[] queenCol;\n    private List<List<String>> result;\n\n    public List<List<String>> solveNQueens(int n) {\n        this.n = n;\n        cols = new boolean[n];\n        d1 = new boolean[2 * n];\n        d2 = new boolean[2 * n];\n        queenCol = new int[n];\n        result = new ArrayList<>();\n        solve(0);\n        return result;\n    }\n\n    private void solve(int r) {\n        if (r == n) {\n            List<String> board = new ArrayList<>();\n            for (int i = 0; i < n; i++) {\n                char[] row = new char[n];\n                Arrays.fill(row, '.');\n                row[queenCol[i]] = 'Q';\n                board.add(new String(row));\n            }\n            result.add(board);\n            return;\n        }\n        for (int c = 0; c < n; c++) {\n            if (cols[c] || d1[r + c] || d2[r - c + n - 1]) continue;\n            cols[c] = d1[r + c] = d2[r - c + n - 1] = true;\n            queenCol[r] = c;\n            solve(r + 1);\n            cols[c] = d1[r + c] = d2[r - c + n - 1] = false;\n        }\n    }\n}",
      complexity: { time: 'O(n!)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'implement-trie-prefix-tree',
    title: 'Implement Trie (Prefix Tree)',
    difficulty: 'Medium',
    description: 'Implement a Trie (prefix tree) with these operations: - `Trie()` initialises the object. - `void insert(String word)` inserts `word` into the trie. - `boolean search(String word)` returns `true` if `word` was inserted, and `false` otherwise. - `boolean startsWith(String prefix)` returns `true` if some inserted word starts with `prefix`.',
    examples: [],
    constraints: '`1 <= word.length, prefix.length <= 2000` - `word` and `prefix` consist of lowercase English letters. - At most `3 * 10^4` calls in total.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Store the words in a list. `search` checks equality, and `startsWith` scans every word for the prefix.',
      algorithm: ['1. `insert` appends the word.','2. `search` checks whether the list contains the word.','3. `startsWith` returns `true` if any word starts with the prefix.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Trie {\n    private final List<String> words = new ArrayList<>();\n\n    public void insert(String word) {\n        words.add(word);\n    }\n\n    public boolean search(String word) {\n        return words.contains(word);\n    }\n\n    public boolean startsWith(String prefix) {\n        for (String w : words) {\n            if (w.startsWith(prefix)) return true;\n        }\n        return false;\n    }\n}",
      complexity: { time: '`insert` is O(1), `search` and `startsWith` are O(N \\cdot L)', space: 'O(N \\cdot L)' }
    },
    {
      label: 'Better',
      intuition: 'Precompute every prefix at insertion time and store it in a set. Then `startsWith` is one lookup. The cost is memory, because each word of length `L` adds `L` prefix strings.',
      algorithm: ['1. `insert(word)`: add `word` to `words`, and every prefix `word[0..i]` to `prefixes`.','2. `search(word)`: return `words.contains(word)`.','3. `startsWith(prefix)`: return `prefixes.contains(prefix)`.'],
      code: "import java.util.HashSet;\nimport java.util.Set;\n\nclass Trie {\n    private final Set<String> words = new HashSet<>();\n    private final Set<String> prefixes = new HashSet<>();\n\n    public void insert(String word) {\n        words.add(word);\n        for (int i = 1; i <= word.length(); i++) {\n            prefixes.add(word.substring(0, i));\n        }\n    }\n\n    public boolean search(String word) {\n        return words.contains(word);\n    }\n\n    public boolean startsWith(String prefix) {\n        return prefixes.contains(prefix);\n    }\n}",
      complexity: { time: '`insert` is O(L^2) for substring building, `search` and `startsWith` are O(L) for hashing', space: 'O(N \\cdot L^2)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Build the actual tree. Each node has up to 26 children, indexed by letter, and a flag marking the end of a word. Insertion and lookup each walk the characters once, sharing storage across common prefixes.',
      algorithm: ['1. `insert`: from the root, for each character, create the child if missing and descend. Set `isEnd` at the last node.','2. `search`: descend; return `isEnd` of the final node, or `false` if a child is missing.','3. `startsWith`: descend; return `true` if the path exists.'],
      code: "class Trie {\n    private static class Node {\n        Node[] children = new Node[26];\n        boolean isEnd;\n    }\n\n    private final Node root = new Node();\n\n    public void insert(String word) {\n        Node cur = root;\n        for (char ch : word.toCharArray()) {\n            int i = ch - 'a';\n            if (cur.children[i] == null) cur.children[i] = new Node();\n            cur = cur.children[i];\n        }\n        cur.isEnd = true;\n    }\n\n    public boolean search(String word) {\n        Node node = find(word);\n        return node != null && node.isEnd;\n    }\n\n    public boolean startsWith(String prefix) {\n        return find(prefix) != null;\n    }\n\n    private Node find(String s) {\n        Node cur = root;\n        for (char ch : s.toCharArray()) {\n            cur = cur.children[ch - 'a'];\n            if (cur == null) return null;\n        }\n        return cur;\n    }\n}",
      complexity: { time: 'O(L)', space: 'O(N \\cdot L \\cdot 26)' }
    }
  ]
  },
  {
    slug: 'design-add-and-search-words-data-structure',
    title: 'Design Add and Search Words Data Structure',
    difficulty: 'Medium',
    description: 'Design a data structure that supports adding words and searching for words, where `.` in the search string matches any single letter. Implement the `WordDictionary` class: - `WordDictionary()` initialises the object. - `void addWord(String word)` adds `word` to the data structure. - `boolean search(String word)` returns `true` if there is any added word that matches `word`, where `.` matches any letter.',
    examples: [],
    constraints: '`1 <= word.length <= 25` - `word` in `addWord` consists of lowercase English letters. - `word` in `search` consists of `\'.\'` or lowercase English letters. - At most `10^4` calls to `addWord` and `search`.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Store words in a list. For each query, test every word for equal length and character-by-character match, treating `.` as a wildcard.',
      algorithm: ['1. `addWord` appends.','2. `search` iterates through words, skipping those with a different length, and returns `true` on the first match.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass WordDictionary {\n    private final List<String> words = new ArrayList<>();\n\n    public void addWord(String word) {\n        words.add(word);\n    }\n\n    public boolean search(String pattern) {\n        for (String w : words) {\n            if (w.length() == pattern.length() && matches(w, pattern)) return true;\n        }\n        return false;\n    }\n\n    private boolean matches(String w, String p) {\n        for (int i = 0; i < p.length(); i++) {\n            if (p.charAt(i) != '.' && p.charAt(i) != w.charAt(i)) return false;\n        }\n        return true;\n    }\n}",
      complexity: { time: '`search` is O(N \\cdot L)', space: 'O(N \\cdot L)' }
    },
    {
      label: 'Better',
      intuition: 'A search pattern of length `L` can only match words of length `L`. Group words by length, so queries scan only the relevant bucket. The matching logic is unchanged.',
      algorithm: ['1. `addWord` puts the word in `buckets[length]`.','2. `search` scans only `buckets[pattern.length()]`, comparing characters with the `.` wildcard.'],
      code: "import java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.List;\nimport java.util.Map;\n\nclass WordDictionary {\n    private final Map<Integer, List<String>> buckets = new HashMap<>();\n\n    public void addWord(String word) {\n        buckets.computeIfAbsent(word.length(), k -> new ArrayList<>()).add(word);\n    }\n\n    public boolean search(String pattern) {\n        for (String w : buckets.getOrDefault(pattern.length(), List.of())) {\n            if (matches(w, pattern)) return true;\n        }\n        return false;\n    }\n\n    private boolean matches(String w, String p) {\n        for (int i = 0; i < p.length(); i++) {\n            if (p.charAt(i) != '.' && p.charAt(i) != w.charAt(i)) return false;\n        }\n        return true;\n    }\n}",
      complexity: { time: '`search` is O(N_L \\cdot L), where N_L is the number of words of length L', space: 'O(N \\cdot L)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Store words in a trie. For a normal letter, follow one child. For a `.`, try every existing child and succeed if any branch matches the rest of the pattern. Branches that do not exist are pruned immediately.',
      algorithm: ['1. `addWord`: insert into the trie, marking `isEnd` at the last node.','2. `search(word, idx, node)`: if `idx` is past the end, return `node.isEnd`. If the character is a letter, descend into that child if it exists. If it is `.`, return `true` if any non-null child matches from `idx + 1`.'],
      code: "class WordDictionary {\n    private static class Node {\n        Node[] children = new Node[26];\n        boolean isEnd;\n    }\n\n    private final Node root = new Node();\n\n    public void addWord(String word) {\n        Node cur = root;\n        for (char ch : word.toCharArray()) {\n            int i = ch - 'a';\n            if (cur.children[i] == null) cur.children[i] = new Node();\n            cur = cur.children[i];\n        }\n        cur.isEnd = true;\n    }\n\n    public boolean search(String word) {\n        return dfs(root, word, 0);\n    }\n\n    private boolean dfs(Node node, String word, int idx) {\n        if (idx == word.length()) return node.isEnd;\n        char ch = word.charAt(idx);\n        if (ch == '.') {\n            for (Node child : node.children) {\n                if (child != null && dfs(child, word, idx + 1)) return true;\n            }\n            return false;\n        }\n        Node next = node.children[ch - 'a'];\n        return next != null && dfs(next, word, idx + 1);\n    }\n}",
      complexity: { time: 'O(L)', space: 'O(N \\cdot L \\cdot 26)' }
    }
  ]
  },
  {
    slug: 'word-search-ii',
    title: 'Word Search II',
    difficulty: 'Hard',
    description: 'Given an `m x n` board of characters and a list of strings `words`, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighbouring. The same cell may not be used more than once in a word.',
    examples: [
    {
      input: 'board = [["a","b"],["c","d"]]',
      output: '[]',
      explanation: ''
    }
  ],
    constraints: '`m == board.length`, `n == board[i].length` - `1 <= m, n <= 12` - `board` consists of lowercase English letters. - `1 <= words.length <= 3 * 10^4` - `1 <= words[i].length <= 10` - All strings in `words` are unique.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'For each word, run the standard Word Search DFS from every cell, and keep the word if it is found.',
      algorithm: ['1. For each word, try every start cell with DFS (marking cells in place and restoring them).','2. If a start yields the full word, add it to the result and move on.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    private static final int[][] DIRS = {{1,0},{-1,0},{0,1},{0,-1}};\n\n    public List<String> findWords(char[][] board, String[] words) {\n        List<String> result = new ArrayList<>();\n        for (String w : words) {\n            if (exist(board, w)) result.add(w);\n        }\n        return result;\n    }\n\n    private boolean exist(char[][] board, String word) {\n        for (int r = 0; r < board.length; r++) {\n            for (int c = 0; c < board[0].length; c++) {\n                if (dfs(board, r, c, word, 0)) return true;\n            }\n        }\n        return false;\n    }\n\n    private boolean dfs(char[][] b, int r, int c, String word, int idx) {\n        if (r < 0 || c < 0 || r >= b.length || c >= b[0].length) return false;\n        if (b[r][c] != word.charAt(idx)) return false;\n        if (idx == word.length() - 1) return true;\n        char saved = b[r][c];\n        b[r][c] = '#';\n        for (int[] d : DIRS) {\n            if (dfs(b, r + d[0], c + d[1], word, idx + 1)) {\n                b[r][c] = saved;\n                return true;\n            }\n        }\n        b[r][c] = saved;\n        return false;\n    }\n}",
      complexity: { time: 'O(W \\cdot m \\cdot n \\cdot 4^L)', space: 'O(L)' }
    },
    {
      label: 'Better',
      intuition: 'One trie holds every word. From each cell, the DFS walks the trie in step with the grid. It only extends into neighbours that have a matching trie child, and it records a word when it reaches a node marked as a word end. Each word is recorded once by clearing its marker after it is found.',
      algorithm: ['1. Insert each word into a trie. Store the full word at its end node.','2. For each cell, call `dfs(r, c, root)`.','3. `dfs`: look up `board[r][c]` among the children of the current node. If absent, return. If that child holds a word, add it to the result and clear it. Mark the cell, recurse into the four neighbours with the child node, and restore the cell.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    private static class Node {\n        Node[] children = new Node[26];\n        String word;\n    }\n\n    private static final int[][] DIRS = {{1,0},{-1,0},{0,1},{0,-1}};\n\n    public List<String> findWords(char[][] board, String[] words) {\n        Node root = new Node();\n        for (String w : words) {\n            Node cur = root;\n            for (char ch : w.toCharArray()) {\n                int i = ch - 'a';\n                if (cur.children[i] == null) cur.children[i] = new Node();\n                cur = cur.children[i];\n            }\n            cur.word = w;\n        }\n        List<String> result = new ArrayList<>();\n        for (int r = 0; r < board.length; r++) {\n            for (int c = 0; c < board[0].length; c++) {\n                dfs(board, r, c, root, result);\n            }\n        }\n        return result;\n    }\n\n    private void dfs(char[][] b, int r, int c, Node parent, List<String> result) {\n        if (r < 0 || c < 0 || r >= b.length || c >= b[0].length) return;\n        char ch = b[r][c];\n        if (ch == '#') return;\n        Node next = parent.children[ch - 'a'];\n        if (next == null) return;\n        if (next.word != null) {\n            result.add(next.word);\n            next.word = null;\n        }\n        b[r][c] = '#';\n        for (int[] d : DIRS) {\n            dfs(b, r + d[0], c + d[1], next, result);\n        }\n        b[r][c] = ch;\n    }\n}",
      complexity: { time: 'O(m \\cdot n \\cdot 4^L)', space: 'O(W \\cdot L \\cdot 26)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Once every word below a trie node is found, that node is dead weight, and the DFS would keep visiting it. After returning from a child, remove the child from the trie if it has no children and no pending word. This shrinks the trie as the search runs, so later cells explore less. Clearing the word marker still prevents duplicates.',
      algorithm: ['1. Build the trie as in Approach 2.','2. In `dfs`, after exploring the neighbours, restore the cell. If `next` has no children and `next.word == null`, set `parent.children[ch - \'a\'] = null`.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    private static class Node {\n        Node[] children = new Node[26];\n        String word;\n    }\n\n    private static final int[][] DIRS = {{1,0},{-1,0},{0,1},{0,-1}};\n\n    public List<String> findWords(char[][] board, String[] words) {\n        Node root = new Node();\n        for (String w : words) {\n            Node cur = root;\n            for (char ch : w.toCharArray()) {\n                int i = ch - 'a';\n                if (cur.children[i] == null) cur.children[i] = new Node();\n                cur = cur.children[i];\n            }\n            cur.word = w;\n        }\n        List<String> result = new ArrayList<>();\n        for (int r = 0; r < board.length; r++) {\n            for (int c = 0; c < board[0].length; c++) {\n                dfs(board, r, c, root, result);\n            }\n        }\n        return result;\n    }\n\n    private void dfs(char[][] b, int r, int c, Node parent, List<String> result) {\n        if (r < 0 || c < 0 || r >= b.length || c >= b[0].length) return;\n        char ch = b[r][c];\n        if (ch == '#') return;\n        Node next = parent.children[ch - 'a'];\n        if (next == null) return;\n        if (next.word != null) {\n            result.add(next.word);\n            next.word = null;\n        }\n        b[r][c] = '#';\n        for (int[] d : DIRS) {\n            dfs(b, r + d[0], c + d[1], next, result);\n        }\n        b[r][c] = ch;\n        if (isEmpty(next)) {\n            parent.children[ch - 'a'] = null;\n        }\n    }\n\n    private boolean isEmpty(Node n) {\n        if (n.word != null) return false;\n        for (Node child : n.children) {\n            if (child != null) return false;\n        }\n        return true;\n    }\n}",
      complexity: { time: 'O(m \\cdot n \\cdot 4^L)', space: 'O(W \\cdot L \\cdot 26)' }
    }
  ]
  },
  {
    slug: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'Medium',
    description: 'Given an `m x n` 2D binary grid `grid` where `\'1\'` represents land and `\'0\'` represents water, return the number of islands. An island is surrounded by water and is formed by connecting adjacent land cells horizontally or vertically.',
    examples: [
    {
      input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
      output: '3',
      explanation: ''
    }
  ],
    constraints: '`1 <= m, n <= 300` - `grid[i][j]` is `\'0\'` or `\'1\'`.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Track visited cells as strings in a `HashSet`. Each flood fill adds to the set, so later scans skip those cells.',
      algorithm: ['1. For each cell that is `\'1\'` and not in `seen`, increment the count and flood-fill from it, adding every reached cell to `seen`.'],
      code: "import java.util.HashSet;\nimport java.util.Set;\n\nclass Solution {\n    public int numIslands(char[][] grid) {\n        Set<String> seen = new HashSet<>();\n        int count = 0;\n        for (int r = 0; r < grid.length; r++) {\n            for (int c = 0; c < grid[0].length; c++) {\n                if (grid[r][c] == '1' && !seen.contains(r + \",\" + c)) {\n                    count++;\n                    fill(grid, r, c, seen);\n                }\n            }\n        }\n        return count;\n    }\n\n    private void fill(char[][] g, int r, int c, Set<String> seen) {\n        if (r < 0 || c < 0 || r >= g.length || c >= g[0].length) return;\n        String key = r + \",\" + c;\n        if (g[r][c] != '1' || seen.contains(key)) return;\n        seen.add(key);\n        fill(g, r + 1, c, seen);\n        fill(g, r - 1, c, seen);\n        fill(g, r, c + 1, seen);\n        fill(g, r, c - 1, seen);\n    }\n}",
      complexity: { time: 'O(mn)', space: 'O(mn)' }
    },
    {
      label: 'Better',
      intuition: 'A boolean matrix records visited cells without string keys, which is faster and uses less memory than a set.',
      algorithm: ['1. For each land cell not visited, increment the count and run DFS.','2. DFS marks cells visited and recurses into the four neighbours that are unvisited land.'],
      code: "class Solution {\n    public int numIslands(char[][] grid) {\n        boolean[][] visited = new boolean[grid.length][grid[0].length];\n        int count = 0;\n        for (int r = 0; r < grid.length; r++) {\n            for (int c = 0; c < grid[0].length; c++) {\n                if (grid[r][c] == '1' && !visited[r][c]) {\n                    count++;\n                    dfs(grid, visited, r, c);\n                }\n            }\n        }\n        return count;\n    }\n\n    private void dfs(char[][] g, boolean[][] vis, int r, int c) {\n        if (r < 0 || c < 0 || r >= g.length || c >= g[0].length) return;\n        if (g[r][c] != '1' || vis[r][c]) return;\n        vis[r][c] = true;\n        dfs(g, vis, r + 1, c);\n        dfs(g, vis, r - 1, c);\n        dfs(g, vis, r, c + 1);\n        dfs(g, vis, r, c - 1);\n    }\n}",
      complexity: { time: 'O(mn)', space: 'O(mn)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Once a land cell is part of a counted island, change it to water. Then the grid itself records visited cells, and no extra structure is needed.',
      algorithm: ['1. For each `\'1\'` cell, increment the count and sink the island: set the cell to `\'0\'` and recurse into land neighbours.'],
      code: "class Solution {\n    public int numIslands(char[][] grid) {\n        int count = 0;\n        for (int r = 0; r < grid.length; r++) {\n            for (int c = 0; c < grid[0].length; c++) {\n                if (grid[r][c] == '1') {\n                    count++;\n                    sink(grid, r, c);\n                }\n            }\n        }\n        return count;\n    }\n\n    private void sink(char[][] g, int r, int c) {\n        if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] != '1') return;\n        g[r][c] = '0';\n        sink(g, r + 1, c);\n        sink(g, r - 1, c);\n        sink(g, r, c + 1);\n        sink(g, r, c - 1);\n    }\n}",
      complexity: { time: 'O(mn)', space: 'O(mn)' }
    }
  ]
  },
  {
    slug: 'max-area-of-island',
    title: 'Max Area of Island',
    difficulty: 'Medium',
    description: 'You are given an `m x n` binary matrix `grid`. An island is a group of `1`s connected 4-directionally. You may assume all four edges of the grid are surrounded by water. Return the maximum area of an island in `grid`. If there is no island, return `0`.',
    examples: [
    {
      input: 'grid = [[0,0,0,0,0,0,0,0]]',
      output: '0',
      explanation: ''
    }
  ],
    constraints: '`m == grid.length`, `n == grid[i].length` - `1 <= m, n <= 50` - `grid[i][j]` is `0` or `1`.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Track visited coordinates in a set. Each flood fill returns its area, and the answer is the largest area seen.',
      algorithm: ['1. For each unvisited `1`, compute `area = fill(r, c)`.','2. Return the maximum area.'],
      code: "import java.util.HashSet;\nimport java.util.Set;\n\nclass Solution {\n    public int maxAreaOfIsland(int[][] grid) {\n        Set<String> seen = new HashSet<>();\n        int best = 0;\n        for (int r = 0; r < grid.length; r++) {\n            for (int c = 0; c < grid[0].length; c++) {\n                if (grid[r][c] == 1 && !seen.contains(r + \",\" + c)) {\n                    best = Math.max(best, fill(grid, r, c, seen));\n                }\n            }\n        }\n        return best;\n    }\n\n    private int fill(int[][] g, int r, int c, Set<String> seen) {\n        if (r < 0 || c < 0 || r >= g.length || c >= g[0].length) return 0;\n        String key = r + \",\" + c;\n        if (g[r][c] != 1 || seen.contains(key)) return 0;\n        seen.add(key);\n        return 1 + fill(g, r + 1, c, seen) + fill(g, r - 1, c, seen)\n                 + fill(g, r, c + 1, seen) + fill(g, r, c - 1, seen);\n    }\n}",
      complexity: { time: 'O(mn)', space: 'O(mn)' }
    },
    {
      label: 'Better',
      intuition: 'Replace the set with a boolean grid, and return the area from DFS.',
      algorithm: ['1. For each unvisited `1`, DFS returns the number of cells in its component.','2. Track the maximum.'],
      code: "class Solution {\n    public int maxAreaOfIsland(int[][] grid) {\n        boolean[][] visited = new boolean[grid.length][grid[0].length];\n        int best = 0;\n        for (int r = 0; r < grid.length; r++) {\n            for (int c = 0; c < grid[0].length; c++) {\n                if (grid[r][c] == 1 && !visited[r][c]) {\n                    best = Math.max(best, dfs(grid, visited, r, c));\n                }\n            }\n        }\n        return best;\n    }\n\n    private int dfs(int[][] g, boolean[][] vis, int r, int c) {\n        if (r < 0 || c < 0 || r >= g.length || c >= g[0].length) return 0;\n        if (g[r][c] != 1 || vis[r][c]) return 0;\n        vis[r][c] = true;\n        return 1 + dfs(g, vis, r + 1, c) + dfs(g, vis, r - 1, c)\n                 + dfs(g, vis, r, c + 1) + dfs(g, vis, r, c - 1);\n    }\n}",
      complexity: { time: 'O(mn)', space: 'O(mn)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Sink each visited land cell to water, so the grid records visited cells. The DFS returns the area directly, with no extra memory beyond the recursion stack.',
      algorithm: ['1. For each `1`, compute the area by sinking the island and summing the returned counts.','2. Return the maximum.'],
      code: "class Solution {\n    public int maxAreaOfIsland(int[][] grid) {\n        int best = 0;\n        for (int r = 0; r < grid.length; r++) {\n            for (int c = 0; c < grid[0].length; c++) {\n                best = Math.max(best, sink(grid, r, c));\n            }\n        }\n        return best;\n    }\n\n    private int sink(int[][] g, int r, int c) {\n        if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] != 1) return 0;\n        g[r][c] = 0;\n        return 1 + sink(g, r + 1, c) + sink(g, r - 1, c) + sink(g, r, c + 1) + sink(g, r, c - 1);\n    }\n}",
      complexity: { time: 'O(mn)', space: 'O(mn)' }
    }
  ]
  },
  {
    slug: 'clone-graph',
    title: 'Clone Graph',
    difficulty: 'Medium',
    description: 'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node contains an integer `val` and a list of its neighbours. The graph is given as an adjacency list, and each node\'s `val` equals its 1-indexed position in the list.',
    examples: [
    {
      input: 'adjList = []',
      output: '[]',
      explanation: ''
    }
  ],
    constraints: 'The number of nodes is in the range `[0, 100]`. - `1 <= Node.val <= 100` - `Node.val` is unique for each node. - No repeated edges and no self-loops.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Collect every original node in a list. Create a clone per node, in the same order. To wire the edges, find each neighbour\'s index in the list by linear search.',
      algorithm: ['1. DFS to collect all original nodes into `nodes`.','2. Create `clones[i] = new Node(nodes[i].val)`.','3. For each `i`, for each neighbour `nb`, find `j` with `nodes[j] == nb` by linear search, and add `clones[j]` to `clones[i].neighbors`.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public Node cloneGraph(Node node) {\n        if (node == null) return null;\n        List<Node> nodes = new ArrayList<>();\n        collect(node, nodes);\n        List<Node> clones = new ArrayList<>();\n        for (Node n : nodes) clones.add(new Node(n.val));\n        for (int i = 0; i < nodes.size(); i++) {\n            for (Node nb : nodes.get(i).neighbors) {\n                int j = 0;\n                while (nodes.get(j) != nb) j++;\n                clones.get(i).neighbors.add(clones.get(j));\n            }\n        }\n        return clones.get(0);\n    }\n\n    private void collect(Node n, List<Node> nodes) {\n        if (nodes.contains(n)) return;\n        nodes.add(n);\n        for (Node nb : n.neighbors) collect(nb, nodes);\n    }\n}",
      complexity: { time: 'O(V^2 + E \\cdot V)', space: 'O(V)' }
    },
    {
      label: 'Better',
      intuition: 'The clone of a node is created the first time it is reached, and recorded in a map. Recursion then clones each neighbour, reusing the map entry if it exists. Each node and edge is handled once.',
      algorithm: ['1. `clone(n)`: if `n` is in the map, return its clone. Otherwise create `copy`, store it, and for each neighbour add `clone(nb)` to `copy.neighbors`.'],
      code: "import java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.Map;\n\nclass Solution {\n    private final Map<Node, Node> map = new HashMap<>();\n\n    public Node cloneGraph(Node node) {\n        if (node == null) return null;\n        if (map.containsKey(node)) return map.get(node);\n        Node copy = new Node(node.val, new ArrayList<>());\n        map.put(node, copy);\n        for (Node nb : node.neighbors) {\n            copy.neighbors.add(cloneGraph(nb));\n        }\n        return copy;\n    }\n}",
      complexity: { time: 'O(V + E)', space: 'O(V)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'The same mapping, driven by a queue instead of recursion. Clone each node when it is first discovered, and wire its neighbours as the queue drains. This avoids deep recursion on large graphs.',
      algorithm: ['1. Create the clone of `node`, map it, and enqueue the original.','2. While the queue is non-empty: dequeue `n`. For each neighbour `nb`, if it has no clone, create one, map it, and enqueue `nb`. Add `map.get(nb)` to `map.get(n).neighbors`.','3. Return `map.get(node)`.'],
      code: "import java.util.ArrayDeque;\nimport java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.Map;\nimport java.util.Queue;\n\nclass Solution {\n    public Node cloneGraph(Node node) {\n        if (node == null) return null;\n        Map<Node, Node> map = new HashMap<>();\n        Queue<Node> queue = new ArrayDeque<>();\n        map.put(node, new Node(node.val, new ArrayList<>()));\n        queue.offer(node);\n        while (!queue.isEmpty()) {\n            Node n = queue.poll();\n            for (Node nb : n.neighbors) {\n                if (!map.containsKey(nb)) {\n                    map.put(nb, new Node(nb.val, new ArrayList<>()));\n                    queue.offer(nb);\n                }\n                map.get(n).neighbors.add(map.get(nb));\n            }\n        }\n        return map.get(node);\n    }\n}",
      complexity: { time: 'O(V + E)', space: 'O(V)' }
    }
  ]
  },
  {
    slug: 'walls-and-gates',
    title: 'Walls and Gates',
    difficulty: 'Medium',
    description: 'You are given an `m x n` grid where each cell is one of: - `-1` for a wall, - `0` for a gate, - `INF` (`2147483647`) for an empty room. Fill each empty room with the distance to its nearest gate. If it is impossible to reach a gate, leave the room as `INF`.',
    examples: [
    {
      input: '[[-1]]',
      output: '[[-1]]',
      explanation: ''
    }
  ],
    constraints: '`m == rooms.length`, `n == rooms[i].length` - `1 <= m, n <= 250` - `rooms[i][j]` is `-1`, `0`, or `2147483647`.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'For every empty room, run BFS until the first gate is reached, and record that distance.',
      algorithm: ['1. For each room equal to `INF`, BFS outward through non-wall cells.','2. The first gate found gives the distance. Store it.'],
      code: "import java.util.ArrayDeque;\nimport java.util.Queue;\n\nclass Solution {\n    private static final int INF = 2147483647;\n    private static final int[][] DIRS = {{1,0},{-1,0},{0,1},{0,-1}};\n\n    public void wallsAndGates(int[][] rooms) {\n        for (int r = 0; r < rooms.length; r++) {\n            for (int c = 0; c < rooms[0].length; c++) {\n                if (rooms[r][c] == INF) {\n                    rooms[r][c] = nearestGate(rooms, r, c);\n                }\n            }\n        }\n    }\n\n    private int nearestGate(int[][] rooms, int sr, int sc) {\n        int m = rooms.length, n = rooms[0].length;\n        boolean[][] seen = new boolean[m][n];\n        Queue<int[]> q = new ArrayDeque<>();\n        q.offer(new int[]{sr, sc, 0});\n        seen[sr][sc] = true;\n        while (!q.isEmpty()) {\n            int[] cur = q.poll();\n            if (rooms[cur[0]][cur[1]] == 0) return cur[2];\n            for (int[] d : DIRS) {\n                int nr = cur[0] + d[0], nc = cur[1] + d[1];\n                if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;\n                if (seen[nr][nc] || rooms[nr][nc] == -1) continue;\n                seen[nr][nc] = true;\n                q.offer(new int[]{nr, nc, cur[2] + 1});\n            }\n        }\n        return INF;\n    }\n}",
      complexity: { time: 'O((mn)^2)', space: 'O(mn)' }
    },
    {
      label: 'Better',
      intuition: 'Run DFS from each gate with distance 0. At each cell, if the current distance is smaller than the stored value, update it and continue. Revisits happen only when a shorter path is found, so the search stays correct, though it is not optimal in revisits.',
      algorithm: ['1. For each gate, call `dfs(r, c, 0)`.','2. `dfs(r, c, d)`: return if out of bounds, or if `rooms[r][c] < d` (wall or a shorter path already known). Otherwise set `rooms[r][c] = d` and recurse with `d + 1`.'],
      code: "class Solution {\n    private static final int[][] DIRS = {{1,0},{-1,0},{0,1},{0,-1}};\n\n    public void wallsAndGates(int[][] rooms) {\n        for (int r = 0; r < rooms.length; r++) {\n            for (int c = 0; c < rooms[0].length; c++) {\n                if (rooms[r][c] == 0) dfs(rooms, r, c, 0);\n            }\n        }\n    }\n\n    private void dfs(int[][] rooms, int r, int c, int d) {\n        if (r < 0 || c < 0 || r >= rooms.length || c >= rooms[0].length) return;\n        if (rooms[r][c] < d) return;\n        rooms[r][c] = d;\n        for (int[] dir : DIRS) {\n            dfs(rooms, r + dir[0], c + dir[1], d + 1);\n        }\n    }\n}",
      complexity: { time: 'O(G \\cdot mn)', space: 'O(mn)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Push every gate into the queue at once, at distance 0. BFS then expands all gates in parallel, one layer per step. The first time a room is reached is its shortest distance to any gate, so each room is visited exactly once.',
      algorithm: ['1. Enqueue every gate.','2. Dequeue `(r, c)`. For each neighbour that is an empty room (`INF`), set it to `rooms[r][c] + 1` and enqueue it.'],
      code: "import java.util.ArrayDeque;\nimport java.util.Queue;\n\nclass Solution {\n    private static final int INF = 2147483647;\n    private static final int[][] DIRS = {{1,0},{-1,0},{0,1},{0,-1}};\n\n    public void wallsAndGates(int[][] rooms) {\n        Queue<int[]> q = new ArrayDeque<>();\n        for (int r = 0; r < rooms.length; r++) {\n            for (int c = 0; c < rooms[0].length; c++) {\n                if (rooms[r][c] == 0) q.offer(new int[]{r, c});\n            }\n        }\n        while (!q.isEmpty()) {\n            int[] cur = q.poll();\n            for (int[] d : DIRS) {\n                int nr = cur[0] + d[0], nc = cur[1] + d[1];\n                if (nr < 0 || nc < 0 || nr >= rooms.length || nc >= rooms[0].length) continue;\n                if (rooms[nr][nc] != INF) continue;\n                rooms[nr][nc] = rooms[cur[0]][cur[1]] + 1;\n                q.offer(new int[]{nr, nc});\n            }\n        }\n    }\n}",
      complexity: { time: 'O(mn)', space: 'O(mn)' }
    }
  ]
  },
  {
    slug: 'rotting-oranges',
    title: 'Rotting Oranges',
    difficulty: 'Medium',
    description: 'You are given an `m x n` grid where each cell is: - `0`: an empty cell, - `1`: a fresh orange, - `2`: a rotten orange. Every minute, any fresh orange adjacent (4-directionally) to a rotten orange becomes rotten. Return the minimum number of minutes until no fresh orange remains. If it is impossible, return `-1`.',
    examples: [
    {
      input: 'grid = [[2,1,1],[0,1,1],[1,0,1]]',
      output: '-1',
      explanation: ''
    }
  ],
    constraints: '`m == grid.length`, `n == grid[i].length` - `1 <= m, n <= 10` - `grid[i][j]` is `0`, `1`, or `2`.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Each minute, build a new grid in which every fresh orange next to a rotten one becomes rotten. Repeat until nothing changes. The number of productive minutes is the answer.',
      algorithm: ['1. Loop: copy the grid, rot every fresh orange adjacent to a rotten one (reading from the old grid), and track whether anything changed.','2. If nothing changed, stop. Count the minutes that changed something.','3. If any fresh orange remains, return `-1`.'],
      code: "class Solution {\n    public int orangesRotting(int[][] grid) {\n        int m = grid.length, n = grid[0].length, minutes = 0;\n        int[][] g = new int[m][];\n        for (int r = 0; r < m; r++) g[r] = grid[r].clone();\n        while (true) {\n            int[][] next = new int[m][];\n            for (int r = 0; r < m; r++) next[r] = g[r].clone();\n            boolean changed = false;\n            for (int r = 0; r < m; r++) {\n                for (int c = 0; c < n; c++) {\n                    if (g[r][c] == 1 && hasRottenNeighbour(g, r, c)) {\n                        next[r][c] = 2;\n                        changed = true;\n                    }\n                }\n            }\n            if (!changed) break;\n            g = next;\n            minutes++;\n        }\n        for (int[] row : g) {\n            for (int v : row) {\n                if (v == 1) return -1;\n            }\n        }\n        return minutes;\n    }\n\n    private boolean hasRottenNeighbour(int[][] g, int r, int c) {\n        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};\n        for (int[] d : dirs) {\n            int nr = r + d[0], nc = c + d[1];\n            if (nr >= 0 && nc >= 0 && nr < g.length && nc < g[0].length && g[nr][nc] == 2) return true;\n        }\n        return false;\n    }\n}",
      complexity: { time: 'O((mn)^2)', space: 'O(mn)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Start with all rotten oranges in the queue. Process one layer at a time, and each completed layer is one minute. Track the count of fresh oranges, decrementing as they rot. If any remain at the end, they were unreachable.',
      algorithm: ['1. Enqueue every rotten orange, and count the fresh ones.','2. While the queue is non-empty and fresh oranges remain: process the current layer, rotting adjacent fresh oranges and enqueuing them. Increment `minutes`.','3. Return `minutes` if `fresh == 0`, else `-1`.'],
      code: "import java.util.ArrayDeque;\nimport java.util.Queue;\n\nclass Solution {\n    private static final int[][] DIRS = {{1,0},{-1,0},{0,1},{0,-1}};\n\n    public int orangesRotting(int[][] grid) {\n        int m = grid.length, n = grid[0].length, fresh = 0, minutes = 0;\n        Queue<int[]> q = new ArrayDeque<>();\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                if (grid[r][c] == 2) q.offer(new int[]{r, c});\n                else if (grid[r][c] == 1) fresh++;\n            }\n        }\n        while (!q.isEmpty() && fresh > 0) {\n            minutes++;\n            for (int size = q.size(); size > 0; size--) {\n                int[] cur = q.poll();\n                for (int[] d : DIRS) {\n                    int nr = cur[0] + d[0], nc = cur[1] + d[1];\n                    if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;\n                    if (grid[nr][nc] != 1) continue;\n                    grid[nr][nc] = 2;\n                    fresh--;\n                    q.offer(new int[]{nr, nc});\n                }\n            }\n        }\n        return fresh == 0 ? minutes : -1;\n    }\n}",
      complexity: { time: 'O(mn)', space: 'O(mn)' }
    }
  ]
  },
  {
    slug: 'pacific-atlantic-water-flow',
    title: 'Pacific Atlantic Water Flow',
    difficulty: 'Medium',
    description: 'There is an `m x n` rectangular island with heights `heights`. The Pacific Ocean touches the top and left edges, and the Atlantic Ocean touches the bottom and right edges. Water flows from a cell to a neighbour (4-directionally) whose height is less than or equal to the cell\'s height. Return all grid coordinates from which water can flow to both oceans.',
    examples: [
    {
      input: 'heights = [[1]]',
      output: '[[0,0]]',
      explanation: ''
    }
  ],
    constraints: '`m == heights.length`, `n == heights[r].length` - `1 <= m, n <= 200` - `0 <= heights[r][c] <= 10^5`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'For each cell, run a DFS along non-increasing moves and check whether it reaches both oceans.',
      algorithm: ['1. For each cell, DFS to the Pacific boundary (top or left) and to the Atlantic boundary (bottom or right) following moves to neighbours with height `<=` current.','2. Include the cell if both are reachable.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    private static final int[][] DIRS = {{1,0},{-1,0},{0,1},{0,-1}};\n\n    public List<List<Integer>> pacificAtlantic(int[][] heights) {\n        List<List<Integer>> result = new ArrayList<>();\n        int m = heights.length, n = heights[0].length;\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                boolean[][] seen = new boolean[m][n];\n                boolean pac = reaches(heights, r, c, seen, true);\n                seen = new boolean[m][n];\n                boolean atl = reaches(heights, r, c, seen, false);\n                if (pac && atl) result.add(List.of(r, c));\n            }\n        }\n        return result;\n    }\n\n    private boolean reaches(int[][] h, int r, int c, boolean[][] seen, boolean pacific) {\n        int m = h.length, n = h[0].length;\n        if (pacific && (r == 0 || c == 0)) return true;\n        if (!pacific && (r == m - 1 || c == n - 1)) return true;\n        seen[r][c] = true;\n        for (int[] d : DIRS) {\n            int nr = r + d[0], nc = c + d[1];\n            if (nr < 0 || nc < 0 || nr >= m || nc >= n || seen[nr][nc]) continue;\n            if (h[nr][nc] <= h[r][c] && reaches(h, nr, nc, seen, pacific)) return true;\n        }\n        return false;\n    }\n}",
      complexity: { time: 'O((mn)^2)', space: 'O(mn)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Seed a DFS from every Pacific-border cell, moving only to neighbours with height `>=` the current one (the reverse of water flow). Do the same from Atlantic-border cells. Each traversal marks every cell that can reach its ocean. Two linear passes replace the per-cell searches.',
      algorithm: ['1. `pac` and `atl` are boolean grids.','2. For each top and left cell, `dfs(pac, r, c)`. For each bottom and right cell, `dfs(atl, r, c)`.','3. `dfs(reach, r, c)`: mark the cell. For each unmarked neighbour with height `>=` current, recurse.','4. Collect cells where both are `true`.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    private static final int[][] DIRS = {{1,0},{-1,0},{0,1},{0,-1}};\n\n    public List<List<Integer>> pacificAtlantic(int[][] heights) {\n        int m = heights.length, n = heights[0].length;\n        boolean[][] pac = new boolean[m][n], atl = new boolean[m][n];\n        for (int r = 0; r < m; r++) {\n            dfs(heights, pac, r, 0);\n            dfs(heights, atl, r, n - 1);\n        }\n        for (int c = 0; c < n; c++) {\n            dfs(heights, pac, 0, c);\n            dfs(heights, atl, m - 1, c);\n        }\n        List<List<Integer>> result = new ArrayList<>();\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                if (pac[r][c] && atl[r][c]) result.add(List.of(r, c));\n            }\n        }\n        return result;\n    }\n\n    private void dfs(int[][] h, boolean[][] reach, int r, int c) {\n        if (reach[r][c]) return;\n        reach[r][c] = true;\n        for (int[] d : DIRS) {\n            int nr = r + d[0], nc = c + d[1];\n            if (nr < 0 || nc < 0 || nr >= h.length || nc >= h[0].length) continue;\n            if (h[nr][nc] >= h[r][c]) dfs(h, reach, nr, nc);\n        }\n    }\n}",
      complexity: { time: 'O(mn)', space: 'O(mn)' }
    }
  ]
  },
  {
    slug: 'surrounded-regions',
    title: 'Surrounded Regions',
    difficulty: 'Medium',
    description: 'Given an `m x n` board containing `\'X\'` and `\'O\'`, capture all regions surrounded by `\'X\'`. A region is captured by flipping all `\'O\'`s in it to `\'X\'`. An `\'O\'` is not surrounded if it is connected, through `\'O\'`s, to a border cell.',
    examples: [
    {
      input: 'board = [["X"]]',
      output: '[["X"]]',
      explanation: ''
    }
  ],
    constraints: '`m == board.length`, `n == board[i].length` - `1 <= m, n <= 200` - `board[i][j]` is `\'X\'` or `\'O\'`.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'For each unvisited `O`, collect its entire region with a flood fill. If any cell in the region is on the border, leave it. Otherwise flip the whole region.',
      algorithm: ['1. For each unvisited `O`, flood fill, recording the cells and whether any touches the border.','2. If the region does not touch the border, set all its cells to `X`.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    private static final int[][] DIRS = {{1,0},{-1,0},{0,1},{0,-1}};\n\n    public void solve(char[][] board) {\n        int m = board.length, n = board[0].length;\n        boolean[][] visited = new boolean[m][n];\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                if (board[r][c] == 'O' && !visited[r][c]) {\n                    List<int[]> region = new ArrayList<>();\n                    boolean touchesBorder = collect(board, visited, r, c, region);\n                    if (!touchesBorder) {\n                        for (int[] cell : region) board[cell[0]][cell[1]] = 'X';\n                    }\n                }\n            }\n        }\n    }\n\n    private boolean collect(char[][] b, boolean[][] vis, int r, int c, List<int[]> region) {\n        int m = b.length, n = b[0].length;\n        if (r < 0 || c < 0 || r >= m || c >= n) return false;\n        if (b[r][c] != 'O' || vis[r][c]) return false;\n        vis[r][c] = true;\n        region.add(new int[]{r, c});\n        boolean border = (r == 0 || c == 0 || r == m - 1 || c == n - 1);\n        for (int[] d : DIRS) {\n            border |= collect(b, vis, r + d[0], c + d[1], region);\n        }\n        return border;\n    }\n}",
      complexity: { time: 'O(mn)', space: 'O(mn)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Flood fill from every border `O`, marking reached cells as `S` (safe). Afterwards, every remaining `O` is enclosed, so flip it to `X`. Then restore `S` to `O`. Only two linear passes are needed, and no region list is built.',
      algorithm: ['1. For each border cell that is `O`, DFS and set reached `O`s to `S`.','2. Scan the board: `O` becomes `X`, and `S` becomes `O`.'],
      code: "class Solution {\n    public void solve(char[][] board) {\n        int m = board.length, n = board[0].length;\n        for (int r = 0; r < m; r++) {\n            mark(board, r, 0);\n            mark(board, r, n - 1);\n        }\n        for (int c = 0; c < n; c++) {\n            mark(board, 0, c);\n            mark(board, m - 1, c);\n        }\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                if (board[r][c] == 'O') board[r][c] = 'X';\n                else if (board[r][c] == 'S') board[r][c] = 'O';\n            }\n        }\n    }\n\n    private void mark(char[][] b, int r, int c) {\n        if (r < 0 || c < 0 || r >= b.length || c >= b[0].length) return;\n        if (b[r][c] != 'O') return;\n        b[r][c] = 'S';\n        mark(b, r + 1, c);\n        mark(b, r - 1, c);\n        mark(b, r, c + 1);\n        mark(b, r, c - 1);\n    }\n}",
      complexity: { time: 'O(mn)', space: 'O(mn)' }
    }
  ]
  },
  {
    slug: 'number-of-connected-components-in-an-undirected-graph',
    title: 'Number of Connected Components in an Undirected Graph',
    difficulty: 'Medium',
    description: 'You have a graph of `n` nodes labelled from `0` to `n - 1`. You are given an integer `n` and an array `edges` where `edges[i] = [ai, bi]` indicates an undirected edge between `ai` and `bi`. Return the number of connected components in the graph.',
    examples: [
    {
      input: 'n = 5',
      output: '1',
      explanation: ''
    }
  ],
    constraints: '`1 <= n <= 2000` - `1 <= edges.length <= 5000` - `edges[i].length == 2`, `0 <= ai, bi < n`, `ai != bi` - No repeated edges.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Store the graph as an `n x n` boolean matrix. For each unvisited node, count a component and DFS across matrix entries.',
      algorithm: ['1. Set `adj[a][b] = adj[b][a] = true` for each edge.','2. For each unvisited node, increment the count and DFS over every `j` with `adj[i][j]`.'],
      code: "class Solution {\n    public int countComponents(int n, int[][] edges) {\n        boolean[][] adj = new boolean[n][n];\n        for (int[] e : edges) {\n            adj[e[0]][e[1]] = true;\n            adj[e[1]][e[0]] = true;\n        }\n        boolean[] visited = new boolean[n];\n        int count = 0;\n        for (int i = 0; i < n; i++) {\n            if (!visited[i]) {\n                count++;\n                dfs(adj, visited, i);\n            }\n        }\n        return count;\n    }\n\n    private void dfs(boolean[][] adj, boolean[] visited, int u) {\n        visited[u] = true;\n        for (int v = 0; v < adj.length; v++) {\n            if (adj[u][v] && !visited[v]) dfs(adj, visited, v);\n        }\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(n^2)' }
    },
    {
      label: 'Better',
      intuition: 'Store only actual edges. A DFS from each unvisited node visits its neighbours directly, so the work is proportional to nodes plus edges.',
      algorithm: ['1. Build `adj` as a list of neighbour lists.','2. For each unvisited node, increment the count and DFS through its list.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public int countComponents(int n, int[][] edges) {\n        List<List<Integer>> adj = new ArrayList<>();\n        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());\n        for (int[] e : edges) {\n            adj.get(e[0]).add(e[1]);\n            adj.get(e[1]).add(e[0]);\n        }\n        boolean[] visited = new boolean[n];\n        int count = 0;\n        for (int i = 0; i < n; i++) {\n            if (!visited[i]) {\n                count++;\n                dfs(adj, visited, i);\n            }\n        }\n        return count;\n    }\n\n    private void dfs(List<List<Integer>> adj, boolean[] visited, int u) {\n        visited[u] = true;\n        for (int v : adj.get(u)) {\n            if (!visited[v]) dfs(adj, visited, v);\n        }\n    }\n}",
      complexity: { time: 'O(n + E)', space: 'O(n + E)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Every node starts as its own component. Each edge that joins two different components merges them and reduces the count by one. Path compression and union by size keep the structure nearly constant-time per operation.',
      algorithm: ['1. `parent[i] = i`, `components = n`.','2. For each edge `(a, b)`: if `find(a) != find(b)`, union them and decrement `components`.','3. Return `components`.'],
      code: "class Solution {\n    private int[] parent, size;\n\n    public int countComponents(int n, int[][] edges) {\n        parent = new int[n];\n        size = new int[n];\n        for (int i = 0; i < n; i++) {\n            parent[i] = i;\n            size[i] = 1;\n        }\n        int components = n;\n        for (int[] e : edges) {\n            int a = find(e[0]), b = find(e[1]);\n            if (a != b) {\n                if (size[a] < size[b]) { int t = a; a = b; b = t; }\n                parent[b] = a;\n                size[a] += size[b];\n                components--;\n            }\n        }\n        return components;\n    }\n\n    private int find(int x) {\n        while (parent[x] != x) {\n            parent[x] = parent[parent[x]];\n            x = parent[x];\n        }\n        return x;\n    }\n}",
      complexity: { time: 'O(E \\cdot \\alpha(n))', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'graph-valid-tree',
    title: 'Graph Valid Tree',
    difficulty: 'Medium',
    description: 'Given `n` nodes labelled from `0` to `n - 1` and a list of undirected `edges`, determine whether these edges form a valid tree.',
    examples: [
    {
      input: 'n = 5',
      output: 'false',
      explanation: ''
    }
  ],
    constraints: '`1 <= n <= 2000` - `0 <= edges.length <= 5000` - `edges[i].length == 2`, `0 <= ai, bi < n`, `ai != bi` - No self-loops or repeated edges.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'With exactly `n - 1` edges, the graph is a tree if and only if it is connected. Check connectivity with a DFS over an adjacency matrix.',
      algorithm: ['1. If `edges.length != n - 1`, return `false`.','2. Build the matrix. DFS from node `0`, and return whether all `n` nodes were visited.'],
      code: "class Solution {\n    public boolean validTree(int n, int[][] edges) {\n        if (edges.length != n - 1) return false;\n        boolean[][] adj = new boolean[n][n];\n        for (int[] e : edges) {\n            adj[e[0]][e[1]] = true;\n            adj[e[1]][e[0]] = true;\n        }\n        boolean[] visited = new boolean[n];\n        dfs(adj, visited, 0);\n        for (boolean v : visited) {\n            if (!v) return false;\n        }\n        return true;\n    }\n\n    private void dfs(boolean[][] adj, boolean[] visited, int u) {\n        visited[u] = true;\n        for (int v = 0; v < adj.length; v++) {\n            if (adj[u][v] && !visited[v]) dfs(adj, visited, v);\n        }\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(n^2)' }
    },
    {
      label: 'Better',
      intuition: 'Run DFS from node `0`, carrying the parent. In an undirected graph, reaching an already-visited node that is not the parent means a cycle. If no cycle appears and every node is visited, the graph is a tree.',
      algorithm: ['1. If `edges.length != n - 1`, return `false`.','2. `dfs(u, parent)`: mark `u` visited. For each neighbour `v` other than `parent`: if `v` is visited, return `false`. Otherwise recurse, and propagate `false`.','3. Return `true` if the DFS succeeds and all nodes are visited.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public boolean validTree(int n, int[][] edges) {\n        if (edges.length != n - 1) return false;\n        List<List<Integer>> adj = new ArrayList<>();\n        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());\n        for (int[] e : edges) {\n            adj.get(e[0]).add(e[1]);\n            adj.get(e[1]).add(e[0]);\n        }\n        boolean[] visited = new boolean[n];\n        if (!dfs(adj, visited, 0, -1)) return false;\n        for (boolean v : visited) {\n            if (!v) return false;\n        }\n        return true;\n    }\n\n    private boolean dfs(List<List<Integer>> adj, boolean[] visited, int u, int parent) {\n        visited[u] = true;\n        for (int v : adj.get(u)) {\n            if (v == parent) continue;\n            if (visited[v]) return false;\n            if (!dfs(adj, visited, v, u)) return false;\n        }\n        return true;\n    }\n}",
      complexity: { time: 'O(n + E)', space: 'O(n + E)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Process the edges with DSU. If an edge connects two nodes already in the same set, it creates a cycle, so the graph is not a tree. If no cycle appears among `n - 1` edges, the graph must be a single connected component, which is a tree.',
      algorithm: ['1. If `edges.length != n - 1`, return `false`.','2. For each edge `(a, b)`: if `find(a) == find(b)`, return `false`. Otherwise union them.','3. Return `true`.'],
      code: "class Solution {\n    private int[] parent;\n\n    public boolean validTree(int n, int[][] edges) {\n        if (edges.length != n - 1) return false;\n        parent = new int[n];\n        for (int i = 0; i < n; i++) parent[i] = i;\n        for (int[] e : edges) {\n            int a = find(e[0]), b = find(e[1]);\n            if (a == b) return false;\n            parent[a] = b;\n        }\n        return true;\n    }\n\n    private int find(int x) {\n        while (parent[x] != x) {\n            parent[x] = parent[parent[x]];\n            x = parent[x];\n        }\n        return x;\n    }\n}",
      complexity: { time: 'O(E \\cdot \\alpha(n))', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'word-ladder',
    title: 'Word Ladder',
    difficulty: 'Hard',
    description: 'A transformation sequence from `beginWord` to `endWord` using a dictionary `wordList` is a sequence of words where: - Every adjacent pair differs by exactly one letter. - Every intermediate word is in `wordList`. - `beginWord` need not be in `wordList`. Return the number of words in the shortest such sequence, or `0` if none exists.',
    examples: [
    {
      input: 'beginWord = "hit"',
      output: '0',
      explanation: 'endWord'
    }
  ],
    constraints: '`1 <= beginWord.length <= 10` - `endWord.length == beginWord.length` - `1 <= wordList.length <= 5000` - All words have the same length and consist of lowercase English letters. - `beginWord != endWord`, and all words in `wordList` are unique.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'To find the neighbours of a word, compare it against every word in the dictionary and keep those differing in exactly one position. BFS does this for each dequeued word.',
      algorithm: ['1. If `endWord` is not in the list, return `0`.','2. BFS from `beginWord`. For each dequeued word, enqueue every unvisited dictionary word that differs in exactly one letter.','3. Return the level when `endWord` is dequeued.'],
      code: "import java.util.ArrayDeque;\nimport java.util.HashSet;\nimport java.util.List;\nimport java.util.Queue;\nimport java.util.Set;\n\nclass Solution {\n    public int ladderLength(String beginWord, String endWord, List<String> wordList) {\n        Set<String> words = new HashSet<>(wordList);\n        if (!words.contains(endWord)) return 0;\n        Queue<String> q = new ArrayDeque<>();\n        Set<String> seen = new HashSet<>();\n        q.offer(beginWord);\n        seen.add(beginWord);\n        int level = 1;\n        while (!q.isEmpty()) {\n            for (int size = q.size(); size > 0; size--) {\n                String cur = q.poll();\n                if (cur.equals(endWord)) return level;\n                for (String w : words) {\n                    if (!seen.contains(w) && oneDiff(cur, w)) {\n                        seen.add(w);\n                        q.offer(w);\n                    }\n                }\n            }\n            level++;\n        }\n        return 0;\n    }\n\n    private boolean oneDiff(String a, String b) {\n        int diff = 0;\n        for (int i = 0; i < a.length(); i++) {\n            if (a.charAt(i) != b.charAt(i) && ++diff > 1) return false;\n        }\n        return diff == 1;\n    }\n}",
      complexity: { time: 'O(N^2 \\cdot L)', space: 'O(N \\cdot L)' }
    },
    {
      label: 'Better',
      intuition: 'Precompute, for every wildcard pattern such as `h*t`, the list of words that match it. Two words are neighbours exactly when they share a pattern, so each dequeued word looks up its `L` patterns directly.',
      algorithm: ['1. For each word in `wordList` and each position `i`, add the word to the bucket for `word[0..i) + \'*\' + word(i..]`.','2. BFS: for each dequeued word, for each position, look up the bucket. Enqueue unvisited words. Return when `endWord` is reached.'],
      code: "import java.util.ArrayDeque;\nimport java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.HashSet;\nimport java.util.List;\nimport java.util.Map;\nimport java.util.Queue;\nimport java.util.Set;\n\nclass Solution {\n    public int ladderLength(String beginWord, String endWord, List<String> wordList) {\n        Map<String, List<String>> buckets = new HashMap<>();\n        for (String w : wordList) {\n            for (int i = 0; i < w.length(); i++) {\n                String key = w.substring(0, i) + \"*\" + w.substring(i + 1);\n                buckets.computeIfAbsent(key, k -> new ArrayList<>()).add(w);\n            }\n        }\n        Queue<String> q = new ArrayDeque<>();\n        Set<String> seen = new HashSet<>();\n        q.offer(beginWord);\n        seen.add(beginWord);\n        int level = 1;\n        while (!q.isEmpty()) {\n            for (int size = q.size(); size > 0; size--) {\n                String cur = q.poll();\n                if (cur.equals(endWord)) return level;\n                for (int i = 0; i < cur.length(); i++) {\n                    String key = cur.substring(0, i) + \"*\" + cur.substring(i + 1);\n                    for (String nb : buckets.getOrDefault(key, List.of())) {\n                        if (seen.add(nb)) q.offer(nb);\n                    }\n                }\n            }\n            level++;\n        }\n        return 0;\n    }\n}",
      complexity: { time: 'O(N \\cdot L^2)', space: 'O(N \\cdot L^2)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'BFS from both ends simultaneously, and always expand the smaller frontier. The search stops as soon as the two frontiers touch. In wide graphs this reduces the explored nodes dramatically, since the two frontiers grow more slowly than one large one.',
      algorithm: ['1. Build the wildcard buckets as in Approach 2.','2. `beginSet = {beginWord}`, `endSet = {endWord}`, `visited` holds both, `level = 1`.','3. While both sets are non-empty: swap so `beginSet` is the smaller. Expand each word in `beginSet` through its buckets. If a neighbour is in `endSet`, return `level + 1`. Otherwise add unvisited neighbours to a new frontier, which replaces `beginSet`. Increment `level`.','4. Return `0`.'],
      code: "import java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.HashSet;\nimport java.util.List;\nimport java.util.Map;\nimport java.util.Set;\n\nclass Solution {\n    public int ladderLength(String beginWord, String endWord, List<String> wordList) {\n        Set<String> words = new HashSet<>(wordList);\n        if (!words.contains(endWord)) return 0;\n        Map<String, List<String>> buckets = new HashMap<>();\n        for (String w : wordList) {\n            for (int i = 0; i < w.length(); i++) {\n                String key = w.substring(0, i) + \"*\" + w.substring(i + 1);\n                buckets.computeIfAbsent(key, k -> new ArrayList<>()).add(w);\n            }\n        }\n        Set<String> beginSet = new HashSet<>(Set.of(beginWord));\n        Set<String> endSet = new HashSet<>(Set.of(endWord));\n        Set<String> visited = new HashSet<>(Set.of(beginWord, endWord));\n        int level = 1;\n        while (!beginSet.isEmpty() && !endSet.isEmpty()) {\n            if (beginSet.size() > endSet.size()) {\n                Set<String> tmp = beginSet;\n                beginSet = endSet;\n                endSet = tmp;\n            }\n            Set<String> next = new HashSet<>();\n            for (String cur : beginSet) {\n                for (int i = 0; i < cur.length(); i++) {\n                    String key = cur.substring(0, i) + \"*\" + cur.substring(i + 1);\n                    for (String nb : buckets.getOrDefault(key, List.of())) {\n                        if (endSet.contains(nb)) return level + 1;\n                        if (visited.add(nb)) next.add(nb);\n                    }\n                }\n            }\n            beginSet = next;\n            level++;\n        }\n        return 0;\n    }\n}",
      complexity: { time: 'O(N \\cdot L^2)', space: 'O(N \\cdot L^2)' }
    }
  ]
  },
  {
    slug: 'course-schedule',
    title: 'Course Schedule',
    difficulty: 'Medium',
    description: 'There are `numCourses` courses labelled `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` means course `bi` must be taken before course `ai`. Return `true` if you can finish all courses, and `false` otherwise.',
    examples: [
    {
      input: 'numCourses = 2',
      output: 'false',
      explanation: ''
    }
  ],
    constraints: '`1 <= numCourses <= 2000` - `0 <= prerequisites.length <= 5000` - `prerequisites[i].length == 2` - `0 <= ai, bi < numCourses` - `prerequisites[i]` values are unique.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Store edges in a matrix. Run DFS over the matrix. A node that is currently on the recursion stack and is reached again closes a cycle.',
      algorithm: ['1. `adj[b][a] = true` for each prerequisite `[a, b]`.','2. `state`: 0 unvisited, 1 on stack, 2 done. DFS: if a neighbour is on stack, return a cycle. Otherwise recurse into unvisited neighbours. Mark done on exit.'],
      code: "class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        boolean[][] adj = new boolean[numCourses][numCourses];\n        for (int[] p : prerequisites) adj[p[1]][p[0]] = true;\n        int[] state = new int[numCourses];\n        for (int i = 0; i < numCourses; i++) {\n            if (state[i] == 0 && hasCycle(adj, state, i)) return false;\n        }\n        return true;\n    }\n\n    private boolean hasCycle(boolean[][] adj, int[] state, int u) {\n        state[u] = 1;\n        for (int v = 0; v < adj.length; v++) {\n            if (!adj[u][v]) continue;\n            if (state[v] == 1) return true;\n            if (state[v] == 0 && hasCycle(adj, state, v)) return true;\n        }\n        state[u] = 2;\n        return false;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(n^2)' }
    },
    {
      label: 'Better',
      intuition: 'The same three-colour DFS, with an adjacency list so only real edges are visited. Colour 1 (on the current path) reached again means a back edge, which is a cycle.',
      algorithm: ['1. Build `adj` lists with edges `b -> a`.','2. DFS with colours as above, visiting only actual neighbours.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        List<List<Integer>> adj = new ArrayList<>();\n        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());\n        for (int[] p : prerequisites) adj.get(p[1]).add(p[0]);\n        int[] state = new int[numCourses];\n        for (int i = 0; i < numCourses; i++) {\n            if (state[i] == 0 && hasCycle(adj, state, i)) return false;\n        }\n        return true;\n    }\n\n    private boolean hasCycle(List<List<Integer>> adj, int[] state, int u) {\n        state[u] = 1;\n        for (int v : adj.get(u)) {\n            if (state[v] == 1) return true;\n            if (state[v] == 0 && hasCycle(adj, state, v)) return true;\n        }\n        state[u] = 2;\n        return false;\n    }\n}",
      complexity: { time: 'O(n + E)', space: 'O(n + E)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Repeatedly remove courses with no remaining prerequisites. These are the nodes with indegree zero. If every course can be removed, the graph is acyclic. If some remain, each of them waits on another, so a cycle must exist. This algorithm is iterative and needs no recursion.',
      algorithm: ['1. Compute `indegree[a]` for each course, and build the adjacency list.','2. Enqueue every course with indegree zero. Dequeue `u`, count it, and decrement the indegree of each dependent. Enqueue those that reach zero.','3. Return `processed == numCourses`.'],
      code: "import java.util.ArrayDeque;\nimport java.util.ArrayList;\nimport java.util.List;\nimport java.util.Queue;\n\nclass Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        List<List<Integer>> adj = new ArrayList<>();\n        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());\n        int[] indegree = new int[numCourses];\n        for (int[] p : prerequisites) {\n            adj.get(p[1]).add(p[0]);\n            indegree[p[0]]++;\n        }\n        Queue<Integer> q = new ArrayDeque<>();\n        for (int i = 0; i < numCourses; i++) {\n            if (indegree[i] == 0) q.offer(i);\n        }\n        int processed = 0;\n        while (!q.isEmpty()) {\n            int u = q.poll();\n            processed++;\n            for (int v : adj.get(u)) {\n                if (--indegree[v] == 0) q.offer(v);\n            }\n        }\n        return processed == numCourses;\n    }\n}",
      complexity: { time: 'O(n + E)', space: 'O(n + E)' }
    }
  ]
  },
  {
    slug: 'course-schedule-ii',
    title: 'Course Schedule II',
    difficulty: 'Medium',
    description: 'There are `numCourses` courses labelled `0` to `numCourses - 1`. `prerequisites[i] = [ai, bi]` means course `bi` must be taken before course `ai`. Return an ordering of courses you can take to finish all courses. If it is impossible, return an empty array. If there are multiple valid orderings, return any one of them.',
    examples: [
    {
      input: 'numCourses = 4',
      output: '[0,1,2,3]',
      explanation: ''
    },
    {
      input: 'numCourses = 1',
      output: '[0]',
      explanation: ''
    }
  ],
    constraints: '`1 <= numCourses <= 2000` - `0 <= prerequisites.length <= numCourses * (numCourses - 1)` - `prerequisites[i].length == 2` - `0 <= ai, bi < numCourses` - `ai != bi`, and all pairs are distinct.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'In each pass, scan all unfinished courses and take every course whose prerequisites are all finished. If a full pass takes nothing, the remaining courses are blocked by a cycle.',
      algorithm: ['1. Build `prereqs[c]`, the list of prerequisites of each course.','2. While some course is unfinished: scan every unfinished course. If all its prerequisites are finished, record it and mark it finished. If a pass records nothing, return `[]`.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public int[] findOrder(int numCourses, int[][] prerequisites) {\n        List<List<Integer>> prereqs = new ArrayList<>();\n        for (int i = 0; i < numCourses; i++) prereqs.add(new ArrayList<>());\n        for (int[] p : prerequisites) prereqs.get(p[0]).add(p[1]);\n\n        boolean[] done = new boolean[numCourses];\n        int[] order = new int[numCourses];\n        int count = 0;\n        while (count < numCourses) {\n            boolean progress = false;\n            for (int c = 0; c < numCourses; c++) {\n                if (done[c]) continue;\n                boolean ready = true;\n                for (int p : prereqs.get(c)) {\n                    if (!done[p]) {\n                        ready = false;\n                        break;\n                    }\n                }\n                if (ready) {\n                    done[c] = true;\n                    order[count++] = c;\n                    progress = true;\n                }\n            }\n            if (!progress) return new int[0];\n        }\n        return order;\n    }\n}",
      complexity: { time: 'O(n \\cdot (n + E))', space: 'O(n + E)' }
    },
    {
      label: 'Better',
      intuition: 'In a DAG, a node finishes only after all of its dependencies finish. The DFS finishing order is therefore the reverse of a topological order when edges point from prerequisite to course. Detect cycles with three colours, and return empty on a back edge.',
      algorithm: ['1. Build the adjacency list `adj[b]` containing `a` for each prerequisite `[a, b]`.','2. DFS from each unvisited node. When a node finishes, append it to `order`. A node on the current stack reached again means a cycle.','3. Reverse `order` and return it.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    private List<List<Integer>> adj;\n    private int[] state;\n    private int[] order;\n    private int idx;\n    private boolean cycle;\n\n    public int[] findOrder(int numCourses, int[][] prerequisites) {\n        adj = new ArrayList<>();\n        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());\n        for (int[] p : prerequisites) adj.get(p[1]).add(p[0]);\n        state = new int[numCourses];\n        order = new int[numCourses];\n        idx = numCourses - 1;\n        for (int i = 0; i < numCourses && !cycle; i++) {\n            if (state[i] == 0) dfs(i);\n        }\n        return cycle ? new int[0] : order;\n    }\n\n    private void dfs(int u) {\n        state[u] = 1;\n        for (int v : adj.get(u)) {\n            if (cycle) return;\n            if (state[v] == 1) {\n                cycle = true;\n                return;\n            }\n            if (state[v] == 0) dfs(v);\n        }\n        state[u] = 2;\n        order[idx--] = u;\n    }\n}",
      complexity: { time: 'O(n + E)', space: 'O(n + E)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Start from courses with no prerequisites. Each time a course is taken, decrement the indegree of its dependents, and enqueue any that reach zero. The order in which they are dequeued is a valid topological order. If fewer than `n` courses are dequeued, a cycle blocks the rest.',
      algorithm: ['1. Build `adj` and `indegree`.','2. Enqueue all zero-indegree courses. Dequeue `u`, append it to `order`, and decrement its dependents.','3. Return `order` if its length is `n`, else an empty array.'],
      code: "import java.util.ArrayDeque;\nimport java.util.ArrayList;\nimport java.util.List;\nimport java.util.Queue;\n\nclass Solution {\n    public int[] findOrder(int numCourses, int[][] prerequisites) {\n        List<List<Integer>> adj = new ArrayList<>();\n        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());\n        int[] indegree = new int[numCourses];\n        for (int[] p : prerequisites) {\n            adj.get(p[1]).add(p[0]);\n            indegree[p[0]]++;\n        }\n        Queue<Integer> q = new ArrayDeque<>();\n        for (int i = 0; i < numCourses; i++) {\n            if (indegree[i] == 0) q.offer(i);\n        }\n        int[] order = new int[numCourses];\n        int count = 0;\n        while (!q.isEmpty()) {\n            int u = q.poll();\n            order[count++] = u;\n            for (int v : adj.get(u)) {\n                if (--indegree[v] == 0) q.offer(v);\n            }\n        }\n        return count == numCourses ? order : new int[0];\n    }\n}",
      complexity: { time: 'O(n + E)', space: 'O(n + E)' }
    }
  ]
  },
  {
    slug: 'redundant-connection',
    title: 'Redundant Connection',
    difficulty: 'Medium',
    description: 'A tree of `n` nodes labelled `1` to `n` was built with one extra edge added. The graph is given as `edges` of length `n`, where `edges[i] = [ai, bi]` is an edge between `ai` and `bi`. Return the edge that can be removed so that the resulting graph is a tree of `n` nodes. If multiple answers exist, return the one that occurs last in the input array.',
    examples: [
    {
      input: 'edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]',
      output: '[1,4]',
      explanation: ''
    }
  ],
    constraints: '`n == edges.length` - `3 <= n <= 1000` - `edges[i].length == 2` - `1 <= ai < bi <= edges.length` - `ai != bi`, and there are no repeated edges. - The graph is connected and has exactly one cycle.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Removing a cycle edge leaves the graph connected. Removing a bridge (a non-cycle edge) disconnects it. Try edges from last to first and return the first whose removal leaves the graph connected.',
      algorithm: ['1. For `i` from `n-1` down to `0`:','- Build the adjacency list from all edges except `i`.','- DFS from node `1`. If all `n` nodes are reached, return `edges[i]`.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public int[] findRedundantConnection(int[][] edges) {\n        int n = edges.length;\n        for (int skip = n - 1; skip >= 0; skip--) {\n            List<List<Integer>> adj = new ArrayList<>();\n            for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());\n            for (int i = 0; i < n; i++) {\n                if (i == skip) continue;\n                adj.get(edges[i][0]).add(edges[i][1]);\n                adj.get(edges[i][1]).add(edges[i][0]);\n            }\n            boolean[] visited = new boolean[n + 1];\n            dfs(adj, visited, 1);\n            boolean connected = true;\n            for (int i = 1; i <= n; i++) {\n                if (!visited[i]) {\n                    connected = false;\n                    break;\n                }\n            }\n            if (connected) return edges[skip];\n        }\n        return new int[0];\n    }\n\n    private void dfs(List<List<Integer>> adj, boolean[] visited, int u) {\n        visited[u] = true;\n        for (int v : adj.get(u)) {\n            if (!visited[v]) dfs(adj, visited, v);\n        }\n    }\n}",
      complexity: { time: 'O(n \\cdot (n + E))', space: 'O(n + E)' }
    },
    {
      label: 'Better',
      intuition: 'Add edges one at a time. Before adding edge `(u, v)`, check whether `u` can already reach `v` through earlier edges. If it can, the new edge closes a cycle, and it is the answer. Otherwise add it to the graph.',
      algorithm: ['1. Maintain an adjacency list of accepted edges.','2. For each edge `(u, v)`: DFS from `u` with a fresh visited array. If `v` is reached, return `[u, v]`. Otherwise add the edge.'],
      code: "import java.util.ArrayList;\nimport java.util.List;\n\nclass Solution {\n    public int[] findRedundantConnection(int[][] edges) {\n        int n = edges.length;\n        List<List<Integer>> adj = new ArrayList<>();\n        for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());\n        for (int[] e : edges) {\n            if (reachable(adj, new boolean[n + 1], e[0], e[1])) return e;\n            adj.get(e[0]).add(e[1]);\n            adj.get(e[1]).add(e[0]);\n        }\n        return new int[0];\n    }\n\n    private boolean reachable(List<List<Integer>> adj, boolean[] visited, int u, int target) {\n        if (u == target) return true;\n        visited[u] = true;\n        for (int v : adj.get(u)) {\n            if (!visited[v] && reachable(adj, visited, v, target)) return true;\n        }\n        return false;\n    }\n}",
      complexity: { time: 'O(n \\cdot (n + E))', space: 'O(n + E)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'DSU answers "are these two nodes already connected?" in near-constant time. The first edge whose endpoints share a set closes the cycle, and this is the answer because edges are processed in input order.',
      algorithm: ['1. Initialise `parent[i] = i` for `i` in `1..n`.','2. For each edge `(u, v)`: if `find(u) == find(v)`, return `[u, v]`. Otherwise union them.'],
      code: "class Solution {\n    private int[] parent;\n\n    public int[] findRedundantConnection(int[][] edges) {\n        int n = edges.length;\n        parent = new int[n + 1];\n        for (int i = 0; i <= n; i++) parent[i] = i;\n        for (int[] e : edges) {\n            int a = find(e[0]), b = find(e[1]);\n            if (a == b) return e;\n            parent[a] = b;\n        }\n        return new int[0];\n    }\n\n    private int find(int x) {\n        while (parent[x] != x) {\n            parent[x] = parent[parent[x]];\n            x = parent[x];\n        }\n        return x;\n    }\n}",
      complexity: { time: 'O(n \\cdot \\alpha(n))', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    description: 'You are climbing a staircase that takes `n` steps to reach the top. Each time you can climb either `1` or `2` steps. Return the number of distinct ways to climb to the top.',
    examples: [
    {
      input: 'n = 3',
      output: '3',
      explanation: '1+1+1'
    }
  ],
    constraints: '`1 <= n <= 45`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Apply the recurrence directly. Many subproblems repeat, so this grows exponentially.',
      algorithm: ['1. If `n <= 2`, return `n`.','2. Otherwise return `climb(n-1) + climb(n-2)`.'],
      code: "class Solution {\n    public int climbStairs(int n) {\n        if (n <= 2) return n;\n        return climbStairs(n - 1) + climbStairs(n - 2);\n    }\n}",
      complexity: { time: 'O(\\phi^n)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: 'Store each computed value in an array, so every subproblem is solved once.',
      algorithm: ['1. Allocate `memo[n+1]`.','2. Return `solve(n)`, which checks `memo` before recursing.'],
      code: "class Solution {\n    public int climbStairs(int n) {\n        int[] memo = new int[n + 1];\n        return solve(n, memo);\n    }\n\n    private int solve(int n, int[] memo) {\n        if (n <= 2) return n;\n        if (memo[n] != 0) return memo[n];\n        memo[n] = solve(n - 1, memo) + solve(n - 2, memo);\n        return memo[n];\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Each value depends only on the previous two. Keep just those two values and roll them forward.',
      algorithm: ['1. If `n <= 2`, return `n`.','2. `a = 1`, `b = 2`. For `i` from `3` to `n`: `c = a + b`, `a = b`, `b = c`.','3. Return `b`.'],
      code: "class Solution {\n    public int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int c = a + b;\n            a = b;\n            b = c;\n        }\n        return b;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'min-cost-climbing-stairs',
    title: 'Min Cost Climbing Stairs',
    difficulty: 'Easy',
    description: 'You are given an integer array `cost`, where `cost[i]` is the cost of step `i`. Once you pay the cost of a step, you can climb one or two steps from it. You may start at index `0` or index `1`. Return the minimum cost to reach the top, which is just past the last step.',
    examples: [
    {
      input: 'cost = [1,100,1,1,1,100,1,1,100,1]',
      output: '6',
      explanation: ''
    }
  ],
    constraints: '`2 <= cost.length <= 1000` - `0 <= cost[i] <= 999`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Compute `f(i)` directly from the recurrence, recursing into both options at each step.',
      algorithm: ['1. If `i >= n`, return `0`.','2. Return `cost[i] + min(f(i+1), f(i+2))`.','3. The answer is `min(f(0), f(1))`.'],
      code: "class Solution {\n    public int minCostClimbingStairs(int[] cost) {\n        return Math.min(f(cost, 0), f(cost, 1));\n    }\n\n    private int f(int[] cost, int i) {\n        if (i >= cost.length) return 0;\n        return cost[i] + Math.min(f(cost, i + 1), f(cost, i + 2));\n    }\n}",
      complexity: { time: 'O(2^n)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: 'Cache `f(i)` in an array, so each index is computed once.',
      algorithm: ['1. Allocate `memo[n]` filled with `-1`.','2. `f(i)` returns the cached value if present, otherwise computes and stores it.'],
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int minCostClimbingStairs(int[] cost) {\n        int[] memo = new int[cost.length];\n        Arrays.fill(memo, -1);\n        return Math.min(f(cost, 0, memo), f(cost, 1, memo));\n    }\n\n    private int f(int[] cost, int i, int[] memo) {\n        if (i >= cost.length) return 0;\n        if (memo[i] != -1) return memo[i];\n        memo[i] = cost[i] + Math.min(f(cost, i + 1, memo), f(cost, i + 2, memo));\n        return memo[i];\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Compute from the end. Each `f(i)` needs only `f(i+1)` and `f(i+2)`, so two variables suffice.',
      algorithm: ['1. `a = f(n) = 0`, `b = f(n+1) = 0`.','2. For `i` from `n-1` down to `0`: `cur = cost[i] + min(a, b)`, then `b = a`, `a = cur`.','3. Return `min(a, b)`, which is `min(f(0), f(1))`.'],
      code: "class Solution {\n    public int minCostClimbingStairs(int[] cost) {\n        int a = 0, b = 0;\n        for (int i = cost.length - 1; i >= 0; i--) {\n            int cur = cost[i] + Math.min(a, b);\n            b = a;\n            a = cur;\n        }\n        return Math.min(a, b);\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'house-robber',
    title: 'House Robber',
    difficulty: 'Medium',
    description: 'You are a robber planning to rob houses along a street. Each house has an amount of money `nums[i]`. Adjacent houses have security systems that alert the police if two adjacent houses are robbed on the same night. Return the maximum amount you can rob without alerting the police.',
    examples: [
    {
      input: 'nums = [2,7,9,3,1]',
      output: '12',
      explanation: ''
    }
  ],
    constraints: '`1 <= nums.length <= 100` - `0 <= nums[i] <= 400`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Apply the recurrence directly from the first house.',
      algorithm: ['1. If `i >= n`, return `0`.','2. Return `max(rob(i+1), nums[i] + rob(i+2))`.'],
      code: "class Solution {\n    public int rob(int[] nums) {\n        return solve(nums, 0);\n    }\n\n    private int solve(int[] nums, int i) {\n        if (i >= nums.length) return 0;\n        return Math.max(solve(nums, i + 1), nums[i] + solve(nums, i + 2));\n    }\n}",
      complexity: { time: 'O(2^n)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: 'Cache `rob(i)` for each house.',
      algorithm: ['1. Allocate `memo[n]` filled with `-1`.','2. Compute `rob(i)` with caching.'],
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int rob(int[] nums) {\n        int[] memo = new int[nums.length];\n        Arrays.fill(memo, -1);\n        return solve(nums, 0, memo);\n    }\n\n    private int solve(int[] nums, int i, int[] memo) {\n        if (i >= nums.length) return 0;\n        if (memo[i] != -1) return memo[i];\n        memo[i] = Math.max(solve(nums, i + 1, memo), nums[i] + solve(nums, i + 2, memo));\n        return memo[i];\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Process houses left to right. Keep the best total up to the previous house and up to the house before it.',
      algorithm: ['1. `prev2 = 0`, `prev1 = 0`.','2. For each `x` in `nums`: `cur = max(prev1, prev2 + x)`, then `prev2 = prev1`, `prev1 = cur`.','3. Return `prev1`.'],
      code: "class Solution {\n    public int rob(int[] nums) {\n        int prev2 = 0, prev1 = 0;\n        for (int x : nums) {\n            int cur = Math.max(prev1, prev2 + x);\n            prev2 = prev1;\n            prev1 = cur;\n        }\n        return prev1;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'house-robber-ii',
    title: 'House Robber II',
    difficulty: 'Medium',
    description: 'This is House Robber with the houses arranged in a circle. The first and last houses are adjacent, so they cannot both be robbed. Return the maximum amount you can rob.',
    examples: [
    {
      input: 'nums = [1,2,3,1]',
      output: '4',
      explanation: ''
    },
    {
      input: 'nums = [1,2,3]',
      output: '3',
      explanation: ''
    }
  ],
    constraints: '`1 <= nums.length <= 100` - `0 <= nums[i] <= 1000`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Run the linear recursion on each of the two ranges without caching.',
      algorithm: ['1. If `n == 1`, return `nums[0]`.','2. Return `max(solve(0, n-2), solve(1, n-1))`, where `solve(i, end)` is the linear recurrence over `[i, end]`.'],
      code: "class Solution {\n    public int rob(int[] nums) {\n        int n = nums.length;\n        if (n == 1) return nums[0];\n        return Math.max(solve(nums, 0, n - 2), solve(nums, 1, n - 1));\n    }\n\n    private int solve(int[] nums, int i, int end) {\n        if (i > end) return 0;\n        return Math.max(solve(nums, i + 1, end), nums[i] + solve(nums, i + 2, end));\n    }\n}",
      complexity: { time: 'O(2^n)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: 'Cache results for each range. The two ranges have different bounds, so each linear pass gets its own cache.',
      algorithm: ['1. Handle `n == 1`.','2. For each range, run memoised recursion with a fresh `memo` array indexed by start position.'],
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int rob(int[] nums) {\n        int n = nums.length;\n        if (n == 1) return nums[0];\n        return Math.max(solve(nums, 0, n - 2), solve(nums, 1, n - 1));\n    }\n\n    private int solve(int[] nums, int lo, int hi) {\n        int[] memo = new int[nums.length];\n        Arrays.fill(memo, -1);\n        return dfs(nums, lo, hi, memo);\n    }\n\n    private int dfs(int[] nums, int i, int end, int[] memo) {\n        if (i > end) return 0;\n        if (memo[i] != -1) return memo[i];\n        memo[i] = Math.max(dfs(nums, i + 1, end, memo), nums[i] + dfs(nums, i + 2, end, memo));\n        return memo[i];\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Apply the rolling House Robber to each range directly. No arrays are needed.',
      algorithm: ['1. Handle `n == 1`.','2. `robLinear(nums, 0, n-2)` and `robLinear(nums, 1, n-1)`, each with rolling variables. Return the maximum.'],
      code: "class Solution {\n    public int rob(int[] nums) {\n        int n = nums.length;\n        if (n == 1) return nums[0];\n        return Math.max(robLinear(nums, 0, n - 2), robLinear(nums, 1, n - 1));\n    }\n\n    private int robLinear(int[] nums, int lo, int hi) {\n        int prev2 = 0, prev1 = 0;\n        for (int i = lo; i <= hi; i++) {\n            int cur = Math.max(prev1, prev2 + nums[i]);\n            prev2 = prev1;\n            prev1 = cur;\n        }\n        return prev1;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'longest-palindromic-substring',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    description: 'Given a string `s`, return the longest palindromic substring in `s`.',
    examples: [
    {
      input: 's = "cbbd"',
      output: '"bb"',
      explanation: ''
    }
  ],
    constraints: '`1 <= s.length <= 1000` - `s` consists of only digits and English letters.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Try every substring and keep the longest palindrome.',
      algorithm: ['1. For each start `i` and end `j >= i`, check whether `s[i..j]` is a palindrome.','2. Track the longest.'],
      code: "class Solution {\n    public String longestPalindrome(String s) {\n        int bestL = 0, bestLen = 1;\n        int n = s.length();\n        for (int i = 0; i < n; i++) {\n            for (int j = i; j < n; j++) {\n                if (j - i + 1 > bestLen && isPal(s, i, j)) {\n                    bestL = i;\n                    bestLen = j - i + 1;\n                }\n            }\n        }\n        return s.substring(bestL, bestL + bestLen);\n    }\n\n    private boolean isPal(String s, int l, int r) {\n        while (l < r) {\n            if (s.charAt(l++) != s.charAt(r--)) return false;\n        }\n        return true;\n    }\n}",
      complexity: { time: 'O(n^3)', space: 'O(1)' }
    },
    {
      label: 'Better',
      intuition: '`s[i..j]` is a palindrome when `s[i] == s[j]` and `s[i+1..j-1]` is a palindrome. Fill a table by increasing length, so each entry uses already computed shorter entries.',
      algorithm: ['1. `dp[i][i] = true`. `dp[i][i+1] = s[i] == s[i+1]`.','2. For longer lengths, `dp[i][j] = s[i] == s[j] && dp[i+1][j-1]`.','3. Track the longest `true` entry.'],
      code: "class Solution {\n    public String longestPalindrome(String s) {\n        int n = s.length();\n        boolean[][] dp = new boolean[n][n];\n        int bestL = 0, bestLen = 1;\n        for (int len = 1; len <= n; len++) {\n            for (int i = 0; i + len - 1 < n; i++) {\n                int j = i + len - 1;\n                if (s.charAt(i) == s.charAt(j) && (len <= 2 || dp[i + 1][j - 1])) {\n                    dp[i][j] = true;\n                    if (len > bestLen) {\n                        bestL = i;\n                        bestLen = len;\n                    }\n                }\n            }\n        }\n        return s.substring(bestL, bestL + bestLen);\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(n^2)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Each palindrome has a centre. Expand from each of the `2n - 1` centres while the ends match, and keep the longest. No table is needed.',
      algorithm: ['1. For each centre `i`, expand `(i, i)` for odd length and `(i, i+1)` for even length.','2. Each expansion moves `l` left and `r` right while `s[l] == s[r]`.','3. Keep the longest range found.'],
      code: "class Solution {\n    private int start = 0, maxLen = 1;\n\n    public String longestPalindrome(String s) {\n        for (int i = 0; i < s.length(); i++) {\n            expand(s, i, i);\n            expand(s, i, i + 1);\n        }\n        return s.substring(start, start + maxLen);\n    }\n\n    private void expand(String s, int l, int r) {\n        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {\n            l--;\n            r++;\n        }\n        int len = r - l - 1;\n        if (len > maxLen) {\n            maxLen = len;\n            start = l + 1;\n        }\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'palindromic-substrings',
    title: 'Palindromic Substrings',
    difficulty: 'Medium',
    description: 'Given a string `s`, return the number of palindromic substrings in it. A substring is counted each time it appears at a different position.',
    examples: [
    {
      input: 's = "aaa"',
      output: '6',
      explanation: '"a"'
    }
  ],
    constraints: '`1 <= s.length <= 1000` - `s` consists of lowercase English letters.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Test every substring and count the palindromes.',
      algorithm: ['1. For each `i <= j`, check `s[i..j]` and increment the count if it is a palindrome.'],
      code: "class Solution {\n    public int countSubstrings(String s) {\n        int count = 0, n = s.length();\n        for (int i = 0; i < n; i++) {\n            for (int j = i; j < n; j++) {\n                if (isPal(s, i, j)) count++;\n            }\n        }\n        return count;\n    }\n\n    private boolean isPal(String s, int l, int r) {\n        while (l < r) {\n            if (s.charAt(l++) != s.charAt(r--)) return false;\n        }\n        return true;\n    }\n}",
      complexity: { time: 'O(n^3)', space: 'O(1)' }
    },
    {
      label: 'Better',
      intuition: 'Use the same table as in 12.5. Every `true` entry is one palindromic substring.',
      algorithm: ['1. Fill `dp[i][j]` by increasing length, as in 12.5.','2. Count the `true` entries.'],
      code: "class Solution {\n    public int countSubstrings(String s) {\n        int n = s.length(), count = 0;\n        boolean[][] dp = new boolean[n][n];\n        for (int len = 1; len <= n; len++) {\n            for (int i = 0; i + len - 1 < n; i++) {\n                int j = i + len - 1;\n                if (s.charAt(i) == s.charAt(j) && (len <= 2 || dp[i + 1][j - 1])) {\n                    dp[i][j] = true;\n                    count++;\n                }\n            }\n        }\n        return count;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(n^2)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Each centre contributes one palindrome for each successful expansion step. Count those steps directly.',
      algorithm: ['1. For each centre, expand for odd and even lengths. Each successful step increments the count.'],
      code: "class Solution {\n    private int count = 0;\n\n    public int countSubstrings(String s) {\n        for (int i = 0; i < s.length(); i++) {\n            expand(s, i, i);\n            expand(s, i, i + 1);\n        }\n        return count;\n    }\n\n    private void expand(String s, int l, int r) {\n        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {\n            count++;\n            l--;\n            r++;\n        }\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'decode-ways',
    title: 'Decode Ways',
    difficulty: 'Medium',
    description: 'A message containing letters `A-Z` is encoded as numbers, where `\'A\' -> "1"` through `\'Z\' -> "26"`. Given a string `s` of digits, return the number of ways to decode it. A string starting with `\'0\'` that cannot be decoded gives `0`.',
    examples: [
    {
      input: 's = "226"',
      output: '3',
      explanation: '"BBF"'
    },
    {
      input: 's = "06"',
      output: '0',
      explanation: '"06"'
    }
  ],
    constraints: '`1 <= s.length <= 100` - `s` contains only digits and may contain leading zeros.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Apply the recurrence from the start of the string.',
      algorithm: ['1. If `i == n`, return `1`.','2. If `s[i] == \'0\'`, return `0`.','3. Add `ways(i+1)`. If `s[i..i+1]` is a valid two-digit code, add `ways(i+2)`.'],
      code: "class Solution {\n    public int numDecodings(String s) {\n        return ways(s, 0);\n    }\n\n    private int ways(String s, int i) {\n        if (i == s.length()) return 1;\n        if (s.charAt(i) == '0') return 0;\n        int res = ways(s, i + 1);\n        if (i + 1 < s.length() && valid2(s, i)) {\n            res += ways(s, i + 2);\n        }\n        return res;\n    }\n\n    private boolean valid2(String s, int i) {\n        char a = s.charAt(i), b = s.charAt(i + 1);\n        return a == '1' || (a == '2' && b <= '6');\n    }\n}",
      complexity: { time: 'O(2^n)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: '`ways(i)` depends only on `i`, so cache it.',
      algorithm: ['1. Allocate `memo[n]` filled with `-1`.','2. Compute `ways(i)` with caching, using the same rules as Approach 1.'],
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int numDecodings(String s) {\n        int[] memo = new int[s.length()];\n        Arrays.fill(memo, -1);\n        return ways(s, 0, memo);\n    }\n\n    private int ways(String s, int i, int[] memo) {\n        if (i == s.length()) return 1;\n        if (s.charAt(i) == '0') return 0;\n        if (memo[i] != -1) return memo[i];\n        int res = ways(s, i + 1, memo);\n        if (i + 1 < s.length() && valid2(s, i)) {\n            res += ways(s, i + 2, memo);\n        }\n        memo[i] = res;\n        return res;\n    }\n\n    private boolean valid2(String s, int i) {\n        char a = s.charAt(i), b = s.charAt(i + 1);\n        return a == '1' || (a == '2' && b <= '6');\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Compute from the end. Each step needs only the next two values, so keep two variables.',
      algorithm: ['1. `next1 = 1` (ways from `n`), `next2 = 0` (ways from `n+1`).','2. For `i` from `n-1` down to `0`: if `s[i] == \'0\'`, `cur = 0`. Otherwise `cur = next1`, and add `next2` if the two-digit group is valid. Then shift the variables.','3. Return `next1`.'],
      code: "class Solution {\n    public int numDecodings(String s) {\n        int n = s.length();\n        int next1 = 1, next2 = 0;\n        for (int i = n - 1; i >= 0; i--) {\n            int cur = 0;\n            if (s.charAt(i) != '0') {\n                cur = next1;\n                if (i + 1 < n) {\n                    char a = s.charAt(i), b = s.charAt(i + 1);\n                    if (a == '1' || (a == '2' && b <= '6')) cur += next2;\n                }\n            }\n            next2 = next1;\n            next1 = cur;\n        }\n        return next1;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'coin-change',
    title: 'Coin Change',
    difficulty: 'Medium',
    description: 'You are given an integer array `coins` representing coins of different denominations, and an integer `amount`. Return the fewest number of coins needed to make up `amount`. If that amount cannot be made, return `-1`. You have an infinite number of each coin.',
    examples: [
    {
      input: 'coins = [2]',
      output: '-1',
      explanation: ''
    },
    {
      input: 'coins = [1]',
      output: '0',
      explanation: ''
    }
  ],
    constraints: '`1 <= coins.length <= 12` - `1 <= coins[i] <= 2^31 - 1` - `0 <= amount <= 10^4`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Try every coin at every step. This explores every combination, so it is exponential, and only practical for small amounts.',
      algorithm: ['1. If `rem == 0`, return `0`. If `rem < 0`, return `-1` (impossible).','2. For each coin, compute `r = solve(rem - c)`. If `r >= 0`, take `1 + r` as a candidate.','3. Return the minimum candidate, or `-1`.'],
      code: "class Solution {\n    public int coinChange(int[] coins, int amount) {\n        return solve(coins, amount);\n    }\n\n    private int solve(int[] coins, int rem) {\n        if (rem == 0) return 0;\n        if (rem < 0) return -1;\n        int best = Integer.MAX_VALUE;\n        for (int c : coins) {\n            int r = solve(coins, rem - c);\n            if (r >= 0) best = Math.min(best, r + 1);\n        }\n        return best == Integer.MAX_VALUE ? -1 : best;\n    }\n}",
      complexity: { time: 'O(n^{A/c_{\\min}})', space: 'O(A / c_{\\min})' }
    },
    {
      label: 'Better',
      intuition: '`solve(rem)` depends only on `rem`, so cache the result for each remaining amount.',
      algorithm: ['1. Allocate `memo[amount+1]` filled with `-2` (unknown).','2. Compute `solve(rem)` with caching, using the same rules as Approach 1.'],
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int coinChange(int[] coins, int amount) {\n        int[] memo = new int[amount + 1];\n        Arrays.fill(memo, -2);\n        return solve(coins, amount, memo);\n    }\n\n    private int solve(int[] coins, int rem, int[] memo) {\n        if (rem == 0) return 0;\n        if (rem < 0) return -1;\n        if (memo[rem] != -2) return memo[rem];\n        int best = Integer.MAX_VALUE;\n        for (int c : coins) {\n            int r = solve(coins, rem - c, memo);\n            if (r >= 0) best = Math.min(best, r + 1);\n        }\n        memo[rem] = best == Integer.MAX_VALUE ? -1 : best;\n        return memo[rem];\n    }\n}",
      complexity: { time: 'O(A \\cdot n)', space: 'O(A)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Fill `dp[a]` for `a` from `1` to `amount`, using only smaller amounts already computed. Use `amount + 1` as an infinity sentinel, since no valid answer can exceed `amount`.',
      algorithm: ['1. `dp[0] = 0`, others `amount + 1`.','2. For each `a` from `1` to `amount`, for each coin `c <= a`, set `dp[a] = min(dp[a], dp[a-c] + 1)`.','3. Return `dp[amount]` if it is at most `amount`, else `-1`.'],
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int coinChange(int[] coins, int amount) {\n        int inf = amount + 1;\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, inf);\n        dp[0] = 0;\n        for (int a = 1; a <= amount; a++) {\n            for (int c : coins) {\n                if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n}",
      complexity: { time: 'O(A \\cdot n)', space: 'O(A)' }
    }
  ]
  },
  {
    slug: 'maximum-product-subarray',
    title: 'Maximum Product Subarray',
    difficulty: 'Medium',
    description: 'Given an integer array `nums`, find a contiguous subarray that has the largest product, and return that product.',
    examples: [
    {
      input: 'nums = [-2,0,-1]',
      output: '0',
      explanation: ''
    }
  ],
    constraints: '`1 <= nums.length <= 2 * 10^4` - `-10 <= nums[i] <= 10` - The product of any subarray fits in a 32-bit integer.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Compute the product of every subarray by extending from each start.',
      algorithm: ['1. For each start `i`, multiply forward through `j`, tracking the largest product.'],
      code: "class Solution {\n    public int maxProduct(int[] nums) {\n        int best = Integer.MIN_VALUE;\n        for (int i = 0; i < nums.length; i++) {\n            int prod = 1;\n            for (int j = i; j < nums.length; j++) {\n                prod *= nums[j];\n                best = Math.max(best, prod);\n            }\n        }\n        return best;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(1)' }
    },
    {
      label: 'Better',
      intuition: 'Store `maxEnd[i]` and `minEnd[i]`, the largest and smallest products of subarrays ending at `i`. Each is the best among `nums[i]` alone, and `nums[i]` times the previous max or min.',
      algorithm: ['1. `maxEnd[0] = minEnd[0] = nums[0]`.','2. For `i >= 1`: `maxEnd[i] = max(nums[i], nums[i]*maxEnd[i-1], nums[i]*minEnd[i-1])`, and similarly for `minEnd`.','3. Return the maximum of `maxEnd`.'],
      code: "class Solution {\n    public int maxProduct(int[] nums) {\n        int n = nums.length;\n        int[] maxEnd = new int[n], minEnd = new int[n];\n        maxEnd[0] = minEnd[0] = nums[0];\n        int best = nums[0];\n        for (int i = 1; i < n; i++) {\n            int x = nums[i];\n            maxEnd[i] = Math.max(x, Math.max(x * maxEnd[i - 1], x * minEnd[i - 1]));\n            minEnd[i] = Math.min(x, Math.min(x * maxEnd[i - 1], x * minEnd[i - 1]));\n            best = Math.max(best, maxEnd[i]);\n        }\n        return best;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Each step needs only the previous max and min, so keep two running values.',
      algorithm: ['1. `curMax = curMin = best = nums[0]`.','2. For each `x` from index `1`: compute new max and min from `x`, `x*curMax`, `x*curMin`, then update `best`.'],
      code: "class Solution {\n    public int maxProduct(int[] nums) {\n        int curMax = nums[0], curMin = nums[0], best = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            int x = nums[i];\n            int a = x * curMax, b = x * curMin;\n            curMax = Math.max(x, Math.max(a, b));\n            curMin = Math.min(x, Math.min(a, b));\n            best = Math.max(best, curMax);\n        }\n        return best;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'word-break',
    title: 'Word Break',
    difficulty: 'Medium',
    description: 'Given a string `s` and a dictionary `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words. The same word may be reused.',
    examples: [
    {
      input: 's = "applepenapple"',
      output: 'true',
      explanation: 'apple pen apple'
    },
    {
      input: 's = "catsandog"',
      output: 'false',
      explanation: ''
    }
  ],
    constraints: '`1 <= s.length <= 300` - `1 <= wordDict.length <= 1000` - `1 <= wordDict[i].length <= 20` - `s` and `wordDict[i]` consist of lowercase English letters.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'From each position, try every dictionary word that starts there, and recurse on the remainder.',
      algorithm: ['1. If `start == n`, return `true`.','2. For each `end` from `start+1` to `n`, if `s[start..end)` is in the dictionary and `solve(end)` is true, return `true`.'],
      code: "import java.util.Set;\nimport java.util.HashSet;\nimport java.util.List;\n\nclass Solution {\n    public boolean wordBreak(String s, List<String> wordDict) {\n        Set<String> dict = new HashSet<>(wordDict);\n        return solve(s, 0, dict);\n    }\n\n    private boolean solve(String s, int start, Set<String> dict) {\n        if (start == s.length()) return true;\n        for (int end = start + 1; end <= s.length(); end++) {\n            if (dict.contains(s.substring(start, end)) && solve(s, end, dict)) return true;\n        }\n        return false;\n    }\n}",
      complexity: { time: 'O(2^n)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: '`solve(start)` depends only on `start`, so memoise it.',
      algorithm: ['1. Allocate `memo[n]` of `Boolean`, using `null` as unknown.','2. Compute `solve(start)` with caching.'],
      code: "import java.util.HashSet;\nimport java.util.List;\nimport java.util.Set;\n\nclass Solution {\n    public boolean wordBreak(String s, List<String> wordDict) {\n        Set<String> dict = new HashSet<>(wordDict);\n        Boolean[] memo = new Boolean[s.length()];\n        return solve(s, 0, dict, memo);\n    }\n\n    private boolean solve(String s, int start, Set<String> dict, Boolean[] memo) {\n        if (start == s.length()) return true;\n        if (memo[start] != null) return memo[start];\n        boolean ok = false;\n        for (int end = start + 1; end <= s.length() && !ok; end++) {\n            if (dict.contains(s.substring(start, end)) && solve(s, end, dict, memo)) ok = true;\n        }\n        memo[start] = ok;\n        return ok;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Build `dp[i]`, true when `s[0..i)` can be segmented. Only substrings no longer than the longest word can be words, so each `i` checks at most `maxLen` candidates.',
      algorithm: ['1. `dp[0] = true`. Compute `maxLen` from the dictionary.','2. For `i` from `1` to `n`, for `j` from `i - 1` down to `max(0, i - maxLen)`: if `dp[j]` and `s[j..i)` is a word, set `dp[i] = true` and stop.','3. Return `dp[n]`.'],
      code: "import java.util.HashSet;\nimport java.util.List;\nimport java.util.Set;\n\nclass Solution {\n    public boolean wordBreak(String s, List<String> wordDict) {\n        Set<String> dict = new HashSet<>(wordDict);\n        int maxLen = 0;\n        for (String w : wordDict) maxLen = Math.max(maxLen, w.length());\n        int n = s.length();\n        boolean[] dp = new boolean[n + 1];\n        dp[0] = true;\n        for (int i = 1; i <= n; i++) {\n            for (int j = i - 1; j >= Math.max(0, i - maxLen); j--) {\n                if (dp[j] && dict.contains(s.substring(j, i))) {\n                    dp[i] = true;\n                    break;\n                }\n            }\n        }\n        return dp[n];\n    }\n}",
      complexity: { time: 'O(n \\cdot \\text{maxLen})', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    description: 'Given an integer array `nums`, return the length of the longest strictly increasing subsequence. A subsequence is derived by deleting some or no elements without changing the order of the rest.',
    examples: [
    {
      input: 'nums = [0,1,0,3,2,3]',
      output: '4',
      explanation: '[0,1,2,3]'
    },
    {
      input: 'nums = [7,7,7,7,7,7,7]',
      output: '1',
      explanation: ''
    }
  ],
    constraints: '`1 <= nums.length <= 2500` - `-10^4 <= nums[i] <= 10^4`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'At each element, either take it (if it extends the previous chosen value) or skip it. Explore all choices.',
      algorithm: ['1. `solve(i, prev)`: if `i == n`, return `0`.','2. Skip: `solve(i+1, prev)`. Take, if `prev == -1` or `nums[i] > nums[prev]`: `1 + solve(i+1, i)`.','3. Return the maximum.'],
      code: "class Solution {\n    public int lengthOfLIS(int[] nums) {\n        return solve(nums, 0, -1);\n    }\n\n    private int solve(int[] nums, int i, int prev) {\n        if (i == nums.length) return 0;\n        int skip = solve(nums, i + 1, prev);\n        int take = 0;\n        if (prev == -1 || nums[i] > nums[prev]) {\n            take = 1 + solve(nums, i + 1, i);\n        }\n        return Math.max(skip, take);\n    }\n}",
      complexity: { time: 'O(2^n)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: '`L(i)` is the longest increasing subsequence ending at `i`. Compare against every earlier smaller element.',
      algorithm: ['1. `dp[i] = 1` for all `i`.','2. For each `i`, for each `j < i` with `nums[j] < nums[i]`, set `dp[i] = max(dp[i], dp[j] + 1)`.','3. Return the maximum of `dp`.'],
      code: "class Solution {\n    public int lengthOfLIS(int[] nums) {\n        int n = nums.length, best = 1;\n        int[] dp = new int[n];\n        for (int i = 0; i < n; i++) {\n            dp[i] = 1;\n            for (int j = 0; j < i; j++) {\n                if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);\n            }\n            best = Math.max(best, dp[i]);\n        }\n        return best;\n    }\n}",
      complexity: { time: 'O(n^2)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Maintain `tails`, where `tails[k]` is the smallest tail of any increasing subsequence of length `k+1`. For each number, binary search for the first tail that is `>=` it. Replace that tail with the number, or extend the list if none is found. The list length is the answer, even though `tails` itself is not a valid subsequence.',
      algorithm: ['1. `size = 0`, `tails = new int[n]`.','2. For each `x`: find `pos`, the first index in `[0, size)` with `tails[pos] >= x`. Set `tails[pos] = x`. If `pos == size`, increment `size`.','3. Return `size`.'],
      code: "class Solution {\n    public int lengthOfLIS(int[] nums) {\n        int[] tails = new int[nums.length];\n        int size = 0;\n        for (int x : nums) {\n            int lo = 0, hi = size;\n            while (lo < hi) {\n                int mid = lo + (hi - lo) / 2;\n                if (tails[mid] < x) lo = mid + 1;\n                else hi = mid;\n            }\n            tails[lo] = x;\n            if (lo == size) size++;\n        }\n        return size;\n    }\n}",
      complexity: { time: 'O(n \\log n)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'partition-equal-subset-sum',
    title: 'Partition Equal Subset Sum',
    difficulty: 'Medium',
    description: 'Given an integer array `nums`, return `true` if you can partition it into two subsets whose sums are equal, and `false` otherwise.',
    examples: [
    {
      input: 'nums = [1,2,3,5]',
      output: 'false',
      explanation: ''
    }
  ],
    constraints: '`1 <= nums.length <= 200` - `1 <= nums[i] <= 100`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'For each element, try including it (reducing the remaining target) and excluding it.',
      algorithm: ['1. If the total is odd, return `false`. `target = total / 2`.','2. `solve(i, rem)`: if `rem == 0`, return `true`. If `i == n` or `rem < 0`, return `false`. Otherwise return `solve(i+1, rem - nums[i]) || solve(i+1, rem)`.'],
      code: "class Solution {\n    public boolean canPartition(int[] nums) {\n        int total = 0;\n        for (int x : nums) total += x;\n        if (total % 2 != 0) return false;\n        return solve(nums, 0, total / 2);\n    }\n\n    private boolean solve(int[] nums, int i, int rem) {\n        if (rem == 0) return true;\n        if (i == nums.length || rem < 0) return false;\n        return solve(nums, i + 1, rem - nums[i]) || solve(nums, i + 1, rem);\n    }\n}",
      complexity: { time: 'O(2^n)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: 'The state `(i, rem)` determines the outcome, so cache each pair. The table has `n * target` entries.',
      algorithm: ['1. Allocate `memo[n+1][target+1]` of `Boolean`.','2. Compute `solve(i, rem)` with caching.'],
      code: "class Solution {\n    public boolean canPartition(int[] nums) {\n        int total = 0;\n        for (int x : nums) total += x;\n        if (total % 2 != 0) return false;\n        int target = total / 2;\n        Boolean[][] memo = new Boolean[nums.length + 1][target + 1];\n        return solve(nums, 0, target, memo);\n    }\n\n    private boolean solve(int[] nums, int i, int rem, Boolean[][] memo) {\n        if (rem == 0) return true;\n        if (i == nums.length || rem < 0) return false;\n        if (memo[i][rem] != null) return memo[i][rem];\n        boolean ok = solve(nums, i + 1, rem - nums[i], memo) || solve(nums, i + 1, rem, memo);\n        memo[i][rem] = ok;\n        return ok;\n    }\n}",
      complexity: { time: 'O(n \\cdot \\text{target})', space: 'O(n \\cdot \\text{target})' }
    },
    {
      label: 'Optimised / Best',
      intuition: '`dp[s]` means some subset so far sums to `s`. Process each number and update `dp` from high sums to low, so that each number is used at most once. Then `dp[target]` is the answer.',
      algorithm: ['1. `dp[0] = true`, others `false`.','2. For each `x`, for `s` from `target` down to `x`: `dp[s] |= dp[s - x]`.','3. Return `dp[target]`.'],
      code: "class Solution {\n    public boolean canPartition(int[] nums) {\n        int total = 0;\n        for (int x : nums) total += x;\n        if (total % 2 != 0) return false;\n        int target = total / 2;\n        boolean[] dp = new boolean[target + 1];\n        dp[0] = true;\n        for (int x : nums) {\n            for (int s = target; s >= x; s--) {\n                dp[s] = dp[s] || dp[s - x];\n            }\n        }\n        return dp[target];\n    }\n}",
      complexity: { time: 'O(n \\cdot \\text{target})', space: 'O(\\text{target})' }
    }
  ]
  },
  {
    slug: 'unique-paths',
    title: 'Unique Paths',
    difficulty: 'Medium',
    description: 'A robot is on an `m x n` grid, starting at the top-left corner. It can only move down or right at any point, and it tries to reach the bottom-right corner. Return the number of possible unique paths.',
    examples: [
    {
      input: 'm = 3',
      output: '3',
      explanation: 'Right, Down, Down'
    }
  ],
    constraints: '`1 <= m, n <= 100`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Count paths from the current cell to the goal by trying both moves.',
      algorithm: ['1. If the cell is outside the grid, return `0`.','2. If the cell is the goal, return `1`.','3. Return `paths(r+1, c) + paths(r, c+1)`.'],
      code: "class Solution {\n    public int uniquePaths(int m, int n) {\n        return paths(0, 0, m, n);\n    }\n\n    private int paths(int r, int c, int m, int n) {\n        if (r >= m || c >= n) return 0;\n        if (r == m - 1 && c == n - 1) return 1;\n        return paths(r + 1, c, m, n) + paths(r, c + 1, m, n);\n    }\n}",
      complexity: { time: 'O(2^{m+n})', space: 'O(m + n)' }
    },
    {
      label: 'Better',
      intuition: 'A cell\'s path count never changes, so store it in a 2-D table.',
      algorithm: ['1. Allocate `memo[m][n]` filled with `-1`.','2. Compute `paths(r, c)` with caching.'],
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int uniquePaths(int m, int n) {\n        int[][] memo = new int[m][n];\n        for (int[] row : memo) Arrays.fill(row, -1);\n        return paths(0, 0, m, n, memo);\n    }\n\n    private int paths(int r, int c, int m, int n, int[][] memo) {\n        if (r >= m || c >= n) return 0;\n        if (r == m - 1 && c == n - 1) return 1;\n        if (memo[r][c] != -1) return memo[r][c];\n        memo[r][c] = paths(r + 1, c, m, n, memo) + paths(r, c + 1, m, n, memo);\n        return memo[r][c];\n    }\n}",
      complexity: { time: 'O(mn)', space: 'O(mn)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Each row depends only on the row above and the cell to its left. A single array representing the current row, updated left to right, is enough.',
      algorithm: ['1. `dp[j] = 1` for all `j` (the first row).','2. For each subsequent row, for `j` from `1` to `n-1`: `dp[j] += dp[j-1]`.','3. Return `dp[n-1]`.'],
      code: "class Solution {\n    public int uniquePaths(int m, int n) {\n        int[] dp = new int[n];\n        java.util.Arrays.fill(dp, 1);\n        for (int i = 1; i < m; i++) {\n            for (int j = 1; j < n; j++) {\n                dp[j] += dp[j - 1];\n            }\n        }\n        return dp[n - 1];\n    }\n}",
      complexity: { time: 'O(mn)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'longest-common-subsequence',
    title: 'Longest Common Subsequence',
    difficulty: 'Medium',
    description: 'Given two strings `text1` and `text2`, return the length of their longest common subsequence. A subsequence is formed by deleting some or no characters without changing the order of the rest. If there is no common subsequence, return `0`.',
    examples: [
    {
      input: 'text1 = "abc"',
      output: '3',
      explanation: ''
    },
    {
      input: 'text1 = "abc"',
      output: '0',
      explanation: ''
    }
  ],
    constraints: '`1 <= text1.length, text2.length <= 1000` - Both strings consist of lowercase English letters.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Apply the match-or-skip rule from the start of both strings.',
      algorithm: ['1. If either index reaches the end, return `0`.','2. If the characters match, return `1 + lcs(i+1, j+1)`.','3. Otherwise return `max(lcs(i+1, j), lcs(i, j+1))`.'],
      code: "class Solution {\n    public int longestCommonSubsequence(String text1, String text2) {\n        return lcs(text1, text2, 0, 0);\n    }\n\n    private int lcs(String a, String b, int i, int j) {\n        if (i == a.length() || j == b.length()) return 0;\n        if (a.charAt(i) == b.charAt(j)) return 1 + lcs(a, b, i + 1, j + 1);\n        return Math.max(lcs(a, b, i + 1, j), lcs(a, b, i, j + 1));\n    }\n}",
      complexity: { time: 'O(2^{m+n})', space: 'O(m + n)' }
    },
    {
      label: 'Better',
      intuition: '`lcs(i, j)` depends only on `(i, j)`, so cache it in a table.',
      algorithm: ['1. Allocate `memo[m][n]` filled with `-1`.','2. Compute `lcs(i, j)` with caching.'],
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int longestCommonSubsequence(String text1, String text2) {\n        int[][] memo = new int[text1.length()][text2.length()];\n        for (int[] row : memo) Arrays.fill(row, -1);\n        return lcs(text1, text2, 0, 0, memo);\n    }\n\n    private int lcs(String a, String b, int i, int j, int[][] memo) {\n        if (i == a.length() || j == b.length()) return 0;\n        if (memo[i][j] != -1) return memo[i][j];\n        if (a.charAt(i) == b.charAt(j)) {\n            memo[i][j] = 1 + lcs(a, b, i + 1, j + 1, memo);\n        } else {\n            memo[i][j] = Math.max(lcs(a, b, i + 1, j, memo), lcs(a, b, i, j + 1, memo));\n        }\n        return memo[i][j];\n    }\n}",
      complexity: { time: 'O(mn)', space: 'O(mn)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Row `i` of the table depends only on row `i+1` and the current row. Keep two rows of length `n+1`, and roll them.',
      algorithm: ['1. `prev` and `cur` are arrays of length `n + 1`, all zero.','2. For `i` from `m-1` down to `0`, and `j` from `n-1` down to `0`:','- If `a[i] == b[j]`, `cur[j] = 1 + prev[j+1]`.','- Otherwise `cur[j] = max(prev[j], cur[j+1])`.','3. Swap `prev` and `cur` after each row.','4. Return `prev[0]`.'],
      code: "class Solution {\n    public int longestCommonSubsequence(String text1, String text2) {\n        int m = text1.length(), n = text2.length();\n        int[] prev = new int[n + 1], cur = new int[n + 1];\n        for (int i = m - 1; i >= 0; i--) {\n            for (int j = n - 1; j >= 0; j--) {\n                if (text1.charAt(i) == text2.charAt(j)) {\n                    cur[j] = 1 + prev[j + 1];\n                } else {\n                    cur[j] = Math.max(prev[j], cur[j + 1]);\n                }\n            }\n            int[] tmp = prev;\n            prev = cur;\n            cur = tmp;\n        }\n        return prev[0];\n    }\n}",
      complexity: { time: 'O(mn)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'best-time-to-buy-and-sell-stock-with-cooldown',
    title: 'Best Time to Buy and Sell Stock with Cooldown',
    difficulty: 'Medium',
    description: 'You are given an array `prices` where `prices[i]` is the price of a stock on day `i`. You may complete as many transactions as you like, with these constraints: - You must sell the stock before buying again. - After you sell, you cannot buy on the next day (one day of cooldown). Return the maximum profit.',
    examples: [
    {
      input: 'prices = [1]',
      output: '0',
      explanation: ''
    }
  ],
    constraints: '`1 <= prices.length <= 5000` - `0 <= prices[i] <= 1000`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'From each day and state, try every legal action and recurse.',
      algorithm: ['1. States: `0` free, `1` holding, `2` cooldown.','2. `f(i, s)`: if `i >= n`, return `0`.','- Free: `max(f(i+1, 0), -p[i] + f(i+1, 1))`.','- Holding: `max(f(i+1, 1), p[i] + f(i+1, 2))`.','- Cooldown: `f(i+1, 0)`.'],
      code: "class Solution {\n    public int maxProfit(int[] prices) {\n        return f(prices, 0, 0);\n    }\n\n    private int f(int[] p, int i, int state) {\n        if (i >= p.length) return 0;\n        if (state == 0) return Math.max(f(p, i + 1, 0), -p[i] + f(p, i + 1, 1));\n        if (state == 1) return Math.max(f(p, i + 1, 1), p[i] + f(p, i + 1, 2));\n        return f(p, i + 1, 0);\n    }\n}",
      complexity: { time: 'O(2^n)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: '`f(i, s)` has only `3n` distinct states, so cache them.',
      algorithm: ['1. Allocate `memo[n][3]` filled with `-1`.','2. Compute `f(i, s)` with caching, using the same transitions.'],
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int maxProfit(int[] prices) {\n        int[][] memo = new int[prices.length][3];\n        for (int[] row : memo) Arrays.fill(row, -1);\n        return f(prices, 0, 0, memo);\n    }\n\n    private int f(int[] p, int i, int state, int[][] memo) {\n        if (i >= p.length) return 0;\n        if (memo[i][state] != -1) return memo[i][state];\n        int res;\n        if (state == 0) {\n            res = Math.max(f(p, i + 1, 0, memo), -p[i] + f(p, i + 1, 1, memo));\n        } else if (state == 1) {\n            res = Math.max(f(p, i + 1, 1, memo), p[i] + f(p, i + 1, 2, memo));\n        } else {\n            res = f(p, i + 1, 0, memo);\n        }\n        memo[i][state] = res;\n        return res;\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(n)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Process days forward. Each day needs only the previous day\'s three state values, so three variables suffice.',
      algorithm: ['1. `hold = -p[0]`, `sold = 0`, `rest = 0`.','2. For each later day with price `x`:','- `newHold = max(hold, rest - x)`','- `newSold = hold + x`','- `newRest = max(rest, sold)`','3. Return `max(sold, rest)`.'],
      code: "class Solution {\n    public int maxProfit(int[] prices) {\n        int hold = -prices[0], sold = 0, rest = 0;\n        for (int i = 1; i < prices.length; i++) {\n            int x = prices[i];\n            int newHold = Math.max(hold, rest - x);\n            int newSold = hold + x;\n            int newRest = Math.max(rest, sold);\n            hold = newHold;\n            sold = newSold;\n            rest = newRest;\n        }\n        return Math.max(sold, rest);\n    }\n}",
      complexity: { time: 'O(n)', space: 'O(1)' }
    }
  ]
  },
  {
    slug: 'coin-change-ii',
    title: 'Coin Change II',
    difficulty: 'Medium',
    description: 'You are given an integer array `coins` representing coins of different denominations and an integer `amount`. Return the number of combinations that make up that amount. If that amount cannot be made, return `0`. You have an infinite number of each coin. Combinations are unordered.',
    examples: [
    {
      input: 'amount = 3',
      output: '0',
      explanation: ''
    },
    {
      input: 'amount = 10',
      output: '1',
      explanation: ''
    }
  ],
    constraints: '`1 <= coins.length <= 300` - `1 <= coins[i] <= 5000` - All coin values are unique. - `0 <= amount <= 5000`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'At each coin, use it once more or skip to the next denomination.',
      algorithm: ['1. `ways(i, rem)`: if `rem == 0`, return `1`. If `i == n` or `rem < 0`, return `0`.','2. Return `ways(i, rem - coins[i]) + ways(i + 1, rem)`.'],
      code: "class Solution {\n    public int change(int amount, int[] coins) {\n        return ways(coins, 0, amount);\n    }\n\n    private int ways(int[] coins, int i, int rem) {\n        if (rem == 0) return 1;\n        if (i == coins.length || rem < 0) return 0;\n        return ways(coins, i, rem - coins[i]) + ways(coins, i + 1, rem);\n    }\n}",
      complexity: { time: 'Exponential in the worst case', space: 'O(\\text{amount})' }
    },
    {
      label: 'Better',
      intuition: 'The state `(i, rem)` fully determines the count, so cache it.',
      algorithm: ['1. Allocate `memo[n+1][amount+1]` filled with `-1`.','2. Compute `ways(i, rem)` with caching.'],
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int change(int amount, int[] coins) {\n        int[][] memo = new int[coins.length + 1][amount + 1];\n        for (int[] row : memo) Arrays.fill(row, -1);\n        return ways(coins, 0, amount, memo);\n    }\n\n    private int ways(int[] coins, int i, int rem, int[][] memo) {\n        if (rem == 0) return 1;\n        if (i == coins.length || rem < 0) return 0;\n        if (memo[i][rem] != -1) return memo[i][rem];\n        memo[i][rem] = ways(coins, i, rem - coins[i], memo) + ways(coins, i + 1, rem, memo);\n        return memo[i][rem];\n    }\n}",
      complexity: { time: 'O(n \\cdot \\text{amount})', space: 'O(n \\cdot \\text{amount})' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Process coins one at a time. For each coin, iterate amounts upward, so `dp[s - c]` already includes uses of coin `c`. This allows unlimited reuse. The order of loops means each combination is counted once, regardless of order.',
      algorithm: ['1. `dp[0] = 1`, others `0`.','2. For each coin `c`, for `s` from `c` to `amount`: `dp[s] += dp[s - c]`.','3. Return `dp[amount]`.'],
      code: "class Solution {\n    public int change(int amount, int[] coins) {\n        int[] dp = new int[amount + 1];\n        dp[0] = 1;\n        for (int c : coins) {\n            for (int s = c; s <= amount; s++) {\n                dp[s] += dp[s - c];\n            }\n        }\n        return dp[amount];\n    }\n}",
      complexity: { time: 'O(n \\cdot \\text{amount})', space: 'O(\\text{amount})' }
    }
  ]
  },
  {
    slug: 'target-sum',
    title: 'Target Sum',
    difficulty: 'Medium',
    description: 'You are given an integer array `nums` and an integer `target`. You want to build an expression by assigning either `+` or `-` before each integer in `nums`, and concatenating them. Return the number of different expressions that evaluate to `target`.',
    examples: [
    {
      input: 'nums = [1]',
      output: '1',
      explanation: ''
    }
  ],
    constraints: '`1 <= nums.length <= 20` - `0 <= nums[i] <= 1000` - `0 <= sum(nums) <= 1000` - `-1000 <= target <= 1000`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Try `+` and `-` for each number and count the results that match the target.',
      algorithm: ['1. `count(i, sum)`: if `i == n`, return `1` if `sum == target`, else `0`.','2. Return `count(i+1, sum + nums[i]) + count(i+1, sum - nums[i])`.'],
      code: "class Solution {\n    public int findTargetSumWays(int[] nums, int target) {\n        return count(nums, 0, 0, target);\n    }\n\n    private int count(int[] nums, int i, int sum, int target) {\n        if (i == nums.length) return sum == target ? 1 : 0;\n        return count(nums, i + 1, sum + nums[i], target) + count(nums, i + 1, sum - nums[i], target);\n    }\n}",
      complexity: { time: 'O(2^n)', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: 'The count from `(i, sum)` is fixed, so cache it. Sums range over `[-total, total]`, so offset them to use an array.',
      algorithm: ['1. Let `total = sum(nums)`. Allocate `memo[n][2*total+1]` filled with `-1`.','2. Compute `count(i, sum)` with caching, indexing by `sum + total`.'],
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int findTargetSumWays(int[] nums, int target) {\n        int total = 0;\n        for (int x : nums) total += x;\n        if (Math.abs(target) > total) return 0;\n        int[][] memo = new int[nums.length][2 * total + 1];\n        for (int[] row : memo) Arrays.fill(row, -1);\n        return count(nums, 0, 0, target, total, memo);\n    }\n\n    private int count(int[] nums, int i, int sum, int target, int total, int[][] memo) {\n        if (i == nums.length) return sum == target ? 1 : 0;\n        int idx = sum + total;\n        if (memo[i][idx] != -1) return memo[i][idx];\n        memo[i][idx] = count(nums, i + 1, sum + nums[i], target, total, memo)\n                     + count(nums, i + 1, sum - nums[i], target, total, memo);\n        return memo[i][idx];\n    }\n}",
      complexity: { time: 'O(n \\cdot \\text{total})', space: 'O(n \\cdot \\text{total})' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Reduce to counting subsets that sum to `P = (total + target) / 2`. Use a 1-D table where `dp[s]` is the number of subsets with sum `s`. Iterate sums downward so each number is used at most once. A zero value doubles the count at `dp[s]` for each `s`, correctly handling both choices for that zero.',
      algorithm: ['1. If `|target| > total` or `(total + target)` is odd, return `0`.','2. `P = (total + target) / 2`. `dp[0] = 1`.','3. For each `x`, for `s` from `P` down to `x`: `dp[s] += dp[s - x]`.','4. Return `dp[P]`.'],
      code: "class Solution {\n    public int findTargetSumWays(int[] nums, int target) {\n        int total = 0;\n        for (int x : nums) total += x;\n        if (Math.abs(target) > total || (total + target) % 2 != 0) return 0;\n        int P = (total + target) / 2;\n        int[] dp = new int[P + 1];\n        dp[0] = 1;\n        for (int x : nums) {\n            for (int s = P; s >= x; s--) {\n                dp[s] += dp[s - x];\n            }\n        }\n        return dp[P];\n    }\n}",
      complexity: { time: 'O(n \\cdot P)', space: 'O(P)' }
    }
  ]
  },
  {
    slug: 'interleaving-string',
    title: 'Interleaving String',
    difficulty: 'Medium',
    description: 'Given strings `s1`, `s2`, and `s3`, return `true` if `s3` is formed by an interleaving of `s1` and `s2`. An interleaving keeps the relative order of characters from each string, and together they use every character of `s1`, `s2`, and `s3`.',
    examples: [
    {
      input: 's1 = "aabcc"',
      output: 'false',
      explanation: ''
    },
    {
      input: 's1 = ""',
      output: 'true',
      explanation: ''
    }
  ],
    constraints: '`0 <= s1.length, s2.length <= 100` - `0 <= s3.length <= 200` - All strings consist of lowercase English letters.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'At each state, try to consume the next character from `s1` or from `s2`.',
      algorithm: ['1. If `i == m` and `j == n`, return `true`.','2. `k = i + j`. If `s1[i] == s3[k]` and `solve(i+1, j)`, return `true`.','3. If `s2[j] == s3[k]` and `solve(i, j+1)`, return `true`.','4. Return `false`.'],
      code: "class Solution {\n    public boolean isInterleave(String s1, String s2, String s3) {\n        if (s1.length() + s2.length() != s3.length()) return false;\n        return solve(s1, s2, s3, 0, 0);\n    }\n\n    private boolean solve(String s1, String s2, String s3, int i, int j) {\n        if (i == s1.length() && j == s2.length()) return true;\n        int k = i + j;\n        if (i < s1.length() && s1.charAt(i) == s3.charAt(k) && solve(s1, s2, s3, i + 1, j)) return true;\n        if (j < s2.length() && s2.charAt(j) == s3.charAt(k) && solve(s1, s2, s3, i, j + 1)) return true;\n        return false;\n    }\n}",
      complexity: { time: 'O(2^{m+n})', space: 'O(m + n)' }
    },
    {
      label: 'Better',
      intuition: 'The outcome from `(i, j)` is fixed, so cache it in a 2-D table.',
      algorithm: ['1. Allocate `memo[m+1][n+1]` of `Boolean`.','2. Compute `solve(i, j)` with caching.'],
      code: "class Solution {\n    public boolean isInterleave(String s1, String s2, String s3) {\n        if (s1.length() + s2.length() != s3.length()) return false;\n        Boolean[][] memo = new Boolean[s1.length() + 1][s2.length() + 1];\n        return solve(s1, s2, s3, 0, 0, memo);\n    }\n\n    private boolean solve(String s1, String s2, String s3, int i, int j, Boolean[][] memo) {\n        if (i == s1.length() && j == s2.length()) return true;\n        if (memo[i][j] != null) return memo[i][j];\n        int k = i + j;\n        boolean ok = false;\n        if (i < s1.length() && s1.charAt(i) == s3.charAt(k)) {\n            ok = solve(s1, s2, s3, i + 1, j, memo);\n        }\n        if (!ok && j < s2.length() && s2.charAt(j) == s3.charAt(k)) {\n            ok = solve(s1, s2, s3, i, j + 1, memo);\n        }\n        memo[i][j] = ok;\n        return ok;\n    }\n}",
      complexity: { time: 'O(mn)', space: 'O(mn)' }
    },
    {
      label: 'Optimised / Best',
      intuition: '`dp[i][j]` depends on `dp[i-1][j]` and `dp[i][j-1]`. Process rows in order and keep only one array, which is updated in place as `j` increases.',
      algorithm: ['1. If the lengths do not add up, return `false`.','2. `dp[j]` is `true` if the first `i` characters of `s1` and `j` characters of `s2` interleave to form `s3[0..i+j)`.','3. For each `i` from `0` to `m`, and `j` from `0` to `n`:','- `dp[0]` for `i == 0` is `true`.','- `dp[j] = (i > 0 && dp[j] && s1[i-1] == s3[i+j-1]) || (j > 0 && dp[j-1] && s2[j-1] == s3[i+j-1])`.','4. Return `dp[n]`.'],
      code: "class Solution {\n    public boolean isInterleave(String s1, String s2, String s3) {\n        int m = s1.length(), n = s2.length();\n        if (m + n != s3.length()) return false;\n        boolean[] dp = new boolean[n + 1];\n        for (int i = 0; i <= m; i++) {\n            for (int j = 0; j <= n; j++) {\n                if (i == 0 && j == 0) {\n                    dp[0] = true;\n                    continue;\n                }\n                int k = i + j - 1;\n                boolean fromTop = i > 0 && dp[j] && s1.charAt(i - 1) == s3.charAt(k);\n                boolean fromLeft = j > 0 && dp[j - 1] && s2.charAt(j - 1) == s3.charAt(k);\n                dp[j] = fromTop || fromLeft;\n            }\n        }\n        return dp[n];\n    }\n}",
      complexity: { time: 'O(mn)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'longest-increasing-path-in-a-matrix',
    title: 'Longest Increasing Path in a Matrix',
    difficulty: 'Hard',
    description: 'Given an `m x n` integers matrix, return the length of the longest strictly increasing path in the matrix. From each cell you may move to its four neighbours (up, down, left, right), but not diagonally or outside the matrix.',
    examples: [
    {
      input: 'matrix = [[3,4,5],[3,2,6],[2,2,1]]',
      output: '4',
      explanation: '[3, 4, 5, 6]'
    },
    {
      input: 'matrix = [[1]]',
      output: '1',
      explanation: ''
    }
  ],
    constraints: '`m == matrix.length`, `n == matrix[i].length` - `1 <= m, n <= 200` - `0 <= matrix[i][j] <= 2^31 - 1`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'From each cell, explore all increasing paths and track the longest. Each path is recomputed many times.',
      algorithm: ['1. For each cell, call `dfs(r, c, prev)`, which moves to neighbours with larger values.','2. Return `1` plus the best of its neighbours\' paths, or `1` if none.'],
      code: "class Solution {\n    private static final int[][] DIRS = {{1,0},{-1,0},{0,1},{0,-1}};\n\n    public int longestIncreasingPath(int[][] matrix) {\n        int best = 0;\n        for (int r = 0; r < matrix.length; r++) {\n            for (int c = 0; c < matrix[0].length; c++) {\n                best = Math.max(best, dfs(matrix, r, c));\n            }\n        }\n        return best;\n    }\n\n    private int dfs(int[][] mat, int r, int c) {\n        int best = 1;\n        for (int[] d : DIRS) {\n            int nr = r + d[0], nc = c + d[1];\n            if (nr < 0 || nc < 0 || nr >= mat.length || nc >= mat[0].length) continue;\n            if (mat[nr][nc] > mat[r][c]) {\n                best = Math.max(best, 1 + dfs(mat, nr, nc));\n            }\n        }\n        return best;\n    }\n}",
      complexity: { time: 'Exponential in the worst case', space: 'O(mn)' }
    },
    {
      label: 'Better',
      intuition: 'The longest path starting at a cell is fixed, so cache it. Each cell is then expanded once.',
      algorithm: ['1. Allocate `memo[m][n]` filled with `0` (unknown).','2. `dfs(r, c)`: return the cached value if non-zero. Otherwise compute from larger neighbours and store the result.'],
      code: "class Solution {\n    private static final int[][] DIRS = {{1,0},{-1,0},{0,1},{0,-1}};\n\n    public int longestIncreasingPath(int[][] matrix) {\n        int m = matrix.length, n = matrix[0].length;\n        int[][] memo = new int[m][n];\n        int best = 0;\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                best = Math.max(best, dfs(matrix, r, c, memo));\n            }\n        }\n        return best;\n    }\n\n    private int dfs(int[][] mat, int r, int c, int[][] memo) {\n        if (memo[r][c] != 0) return memo[r][c];\n        int best = 1;\n        for (int[] d : DIRS) {\n            int nr = r + d[0], nc = c + d[1];\n            if (nr < 0 || nc < 0 || nr >= mat.length || nc >= mat[0].length) continue;\n            if (mat[nr][nc] > mat[r][c]) {\n                best = Math.max(best, 1 + dfs(mat, nr, nc, memo));\n            }\n        }\n        memo[r][c] = best;\n        return best;\n    }\n}",
      complexity: { time: 'O(mn)', space: 'O(mn)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Treat each edge as pointing from a smaller cell to a larger neighbour. A cell\'s indegree is the number of smaller neighbours. Cells with indegree zero are local minima. Remove them layer by layer, as in a topological sort. The number of layers equals the longest increasing path length.',
      algorithm: ['1. For each cell, `indeg` = number of neighbours with a smaller value.','2. Enqueue all cells with `indeg == 0`.','3. While the queue is non-empty: count one layer. Process the current layer, and for each larger neighbour, decrement its indegree and enqueue it when it reaches zero.','4. Return the number of layers.'],
      code: "import java.util.ArrayDeque;\nimport java.util.Queue;\n\nclass Solution {\n    private static final int[][] DIRS = {{1,0},{-1,0},{0,1},{0,-1}};\n\n    public int longestIncreasingPath(int[][] matrix) {\n        int m = matrix.length, n = matrix[0].length;\n        int[][] indeg = new int[m][n];\n        Queue<int[]> q = new ArrayDeque<>();\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                for (int[] d : DIRS) {\n                    int nr = r + d[0], nc = c + d[1];\n                    if (nr >= 0 && nc >= 0 && nr < m && nc < n && matrix[nr][nc] < matrix[r][c]) {\n                        indeg[r][c]++;\n                    }\n                }\n                if (indeg[r][c] == 0) q.offer(new int[]{r, c});\n            }\n        }\n        int layers = 0;\n        while (!q.isEmpty()) {\n            layers++;\n            for (int size = q.size(); size > 0; size--) {\n                int[] cur = q.poll();\n                for (int[] d : DIRS) {\n                    int nr = cur[0] + d[0], nc = cur[1] + d[1];\n                    if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;\n                    if (matrix[nr][nc] > matrix[cur[0]][cur[1]] && --indeg[nr][nc] == 0) {\n                        q.offer(new int[]{nr, nc});\n                    }\n                }\n            }\n        }\n        return layers;\n    }\n}",
      complexity: { time: 'O(mn)', space: 'O(mn)' }
    }
  ]
  },
  {
    slug: 'distinct-subsequences',
    title: 'Distinct Subsequences',
    difficulty: 'Hard',
    description: 'Given two strings `s` and `t`, return the number of distinct subsequences of `s` which equal `t`. A subsequence is formed by deleting some or no characters without reordering the rest.',
    examples: [
    {
      input: 's = "babgbag"',
      output: '5',
      explanation: ''
    }
  ],
    constraints: '`1 <= s.length, t.length <= 1000` - `s` and `t` consist of English letters.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Apply the match-or-skip rule directly.',
      algorithm: ['1. If `j == m`, return `1` (all of `t` matched).','2. If `i == n`, return `0`.','3. If `s[i] == t[j]`, return `count(i+1, j+1) + count(i+1, j)`. Otherwise return `count(i+1, j)`.'],
      code: "class Solution {\n    public int numDistinct(String s, String t) {\n        return count(s, t, 0, 0);\n    }\n\n    private int count(String s, String t, int i, int j) {\n        if (j == t.length()) return 1;\n        if (i == s.length()) return 0;\n        int res = count(s, t, i + 1, j);\n        if (s.charAt(i) == t.charAt(j)) res += count(s, t, i + 1, j + 1);\n        return res;\n    }\n}",
      complexity: { time: 'Exponential in the worst case', space: 'O(n + m)' }
    },
    {
      label: 'Better',
      intuition: 'The count from `(i, j)` is fixed, so cache it.',
      algorithm: ['1. Allocate `memo[n+1][m+1]` filled with `-1`.','2. Compute `count(i, j)` with caching.'],
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int numDistinct(String s, String t) {\n        int[][] memo = new int[s.length() + 1][t.length() + 1];\n        for (int[] row : memo) Arrays.fill(row, -1);\n        return count(s, t, 0, 0, memo);\n    }\n\n    private int count(String s, String t, int i, int j, int[][] memo) {\n        if (j == t.length()) return 1;\n        if (i == s.length()) return 0;\n        if (memo[i][j] != -1) return memo[i][j];\n        int res = count(s, t, i + 1, j, memo);\n        if (s.charAt(i) == t.charAt(j)) res += count(s, t, i + 1, j + 1, memo);\n        memo[i][j] = res;\n        return res;\n    }\n}",
      complexity: { time: 'O(nm)', space: 'O(nm)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Let `dp[j]` be the number of ways to form `t[0..j)` from the characters of `s` processed so far. When a character `c` of `s` is read, it can extend every prefix of `t` that ends in `c`. Iterate `j` downward so each character of `s` is used at most once per update.',
      algorithm: ['1. `dp[0] = 1`, others `0`.','2. For each `c` in `s`, for `j` from `m` down to `1`: if `c == t[j-1]`, `dp[j] += dp[j-1]`.','3. Return `dp[m]`.'],
      code: "class Solution {\n    public int numDistinct(String s, String t) {\n        int m = t.length();\n        int[] dp = new int[m + 1];\n        dp[0] = 1;\n        for (char c : s.toCharArray()) {\n            for (int j = m; j >= 1; j--) {\n                if (c == t.charAt(j - 1)) dp[j] += dp[j - 1];\n            }\n        }\n        return dp[m];\n    }\n}",
      complexity: { time: 'O(nm)', space: 'O(m)' }
    }
  ]
  },
  {
    slug: 'edit-distance',
    title: 'Edit Distance',
    difficulty: 'Hard',
    description: 'Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` into `word2`. The allowed operations are insert a character, delete a character, or replace a character.',
    examples: [
    {
      input: 'word1 = "intention"',
      output: '5',
      explanation: ''
    }
  ],
    constraints: '`0 <= word1.length, word2.length <= 500` - Both strings consist of lowercase English letters.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Apply the recurrence from the full strings down to the empty prefixes.',
      algorithm: ['1. If `i == m`, return `n - j`. If `j == n`, return `m - i`.','2. If `word1[i] == word2[j]`, return `solve(i+1, j+1)`.','3. Otherwise return `1 + min(solve(i+1, j), solve(i, j+1), solve(i+1, j+1))`.'],
      code: "class Solution {\n    public int minDistance(String word1, String word2) {\n        return solve(word1, word2, 0, 0);\n    }\n\n    private int solve(String a, String b, int i, int j) {\n        if (i == a.length()) return b.length() - j;\n        if (j == b.length()) return a.length() - i;\n        if (a.charAt(i) == b.charAt(j)) return solve(a, b, i + 1, j + 1);\n        return 1 + Math.min(solve(a, b, i + 1, j + 1),\n                   Math.min(solve(a, b, i + 1, j), solve(a, b, i, j + 1)));\n    }\n}",
      complexity: { time: 'Exponential, about O(3^{m+n})', space: 'O(m + n)' }
    },
    {
      label: 'Better',
      intuition: 'Each `(i, j)` has one answer, so cache it.',
      algorithm: ['1. Allocate `memo[m+1][n+1]` filled with `-1`.','2. Compute `solve(i, j)` with caching.'],
      code: "import java.util.Arrays;\n\nclass Solution {\n    public int minDistance(String word1, String word2) {\n        int[][] memo = new int[word1.length() + 1][word2.length() + 1];\n        for (int[] row : memo) Arrays.fill(row, -1);\n        return solve(word1, word2, 0, 0, memo);\n    }\n\n    private int solve(String a, String b, int i, int j, int[][] memo) {\n        if (i == a.length()) return b.length() - j;\n        if (j == b.length()) return a.length() - i;\n        if (memo[i][j] != -1) return memo[i][j];\n        int res;\n        if (a.charAt(i) == b.charAt(j)) {\n            res = solve(a, b, i + 1, j + 1, memo);\n        } else {\n            res = 1 + Math.min(solve(a, b, i + 1, j + 1, memo),\n                      Math.min(solve(a, b, i + 1, j, memo), solve(a, b, i, j + 1, memo)));\n        }\n        memo[i][j] = res;\n        return res;\n    }\n}",
      complexity: { time: 'O(mn)', space: 'O(mn)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'Each row depends only on the row below it and the current row. Keep one row, and track the diagonal value that the in-place update overwrites.',
      algorithm: ['1. `dp[j]` holds the distance from the suffix `word1[i..]` to `word2[j..]`, for the current `i`. Start with the row for `i = m`: `dp[j] = n - j`.','2. For `i` from `m-1` down to `0`:','- Keep `diag = dp[n]` (the value from the row below, at column `n`) before the row changes.','- Set `dp[n] = m - i`.','- For `j` from `n-1` down to `0`: `temp = dp[j]`. If equal, `dp[j] = diag`. Otherwise `dp[j] = 1 + min(diag, dp[j], dp[j+1])`. Then `diag = temp`.','3. Return `dp[0]`.'],
      code: "class Solution {\n    public int minDistance(String word1, String word2) {\n        int m = word1.length(), n = word2.length();\n        int[] dp = new int[n + 1];\n        for (int j = 0; j <= n; j++) dp[j] = n - j;\n        for (int i = m - 1; i >= 0; i--) {\n            int diag = dp[n];\n            dp[n] = m - i;\n            for (int j = n - 1; j >= 0; j--) {\n                int temp = dp[j];\n                if (word1.charAt(i) == word2.charAt(j)) {\n                    dp[j] = diag;\n                } else {\n                    dp[j] = 1 + Math.min(diag, Math.min(dp[j], dp[j + 1]));\n                }\n                diag = temp;\n            }\n        }\n        return dp[0];\n    }\n}",
      complexity: { time: 'O(mn)', space: 'O(n)' }
    }
  ]
  },
  {
    slug: 'burst-balloons',
    title: 'Burst Balloons',
    difficulty: 'Hard',
    description: 'You are given `n` balloons, indexed from `0` to `n - 1`, each painted with a number `nums[i]`. You burst every balloon one at a time. Bursting balloon `i` gives `nums[left] * nums[i] * nums[right]` coins, where `left` and `right` are the adjacent balloons still present. Out-of-bounds neighbours count as `1`. Return the maximum coins you can collect.',
    examples: [
    {
      input: 'nums = [1,5]',
      output: '10',
      explanation: ''
    }
  ],
    constraints: '`n == nums.length` - `1 <= n <= 300` - `0 <= nums[i] <= 100`',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'For each interval, try every balloon as the last to burst, and recurse on the two sides.',
      algorithm: ['1. `solve(l, r)`: if `r - l < 2`, return `0`.','2. For each `k` in `(l, r)`: candidate = `solve(l, k) + solve(k, r) + arr[l] * arr[k] * arr[r]`.','3. Return the maximum.'],
      code: "class Solution {\n    public int maxCoins(int[] nums) {\n        int n = nums.length;\n        int[] arr = new int[n + 2];\n        arr[0] = arr[n + 1] = 1;\n        for (int i = 0; i < n; i++) arr[i + 1] = nums[i];\n        return solve(arr, 0, n + 1);\n    }\n\n    private int solve(int[] arr, int l, int r) {\n        if (r - l < 2) return 0;\n        int best = 0;\n        for (int k = l + 1; k < r; k++) {\n            int cand = solve(arr, l, k) + solve(arr, k, r) + arr[l] * arr[k] * arr[r];\n            best = Math.max(best, cand);\n        }\n        return best;\n    }\n}",
      complexity: { time: 'Exponential in the worst case', space: 'O(n)' }
    },
    {
      label: 'Better',
      intuition: 'Each interval `(l, r)` has one best value, so cache it.',
      algorithm: ['1. Pad as in Approach 1. Allocate `memo[N][N]`, with `N = n + 2`.','2. Compute `solve(l, r)` with caching.'],
      code: "class Solution {\n    public int maxCoins(int[] nums) {\n        int n = nums.length;\n        int[] arr = new int[n + 2];\n        arr[0] = arr[n + 1] = 1;\n        for (int i = 0; i < n; i++) arr[i + 1] = nums[i];\n        int[][] memo = new int[n + 2][n + 2];\n        return solve(arr, 0, n + 1, memo);\n    }\n\n    private int solve(int[] arr, int l, int r, int[][] memo) {\n        if (r - l < 2) return 0;\n        if (memo[l][r] != 0) return memo[l][r];\n        int best = 0;\n        for (int k = l + 1; k < r; k++) {\n            int cand = solve(arr, l, k, memo) + solve(arr, k, r, memo) + arr[l] * arr[k] * arr[r];\n            best = Math.max(best, cand);\n        }\n        memo[l][r] = best;\n        return best;\n    }\n}",
      complexity: { time: 'O(n^3)', space: 'O(n^2)' }
    },
    {
      label: 'Optimised / Best',
      intuition: 'The subproblems for `(l, r)` only need intervals strictly shorter than `r - l`. So fill the table by increasing interval length.',
      algorithm: ['1. Pad `nums` as before. `dp[l][r]` is zero for `r - l < 2`.','2. For `len` from `2` to `N - 1`, for each `l` with `r = l + len < N`: `dp[l][r] = max over k in (l, r) of dp[l][k] + dp[k][r] + arr[l]*arr[k]*arr[r]`.','3. Return `dp[0][N-1]`.'],
      code: "class Solution {\n    public int maxCoins(int[] nums) {\n        int n = nums.length;\n        int N = n + 2;\n        int[] arr = new int[N];\n        arr[0] = arr[N - 1] = 1;\n        for (int i = 0; i < n; i++) arr[i + 1] = nums[i];\n        int[][] dp = new int[N][N];\n        for (int len = 2; len < N; len++) {\n            for (int l = 0; l + len < N; l++) {\n                int r = l + len;\n                for (int k = l + 1; k < r; k++) {\n                    int cand = dp[l][k] + dp[k][r] + arr[l] * arr[k] * arr[r];\n                    dp[l][r] = Math.max(dp[l][r], cand);\n                }\n            }\n        }\n        return dp[0][N - 1];\n    }\n}",
      complexity: { time: 'O(n^3)', space: 'O(n^2)' }
    }
  ]
  },
  {
    slug: 'regular-expression-matching',
    title: 'Regular Expression Matching',
    difficulty: 'Hard',
    description: 'Given an input string `s` and a pattern `p`, implement regular expression matching with support for `.` and `*`: - `.` matches any single character. - `*` matches zero or more of the preceding element. The matching must cover the entire input string, not just a substring.',
    examples: [
    {
      input: 's = "aa"',
      output: 'true',
      explanation: '*'
    },
    {
      input: 's = "ab"',
      output: 'true',
      explanation: ''
    }
  ],
    constraints: '`1 <= s.length <= 20` - `1 <= p.length <= 20` - `s` contains only lowercase English letters. - `p` contains lowercase letters, `.`, and `*`. - Every `*` is preceded by a valid character.',
    solutions: [
    {
      label: 'Brute Force',
      intuition: 'Apply the star and non-star rules directly from the start.',
      algorithm: ['1. `match(i, j)`: if `j == m`, return `i == n`.','2. `first = i < n && (p[j] == s[i] || p[j] == \'.\')`.','3. If `j + 1 < m` and `p[j+1] == \'*\'`: return `match(i, j+2) || (first && match(i+1, j))`.','4. Otherwise return `first && match(i+1, j+1)`.'],
      code: "class Solution {\n    public boolean isMatch(String s, String p) {\n        return match(s, p, 0, 0);\n    }\n\n    private boolean match(String s, String p, int i, int j) {\n        if (j == p.length()) return i == s.length();\n        boolean first = i < s.length() && (p.charAt(j) == s.charAt(i) || p.charAt(j) == '.');\n        if (j + 1 < p.length() && p.charAt(j + 1) == '*') {\n            return match(s, p, i, j + 2) || (first && match(s, p, i + 1, j));\n        }\n        return first && match(s, p, i + 1, j + 1);\n    }\n}",
      complexity: { time: 'Exponential in the worst case', space: 'O(m + n)' }
    },
    {
      label: 'Better',
      intuition: 'The result of `match(i, j)` is fixed, so cache it.',
      algorithm: ['1. Allocate `memo[n+1][m+1]` of `Boolean`.','2. Compute `match(i, j)` with caching, using the same rules as Approach 1.'],
      code: "class Solution {\n    public boolean isMatch(String s, String p) {\n        Boolean[][] memo = new Boolean[s.length() + 1][p.length() + 1];\n        return match(s, p, 0, 0, memo);\n    }\n\n    private boolean match(String s, String p, int i, int j, Boolean[][] memo) {\n        if (j == p.length()) return i == s.length();\n        if (memo[i][j] != null) return memo[i][j];\n        boolean first = i < s.length() && (p.charAt(j) == s.charAt(i) || p.charAt(j) == '.');\n        boolean res;\n        if (j + 1 < p.length() && p.charAt(j + 1) == '*') {\n            res = match(s, p, i, j + 2, memo) || (first && match(s, p, i + 1, j, memo));\n        } else {\n            res = first && match(s, p, i + 1, j + 1, memo);\n        }\n        memo[i][j] = res;\n        return res;\n    }\n}",
      complexity: { time: 'O(mn)', space: 'O(mn)' }
    },
    {
      label: 'Optimised / Best',
      intuition: '`dp[i][j]` means `s[i..]` matches `p[j..]`. Each entry depends only on entries with larger `i` or larger `j`, so fill the table from the end. Base case: the empty suffix of the string matches the empty pattern.',
      algorithm: ['1. `dp[n][m] = true`.','2. For `i` from `n` down to `0`, and `j` from `m-1` down to `0`:','- `first = i < n && (p[j] matches s[i])`.','- If `p[j+1] == \'*\'`: `dp[i][j] = dp[i][j+2] || (first && dp[i+1][j])`.','- Otherwise `dp[i][j] = first && dp[i+1][j+1]`.','3. Return `dp[0][0]`.'],
      code: "class Solution {\n    public boolean isMatch(String s, String p) {\n        int n = s.length(), m = p.length();\n        boolean[][] dp = new boolean[n + 1][m + 1];\n        dp[n][m] = true;\n        for (int i = n; i >= 0; i--) {\n            for (int j = m - 1; j >= 0; j--) {\n                boolean first = i < n && (p.charAt(j) == s.charAt(i) || p.charAt(j) == '.');\n                if (j + 1 < m && p.charAt(j + 1) == '*') {\n                    dp[i][j] = dp[i][j + 2] || (first && dp[i + 1][j]);\n                } else {\n                    dp[i][j] = first && dp[i + 1][j + 1];\n                }\n            }\n        }\n        return dp[0][0];\n    }\n}",
      complexity: { time: 'O(mn)', space: 'O(mn)' }
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
