import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Clock,
  X,
  SlidersHorizontal,
  Compass,
} from 'lucide-react';
import { TOPICS, CATEGORIES_LIST } from '../data/topics';
import type { Topic, Category, Difficulty, TopicStatus } from '../types/topic';
import { useCodeQuest } from '../context/CodeQuestContext';

export const TopicsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isBookmarked, toggleBookmark, getTopicStatus, getTopicStats } = useCodeQuest();

  // Search and Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<TopicStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<'title' | 'difficulty' | 'time'>('title');

  // Selected topic for detailed notes drawer
  const [inspectingTopic, setInspectingTopic] = useState<Topic | null>(null);

  // Filtered and sorted topics
  const filteredTopics = useMemo(() => {
    return TOPICS.filter((topic) => {
      // Search query (title, description, tags, keywords)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = topic.title.toLowerCase().includes(query);
        const matchesDesc = topic.shortDescription.toLowerCase().includes(query);
        const matchesTags = topic.tags.some((t) => t.toLowerCase().includes(query));
        const matchesQuestion = topic.interviewQuestion.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesTags && !matchesQuestion) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All') {
        const matchesCat = topic.category === selectedCategory ||
          (selectedCategory === 'OOPS' && topic.category === 'PROGRAMMING');
        if (!matchesCat) return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'All' && topic.difficulty !== selectedDifficulty) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'All') {
        const status = getTopicStatus(topic.id);
        if (status !== selectedStatus) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'difficulty') {
        const rank = { Beginner: 1, Intermediate: 2, Advanced: 3 };
        return rank[a.difficulty] - rank[b.difficulty];
      }
      if (sortBy === 'time') {
        return a.estimatedMinutes - b.estimatedMinutes;
      }
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedStatus, sortBy, getTopicStatus]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e2642] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <BookOpen className="h-6 w-6" />
            </span>
            Topic Explorer & Syllabus
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse all {TOPICS.length} curated engineering interview topics. Review revision notes, inspect rubrics, or start a practice challenge.
          </p>
        </div>

        <button
          onClick={() => navigate('/practice')}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-violet-600/25 hover:brightness-110 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Compass className="h-4 w-4" />
          <span>Spin Arena</span>
        </button>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="rounded-2xl border border-[#1e2642] bg-[#0c1020] p-4 sm:p-5 space-y-4 shadow-lg">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics by title, keywords, tags (e.g., 'LRU', 'vtable', 'B-Tree', 'TCP')..."
            className="w-full rounded-xl border border-[#1e2642] bg-[#080a14] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:border-violet-500 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
            <span className="font-semibold text-slate-400">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as Category | 'All')}
              className="rounded-lg border border-[#1e2642] bg-[#12162a] px-2.5 py-1.5 text-xs text-slate-200 focus:border-violet-500 outline-none"
            >
              <option value="All">All Categories ({TOPICS.length})</option>
              {CATEGORIES_LIST.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label} ({cat.count})
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-400">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty | 'All')}
              className="rounded-lg border border-[#1e2642] bg-[#12162a] px-2.5 py-1.5 text-xs text-slate-200 focus:border-violet-500 outline-none"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-400">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as TopicStatus | 'All')}
              className="rounded-lg border border-[#1e2642] bg-[#12162a] px-2.5 py-1.5 text-xs text-slate-200 focus:border-violet-500 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="not_started">Not Started</option>
              <option value="attempted">Attempted</option>
              <option value="needs_revision">Needs Revision</option>
              <option value="practiced_repeatedly">Practiced Repeatedly</option>
              <option value="strong">Self-Assessed Strong</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="font-semibold text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border border-[#1e2642] bg-[#12162a] px-2.5 py-1.5 text-xs text-slate-200 focus:border-violet-500 outline-none"
            >
              <option value="title">Title (A-Z)</option>
              <option value="difficulty">Difficulty (Easy-Hard)</option>
              <option value="time">Estimated Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* TOPIC CARDS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Showing {filteredTopics.length} of {TOPICS.length} topics</span>
          {(searchQuery || selectedCategory !== 'All' || selectedDifficulty !== 'All' || selectedStatus !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedDifficulty('All');
                setSelectedStatus('All');
              }}
              className="text-violet-400 hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {filteredTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTopics.map((topic) => {
              const bookmarked = isBookmarked(topic.id);
              const status = getTopicStatus(topic.id);
              const stats = getTopicStats(topic.id);

              return (
                <div
                  key={topic.id}
                  className="rounded-2xl border border-[#1e2642] bg-[#0c1020] p-5 flex flex-col justify-between hover:border-violet-500/40 transition-all hover:-translate-y-1 shadow-md group"
                >
                  <div>
                    {/* Card Top: Badges & Bookmark */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-md bg-violet-600/20 px-2 py-0.5 text-[11px] font-semibold text-violet-300 border border-violet-500/30">
                          {topic.category}
                        </span>
                        <span className="rounded-md bg-[#161c33] px-2 py-0.5 text-[10px] font-semibold text-slate-300 border border-[#232b4d]">
                          {topic.difficulty}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleBookmark(topic.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          bookmarked
                            ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                            : 'border-[#1e2642] text-slate-500 hover:text-slate-300'
                        }`}
                        title={bookmarked ? 'Remove bookmark' : 'Bookmark for later'}
                      >
                        {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                      </button>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-violet-200 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {topic.shortDescription}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {topic.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-[#080a14] px-1.5 py-0.5 text-[10px] text-slate-400 border border-[#1a213b]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom: Status & Action Buttons */}
                  <div className="pt-3 border-t border-[#18203c] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                          status === 'strong'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : status === 'needs_revision'
                            ? 'bg-amber-500/20 text-amber-400'
                            : status === 'attempted'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {status.replace('_', ' ')}
                      </span>
                      {stats.attempts > 0 && (
                        <span className="text-[11px] font-mono text-slate-400">
                          {stats.attempts}x
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setInspectingTopic(topic)}
                        className="rounded-lg border border-[#232b4d] bg-[#12162a] px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                      >
                        Notes
                      </button>
                      <button
                        onClick={() => navigate(`/practice/session/${topic.id}`)}
                        className="flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1 text-xs font-bold text-white hover:bg-violet-500 transition-colors"
                      >
                        <span>Practice</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#1e2642] bg-[#0c1020] p-12 text-center space-y-3">
            <BookOpen className="h-10 w-10 text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-300">No matching topics found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No topics matched your search query and filters. Try adjusting your search term or resetting category filters.
            </p>
          </div>
        )}
      </div>

      {/* TOPIC DETAILS & NOTES DRAWER */}
      {inspectingTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="rounded-3xl border border-[#2a355c] bg-[#0e1224] p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#1b2344] pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded bg-violet-600/20 px-2 py-0.5 text-xs font-semibold text-violet-300">
                    {inspectingTopic.category}
                  </span>
                  <span className="rounded bg-[#161c33] px-2 py-0.5 text-xs font-semibold text-slate-300">
                    {inspectingTopic.difficulty}
                  </span>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="h-3 w-3" /> ~{inspectingTopic.estimatedMinutes} mins
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{inspectingTopic.title}</h2>
              </div>

              <button
                onClick={() => setInspectingTopic(null)}
                className="p-1.5 rounded-lg border border-[#222a47] text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* The Interview Question */}
            <div className="rounded-2xl border border-violet-500/30 bg-violet-950/20 p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 block mb-1">
                Primary Interview Question
              </span>
              <p className="text-sm font-semibold text-white">
                "{inspectingTopic.interviewQuestion}"
              </p>
            </div>

            {/* Revision Notes */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Revision Notes & Conceptual Principles
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 pl-4 list-disc marker:text-violet-400">
                {inspectingTopic.revisionNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>

            {/* Key Concepts Checklist */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Key Concepts Evaluated
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {inspectingTopic.keyConcepts.map((concept, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-[#141933] px-2.5 py-1 text-xs text-slate-200 border border-[#232b55]"
                  >
                    ✓ {concept}
                  </span>
                ))}
              </div>
            </div>

            {/* Practical Example */}
            {inspectingTopic.practicalExample && (
              <div className="rounded-xl bg-[#090b16] p-3 border border-[#1b2344]">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Practical Scenario / Code Walkthrough
                </span>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  {inspectingTopic.practicalExample}
                </p>
              </div>
            )}

            {/* Suggested Answer Structure */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Suggested Interview Answer Structure
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {inspectingTopic.suggestedAnswerStructure.map((item, idx) => (
                  <div key={idx} className="rounded-xl bg-[#141933] p-3 border border-[#232b55]">
                    <span className="text-xs font-bold text-violet-300 block">{item.section}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.guidance}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom CTAs */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1b2344]">
              <button
                onClick={() => setInspectingTopic(null)}
                className="rounded-xl border border-[#232b4d] bg-[#12162a] px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Close Notes
              </button>
              <button
                onClick={() => {
                  setInspectingTopic(null);
                  navigate(`/practice/session/${inspectingTopic.id}`);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-5 py-2 text-xs font-bold text-white hover:bg-violet-500 shadow-md shadow-violet-600/30"
              >
                <span>Practice Challenge</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
