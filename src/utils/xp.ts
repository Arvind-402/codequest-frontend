export interface XPCalculationParams {
  isRevision?: boolean;
  revealedNotes: boolean; // false = independent recall
  averageRating: number; // 1.0 to 5.0
  wordCount: number;
  isDailyGoalMetNow: boolean;
}

export interface XPCalculationResult {
  total: number;
  base: number;
  recallBonus: number;
  ratingBonus: number;
  dailyMissionBonus: number;
}

/**
 * Transparent XP award rules:
 * - Base practice challenge: 25 XP
 * - Base revision session: 15 XP
 * - Independent recall bonus (did not reveal notes): +10 XP
 * - High-standard self-rating bonus (avg >= 4.0): +10 XP
 * - Daily goal completed bonus: +25 XP
 */
export function calculateSessionXP(params: XPCalculationParams): XPCalculationResult {
  const base = params.isRevision ? 15 : 25;
  const recallBonus = !params.revealedNotes ? 10 : 0;
  const ratingBonus = params.averageRating >= 4.0 ? 10 : params.averageRating >= 3.0 ? 5 : 0;
  const dailyMissionBonus = params.isDailyGoalMetNow ? 25 : 0;

  const total = base + recallBonus + ratingBonus + dailyMissionBonus;

  return {
    total,
    base,
    recallBonus,
    ratingBonus,
    dailyMissionBonus,
  };
}

/**
 * Level curve: Level = Math.floor(Math.sqrt(totalXP / 60)) + 1
 */
export function calculateLevel(totalXP: number): number {
  if (totalXP <= 0) return 1;
  return Math.floor(Math.sqrt(totalXP / 60)) + 1;
}

/**
 * Total XP required to reach a specific level.
 */
export function totalXpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.round(Math.pow(level - 1, 2) * 60);
}

/**
 * Calculates current level progress (0 to 100%) and current level bracket numbers.
 */
export function getLevelProgress(totalXP: number): {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
  xpRemainingToNext: number;
} {
  const level = calculateLevel(totalXP);
  const currentLevelFloor = totalXpForLevel(level);
  const nextLevelFloor = totalXpForLevel(level + 1);

  const xpEarnedInLevel = Math.max(0, totalXP - currentLevelFloor);
  const xpNeededForLevel = nextLevelFloor - currentLevelFloor;
  const progressPercent = Math.min(100, Math.round((xpEarnedInLevel / xpNeededForLevel) * 100));

  return {
    level,
    currentLevelXp: totalXP,
    nextLevelXp: nextLevelFloor,
    progressPercent: isNaN(progressPercent) ? 0 : progressPercent,
    xpRemainingToNext: Math.max(0, nextLevelFloor - totalXP),
  };
}
