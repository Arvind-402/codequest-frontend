import type { UserProfile, RevisionScheduleItem } from '../types/user';
import type { PracticeSession, DraftSession } from '../types/session';
import { getTodayDateString, addDaysToDateString, calculateStreak } from '../utils/date';

export const STORAGE_KEY = 'codequest_v1_data';

export interface CodeQuestStorageState {
  version: number;
  profile: UserProfile;
  sessions: PracticeSession[];
  bookmarks: string[];
  revisionSchedule: Record<string, RevisionScheduleItem>;
  drafts: Record<string, DraftSession>;
}

export function getDefaultDemoProfile(): UserProfile {
  return {
    id: 'user-demo-1',
    name: 'Alex Chen',
    handle: 'alex_dev',
    targetRole: 'Full-Stack SDE / Systems Engineer',
    avatarSeed: 'alex',
    totalXP: 145,
    currentStreak: 3,
    longestStreak: 5,
    lastActiveDate: getTodayDateString(),
    preferences: {
      defaultTimerMinutes: 10,
      soundEnabled: true,
      warnBeforeRevealNotes: true,
      dailyGoalCount: 1,
      targetRole: 'Full-Stack SDE / Systems Engineer',
    },
  };
}

/**
 * Realistic default starter sessions so that first-time users can immediately
 * inspect real streak counters, 7-day calendar, revision queues, and charts!
 */
export function getDefaultStarterSessions(): PracticeSession[] {
  const today = getTodayDateString();
  const yesterday = addDaysToDateString(today, -1);
  const twoDaysAgo = addDaysToDateString(today, -2);

  return [
    {
      id: 'session-sample-1',
      topicId: 'dsa-two-pointers',
      topicTitle: 'Two Pointers & Sliding Window Patterns',
      category: 'DSA',
      completedAt: `${twoDaysAgo}T14:30:00.000Z`,
      dateString: twoDaysAgo,
      durationSeconds: 420,
      userAnswer: 'Used two pointers converging from both ends for sorted pair sum. For dynamic sliding window, expanded right pointer while distinct character count was <= k, then contracted left pointer. Amortized time is O(N) because each element is visited at most twice.',
      wordCount: 42,
      revealedNotes: false,
      recallMode: 'independent',
      ratingCriteria: {
        correctness: 5,
        completeness: 4,
        clarity: 5,
        examples: 4,
      },
      averageRating: 4.5,
      missingConcepts: [],
      reflectionNote: 'Felt confident explaining the amortized O(N) proof.',
      confidence: 'High',
      reviewDifficulty: 'Good',
      xpEarned: 45,
      xpBreakdown: {
        base: 25,
        recallBonus: 10,
        ratingBonus: 10,
        dailyMissionBonus: 0,
      },
    },
    {
      id: 'session-sample-2',
      topicId: 'dbms-b-tree-indexing',
      topicTitle: 'B-Tree & B+ Tree Indexing Internals',
      category: 'DBMS',
      completedAt: `${yesterday}T16:15:00.000Z`,
      dateString: yesterday,
      durationSeconds: 510,
      userAnswer: 'Explained why B+ trees outperform BSTs on disk due to high branching factor (100-1000) reducing disk I/O to 3-4 reads. Emphasized that data records reside only in leaf nodes, which are linked in a doubly linked list for range queries.',
      wordCount: 43,
      revealedNotes: false,
      recallMode: 'independent',
      ratingCriteria: {
        correctness: 4,
        completeness: 4,
        clarity: 4,
        examples: 4,
      },
      averageRating: 4.0,
      missingConcepts: ['Covering index eliminates secondary index lookup to base table'],
      reflectionNote: 'Need to review covering index edge cases.',
      confidence: 'Medium',
      reviewDifficulty: 'Good',
      xpEarned: 45,
      xpBreakdown: {
        base: 25,
        recallBonus: 10,
        ratingBonus: 10,
        dailyMissionBonus: 0,
      },
    },
    {
      id: 'session-sample-3',
      topicId: 'os-process-vs-thread',
      topicTitle: 'Processes vs Threads & Context Switching Overhead',
      category: 'OS',
      completedAt: `${today}T10:00:00.000Z`,
      dateString: today,
      durationSeconds: 380,
      userAnswer: 'Highlighted process address space isolation vs thread shared heap/code. Explained context switch steps: saving registers, PCB vs TCB, and TLB invalidation during process switch which causes cache misses.',
      wordCount: 36,
      revealedNotes: false,
      recallMode: 'independent',
      ratingCriteria: {
        correctness: 5,
        completeness: 5,
        clarity: 5,
        examples: 4,
      },
      averageRating: 4.75,
      missingConcepts: [],
      reflectionNote: 'Clean explanation of TLB shootdown penalty.',
      confidence: 'High',
      reviewDifficulty: 'Easy',
      xpEarned: 55,
      xpBreakdown: {
        base: 25,
        recallBonus: 10,
        ratingBonus: 10,
        dailyMissionBonus: 10,
      },
    },
  ];
}

export function getDefaultStarterSchedules(): Record<string, RevisionScheduleItem> {
  const today = getTodayDateString();
  const yesterday = addDaysToDateString(today, -1);
  const twoDaysAgo = addDaysToDateString(today, -2);

  return {
    'dsa-two-pointers': {
      topicId: 'dsa-two-pointers',
      lastPracticedDate: `${twoDaysAgo}T14:30:00.000Z`,
      nextReviewDate: addDaysToDateString(twoDaysAgo, 3), // Due tomorrow or soon
      intervalDays: 3,
      repetitionCount: 1,
      easeFactor: 2.5,
      lastDifficulty: 'Good',
      lastRating: 4.5,
    },
    'dbms-b-tree-indexing': {
      topicId: 'dbms-b-tree-indexing',
      lastPracticedDate: `${yesterday}T16:15:00.000Z`,
      nextReviewDate: addDaysToDateString(yesterday, 3),
      intervalDays: 3,
      repetitionCount: 1,
      easeFactor: 2.5,
      lastDifficulty: 'Good',
      lastRating: 4.0,
    },
    'os-process-vs-thread': {
      topicId: 'os-process-vs-thread',
      lastPracticedDate: `${today}T10:00:00.000Z`,
      nextReviewDate: addDaysToDateString(today, 5),
      intervalDays: 5,
      repetitionCount: 1,
      easeFactor: 2.65,
      lastDifficulty: 'Easy',
      lastRating: 4.75,
    },
  };
}

export function createInitialState(): CodeQuestStorageState {
  const sessions = getDefaultStarterSessions();
  const { currentStreak, longestStreak } = calculateStreak(sessions);
  const profile = getDefaultDemoProfile();
  profile.currentStreak = currentStreak;
  profile.longestStreak = longestStreak;
  profile.totalXP = sessions.reduce((acc, s) => acc + s.xpEarned, 0);

  return {
    version: 1,
    profile,
    sessions,
    bookmarks: ['dsa-lru-cache', 'sys-caching-strategies', 'os-concurrency-mutex-semaphore'],
    revisionSchedule: getDefaultStarterSchedules(),
    drafts: {},
  };
}

export function loadStateFromStorage(): CodeQuestStorageState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createInitialState();
      saveStateToStorage(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.sessions)) {
      const initial = createInitialState();
      saveStateToStorage(initial);
      return initial;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load CodeQuest state from localStorage:', err);
    return createInitialState();
  }
}

export function saveStateToStorage(state: CodeQuestStorageState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to write CodeQuest state to localStorage:', err);
  }
}

export function clearLocalStorageState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear storage:', err);
  }
}
