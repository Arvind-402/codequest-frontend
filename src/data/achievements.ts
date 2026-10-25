import type { Achievement } from '../types/user';
import type { PracticeSession } from '../types/session';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_challenge',
    title: 'First CodeQuest',
    description: 'Complete your first practice session and self-assessment.',
    category: 'sessions',
    icon: 'Sparkles',
    isUnlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'five_topics',
    title: 'Recall Enthusiast',
    description: 'Complete 5 distinct practice challenges.',
    category: 'sessions',
    icon: 'Brain',
    isUnlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'ten_topics',
    title: 'Double Digits',
    description: 'Reach 10 completed practice sessions.',
    category: 'sessions',
    icon: 'Award',
    isUnlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'seven_day_streak',
    title: 'Consistency Champion',
    description: 'Maintain an active daily study streak for 7 consecutive days.',
    category: 'streak',
    icon: 'Flame',
    isUnlocked: false,
    progress: 0,
    maxProgress: 7,
  },
  {
    id: 'thirty_day_streak',
    title: 'Iron Will',
    description: 'Achieve a legendary 30-day interview preparation streak.',
    category: 'streak',
    icon: 'Zap',
    isUnlocked: false,
    progress: 0,
    maxProgress: 30,
  },
  {
    id: 'dsa_explorer',
    title: 'Algorithm Ace',
    description: 'Master at least 3 Data Structures & Algorithms topics.',
    category: 'mastery',
    icon: 'Code',
    isUnlocked: false,
    progress: 0,
    maxProgress: 3,
  },
  {
    id: 'cs_fundamentals',
    title: 'CS Fundamentals Explorer',
    description: 'Complete at least one topic each in OS, DBMS, and Computer Networks.',
    category: 'mastery',
    icon: 'Terminal',
    isUnlocked: false,
    progress: 0,
    maxProgress: 3,
  },
  {
    id: 'revision_regular',
    title: 'Spaced Repetition Regular',
    description: 'Complete 3 scheduled revision reviews to cement long-term memory.',
    category: 'mastery',
    icon: 'Clock',
    isUnlocked: false,
    progress: 0,
    maxProgress: 3,
  },
  {
    id: 'high_standard',
    title: 'Top Marks',
    description: 'Submit an independent recall session with a self-assessment average of 4.5 or higher.',
    category: 'xp',
    icon: 'Star',
    isUnlocked: false,
    progress: 0,
    maxProgress: 1,
  },
];

/**
 * Dynamically computes unlocked status and current progress for all achievements
 * based on true activity history.
 */
export function evaluateAchievements(
  sessions: PracticeSession[],
  currentStreak: number
): Achievement[] {
  const uniqueTopics = new Set(sessions.map((s) => s.topicId));
  const totalCompleted = sessions.length;

  const dsaCount = new Set(sessions.filter((s) => s.category === 'DSA').map((s) => s.topicId)).size;
  const osCount = new Set(sessions.filter((s) => s.category === 'OS').map((s) => s.topicId)).size;
  const dbmsCount = new Set(sessions.filter((s) => s.category === 'DBMS').map((s) => s.topicId)).size;
  const netCount = new Set(sessions.filter((s) => s.category === 'NETWORKS').map((s) => s.topicId)).size;

  const csCoreFoundations = (osCount > 0 ? 1 : 0) + (dbmsCount > 0 ? 1 : 0) + (netCount > 0 ? 1 : 0);

  const revisionsCount = sessions.filter((s) => s.recallMode === 'independent' && s.xpBreakdown.base === 15).length;
  const hasHighStandard = sessions.some((s) => s.averageRating >= 4.5 && s.recallMode === 'independent');

  return INITIAL_ACHIEVEMENTS.map((ach) => {
    let progress = 0;
    let isUnlocked = false;

    switch (ach.id) {
      case 'first_challenge':
        progress = Math.min(1, totalCompleted);
        isUnlocked = totalCompleted >= 1;
        break;
      case 'five_topics':
        progress = Math.min(5, uniqueTopics.size);
        isUnlocked = uniqueTopics.size >= 5;
        break;
      case 'ten_topics':
        progress = Math.min(10, totalCompleted);
        isUnlocked = totalCompleted >= 10;
        break;
      case 'seven_day_streak':
        progress = Math.min(7, currentStreak);
        isUnlocked = currentStreak >= 7;
        break;
      case 'thirty_day_streak':
        progress = Math.min(30, currentStreak);
        isUnlocked = currentStreak >= 30;
        break;
      case 'dsa_explorer':
        progress = Math.min(3, dsaCount);
        isUnlocked = dsaCount >= 3;
        break;
      case 'cs_fundamentals':
        progress = csCoreFoundations;
        isUnlocked = csCoreFoundations >= 3;
        break;
      case 'revision_regular':
        progress = Math.min(3, revisionsCount);
        isUnlocked = revisionsCount >= 3;
        break;
      case 'high_standard':
        progress = hasHighStandard ? 1 : 0;
        isUnlocked = hasHighStandard;
        break;
      default:
        break;
    }

    return {
      ...ach,
      progress,
      isUnlocked,
    };
  });
}
