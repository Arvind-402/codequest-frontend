import type { Topic } from '../types/topic';

export const TOPICS: Topic[] = [
  // ==========================================
  // DSA (10 topics)
  // ==========================================
  {
    id: 'dsa-two-pointers',
    title: 'Two Pointers & Sliding Window Patterns',
    category: 'DSA',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    shortDescription: 'Master optimal linear scan techniques for subarray sums, palindromes, and pair sums without quadratic overhead.',
    interviewQuestion: 'Explain the Two Pointers and Sliding Window patterns. When does sliding window apply over two pointers, and what is the optimal strategy to find the longest substring with at most k distinct characters?',
    followUpQuestions: [
      'How do you avoid unnecessary shrink steps in fixed-size sliding windows?',
      'Can you apply two pointers on an unsorted array without sorting first?'
    ],
    revisionNotes: [
      'Two pointers work when monotonic properties exist (e.g., sorted arrays or left/right convergence).',
      'Sliding window is specifically for contiguous subsegments/ranges.',
      'Dynamic sliding window maintains a valid window state using a frequency map or count variable.',
      'Time complexity is O(N) because each pointer advances at most N times.'
    ],
    keyConcepts: [
      'Monotonic condition for moving pointers',
      'Window expansion (right pointer) vs contraction (left pointer)',
      'O(N) amortized time proof',
      'Hash map / frequency array window state management'
    ],
    practicalExample: 'Given string "eceba" and k=2, right pointer expands until distinct count > 2, then left pointer contracts until count is back to 2, tracking max window length (3 for "ece").',
    suggestedAnswerStructure: [
      { section: 'High-Level Concept', guidance: 'Define two-pointer convergence vs window range expansion.' },
      { section: 'Applicability Criteria', guidance: 'Explain when contiguous monotonic constraints enable O(N) traversal.' },
      { section: 'Walkthrough of Substring Problem', guidance: 'State the state tracking (frequency map) and loop condition.' },
      { section: 'Complexity & Edge Cases', guidance: 'O(N) time, O(min(N, charset)) space, empty string / k=0 handling.' }
    ],
    tags: ['Arrays', 'Strings', 'Sliding Window', 'O(N)']
  },
  {
    id: 'dsa-binary-search-answer',
    title: 'Binary Search on Solution Space',
    category: 'DSA',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    shortDescription: 'Apply binary search beyond arrays by identifying monotonic feasibility functions in optimization problems.',
    interviewQuestion: 'How does binary search apply to optimization problems on an answer space (e.g., Koko Eating Bananas, Capacity to Ship Packages)? Walk through how you formulate the search range and feasibility check.',
    followUpQuestions: [
      'What is the prerequisite condition for the feasibility function (isPossible(x))?',
      'How do you prevent integer overflow when calculating mid?'
    ],
    revisionNotes: [
      'If isPossible(k) is false for k < K* and true for k >= K*, the solution space is monotonic.',
      'Low is minimum possible answer, High is theoretical upper bound (e.g. max element or sum).',
      'Feasibility check is usually greedy O(N).',
      'Overall complexity: O(N * log(High - Low)).'
    ],
    keyConcepts: [
      'Monotonic predicate function f(x)',
      'Mid calculation: mid = low + (high - low) / 2',
      'Boundary shifting: if feasible high = mid, else low = mid + 1',
      'Greedy simulation within predicate'
    ],
    practicalExample: 'Shipping packages in D days: search range is [max(weights), sum(weights)]. For a candidate capacity, greedily count days needed. If days <= D, try smaller capacity.',
    suggestedAnswerStructure: [
      { section: 'Pattern Identification', guidance: 'Explain how minimization of maximum values indicates binary search on answer.' },
      { section: 'Search Range Boundaries', guidance: 'Derive lower bound and upper bound mathematically.' },
      { section: 'Feasibility Function', guidance: 'Show greedy verification logic and time complexity.' },
      { section: 'Termination Condition', guidance: 'Clarify while (low < high) vs while (low <= high).' }
    ],
    tags: ['Binary Search', 'Optimization', 'Greedy', 'Algorithms']
  },
  {
    id: 'dsa-tree-bfs-dfs',
    title: 'Tree Traversals: DFS vs BFS & Serialization',
    category: 'DSA',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    shortDescription: 'Deep dive into recursive/iterative tree traversals, level-order queues, and serialization formats.',
    interviewQuestion: 'Compare Depth-First Search (Pre-order, In-order, Post-order) and Breadth-First Search (Level-order) on binary trees. How would you serialize and deserialize a binary tree to and from a string?',
    followUpQuestions: [
      'What are the space complexity trade-offs between DFS recursion stack and BFS queue in skewed vs balanced trees?',
      'Why is in-order traversal of a BST significant?'
    ],
    revisionNotes: [
      'DFS uses recursive call stack or explicit stack (space O(H) where H is height).',
      'BFS uses queue (space O(W) where W is max tree width, up to N/2 in complete tree).',
      'Serialization encodes null nodes (e.g. with "#") in pre-order or level-order to uniquely reconstruct tree.',
      'In-order traversal on a Binary Search Tree produces strictly ascending order.'
    ],
    keyConcepts: [
      'Call stack vs Queue memory trade-offs',
      'Pre-order (Root-Left-Right) vs In-order (Left-Root-Right)',
      'Level-order delimiter formatting',
      'Handling skewed trees O(N) height vs balanced trees O(log N)'
    ],
    practicalExample: 'Pre-order serialization of root 1 with left 2 and right 3: "1,2,#,#,3,#,#". Deserialization parses tokens recursively, popping from a queue.',
    suggestedAnswerStructure: [
      { section: 'Traversal Types Comparison', guidance: 'Contrast DFS orderings and BFS level processing.' },
      { section: 'Space Complexity Analysis', guidance: 'Highlight balanced tree O(log N) vs skewed tree O(N) vs complete tree leaf level O(N/2).' },
      { section: 'Serialization Strategy', guidance: 'Explain why null markers are required for unambiguous reconstruction.' }
    ],
    tags: ['Binary Tree', 'DFS', 'BFS', 'Serialization']
  },
  {
    id: 'dsa-lru-cache',
    title: 'LRU Cache Design & Doubly Linked List',
    category: 'DSA',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    shortDescription: 'Combine Hash Map and Doubly Linked List for strict O(1) get and put operations with eviction.',
    interviewQuestion: 'How would you design a Least Recently Used (LRU) Cache that supports get(key) and put(key, value) in strictly O(1) time complexity?',
    followUpQuestions: [
      'Why cannot a singly linked list achieve O(1) eviction?',
      'How do you make the cache thread-safe in a multi-threaded application?'
    ],
    revisionNotes: [
      'Hash Map provides O(1) key-to-node lookup.',
      'Doubly Linked List allows O(1) node removal and insertion at head/tail.',
      'Dummy head and tail sentinel nodes eliminate edge cases for empty list or single element.',
      'On get or put of existing key, remove node and prepend to head (most recently used).'
    ],
    keyConcepts: [
      'HashMap + Doubly Linked List hybrid structure',
      'Dummy Head & Tail sentinel pointers',
      'O(1) node detachment and head insertion',
      'Eviction from tail.prev when capacity exceeded'
    ],
    practicalExample: 'Capacity 2. put(1,1), put(2,2). get(1) -> moves node 1 to front. put(3,3) -> evicts node 2 (tail). List order becomes [3, 1].',
    suggestedAnswerStructure: [
      { section: 'Data Structure Selection', guidance: 'Explain why HashMap alone or array/singly linked list fails O(1).' },
      { section: 'Core Invariants & Sentinels', guidance: 'Explain dummy head/tail and node pointer manipulation.' },
      { section: 'Operations Breakdown', guidance: 'Step-by-step get(key) and put(key, value) logic.' },
      { section: 'Concurrency Considerations', guidance: 'Mention ReadWrite locks or ConcurrentHashMap with segmented locking.' }
    ],
    tags: ['LRU Cache', 'Doubly Linked List', 'HashMap', 'Design']
  },
  {
    id: 'dsa-graph-topological-sort',
    title: 'Graph Topological Sort & Cycle Detection',
    category: 'DSA',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    shortDescription: 'Resolve task dependencies and detect cycles in Directed Acyclic Graphs using Kahn’s Algorithm and DFS.',
    interviewQuestion: 'Explain Topological Sorting on a Directed Acyclic Graph (DAG). How do you implement Kahn’s Algorithm using indegrees, and how does it detect cycles?',
    followUpQuestions: [
      'How do you solve topological sort using DFS with node coloring (3 states)?',
      'What happens if the graph has multiple disconnected components?'
    ],
    revisionNotes: [
      'Topological sort is a linear ordering of vertices where for every directed edge u -> v, u comes before v.',
      'Kahns algorithm uses in-degree array: enqueue all vertices with in-degree 0.',
      'Process queue: decrement in-degrees of neighbors. If neighbor in-degree reaches 0, enqueue it.',
      'If processed count < total vertices, a cycle exists (deadlock).'
    ],
    keyConcepts: [
      'In-degree array computation O(V + E)',
      'Queue of zero-indegree sources',
      'Cycle detection condition: processed < V',
      'DFS 3-color state: unvisited (0), visiting (1), visited (2)'
    ],
    practicalExample: 'Course Schedule problem: prerequisites [0, 1] means 1 -> 0. In-degree of 0 is 1, in-degree of 1 is 0. 1 is taken first, freeing 0.',
    suggestedAnswerStructure: [
      { section: 'Definition & Preconditions', guidance: 'Define DAG requirement and real-world dependency use cases.' },
      { section: 'Kahn’s Algorithm Steps', guidance: 'Outline in-degree tracking, queue processing, and neighbor updates.' },
      { section: 'Cycle Detection Proof', guidance: 'Demonstrate why vertices in a cycle never reach 0 in-degree.' },
      { section: 'Complexity', guidance: 'Confirm O(V + E) time and O(V) space.' }
    ],
    tags: ['Graphs', 'Topological Sort', 'Cycle Detection', 'BFS']
  },
  {
    id: 'dsa-dynamic-programming-patterns',
    title: 'Dynamic Programming: Memoization vs Tabulation',
    category: 'DSA',
    difficulty: 'Advanced',
    estimatedMinutes: 12,
    shortDescription: 'Master the transition from recursive overlapping subproblems with memoization to bottom-up DP table space optimization.',
    interviewQuestion: 'What are the essential ingredients of a Dynamic Programming problem? Explain the difference between Top-Down Memoization and Bottom-Up Tabulation, using 0/1 Knapsack or Longest Common Subsequence.',
    followUpQuestions: [
      'How do you reduce 2D DP space complexity to 1D space in 0/1 Knapsack?',
      'When is greedy approach valid instead of DP?'
    ],
    revisionNotes: [
      'Prerequisites: Optimal Substructure + Overlapping Subproblems.',
      'Top-Down: Natural recursive formulation with cache lookup; risks stack overflow for large depth.',
      'Bottom-Up: Iterative table computation following topological dependency order.',
      'Rolling array / 1D state optimization reduces O(N * W) space to O(W).'
    ],
    keyConcepts: [
      'State definition and recurrence relation',
      'Base cases and boundary initialization',
      'Topological order of subproblem evaluation',
      'Space compression using rolling variables/arrays'
    ],
    practicalExample: '0/1 Knapsack: dp[i][w] = max(dp[i-1][w], val[i] + dp[i-1][w - weight[i]]). When compressing to 1D, iterate weights backward to prevent using item twice.',
    suggestedAnswerStructure: [
      { section: 'Core Principles', guidance: 'Define optimal substructure and overlapping subproblems.' },
      { section: 'Top-Down vs Bottom-Up', guidance: 'Compare call stack overhead vs table ordering.' },
      { section: 'Knapsack Formulation', guidance: 'Derive state transition and explain reverse inner loop for 1D array.' }
    ],
    tags: ['Dynamic Programming', 'Recursion', 'Optimization', 'Knapsack']
  },
  {
    id: 'dsa-heap-top-k',
    title: 'Heaps & Priority Queues for Top-K Elements',
    category: 'DSA',
    difficulty: 'Intermediate',
    estimatedMinutes: 8,
    shortDescription: 'Efficiently track streaming minimums, maximums, and top-K frequent elements with bounded priority queues.',
    interviewQuestion: 'How do you find the Kth largest element in an unsorted stream of numbers in optimal time and memory? Compare Min-Heap vs Max-Heap vs QuickSelect.',
    followUpQuestions: [
      'What is the time complexity of building a heap from N elements (heapify)? Why is it O(N) instead of O(N log N)?',
      'What are the worst-case drawbacks of QuickSelect?'
    ],
    revisionNotes: [
      'Maintain a Min-Heap of size K: the root is always the Kth largest seen so far.',
      'For each incoming number, if > heap.peek(), push and pop root. Space is bounded to O(K).',
      'Time complexity is O(N log K) compared to sorting O(N log N).',
      'QuickSelect gives O(N) average time but O(N^2) worst case without median-of-medians.'
    ],
    keyConcepts: [
      'Min-Heap invariant for Kth largest',
      'Bounded memory footprint O(K)',
      'O(N) buildHeap mathematical summation proof',
      'Streaming vs offline dataset trade-offs'
    ],
    practicalExample: 'Stream: [3,2,1,5,6,4], K=2. Min-heap keeps largest 2: [5,6]. Peak is 5 (2nd largest).',
    suggestedAnswerStructure: [
      { section: 'Data Structure Choice', guidance: 'Explain why Min-Heap (not Max-Heap) is optimal for Kth largest.' },
      { section: 'Streaming Algorithm', guidance: 'Describe heap insertion, capacity capping at K, and root inspection.' },
      { section: 'Complexity Analysis', guidance: 'O(N log K) time, O(K) memory, contrast with QuickSelect.' }
    ],
    tags: ['Heap', 'Priority Queue', 'Top K', 'QuickSelect']
  },
  {
    id: 'dsa-monotonic-stack',
    title: 'Monotonic Stack for Next Greater Element',
    category: 'DSA',
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    shortDescription: 'Solve range maximums, daily temperatures, and histogram areas in linear time with monotonic stacks.',
    interviewQuestion: 'Explain how a Monotonic Stack works. How do you use it to find the Next Greater Element for all items in an array in O(N) time?',
    followUpQuestions: [
      'How does monotonic stack apply to Largest Rectangle in Histogram?',
      'Why is each element pushed and popped at most once?'
    ],
    revisionNotes: [
      'A monotonic stack preserves strictly increasing or decreasing element order.',
      'When a new element violates the monotonic order, pop items and resolve their answers.',
      'Store indices instead of values to calculate distance and width.',
      'Amortized time is O(N) because each item enters and leaves the stack at most once.'
    ],
    keyConcepts: [
      'Monotonically decreasing stack for Next Greater',
      'Resolution of pending elements upon pop',
      'Index tracking for distance calculation',
      'Amortized linear time complexity'
    ],
    practicalExample: 'Daily Temperatures: [73, 74, 75, 71, 69, 72]. When encountering 72, stack pops 69 (wait 1 day) and 71 (wait 2 days).',
    suggestedAnswerStructure: [
      { section: 'Intuition & Maintenance', guidance: 'Describe the stack invariant and when elements get popped.' },
      { section: 'Algorithm Step-by-Step', guidance: 'Show how popping resolves the query for popped index.' },
      { section: 'Amortized Complexity', guidance: 'Formalize 2N push/pop operations = O(N) total runtime.' }
    ],
    tags: ['Stack', 'Monotonic Stack', 'Next Greater Element', 'O(N)']
  },
  {
    id: 'dsa-trie-prefix-tree',
    title: 'Trie (Prefix Tree) Implementation & Autocomplete',
    category: 'DSA',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    shortDescription: 'Build prefix trees for string lookup, typeahead search, and prefix matching in O(L) time.',
    interviewQuestion: 'What is a Trie? How would you implement insert, search, and startsWith operations? Compare Trie vs Hash Map for prefix lookups.',
    followUpQuestions: [
      'How can memory overhead of sparse Trie nodes be reduced (Compressed Trie / Radix Tree)?',
      'How do you support wildcard or fuzzy search in a Trie?'
    ],
    revisionNotes: [
      'Trie node stores a map or fixed array of children pointers and an isEndOfWord boolean flag.',
      'Insert and search take O(L) time where L is string length, independent of total word count N.',
      'HashMap requires O(L) per search but cannot do prefix wildcard or sorted keys efficiently.',
      'Memory can be large due to unused pointer references in 26-element arrays.'
    ],
    keyConcepts: [
      'Node structure: children pointers array/map + isEnd flag',
      'O(L) search where L = length of query key',
      'Shared common prefixes between words',
      'Space trade-offs vs Hash Tables'
    ],
    practicalExample: 'Inserting "apple" and "app". "app" marks node at \'p\' with isEnd=true; "apple" continues to \'e\' and marks isEnd=true. startsWith("app") returns true.',
    suggestedAnswerStructure: [
      { section: 'Node Architecture', guidance: 'Define TrieNode class with children pointers and boolean terminator.' },
      { section: 'Core Operations Walkthrough', guidance: 'Explain char-by-char traversal for insert and prefix check.' },
      { section: 'Trie vs Hash Map Comparison', guidance: 'Highlight prefix search capability and spatial trade-offs.' }
    ],
    tags: ['Trie', 'Prefix Tree', 'Strings', 'Data Structures']
  },
  {
    id: 'dsa-time-space-complexity',
    title: 'Asymptotic Analysis & Master Theorem',
    category: 'DSA',
    difficulty: 'Beginner',
    estimatedMinutes: 7,
    shortDescription: 'Confidently compute Big-O, Big-Omega, Big-Theta, recursive recurrence relations, and auxiliary space.',
    interviewQuestion: 'Explain the difference between Big-O, Big-Omega, and Big-Theta. How do you analyze recursive algorithms like Merge Sort using the Master Theorem?',
    followUpQuestions: [
      'What is auxiliary space vs total space complexity?',
      'Why is space complexity of recursive Fibonacci O(N) and not O(2^N)?'
    ],
    revisionNotes: [
      'Big-O represents asymptotic upper bound; Big-Omega is lower bound; Big-Theta is tight bound.',
      'Master Theorem: T(n) = a*T(n/b) + f(n). For Merge Sort, a=2, b=2, f(n)=O(n) -> Case 2 -> O(n log n).',
      'Call stack depth determines recursive space complexity, not total recursive calls.',
      'Auxiliary space measures extra memory allocated excluding input memory.'
    ],
    keyConcepts: [
      'Upper bound (O) vs Tight bound (Theta)',
      'Divide and conquer recurrence: T(n) = aT(n/b) + O(n^d)',
      'Call stack depth tracking',
      'Auxiliary memory distinction'
    ],
    practicalExample: 'Merge Sort splits into 2 subproblems of size n/2 with linear merge time: T(n) = 2T(n/2) + O(n) = O(n log n) runtime and O(n) auxiliary space.',
    suggestedAnswerStructure: [
      { section: 'Notation Definitions', guidance: 'Distinguish Big-O (upper), Omega (lower), and Theta (tight).' },
      { section: 'Recurrence Relations', guidance: 'State the Master Theorem formula and case breakdown.' },
      { section: 'Recursive Space Analysis', guidance: 'Explain why call stack space equals maximum tree depth.' }
    ],
    tags: ['Complexity', 'Big O', 'Master Theorem', 'Recursion']
  },

  // ==========================================
  // OOPS & Programming (8 topics)
  // ==========================================
  {
    id: 'oops-polymorphism',
    title: 'Polymorphism: Compile-Time vs Runtime (vtable)',
    category: 'OOPS',
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    shortDescription: 'Understand method overloading, overriding, virtual function tables, dynamic dispatch, and interface contracts.',
    interviewQuestion: 'Explain Compile-Time Polymorphism vs Runtime Polymorphism. How does the Virtual Table (vtable) and Virtual Pointer (vptr) enable dynamic method dispatch internally?',
    followUpQuestions: [
      'What is the performance overhead of virtual function calls compared to direct calls?',
      'Why should base class destructors always be declared virtual in C++?'
    ],
    revisionNotes: [
      'Compile-time (static): Function/Operator overloading and generics/templates resolved at compile time.',
      'Runtime (dynamic): Method overriding resolved at runtime via base class references.',
      'Vtable is a compiler-generated lookup table of function pointers for classes with virtual functions.',
      'Each object instance contains a hidden vptr pointing to the class vtable.'
    ],
    keyConcepts: [
      'Static binding vs Dynamic dispatch',
      'Vtable array of function pointers',
      'Vptr per-object overhead',
      'Virtual destructor necessity for clean resource deallocation'
    ],
    practicalExample: 'Base* b = new Derived(); b->speak(); Compiler replaces call with *(b->vptr[0])(), executing Derived::speak at runtime.',
    suggestedAnswerStructure: [
      { section: 'Conceptual Distinction', guidance: 'Compare overloading (static) vs overriding (dynamic).' },
      { section: 'Under the Hood (vtable & vptr)', guidance: 'Describe object memory layout with vptr and static table.' },
      { section: 'Virtual Destructor Caveat', guidance: 'Explain memory leaks when deleting derived object via base pointer.' }
    ],
    tags: ['Polymorphism', 'vtable', 'OOP', 'Dynamic Dispatch']
  },
  {
    id: 'oops-solid-principles',
    title: 'SOLID Principles in Clean Software Architecture',
    category: 'OOPS',
    difficulty: 'Intermediate',
    estimatedMinutes: 11,
    shortDescription: 'Deep dive into Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.',
    interviewQuestion: 'Walk through each of the SOLID principles with a concrete software engineering example. Pay special attention to the Liskov Substitution Principle and Dependency Inversion.',
    followUpQuestions: [
      'How does the Open/Closed Principle prevent regression bugs in production?',
      'What is the difference between Dependency Inversion and Dependency Injection?'
    ],
    revisionNotes: [
      'S - Single Responsibility: Class should have only one reason to change.',
      'O - Open/Closed: Open for extension, closed for modification (via interfaces/strategy pattern).',
      'L - Liskov Substitution: Subtypes must be substitutable for base types without breaking behavior.',
      'I - Interface Segregation: Clients should not be forced to depend on methods they do not use.',
      'D - Dependency Inversion: High-level modules should depend on abstractions, not concrete details.'
    ],
    keyConcepts: [
      'Square-Rectangle inheritance violation of LSP',
      'Strategy pattern adhering to Open/Closed',
      'Inversion of Control (IoC) containers',
      'Fine-grained role interfaces'
    ],
    practicalExample: 'NotificationService depends on NotificationSender interface. We can add SlackSender, EmailSender, or SmsSender without modifying NotificationService.',
    suggestedAnswerStructure: [
      { section: 'Overview & Philosophy', guidance: 'State why SOLID enables maintainability and unit testing.' },
      { section: 'Deep Dive into LSP', guidance: 'Use the Rectangle/Square anti-pattern to show behavioral invariants.' },
      { section: 'Deep Dive into DIP', guidance: 'Contrast direct instantiation with interface abstraction.' }
    ],
    tags: ['SOLID', 'Architecture', 'Design Principles', 'Clean Code']
  },
  {
    id: 'oops-encapsulation-abstraction',
    title: 'Encapsulation vs Abstraction & Information Hiding',
    category: 'OOPS',
    difficulty: 'Beginner',
    estimatedMinutes: 7,
    shortDescription: 'Differentiate data encapsulation (bundling & access control) from abstraction (hiding implementation complexity).',
    interviewQuestion: 'What is the precise difference between Encapsulation and Abstraction? Provide clear code architectural examples illustrating both.',
    followUpQuestions: [
      'How do access modifiers (private, protected, public) enforce encapsulation?',
      'Can you have encapsulation without abstraction?'
    ],
    revisionNotes: [
      'Encapsulation is data hiding: bundling data and methods inside a unit, controlling access via getters/setters/invariants.',
      'Abstraction is complexity hiding: showing only essential features of an object (what it does vs how it does it).',
      'Encapsulation happens at implementation level; Abstraction happens at design/interface level.',
      'Interfaces and abstract classes represent pure abstraction.'
    ],
    keyConcepts: [
      'Encapsulation = Wrapping + Restricting direct field access',
      'Abstraction = Exposing intent while concealing implementation',
      'Invariants protection via private state',
      'Interface contracts'
    ],
    practicalExample: 'A Car: The steering wheel and pedals provide an Abstraction (you drive without knowing fuel injection physics). The internal transmission logic is Encapsulated in the gearbox component.',
    suggestedAnswerStructure: [
      { section: 'Core Definitions', guidance: 'Encapsulation (packaging & access control) vs Abstraction (interface simplicity).' },
      { section: 'Concrete Analogy & Code Example', guidance: 'Show private fields with validation vs interface contracts.' },
      { section: 'Architectural Benefits', guidance: 'Explain how both reduce coupling and guard against invalid state.' }
    ],
    tags: ['Encapsulation', 'Abstraction', 'OOP', 'Fundamentals']
  },
  {
    id: 'oops-stack-vs-heap',
    title: 'Memory Management: Stack vs Heap & Pointer Safety',
    category: 'PROGRAMMING',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    shortDescription: 'Analyze memory allocation, stack frames, heap allocation overhead, dangling pointers, and memory leaks.',
    interviewQuestion: 'Compare Stack and Heap memory allocation. How are variable lifecycles managed in both, and what causes stack overflow vs heap fragmentation/memory leaks?',
    followUpQuestions: [
      'Why is stack allocation significantly faster than heap allocation?',
      'How do smart pointers (unique_ptr, shared_ptr) in modern C++ or garbage collectors in Java/Go manage heap memory?'
    ],
    revisionNotes: [
      'Stack: LIFO memory, fixed size, CPU managed via stack pointer register, extremely fast, auto deallocated on frame exit.',
      'Heap: Dynamic size, manual/GC managed, requires finding free memory blocks, subject to fragmentation.',
      'Stack overflow occurs when call stack exceeds limit (e.g. infinite recursion or massive local arrays).',
      'Heap memory leaks happen when allocated memory has no references but is never freed.'
    ],
    keyConcepts: [
      'Stack pointer manipulation vs Heap metadata allocator',
      'LIFO scope lifecycle vs Dynamic pointer lifetime',
      'Dangling pointers and use-after-free vulnerabilities',
      'RAII (Resource Acquisition Is Initialization)'
    ],
    practicalExample: 'Local int x = 10 resides on the stack. int* arr = new int[1000] allocates pointer on stack and 4000 bytes on heap. Omitting delete[] causes heap leak.',
    suggestedAnswerStructure: [
      { section: 'Core Characteristics Comparison', guidance: 'Compare speed, size limit, lifetime, and management mechanism.' },
      { section: 'Under the Hood Performance', guidance: 'Explain CPU stack pointer bump vs free list / bin search.' },
      { section: 'Common Memory Bugs', guidance: 'Define stack overflow, memory leaks, and dangling pointers.' }
    ],
    tags: ['Memory', 'Stack', 'Heap', 'Pointers', 'C++']
  },
  {
    id: 'oops-garbage-collection',
    title: 'Garbage Collection & Reference Cycles',
    category: 'PROGRAMMING',
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    shortDescription: 'Explore mark-and-sweep, generational GC, reference counting, and breaking circular memory references.',
    interviewQuestion: 'How does Garbage Collection work in modern runtime environments (Java JVM / V8 / Python)? How does Generational Garbage Collection optimize throughput, and how are circular references handled?',
    followUpQuestions: [
      'Why does pure reference counting fail on circular references?',
      'What is a "Stop The World" pause and how do modern collectors mitigate it?'
    ],
    revisionNotes: [
      'Reference Counting increments on reference copy and frees when count reaches 0; fails with circular references (A -> B -> A).',
      'Tracing GC (Mark and Sweep) traverses from GC Roots (stack variables, static registers). Unreachable objects are swept.',
      'Generational Hypothesis: most objects die young. Divides heap into Young (Eden, Survivor) and Old/Tenured generation.',
      'Minor GC cleans Young gen quickly; Major/Full GC inspects Old gen infrequently.'
    ],
    keyConcepts: [
      'GC Roots definition',
      'Mark-Sweep-Compact phases',
      'Weak generational hypothesis',
      'Weak references (WeakRef) for breaking cycles'
    ],
    practicalExample: 'Node A references Node B and Node B references Node A. If both are removed from the root list, reference counting leaves count=1 (leak), but Mark-and-Sweep drops them because they are disconnected from roots.',
    suggestedAnswerStructure: [
      { section: 'Tracing vs Reference Counting', guidance: 'Contrast reference counting limitations with graph reachability.' },
      { section: 'Generational Collection Architecture', guidance: 'Describe Eden, Survivor spaces, and promotion to Tenured space.' },
      { section: 'Mitigating Latency', guidance: 'Explain concurrent marking and compacting to minimize STW pauses.' }
    ],
    tags: ['Garbage Collection', 'JVM', 'Memory', 'V8']
  },
  {
    id: 'oops-immutability-concurrency',
    title: 'Immutability & Thread Safety in Concurrent Systems',
    category: 'PROGRAMMING',
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    shortDescription: 'Design thread-safe concurrent code using immutable objects, copy-on-write, and atomic primitives.',
    interviewQuestion: 'Why are immutable objects inherently thread-safe? How do you implement an immutable class correctly, and what are the trade-offs regarding memory allocation and garbage collection?',
    followUpQuestions: [
      'What is the difference between shallow immutability and deep immutability?',
      'How does Copy-On-Write data structures balance read performance with write safety?'
    ],
    revisionNotes: [
      'Thread safety issues (race conditions) require shared mutable state. Immutability removes the mutation side.',
      'Immutable class requirements: final class, private final fields, no setters, defensive copies in constructor and getters.',
      'Shallow immutability (e.g. Object.freeze in JS) only freezes top-level keys; nested objects remain mutable.',
      'Trade-off: high rate of object creation can pressure memory/GC without persistent data structures (HAMT).'
    ],
    keyConcepts: [
      'Elimination of data race without mutex locks',
      'Defensive copying of mutable dependencies',
      'Deep vs Shallow immutability',
      'Structural sharing in persistent data structures'
    ],
    practicalExample: 'String in Java is immutable. Passing a String across 10 threads requires zero locks or synchronization because no thread can alter its internal byte array.',
    suggestedAnswerStructure: [
      { section: 'Thread Safety Rationale', guidance: 'Show why race conditions require both concurrent access and mutation.' },
      { section: 'Implementation Checklist', guidance: 'Detail final keyword, private members, defensive copy in/out.' },
      { section: 'Performance Implications', guidance: 'Discuss GC allocation rate and structural sharing solutions.' }
    ],
    tags: ['Immutability', 'Concurrency', 'Thread Safety', 'Functional']
  },

  // ==========================================
  // DBMS (7 topics)
  // ==========================================
  {
    id: 'dbms-acid-transactions',
    title: 'ACID Properties & Write-Ahead Logging (WAL)',
    category: 'DBMS',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    shortDescription: 'Understand how relational databases guarantee Atomicity, Consistency, Isolation, and Durability under crashes.',
    interviewQuestion: 'Explain each of the ACID properties. How does an engine like InnoDB or PostgreSQL physically ensure Atomicity and Durability during a sudden system crash or power outage?',
    followUpQuestions: [
      'What is Write-Ahead Logging (WAL) and why is writing to the log faster than writing to table pages?',
      'How does a database recover during the REDO and UNDO phases?'
    ],
    revisionNotes: [
      'A - Atomicity: All or nothing execution (rollback via undo log).',
      'C - Consistency: Database transitions from one valid state to another enforcing constraints/foreign keys.',
      'I - Isolation: Concurrent transactions do not interfere with each other (concurrency control).',
      'D - Durability: Committed transactions persist permanently even across power failures.',
      'WAL: Before modifying data pages on disk, changes are appended sequentially to a transaction log.'
    ],
    keyConcepts: [
      'Sequential disk I/O of WAL vs random I/O of dirty data pages',
      'Undo logs for rollback and MVCC',
      'Redo logs for durability and crash recovery',
      'Checkpoints to truncate WAL records'
    ],
    practicalExample: 'Bank transfer: Deduct $100 from Alice, add $100 to Bob. If server crashes after step 1, during boot recovery the engine inspects WAL, detects uncommitted transaction, and applies UNDO log to restore Alice\'s balance.',
    suggestedAnswerStructure: [
      { section: 'ACID Breakdown', guidance: 'Provide a concise definition and purpose for each letter.' },
      { section: 'Write-Ahead Logging Mechanics', guidance: 'Contrast sequential log append with random B-Tree page writes.' },
      { section: 'Crash Recovery Protocol', guidance: 'Walk through REDO phase (replay committed changes) and UNDO phase (rollback incomplete transactions).' }
    ],
    tags: ['DBMS', 'ACID', 'Transactions', 'WAL', 'Crash Recovery']
  },
  {
    id: 'dbms-b-tree-indexing',
    title: 'B-Tree & B+ Tree Indexing Internals',
    category: 'DBMS',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    shortDescription: 'Deep dive into clustered vs non-clustered indexes, leaf node linked lists, range queries, and page branching factors.',
    interviewQuestion: 'Why do relational databases use B+ Trees instead of Binary Search Trees or Hash Tables for disk-based indexing? Explain the physical structure of a B+ Tree.',
    followUpQuestions: [
      'What is the difference between a Clustered Index and a Non-Clustered (Secondary) Index?',
      'What is an Index Seek vs Index Scan, and what is a Covering Index?'
    ],
    revisionNotes: [
      'BST has poor disk locality and high depth O(log2 N), requiring dozens of random disk I/Os.',
      'B+ Tree has high fanout (branching factor 100-1000), keeping depth to 3-4 levels (only 3-4 disk page reads).',
      'In B+ Trees, internal nodes only store search keys/pointers; all data records/pointers reside in leaf nodes.',
      'Leaf nodes are linked in a doubly linked list, enabling fast range scans (e.g. BETWEEN 10 AND 50).'
    ],
    keyConcepts: [
      'Fanout and disk page block sizing (e.g. 16KB pages)',
      'B+ Tree leaf node linked list for range scans',
      'Clustered index defines physical disk layout of rows',
      'Covering index eliminates secondary index lookup to base table'
    ],
    practicalExample: 'Query: SELECT email FROM users WHERE age > 25. With B+ Tree index on age, engine seeks to first leaf >= 25 in 3 disk reads, then walks the leaf linked list sequentially.',
    suggestedAnswerStructure: [
      { section: 'Why B+ Trees over BST & Hash', guidance: 'Explain disk block I/O alignment and inability of Hash indexes to do range queries.' },
      { section: 'B vs B+ Tree Structural Difference', guidance: 'Emphasize data exclusively in leaves and linked leaf pointers.' },
      { section: 'Clustered vs Secondary Indexes', guidance: 'Explain row storage in primary key tree vs primary key pointers in secondary index.' }
    ],
    tags: ['B+ Tree', 'Indexing', 'Databases', 'Query Optimization']
  },
  {
    id: 'dbms-isolation-levels',
    title: 'Transaction Isolation Levels & Concurrency Anomalies',
    category: 'DBMS',
    difficulty: 'Advanced',
    estimatedMinutes: 11,
    shortDescription: 'Analyze Dirty Read, Non-Repeatable Read, Phantom Read, and how MVCC implements Snapshot Isolation.',
    interviewQuestion: 'Explain the four standard ANSI SQL Isolation Levels and the specific concurrency anomalies each level prevents. How does Multi-Version Concurrency Control (MVCC) eliminate read locks?',
    followUpQuestions: [
      'What is the difference between a Non-Repeatable Read and a Phantom Read?',
      'What is Write Skew anomaly in Snapshot Isolation?'
    ],
    revisionNotes: [
      'Read Uncommitted: vulnerable to Dirty Reads (reading uncommitted data).',
      'Read Committed: prevents Dirty Reads; vulnerable to Non-Repeatable Reads.',
      'Repeatable Read: prevents Non-Repeatable Reads; standard ANSI allows Phantom Reads, but modern engines (InnoDB MVCC) mitigate phantoms.',
      'Serializable: strictest level; prevents all anomalies including Phantoms and Write Skew using 2PL or SSI.',
      'MVCC: Writers do not block readers, readers do not block writers by creating versioned snapshots of rows.'
    ],
    keyConcepts: [
      'Anomalies: Dirty Read, Non-repeatable Read, Phantom Read',
      'Snapshot Isolation via transaction read views',
      'Undo log roll pointers for row version history',
      'Two-Phase Locking (2PL) vs Optimistic Concurrency'
    ],
    practicalExample: 'User A starts transaction at timestamp 10. User B updates and commits user name at timestamp 15. Under MVCC Repeatable Read, User A continues reading the snapshot created at timestamp 10.',
    suggestedAnswerStructure: [
      { section: 'Anomalies Breakdown', guidance: 'Define dirty read, non-repeatable read, and phantom read clearly.' },
      { section: '4 Isolation Levels Matrix', guidance: 'Map Read Uncommitted, Read Committed, Repeatable Read, Serializable.' },
      { section: 'MVCC Architecture', guidance: 'Explain transaction visibility rules, undo logs, and lock-free reads.' }
    ],
    tags: ['Isolation Levels', 'MVCC', 'Concurrency', 'Transactions']
  },
  {
    id: 'dbms-sql-joins',
    title: 'SQL Join Algorithms: Nested Loop, Hash Join, Merge Join',
    category: 'DBMS',
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    shortDescription: 'Learn how database query planners choose between Nested Loop, Hash, and Sort-Merge join execution strategies.',
    interviewQuestion: 'How does a relational database query optimizer physically execute a JOIN? Compare Nested Loop Join, Hash Join, and Sort-Merge Join in terms of prerequisites and performance.',
    followUpQuestions: [
      'When would the optimizer choose a Block Nested Loop join over a Hash Join?',
      'What happens when the hash table in a Hash Join exceeds available work memory (grace hash join)?'
    ],
    revisionNotes: [
      'Nested Loop: For each row in outer table, scan inner table. O(M * N) without index, O(M * log N) with inner index. Ideal for small outer tables.',
      'Hash Join: Build in-memory hash table on smaller relation; probe with larger relation. O(M + N) time. Requires equality condition (=).',
      'Sort-Merge Join: Sort both tables on join key (if not already indexed), then advance two pointers like merge sort. O(M log M + N log N) or O(M + N) if presorted.'
    ],
    keyConcepts: [
      'Index Nested Loop for selective queries',
      'Hash Join build phase vs probe phase',
      'Sort-Merge join optimal for ordered streams and range joins',
      'Query optimizer cost model based on table statistics'
    ],
    practicalExample: 'Joining orders (10M rows) with customers (10K rows) on customer_id: Optimizer builds hash table on customers in memory, then streams orders checking the hash table in O(N).',
    suggestedAnswerStructure: [
      { section: 'Three Physical Join Algorithms', guidance: 'Detail Nested Loop, Hash Join, and Sort-Merge Join.' },
      { section: 'Time & Space Complexity', guidance: 'State time complexity and memory footprint for each.' },
      { section: 'Optimizer Decision Criteria', guidance: 'Explain how indexes, table cardinality, and memory budgets dictate the choice.' }
    ],
    tags: ['SQL', 'Joins', 'Query Planner', 'Database Internals']
  },
  {
    id: 'dbms-normalization',
    title: 'Database Normalization: 1NF to BCNF',
    category: 'DBMS',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    shortDescription: 'Master relational schema design to eliminate update, insertion, and deletion anomalies while maintaining data integrity.',
    interviewQuestion: 'Explain Database Normalization from 1NF to BCNF. What specific anomalies does normalization solve, and when is intentional denormalization justified in production?',
    followUpQuestions: [
      'What is a partial functional dependency vs a transitive dependency?',
      'Why do high-throughput analytical systems (OLAP) prefer denormalized star schemas over 3NF?'
    ],
    revisionNotes: [
      '1NF: Atomic column values, unique rows, no repeating groups.',
      '2NF: 1NF + no partial dependencies (every non-key attribute fully dependent on whole primary key).',
      '3NF: 2NF + no transitive dependencies (non-key attributes dependent only on primary key, not other non-keys).',
      'BCNF: For every functional dependency X -> Y, X must be a super key.',
      'Denormalization avoids expensive joins in read-heavy applications at the cost of duplicate data and sync overhead.'
    ],
    keyConcepts: [
      'Insertion, Deletion, and Update anomalies',
      'Functional dependencies (X -> Y)',
      'Candidate keys and super keys',
      'OLTP (normalized) vs OLAP (denormalized star schema)'
    ],
    practicalExample: 'Storing department_name inside employee table creates update anomaly: changing department name requires updating 500 employee rows. 3NF splits into department table with foreign key.',
    suggestedAnswerStructure: [
      { section: 'Why Normalize?', guidance: 'Define data redundancy and update/delete anomalies.' },
      { section: 'Normal Forms Walkthrough', guidance: 'Define 1NF (atomic), 2NF (no partial), 3NF (no transitive), BCNF (superkey).' },
      { section: 'Pragmatic Denormalization', guidance: 'Discuss read performance vs write complexity in high-scale systems.' }
    ],
    tags: ['Normalization', 'Relational Design', '3NF', 'Schema Design']
  },

  // ==========================================
  // Operating Systems (7 topics)
  // ==========================================
  {
    id: 'os-process-vs-thread',
    title: 'Processes vs Threads & Context Switching Overhead',
    category: 'OS',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    shortDescription: 'Understand process address spaces, virtual memory isolation, thread stacks, and the physical cost of CPU context switches.',
    interviewQuestion: 'What is the precise architectural difference between a Process and a Thread? What happens at the CPU and hardware level during a process context switch vs a thread context switch?',
    followUpQuestions: [
      'Why is thread context switching faster than process context switching?',
      'What is the Translation Lookaside Buffer (TLB) and how does TLB flushing impact context switch latency?'
    ],
    revisionNotes: [
      'Process: Independent execution environment with its own isolated virtual address space (code, data, heap, file descriptors).',
      'Thread: Lightweight unit of execution within a process; shares code, heap, and open files, but has its own stack and registers.',
      'Process context switch must switch memory address spaces (changing CR3 register on x86), which invalidates the TLB.',
      'Thread context switch within the same process retains the virtual memory mappings, preserving hot TLB and CPU caches.'
    ],
    keyConcepts: [
      'Process Control Block (PCB) vs Thread Control Block (TCB)',
      'Isolated address spaces vs shared heap/code',
      'CPU register state save and restore',
      'TLB shootdown / cache invalidation penalty'
    ],
    practicalExample: 'Web server: Multi-process model (Apache prefork) isolates crashes but consumes high memory. Multi-threaded or event loop model (Node/Go/Nginx) handles 10k connections with lower memory footprint.',
    suggestedAnswerStructure: [
      { section: 'Memory Layout Comparison', guidance: 'Contrast process isolation (independent heap/pages) with shared thread memory.' },
      { section: 'Context Switch Steps', guidance: 'Walk through saving CPU registers, PCB/TCB updates, and program counter.' },
      { section: 'Hardware Cost (TLB & Cache)', guidance: 'Explain why flushing virtual memory page caches makes process switches expensive.' }
    ],
    tags: ['Operating Systems', 'Processes', 'Threads', 'Context Switch', 'TLB']
  },
  {
    id: 'os-concurrency-mutex-semaphore',
    title: 'Mutex vs Semaphore vs Spinlock & Race Conditions',
    category: 'OS',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    shortDescription: 'Prevent race conditions using mutexes, counting semaphores, spinlocks, and compare-and-swap (CAS) atomics.',
    interviewQuestion: 'Explain the difference between a Mutex, a Counting Semaphore, and a Spinlock. When should you use a spinlock instead of a mutex, and what is priority inversion?',
    followUpQuestions: [
      'What does "mutex ownership" mean and why does a semaphore not possess ownership?',
      'How does Priority Inheritance protocol resolve priority inversion?'
    ],
    revisionNotes: [
      'Mutex: Mutual exclusion lock with ownership (only the locking thread can unlock). Binary lock (locked/unlocked).',
      'Counting Semaphore: Signaling mechanism that controls access to N resource permits. Any thread can signal/release.',
      'Spinlock: Busy-waits (polling in a tight loop) without putting thread to sleep. Ideal for very short lock hold durations where sleep context switch overhead exceeds wait time.',
      'Priority Inversion: High priority thread is blocked waiting for a low priority thread holding a lock, while a medium thread starves both.'
    ],
    keyConcepts: [
      'Critical section protection',
      'Sleep-wait vs Busy-wait trade-off',
      'Binary vs Counting semaphore permits',
      'Priority Inheritance protocol'
    ],
    practicalExample: 'Connection Pool: Semaphore initialized to 10 permits. Each worker calls acquire() to get a database connection and release() upon query completion.',
    suggestedAnswerStructure: [
      { section: 'Primitives Overview', guidance: 'Define Mutex (locking), Semaphore (signaling/capacity), and Spinlock (busy-waiting).' },
      { section: 'Selection Trade-offs', guidance: 'Compare context switch latency (~microseconds) vs busy loop cycles.' },
      { section: 'Priority Inversion Problem', guidance: 'Illustrate High-Medium-Low priority thread deadlock and Priority Inheritance fix.' }
    ],
    tags: ['Concurrency', 'Mutex', 'Semaphore', 'Spinlock', 'Locks']
  },
  {
    id: 'os-deadlocks-handling',
    title: 'Deadlock: Coffman Conditions & Banker’s Algorithm',
    category: 'OS',
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    shortDescription: 'Master the four Coffman conditions for deadlock, detection algorithms, avoidance, and recovery strategies.',
    interviewQuestion: 'What are the four necessary Coffman conditions for a deadlock to occur? How can an operating system or application break each condition to prevent deadlocks?',
    followUpQuestions: [
      'How does strict lock ordering prevent circular wait in multi-threaded code?',
      'How does the Banker’s Algorithm verify safe state before granting resource requests?'
    ],
    revisionNotes: [
      'Mutual Exclusion: Resources cannot be shared.',
      'Hold and Wait: Thread holds at least one resource while waiting to acquire another.',
      'No Preemption: Resources cannot be forcibly taken from a thread.',
      'Circular Wait: Closed chain of threads where each waits for a resource held by the next.',
      'Breaking any ONE condition eliminates deadlock! Enforcing global lock acquisition order eliminates circular wait.'
    ],
    keyConcepts: [
      'Four Coffman conditions',
      'Global lock hierarchy ordering',
      'Resource Allocation Graph (RAG) cycle detection',
      'Banker’s algorithm safe state check'
    ],
    practicalExample: 'Transfer funds between Account A and Account B: Thread 1 locks A then B. Thread 2 locks B then A (deadlock!). Solution: Always acquire lock on the lower account ID first: lock(min(A.id, B.id)), then lock(max(A.id, B.id)).',
    suggestedAnswerStructure: [
      { section: 'Coffman Conditions', guidance: 'List and explain Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.' },
      { section: 'Practical Prevention', guidance: 'Demonstrate lock hierarchy order and timeout backoff (tryLock).' },
      { section: 'Banker’s Algorithm & Safe States', guidance: 'Explain simulated resource allocation against remaining maximum claims.' }
    ],
    tags: ['Deadlock', 'Coffman Conditions', 'Concurrency', 'Banker Algorithm']
  },
  {
    id: 'os-virtual-memory-paging',
    title: 'Virtual Memory, Paging, and Page Fault Handling',
    category: 'OS',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    shortDescription: 'Understand virtual address translation, multi-level page tables, TLB cache, and page fault interrupt handling.',
    interviewQuestion: 'How does Virtual Memory work? Walk through what happens step-by-step when a program accesses a memory address that triggers a Page Fault.',
    followUpQuestions: [
      'Why do modern 64-bit operating systems use Multi-Level Page Tables instead of a single flat table?',
      'What is Thrashing and what causes it?'
    ],
    revisionNotes: [
      'Virtual memory provides process memory isolation, protection, and allows processes to exceed physical RAM size.',
      'Virtual address is split into Page Number and Offset. MMU translates page number to frame number using Page Table and TLB.',
      'Page Fault: If the page table entry has present bit = 0, CPU triggers a hardware interrupt trap to OS kernel.',
      'Kernel allocates a physical RAM frame, reads page from disk swap/file, updates page table valid bit, and resumes instruction.'
    ],
    keyConcepts: [
      'MMU (Memory Management Unit) translation',
      'TLB hit vs miss',
      'Hardware interrupt trap sequence for page fault',
      'Page replacement algorithms (LRU, Clock)'
    ],
    practicalExample: 'Program accesses 4GB array. Initially pages are unmapped. As each 4KB page is accessed for the first time, a minor page fault maps a physical frame on demand.',
    suggestedAnswerStructure: [
      { section: 'Core Concepts & Benefits', guidance: 'Address isolation, protection bits, and overcommitting RAM.' },
      { section: 'Address Translation Flow', guidance: 'Virtual Address -> TLB Check -> Multi-level Page Table walk -> Physical Address.' },
      { section: 'Page Fault Step-by-Step Lifecycle', guidance: 'Hardware trap -> OS interrupt handler -> Disk read -> Page Table update -> Instruction re-execution.' }
    ],
    tags: ['Virtual Memory', 'Paging', 'Page Fault', 'OS Architecture']
  },

  // ==========================================
  // Computer Networks (7 topics)
  // ==========================================
  {
    id: 'net-tcp-handshake',
    title: 'TCP 3-Way Handshake & 4-Way Connection Teardown',
    category: 'NETWORKS',
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    shortDescription: 'Analyze SYN, SYN-ACK, ACK sequence numbers, TIME_WAIT state purpose, and connection resets.',
    interviewQuestion: 'Explain the TCP 3-Way Handshake and 4-Way Teardown processes. Why is a 3-way handshake necessary instead of 2-way, and why does the client stay in TIME_WAIT for 2*MSL?',
    followUpQuestions: [
      'What is a SYN Flood attack and how do SYN Cookies defend against it?',
      'Why does connection termination require 4 packets instead of 3?'
    ],
    revisionNotes: [
      'Handshake: Client sends SYN(seq=x) -> Server replies SYN(seq=y), ACK(x+1) -> Client sends ACK(y+1).',
      '3-way is required to reliably synchronize both sequence numbers and prevent delayed duplicate packets from causing phantom connections.',
      'Teardown is 4-way because TCP is full-duplex: each direction (Client->Server and Server->Client) must be closed independently with FIN and ACK.',
      'TIME_WAIT lasts 2 * Maximum Segment Lifetime (2*MSL) to ensure final ACK reaches server and old duplicate packets drain from network.'
    ],
    keyConcepts: [
      'Initial Sequence Number (ISN) negotiation',
      'Full-duplex independent FIN closing',
      'TIME_WAIT socket exhaustion risk',
      'SYN Cookies mitigating half-open queues'
    ],
    practicalExample: 'Web browser closes HTTP/1.1 connection: Browser sends FIN -> Server ACKs. Server finishes sending remaining data, sends its own FIN -> Browser sends final ACK and enters TIME_WAIT.',
    suggestedAnswerStructure: [
      { section: '3-Way Handshake Walkthrough', guidance: 'Detail SYN, SYN-ACK, ACK packet exchange and ISN alignment.' },
      { section: 'Why 3 Packets instead of 2', guidance: 'Explain delayed duplicate packets and two-way confirmation.' },
      { section: '4-Way Teardown & TIME_WAIT', guidance: 'Explain full-duplex closing and reason for 2MSL buffer.' }
    ],
    tags: ['TCP', 'Handshake', 'Networking', 'TIME_WAIT']
  },
  {
    id: 'net-tcp-vs-udp',
    title: 'TCP vs UDP: Reliability, Flow Control & Latency',
    category: 'NETWORKS',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    shortDescription: 'Compare connection-oriented byte streams with lightweight datagrams, congestion control, and modern protocols (QUIC).',
    interviewQuestion: 'Compare TCP and UDP in detail. What mechanisms provide TCP reliability, and why do latency-sensitive applications like gaming, voice, and HTTP/3 choose UDP?',
    followUpQuestions: [
      'How does TCP Flow Control (Sliding Window) differ from Congestion Control (AIMD / CUBIC)?',
      'What is Head-of-Line (HoL) blocking in TCP and how does HTTP/3 (QUIC) solve it?'
    ],
    revisionNotes: [
      'TCP: Connection-oriented, ordered, reliable delivery via ACKs, retransmissions, flow control, and congestion control.',
      'UDP: Connectionless, lightweight datagrams with minimal 8-byte header, no ordering guarantees, no ACKs, zero handshake latency.',
      'Flow Control protects the receiver buffer (advertised window); Congestion Control protects network routers from overload.',
      'Head-of-Line blocking: A single lost packet halts delivery of all subsequent packets in TCP stream; QUIC over UDP multiplexes streams independently.'
    ],
    keyConcepts: [
      'Reliable delivery vs minimal latency overhead',
      'Sliding window receiver buffer advertisement',
      'Congestion window (cwnd) slow start and AIMD',
      'Head-of-Line blocking in TCP vs QUIC'
    ],
    practicalExample: 'Video multiplayer game sends player coordinates 60 times/sec over UDP. If packet 34 is lost, packet 35 is already newer and more relevant; waiting for retransmission would cause lag.',
    suggestedAnswerStructure: [
      { section: 'Core Protocol Comparison', guidance: 'Header size, connection state, ordering, and reliability.' },
      { section: 'TCP Reliability Mechanisms', guidance: 'Explain ACKs, retransmission timers, flow control vs congestion control.' },
      { section: 'Application Selection Criteria', guidance: 'When to choose TCP (financial, file transfer) vs UDP/QUIC (gaming, streaming, HTTP/3).' }
    ],
    tags: ['TCP', 'UDP', 'Networking', 'QUIC', 'Congestion Control']
  },
  {
    id: 'net-dns-resolution',
    title: 'DNS Resolution Flow & Hierarchy Architecture',
    category: 'NETWORKS',
    difficulty: 'Beginner',
    estimatedMinutes: 7,
    shortDescription: 'Trace what happens from typing a URL in the browser to resolving the IP address across root, TLD, and authoritative servers.',
    interviewQuestion: 'What happens when a client resolves a domain name like "api.codequest.dev"? Walk through recursive vs iterative DNS queries, caching layers, and record types.',
    followUpQuestions: [
      'What is the difference between an A record, CNAME record, and ALIAS record?',
      'What is DNS TTL and how does it balance server load with update propagation speed?'
    ],
    revisionNotes: [
      'Query checks caches first: Browser cache -> OS resolver cache -> Hosts file -> Local router -> ISP Recursive Resolver.',
      'If recursive resolver misses: asks Root DNS server (.) -> receives TLD server (.dev) -> asks TLD server -> receives Authoritative DNS server for codequest.dev.',
      'Authoritative server returns final IP address (A / AAAA record) with Time-To-Live (TTL).',
      'Recursive query is client to ISP resolver; Iterative queries are resolver to Root/TLD/Authoritative.'
    ],
    keyConcepts: [
      'Recursive vs Iterative queries',
      'DNS hierarchy: Root -> TLD -> Authoritative',
      'Record types: A, AAAA, CNAME, MX, TXT',
      'TTL (Time to Live) caching impact'
    ],
    practicalExample: 'Switching cloud servers: If DNS TTL is set to 86400s (24 hours), traffic will take 24 hours to migrate. Lowering TTL to 300s before migration enables near-instant failover.',
    suggestedAnswerStructure: [
      { section: 'Local Cache Inspection', guidance: 'Describe browser, OS, and router DNS cache checks.' },
      { section: 'Iterative Hierarchical Walk', guidance: 'Trace ISP Resolver -> Root (.) -> TLD (.dev) -> Authoritative Nameserver.' },
      { section: 'DNS Record Types & TTL', guidance: 'Explain A vs CNAME and operational implications of TTL.' }
    ],
    tags: ['DNS', 'Networking', 'System Architecture', 'Internet']
  },
  {
    id: 'net-tls-handshake',
    title: 'HTTPS & TLS 1.3 Handshake Protocol',
    category: 'NETWORKS',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    shortDescription: 'Understand asymmetric key exchange (Diffie-Hellman), digital certificates, PKI, and symmetric session encryption.',
    interviewQuestion: 'How does HTTPS secure web traffic? Walk through the TLS 1.3 handshake, explaining how asymmetric encryption is used to negotiate a symmetric session key.',
    followUpQuestions: [
      'Why is symmetric encryption used for payload data instead of asymmetric encryption?',
      'How does the browser verify that a server’s SSL/TLS certificate is authentic?'
    ],
    revisionNotes: [
      'HTTPS = HTTP over TLS (Transport Layer Security) providing Encryption, Integrity, and Authentication.',
      'Asymmetric encryption (public/private key) is computationally expensive, so it is only used during handshake to securely agree on a shared symmetric key.',
      'Symmetric encryption (AES-GCM / ChaCha20) is hardware-accelerated and used for all actual payload data transfer.',
      'TLS 1.3 achieves 1-RTT connection: Client Hello sends supported ciphers and key shares upfront; Server Hello responds with chosen cipher and server key share.'
    ],
    keyConcepts: [
      'Public Key Infrastructure (PKI) and Certificate Authorities',
      'Elliptic Curve Diffie-Hellman Ephemeral (ECDHE)',
      '1-RTT in TLS 1.3 vs 2-RTT in TLS 1.2',
      'Forward Secrecy protecting past sessions from future private key compromise'
    ],
    practicalExample: 'Certificate verification: Server presents certificate signed by DigiCert. Browser validates signature using DigiCert\'s public key embedded in browser root store.',
    suggestedAnswerStructure: [
      { section: 'Security Goals of HTTPS', guidance: 'Confidentiality (encryption), Integrity (HMAC), Authenticity (certificates).' },
      { section: 'TLS 1.3 Handshake Sequence', guidance: 'Explain 1-RTT key exchange using ECDHE and ClientHello/ServerHello.' },
      { section: 'Certificate Chain of Trust', guidance: 'Explain how root and intermediate CAs validate server ownership.' }
    ],
    tags: ['HTTPS', 'TLS', 'Cryptography', 'Security', 'Web']
  },

  // ==========================================
  // System Design (7 topics)
  // ==========================================
  {
    id: 'sys-caching-strategies',
    title: 'Distributed Caching & Invalidation Patterns',
    category: 'SYSTEM_DESIGN',
    difficulty: 'Intermediate',
    estimatedMinutes: 11,
    shortDescription: 'Master cache-aside, write-through, write-behind, cache stampede mitigation, and eviction algorithms.',
    interviewQuestion: 'Explain the most common caching patterns (Cache-Aside, Write-Through, Write-Back). What is Cache Stampede (Thundering Herd) and how do you protect production systems against it?',
    followUpQuestions: [
      'What is the difference between Cache Penetration, Cache Breakdown, and Cache Avalanche?',
      'How does Redis eviction policy (volatile-lru vs allkeys-lru) work under memory pressure?'
    ],
    revisionNotes: [
      'Cache-Aside: Application looks in cache first; on miss, queries DB and populates cache. Standard read-heavy pattern.',
      'Write-Through: Data written to cache and DB synchronously. High consistency, higher write latency.',
      'Write-Back (Write-Behind): Data written to cache immediately, asynchronously flushed to DB in batches. Fast writes, risk of data loss on crash.',
      'Cache Stampede: Simultaneous cache miss by thousands of concurrent requests querying DB at once when a hot key expires. Solved by mutex locking or probabilistic early expiration (XFetch).'
    ],
    keyConcepts: [
      'Cache-Aside vs Write-Through vs Write-Back',
      'Stampede prevention: Distributed mutex / Singleflight',
      'Bloom filters to eliminate Cache Penetration',
      'Jitter on TTLs to avoid Cache Avalanche'
    ],
    practicalExample: 'Trending news article expires: 50,000 requests/sec hit DB simultaneously. With a distributed mutex on key miss, only 1 request fetches from DB while others wait, preventing DB crash.',
    suggestedAnswerStructure: [
      { section: 'Caching Patterns Comparison', guidance: 'Contrast Cache-Aside, Write-Through, and Write-Back with trade-offs.' },
      { section: 'Failure Modes (Avalanche, Penetration, Stampede)', guidance: 'Define each phenomenon with its specific architectural mitigation.' },
      { section: 'Implementation Strategy', guidance: 'Detail Redis cluster architecture and TTL jittering.' }
    ],
    tags: ['System Design', 'Caching', 'Redis', 'High Availability']
  },
  {
    id: 'sys-sharding-consistent-hashing',
    title: 'Database Sharding & Consistent Hashing',
    category: 'SYSTEM_DESIGN',
    difficulty: 'Advanced',
    estimatedMinutes: 12,
    shortDescription: 'Scale database writes horizontally using partition keys, hash rings, virtual nodes, and rebalancing strategies.',
    interviewQuestion: 'How does Database Sharding scale write-heavy systems? Why does simple modulo hashing (hash(key) % N) fail during node scaling, and how does Consistent Hashing with virtual nodes solve this?',
    followUpQuestions: [
      'What are the primary architectural challenges introduced by sharding (cross-shard joins, distributed transactions)?',
      'How do virtual nodes prevent hot spots in a consistent hash ring?'
    ],
    revisionNotes: [
      'Sharding divides data across multiple database instances horizontally based on a Shard Key.',
      'Modulo hashing: Adding or removing a server invalidates almost 100% of keys (hash(k) % N changes for nearly all k).',
      'Consistent Hashing: Map servers and keys onto a circular 360° integer ring (0 to 2^32-1). Key maps to first clockwise server.',
      'When a node joins or leaves, only k/N keys need relocation.',
      'Virtual nodes: Each physical server is assigned multiple positions on the ring, ensuring uniform data distribution.'
    ],
    keyConcepts: [
      'Horizontal partition vs Vertical partition',
      'Consistent Hash Ring and clockwise lookup',
      'Virtual nodes for statistical balance',
      'Cross-shard queries and fan-out penalties'
    ],
    practicalExample: 'Discord message storage: Sharded by channel_id. All messages in a channel reside on the same shard, allowing efficient range queries without cross-node joins.',
    suggestedAnswerStructure: [
      { section: 'Why Sharding is Required', guidance: 'Explain single-node write saturation and disk limits.' },
      { section: 'Flaw of Modulo Hashing', guidance: 'Demonstrate catastrophic cache/data migration upon scaling.' },
      { section: 'Consistent Hashing Mechanics', guidance: 'Diagram hash ring, key assignment, node add/remove, and virtual nodes.' }
    ],
    tags: ['System Design', 'Sharding', 'Consistent Hashing', 'Scalability']
  },
  {
    id: 'sys-rate-limiting-algorithms',
    title: 'Rate Limiting Algorithms: Token Bucket & Sliding Window',
    category: 'SYSTEM_DESIGN',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    shortDescription: 'Protect APIs from denial-of-service and abuse with Token Bucket, Leaky Bucket, and Sliding Window Counter.',
    interviewQuestion: 'Compare the standard rate-limiting algorithms: Token Bucket, Leaky Bucket, Fixed Window Counter, and Sliding Window Counter. How would you implement a distributed rate limiter with Redis?',
    followUpQuestions: [
      'How does Token Bucket handle bursts of traffic compared to Leaky Bucket?',
      'How do you avoid race conditions when checking and updating rate limit counters in Redis (Lua scripts)?'
    ],
    revisionNotes: [
      'Token Bucket: Tokens added at constant rate up to capacity. Request consumes token. Allows controlled burstiness.',
      'Leaky Bucket: Requests enter queue and are processed at constant outflow rate. Smooths out traffic spikes.',
      'Fixed Window: Counts requests in fixed time windows (e.g. 10:00-10:01). Vulnerable to 2x burst at boundary edges.',
      'Sliding Window Counter: Approximates sliding window using weighted sum of current and previous window counts, using minimal memory.',
      'Distributed Redis: Use atomic Lua script to run GET, check, and INCR in a single transaction.'
    ],
    keyConcepts: [
      'Traffic smoothing vs Burst handling',
      'Boundary spike flaw of Fixed Window',
      'Sliding Window Log vs Sliding Window Counter memory footprint',
      'Redis Lua scripts for atomic rate evaluation'
    ],
    practicalExample: 'API gateway limit: 100 req/min. With Sliding Window Counter, at minute 1:15 with 80 requests in previous min and 30 in current min: weight = 80 * 0.75 + 30 = 90 < 100 (allowed).',
    suggestedAnswerStructure: [
      { section: 'Algorithm Comparison', guidance: 'Compare Token Bucket, Leaky Bucket, and Sliding Window Counter.' },
      { section: 'Edge Case Vulnerabilities', guidance: 'Demonstrate the 2x burst window boundary problem.' },
      { section: 'Distributed Architecture', guidance: 'Present Redis-based implementation with Lua script for atomic state updates.' }
    ],
    tags: ['Rate Limiting', 'Redis', 'Algorithms', 'API Design']
  },
  {
    id: 'sys-message-queues-kafka',
    title: 'Message Queues & Event-Driven Decoupling (Kafka/RabbitMQ)',
    category: 'SYSTEM_DESIGN',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    shortDescription: 'Decouple microservices and smooth traffic spikes with asynchronous messaging, pub/sub, and consumer groups.',
    interviewQuestion: 'What architectural benefits do Message Queues provide in distributed systems? Compare a traditional queue like RabbitMQ with an append-only distributed log like Apache Kafka.',
    followUpQuestions: [
      'What are the three delivery guarantees (At-least-once, At-most-once, Exactly-once) and how is idempotency achieved?',
      'How do Kafka consumer groups achieve horizontal scaling and partition assignment?'
    ],
    revisionNotes: [
      'Benefits: Asynchronous processing, service decoupling, peak load smoothing (backpressure buffer), fault tolerance.',
      'RabbitMQ: Smart broker, dumb consumer. Messages deleted upon consumer ACK. Complex routing via exchanges.',
      'Kafka: Dumb broker, smart consumer. Partitioned append-only commit log on disk. Messages retained for retention period; consumers manage offsets.',
      'Idempotency: Necessary for at-least-once delivery; achieved via unique transaction/message IDs and database upsert.'
    ],
    keyConcepts: [
      'Temporal decoupling and backpressure buffer',
      'Commit log architecture vs message broker',
      'Consumer offset tracking',
      'Idempotent consumer design pattern'
    ],
    practicalExample: 'E-commerce checkout: Placing an order writes to orders DB and produces "OrderPlaced" event to Kafka. Payment, Inventory, and Notification services consume independently at their own pace without blocking user checkout.',
    suggestedAnswerStructure: [
      { section: 'Why Asynchronous Messaging', guidance: 'Explain latency decoupling and protection against cascading service failure.' },
      { section: 'Kafka Log vs RabbitMQ Queue', guidance: 'Contrast retention, replay capability, and scaling model.' },
      { section: 'Delivery Guarantees & Idempotency', guidance: 'Explain why at-least-once + idempotent handler is the industry standard.' }
    ],
    tags: ['System Design', 'Message Queues', 'Kafka', 'Event Driven']
  },

  // ==========================================
  // HR & Behavioral (4 topics)
  // ==========================================
  {
    id: 'hr-tell-me-about-yourself',
    title: 'Framework: "Tell Me About Yourself" & Elevator Pitch',
    category: 'BEHAVIORAL',
    difficulty: 'Beginner',
    estimatedMinutes: 6,
    shortDescription: 'Structure your 90-second developer introduction using Present, Past, Future, and unique value proposition.',
    interviewQuestion: 'Walk me through how you answer "Tell Me About Yourself" for a Software Engineering Internship or New Grad interview.',
    followUpQuestions: [
      'How do you pivot your answer if you are transitioning from a non-CS background or non-traditional path?',
      'How do you keep your answer under 90 seconds while highlighting your strongest technical achievements?'
    ],
    revisionNotes: [
      'Do not recite your resume line by line.',
      'Formula: Present (who you are & current focus) -> Past (key technical project/internship impact) -> Future (why this team and role).',
      'Highlight concrete technical depth: languages, frameworks, architectural trade-offs, and numbers.',
      'Close with enthusiastic hook aligned with the company\'s engineering mission.'
    ],
    keyConcepts: [
      'Present-Past-Future narrative arc',
      'Hook: high-impact project milestone',
      'Elimination of personal biographical filler',
      'Company alignment bridge'
    ],
    practicalExample: '"Currently a CS senior focused on distributed systems. Recently built CodeQuest, an open-source platform handling 50k requests with Redis. Looking to contribute to your core backend infrastructure team."',
    suggestedAnswerStructure: [
      { section: 'Present (30s)', guidance: 'Education, current technical focus, and primary technologies.' },
      { section: 'Past (40s)', guidance: 'Key technical project or internship accomplishment with measurable outcome.' },
      { section: 'Future (20s)', guidance: 'Why this specific company and role excites you.' }
    ],
    tags: ['Behavioral', 'Introduction', 'Interview Skills', 'Soft Skills']
  },
  {
    id: 'hr-star-conflict-resolution',
    title: 'STAR Method: Resolving Technical Disagreements',
    category: 'BEHAVIORAL',
    difficulty: 'Intermediate',
    estimatedMinutes: 8,
    shortDescription: 'Demonstrate mature cross-functional communication, data-driven decisions, and disagree-and-commit attitude.',
    interviewQuestion: 'Tell me about a time you strongly disagreed with a teammate, senior engineer, or product manager on a technical design decision. How did you handle it?',
    followUpQuestions: [
      'What would you do if after presenting your data, the team still chose the alternative path?',
      'How do you prevent technical disagreements from turning into personal conflicts?'
    ],
    revisionNotes: [
      'Use STAR: Situation, Task, Action, Result.',
      'Frame the disagreement around user/system goals (latency, maintainability, deadline), never ego.',
      'Action must show collaborative inquiry: benchmark data, create quick spike/prototype, evaluate trade-offs.',
      'Demonstrate "Disagree and Commit": once decision is finalized, execute with 100% commitment.'
    ],
    keyConcepts: [
      'STAR framework precision',
      'Separating technical disagreement from emotional friction',
      'Data-driven prototyping over debate',
      'Disagree and Commit principle'
    ],
    practicalExample: 'Disagreed on MongoDB vs PostgreSQL for transactions: Built a quick prototype benchmark showing relational joins reduced latency by 40% and prevented race conditions.',
    suggestedAnswerStructure: [
      { section: 'Situation & Task', guidance: 'Describe project context and specific architectural clash without blaming.' },
      { section: 'Action Taken', guidance: 'Show how you gathered objective metrics, ran spikes, and listened to counter-arguments.' },
      { section: 'Result & Reflection', guidance: 'State the technical outcome and relationship outcome with your teammate.' }
    ],
    tags: ['Behavioral', 'STAR', 'Teamwork', 'Communication']
  },
  {
    id: 'hr-learning-from-failure',
    title: 'STAR Method: Overcoming a Technical Mistake / Outage',
    category: 'BEHAVIORAL',
    difficulty: 'Intermediate',
    estimatedMinutes: 8,
    shortDescription: 'Show extreme ownership, blameless post-mortem analysis, and systemic engineering safeguards.',
    interviewQuestion: 'Describe a significant mistake or bug you introduced into a project or production environment. What happened, and what permanent safeguards did you establish?',
    followUpQuestions: [
      'How did you communicate the issue to stakeholders while the problem was active?',
      'What is a blameless post-mortem and why is it essential to engineering culture?'
    ],
    revisionNotes: [
      'Demonstrate extreme ownership: do not blame tools, obscure requirements, or teammates.',
      'Structure: What happened -> How you diagnosed it -> Immediate mitigation -> Long-term systemic prevention.',
      'Emphasize root-cause analysis (e.g. 5 Whys): lack of integration test, missing schema constraint, lack of canary deployment.',
      'End with lasting positive process improvement.'
    ],
    keyConcepts: [
      'Extreme ownership and accountability',
      'Blameless root-cause analysis',
      'Automated guardrails over manual vigilance',
      'Post-incident retrospectives'
    ],
    practicalExample: 'Forgot to add database index before running migration on 500k rows, locking table for 4 minutes. Added automated linter in CI to detect missing indexes on foreign keys and run zero-downtime migrations.',
    suggestedAnswerStructure: [
      { section: 'Situation & The Failure', guidance: 'Explain the incident clearly with honest accountability.' },
      { section: 'Immediate Response', guidance: 'Show calmness under pressure, communication, and rollback/hotfix.' },
      { section: 'Systemic Safeguards Created', guidance: 'Highlight automated tests, linters, or monitoring alerts added.' }
    ],
    tags: ['Behavioral', 'Failure', 'Post Mortem', 'Accountability']
  },

  // ==========================================
  // Project Defense (4 topics)
  // ==========================================
  {
    id: 'proj-architecture-tradeoffs',
    title: 'Project Defense: System Architecture & Core Trade-offs',
    category: 'PROJECT_DEFENSE',
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    shortDescription: 'Articulate why you chose your tech stack, database, and system boundaries over viable alternatives.',
    interviewQuestion: 'Pick the most significant technical project on your resume. Explain its high-level architecture and justify two critical architectural trade-offs you made.',
    followUpQuestions: [
      'If you had 100x the current user load tomorrow, where would the system fail first?',
      'If you were starting this project from scratch today, what would you do differently?'
    ],
    revisionNotes: [
      'Start with a 60-second system summary: What problem it solves, core users, and key metric.',
      'State tech stack with intent (e.g. why PostgreSQL over MongoDB, why Go over Python).',
      'A trade-off means giving up something real (e.g. consistency vs latency, simplicity vs scalability).',
      'Identify the single bottleneck honestly (e.g. single database instance, un-indexed query, memory limits).'
    ],
    keyConcepts: [
      'Component diagram mental model',
      'Intentional technology selection criteria',
      'Bottleneck identification under 100x load',
      'Honest technical self-critique'
    ],
    practicalExample: 'Chose server-side rendering over SPA to optimize SEO and initial load time on low-bandwidth mobile networks, accepting higher server memory usage and cache invalidation complexity.',
    suggestedAnswerStructure: [
      { section: 'System Elevator Pitch', guidance: 'Problem, user persona, scale, and high-level data flow.' },
      { section: 'Trade-off 1 (e.g. Database)', guidance: 'Why chosen technology won over alternative, acknowledging downside.' },
      { section: 'Trade-off 2 (e.g. Sync vs Async)', guidance: 'Explain how latency vs reliability guided your decision.' },
      { section: 'Scale Bottlenecks', guidance: 'Explain what breaks first under 100x traffic and how you would address it.' }
    ],
    tags: ['Project Defense', 'Architecture', 'Trade-offs', 'Resume']
  },
  {
    id: 'proj-performance-bottlenecks',
    title: 'Project Defense: Profiling & Performance Optimization',
    category: 'PROJECT_DEFENSE',
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    shortDescription: 'Demonstrate measurement-driven performance debugging: profiling CPU, memory leaks, and query latency.',
    interviewQuestion: 'Describe a specific performance bottleneck or latency issue you identified in your project and how you profiled and resolved it.',
    followUpQuestions: [
      'What profiling tools (Chrome DevTools, pprof, EXPLAIN ANALYZE) did you use to locate the root cause?',
      'How did you measure the before and after metrics objectively?'
    ],
    revisionNotes: [
      'Never guess performance problems: always measure with profilers and metrics.',
      'Show metric-based before and after (e.g., "p99 latency dropped from 1200ms to 85ms").',
      'Highlight common real-world bottlenecks: N+1 query problem, unindexed foreign key, large JSON payload, unnecessary client re-renders.',
      'Explain preventative benchmark tests added to CI.'
    ],
    keyConcepts: [
      'Measurement before optimization philosophy',
      'Profiling tools and flamegraphs',
      'Database query optimization with EXPLAIN ANALYZE',
      'Before vs after quantifiable benchmarks'
    ],
    practicalExample: 'User dashboard loaded in 2.4s due to N+1 queries fetching user orders. Ran EXPLAIN ANALYZE, combined queries with JOIN + added compound index, reducing query execution to 65ms.',
    suggestedAnswerStructure: [
      { section: 'The Symptom & Impact', guidance: 'Specify the slow endpoint or rendering lag with initial baseline number.' },
      { section: 'Investigation & Profiling', guidance: 'Name the specific tool used and how you traced the exact hotspot.' },
      { section: 'The Fix & Measured Results', guidance: 'Explain the code change and report final latency/throughput improvement.' }
    ],
    tags: ['Performance', 'Profiling', 'Optimization', 'Project Defense']
  },
  // Additional Topics to expand syllabus to 52 topics
  {
    id: 'dsa-hash-table-collisions',
    title: 'Hash Tables: Collision Resolution & Load Factor',
    category: 'DSA',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    shortDescription: 'Understand chaining with linked lists/red-black trees vs open addressing (linear/quadratic probing), resizing, and amortized O(1).',
    interviewQuestion: 'How does a Hash Table achieve O(1) average lookup? What happens during hash collisions, and how does Java HashMap transition from linked list to red-black tree (TREEIFY_THRESHOLD)?',
    followUpQuestions: [
      'What is the load factor and why is 0.75 commonly chosen as the default rehash threshold?',
      'Why is open addressing sensitive to clustering and deletion (tombstones)?'
    ],
    revisionNotes: [
      'Hash function maps key to bucket index: index = hash(key) & (n - 1) for power-of-two table sizes.',
      'Separate chaining stores collisions in linked list; degrades to O(K) if many keys collide.',
      'Java 8+ converts bucket linked list to balanced red-black tree when chain length >= 8 and table capacity >= 64, capping worst-case to O(log N).',
      'Resizing doubles bucket array and rehashes entries when size > capacity * load_factor.'
    ],
    keyConcepts: [
      'Uniform hash distribution requirement',
      'Separate chaining vs Open addressing',
      'Load factor threshold and table doubling cost',
      'Treeification threshold (8) and un-treeification (6)'
    ],
    practicalExample: 'HashMap with capacity 16 and load factor 0.75 triggers resize at 12 entries. Array doubles to 32, redistributing keys across new buckets in O(N).',
    suggestedAnswerStructure: [
      { section: 'Hash Function & Bucket Indexing', guidance: 'Explain hash code generation, bitwise masking, and dispersion.' },
      { section: 'Collision Handling Techniques', guidance: 'Compare separate chaining vs open addressing (linear probing).' },
      { section: 'Treeification Optimization', guidance: 'Explain protection against hash collision DoS attacks.' }
    ],
    tags: ['Hash Table', 'Data Structures', 'HashMap', 'Complexity']
  },
  {
    id: 'dsa-binary-search-tree-validation',
    title: 'Binary Search Tree Validation & Lowest Common Ancestor',
    category: 'DSA',
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    shortDescription: 'Validate BST invariants using range bounds (-inf, +inf) and find LCA in O(H) time without parent pointers.',
    interviewQuestion: 'How do you validate whether a binary tree is a valid Binary Search Tree (BST)? Why is comparing only root with immediate left/right children insufficient, and how do you find the Lowest Common Ancestor (LCA) in a BST?',
    followUpQuestions: [
      'How does validating BST using in-order traversal compare with range propagation?',
      'How do you find LCA in a generic binary tree (non-BST)?'
    ],
    revisionNotes: [
      'BST Invariant: ALL nodes in left subtree must be < current node, and ALL nodes in right subtree must be > current node.',
      'Local check fails because a right-subtree node could be smaller than a grandparent.',
      'Correct approach: Recursively pass valid range (minBound, maxBound), updating bounds as you traverse left or right.',
      'LCA in BST: If both p and q are smaller than root, traverse left; if both larger, traverse right; otherwise root is split point (LCA).'
    ],
    keyConcepts: [
      'Range propagation (low, high) across recursion',
      'Strictly increasing in-order property',
      'LCA split condition in BST: min(p,q) <= root <= max(p,q)',
      'O(H) time and O(H) call stack memory'
    ],
    practicalExample: 'Tree with root 10, right child 15, and right child\'s left child 6. Local checks pass, but 6 < 10 violates BST invariant. Range check catches 6 is not in (10, 15).',
    suggestedAnswerStructure: [
      { section: 'Common Misconception', guidance: 'Demonstrate why local child comparison fails.' },
      { section: 'Range-Bound Validation Algorithm', guidance: 'Show boolean isValid(node, min, max) logic.' },
      { section: 'LCA in BST Walkthrough', guidance: 'Explain single-path descent in O(H) time.' }
    ],
    tags: ['BST', 'Trees', 'Recursion', 'LCA']
  },
  {
    id: 'oops-interfaces-abstract-classes',
    title: 'Abstract Classes vs Interfaces & Default Methods',
    category: 'OOPS',
    difficulty: 'Beginner',
    estimatedMinutes: 7,
    shortDescription: 'Navigate "is-a" vs "can-do" relationships, multiple inheritance of type, and interface default implementations.',
    interviewQuestion: 'When should you use an Abstract Class versus an Interface in modern software design? How do interface default methods impact this decision?',
    followUpQuestions: [
      'How does multiple inheritance of interfaces avoid the C++ Diamond Problem?',
      'Can an interface declare state or instance fields?'
    ],
    revisionNotes: [
      'Interface defines a contract ("can-do" capability) with no state. A class can implement multiple interfaces.',
      'Abstract Class defines a base identity ("is-a" relationship) and can maintain mutable state, constructors, and protected methods.',
      'Java 8+ default methods allow adding new methods to interfaces without breaking existing implementations.',
      'Choose Interface for decoupled API contracts (e.g., Serializable, Comparable). Choose Abstract class for shared code in a tight hierarchy.'
    ],
    keyConcepts: [
      'Contract vs Hierarchy identity',
      'Single inheritance of state vs Multiple inheritance of type',
      'Interface default methods for backward compatibility',
      'Composition over inheritance principle'
    ],
    practicalExample: 'DatabaseConnection is an abstract class managing connection pool state. AutoCloseable and MetricsTrackable are interfaces implemented by the connection.',
    suggestedAnswerStructure: [
      { section: 'Core Conceptual Difference', guidance: 'State identity ("is-a") vs behavioral contract ("can-do").' },
      { section: 'Language Feature Breakdown', guidance: 'Constructors, instance variables, access modifiers, and default methods.' },
      { section: 'Design Selection Rule of Thumb', guidance: 'Recommend interfaces by default, abstract classes for internal framework templates.' }
    ],
    tags: ['OOPS', 'Interfaces', 'Abstract Classes', 'Design Patterns']
  },
  {
    id: 'oops-singleton-threadsafe',
    title: 'Singleton Pattern & Double-Checked Locking',
    category: 'OOPS',
    difficulty: 'Intermediate',
    estimatedMinutes: 8,
    shortDescription: 'Implement thread-safe lazy singletons using Double-Checked Locking, volatile memory fences, and Bill Pugh holder idiom.',
    interviewQuestion: 'How do you implement a thread-safe Lazy Singleton in Java or C++? Explain why Double-Checked Locking requires the "volatile" keyword to prevent instruction reordering.',
    followUpQuestions: [
      'What is the Bill Pugh Singleton Design (static inner class)?',
      'How can reflection or serialization break a singleton and how do enum singletons prevent it?'
    ],
    revisionNotes: [
      'Lazy initialization delays instance creation until first call, saving startup memory.',
      'Naive synchronization on the getInstance() method incurs 99% unnecessary lock overhead on subsequent reads.',
      'Double-Checked Locking checks instance == null before acquiring lock, then checks again inside synchronized block.',
      'volatile keyword establishes a happens-before memory barrier, preventing CPU from reordering constructor execution after pointer assignment.'
    ],
    keyConcepts: [
      'Lazy vs Eager initialization trade-offs',
      'Double-Checked Locking optimization',
      'Instruction reordering hazards without volatile',
      'Bill Pugh static nested class holder idiom'
    ],
    practicalExample: 'Without volatile: CPU can allocate memory, assign pointer to variable, then run constructor. Another thread sees non-null variable and uses half-initialized object.',
    suggestedAnswerStructure: [
      { section: 'Why Lazy Singleton Needs Synchronization', guidance: 'Show how two threads enter if (instance == null) simultaneously.' },
      { section: 'Double-Checked Locking Architecture', guidance: 'Write the code structure with outer check, synchronized block, and inner check.' },
      { section: 'The Role of Volatile', guidance: 'Explain memory barrier preventing partially initialized object visibility.' }
    ],
    tags: ['Design Patterns', 'Singleton', 'Concurrency', 'Thread Safety']
  },
  {
    id: 'dbms-deadlocks-detection',
    title: 'Database Deadlocks & Lock Wait Timeouts',
    category: 'DBMS',
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    shortDescription: 'Explore row-level locks, gap locks, Wait-For graphs, deadlock victim selection, and application retry loops.',
    interviewQuestion: 'How do relational databases detect and resolve deadlocks between concurrent transactions? How does InnoDB choose a "victim" transaction to rollback, and how should application code handle it?',
    followUpQuestions: [
      'What are Next-Key Locks and Gap Locks in MySQL InnoDB, and why do they cause unexpected deadlocks?',
      'Why is exponential backoff with jitter critical when retrying deadlocked transactions?'
    ],
    revisionNotes: [
      'Deadlock occurs when Transaction 1 holds Lock A and waits for Lock B, while Transaction 2 holds Lock B and waits for Lock A.',
      'InnoDB maintains a background Wait-For Graph (directed graph of waiting transactions) and checks for cycles.',
      'Victim selection: Engine rolls back the transaction that did the least amount of write work (smallest undo log weight).',
      'Application should catch deadlock exceptions (error code 1213) and retry with exponential backoff and randomized jitter.'
    ],
    keyConcepts: [
      'Wait-For Graph cycle detection',
      'Lock wait timeout vs instant deadlock detection',
      'Victim selection heuristics (undo log size)',
      'Idempotent transaction retry with jitter'
    ],
    practicalExample: 'Batch updates updating users in arbitrary order: Thread 1 updates ID 5 then ID 8. Thread 2 updates ID 8 then ID 5. Deadlock! Fix: Sort IDs ascending before locking.',
    suggestedAnswerStructure: [
      { section: 'Mechanism of Database Deadlock', guidance: 'Define mutual dependency between row locks.' },
      { section: 'Detection & Victim Selection', guidance: 'Explain wait-for graph cycle detection and rollback criteria.' },
      { section: 'Application Best Practices', guidance: 'Order lock operations, shorten transactions, and implement retry policies.' }
    ],
    tags: ['DBMS', 'Deadlocks', 'Locking', 'InnoDB']
  },
  {
    id: 'dbms-replication-lag',
    title: 'Database Replication: Leader-Follower & Replication Lag',
    category: 'DBMS',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    shortDescription: 'Master synchronous vs asynchronous replication, read scaling, failover, and mitigating read-after-write inconsistency.',
    interviewQuestion: 'Explain Single-Leader (Primary-Replica) database replication. What causes Replication Lag, and how do you ensure Read-After-Write consistency for users updating their profiles?',
    followUpQuestions: [
      'What is the difference between Synchronous and Asynchronous replication trade-offs?',
      'How does Split-Brain occur during automatic leader failover and how does consensus (Raft) prevent it?'
    ],
    revisionNotes: [
      'Primary handles all writes, logs them to binary log, and streams to replicas. Replicas serve read queries.',
      'Asynchronous replication is fast for writes but introduces replication lag (replicas are milliseconds/seconds behind).',
      'Read-After-Write inconsistency: User updates name, refreshes page, replica read serves stale old name.',
      'Solutions: Read own profile from primary for 5 seconds after write; check binlog replication timestamp; or track transaction LSN/version in cookie.'
    ],
    keyConcepts: [
      'Primary-Replica topology',
      'Binary log shipping and relay log application',
      'Read-After-Write (read-your-own-writes) consistency',
      'Split-Brain and majority quorum requirements'
    ],
    practicalExample: 'User posts photo: App writes to Leader. Immediate redirect to user feed routes read request to Leader for the author, while other users read from Read Replicas.',
    suggestedAnswerStructure: [
      { section: 'Replication Architecture', guidance: 'Diagram Primary write pipeline and Replica read scaling.' },
      { section: 'Replication Lag Concurrency Glitches', guidance: 'Describe stale reads and monotonic read violations.' },
      { section: 'Techniques for Read-After-Write Consistency', guidance: 'Detail routing heuristics (read primary for user\'s own updates).' }
    ],
    tags: ['Replication', 'Databases', 'High Availability', 'Consistency']
  },
  {
    id: 'os-cpu-scheduling',
    title: 'CPU Scheduling: Round Robin vs Preemptive Priority',
    category: 'OS',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    shortDescription: 'Compare FCFS, Shortest Job First, Round Robin time slices, priority scheduling, and Multi-Level Feedback Queues.',
    interviewQuestion: 'Compare Round Robin and Priority CPU Scheduling algorithms. How does the choice of time quantum in Round Robin affect CPU throughput and latency, and how do Multi-Level Feedback Queues (MLFQ) balance I/O-bound and CPU-bound tasks?',
    followUpQuestions: [
      'What happens if the Round Robin time slice is too small or too large?',
      'How does aging prevent process starvation in priority queues?'
    ],
    revisionNotes: [
      'Time Quantum in Round Robin: Too small -> excessive context switch overhead degrades throughput; Too large -> degenerates into FCFS with poor responsiveness.',
      'Typical quantum: 10ms to 100ms (context switch is < 10 microseconds, ~1% overhead).',
      'Multi-Level Feedback Queue (MLFQ): High-priority queues have small time slices (quick response for interactive I/O tasks); low-priority queues have large time slices for compute-heavy batch tasks.',
      'Aging periodically increments priority of waiting tasks to eliminate starvation.'
    ],
    keyConcepts: [
      'Preemptive vs Non-preemptive scheduling',
      'Time quantum tuning trade-offs',
      'MLFQ dynamic priority demotion and promotion',
      'Turnaround time vs Response time metrics'
    ],
    practicalExample: 'Text editor vs Video encoding: Text editor blocks on keystrokes, stays in top interactive MLFQ queue. Video encoder burns entire quantum and gets demoted to lower queue with large time slice.',
    suggestedAnswerStructure: [
      { section: 'Scheduling Goals', guidance: 'CPU utilization, throughput, turnaround time, waiting time, and response time.' },
      { section: 'Round Robin Quantum Tuning', guidance: 'Analyze extreme limits: 1 microsecond vs 1 hour.' },
      { section: 'MLFQ Rules & Starvation Fix', guidance: 'Outline priority levels and aging mechanisms.' }
    ],
    tags: ['OS', 'CPU Scheduling', 'Round Robin', 'MLFQ']
  },
  {
    id: 'net-osi-vs-tcpip',
    title: 'OSI 7-Layer vs TCP/IP 4-Layer Network Architecture',
    category: 'NETWORKS',
    difficulty: 'Beginner',
    estimatedMinutes: 7,
    shortDescription: 'Map physical bits to application protocols, encapsulation/decapsulation headers, and router vs switch forwarding.',
    interviewQuestion: 'Map the 7 layers of the OSI Model to the 4 layers of the TCP/IP suite. Explain how packet encapsulation and decapsulation happen as data travels from an HTTP client to a server.',
    followUpQuestions: [
      'At which layer does a Switch operate vs a Router vs a Gateway?',
      'What is the difference between an IP address (Layer 3) and a MAC address (Layer 2)?'
    ],
    revisionNotes: [
      'OSI: Physical, Data Link, Network, Transport, Session, Presentation, Application.',
      'TCP/IP: Network Access (L1+L2), Internet (L3), Transport (L4), Application (L5+L6+L7).',
      'Encapsulation: Application Data -> +TCP Header (Segment) -> +IP Header (Packet) -> +Ethernet Header/Trailer (Frame) -> Physical Bits.',
      'Layer 2 switches forward by MAC address within local broadcast domain; Layer 3 routers forward by IP across subnets.'
    ],
    keyConcepts: [
      '7-layer vs 4-layer alignment',
      'Header encapsulation sequence',
      'MAC address local hop-to-hop vs IP global end-to-end',
      'Layer 2 frame vs Layer 3 packet vs Layer 4 segment'
    ],
    practicalExample: 'Sending an HTTP GET: Transport layer attaches port 443; Network layer attaches destination IP 93.184.216.34; Data Link attaches default gateway router MAC address.',
    suggestedAnswerStructure: [
      { section: 'Layer Mapping Matrix', guidance: 'Align Application, Presentation, Session with TCP/IP Application layer.' },
      { section: 'Encapsulation Pipeline', guidance: 'Walk down stack adding TCP ports, IP addresses, and MAC frames.' },
      { section: 'Switch vs Router Responsibility', guidance: 'Clarify Layer 2 MAC forwarding vs Layer 3 routing tables.' }
    ],
    tags: ['OSI Model', 'TCP/IP', 'Networking', 'Encapsulation']
  },
  {
    id: 'net-rest-vs-websockets-grpc',
    title: 'Communication Protocols: REST vs WebSockets vs gRPC',
    category: 'NETWORKS',
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    shortDescription: 'Compare stateless request-response over HTTP/1.1 with full-duplex bi-directional WebSockets and binary Protobuf gRPC.',
    interviewQuestion: 'Compare REST APIs, WebSockets, and gRPC. How do their underlying network transports differ, and what criteria determine which protocol to choose for a distributed system?',
    followUpQuestions: [
      'Why is gRPC over HTTP/2 significantly more bandwidth-efficient than JSON REST over HTTP/1.1?',
      'How does the WebSocket HTTP upgrade handshake work?'
    ],
    revisionNotes: [
      'REST: Stateless request/response over HTTP/1.1 or HTTP/2, text-based JSON, human readable, ubiquitous browser support.',
      'WebSockets: Starts with HTTP Upgrade header (101 Switching Protocols), opens persistent bi-directional full-duplex TCP socket with tiny 2-byte framing overhead.',
      'gRPC: Runs on HTTP/2 multiplexed streams, uses Protocol Buffers binary serialization, supports streaming and strongly typed code generation.',
      'Use REST for public client APIs; WebSockets for real-time chat/collaborative tools; gRPC for internal low-latency microservice RPCs.'
    ],
    keyConcepts: [
      'HTTP Upgrade handshake for WebSockets',
      'Protocol Buffers binary encoding vs JSON stringification',
      'HTTP/2 multiplexing in gRPC',
      'Full duplex bi-directional streams'
    ],
    practicalExample: 'Figma multi-player editing: Cursor positions sent 30 times/sec over WebSockets (2-byte header). Doing this with HTTP POST would add 500+ bytes of headers and latency per tick.',
    suggestedAnswerStructure: [
      { section: 'Core Protocol Comparison', guidance: 'Transport protocol, payload format, and communication pattern.' },
      { section: 'WebSocket Handshake & Persistence', guidance: 'Explain HTTP 101 Switching Protocols and raw TCP frame streaming.' },
      { section: 'Engineering Selection Framework', guidance: 'Public web API (REST) vs Real-time duplex (WebSockets) vs Microservices (gRPC).' }
    ],
    tags: ['REST', 'WebSockets', 'gRPC', 'APIs', 'HTTP']
  },
  {
    id: 'sys-cap-theorem-pacelc',
    title: 'CAP Theorem & PACELC in Distributed Data Stores',
    category: 'SYSTEM_DESIGN',
    difficulty: 'Intermediate',
    estimatedMinutes: 10,
    shortDescription: 'Analyze Consistency vs Availability under network partitions, and Latency vs Consistency trade-offs in normal operation.',
    interviewQuestion: 'What does the CAP Theorem state? Why is "CA" impossible in a real-world distributed system, and how does the PACELC theorem expand on CAP for normal operating conditions?',
    followUpQuestions: [
      'What is the difference between Strong Consistency (Linearizability) and Eventual Consistency?',
      'Give examples of CP vs AP databases and how they behave when network partition strikes.'
    ],
    revisionNotes: [
      'CAP: In a distributed system with Network Partitions (P), you MUST choose either Consistency (C) or Availability (A).',
      'Network partitions are physical reality (cables cut, switch failure, GC pause). Therefore, you cannot choose CA; you choose CP or AP.',
      'CP (e.g. HBase, CockroachDB, Raft): Rejects writes or times out to preserve linearizability during partition.',
      'AP (e.g. Cassandra, DynamoDB): Accepts writes on all partitions, resolving conflicts later (eventual consistency).',
      'PACELC: If Partition (P), choose Availability (A) or Consistency (C); Else (E), choose Latency (L) or Consistency (C).'
    ],
    keyConcepts: [
      'Network Partition inevitability',
      'CP vs AP failure semantics',
      'PACELC theorem (Partition A/C, Else L/C)',
      'Quorum reads and writes: R + W > N'
    ],
    practicalExample: 'ATM Cash Withdrawal: CP system rejects withdrawal if central ledger is unreachable (avoids double spending). Twitter Likes: AP system increments like counter locally and reconciles later.',
    suggestedAnswerStructure: [
      { section: 'CAP Definitions & Myth Busting', guidance: 'Define C, A, P and prove why "CA" cannot exist across networks.' },
      { section: 'Behavior During Partition', guidance: 'Contrast CP response (error/block) with AP response (stale read/accept write).' },
      { section: 'PACELC Expansion', guidance: 'Explain how systems like MongoDB or DynamoDB trade latency for consistency during normal health.' }
    ],
    tags: ['CAP Theorem', 'PACELC', 'Distributed Systems', 'Consistency']
  },
  {
    id: 'sys-horizontal-scaling-tradeoffs',
    title: 'Horizontal vs Vertical Scaling & Stateless Architecture',
    category: 'SYSTEM_DESIGN',
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    shortDescription: 'Transition from single beefy servers to distributed autoscaling clusters, externalized state, and sticky sessions.',
    interviewQuestion: 'Compare Horizontal Scaling (Scaling Out) with Vertical Scaling (Scaling Up). How do you design application servers to be completely stateless to enable elastic autoscaling?',
    followUpQuestions: [
      'What are the downsides of sticky sessions (session affinity) in load balancers?',
      'Where is user session state stored in a modern stateless web architecture?'
    ],
    revisionNotes: [
      'Vertical: Bigger CPU/RAM. Simple, no architectural changes, but hard hardware ceiling and single point of failure.',
      'Horizontal: Add more commodity machines. Infinite scale potential, high fault tolerance, but requires distributed architecture.',
      'Stateless application servers store zero client session state in local memory.',
      'Session tokens (JWT) or session records are offloaded to distributed cache (Redis) or database.',
      'Statelessness allows load balancers to route any request to any server and autoscale instances dynamically based on CPU/traffic.'
    ],
    keyConcepts: [
      'Scale-Up hardware limits vs Scale-Out distribution overhead',
      'Stateless server design principles',
      'Centralized session store (Redis) vs Signed JWT cookies',
      'Horizontal Pod Autoscaling (HPA) metrics'
    ],
    practicalExample: 'If Server A crashes in a stateless cluster, Load Balancer routes the user\'s next request to Server B seamlessly because user session is retrieved from shared Redis cluster.',
    suggestedAnswerStructure: [
      { section: 'Scaling Strategies Comparison', guidance: 'Compare cost, complexity, limits, and failover.' },
      { section: 'Stateless Architecture Checklist', guidance: 'Remove in-memory caches, local file uploads, and session sticky affinity.' },
      { section: 'Elastic Autoscaling Implementation', guidance: 'Detail Cloud Load Balancers, health checks, and autoscaling triggers.' }
    ],
    tags: ['System Design', 'Scaling', 'Stateless', 'Load Balancing']
  },
  {
    id: 'hr-explaining-difficult-decision',
    title: 'Behavioral: Explaining a Difficult Technical Trade-off',
    category: 'BEHAVIORAL',
    difficulty: 'Intermediate',
    estimatedMinutes: 8,
    shortDescription: 'Communicate engineering pragmatism: balancing technical debt, product deadlines, and system reliability.',
    interviewQuestion: 'Tell me about a time you had to make a difficult technical trade-off between speed of delivery (shipping fast) and code quality / scalability. How did you decide?',
    followUpQuestions: [
      'How did you communicate this trade-off to non-technical product managers or stakeholders?',
      'Did that decision incur technical debt, and did you repay it later?'
    ],
    revisionNotes: [
      'Interviewers want to see pragmatism: shipping value to users while maintaining responsible risk management.',
      'Avoid ideological purism ("I always write 100% perfect code") and recklessness ("I hack whatever works").',
      'Frame the decision: What was the business deadline? What were the risks of the shortcut? What mitigation did you put in place?',
      'Track technical debt explicitly as ticketed backlog items with clear triggers for repayment.'
    ],
    keyConcepts: [
      'Engineering pragmatism vs Dogmatism',
      'Quantifying risk and blast radius',
      'Transparent communication with Product Managers',
      'Deliberate technical debt management'
    ],
    practicalExample: 'To launch beta before conference, chose monolithic PostgreSQL query over building Kafka microservice. Documented debt, set latency alarm at 200ms, and refactored 2 months later when user count validated demand.',
    suggestedAnswerStructure: [
      { section: 'Context & Competing Priorities', guidance: 'Describe the impending launch date and technical dilemma.' },
      { section: 'Decision Framework & Mitigations', guidance: 'Explain how you evaluated business impact vs technical risk.' },
      { section: 'Outcome & Debt Repayment', guidance: 'Show successful launch and subsequent scheduled refactoring.' }
    ],
    tags: ['Behavioral', 'Trade-offs', 'Technical Debt', 'Pragmatism']
  },
  {
    id: 'proj-database-selection',
    title: 'Project Defense: SQL vs NoSQL Database Selection',
    category: 'PROJECT_DEFENSE',
    difficulty: 'Intermediate',
    estimatedMinutes: 8,
    shortDescription: 'Justify your storage choices: relational schemas, document stores, key-value caches, and time-series DBs.',
    interviewQuestion: 'Why did you choose your specific database (e.g. PostgreSQL, MongoDB, DynamoDB) for your primary project? Under what access patterns would an alternative database have been superior?',
    followUpQuestions: [
      'How does your schema design enforce data integrity and prevent orphaned records?',
      'How do you plan to handle schema migrations in production with zero downtime?'
    ],
    revisionNotes: [
      'Do not answer "Because it was familiar" or "Because it is popular".',
      'State specific query access patterns: transactional guarantees, relational joins, structured vs polymorphic JSON documents, read/write ratio.',
      'Highlight trade-offs: SQL offers ACID and flexible joins at the cost of vertical scaling limits; Document stores offer horizontal scale and schema flexibility at the cost of duplicate data and client-side joins.',
      'Mention zero-downtime migration strategies: Expand-and-Contract pattern (add new column nullable -> dual write -> backfill -> read new -> drop old).'
    ],
    keyConcepts: [
      'Access pattern-driven database selection',
      'ACID transactional requirements',
      'Polymorphic data vs strict relational integrity',
      'Expand-and-Contract schema migration pattern'
    ],
    practicalExample: 'E-commerce platform: PostgreSQL chosen for Orders and Payments where ACID and foreign keys prevent phantom items. MongoDB chosen for Product Catalog where attributes vary wildly across 10,000 product categories.',
    suggestedAnswerStructure: [
      { section: 'Chosen Database Justification', guidance: 'Tie database capabilities directly to product features and query patterns.' },
      { section: 'Counter-Evaluation of Alternatives', guidance: 'Explain why alternative (e.g. MongoDB) was rejected for this specific core entity.' },
      { section: 'Migration & Integrity Safeguards', guidance: 'Explain foreign keys, transaction boundaries, and zero-downtime migrations.' }
    ],
    tags: ['Project Defense', 'Databases', 'SQL', 'NoSQL', 'Architecture']
  },
  {
    id: 'proj-error-handling-resilience',
    title: 'Project Defense: Error Handling, Retries & Circuit Breakers',
    category: 'PROJECT_DEFENSE',
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    shortDescription: 'Demonstrate production-grade reliability: graceful degradation, exponential backoff, circuit breakers, and idempotency keys.',
    interviewQuestion: 'How does your project handle external third-party API failures, network timeouts, and partial outages? Walk through your retry, fallback, and circuit breaking strategy.',
    followUpQuestions: [
      'What is the Circuit Breaker pattern (Closed, Open, Half-Open states)?',
      'How do Idempotency Keys prevent duplicate charges during payment gateway timeouts?'
    ],
    revisionNotes: [
      'Cascading failure: A failing downstream service causes callers to block threads and exhaust connection pools, crashing the entire system.',
      'Circuit Breaker states: Closed (normal), Open (tripped after threshold failures; immediately fails fast without calling downstream), Half-Open (allows trial requests to test recovery).',
      'Exponential backoff with randomized jitter prevents thundering herd on recovering dependencies.',
      'Idempotency keys (UUID passed in HTTP header) ensure retried POST requests do not duplicate critical state transitions.'
    ],
    keyConcepts: [
      'Cascading failure prevention',
      'Circuit Breaker three-state machine',
      'Exponential backoff with randomized jitter formula',
      'Idempotency key deduplication'
    ],
    practicalExample: 'Payment API call times out after 3s. App does not blindly retry without token; it sends same `Idempotency-Key: req_123` with backoff. Payment provider recognizes key and returns existing transaction status without charging twice.',
    suggestedAnswerStructure: [
      { section: 'Failure Scenario & Blast Radius', guidance: 'Describe third-party outage impact on user experience.' },
      { section: 'Circuit Breaker State Machine', guidance: 'Explain Closed, Open, and Half-Open transitions.' },
      { section: 'Safe Retries & Idempotency', guidance: 'Explain jittered backoff and idempotency keys.' }
    ],
    tags: ['Project Defense', 'Resilience', 'Circuit Breaker', 'Error Handling']
  }
];

