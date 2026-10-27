import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RotateCcw,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Star,
  CheckCircle2,
  X,
  Compass,
} from 'lucide-react';
import { TOPICS } from '../data/topics';
import { useCodeQuest } from '../context/CodeQuestContext';
import { formatDisplayDate, getTodayDateString } from '../utils/date';
import type { Topic } from '../types/topic';

type RevisionTab = 'due' | 'weak' | 'bookmarked' | 'completed' | 'all';

export const RevisionPage: React.FC = () => {
  const navigate = useNavigate();
  const { revisionSchedule, sessions, bookmarks, toggleBookmark, isBookmarked } = useCodeQuest();

  const [activeTab, setActiveTab] = useState<RevisionTab>('due');
  const [inspectingTopic, setInspectingTopic] = useState<Topic | null>(null);

  const todayStr = getTodayDateString();

  // Map scheduled items with topic metadata
  const enrichedItems = useMemo(() => {
    return Object.values(revisionSchedule)
      .map((item) => {
        const topic = TOPICS.find((t) => t.id === item.topicId);
        const isDue = item.nextReviewDate <= todayStr;
        const isWeak = item.lastRating <= 3 || item.lastDifficulty === 'Again' || item.lastDifficulty === 'Hard';
        const isBookmarkedTopic = bookmarks.includes(item.topicId);

        return {
          ...item,
          topic,
          isDue,
          isWeak,
          isBookmarkedTopic,
        };
      })
      .filter((item) => item.topic !== undefined);
  }, [revisionSchedule, todayStr, bookmarks]);

  // Tab counts
  const dueItems = enrichedItems.filter((i) => i.isDue);
  const weakItems = enrichedItems.filter((i) => i.isWeak);
  const bookmarkedItems = TOPICS.filter((t) => bookmarks.includes(t.id));
  const completedTopicIds = Array.from(new Set(sessions.map((s) => s.topicId)));

  // Filter items based on active tab
  const displayedItems = useMemo(() => {
    if (activeTab === 'due') return dueItems;
    if (activeTab === 'weak') return weakItems;
    if (activeTab === 'completed') {
      return enrichedItems.filter((i) => completedTopicIds.includes(i.topicId));
    }
    if (activeTab === 'all') return enrichedItems;
    return [];
  }, [activeTab, dueItems, weakItems, completedTopicIds, enrichedItems]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#16191F] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <RotateCcw className="h-6 w-6" />
            </span>
            Revision Hub & Spaced Repetition
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            SuperMemo SM-2 automated review schedule. Revising concepts at expanding intervals solidifies long-term recall.
          </p>
        </div>

        <button
          onClick={() => navigate('/practice')}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#03E29C] to-[#03E29C] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#03E29C]/25 hover:brightness-110 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Compass className="h-4 w-4" />
          <span>Spin Arena</span>
        </button>
      </div>

      {/* TABS CONTROLLER */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#1b223d] pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('due')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all ${
            activeTab === 'due'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#16191F]'
          }`}
        >
          <span>Due Today</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              dueItems.length > 0
                ? 'bg-cyan-500 text-black animate-pulse'
                : 'bg-[#18203d] text-slate-400'
            }`}
          >
            {dueItems.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('weak')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all ${
            activeTab === 'weak'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#16191F]'
          }`}
        >
          <span>Weak Topics</span>
          <span className="rounded-full bg-[#18203d] px-2 py-0.5 text-[10px] text-slate-400">
            {weakItems.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarked')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all ${
            activeTab === 'bookmarked'
              ? 'bg-[#03E29C]/20 text-[#03E29C] border border-[#03E29C]/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#16191F]'
          }`}
        >
          <span>Bookmarked</span>
          <span className="rounded-full bg-[#18203d] px-2 py-0.5 text-[10px] text-slate-400">
            {bookmarkedItems.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all ${
            activeTab === 'completed'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#16191F]'
          }`}
        >
          <span>Practiced History</span>
          <span className="rounded-full bg-[#18203d] px-2 py-0.5 text-[10px] text-slate-400">
            {completedTopicIds.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all ${
            activeTab === 'all'
              ? 'bg-slate-700/40 text-slate-200 border border-slate-600 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#16191F]'
          }`}
        >
          <span>All Scheduled</span>
          <span className="rounded-full bg-[#18203d] px-2 py-0.5 text-[10px] text-slate-400">
            {enrichedItems.length}
          </span>
        </button>
      </div>

      {/* TAB CONTENT: BOOKMARKED TOPICS */}
      {activeTab === 'bookmarked' ? (
        <div className="space-y-4">
          {bookmarkedItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarkedItems.map((topic) => (
                <div
                  key={topic.id}
                  className="rounded-2xl border border-[#16191F] bg-[#0c1020] p-5 flex flex-col justify-between hover:border-[#03E29C]/40 transition-all shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="rounded-md bg-[#03E29C]/20 px-2 py-0.5 text-[11px] font-semibold text-[#03E29C] border border-[#03E29C]/30">
                        {topic.category}
                      </span>
                      <button
                        onClick={() => toggleBookmark(topic.id)}
                        className="text-amber-400 hover:text-amber-300"
                        title="Remove bookmark"
                      >
                        <BookmarkCheck className="h-4 w-4" />
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1.5">{topic.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                      {topic.shortDescription}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#18203c] flex items-center justify-between">
                    <button
                      onClick={() => setInspectingTopic(topic)}
                      className="text-xs font-semibold text-slate-400 hover:text-white"
                    >
                      View Notes
                    </button>
                    <button
                      onClick={() => navigate(`/practice/session/${topic.id}`)}
                      className="flex items-center gap-1 rounded-lg bg-[#03E29C] px-3 py-1 text-xs font-bold text-white hover:bg-[#03E29C]"
                    >
                      <span>Practice</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#16191F] bg-[#0c1020] p-12 text-center space-y-3">
              <Bookmark className="h-10 w-10 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-slate-300">No bookmarked topics</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Bookmark challenging topics in the Topic Explorer or Spin Arena to build your focused study list.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* TAB CONTENT: SCHEDULED ITEMS */
        <div className="space-y-4">
          {displayedItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedItems.map((item) => {
                if (!item.topic) return null;
                const bookmarked = isBookmarked(item.topicId);

                return (
                  <div
                    key={item.topicId}
                    className={`rounded-2xl border p-5 flex flex-col justify-between transition-all shadow-md ${
                      item.isDue
                        ? 'border-cyan-500/40 bg-gradient-to-b from-cyan-950/20 to-[#0c1020]'
                        : item.isWeak
                        ? 'border-amber-500/40 bg-gradient-to-b from-amber-950/20 to-[#0c1020]'
                        : 'border-[#16191F] bg-[#0c1020]'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="rounded-md bg-[#161c33] px-2 py-0.5 text-[11px] font-semibold text-slate-300 border border-[#232b4d]">
                            {item.topic.category}
                          </span>
                          {item.isDue ? (
                            <span className="rounded-md bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/30 uppercase">
                              Due Today
                            </span>
                          ) : item.isWeak ? (
                            <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30 uppercase">
                              Needs Reinforcement
                            </span>
                          ) : null}
                        </div>

                        <button
                          onClick={() => toggleBookmark(item.topicId)}
                          className={`p-1 rounded transition-colors ${
                            bookmarked ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                        </button>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-white mb-2 leading-snug">
                        {item.topic.title}
                      </h3>

                      {/* Spaced Repetition Meta Box */}
                      <div className="rounded-xl border border-[#1b2344] bg-[#080a14] p-3 space-y-1.5 mb-4 text-xs">
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Next Review:</span>
                          <span className="font-bold text-slate-200 font-mono">
                            {formatDisplayDate(item.nextReviewDate)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Interval:</span>
                          <span className="font-mono text-cyan-400">
                            {item.intervalDays} {item.intervalDays === 1 ? 'day' : 'days'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Last Rating:</span>
                          <span className="flex items-center gap-1 font-bold text-amber-400 font-mono">
                            <Star className="h-3 w-3 fill-amber-400" />
                            {item.lastRating}/5.0 ({item.lastDifficulty})
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Repetitions:</span>
                          <span className="font-mono text-slate-300">{item.repetitionCount} completed</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-[#18203c] flex items-center justify-between">
                      <button
                        onClick={() => setInspectingTopic(item.topic || null)}
                        className="text-xs font-semibold text-slate-400 hover:text-white"
                      >
                        Notes
                      </button>

                      <button
                        onClick={() => navigate(`/practice/session/${item.topicId}`)}
                        className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold text-white shadow-md transition-all ${
                          item.isDue
                            ? 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/30'
                            : 'bg-[#03E29C] hover:bg-[#03E29C] shadow-[#03E29C]/30'
                        }`}
                      >
                        <span>Start Revision</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#16191F] bg-[#0c1020] p-12 text-center space-y-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
              <h4 className="text-base font-bold text-slate-200">
                {activeTab === 'due'
                  ? 'All due revisions are cleared!'
                  : activeTab === 'weak'
                  ? 'No weak topics identified yet!'
                  : 'No revision topics found'}
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {activeTab === 'due'
                  ? 'You are completely caught up on your spaced-repetition queue. Head to the Spin Arena to practice a new challenge.'
                  : 'Complete sessions and self-assess honestly to build your automated review schedule.'}
              </p>
              <button
                onClick={() => navigate('/practice')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#03E29C] px-4 py-2 text-xs font-bold text-white hover:bg-[#03E29C] transition-colors mt-2"
              >
                <span>Spin Arena</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* QUICK TOPIC NOTES MODAL */}
      {inspectingTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="rounded-3xl border border-[#2a355c] bg-[#0e1224] p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-[#1b2344] pb-3">
              <div>
                <span className="rounded bg-[#03E29C]/20 px-2 py-0.5 text-xs font-semibold text-[#03E29C]">
                  {inspectingTopic.category}
                </span>
                <h2 className="text-xl font-bold text-white mt-1">{inspectingTopic.title}</h2>
              </div>
              <button
                onClick={() => setInspectingTopic(null)}
                className="p-1.5 rounded-lg border border-[#222a47] text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-2xl border border-[#03E29C]/30 bg-[#16191F]/20 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#03E29C] block mb-1">
                Interview Question
              </span>
              <p className="text-sm font-semibold text-white">
                "{inspectingTopic.interviewQuestion}"
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Revision Notes
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 pl-4 list-disc marker:text-cyan-400">
                {inspectingTopic.revisionNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1b2344]">
              <button
                onClick={() => setInspectingTopic(null)}
                className="rounded-xl border border-[#232b4d] bg-[#12162a] px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setInspectingTopic(null);
                  navigate(`/practice/session/${inspectingTopic.id}`);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-5 py-2 text-xs font-bold text-white hover:bg-cyan-500 shadow-md shadow-cyan-600/30"
              >
                <span>Start Revision Session</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
