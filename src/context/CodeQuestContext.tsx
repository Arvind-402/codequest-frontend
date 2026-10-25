import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { UserProfile, RevisionScheduleItem, Achievement, UserPreferences } from '../types/user';
import type { PracticeSession, ReviewDifficulty, RatingCriteria, ConfidenceLevel } from '../types/session';
import type { TopicStatus } from '../types/topic';
import { evaluateAchievements } from '../data/achievements';
import { calculateStreak, getTodayDateString } from '../utils/date';
import { calculateSessionXP } from '../utils/xp';
import { calculateNextReviewSchedule } from '../utils/scheduling';
import {
  loadStateFromStorage,
  saveStateToStorage,
  createInitialState,
  getDefaultDemoProfile,
  type CodeQuestStorageState,
} from '../services/storage';

interface SaveSessionParams {
  topicId: string;
  topicTitle: string;
  category: string;
  durationSeconds: number;
  userAnswer: string;
  wordCount: number;
  revealedNotes: boolean;
  recallMode: 'independent' | 'assisted';
  ratingCriteria: RatingCriteria;
  averageRating: number;
  missingConcepts: string[];
  reflectionNote?: string;
  confidence: ConfidenceLevel;
  reviewDifficulty: ReviewDifficulty;
  isRevision?: boolean;
}

interface CodeQuestContextValue {
  profile: UserProfile;
  sessions: PracticeSession[];
  bookmarks: string[];
  revisionSchedule: Record<string, RevisionScheduleItem>;
  achievements: Achievement[];
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  todayCompletedCount: number;
  dailyGoalCount: number;
  isDailyGoalMet: boolean;
  toggleBookmark: (topicId: string) => void;
  isBookmarked: (topicId: string) => boolean;
  saveCompletedSession: (params: SaveSessionParams) => PracticeSession;
  getTopicStatus: (topicId: string) => TopicStatus;
  getTopicStats: (topicId: string) => { attempts: number; averageRating: number; lastPracticed?: string };
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  updateProfile: (name: string, targetRole: string) => void;
  resetAllData: (toCleanEmpty?: boolean) => void;
  loadRichDemoData: () => void;
}

const CodeQuestContext = createContext<CodeQuestContextValue | undefined>(undefined);

