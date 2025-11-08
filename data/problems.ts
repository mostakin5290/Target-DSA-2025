import type { Topic } from '../types';

// Helper function to extract title and difficulty.
// If no difficulty is specified, it will be categorized as 'Medium'.
const parseTitleAndDifficulty = (rawTitle: string): { title: string; difficulty: 'Easy' | 'Medium' | 'Hard' } => {
  const match = rawTitle.match(/\((easy|medium|hard)\)/i);
  if (match) {
    const title = rawTitle.replace(/\((easy|medium|hard)\)/i, '').trim();
    const difficulty = (match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase()) as 'Easy' | 'Medium' | 'Hard';
    return { title, difficulty };
  }
  return { title: rawTitle.trim(), difficulty: 'Medium' };
};

export const problemSheet: Topic[] = [
  {
    title: "1. Two Pointers",
    problems: [
      { id: 1001, ...parseTitleAndDifficulty("Pair with Target Sum (easy)"), url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
      { id: 1002, ...parseTitleAndDifficulty("Remove Duplicates (easy)"), url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/" },
      { id: 1003, ...parseTitleAndDifficulty("Squaring a Sorted Array (easy)"), url: "https://leetcode.com/problems/squares-of-a-sorted-array/" },
      { id: 1004, ...parseTitleAndDifficulty("Triplet Sum to Zero (medium)"), url: "https://leetcode.com/problems/3sum/" },
      { id: 1005, ...parseTitleAndDifficulty("Triplet Sum Close to Target (medium)"), url: "https://leetcode.com/problems/3sum-closest/" },
      { id: 1006, ...parseTitleAndDifficulty("Triplets with Smaller Sum (medium)"), url: "https://leetcode.com/problems/3sum-smaller/" },
      { id: 1007, ...parseTitleAndDifficulty("Subarrays with Product Less than a Target (medium)"), url: "https://leetcode.com/problems/subarray-product-less-than-k/" },
      { id: 1008, ...parseTitleAndDifficulty("Dutch National Flag Problem (medium)"), url: "https://leetcode.com/problems/sort-colors/" },
      { id: 1009, ...parseTitleAndDifficulty("Quadruple Sum to Target (medium)"), url: "https://leetcode.com/problems/4sum/" },
      { id: 1010, ...parseTitleAndDifficulty("Comparing Strings containing Backspaces (medium)"), url: "https://leetcode.com/problems/backspace-string-compare/" },
      { id: 1011, ...parseTitleAndDifficulty("Minimum Window Sort (medium)"), url: "https://leetcode.com/problems/shortest-unsorted-continuous-subarray/" },
    ]
  },
  {
    title: "2. Fast & Slow pointers",
    problems: [
      { id: 1012, ...parseTitleAndDifficulty("LinkedList Cycle (easy)"), url: "https://leetcode.com/problems/linked-list-cycle/" },
      { id: 1013, ...parseTitleAndDifficulty("Start of LinkedList Cycle (medium)"), url: "https://leetcode.com/problems/linked-list-cycle-ii/" },
      { id: 1014, ...parseTitleAndDifficulty("Happy Number (medium)"), url: "https://leetcode.com/problems/happy-number/" },
      { id: 1015, ...parseTitleAndDifficulty("Middle of the LinkedList (easy)"), url: "https://leetcode.com/problems/middle-of-the-linked-list/" },
      { id: 1016, ...parseTitleAndDifficulty("Palindrome LinkedList (medium)"), url: "https://leetcode.com/problems/palindrome-linked-list/" },
      { id: 1017, ...parseTitleAndDifficulty("Rearrange a LinkedList (medium)"), url: "https://leetcode.com/problems/reorder-list/" },
      { id: 1018, ...parseTitleAndDifficulty("Cycle in a Circular Array (hard)"), url: "https://leetcode.com/problems/circular-array-loop/" },
    ]
  },
  {
    title: "3. Sliding Window",
    problems: [
      { id: 1019, ...parseTitleAndDifficulty("Maximum Sum Subarray of Size K (easy)"), url: "https://leetcode.com/problems/maximum-average-subarray-i/" }, // GFG link replaced
      { id: 1020, ...parseTitleAndDifficulty("Smallest Subarray with a given sum (easy)"), url: "https://leetcode.com/problems/minimum-size-subarray-sum/" },
      { id: 1021, ...parseTitleAndDifficulty("Longest Substring with K Distinct Characters (medium)"), url: "https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/" },
      { id: 1022, ...parseTitleAndDifficulty("Fruits into Baskets (medium)"), url: "https://leetcode.com/problems/fruit-into-baskets/" },
      { id: 1023, ...parseTitleAndDifficulty("No-repeat Substring (hard)"), url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
      { id: 1024, ...parseTitleAndDifficulty("Longest Substring with Same Letters after Replacement (hard)"), url: "https://leetcode.com/problems/longest-repeating-character-replacement/" },
      { id: 1025, ...parseTitleAndDifficulty("Longest Subarray with Ones after Replacement (hard)"), url: "https://leetcode.com/problems/max-consecutive-ones-iii/" },
      { id: 1028, ...parseTitleAndDifficulty("Permutation in a String (hard)"), url: "https://leetcode.com/problems/permutation-in-string/" },
      { id: 1029, ...parseTitleAndDifficulty("String Anagrams (hard)"), url: "https://leetcode.com/problems/find-all-anagrams-in-a-string/" },
      { id: 1030, ...parseTitleAndDifficulty("Smallest Window containing Substring (hard)"), url: "https://leetcode.com/problems/minimum-window-substring/" },
      { id: 1031, ...parseTitleAndDifficulty("Words Concatenation (hard)"), url: "https://leetcode.com/problems/substring-with-concatenation-of-all-words/" },
    ]
  },
  {
    title: "4. Merge Intervals",
    problems: [
        { id: 1032, ...parseTitleAndDifficulty("Merge Intervals (medium)"), url: "https://leetcode.com/problems/merge-intervals/" },
        { id: 1033, ...parseTitleAndDifficulty("Insert Interval (medium)"), url: "https://leetcode.com/problems/insert-interval/" },
        { id: 1034, ...parseTitleAndDifficulty("Intervals Intersection (medium)"), url: "https://leetcode.com/problems/interval-list-intersections/" },
        { id: 1035, ...parseTitleAndDifficulty("Conflicting Appointments (medium)"), url: "https://leetcode.com/problems/non-overlapping-intervals/" }, // GFG link replaced with similar LC problem
        { id: 1036, ...parseTitleAndDifficulty("Minimum Meeting Rooms (hard)"), url: "https://leetcode.com/problems/meeting-rooms-ii/" },
        { id: 1038, ...parseTitleAndDifficulty("Employee Free Time (hard)"), url: "https://leetcode.com/problems/employee-free-time/" },
    ]
  },
  {
    title: "5. Cyclic Sort",
    problems: [
        { id: 1040, ...parseTitleAndDifficulty("Find the Missing Number (easy)"), url: "https://leetcode.com/problems/missing-number/" },
        { id: 1041, ...parseTitleAndDifficulty("Find all Missing Numbers (easy)"), url: "https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/" },
        { id: 1042, ...parseTitleAndDifficulty("Find the Duplicate Number (easy)"), url: "https://leetcode.com/problems/find-the-duplicate-number/" },
        { id: 1043, ...parseTitleAndDifficulty("Find all Duplicate Numbers (easy)"), url: "https://leetcode.com/problems/find-all-duplicates-in-an-array/" },
        { id: 1044, ...parseTitleAndDifficulty("Find the Corrupt Pair (easy)"), url: "https://leetcode.com/problems/set-mismatch/" },
        { id: 1045, ...parseTitleAndDifficulty("Find the Smallest Missing Positive Number (medium)"), url: "https://leetcode.com/problems/first-missing-positive/" },
    ]
  },
  {
    title: "6. In-place Reversal of a LinkedList",
    problems: [
        { id: 1047, ...parseTitleAndDifficulty("Reverse a LinkedList (easy)"), url: "https://leetcode.com/problems/reverse-linked-list/" },
        { id: 1048, ...parseTitleAndDifficulty("Reverse a Sub-list (medium)"), url: "https://leetcode.com/problems/reverse-linked-list-ii/" },
        { id: 1049, ...parseTitleAndDifficulty("Reverse every K-element Sub-list (medium)"), url: "https://leetcode.com/problems/reverse-nodes-in-k-group/" },
        { id: 1051, ...parseTitleAndDifficulty("Rotate a LinkedList (medium)"), url: "https://leetcode.com/problems/rotate-list/" },
    ]
  },
  {
    title: "7. Stack",
    problems: [
        { id: 1201, ...parseTitleAndDifficulty("Valid Parentheses (easy)"), url: "https://leetcode.com/problems/valid-parentheses/"},
        { id: 1202, ...parseTitleAndDifficulty("Min Stack (easy)"), url: "https://leetcode.com/problems/min-stack/" },
        { id: 1203, ...parseTitleAndDifficulty("Evaluate Reverse Polish Notation (medium)"), url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/" },
        { id: 1204, ...parseTitleAndDifficulty("Simplify Path (medium)"), url: "https://leetcode.com/problems/simplify-path/" },
        { id: 1205, ...parseTitleAndDifficulty("Decode String (medium)"), url: "https://leetcode.com/problems/decode-string/" },
    ]
  },
  {
    title: "8. Monotonic Stack",
    problems: [
        { id: 1052, ...parseTitleAndDifficulty("Next Greater Element I (easy)"), url: "https://leetcode.com/problems/next-greater-element-i/" },
        { id: 1053, ...parseTitleAndDifficulty("Daily Temperatures (medium)"), url: "https://leetcode.com/problems/daily-temperatures/" },
        { id: 1054, ...parseTitleAndDifficulty("Remove Nodes From Linked List (medium)"), url: "https://leetcode.com/problems/remove-nodes-from-linked-list/" },
        { id: 1056, ...parseTitleAndDifficulty("Remove All Adjacent Duplicates in String II (medium)"), url: "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii/" },
        { id: 1057, ...parseTitleAndDifficulty("Remove K Digits (medium)"), url: "https://leetcode.com/problems/remove-k-digits/" },
        { id: 1206, ...parseTitleAndDifficulty("Largest Rectangle in Histogram (hard)"), url: "https://leetcode.com/problems/largest-rectangle-in-histogram/" }
    ]
  },
  {
    title: "9. Graph Traversal",
    problems: [
        { id: 1207, ...parseTitleAndDifficulty("Number of Islands (medium)"), url: "https://leetcode.com/problems/number-of-islands/" },
        { id: 1208, ...parseTitleAndDifficulty("Clone Graph (medium)"), url: "https://leetcode.com/problems/clone-graph/" },
        { id: 1209, ...parseTitleAndDifficulty("Rotting Oranges (medium)"), url: "https://leetcode.com/problems/rotting-oranges/" },
        { id: 1210, ...parseTitleAndDifficulty("Pacific Atlantic Water Flow (medium)"), url: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
        { id: 1211, ...parseTitleAndDifficulty("Course Schedule (medium)"), url: "https://leetcode.com/problems/course-schedule/" },
        { id: 1212, ...parseTitleAndDifficulty("Word Ladder (hard)"), url: "https://leetcode.com/problems/word-ladder/" }
    ]
  },
  {
    title: "10. Tree Breadth First Search",
    problems: [
        { id: 1058, ...parseTitleAndDifficulty("Binary Tree Level Order Traversal (medium)"), url: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
        { id: 1059, ...parseTitleAndDifficulty("Reverse Level Order Traversal (medium)"), url: "https://leetcode.com/problems/binary-tree-level-order-traversal-ii/" },
        { id: 1060, ...parseTitleAndDifficulty("Zigzag Traversal (medium)"), url: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/" },
        { id: 1061, ...parseTitleAndDifficulty("Level Averages in a Binary Tree (easy)"), url: "https://leetcode.com/problems/average-of-levels-in-binary-tree/" },
        { id: 1062, ...parseTitleAndDifficulty("Minimum Depth of a Binary Tree (easy)"), url: "https://leetcode.com/problems/minimum-depth-of-binary-tree/" },
        { id: 1065, ...parseTitleAndDifficulty("Connect Level Order Siblings (medium)"), url: "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/" },
        { id: 1066, ...parseTitleAndDifficulty("Right View of a Binary Tree (medium)"), url: "https://leetcode.com/problems/binary-tree-right-side-view/" },
    ]
  },
  {
    title: "11. Tree Depth First Search",
    problems: [
        { id: 1067, ...parseTitleAndDifficulty("Binary Tree Path Sum (easy)"), url: "https://leetcode.com/problems/path-sum/" },
        { id: 1068, ...parseTitleAndDifficulty("All Paths for a Sum (medium)"), url: "https://leetcode.com/problems/path-sum-ii/" },
        { id: 1069, ...parseTitleAndDifficulty("Sum of Path Numbers (medium)"), url: "https://leetcode.com/problems/sum-root-to-leaf-numbers/" },
        { id: 1071, ...parseTitleAndDifficulty("Count Paths for a Sum (medium)"), url: "https://leetcode.com/problems/path-sum-iii/" },
        { id: 1072, ...parseTitleAndDifficulty("Tree Diameter (easy)"), url: "https://leetcode.com/problems/diameter-of-binary-tree/" },
        { id: 1073, ...parseTitleAndDifficulty("Path with Maximum Sum (hard)"), url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
    ]
  },
  {
    title: "12. Two Heaps",
    problems: [
        { id: 1078, ...parseTitleAndDifficulty("Find the Median of a Number Stream (hard)"), url: "https://leetcode.com/problems/find-median-from-data-stream/" },
        { id: 1079, ...parseTitleAndDifficulty("Sliding Window Median (hard)"), url: "https://leetcode.com/problems/sliding-window-median/" },
        { id: 1080, ...parseTitleAndDifficulty("Maximize Capital (hard)"), url: "https://leetcode.com/problems/ipo/" },
        { id: 1213, ...parseTitleAndDifficulty("Schedule Tasks on Minimum Machines (hard)"), url: "https://leetcode.com/problems/minimum-number-of-refueling-stops/" }
    ]
  },
  {
    title: "13. Greedy Algorithms",
    problems: [
        { id: 1214, ...parseTitleAndDifficulty("Jump Game (medium)"), url: "https://leetcode.com/problems/jump-game/" },
        { id: 1215, ...parseTitleAndDifficulty("Jump Game II (medium)"), url: "https://leetcode.com/problems/jump-game-ii/" },
        { id: 1216, ...parseTitleAndDifficulty("Gas Station (medium)"), url: "https://leetcode.com/problems/gas-station/" },
        { id: 1217, ...parseTitleAndDifficulty("Hand of Straights (medium)"), url: "https://leetcode.com/problems/hand-of-straights/" },
        { id: 1218, ...parseTitleAndDifficulty("Merge Triplets to Form Target Triplet (medium)"), url: "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/" },
    ]
  },
  {
    title: "14. Subsets",
    problems: [
        { id: 1082, ...parseTitleAndDifficulty("Subsets (medium)"), url: "https://leetcode.com/problems/subsets/" },
        { id: 1083, ...parseTitleAndDifficulty("Subsets With Duplicates (medium)"), url: "https://leetcode.com/problems/subsets-ii/" },
        { id: 1084, ...parseTitleAndDifficulty("Permutations (medium)"), url: "https://leetcode.com/problems/permutations/" },
        { id: 1085, ...parseTitleAndDifficulty("String Permutations by changing case (medium)"), url: "https://leetcode.com/problems/letter-case-permutation/" },
        { id: 1086, ...parseTitleAndDifficulty("Balanced Parentheses (medium)"), url: "https://leetcode.com/problems/generate-parentheses/" },
        { id: 1087, ...parseTitleAndDifficulty("Unique Generalized Abbreviations (medium)"), url: "https://leetcode.com/problems/generalized-abbreviation/" },
    ]
  },
  {
    title: "15. Modified Binary Search",
    problems: [
        { id: 1089, ...parseTitleAndDifficulty("Ceiling of a Number (easy)"), url: "https://leetcode.com/problems/search-insert-position/" },
        { id: 1090, ...parseTitleAndDifficulty("Next Letter (easy)"), url: "https://leetcode.com/problems/find-smallest-letter-greater-than-target/" },
        { id: 1091, ...parseTitleAndDifficulty("Number Range (medium)"), url: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/" },
        { id: 1092, ...parseTitleAndDifficulty("Search in a Sorted Infinite Array (medium)"), url: "https://leetcode.com/problems/search-in-a-sorted-array-of-unknown-size/" },
        { id: 1093, ...parseTitleAndDifficulty("Search Bitonic Array (hard)"), url: "https://leetcode.com/problems/find-in-mountain-array/" },
        { id: 1094, ...parseTitleAndDifficulty("Search in Rotated Array (medium)"), url: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
        { id: 1095, ...parseTitleAndDifficulty("Rotation Count (medium)"), url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
    ]
  },
  {
    title: "16. Bitwise XOR",
    problems: [
        { id: 1219, ...parseTitleAndDifficulty("Single Number (easy)"), url: "https://leetcode.com/problems/single-number/" },
        { id: 1220, ...parseTitleAndDifficulty("Single Number II (medium)"), url: "https://leetcode.com/problems/single-number-ii/" },
        { id: 1221, ...parseTitleAndDifficulty("Two Single Numbers (medium)"), url: "https://leetcode.com/problems/single-number-iii/"},
        { id: 1222, ...parseTitleAndDifficulty("Complement of Base 10 Integer (easy)"), url: "https://leetcode.com/problems/number-complement/" },
        { id: 1223, ...parseTitleAndDifficulty("Flipping an Image (easy)"), url: "https://leetcode.com/problems/flipping-an-image/" }
    ]
  },
  {
    title: "17. Top 'K' Elements",
    problems: [
        { id: 1096, ...parseTitleAndDifficulty("Kth Smallest Number (medium)"), url: "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/" },
        { id: 1097, ...parseTitleAndDifficulty("K' Closest Points to the Origin (medium)"), url: "https://leetcode.com/problems/k-closest-points-to-origin/" },
        { id: 1098, ...parseTitleAndDifficulty("Connect Ropes (medium)"), url: "https://leetcode.com/problems/minimum-cost-to-connect-sticks/" },
        { id: 1099, ...parseTitleAndDifficulty("Top 'K' Frequent Numbers (medium)"), url: "https://leetcode.com/problems/top-k-frequent-elements/" },
        { id: 1100, ...parseTitleAndDifficulty("Frequency Sort (medium)"), url: "https://leetcode.com/problems/sort-characters-by-frequency/" },
        { id: 1101, ...parseTitleAndDifficulty("Kth Largest Number in a Stream (easy)"), url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/" },
        { id: 1102, ...parseTitleAndDifficulty("K' Closest Numbers (medium)"), url: "https://leetcode.com/problems/find-k-closest-elements/" },
        { id: 1104, ...parseTitleAndDifficulty("Sum of Elements (medium)"), url: "https://www.geeksforgeeks.org/sum-of-all-elements-between-k1th-and-k2th-smallest-elements/" }, // Kept GFG as LC alternative is complex
        { id: 1105, ...parseTitleAndDifficulty("Rearrange String (medium)"), url: "https://leetcode.com/problems/reorganize-string/" },
    ]
  },
  {
    title: "18. K-way merge",
    problems: [
        { id: 1106, ...parseTitleAndDifficulty("Merge K Sorted Lists (hard)"), url: "https://leetcode.com/problems/merge-k-sorted-lists/" },
        { id: 1108, ...parseTitleAndDifficulty("Kth Smallest Number in a Sorted Matrix (medium)"), url: "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/" },
        { id: 1109, ...parseTitleAndDifficulty("Smallest Number Range (hard)"), url: "https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/" },
        { id: 1110, ...parseTitleAndDifficulty("K Pairs with Smallest Sums (medium)"), url: "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/" },
    ]
  },
  {
    title: "19. 0/1 Knapsack (DP)",
    problems: [
        { id: 1111, ...parseTitleAndDifficulty("0/1 Knapsack (medium)"), url: "https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/" },
        { id: 1112, ...parseTitleAndDifficulty("Equal Subset Sum Partition (medium)"), url: "https://leetcode.com/problems/partition-equal-subset-sum/" },
        { id: 1113, ...parseTitleAndDifficulty("Subset Sum (medium)"), url: "https://leetcode.com/problems/combination-sum-iv/" }, // GFG link replaced with related DP problem
        { id: 1114, ...parseTitleAndDifficulty("Minimum Subset Sum Difference (hard)"), url: "https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference/" },
        { id: 1115, ...parseTitleAndDifficulty("Count of Subset Sum (hard)"), url: "https://www.geeksforgeeks.org/count-of-subsets-with-sum-equal-to-x/" }, // Kept GFG, this is a classic
        { id: 1116, ...parseTitleAndDifficulty("Target Sum (medium)"), url: "https://leetcode.com/problems/target-sum/" },
    ]
  },
  {
    title: "20. Backtracking",
    problems: [
        { id: 1117, ...parseTitleAndDifficulty("Combination Sum (medium)"), url: "https://leetcode.com/problems/combination-sum/"},
        { id: 1118, ...parseTitleAndDifficulty("Word Search (medium)"), url: "https://leetcode.com/problems/word-search/" },
        { id: 1119, ...parseTitleAndDifficulty("Sudoku Solver (hard)"), url: "https://leetcode.com/problems/sudoku-solver/" },
        { id: 1120, ...parseTitleAndDifficulty("Factor Combinations (medium)"), url: "https://leetcode.com/problems/factor-combinations/" },
        { id: 1121, ...parseTitleAndDifficulty("Split a String Into the Max Number of Unique Substrings (medium)"), url: "https://leetcode.com/problems/split-a-string-into-the-max-number-of-unique-substrings/" },
    ]
  },
  {
    title: "21. Trie",
    problems: [
        { id: 1122, ...parseTitleAndDifficulty("Implement Trie (Prefix Tree) (medium)"), url: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
        { id: 1123, ...parseTitleAndDifficulty("Index Pairs of a String (easy)"), url: "https://leetcode.com/problems/index-pairs-of-a-string/" },
        { id: 1124, ...parseTitleAndDifficulty("Design Add and Search Words Data Structure (medium)"), url: "https://leetcode.com/problems/design-add-and-search-words-data-structure/" },
        { id: 1125, ...parseTitleAndDifficulty("Extra Characters in a String (medium)"), url: "https://leetcode.com/problems/extra-characters-in-a-string/" },
        { id: 1126, ...parseTitleAndDifficulty("Search Suggestions System (medium)"), url: "https://leetcode.com/problems/search-suggestions-system/" },
    ]
  },
  {
    title: "22. Topological Sort (Graph)",
    problems: [
        { id: 1127, ...parseTitleAndDifficulty("Tasks Scheduling (medium)"), url: "https://leetcode.com/problems/course-schedule/" },
        { id: 1128, ...parseTitleAndDifficulty("Tasks Scheduling Order (medium)"), url: "https://leetcode.com/problems/course-schedule-ii/" },
        { id: 1130, ...parseTitleAndDifficulty("Alien Dictionary (hard)"), url: "https://leetcode.com/problems/alien-dictionary/" },
        { id: 1131, ...parseTitleAndDifficulty("Reconstructing a Sequence (hard)"), url: "https://leetcode.com/problems/sequence-reconstruction/" },
        { id: 1132, ...parseTitleAndDifficulty("Minimum Height Trees (medium)"), url: "https://leetcode.com/problems/minimum-height-trees/" },
    ]
  }
];