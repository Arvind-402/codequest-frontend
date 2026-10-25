import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RotateCw,
  Compass,
  Clock,
  ArrowRight,
  Sparkles,
  Calendar,
  Sliders,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WHEEL_CATEGORIES, calculateRotationToCategory, getDailyChallengeTopic } from '../../utils/wheel';
import { TOPICS } from '../../data/topics';
import type { Topic, Category, Difficulty } from '../../types/topic';
import { useCodeQuest } from '../../context/CodeQuestContext';
import { getTodayDateString } from '../../utils/date';

interface SpinningWheelProps {
  onSelectTopic?: (topic: Topic) => void;
}

export const SpinningWheel: React.FC<SpinningWheelProps> = ({ onSelectTopic }) => {
  const navigate = useNavigate();
  const { revisionSchedule, getTopicStatus } = useCodeQuest();

  // Practice Modes: 'discovery' | 'daily' | 'syllabus'
  const [practiceMode, setPracticeMode] = useState<'discovery' | 'daily' | 'syllabus'>('discovery');

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>('All');
  const [onlyDueRevisions, setOnlyDueRevisions] = useState<boolean>(false);

  // Wheel Animation State
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showResultCard, setShowResultCard] = useState<boolean>(false);

  const wheelRef = useRef<SVGSVGElement | null>(null);
  const todayStr = getTodayDateString();

  // Daily Challenge Topic (deterministic)
  const dailyTopic = useMemo(() => {
    return getDailyChallengeTopic(TOPICS, todayStr);
  }, [todayStr]);

  // Filtered eligible topics for discovery mode
  const eligibleTopics = useMemo(() => {
    return TOPICS.filter((t) => {
      // Category filter
      if (selectedCategories.length > 0) {
        const matchesCategory = selectedCategories.includes(t.category) ||
          (t.category === 'PROGRAMMING' && selectedCategories.includes('OOPS'));
        if (!matchesCategory) return false;
      }
      // Difficulty filter
      if (selectedDifficulty !== 'All' && t.difficulty !== selectedDifficulty) {
        return false;
      }
      // Due revision filter
      if (onlyDueRevisions) {
        const sched = revisionSchedule[t.id];
        if (!sched || sched.nextReviewDate > todayStr) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategories, selectedDifficulty, onlyDueRevisions, revisionSchedule, todayStr]);

  // Toggle category in filter
  const toggleCategory = (cat: Category) => {
    if (isSpinning) return;
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Helper to map topic category to wheel segment index
  const getCategoryIndex = (cat: Category): number => {
    if (cat === 'PROGRAMMING') return 1; // Map programming to OOPS segment
    const idx = WHEEL_CATEGORIES.findIndex((wc) => wc.category === cat);
    return idx >= 0 ? idx : 0;
  };

  // Spin the wheel with real deceleration physics
  const handleSpin = () => {
    if (isSpinning || eligibleTopics.length === 0) return;

    setIsSpinning(true);
    setShowResultCard(false);

    // Pick random topic from eligible pool
    const randomTopic = eligibleTopics[Math.floor(Math.random() * eligibleTopics.length)];
    const targetCategoryIndex = getCategoryIndex(randomTopic.category);

    // Compute exact rotation to land on target slice at 12 o'clock pointer
    const nextRotation = calculateRotationToCategory(targetCategoryIndex, rotation, 8, 6);
    setRotation(nextRotation);

    // Wait for the CSS cubic-bezier transition to complete (4.2 seconds)
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedTopic(randomTopic);
      setShowResultCard(true);
      if (onSelectTopic) onSelectTopic(randomTopic);

      // Trigger celebratory confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
      });
    }, 4200);
  };

  // Daily Challenge Direct Launch or Spin
  const handleSpinForDaily = () => {
    if (!dailyTopic || isSpinning) return;
    setIsSpinning(true);
    setShowResultCard(false);

    const targetIndex = getCategoryIndex(dailyTopic.category);
    const nextRotation = calculateRotationToCategory(targetIndex, rotation, 8, 5);
    setRotation(nextRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedTopic(dailyTopic);
      setShowResultCard(true);

      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#f59e0b', '#8b5cf6', '#10b981'],
      });
    }, 3800);
  };

  // Slices geometry
  const numSlices = WHEEL_CATEGORIES.length;
  const sliceAngle = 360 / numSlices; // 45 degrees
  const radius = 210;
  const centerX = 250;
  const centerY = 250;

  return (
    <div className="space-y-8">
      {/* Practice Mode Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1e2642] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <Compass className="h-6 w-6" />
            </span>
            Spin Arena
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Test your recall with our unprompted spinning wheel, or follow structured preparation.
          </p>
        </div>

        {/* Mode Selector Buttons */}
        <div className="flex items-center rounded-xl border border-[#1e2642] bg-[#0b0e1b] p-1 text-xs font-semibold">
          <button
            onClick={() => setPracticeMode('discovery')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition-all ${
              practiceMode === 'discovery'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <RotateCw className="h-3.5 w-3.5" />
            <span>Discovery Wheel</span>
          </button>
          <button
            onClick={() => setPracticeMode('daily')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition-all ${
              practiceMode === 'daily'
                ? 'bg-amber-500 text-black shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Daily Challenge</span>
          </button>
          <button
            onClick={() => setPracticeMode('syllabus')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 transition-all ${
              practiceMode === 'syllabus'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Structured Prep</span>
          </button>
        </div>
      </div>

      {/* DISCOVERY WHEEL MODE */}
      {practiceMode === 'discovery' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Wheel Column (Center 7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            {/* The Wheel Container */}
            <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center p-4">
              {/* Outer Glowing Neon Ring */}
              <div className="absolute inset-2 rounded-full border border-violet-500/20 bg-gradient-to-b from-violet-600/10 to-transparent blur-md pointer-events-none" />

              {/* Fixed Top Indicator Pointer (12 o'clock, pointing down) */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none animate-pointer-bob">
                <div className="w-5 h-6 bg-gradient-to-b from-white via-violet-300 to-violet-500 clip-triangle shadow-lg shadow-violet-500/80 drop-shadow-[0_2px_8px_rgba(139,92,246,0.9)]" />
                <div className="w-2.5 h-2.5 -mt-1 rounded-full bg-violet-400 ring-2 ring-white" />
              </div>

              {/* SVG Spinning Wheel */}
              <svg
                ref={wheelRef}
                viewBox="0 0 500 500"
                className="w-full h-full drop-shadow-2xl select-none"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning
                    ? 'transform 4.2s cubic-bezier(0.12, 0.8, 0.22, 1)'
                    : 'none',
                }}
              >
                <defs>
                  {/* Subtle slice gradients */}
                  {WHEEL_CATEGORIES.map((cat, i) => (
                    <linearGradient
                      key={cat.category}
                      id={`wedge-grad-${i}`}
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor={cat.color} stopOpacity="0.95" />
                      <stop offset="100%" stopColor={cat.secondaryColor} stopOpacity="0.85" />
                    </linearGradient>
                  ))}
                  <radialGradient id="center-hub-grad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1e2642" />
                    <stop offset="85%" stopColor="#0b0e1b" />
                    <stop offset="100%" stopColor="#14192d" />
                  </radialGradient>
                </defs>

                {/* Outer Wheel Rim */}
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={radius + 12}
                  fill="#0e1324"
                  stroke="#263156"
                  strokeWidth="6"
                />

                {/* Outer Rim Studs / Pins */}
                {Array.from({ length: 32 }).map((_, idx) => {
                  const pinAngle = (idx * (360 / 32) * Math.PI) / 180;
                  const pinX = centerX + (radius + 6) * Math.cos(pinAngle);
                  const pinY = centerY + (radius + 6) * Math.sin(pinAngle);
                  return (
                    <circle
                      key={idx}
                      cx={pinX}
                      cy={pinY}
                      r="2.5"
                      fill={idx % 4 === 0 ? '#c4b5fd' : '#475569'}
                    />
                  );
                })}

                {/* Wheel Slices */}
                {WHEEL_CATEGORIES.map((cat, i) => {
                  const startDeg = i * sliceAngle;
                  const endDeg = (i + 1) * sliceAngle;

                  // Convert degrees to standard radians (0 deg = 12 o'clock = -90 deg from 3 o'clock)
                  const startRad = ((startDeg - 90) * Math.PI) / 180;
                  const endRad = ((endDeg - 90) * Math.PI) / 180;

                  const x1 = centerX + radius * Math.cos(startRad);
                  const y1 = centerY + radius * Math.sin(startRad);
                  const x2 = centerX + radius * Math.cos(endRad);
                  const y2 = centerY + radius * Math.sin(endRad);

                  const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

                  // Center angle for slice label
                  const midDeg = startDeg + sliceAngle / 2;
                  const midRad = ((midDeg - 90) * Math.PI) / 180;

                  // Position label halfway between center and edge
                  const labelRadius = radius * 0.65;
                  const labelX = centerX + labelRadius * Math.cos(midRad);
                  const labelY = centerY + labelRadius * Math.sin(midRad);

                  return (
                    <g key={cat.category}>
                      {/* Wedge Path */}
                      <path
                        d={pathData}
                        fill={`url(#wedge-grad-${i})`}
                        stroke="#0a0c16"
                        strokeWidth="2.5"
                        className="transition-colors hover:brightness-110"
                      />

                      {/* Text & Icon in Slice */}
                      <g
                        transform={`translate(${labelX}, ${labelY}) rotate(${midDeg + 90})`}
                        className="pointer-events-none"
                      >
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="#ffffff"
                          fontSize="13"
                          fontWeight="700"
                          letterSpacing="0.4"
                          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                        >
                          {cat.shortLabel}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* Central Metallic Hub */}
                <circle
                  cx={centerX}
                  cy={centerY}
                  r="52"
                  fill="url(#center-hub-grad)"
                  stroke="#3b4873"
                  strokeWidth="3.5"
                />
                <circle
                  cx={centerX}
                  cy={centerY}
                  r="45"
                  fill="#0b0e1b"
                  stroke="#8b5cf6"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
              </svg>

              {/* Interactive Center Spin Button */}
              <button
                onClick={handleSpin}
                disabled={isSpinning || eligibleTopics.length === 0}
                className={`absolute z-20 flex h-20 w-20 flex-col items-center justify-center rounded-full text-center transition-all ${
                  isSpinning
                    ? 'cursor-not-allowed bg-slate-800 text-slate-500 scale-95'
                    : eligibleTopics.length === 0
                    ? 'cursor-not-allowed bg-slate-800 text-slate-500'
                    : 'bg-gradient-to-tr from-violet-600 via-indigo-600 to-violet-500 text-white shadow-xl shadow-violet-600/40 hover:scale-105 active:scale-95 border-2 border-violet-300'
                }`}
                title={eligibleTopics.length === 0 ? 'No topics match current filters' : 'Spin the wheel!'}
              >
                <RotateCw className={`h-6 w-6 ${isSpinning ? 'animate-spin' : ''}`} />
                <span className="text-[11px] font-extrabold uppercase tracking-wider mt-0.5">
                  {isSpinning ? 'Rolling' : 'SPIN'}
                </span>
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <span className="h-2 w-2 rounded-full bg-violet-400 animate-ping" />
                {eligibleTopics.length} topics available in current pool
              </span>
              <span>•</span>
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedDifficulty('All');
                  setOnlyDueRevisions(false);
                }}
                className="text-violet-400 hover:underline"
              >
                Reset filters
              </button>
            </div>
          </div>

          {/* Controls & Result Column (Right 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Result Modal / Card (Displays when topic is spun) */}
            {showResultCard && selectedTopic ? (
              <div className="rounded-2xl border border-violet-500/40 bg-gradient-to-br from-[#151a33] to-[#0f1428] p-5 shadow-2xl shadow-violet-900/30 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/20 px-2.5 py-0.5 text-xs font-semibold text-violet-300 border border-violet-500/30">
                    <Sparkles className="h-3 w-3" />
                    Topic Selected
                  </span>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> ~{selectedTopic.estimatedMinutes} mins
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 leading-snug">
                  {selectedTopic.title}
                </h3>
                <p className="text-xs text-slate-300 mb-4 line-clamp-3">
                  {selectedTopic.shortDescription}
                </p>

                {/* Key Concepts Preview */}
                <div className="rounded-xl bg-[#090b16] p-3 border border-[#1e2642] mb-4 space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Core Concepts Tested
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedTopic.keyConcepts.slice(0, 3).map((concept, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-[#161c33] px-2 py-0.5 text-[11px] text-slate-300 border border-[#232b4d]"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(`/practice/session/${selectedTopic.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-600/30 hover:brightness-110 active:scale-95 transition-all"
                  >
                    <span>Start Challenge</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleSpin}
                    disabled={isSpinning}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[#2a355c] bg-[#141a33] px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-[#1a2242] transition-colors"
                  >
                    <RotateCw className="h-4 w-4" />
                    <span>Spin Again</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#232b4d] bg-[#0c1020]/60 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600/10 text-violet-400 mb-3 border border-violet-500/20">
                  <RotateCw className={`h-6 w-6 ${isSpinning ? 'animate-spin text-violet-400' : ''}`} />
                </div>
                <h4 className="text-sm font-bold text-slate-200">
                  {isSpinning ? 'Selecting matching topic...' : 'Ready to Spin'}
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  {isSpinning
                    ? 'The wheel pointer will lock precisely onto the chosen topic wedge.'
                    : 'Configure your category and difficulty filters below, then hit the center SPIN button.'}
                </p>
              </div>
            )}

            {/* Filters Control Box */}
            <div className="rounded-2xl border border-[#1e2642] bg-[#0d1122] p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-[#1b223d] pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-violet-400" />
                  Arena Filters
                </span>
                <span className="text-xs text-slate-400">
                  {selectedCategories.length === 0 ? 'All Categories' : `${selectedCategories.length} selected`}
                </span>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-2 block">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => !isSpinning && setSelectedDifficulty(diff)}
                      className={`rounded-lg py-1.5 text-xs font-medium border transition-all ${
                        selectedDifficulty === diff
                          ? 'bg-violet-600/25 border-violet-500 text-white font-semibold'
                          : 'border-[#1e2642] bg-[#14192d] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Toggles */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-2 block">
                  Categories ({WHEEL_CATEGORIES.length})
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {WHEEL_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategories.includes(cat.category);
                    return (
                      <button
                        key={cat.category}
                        onClick={() => toggleCategory(cat.category)}
                        className={`flex items-center gap-2 rounded-xl p-2 text-left text-xs border transition-all ${
                          isSelected
                            ? 'border-violet-500/50 bg-violet-600/20 text-white font-medium shadow-sm'
                            : 'border-[#1e2642] bg-[#12162a] text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="truncate">{cat.shortLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Due Revisions Toggle */}
              <div className="pt-2 border-t border-[#1b223d]">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-300">
                      Include Due Revisions Only
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Spaced-repetition topics scheduled for today
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={onlyDueRevisions}
                    onChange={(e) => setOnlyDueRevisions(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-violet-600 focus:ring-violet-500"
                  />
                </label>
              </div>

              {eligibleTopics.length === 0 && (
                <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 p-3 text-xs text-amber-300 border border-amber-500/20">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>No topics match this combination. Try broadening your filters.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DAILY CHALLENGE MODE */}
      {practiceMode === 'daily' && dailyTopic && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#1a1727] via-[#121424] to-[#0c0e1b] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30">
                <Calendar className="h-3.5 w-3.5" />
                Daily Deterministic Challenge — {todayStr}
              </span>
              <span className="rounded-md bg-[#1a223e] px-2.5 py-1 text-xs font-semibold text-slate-300 border border-[#2b3760]">
                {dailyTopic.category}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              {dailyTopic.title}
            </h2>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              {dailyTopic.shortDescription}
            </p>

            {/* Question Card */}
            <div className="rounded-2xl border border-[#222c4d] bg-[#0a0d18] p-5 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 block mb-1">
                Today’s Technical Interview Question
              </span>
              <p className="text-sm sm:text-base font-semibold text-slate-100">
                "{dailyTopic.interviewQuestion}"
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate(`/practice/session/${dailyTopic.id}`)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-sm font-bold text-black shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all"
              >
                <span>Accept Today's Challenge</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={handleSpinForDaily}
                disabled={isSpinning}
                className="flex items-center gap-2 rounded-xl border border-[#2a355c] bg-[#141a33] px-5 py-3 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <RotateCw className={`h-4 w-4 ${isSpinning ? 'animate-spin text-amber-400' : ''}`} />
                <span>Spin Wheel for Today</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STRUCTURED SYLLABUS MODE */}
      {practiceMode === 'syllabus' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Browse topics directly by curriculum category. Start any challenge without spinning.
            </p>
            <span className="text-xs font-mono text-slate-400">{TOPICS.length} Total Topics</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOPICS.map((topic) => {
              const status = getTopicStatus(topic.id);
              return (
                <div
                  key={topic.id}
                  className="rounded-2xl border border-[#1e2642] bg-[#0e1222] p-5 flex flex-col justify-between hover:border-violet-500/40 transition-all hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="rounded-md bg-[#161c33] px-2 py-0.5 text-[11px] font-semibold text-violet-300 border border-[#252e52]">
                        {topic.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ~{topic.estimatedMinutes}m
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white mb-1.5 leading-snug">
                      {topic.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                      {topic.shortDescription}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#1a213b]">
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                        status === 'strong'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : status === 'attempted'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {status.replace('_', ' ')}
                    </span>

                    <button
                      onClick={() => navigate(`/practice/session/${topic.id}`)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300"
                    >
                      <span>Practice</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
