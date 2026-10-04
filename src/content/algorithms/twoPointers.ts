import type { Topic } from '../../types/content.ts';

/** Two pointers: converging or parallel cursors that skip nested loops. */
export const twoPointersTopic: Topic = {
  slug: 'two-pointers',
  title: 'Two Pointers',
  category: 'algorithms',
  order: 10,
  summary: 'Two cursors, one pass: converging ends on sorted data, parallel readers on linked structures. O(n) answers to O(n²)-looking problems.',
  level: 'beginner',
  prerequisites: ['array'],
  sections: [
    {
      heading: 'The idea',
      body: 'Place one pointer at each end and move the **losing side**: in Two Sum II on sorted `[2, 7, 11, 15]` with target 9, `2 + 15 > 9` discards 15 (nothing pairs with it to reach 9), so `right--`. Each step kills one candidate — `n` steps total.\n\nThe twin shape is **parallel readers**: fast/slow on one array, or one cursor per list in merges and intersections.',
    },
    {
      heading: 'How it works',
      body: 'Converging (`left = 0, right = n - 1`): while `left < right`, compute, then advance the side that cannot work. Inward (`i` from both ends toward center) for palindromes. Same-direction (`slow` writes, `fast` reads) for compaction like Move Zeroes.\n\n- **Time O(n)**, **space O(1)** — the pointers are the whole memory.\n- Sortedness is the usual precondition for converging pointers; without it, sort first (O(n log n)) or reach for a hash map.',
    },
    {
      heading: 'Java notes',
      body: 'Two pointers translate directly to index loops — no library needed. For objects, compare with `compareTo`/`equals` and mind the same `==` trap as linear search.\n\n`Arrays.sort(a)` first when order is missing, then converge. For linked lists the pointers become node references (`slow = slow.next`), which is the same technique wearing different syntax.',
    },
  ],
  complexity: [
    { operation: 'Converging scan (sorted)', best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    { operation: 'With pre-sort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
  ],
  javaCode: [
    {
      title: 'Two Sum II from scratch',
      description: 'Converging pointers on sorted input.',
      code: `public class TwoSumSorted {
    static int[] twoSum(int[] a, int target) {
        int left = 0;
        int right = a.length - 1;
        while (left < right) {
            int sum = a[left] + a[right];
            if (sum == target) {
                return new int[]{left + 1, right + 1};
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
        return new int[]{-1, -1};
    }

    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        System.out.println(java.util.Arrays.toString(twoSum(nums, 9)));
    }
}
`,
    },
    {
      title: 'Palindrome check built-in style',
      description: 'Inward pointers with Character helpers.',
      code: `public class PalindromeCheck {
    static boolean isPalindrome(String s) {
        int left = 0;
        int right = s.length() - 1;
        while (left < right) {
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
                left++;
            }
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
                right--;
            }
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("A man, a plan, a canal: Panama")); // true
    }
}
`,
    },
  ],
  mistakes: [
    'Converging on unsorted data: the discard logic needs sorted order — sort or hash first.',
    'Using `<=` in the loop guard: pointers must stay strictly apart or they compare an element with itself.',
    'Moving the wrong side: advance the side the comparison rules out, not a fixed one.',
    'Forgetting 1-based answers: Two Sum II returns 1-indexed positions — add 1 at the end, not per step.',
  ],
  vizId: 'two-pointers-steps',
  problemIds: ['two-sum-ii-input-array-is-sorted', 'container-with-most-water', 'valid-palindrome'],
};
