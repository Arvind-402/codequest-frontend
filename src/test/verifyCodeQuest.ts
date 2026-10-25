import { TOPICS } from '../data/topics';
import { calculateStreak, getTodayDateString, addDaysToDateString } from '../utils/date';
import { calculateSessionXP } from '../utils/xp';
import { calculateNextReviewSchedule, isReviewDue } from '../utils/scheduling';
import { calculateRotationToCategory, getDailyChallengeTopic, WHEEL_CATEGORIES } from '../utils/wheel';
import { evaluateAchievements } from '../data/achievements';
import type { PracticeSession } from '../types/session';

console.log('==============================================');
console.log('🧪 CODEQUEST PROTOYPE FUNCTIONAL VERIFICATION');
console.log('==============================================\n');

let failedTests = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`✅ PASS: ${msg}`);
  } else {
    console.error(`❌ FAIL: ${msg}`);
    failedTests++;
  }
}

// 1. Topic Bank Validation
console.log('--- 1. Topic Bank Integrity ---');
assert(TOPICS.length >= 40, `Topics count is ${TOPICS.length} (must be >= 40, prefer 50+)`);

const ids = new Set();
let duplicates = 0;
let missingFields = 0;

for (const t of TOPICS) {
  if (ids.has(t.id)) duplicates++;
  ids.add(t.id);
  if (!t.title || !t.category || !t.difficulty || !t.interviewQuestion || !t.revisionNotes || !t.keyConcepts) {
    missingFields++;
  }
}

assert(duplicates === 0, `No duplicate topic IDs found`);
assert(missingFields === 0, `All ${TOPICS.length} topics contain complete mandatory fields`);

// 2. Wheel Rotation Math
console.log('\n--- 2. Wheel Rotation Physics & Pointer Alignment ---');
const totalSlices = 8;
const sliceAngle = 360 / totalSlices;

for (let targetIdx = 0; targetIdx < totalSlices; targetIdx++) {
  const currentRot = 45; // arbitrary starting angle
  const nextRot = calculateRotationToCategory(targetIdx, currentRot, totalSlices, 5);

  // When rotated by nextRot clockwise, slice targetIdx center must be at 0/360 degrees (12 o'clock)
  const sliceCenterAngle = targetIdx * sliceAngle + sliceAngle / 2;
  const landedAngleAtPointer = (sliceCenterAngle + nextRot) % 360;

  // Expect landed angle to be 0 within floating point precision
  const diffFromTopPointer = Math.min(landedAngleAtPointer, 360 - landedAngleAtPointer);
  assert(
    diffFromTopPointer < 0.001,
    `Slice ${targetIdx} (${WHEEL_CATEGORIES[targetIdx].shortLabel}) accurately lands under top pointer (landed = ${landedAngleAtPointer}°)`
  );
}

// 3. Deterministic Daily Challenge
console.log('\n--- 3. Deterministic Daily Challenge ---');
const date1 = '2026-10-25';
const date2 = '2026-10-26';
const challenge1A = getDailyChallengeTopic(TOPICS, date1);
const challenge1B = getDailyChallengeTopic(TOPICS, date1);
const challenge2 = getDailyChallengeTopic(TOPICS, date2);

assert(challenge1A !== null, `Daily challenge topic generated for ${date1}`);
assert(challenge1A?.id === challenge1B?.id, `Reopening same day generates deterministic identical topic (${challenge1A?.title})`);
assert(challenge1A?.id !== challenge2?.id, `Different calendar date generates distinct daily topic`);

// 4. Streak Calculation
console.log('\n--- 4. Real Calendar Streak Calculations ---');
const today = getTodayDateString();
const yesterday = addDaysToDateString(today, -1);
const twoDaysAgo = addDaysToDateString(today, -2);
const fourDaysAgo = addDaysToDateString(today, -4);

