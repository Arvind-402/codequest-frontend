import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Flame,
  Sparkles,
  Target,
  Trophy,
  Compass,
  ArrowRight,
  RotateCcw,
  Clock,
  Star,
  CheckCircle2,
  Calendar,
  BarChart3,
  BookOpen,
} from 'lucide-react';
import { useCodeQuest } from '../context/CodeQuestContext';
import { TOPICS, CATEGORIES_LIST } from '../data/topics';
import { getLast7Days, formatDisplayDate, getRelativeTime, getTodayDateString } from '../utils/date';
import { getLevelProgress } from '../utils/xp';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    profile,
    sessions,
    currentStreak,
    longestStreak,
    totalXP,
    todayCompletedCount,
    dailyGoalCount,
    isDailyGoalMet,
    revisionSchedule,
  } = useCodeQuest();

  const levelInfo = getLevelProgress(totalXP);
  const todayStr = getTodayDateString();

  // 7-day activity derived directly from true completed sessions
  const last7Days = useMemo(() => {
    return getLast7Days(sessions);
  }, [sessions]);

  // Unique completed topics count
  const completedTopicIds = useMemo(() => {
    return Array.from(new Set(sessions.map((s) => s.topicId)));
  }, [sessions]);

  // Recently attempted sessions (most recent 4)
  const recentSessions = useMemo(() => {
    return [...sessions]
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 4);
  }, [sessions]);

  // Upcoming revisions (scheduled items)
  const upcomingRevisions = useMemo(() => {
    return Object.values(revisionSchedule)
      .map((sched) => {
        const topic = TOPICS.find((t) => t.id === sched.topicId);
        return {
          ...sched,
          topic,
          isDue: sched.nextReviewDate <= todayStr,
        };
      })
      .filter((item) => item.topic)
      .sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate))
      .slice(0, 4);
  }, [revisionSchedule, todayStr]);

  // Subject-wise progress across all 9 categories
  const subjectProgress = useMemo(() => {
    return CATEGORIES_LIST.map((cat) => {
      const categoryTopics = TOPICS.filter((t) => t.category === cat.id);
      const totalCount = categoryTopics.length;
      const completedCount = categoryTopics.filter((t) =>
        completedTopicIds.includes(t.id)
      ).length;
      const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      return {
        id: cat.id,
        label: cat.label,
        totalCount,
        completedCount,
        percent,
      };
    });
  }, [completedTopicIds]);

  const formattedToday = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-8 pb-16">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d9dadf]/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#adaca7] mb-1">
            <Calendar className="h-3.5 w-3.5 text-[#dd700b]" />
            <span>{formattedToday}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#fcf8d8] tracking-tight uppercase">
            Welcome back, <span className="text-[#dd700b]">{profile.name}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#adaca7] mt-1 font-mono">
            Targeting: <strong className="text-[#d9dadf] font-sans">{profile.targetRole}</strong>
          </p>
        </div>

        {/* Start Today's Practice Hero CTA */}
        <div className="flex items-center gap-3">
          <Link
            to="/practice"
            className="flex items-center gap-2.5 rounded-full bg-[#dd700b] px-6 py-3 text-xs sm:text-sm font-bold text-[#fcf8d8] uppercase tracking-wider shadow-[0_0_24px_rgba(221,112,11,0.35)] hover:bg-[#b85806] hover:shadow-[0_0_30px_rgba(221,112,11,0.5)] active:scale-95 transition-all"
          >
            <Compass className="h-4 w-4" />
            <span>Start Today's Practice</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* TOP 5 METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Current Streak */}
        <div className="rounded-2xl border border-[#d9dadf]/15 bg-[#181a1d] p-4 flex flex-col justify-between hover:border-[#dd700b]/50 transition-colors shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#adaca7] font-mono">
            <span className="uppercase text-[11px] text-[#dd700b] font-bold">Current Streak</span>
            <Flame className={`h-4 w-4 ${currentStreak > 0 ? 'text-[#dd700b]' : 'text-[#7c7d75]'}`} />
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-[#fcf8d8] font-mono">{currentStreak}</div>
            <span className="text-[11px] text-[#adaca7] font-mono">days</span>
          </div>
          <p className="text-[10px] text-[#7c7d75] font-mono">
            {todayCompletedCount >= dailyGoalCount ? 'Maintained today' : 'Needs 1 session today'}
          </p>
        </div>

        {/* Longest Streak */}
        <div className="rounded-2xl border border-[#d9dadf]/15 bg-[#181a1d] p-4 flex flex-col justify-between hover:border-[#d9dadf]/30 transition-colors shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#adaca7] font-mono">
            <span className="uppercase text-[11px]">Longest Streak</span>
            <Trophy className="h-4 w-4 text-[#fcf8d8]" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-[#fcf8d8] font-mono">{longestStreak}</div>
            <span className="text-[11px] text-[#adaca7] font-mono">days</span>
          </div>
          <p className="text-[10px] text-[#7c7d75] font-mono">All-time personal record</p>
        </div>

        {/* Total XP & Level */}
        <div className="rounded-2xl border border-[#d9dadf]/15 bg-[#181a1d] p-4 flex flex-col justify-between hover:border-[#d9dadf]/30 transition-colors shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#adaca7] font-mono">
            <span className="uppercase text-[11px] text-[#d9dadf]">Total XP</span>
            <Sparkles className="h-4 w-4 text-[#dd700b]" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-[#fcf8d8] font-mono">{totalXP}</div>
            <span className="text-[11px] text-[#adaca7] font-mono">Level {levelInfo.level} &bull; {levelInfo.progressPercent}%</span>
          </div>
          <div className="w-full bg-[#2a2c30] h-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#dd700b] to-[#d9dadf]"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Topics Practiced */}
        <div className="rounded-2xl border border-[#d9dadf]/15 bg-[#181a1d] p-4 flex flex-col justify-between hover:border-[#d9dadf]/30 transition-colors shadow-lg">
          <div className="flex items-center justify-between text-xs text-[#adaca7] font-mono">
            <span className="uppercase text-[11px] text-[#d9dadf]">Topics Practiced</span>
            <BookOpen className="h-4 w-4 text-[#d9dadf]" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-[#fcf8d8] font-mono">
              {completedTopicIds.length}
              <span className="text-sm text-[#7c7d75]"> / {TOPICS.length}</span>
            </div>
            <span className="text-[11px] text-[#adaca7] font-mono">
              {Math.round((completedTopicIds.length / TOPICS.length) * 100)}% syllabus coverage
            </span>
          </div>
          <p className="text-[10px] text-[#7c7d75] font-mono">{TOPICS.length - completedTopicIds.length} questions untouched</p>
        </div>

        {/* Weekly Activity */}
        <div className="rounded-2xl border border-[#d9dadf]/15 bg-[#181a1d] p-4 flex flex-col justify-between hover:border-[#fcf8d8]/30 transition-colors shadow-lg col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-xs text-[#adaca7] font-mono">
            <span className="uppercase text-[11px] text-[#fcf8d8]">Weekly Activity</span>
            <CheckCircle2 className="h-4 w-4 text-[#dd700b]" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-[#fcf8d8] font-mono">
              {last7Days.filter((d) => d.hasActivity).length}
              <span className="text-sm text-[#7c7d75]"> / 7</span>
            </div>
            <span className="text-[11px] text-[#adaca7] font-mono">days active</span>
          </div>
          <p className="text-[10px] text-[#7c7d75] font-mono">
            {sessions.filter((s) => s.completedAt >= last7Days[0].dateString).length} total sessions this week
          </p>
        </div>
      </div>

      {/* 2 COLUMNS: DAILY GOAL & 7-DAY RHYTHM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Practice Goal (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-[#d9dadf]/15 bg-[#181a1d] p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#d9dadf] flex items-center gap-2">
                <Target className="h-4 w-4 text-[#dd700b]" />
                Daily Practice Goal
              </span>
              <span className="rounded-full bg-[#d9dadf]/10 border border-[#d9dadf]/20 px-2.5 py-0.5 text-xs font-mono font-bold text-[#fcf8d8]">
                {todayCompletedCount} / {dailyGoalCount} Completed
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#fcf8d8] mb-2">
              {isDailyGoalMet ? 'Target Accomplished Today!' : 'Complete Today\'s Technical Session'}
            </h3>
            <p className="text-xs text-[#adaca7] leading-relaxed font-normal">
              {isDailyGoalMet
                ? 'Great consistency. You earned +25 bonus XP and secured your streak.'
                : 'Complete at least 1 interview challenge today to maintain your streak and claim +25 bonus XP.'}
            </p>

            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-xs font-mono text-[#adaca7]">
                <span>Session Target Progress</span>
                <span>{Math.min(100, Math.round((todayCompletedCount / dailyGoalCount) * 100))}%</span>
              </div>
              <div className="h-2 w-full bg-[#2a2c30] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    isDailyGoalMet
                      ? 'bg-[#fcf8d8] shadow-[0_0_12px_rgba(252,248,216,0.5)]'
                      : 'bg-gradient-to-r from-[#dd700b] to-[#fcf8d8]'
                  }`}
                  style={{
                    width: `${Math.min(100, (todayCompletedCount / dailyGoalCount) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[#d9dadf]/10 flex items-center justify-between">
            <span className="text-[11px] text-[#7c7d75] font-mono">Streak reset at midnight</span>
            <Link
              to="/practice"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#dd700b] hover:underline uppercase tracking-wide font-mono"
            >
              <span>Launch Arena</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* 7-Day Activity Rhythm (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-[#d9dadf]/15 bg-[#181a1d] p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#d9dadf] flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#d9dadf]" />
                7-Day Activity Rhythm
              </span>
              <span className="text-[11px] text-[#7c7d75] font-mono">Calculated from completed sessions</span>
            </div>

            <p className="text-xs text-[#adaca7] mb-6 font-normal">
              Consecutive days build your streak. Active markers indicate days where you completed at least one challenge.
            </p>

            {/* 7-Day Dots Grid */}
            <div className="grid grid-cols-7 gap-2">
              {last7Days.map((day) => (
                <div
                  key={day.dateString}
                  className={`rounded-2xl border p-3 flex flex-col items-center justify-between min-h-[92px] transition-all ${
                    day.isToday
                      ? 'border-[#dd700b]/60 bg-[#dd700b]/15 shadow-[0_0_16px_rgba(221,112,11,0.2)]'
                      : day.hasActivity
                      ? 'border-[#d9dadf]/40 bg-[#d9dadf]/10'
                      : 'border-[#d9dadf]/10 bg-[#121316]'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold text-[#adaca7] uppercase">
                    {day.dayShort}
                  </span>
                  <span className="text-base font-mono font-bold text-[#fcf8d8]">
                    {day.dayNumber}
                  </span>
                  <div className="h-5 flex items-center justify-center">
                    {day.hasActivity ? (
                      <CheckCircle2 className="h-4 w-4 text-[#fcf8d8]" />
                    ) : day.isToday ? (
                      <span className="text-[9px] font-mono font-bold text-[#dd700b] uppercase">Today</span>
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#7c7d75]/40" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[#d9dadf]/10 flex items-center justify-between text-[11px] text-[#adaca7] font-mono">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#fcf8d8]" />
              <span>Session Done</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#dd700b]" />
              <span>Today (In Progress)</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#7c7d75]/40" />
              <span>Rest / Missed</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2 COLUMNS: SUBJECT PROGRESS & RECENT/UPCOMING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Subject Progress Grid (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-[#d9dadf]/15 bg-[#181a1d] p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-[#d9dadf]/10 pb-3">
            <div>
              <h3 className="text-base font-bold text-[#fcf8d8] flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#dd700b]" />
                Curriculum Progress by Subject
              </h3>
              <p className="text-xs text-[#adaca7] mt-0.5 font-normal">
                Tracks attempted and completed syllabus topics across all 9 domains
              </p>
            </div>
            <Link to="/topics" className="text-xs font-mono text-[#d9dadf] hover:text-[#fcf8d8] uppercase tracking-wider">
              View Syllabus
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subjectProgress.map((sub) => (
              <div
                key={sub.id}
                className="rounded-2xl border border-[#d9dadf]/10 bg-[#121316] p-3.5 space-y-2 hover:border-[#dd700b]/30 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#d9dadf] truncate">{sub.label}</span>
                  <span className="font-mono text-[#adaca7] text-[11px]">
                    {sub.completedCount}/{sub.totalCount}
                  </span>
                </div>

                <div className="h-1.5 w-full bg-[#2a2c30] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#dd700b] to-[#d9dadf] rounded-full transition-all duration-500"
                    style={{ width: `${sub.percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#7c7d75] font-mono">
                  <span>{sub.percent}% mastered</span>
                  <span>{sub.totalCount - sub.completedCount} remaining</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Learning & Upcoming Revisions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upcoming Revisions Queue */}
          <div className="rounded-3xl border border-[#d9dadf]/15 bg-[#181a1d] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#d9dadf]/10 pb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#d9dadf] flex items-center gap-1.5">
                <RotateCcw className="h-4 w-4 text-[#dd700b]" />
                Spaced Revision Queue
              </span>
              <Link to="/revision" className="text-xs font-mono text-[#d9dadf] hover:text-[#fcf8d8] uppercase tracking-wider">
                Full Queue
              </Link>
            </div>

            {upcomingRevisions.length > 0 ? (
              <div className="space-y-2.5">
                {upcomingRevisions.map((rev) => (
                  <div
                    key={rev.topicId}
                    className={`rounded-2xl border p-3 flex items-center justify-between transition-all ${
                      rev.isDue
                        ? 'border-[#dd700b]/40 bg-[#dd700b]/10'
                        : 'border-[#d9dadf]/10 bg-[#121316]'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="rounded bg-[#2a2c30] px-1.5 py-0.5 text-[10px] font-mono text-[#fcf8d8]">
                          {rev.topic?.category}
                        </span>
                        {rev.isDue && (
                          <span className="text-[10px] font-mono font-bold text-[#dd700b] uppercase">
                            Due Today
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-[#fcf8d8] truncate">{rev.topic?.title}</h4>
                      <span className="text-[10px] text-[#adaca7] font-mono">
                        Next: {formatDisplayDate(rev.nextReviewDate)}
                      </span>
                    </div>

                    <button
                      onClick={() => navigate(`/practice/session/${rev.topicId}`)}
                      className="shrink-0 rounded-xl bg-[#dd700b]/20 px-3 py-1.5 text-xs font-bold text-[#fcf8d8] border border-[#dd700b]/30 hover:bg-[#dd700b]/30 transition-colors font-mono"
                    >
                      Revise
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-[#7c7d75] text-xs font-mono">
                No revisions scheduled yet. Complete practice sessions to populate your SM-2 spaced repetition queue.
              </div>
            )}
          </div>

          {/* Recently Attempted Sessions */}
          <div className="rounded-3xl border border-[#d9dadf]/15 bg-[#181a1d] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#d9dadf]/10 pb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#adaca7] flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#dd700b]" />
                Recently Practiced
              </span>
              <Link to="/progress" className="text-xs font-mono text-[#d9dadf] hover:text-[#fcf8d8] uppercase tracking-wider">
                Full Log
              </Link>
            </div>

            {recentSessions.length > 0 ? (
              <div className="space-y-2.5">
                {recentSessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="rounded-2xl border border-[#d9dadf]/10 bg-[#121316] p-3 flex items-center justify-between hover:border-[#d9dadf]/25 transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <h4 className="text-xs font-bold text-[#fcf8d8] truncate">{sess.topicTitle}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-[#adaca7] mt-0.5 font-mono">
                        <span>{getRelativeTime(sess.completedAt)}</span>
                        <span>&bull;</span>
                        <span className="text-[#dd700b] font-bold flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-[#dd700b]" />
                          {sess.averageRating}
                        </span>
                        <span>&bull;</span>
                        <span className="text-[#d9dadf]">+{sess.xpEarned} XP</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/practice/session/${sess.topicId}`)}
                      className="shrink-0 text-[#adaca7] hover:text-[#fcf8d8] p-1"
                      title="Practice again"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-[#7c7d75] text-xs font-mono">
                No practice sessions recorded yet. Hit the Spin Arena to get started!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
