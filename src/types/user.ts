import type { Category } from './topic';
import type { ReviewDifficulty } from './session';

export interface UserPreferences {
  defaultTimerMinutes: number;
  soundEnabled: boolean;
  warnBeforeRevealNotes: boolean;
  dailyGoalCount: number; // e.g. 1 challenge / day
  targetRole: string;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  targetRole: string;
  avatarSeed: string;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  preferences: UserPreferences;
}

export interface RevisionScheduleItem {
  topicId: string;
  lastPracticedDate: string; // ISO string
  nextReviewDate: string; // YYYY-MM-DD
  intervalDays: number;
  repetitionCount: number;
  easeFactor: number;
  lastDifficulty: ReviewDifficulty;
  lastRating: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'streak' | 'sessions' | 'mastery' | 'xp';
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface DailyActivityRecord {
  date: string; // YYYY-MM-DD
  sessionCount: number;
  totalXp: number;
  topicIds: string[];
}

export interface SubjectStats {
  category: Category;
  totalTopics: number;
  attemptedTopics: number;
  masteredTopics: number;
  averageRating: number;
  totalTimeMinutes: number;
}
