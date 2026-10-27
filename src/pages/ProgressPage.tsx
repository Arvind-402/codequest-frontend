import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Clock,
  Star,
  Award,
  Calendar,
  TrendingUp,
  Brain,
  Compass,
} from 'lucide-react';
import { useCodeQuest } from '../context/CodeQuestContext';
import { TOPICS, CATEGORIES_LIST } from '../data/topics';
import { getLast7Days, formatDisplayDate } from '../utils/date';

export const ProgressPage: React.FC = () => {
  const { sessions, getTopicStatus } = useCodeQuest();
  const last7Days = useMemo(() => getLast7Days(sessions), [sessions]);

  // Total study time across all sessions in minutes & hours
  const totalSeconds = useMemo(() => {
    return sessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
  }, [sessions]);

  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMins = Math.floor((totalSeconds % 3600) / 60);

  // Criteria average ratings
  const criteriaAverages = useMemo(() => {
    if (sessions.length === 0) {
      return { correctness: 0, completeness: 0, clarity: 0, examples: 0, overall: 0 };
    }
    const sums = sessions.reduce(
      (acc, s) => {
        acc.correctness += s.ratingCriteria.correctness;
        acc.completeness += s.ratingCriteria.completeness;
        acc.clarity += s.ratingCriteria.clarity;
        acc.examples += s.ratingCriteria.examples;
        acc.overall += s.averageRating;
        return acc;
      },
      { correctness: 0, completeness: 0, clarity: 0, examples: 0, overall: 0 }
    );
    const count = sessions.length;
    return {
      correctness: Number((sums.correctness / count).toFixed(1)),
      completeness: Number((sums.completeness / count).toFixed(1)),
      clarity: Number((sums.clarity / count).toFixed(1)),
      examples: Number((sums.examples / count).toFixed(1)),
      overall: Number((sums.overall / count).toFixed(1)),
    };
  }, [sessions]);

  // Topic Status Distribution Breakdown
  const statusBreakdown = useMemo(() => {
    const counts = {
      not_started: 0,
      attempted: 0,
      needs_revision: 0,
      practiced_repeatedly: 0,
      strong: 0,
    };
    for (const t of TOPICS) {
      const st = getTopicStatus(t.id);
      counts[st]++;
    }
    return counts;
  }, [getTopicStatus]);

  // Subject performance calculation (attempts, avg rating, completed topics)
  const subjectPerformance = useMemo(() => {
    return CATEGORIES_LIST.map((cat) => {
      const catSessions = sessions.filter(
        (s) => s.category === cat.id || (cat.id === 'OOPS' && s.category === 'PROGRAMMING')
      );
      const totalAttemptCount = catSessions.length;
      const avgScore =
        totalAttemptCount > 0
          ? Number(
              (
                catSessions.reduce((acc, s) => acc + s.averageRating, 0) /
                totalAttemptCount
              ).toFixed(1)
            )
          : 0;

      const uniqueAttemptedTopics = new Set(catSessions.map((s) => s.topicId)).size;
      const totalTopicsInCat = cat.count;

      return {
        id: cat.id,
        label: cat.label,
        totalTopicsInCat,
        uniqueAttemptedTopics,
        totalAttemptCount,
        avgScore,
        percentCovered:
          totalTopicsInCat > 0
            ? Math.round((uniqueAttemptedTopics / totalTopicsInCat) * 100)
            : 0,
      };
    });
  }, [sessions]);

  // Identify strongest and weakest subjects (among attempted)
  const attemptedSubjects = subjectPerformance.filter((s) => s.totalAttemptCount > 0);
  const strongestSubject =
    attemptedSubjects.length > 0
      ? [...attemptedSubjects].sort((a, b) => b.avgScore - a.avgScore)[0]
      : null;
  const weakestSubject =
    attemptedSubjects.length > 0
      ? [...attemptedSubjects].sort((a, b) => a.avgScore - b.avgScore)[0]
      : null;

  // Max daily session count for chart scaling
  const maxDayCount = Math.max(...last7Days.map((d) => d.sessionCount), 3);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#16191F] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#03E29C]/20 text-[#03E29C] border border-[#03E29C]/30">
              <BarChart3 className="h-6 w-6" />
            </span>
            Progress & Performance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your interview explanation quality, subject mastery, study time, and recall history.
          </p>
        </div>

        <Link
          to="/practice"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#03E29C] to-[#03E29C] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#03E29C]/25 hover:brightness-110 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Compass className="h-4 w-4" />
          <span>Practice Arena</span>
        </Link>
      </div>

      {/* TOP ANALYTICS HIGHLIGHT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Study Time */}
        <div className="rounded-2xl border border-[#16191F] bg-[#0c1020] p-5 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Practice Time</span>
            <Clock className="h-4 w-4 text-[#03E29C]" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono flex items-baseline gap-1">
              {totalHours}h {totalMins}m
            </div>
            <p className="text-[11px] text-slate-400 mt-1">{sessions.length} recorded challenges</p>
          </div>
        </div>

        {/* Average Self-Score */}
        <div className="rounded-2xl border border-[#16191F] bg-[#0c1020] p-5 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Average Self-Score</span>
            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono flex items-baseline gap-1">
              {criteriaAverages.overall}
              <span className="text-xs text-slate-500 font-normal font-sans">/ 5.0</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Evaluated across 4 rubric dimensions</p>
          </div>
        </div>

        {/* Strongest Subject */}
        <div className="rounded-2xl border border-[#16191F] bg-[#0c1020] p-5 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Strongest Domain</span>
            <Award className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-emerald-300 truncate">
              {strongestSubject ? strongestSubject.label : 'None yet'}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {strongestSubject ? `Avg ${strongestSubject.avgScore}/5.0 score` : 'Complete more sessions'}
            </p>
          </div>
        </div>

        {/* Needs Work Subject */}
        <div className="rounded-2xl border border-[#16191F] bg-[#0c1020] p-5 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Focus Area</span>
            <TrendingUp className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-amber-300 truncate">
              {weakestSubject && weakestSubject.id !== strongestSubject?.id ? weakestSubject.label : 'Balanced'}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {weakestSubject ? `Avg ${weakestSubject.avgScore}/5.0 rating` : 'Great cross-domain balance'}
            </p>
          </div>
        </div>
      </div>

      {/* 2 COLUMNS: 7-DAY BAR CHART & CRITERIA RADAR BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* 7-Day Activity Visual Bar Chart (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-[#16191F] bg-[#0c1020] p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#03E29C]" />
                7-Day Practice Volume & Activity
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {sessions.length} sessions total
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive activity breakdown by day showing completed sessions and XP gained.
            </p>
          </div>

          {/* SVG/CSS Custom Bar Chart */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-[#1b223d] px-2">
            {last7Days.map((day) => {
              const heightPercent = Math.max(8, Math.round((day.sessionCount / maxDayCount) * 100));
              return (
                <div key={day.dateString} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  {/* Tooltip on bar hover */}
                  <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.sessionCount > 0 ? `${day.sessionCount} sess` : '0'}
                  </div>

                  {/* Bar Fill */}
                  <div
                    className={`w-full max-w-[36px] rounded-t-xl transition-all duration-500 ${
                      day.hasActivity
                        ? 'bg-gradient-to-t from-[#03E29C] via-[#03E29C] to-cyan-400 shadow-sm shadow-[#03E29C]/30'
                        : 'bg-[#151c33]'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />

                  {/* Day Label */}
                  <span className={`text-[11px] font-bold mt-1 ${day.isToday ? 'text-[#03E29C]' : 'text-slate-400'}`}>
                    {day.dayShort}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Past 7 days</span>
            <span className="text-emerald-400 font-semibold">
              {last7Days.reduce((acc, d) => acc + d.xpEarned, 0)} XP gained this week
            </span>
          </div>
        </div>

        {/* 4 Rubric Evaluation Criteria Breakdown (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-[#16191F] bg-[#0c1020] p-6 shadow-xl flex flex-col justify-between space-y-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Brain className="h-4 w-4 text-cyan-400" />
              Interview Rubric Performance
            </h3>
            <p className="text-xs text-slate-400">
              Average ratings across 4 core software engineering communication dimensions.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Technical Correctness', val: criteriaAverages.correctness, color: 'from-[#03E29C] to-[#03E29C]' },
              { label: 'Completeness & Depth', val: criteriaAverages.completeness, color: 'from-cyan-500 to-blue-500' },
              { label: 'Communication Clarity', val: criteriaAverages.clarity, color: 'from-emerald-500 to-teal-500' },
              { label: 'Practical Examples', val: criteriaAverages.examples, color: 'from-amber-500 to-orange-500' },
            ].map((c) => (
              <div key={c.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">{c.label}</span>
                  <span className="font-mono font-bold text-slate-100">{c.val} / 5.0</span>
                </div>
                <div className="h-2 w-full bg-[#151c33] rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${c.color} rounded-full transition-all duration-500`}
                    style={{ width: `${(c.val / 5.0) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#18203c] text-[11px] text-slate-500">
            * Scores reflect your self-assessment after completing independent recall challenges.
          </div>
        </div>
      </div>

      {/* TOPIC STATUS DISTRIBUTION */}
      <div className="rounded-3xl border border-[#16191F] bg-[#0c1020] p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white">
          Syllabus Topic Status Distribution ({TOPICS.length} Total)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/15 p-4 text-center">
            <span className="text-[10px] font-bold uppercase text-emerald-400 block">Self-Assessed Strong</span>
            <span className="text-2xl font-black text-white font-mono mt-1 block">{statusBreakdown.strong}</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Avg ≥ 4.0 (2+ attempts)</span>
          </div>

          <div className="rounded-2xl border border-blue-500/30 bg-blue-950/15 p-4 text-center">
            <span className="text-[10px] font-bold uppercase text-blue-400 block">Practiced Repeatedly</span>
            <span className="text-2xl font-black text-white font-mono mt-1 block">{statusBreakdown.practiced_repeatedly}</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">2+ practice attempts</span>
          </div>

          <div className="rounded-2xl border border-[#03E29C]/30 bg-[#16191F]/15 p-4 text-center">
            <span className="text-[10px] font-bold uppercase text-[#03E29C] block">Attempted Once</span>
            <span className="text-2xl font-black text-white font-mono mt-1 block">{statusBreakdown.attempted}</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Initial challenge done</span>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/15 p-4 text-center">
            <span className="text-[10px] font-bold uppercase text-amber-400 block">Needs Revision</span>
            <span className="text-2xl font-black text-white font-mono mt-1 block">{statusBreakdown.needs_revision}</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Due in spaced schedule</span>
          </div>

          <div className="rounded-2xl border border-[#16191F] bg-[#090b16] p-4 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Not Started</span>
            <span className="text-2xl font-black text-slate-300 font-mono mt-1 block">{statusBreakdown.not_started}</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Awaiting first attempt</span>
          </div>
        </div>
      </div>

      {/* FULL SESSION PRACTICE HISTORY LOG TABLE */}
      <div className="rounded-3xl border border-[#16191F] bg-[#0c1020] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1b223d] pb-3">
          <div>
            <h3 className="text-base font-bold text-white">Complete Practice History Log</h3>
            <p className="text-xs text-slate-400 mt-0.5">Chronological record of completed challenges and XP awards</p>
          </div>
          <span className="text-xs font-mono text-slate-400">{sessions.length} Sessions</span>
        </div>

        {sessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#16191F] text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Topic Title</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Mode</th>
                  <th className="py-3 px-3">Score</th>
                  <th className="py-3 px-3">Time</th>
                  <th className="py-3 px-3 text-right">XP Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151c33]">
                {[...sessions]
                  .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                  .map((s) => (
                    <tr key={s.id} className="hover:bg-[#12162a] transition-colors">
                      <td className="py-3 px-3 text-slate-400 font-mono whitespace-nowrap">
                        {formatDisplayDate(s.completedAt)}
                      </td>
                      <td className="py-3 px-3 font-semibold text-white max-w-xs truncate">
                        <Link to={`/practice/session/${s.topicId}`} className="hover:text-[#03E29C]">
                          {s.topicTitle}
                        </Link>
                      </td>
                      <td className="py-3 px-3">
                        <span className="rounded bg-[#161c33] px-2 py-0.5 text-[10px] font-semibold text-slate-300 border border-[#232b4d]">
                          {s.category}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            s.recallMode === 'independent'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {s.recallMode}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-amber-400">
                        {s.averageRating} ★
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-mono">
                        {Math.floor(s.durationSeconds / 60)}m {s.durationSeconds % 60}s
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#03E29C]">
                        +{s.xpEarned} XP
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-500">
            No session history recorded yet. Complete challenges in the Spin Arena to view your full analytics.
          </div>
        )}
      </div>
    </div>
  );
};
