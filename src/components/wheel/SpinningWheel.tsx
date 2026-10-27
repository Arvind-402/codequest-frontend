import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RotateCw,
  Volume2,
  VolumeX,
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
import { playRouletteAudio, stopRouletteAudio } from '../../utils/audio';

interface SpinningWheelProps {
  onSelectTopic?: (topic: Topic) => void;
}

// Unified authoritative duration for wheel rotation physics and audio playback
const SPIN_DURATION_MS = 5500;
const SPIN_DURATION_SEC = 5.5;

export const SpinningWheel: React.FC<SpinningWheelProps> = ({ onSelectTopic }) => {
  const navigate = useNavigate();
  const { revisionSchedule, getTopicStatus } = useCodeQuest();

  // Practice Modes: 'discovery' | 'daily' | 'syllabus'
  const [practiceMode, setPracticeMode] = useState<'discovery' | 'daily' | 'syllabus'>('discovery');

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>('All');
  const [onlyDueRevisions, setOnlyDueRevisions] = useState<boolean>(false);

  // Sound preference with localStorage persistence
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('codequest_sound') !== 'false';
    }
    return true;
  });

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('codequest_sound', String(next));
      }
      if (!next) {
        stopRouletteAudio(0);
      }
      return next;
    });
  };

  // Wheel Animation & Audio State
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showResultCard, setShowResultCard] = useState<boolean>(false);

  const wheelRef = useRef<SVGSVGElement | null>(null);
  const isSpinningRef = useRef<boolean>(false);
  const pendingTopicRef = useRef<Topic | null>(null);
  const spinSafetyTimerRef = useRef<number | null>(null);
  const todayStr = getTodayDateString();

  // Daily Challenge Topic (deterministic)
  const dailyTopic = useMemo(() => {
    return getDailyChallengeTopic(TOPICS, todayStr);
  }, [todayStr]);

  // Filtered eligible topics for discovery mode
  const eligibleTopics = useMemo(() => {
    return TOPICS.filter((t) => {
      if (selectedCategories.length > 0) {
        const matchesCategory =
          selectedCategories.includes(t.category) ||
          (t.category === 'PROGRAMMING' && selectedCategories.includes('OOPS'));
        if (!matchesCategory) return false;
      }
      if (selectedDifficulty !== 'All' && t.difficulty !== selectedDifficulty) {
        return false;
      }
      if (onlyDueRevisions) {
        const sched = revisionSchedule[t.id];
        if (!sched || sched.nextReviewDate > todayStr) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategories, selectedDifficulty, onlyDueRevisions, revisionSchedule, todayStr]);

  const toggleCategory = (cat: Category) => {
    if (isSpinning) return;
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const getCategoryIndex = (cat: Category): number => {
    if (cat === 'PROGRAMMING') return 1;
    const idx = WHEEL_CATEGORIES.findIndex((wc) => wc.category === cat);
    return idx >= 0 ? idx : 0;
  };

  /**
   * Finalizes the spin sequence once and only once:
   * 1. Stops roulette audio immediately.
   * 2. Reveals selected topic card.
   * 3. Triggers confetti.
   */
  const handleSpinComplete = useCallback(() => {
    if (!isSpinningRef.current) return;
    isSpinningRef.current = false;

    if (spinSafetyTimerRef.current !== null) {
      window.clearTimeout(spinSafetyTimerRef.current);
      spinSafetyTimerRef.current = null;
    }

    // Stop audio with a crisp 80ms micro-fade
    stopRouletteAudio(80);

    const winningTopic = pendingTopicRef.current;
    setIsSpinning(false);

    if (winningTopic) {
      setSelectedTopic(winningTopic);
      setShowResultCard(true);
      if (onSelectTopic) onSelectTopic(winningTopic);

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#03E29C', '#FFFFFF', '#C89B58', '#16191F'],
      });
    }
  }, [onSelectTopic]);

  useEffect(() => {
    return () => {
      isSpinningRef.current = false;
      if (spinSafetyTimerRef.current !== null) {
        window.clearTimeout(spinSafetyTimerRef.current);
        spinSafetyTimerRef.current = null;
      }
      stopRouletteAudio(0);
    };
  }, []);

  const handleSpin = () => {
    if (isSpinning || isSpinningRef.current || eligibleTopics.length === 0) return;

    isSpinningRef.current = true;
    setIsSpinning(true);
    setShowResultCard(false);

    const randomTopic = eligibleTopics[Math.floor(Math.random() * eligibleTopics.length)];
    pendingTopicRef.current = randomTopic;
    const targetCategoryIndex = getCategoryIndex(randomTopic.category);

    const nextRotation = calculateRotationToCategory(targetCategoryIndex, rotation, 8, 7);
    setRotation(nextRotation);

    if (soundEnabled) {
      playRouletteAudio({
        durationMs: SPIN_DURATION_MS,
      });
    }

    spinSafetyTimerRef.current = window.setTimeout(() => {
      handleSpinComplete();
    }, SPIN_DURATION_MS + 60);
  };

  const handleSpinForDaily = () => {
    if (!dailyTopic || isSpinning || isSpinningRef.current) return;

    isSpinningRef.current = true;
    setIsSpinning(true);
    setShowResultCard(false);
    pendingTopicRef.current = dailyTopic;

    const targetIndex = getCategoryIndex(dailyTopic.category);
    const nextRotation = calculateRotationToCategory(targetIndex, rotation, 8, 7);
    setRotation(nextRotation);

    if (soundEnabled) {
      playRouletteAudio({
        durationMs: SPIN_DURATION_MS,
      });
    }

    spinSafetyTimerRef.current = window.setTimeout(() => {
      handleSpinComplete();
    }, SPIN_DURATION_MS + 60);
  };

  const handleTransitionEnd = (e: React.TransitionEvent<SVGSVGElement>) => {
    if (e.propertyName === 'transform') {
      handleSpinComplete();
    }
  };

  const numSlices = WHEEL_CATEGORIES.length;
  const sliceAngle = 360 / numSlices;
  const radius = 210;
  const centerX = 250;
  const centerY = 250;

  return (
    <div className="space-y-8">
      {/* Practice Mode Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(242,245,248,0.08)] pb-5">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#03E29C]">
            Interactive Curriculum Roulette
          </span>
          <h1 className="text-2xl sm:text-3xl font-sans font-medium tracking-tight text-white flex items-center gap-2.5 mt-0.5">
            <span className="p-2 rounded-xl bg-[#0F1115] text-[#03E29C] border border-[rgba(242,245,248,0.12)]">
              <Compass className="h-5 w-5" />
            </span>
            <span>Spin Arena</span>
          </h1>
          <p className="text-xs text-[#8E959E] mt-1 max-w-xl font-light">
            Challenge your memory with the authentic roulette wheel, or select a structured syllabus topic to sharpen your engineering foundation.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center rounded-xl border border-[rgba(242,245,248,0.08)] bg-[#0B0D11] p-1 text-xs font-medium">
          <button
            onClick={() => !isSpinning && setPracticeMode('discovery')}
            disabled={isSpinning}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 transition-all ${
              practiceMode === 'discovery'
                ? 'bg-[#03E29C] text-[#08090B] font-semibold shadow-sm'
                : 'text-[#8E959E] hover:text-white'
            } ${isSpinning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RotateCw className="h-3.5 w-3.5" />
            <span>Discovery Wheel</span>
          </button>
          <button
            onClick={() => !isSpinning && setPracticeMode('daily')}
            disabled={isSpinning}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 transition-all ${
              practiceMode === 'daily'
                ? 'bg-[#16191F] text-white border border-[rgba(242,245,248,0.15)] font-semibold shadow-sm'
                : 'text-[#8E959E] hover:text-white'
            } ${isSpinning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Calendar className="h-3.5 w-3.5 text-[#03E29C]" />
            <span>Daily Challenge</span>
          </button>
          <button
            onClick={() => !isSpinning && setPracticeMode('syllabus')}
            disabled={isSpinning}
            className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 transition-all ${
              practiceMode === 'syllabus'
                ? 'bg-[#16191F] text-white border border-[rgba(242,245,248,0.15)] font-semibold'
                : 'text-[#8E959E] hover:text-white'
            } ${isSpinning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Sliders className="h-3.5 w-3.5 text-[#C89B58]" />
            <span>Structured Prep</span>
          </button>
        </div>
      </div>

      {/* DISCOVERY WHEEL MODE */}
      {practiceMode === 'discovery' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Wheel Column */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            {/* The Wheel Container */}
            <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center p-4">
              {/* Outer Atmospheric Glow */}
              <div className="absolute inset-2 rounded-full border border-[rgba(242,245,248,0.06)] bg-[#03E29C]/[0.02] blur-md pointer-events-none" />

              {/* Top Pointer Indicator */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none drop-shadow-[0_4px_12px_rgba(3,226,156,0.5)]">
                <div className="w-5 h-6 bg-gradient-to-b from-white via-[#03E29C] to-[#0A241D] clip-triangle shadow-lg" />
                <div className="w-2.5 h-2.5 -mt-1 rounded-full bg-[#03E29C] ring-2 ring-[#08090B]" />
              </div>

              {/* SVG Spinning Wheel */}
              <svg
                ref={wheelRef}
                viewBox="0 0 500 500"
                className="w-full h-full drop-shadow-[0_12px_32px_rgba(0,0,0,0.95)] select-none"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning
                    ? `transform ${SPIN_DURATION_SEC}s cubic-bezier(0.18, 0.78, 0.22, 1)`
                    : 'none',
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                <defs>
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
                    <stop offset="0%" stopColor="#16191F" />
                    <stop offset="80%" stopColor="#0B0D11" />
                    <stop offset="100%" stopColor="#08090B" />
                  </radialGradient>
                </defs>

                {/* Outer Wheel Rim */}
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={radius + 12}
                  fill="#0B0D11"
                  stroke="rgba(242, 245, 248, 0.12)"
                  strokeWidth="4"
                />

                {/* Outer Rim Pins */}
                {Array.from({ length: 32 }).map((_, idx) => {
                  const pinAngle = (idx * (360 / 32) * Math.PI) / 180;
                  const pinX = centerX + (radius + 6) * Math.cos(pinAngle);
                  const pinY = centerY + (radius + 6) * Math.sin(pinAngle);
                  return (
                    <circle
                      key={idx}
                      cx={pinX}
                      cy={pinY}
                      r="2.2"
                      fill={idx % 4 === 0 ? '#03E29C' : '#2A2F3D'}
                    />
                  );
                })}

                {/* Wheel Slices */}
                {WHEEL_CATEGORIES.map((cat, i) => {
                  const startDeg = i * sliceAngle;
                  const endDeg = (i + 1) * sliceAngle;

                  const startRad = ((startDeg - 90) * Math.PI) / 180;
                  const endRad = ((endDeg - 90) * Math.PI) / 180;

                  const x1 = centerX + radius * Math.cos(startRad);
                  const y1 = centerY + radius * Math.sin(startRad);
                  const x2 = centerX + radius * Math.cos(endRad);
                  const y2 = centerY + radius * Math.sin(endRad);

                  const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

                  const midDeg = startDeg + sliceAngle / 2;
                  const midRad = ((midDeg - 90) * Math.PI) / 180;

                  const labelRadius = radius * 0.65;
                  const labelX = centerX + labelRadius * Math.cos(midRad);
                  const labelY = centerY + labelRadius * Math.sin(midRad);

                  return (
                    <g key={cat.category}>
                      <path
                        d={pathData}
                        fill={`url(#wedge-grad-${i})`}
                        stroke="#08090B"
                        strokeWidth="2.5"
                        className="transition-colors hover:brightness-110"
                      />

                      <g
                        transform={`translate(${labelX}, ${labelY}) rotate(${midDeg + 90})`}
                        className="pointer-events-none"
                      >
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="#F3F4F6"
                          fontSize="12"
                          fontWeight="600"
                          letterSpacing="0.6"
                          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
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
                  stroke="rgba(242, 245, 248, 0.16)"
                  strokeWidth="2.5"
                />
                <circle
                  cx={centerX}
                  cy={centerY}
                  r="45"
                  fill="#08090B"
                  stroke="#03E29C"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />
              </svg>

              {/* Interactive Center Spin Button */}
              <button
                onClick={handleSpin}
                disabled={isSpinning || eligibleTopics.length === 0}
                className={`absolute z-20 flex h-20 w-20 flex-col items-center justify-center rounded-full text-center transition-all duration-300 ${
                  isSpinning
                    ? 'cursor-not-allowed bg-[#0F1115] text-[#8E959E] border border-[rgba(242,245,248,0.1)] scale-95 opacity-80'
                    : eligibleTopics.length === 0
                    ? 'cursor-not-allowed bg-[#0F1115] text-[#555B64] border border-[rgba(242,245,248,0.08)]'
                    : 'bg-[#03E29C] text-[#08090B] shadow-xl shadow-[#03E29C]/30 hover:scale-105 active:scale-95 border-2 border-white/60 cursor-pointer font-bold'
                }`}
                title={
                  isSpinning
                    ? 'Roulette in motion...'
                    : eligibleTopics.length === 0
                    ? 'No topics match current filters'
                    : 'Spin the roulette wheel!'
                }
              >
                <RotateCw className={`h-6 w-6 ${isSpinning ? 'animate-spin' : ''}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">
                  {isSpinning ? 'SPINNING' : 'SPIN'}
                </span>
              </button>
            </div>

            {/* Quick Status Bar & Sound Controls */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-[#8E959E]">
              <button
                type="button"
                onClick={toggleSound}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-mono transition-all ${
                  soundEnabled
                    ? 'border-[#03E29C]/40 bg-[#03E29C]/10 text-[#03E29C] hover:bg-[#03E29C]/20'
                    : 'border-white/10 bg-white/[0.02] text-[#8E959E] hover:text-white'
                }`}
                title={soundEnabled ? 'Mute roulette audio' : 'Enable roulette audio'}
              >
                {soundEnabled ? (
                  <Volume2 className="h-3.5 w-3.5 text-[#03E29C]" />
                ) : (
                  <VolumeX className="h-3.5 w-3.5 text-[#8E959E]" />
                )}
                <span>{soundEnabled ? 'Roulette Sound ON' : 'Audio Muted'}</span>
              </button>

              <span>&bull;</span>

              <span className="flex items-center gap-1.5 font-medium text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-[#03E29C] animate-ping" />
                {eligibleTopics.length} topics in active pool
              </span>

              <span>&bull;</span>

              <button
                onClick={() => {
                  if (isSpinning) return;
                  setSelectedCategories([]);
                  setSelectedDifficulty('All');
                  setOnlyDueRevisions(false);
                }}
                disabled={isSpinning}
                className={`text-[#03E29C] hover:text-[#00FFAF] transition-colors underline-offset-4 hover:underline ${
                  isSpinning ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              >
                Reset filters
              </button>
            </div>
          </div>

          {/* Controls & Result Column */}
          <div className="lg:col-span-5 space-y-6">
            {showResultCard && selectedTopic ? (
              <div className="rounded-2xl border border-[#03E29C]/40 bg-[#0F1115] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-400">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#03E29C]/10 px-3 py-0.5 text-xs font-semibold text-[#03E29C] border border-[#03E29C]/25">
                    <Sparkles className="h-3 w-3" />
                    Topic Selected
                  </span>
                  <span className="text-xs font-mono text-[#8E959E] flex items-center gap-1">
                    <Clock className="h-3 w-3" /> ~{selectedTopic.estimatedMinutes} mins
                  </span>
                </div>

                <h3 className="text-xl font-sans font-medium text-white mb-2 leading-snug">
                  {selectedTopic.title}
                </h3>
                <p className="text-xs text-[#8E959E] mb-4 line-clamp-3 leading-relaxed font-light">
                  {selectedTopic.shortDescription}
                </p>

                <div className="rounded-xl bg-[#08090B] p-3.5 border border-[rgba(242,245,248,0.08)] mb-5 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#03E29C]">
                    Target Concepts
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedTopic.keyConcepts.slice(0, 3).map((concept, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-[#16191F] px-2.5 py-0.5 text-[11px] text-[#F3F4F6] border border-[rgba(242,245,248,0.08)]"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(`/practice/session/${selectedTopic.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#03E29C] py-3 text-sm font-semibold text-[#08090B] shadow-lg shadow-[#03E29C]/15 hover:bg-[#00FFAF] active:scale-95 transition-all"
                  >
                    <span>Enter Practice Arena</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleSpin}
                    disabled={isSpinning}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border border-[rgba(242,245,248,0.12)] bg-[#16191F] px-4 py-3 text-sm font-medium text-[#F3F4F6] hover:text-white hover:border-[#03E29C]/50 transition-colors ${
                      isSpinning ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <RotateCw className="h-4 w-4" />
                    <span>Spin Again</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[rgba(242,245,248,0.1)] bg-[#0B0D11] p-7 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#03E29C]/10 text-[#03E29C] mb-3 border border-[#03E29C]/20">
                  <RotateCw className={`h-6 w-6 ${isSpinning ? 'animate-spin' : ''}`} />
                </div>
                <h4 className="text-sm font-medium text-white">
                  {isSpinning ? 'Roulette ball spinning...' : 'Ready for Next Draw'}
                </h4>
                <p className="text-xs text-[#8E959E] mt-1 max-w-xs mx-auto leading-relaxed font-light">
                  {isSpinning
                    ? 'Synchronizing rotation with the casino roulette sequence.'
                    : 'Select your filters below and click SPIN to initiate the authentic roulette sequence.'}
                </p>
              </div>
            )}

            {/* Filters Control Box */}
            <div className="rounded-2xl border border-[rgba(242,245,248,0.08)] bg-[#0F1115] p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-[rgba(242,245,248,0.08)] pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-white/80 flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-[#03E29C]" />
                  Roulette Filters
                </span>
                <span className="text-xs text-[#8E959E]">
                  {selectedCategories.length === 0 ? 'All Categories' : `${selectedCategories.length} selected`}
                </span>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="text-xs font-medium text-[#8E959E] mb-2 block">
                  Difficulty
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
                    <button
                      key={diff}
                      disabled={isSpinning}
                      onClick={() => !isSpinning && setSelectedDifficulty(diff)}
                      className={`rounded-lg py-1.5 text-xs transition-all ${
                        selectedDifficulty === diff
                          ? 'bg-[#03E29C] text-[#08090B] font-semibold shadow-sm'
                          : 'border border-[rgba(242,245,248,0.08)] bg-[#08090B] text-[#8E959E] hover:text-white'
                      } ${isSpinning ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Toggles */}
              <div>
                <label className="text-xs font-medium text-[#8E959E] mb-2 block">
                  Categories ({WHEEL_CATEGORIES.length})
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {WHEEL_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategories.includes(cat.category);
                    return (
                      <button
                        key={cat.category}
                        disabled={isSpinning}
                        onClick={() => toggleCategory(cat.category)}
                        className={`flex items-center gap-2 rounded-xl p-2 text-left text-xs border transition-all ${
                          isSelected
                            ? 'border-[#03E29C] bg-[#03E29C]/10 text-white font-medium shadow-sm'
                            : 'border-[rgba(242,245,248,0.08)] bg-[#08090B] text-[#8E959E] hover:text-white'
                        } ${isSpinning ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              <div className="pt-2 border-t border-[rgba(242,245,248,0.08)]">
                <label className={`flex items-center justify-between ${isSpinning ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-white">
                      Include Due Revisions Only
                    </span>
                    <span className="text-[11px] text-[#8E959E]">
                      SM-2 algorithm scheduled for today
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    disabled={isSpinning}
                    checked={onlyDueRevisions}
                    onChange={(e) => setOnlyDueRevisions(e.target.checked)}
                    className="h-4 w-4 rounded border-[rgba(242,245,248,0.15)] bg-[#08090B] text-[#03E29C] focus:ring-[#03E29C]"
                  />
                </label>
              </div>

              {eligibleTopics.length === 0 && (
                <div className="flex items-center gap-2 rounded-xl bg-[#03E29C]/10 p-3 text-xs text-[#03E29C] border border-[#03E29C]/25">
                  <AlertCircle className="h-4 w-4 shrink-0 text-[#03E29C]" />
                  <span>No topics match this filter combination. Try resetting filters.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DAILY CHALLENGE MODE */}
      {practiceMode === 'daily' && dailyTopic && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="rounded-3xl border border-[rgba(242,245,248,0.12)] bg-[#0F1115] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-1.5 rounded-full bg-[#03E29C]/10 px-3 py-1 text-xs font-semibold text-[#03E29C] border border-[#03E29C]/25">
                <Calendar className="h-3.5 w-3.5 text-[#03E29C]" />
                Daily Deterministic Challenge — {todayStr}
              </span>
              <span className="rounded-md bg-[#16191F] px-2.5 py-1 text-xs font-mono text-[#8E959E] border border-[rgba(242,245,248,0.08)]">
                {dailyTopic.category}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-sans font-medium text-white mb-3">
              {dailyTopic.title}
            </h2>

            <p className="text-sm text-[#8E959E] mb-6 leading-relaxed font-light">
              {dailyTopic.shortDescription}
            </p>

            <div className="rounded-2xl border border-[rgba(242,245,248,0.08)] bg-[#08090B] p-5 mb-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#03E29C] block mb-1.5">
                Today's Interview Prompt
              </span>
              <p className="text-sm sm:text-base font-normal text-white">
                "{dailyTopic.interviewQuestion}"
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate(`/practice/session/${dailyTopic.id}`)}
                disabled={isSpinning}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#03E29C] px-6 py-3.5 text-sm font-semibold text-[#08090B] shadow-lg shadow-[#03E29C]/15 hover:bg-[#00FFAF] active:scale-95 transition-all ${
                  isSpinning ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span>Accept Today's Challenge</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={handleSpinForDaily}
                disabled={isSpinning}
                className={`flex items-center gap-2 rounded-xl border border-[rgba(242,245,248,0.12)] bg-[#16191F] px-5 py-3.5 text-sm font-medium text-[#F3F4F6] hover:text-white transition-colors ${
                  isSpinning ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <RotateCw className={`h-4 w-4 ${isSpinning ? 'animate-spin text-[#03E29C]' : ''}`} />
                <span>{isSpinning ? 'Spinning...' : 'Spin Wheel for Today'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STRUCTURED SYLLABUS MODE */}
      {practiceMode === 'syllabus' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[rgba(242,245,248,0.08)] pb-3">
            <p className="text-xs text-[#8E959E]">
              Browse all curriculum topics by domain. Select any question to begin an immediate session.
            </p>
            <span className="text-xs font-mono text-[#03E29C]">{TOPICS.length} Total Topics</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOPICS.map((topic) => {
              const status = getTopicStatus(topic.id);
              return (
                <div
                  key={topic.id}
                  className="rounded-2xl border border-[rgba(242,245,248,0.08)] bg-[#0F1115] p-5 flex flex-col justify-between hover:border-[#03E29C]/40 transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="rounded-md bg-[#16191F] px-2 py-0.5 text-[10px] font-mono text-[#03E29C] border border-[rgba(242,245,248,0.08)]">
                        {topic.category}
                      </span>
                      <span className="text-[11px] text-[#555B64] font-mono">
                        ~{topic.estimatedMinutes}m
                      </span>
                    </div>

                    <h4 className="text-base font-sans font-medium text-white mb-1.5 leading-snug group-hover:text-[#03E29C] transition-colors">
                      {topic.title}
                    </h4>
                    <p className="text-xs text-[#8E959E] line-clamp-2 mb-4 leading-relaxed font-light">
                      {topic.shortDescription}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[rgba(242,245,248,0.08)]">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                        status === 'strong'
                          ? 'bg-[#03E29C]/15 text-[#03E29C] border border-[#03E29C]/30'
                          : status === 'attempted'
                          ? 'bg-white/[0.05] text-white/70'
                          : 'bg-white/[0.02] text-[#555B64]'
                      }`}
                    >
                      {status.replace('_', ' ')}
                    </span>

                    <button
                      onClick={() => navigate(`/practice/session/${topic.id}`)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#03E29C] hover:text-[#00FFAF] transition-colors"
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