const mockSession = (dateStr: string, id: string): PracticeSession => ({
  id,
  topicId: 'dsa-two-pointers',
  topicTitle: 'Two Pointers',
  category: 'DSA',
  completedAt: `${dateStr}T12:00:00.000Z`,
  dateString: dateStr,
  durationSeconds: 300,
  userAnswer: 'Explanation text...',
  wordCount: 20,
  revealedNotes: false,
  recallMode: 'independent',
  ratingCriteria: { correctness: 5, completeness: 5, clarity: 5, examples: 5 },
  averageRating: 5.0,
  missingConcepts: [],
  confidence: 'High',
  reviewDifficulty: 'Good',
  xpEarned: 45,
  xpBreakdown: { base: 25, recallBonus: 10, ratingBonus: 10, dailyMissionBonus: 0 },
});

// Test 3 consecutive days ending today: streak = 3
const consecutiveSessions = [
  mockSession(twoDaysAgo, 's1'),
  mockSession(yesterday, 's2'),
  mockSession(today, 's3'),
  mockSession(today, 's4'), // multiple on same day should count as 1 active day!
];
const streakResult1 = calculateStreak(consecutiveSessions);
assert(streakResult1.currentStreak === 3, `3 consecutive days yields streak 3 (multiple sessions on same day count once). Result: ${streakResult1.currentStreak}`);

// Test missed day (streak broken)
const brokenSessions = [
  mockSession(fourDaysAgo, 's1'),
  mockSession(twoDaysAgo, 's2'),
  // missing yesterday and today!
];
const streakResult2 = calculateStreak(brokenSessions);
assert(streakResult2.currentStreak === 0, `Missed yesterday and today results in 0 current streak. Result: ${streakResult2.currentStreak}`);

// 5. XP Award Rules
console.log('\n--- 5. XP Calculation Rules ---');
const xpIndependent = calculateSessionXP({
  revealedNotes: false,
  averageRating: 4.5,
  wordCount: 150,
  isDailyGoalMetNow: true,
});
assert(
  xpIndependent.total === 25 + 10 + 10 + 25,
  `Independent recall (4.5 rating + daily goal) awards ${xpIndependent.total} XP (expected 70 XP)`
);

const xpAssisted = calculateSessionXP({
  revealedNotes: true, // notes revealed
  averageRating: 3.5,
  wordCount: 80,
  isDailyGoalMetNow: false,
});
assert(
  xpAssisted.recallBonus === 0 && xpAssisted.ratingBonus === 5 && xpAssisted.total === 30,
  `Assisted recall forfeits recall bonus. Total = ${xpAssisted.total} XP (expected 30 XP)`
);

// 6. Spaced Repetition SM-2 Logic
console.log('\n--- 6. Spaced Repetition (SM-2) Interval Expansion ---');
const schedAgain = calculateNextReviewSchedule('test-topic', 'Again', 2.0);
assert(schedAgain.intervalDays === 1, `Again rating sets interval to 1 day`);

const schedGood1 = calculateNextReviewSchedule('test-topic', 'Good', 4.0);
assert(schedGood1.intervalDays === 3, `First Good rating sets interval to 3 days`);

const schedGood2 = calculateNextReviewSchedule('test-topic', 'Good', 4.0, schedGood1);
assert(schedGood2.intervalDays > schedGood1.intervalDays, `Second Good rating expands interval to ${schedGood2.intervalDays} days`);

assert(isReviewDue(today), `Today's date is due for review`);
assert(!isReviewDue(addDaysToDateString(today, 5)), `Future date in 5 days is not due today`);

// 7. Achievements Evaluation
console.log('\n--- 7. Achievements Dynamic Evaluator ---');
const achievements = evaluateAchievements(consecutiveSessions, 3);
const firstChallengeAch = achievements.find((a) => a.id === 'first_challenge');
assert(firstChallengeAch?.isUnlocked === true, `First challenge badge is unlocked`);

console.log('\n==============================================');
if (failedTests === 0) {
  console.log('🎉 ALL AUTOMATED VERIFICATION CHECKS PASSED!');
} else {
  console.error(`⚠️ ${failedTests} CHECKS FAILED.`);
}
console.log('==============================================');
