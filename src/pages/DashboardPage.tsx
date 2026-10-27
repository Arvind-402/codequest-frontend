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

  // Upcoming revisions from spaced repetition schedule (next 3)
  const upcomingRevisions = useMemo(() => {
    return Object.entries(revisionSchedule)
      .map(([topicId, schedule]) => {
        const topic = TOPICS.find((t) => t.id === topicId);
        return {
          topic,
          ...schedule,
          topicId,
          isDue: schedule.nextReviewDate <= todayStr,
        };
      })
      .sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate))
      .slice(0, 3);
  }, [revisionSchedule, todayStr]);

  // Category completion summary
  const subjectProgress = useMemo(() => {
    return CATEGORIES_LIST.map((cat) => {
      const catTopics = TOPICS.filter((t) => t.category === cat.id);
      const completedCount = catTopics.filter((t) => completedTopicIds.includes(t.id)).length;
      const totalCount = catTopics.length;
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(242,245,248,0.08)] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#03E29C] mb-1">
            <Calendar className="h-3.5 w-3.5 text-[#03E29C]" />
            <span>{formattedToday}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-sans font-medium text-white tracking-tight">
            Welcome back, <span className="text-[#03E29C] font-semibold">{profile.name}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8E959E] mt-1 font-mono">
            Targeting: <strong className="text-white font-sans font-normal">{profile.targetRole}</strong>
          </p>
        </div>

        {/* Start Today's Practice Hero CTA */}
        <div className="flex items-center gap-3">
          <Link
            to="/practice"
            className="flex items-center gap-2.5 rounded-full bg-[#03E29C] px-6 py-3 text-xs sm:text-sm font-semibold text-[#08090B] uppercase tracking-wider shadow-lg shadow-[#03E29C]/15 hover:bg-[#00FFAF] active:scale-95 transition-all"
          >
            <Compass className="h-4 w-4" />
            <span>Launch Roulette Arena</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* TOP 5 METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Current Streak */}
        <div className="rounded-2xl border border-[rgba(242,245,248,0.08)] bg-[#0F1115] p-4 flex flex-col justify-between hover:border-[#03E29C]/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#8E959E] font-mono">
            <span className="uppercase text-[10px] text-[#03E29C] font-bold">Current Streak</span>
            <Flame className={`h-4 w-4 ${currentStreak > 0 ? 'text-[#03E29C]' : 'text-white/20'}`} />
          </div>
          <div className="my-3">
            <div className="text-3xl font-sans font-semibold text-white tracking-tight">{currentStreak}</div>
            <span className="text-[11px] text-[#8E959E] font-mono">consecutive days</span>
          </div>
          <p className="text-[10px] text-[#555B64] font-mono">
            {todayCompletedCount >= dailyGoalCount ? 'Maintained today' : '1 session needed today'}
          </p>
        </div>

        {/* Longest Streak */}
        <div className="rounded-2xl border border-[rgba(242,245,248,0.08)] bg-[#0F1115] p-4 flex flex-col justify-between hover:border-[rgba(242,245,248,0.18)] transition-colors shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#8E959E] font-mono">
            <span className="uppercase text-[10px]">Longest Streak</span>
            <Trophy className="h-4 w-4 text-[#C89B58]" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-sans font-semibold text-white tracking-tight">{longestStreak}</div>
            <span className="text-[11px] text-[#8E959E] font-mono">days record</span>
          </div>
          <p className="text-[10px] text-[#555B64] font-mono">All-time personal record</p>
        </div>

        {/* Total XP & Level */}
        <div className="rounded-2xl border border-[rgba(242,245,248,0.08)] bg-[#0F1115] p-4 flex flex-col justify-between hover:border-[#03E29C]/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#8E959E] font-mono">
            <span className="uppercase text-[10px] text-[#03E29C]">Total XP</span>
            <Sparkles className="h-4 w-4 text-[#03E29C]" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-sans font-semibold text-white tracking-tight">{totalXP}</div>
            <span className="text-[11px] text-[#8E959E] font-mono">Lvl {levelInfo.level} &bull; {levelInfo.progressPercent}%</span>
          </div>
          <div className="w-full bg-[#16191F] h-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#03E29C]"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Topics Practiced */}
        <div className="rounded-2xl border border-[rgba(242,245,248,0.08)] bg-[#0F1115] p-4 flex flex-col justify-between hover:border-[rgba(242,245,248,0.18)] transition-colors shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#8E959E] font-mono">
            <span className="uppercase text-[10px]">Topics Mastered</span>
            <BookOpen className="h-4 w-4 text-[#03E29C]" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-sans font-semibold text-white tracking-tight">
              {completedTopicIds.length}
              <span className="text-sm text-[#555B64] font-normal"> / {TOPICS.length}</span>
            </div>
            <span className="text-[11px] text-[#8E959E] font-mono">
              {Math.round((completedTopicIds.length / TOPICS.length) * 100)}% syllabus coverage
            </span>
          </div>
          <p className="text-[10px] text-[#555B64] font-mono">{TOPICS.length - completedTopicIds.length} questions remaining</p>
        </div>

        {/* Weekly Activity */}
        <div className="rounded-2xl border border-[rgba(242,245,248,0.08)] bg-[#0F1115] p-4 flex flex-col justify-between hover:border-[rgba(242,245,248,0.18)] transition-colors shadow-sm col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-xs text-[#8E959E] font-mono">
            <span className="uppercase text-[10px] text-white">Weekly Activity</span>
            <CheckCircle2 className="h-4 w-4 text-[#03E29C]" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-sans font-semibold text-white tracking-tight">
              {last7Days.filter((d) => d.hasActivity).length}
              <span className="text-sm text-[#555B64] font-normal"> / 7</span>
            </div>
            <span className="text-[11px] text-[#8E959E] font-mono">days active</span>
          </div>
          <p className="text-[10px] text-[#555B64] font-mono">
            {sessions.filter((s) => s.completedAt >= last7Days[0].dateString).length} sessions this week
          </p>
        </div>
      </div>

      {/* 2 COLUMNS: DAILY GOAL & 7-DAY RHYTHM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Practice Goal */}
        <div className="lg:col-span-5 rounded-3xl border border-[rgba(242,245,248,0.08)] bg-[#0F1115] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Target className="h-4 w-4 text-[#03E29C]" />
                Daily Target
              </span>
              <span className="rounded-full bg-[#03E29C]/10 border border-[#03E29C]/25 px-3 py-0.5 text-xs font-mono text-[#03E29C]">
                {todayCompletedCount} / {dailyGoalCount} Complete
              </span>
            </div>

            <h3 className="text-xl font-sans font-medium text-white mb-2">
              {isDailyGoalMet ? 'Target Accomplished Today!' : 'Complete Today\'s Technical Session'}
            </h3>
            <p className="text-xs text-[#8E959E] leading-relaxed font-light">
              {isDailyGoalMet
                ? 'Excellent discipline. You claimed +25 bonus XP and secured your streak.'
                : 'Complete at least 1 interview challenge today to preserve your streak and earn +25 bonus XP.'}
            </p>

            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-xs font-mono text-[#8E959E]">
                <span>Target Progress</span>
                <span>{Math.min(100, Math.round((todayCompletedCount / dailyGoalCount) * 100))}%</span>
              </div>
              <div className="h-2 w-full bg-[#16191F] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    isDailyGoalMet ? 'bg-[#03E29C]' : 'bg-gradient-to-r from-[#03E29C] to-[#C89B58]'
                  }`}
                  style={{
                    width: `${Math.min(100, (todayCompletedCount / dailyGoalCount) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[rgba(242,245,248,0.08)] flex items-center justify-between">
            <span className="text-[11px] text-[#555B64] font-mono">Streak reset at midnight</span>
            <Link
              to="/practice"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#03E29C] hover:text-[#00FFAF] uppercase tracking-wide font-mono transition-colors"
            >
              <span>Launch Arena</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* 7-Day Activity Rhythm */}
        <div className="lg:col-span-7 rounded-3xl border border-[rgba(242,245,248,0.08)] bg-[#0F1115] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#03E29C]" />
                7-Day Activity Rhythm
              </span>
              <span className="text-[11px] text-[#555B64] font-mono">Verified from completed sessions</span>
            </div>

            <p className="text-xs text-[#8E959E] mb-6 font-light">
              Consecutive days build your streak. Active markers signify days where you completed at least one challenge.
            </p>

            {/* 7-Day Dots Grid */}
            <div className="grid grid-cols-7 gap-2">
              {last7Days.map((day) => (
                <div
                  key={day.dateString}
                  className={`rounded-2xl border p-3 flex flex-col items-center justify-between min-h-[92px] transition-all ${
                    day.isToday
                      ? 'border-[#03E29C] bg-[#03E29C]/10 shadow-[0_0_16px_rgba(3,226,156,0.15)]'
                      : day.hasActivity
                      ? 'border-[rgba(242,245,248,0.18)] bg-[#16191F]'
                      : 'border-[rgba(242,245,248,0.06)] bg-[#0B0D11]'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold text-[#8E959E] uppercase">
                    {day.dayShort}
                  </span>
                  <span className="text-base font-sans font-medium text-white">
                    {day.dayNumber}
                  </span>
                  <div className="h-5 flex items-center justify-center">
                    {day.hasActivity ? (
                      <CheckCircle2 className="h-4 w-4 text-[#03E29C]" />
                    ) : day.isToday ? (
                      <span className="text-[9px] font-mono font-bold text-[#03E29C] uppercase">Today</span>
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[rgba(242,245,248,0.08)] flex items-center justify-between text-[11px] text-[#555B64] font-mono">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#03E29C]" />
              <span>Session Done</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#03E29C]/50" />
              <span>Today</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white/10" />
              <span>Rest / Pending</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2 COLUMNS: SUBJECT PROGRESS & RECENT/UPCOMING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Subject Progress Grid */}
        <div className="lg:col-span-7 rounded-3xl border border-[rgba(242,245,248,0.08)] bg-[#0F1115] p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[rgba(242,245,248,0.08)] pb-3">
            <div>
              <h3 className="text-base font-sans font-medium text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#03E29C]" />
                Curriculum Progress by Subject
              </h3>
              <p className="text-xs text-[#8E959E] mt-0.5 font-light">
                Tracks syllabus coverage across all 9 technical domains
              </p>
            </div>
            <Link to="/topics" className="text-xs font-mono text-[#03E29C] hover:text-white uppercase tracking-wider transition-colors">
              View Syllabus
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subjectProgress.map((sub) => (
              <div
                key={sub.id}
                className="rounded-2xl border border-[rgba(242,245,248,0.08)] bg-[#0B0D11] p-3.5 space-y-2 hover:border-[#03E29C]/40 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-sans font-medium text-white truncate">{sub.label}</span>
                  <span className="font-mono text-[#8E959E] text-[11px]">
                    {sub.completedCount}/{sub.totalCount}
                  </span>
                </div>

                <div className="h-1.5 w-full bg-[#16191F] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#03E29C] rounded-full transition-all duration-500"
                    style={{ width: `${sub.percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#555B64] font-mono">
                  <span>{sub.percent}% mastered</span>
                  <span>{sub.totalCount - sub.completedCount} remaining</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Learning & Upcoming Revisions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upcoming Revisions Queue */}
          <div className="rounded-3xl border border-[rgba(242,245,248,0.08)] bg-[#0F1115] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[rgba(242,245,248,0.08)] pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-white flex items-center gap-1.5">
                <RotateCcw className="h-4 w-4 text-[#03E29C]" />
                Spaced Revision Queue
              </span>
              <Link to="/revision" className="text-xs font-mono text-[#03E29C] hover:text-white uppercase tracking-wider transition-colors">
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
                        ? 'border-[#03E29C]/40 bg-[#03E29C]/10'
                        : 'border-[rgba(242,245,248,0.08)] bg-[#0B0D11]'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="rounded bg-[#16191F] px-1.5 py-0.5 text-[10px] font-mono text-[#03E29C] border border-[rgba(242,245,248,0.08)]">
                          {rev.topic?.category}
                        </span>
                        {rev.isDue && (
                          <span className="text-[10px] font-mono font-bold text-[#03E29C] uppercase">
                            Due Today
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-sans font-medium text-white truncate">{rev.topic?.title}</h4>
                      <span className="text-[10px] text-[#8E959E] font-mono">
                        Next: {formatDisplayDate(rev.nextReviewDate)}
                      </span>
                    </div>

                    <button
                      onClick={() => navigate(`/practice/session/${rev.topicId}`)}
                      className="shrink-0 rounded-xl bg-[#03E29C] px-3 py-1.5 text-xs font-semibold text-[#08090B] hover:bg-[#00FFAF] transition-colors font-mono"
                    >
                      Revise
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-[#555B64] text-xs font-mono">
                No revisions due. Complete practice sessions to populate your SM-2 spaced repetition queue.
              </div>
            )}
          </div>

          {/* Recently Attempted Sessions */}
          <div className="rounded-3xl border border-[rgba(242,245,248,0.08)] bg-[#0F1115] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[rgba(242,245,248,0.08)] pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#8E959E] flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#03E29C]" />
                Recently Practiced
              </span>
              <Link to="/progress" className="text-xs font-mono text-[#03E29C] hover:text-white uppercase tracking-wider transition-colors">
                Full Log
              </Link>
            </div>

            {recentSessions.length > 0 ? (
              <div className="space-y-2.5">
                {recentSessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="rounded-2xl border border-[rgba(242,245,248,0.08)] bg-[#0B0D11] p-3 flex items-center justify-between hover:border-[rgba(242,245,248,0.18)] transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <h4 className="text-xs font-sans font-medium text-white truncate">{sess.topicTitle}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-[#8E959E] mt-0.5 font-mono">
                        <span>{getRelativeTime(sess.completedAt)}</span>
                        <span>&bull;</span>
                        <span className="text-[#03E29C] font-bold flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-[#03E29C] text-[#03E29C]" />
                          {sess.averageRating}
                        </span>
                        <span>&bull;</span>
                        <span className="text-white/70">+{sess.xpEarned} XP</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/practice/session/${sess.topicId}`)}
                      className="shrink-0 text-[#8E959E] hover:text-white p-1"
                      title="Practice again"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-[#555B64] text-xs font-mono">
                No sessions recorded yet. Launch the Spin Arena to record your first session!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
