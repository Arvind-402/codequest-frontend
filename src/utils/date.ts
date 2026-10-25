import type { PracticeSession } from '../types/session';

/**
 * Returns today's date formatted as YYYY-MM-DD in local system time.
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Adds N days to a YYYY-MM-DD string and returns the new date string.
 */
export function addDaysToDateString(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Formats a date string (YYYY-MM-DD or ISO) into human-readable text.
 * e.g., "Oct 25, 2026"
 */
export function formatDisplayDate(dateInput: string | Date | undefined): string {
  if (!dateInput) return 'Never';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) {
    // If it's pure YYYY-MM-DD, parse manually
    if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      const [y, m, d] = dateInput.split('-').map(Number);
      const parsed = new Date(y, m - 1, d);
      return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return 'Invalid Date';
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Relative time description e.g. "Just now", "2 hours ago", "Yesterday", "3 days ago"
 */
export function getRelativeTime(isoString: string): string {
  if (!isoString) return 'Never';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDisplayDate(isoString);
}

/**
 * Accurate streak calculation based on actual completed sessions.
 * Multiple sessions on the same date count as 1 active day.
 * Returns current streak and longest streak.
 */
export function calculateStreak(sessions: PracticeSession[]): { currentStreak: number; longestStreak: number } {
  if (!sessions || sessions.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Extract unique active calendar dates sorted ascending
  const uniqueDates = Array.from(new Set(sessions.map((s) => s.dateString || s.completedAt.split('T')[0]))).sort();

  if (uniqueDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const today = getTodayDateString();
  const yesterday = addDaysToDateString(today, -1);

  // Compute longest streak across all history
  let longest = 0;
  let running = 0;
  let prevDateStr: string | null = null;

  for (const dateStr of uniqueDates) {
    if (!prevDateStr) {
      running = 1;
    } else {
      const expectedNext = addDaysToDateString(prevDateStr, 1);
      if (dateStr === expectedNext) {
        running++;
      } else {
        running = 1;
      }
    }
    prevDateStr = dateStr;
    if (running > longest) {
      longest = running;
    }
  }

  // Compute current streak from the tail
  const hasCompletedToday = uniqueDates.includes(today);
  const hasCompletedYesterday = uniqueDates.includes(yesterday);

  if (!hasCompletedToday && !hasCompletedYesterday) {
    // Streak broken
    return { currentStreak: 0, longestStreak: longest };
  }

  // Backtrack from the most recent active date (either today or yesterday)
  let current = 0;
  let checkDate = hasCompletedToday ? today : yesterday;

  while (uniqueDates.includes(checkDate)) {
    current++;
    checkDate = addDaysToDateString(checkDate, -1);
  }

  return {
    currentStreak: current,
    longestStreak: Math.max(longest, current),
  };
}

export interface DayActivityInfo {
  dateString: string;
  dayShort: string; // "Mon", "Tue"
  dayNumber: number;
  isToday: boolean;
  hasActivity: boolean;
  sessionCount: number;
  xpEarned: number;
}

/**
 * Generates an array of the last 7 calendar days ending on today.
 */
export function getLast7Days(sessions: PracticeSession[]): DayActivityInfo[] {
  const today = getTodayDateString();
  const result: DayActivityInfo[] = [];

  // Map sessions by dateString
  const sessionMap = new Map<string, { count: number; xp: number }>();
  for (const s of sessions) {
    const d = s.dateString || s.completedAt.split('T')[0];
    const prev = sessionMap.get(d) || { count: 0, xp: 0 };
    sessionMap.set(d, {
      count: prev.count + 1,
      xp: prev.xp + s.xpEarned,
    });
  }

  for (let i = 6; i >= 0; i--) {
    const dStr = addDaysToDateString(today, -i);
    const [y, m, d] = dStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dayShort = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = dateObj.getDate();
    const act = sessionMap.get(dStr);

    result.push({
      dateString: dStr,
      dayShort,
      dayNumber,
      isToday: dStr === today,
      hasActivity: Boolean(act && act.count > 0),
      sessionCount: act?.count || 0,
      xpEarned: act?.xp || 0,
    });
  }

  return result;
}
