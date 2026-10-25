import type { ReviewDifficulty } from '../types/session';
import type { RevisionScheduleItem } from '../types/user';
import { getTodayDateString, addDaysToDateString } from './date';

/**
 * Spaced Repetition (SuperMemo-inspired) algorithm.
 * Adapts intervals based on Again, Hard, Good, Easy ratings.
 */
export function calculateNextReviewSchedule(
  topicId: string,
  difficulty: ReviewDifficulty,
  rating: number,
  existingItem?: RevisionScheduleItem
): RevisionScheduleItem {
  const today = getTodayDateString();
  const currentInterval = existingItem?.intervalDays || 0;
  const currentReps = existingItem?.repetitionCount || 0;
  let easeFactor = existingItem?.easeFactor || 2.5;

  let nextInterval: number;
  let nextReps: number;

  switch (difficulty) {
    case 'Again':
      nextInterval = 1; // Due tomorrow
      nextReps = 0;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      break;

    case 'Hard':
      nextInterval = currentInterval === 0 ? 1 : Math.max(1, Math.round(currentInterval * 1.2));
      nextReps = currentReps + 1;
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      break;

    case 'Good':
      if (currentInterval === 0) {
        nextInterval = 3;
      } else if (currentInterval === 1) {
        nextInterval = 6;
      } else {
        nextInterval = Math.round(currentInterval * easeFactor);
      }
      nextReps = currentReps + 1;
      break;

    case 'Easy':
      if (currentInterval === 0) {
        nextInterval = 5;
      } else {
        nextInterval = Math.round(currentInterval * easeFactor * 1.4);
      }
      nextReps = currentReps + 1;
      easeFactor = Math.min(3.0, easeFactor + 0.15);
      break;
  }

  const nextReviewDate = addDaysToDateString(today, nextInterval);

  return {
    topicId,
    lastPracticedDate: new Date().toISOString(),
    nextReviewDate,
    intervalDays: nextInterval,
    repetitionCount: nextReps,
    easeFactor: Number(easeFactor.toFixed(2)),
    lastDifficulty: difficulty,
    lastRating: rating,
  };
}

/**
 * Checks if a scheduled review item is due today or overdue.
 */
export function isReviewDue(nextReviewDateStr: string): boolean {
  if (!nextReviewDateStr) return false;
  const today = getTodayDateString();
  return nextReviewDateStr <= today;
}