export const CATEGORIES_LIST = [
  { id: 'DSA', label: 'Data Structures & Algorithms', count: TOPICS.filter(t => t.category === 'DSA').length },
  { id: 'OOPS', label: 'OOPS & Architecture', count: TOPICS.filter(t => t.category === 'OOPS').length },
  { id: 'PROGRAMMING', label: 'Programming & Memory', count: TOPICS.filter(t => t.category === 'PROGRAMMING').length },
  { id: 'DBMS', label: 'Database Systems', count: TOPICS.filter(t => t.category === 'DBMS').length },
  { id: 'OS', label: 'Operating Systems', count: TOPICS.filter(t => t.category === 'OS').length },
  { id: 'NETWORKS', label: 'Computer Networks', count: TOPICS.filter(t => t.category === 'NETWORKS').length },
  { id: 'SYSTEM_DESIGN', label: 'System Design', count: TOPICS.filter(t => t.category === 'SYSTEM_DESIGN').length },
  { id: 'BEHAVIORAL', label: 'HR & Behavioral', count: TOPICS.filter(t => t.category === 'BEHAVIORAL').length },
  { id: 'PROJECT_DEFENSE', label: 'Project Defense', count: TOPICS.filter(t => t.category === 'PROJECT_DEFENSE').length },
];