export const CodeQuestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CodeQuestStorageState>(() => loadStateFromStorage());

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveStateToStorage(state);
  }, [state]);

  const { currentStreak, longestStreak } = useMemo(() => {
    return calculateStreak(state.sessions);
  }, [state.sessions]);

  const todayStr = getTodayDateString();

  const todayCompletedCount = useMemo(() => {
    return state.sessions.filter((s) => (s.dateString || s.completedAt.split('T')[0]) === todayStr).length;
  }, [state.sessions, todayStr]);

  const dailyGoalCount = state.profile.preferences.dailyGoalCount || 1;
  const isDailyGoalMet = todayCompletedCount >= dailyGoalCount;

  const totalXP = useMemo(() => {
    return state.sessions.reduce((acc, s) => acc + (s.xpEarned || 0), 0);
  }, [state.sessions]);

  const achievements = useMemo(() => {
    return evaluateAchievements(state.sessions, currentStreak);
  }, [state.sessions, currentStreak]);

  const toggleBookmark = useCallback((topicId: string) => {
    setState((prev) => {
      const exists = prev.bookmarks.includes(topicId);
      const newBookmarks = exists
        ? prev.bookmarks.filter((id) => id !== topicId)
        : [...prev.bookmarks, topicId];
      return {
        ...prev,
        bookmarks: newBookmarks,
      };
    });
  }, []);

  const isBookmarked = useCallback(
    (topicId: string) => {
      return state.bookmarks.includes(topicId);
    },
    [state.bookmarks]
  );

  const getTopicStats = useCallback(
    (topicId: string) => {
      const attempts = state.sessions.filter((s) => s.topicId === topicId);
      if (attempts.length === 0) {
        return { attempts: 0, averageRating: 0 };
      }
      const sum = attempts.reduce((acc, s) => acc + s.averageRating, 0);
      const averageRating = Number((sum / attempts.length).toFixed(1));
      const lastPracticed = attempts[attempts.length - 1].completedAt;
      return {
        attempts: attempts.length,
        averageRating,
        lastPracticed,
      };
    },
    [state.sessions]
  );

  const getTopicStatus = useCallback(
    (topicId: string): TopicStatus => {
      const attempts = state.sessions.filter((s) => s.topicId === topicId);
      if (attempts.length === 0) return 'not_started';

      const schedule = state.revisionSchedule[topicId];
      if (schedule && schedule.nextReviewDate <= todayStr) {
        return 'needs_revision';
      }

      const sum = attempts.reduce((acc, s) => acc + s.averageRating, 0);
      const avg = sum / attempts.length;

      if (attempts.length >= 2 && avg >= 4.0) {
        return 'strong';
      }
      if (attempts.length >= 2) {
        return 'practiced_repeatedly';
      }
      return 'attempted';
    },
    [state.sessions, state.revisionSchedule, todayStr]
  );

  const saveCompletedSession = useCallback(
    (params: SaveSessionParams): PracticeSession => {
      const now = new Date();
      const completedAt = now.toISOString();
      const dateString = getTodayDateString();

      // Check if this session will fulfill the daily goal right now
      const isDailyGoalMetNow = todayCompletedCount + 1 >= dailyGoalCount && todayCompletedCount < dailyGoalCount;

      const xpResult = calculateSessionXP({
        isRevision: params.isRevision,
        revealedNotes: params.revealedNotes,
        averageRating: params.averageRating,
        wordCount: params.wordCount,
        isDailyGoalMetNow,
      });

      const newSession: PracticeSession = {
        id: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        topicId: params.topicId,
        topicTitle: params.topicTitle,
        category: params.category,
        completedAt,
        dateString,
        durationSeconds: params.durationSeconds,
        userAnswer: params.userAnswer,
        wordCount: params.wordCount,
        revealedNotes: params.revealedNotes,
        recallMode: params.recallMode,
        ratingCriteria: params.ratingCriteria,
        averageRating: params.averageRating,
        missingConcepts: params.missingConcepts,
        reflectionNote: params.reflectionNote,
        confidence: params.confidence,
        reviewDifficulty: params.reviewDifficulty,
        xpEarned: xpResult.total,
        xpBreakdown: {
          base: xpResult.base,
          recallBonus: xpResult.recallBonus,
          ratingBonus: xpResult.ratingBonus,
          dailyMissionBonus: xpResult.dailyMissionBonus,
        },
      };

      // Calculate new spaced repetition schedule
      const existingSchedule = state.revisionSchedule[params.topicId];
      const newScheduleItem = calculateNextReviewSchedule(
        params.topicId,
        params.reviewDifficulty,
        params.averageRating,
        existingSchedule
      );

      setState((prev) => {
        const updatedSessions = [...prev.sessions, newSession];
        const newStreaks = calculateStreak(updatedSessions);
        const newTotalXp = updatedSessions.reduce((acc, s) => acc + s.xpEarned, 0);

        return {
          ...prev,
          profile: {
            ...prev.profile,
            currentStreak: newStreaks.currentStreak,
            longestStreak: newStreaks.longestStreak,
            totalXP: newTotalXp,
            lastActiveDate: dateString,
          },
          sessions: updatedSessions,
          revisionSchedule: {
            ...prev.revisionSchedule,
            [params.topicId]: newScheduleItem,
          },
        };
      });

      return newSession;
    },
    [todayCompletedCount, dailyGoalCount, state.revisionSchedule]
  );

  const updatePreferences = useCallback((prefs: Partial<UserPreferences>) => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        preferences: {
          ...prev.profile.preferences,
          ...prefs,
        },
      },
    }));
  }, []);

  const updateProfile = useCallback((name: string, targetRole: string) => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        name,
        targetRole,
        preferences: {
          ...prev.profile.preferences,
          targetRole,
        },
      },
    }));
  }, []);

  const resetAllData = useCallback((toCleanEmpty?: boolean) => {
    if (toCleanEmpty) {
      const cleanProfile = getDefaultDemoProfile();
      cleanProfile.currentStreak = 0;
      cleanProfile.longestStreak = 0;
      cleanProfile.totalXP = 0;
      const cleanState: CodeQuestStorageState = {
        version: 1,
        profile: cleanProfile,
        sessions: [],
        bookmarks: [],
        revisionSchedule: {},
        drafts: {},
      };
      setState(cleanState);
      saveStateToStorage(cleanState);
    } else {
      const starter = createInitialState();
      setState(starter);
      saveStateToStorage(starter);
    }
  }, []);

  const loadRichDemoData = useCallback(() => {
    const starter = createInitialState();
    setState(starter);
    saveStateToStorage(starter);
  }, []);

  const value = useMemo(
    () => ({
      profile: state.profile,
      sessions: state.sessions,
      bookmarks: state.bookmarks,
      revisionSchedule: state.revisionSchedule,
      achievements,
      currentStreak,
      longestStreak,
      totalXP,
      todayCompletedCount,
      dailyGoalCount,
      isDailyGoalMet,
      toggleBookmark,
      isBookmarked,
      saveCompletedSession,
      getTopicStatus,
      getTopicStats,
      updatePreferences,
      updateProfile,
      resetAllData,
      loadRichDemoData,
    }),
    [
      state.profile,
      state.sessions,
      state.bookmarks,
      state.revisionSchedule,
      achievements,
      currentStreak,
      longestStreak,
      totalXP,
      todayCompletedCount,
      dailyGoalCount,
      isDailyGoalMet,
      toggleBookmark,
      isBookmarked,
      saveCompletedSession,
      getTopicStatus,
      getTopicStats,
      updatePreferences,
      updateProfile,
      resetAllData,
      loadRichDemoData,
    ]
  );

  return <CodeQuestContext.Provider value={value}>{children}</CodeQuestContext.Provider>;
};

export function useCodeQuest(): CodeQuestContextValue {
  const context = useContext(CodeQuestContext);
  if (!context) {
    throw new Error('useCodeQuest must be used within a CodeQuestProvider');
  }
  return context;
}
