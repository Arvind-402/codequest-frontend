import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Flame,
  Sparkles,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  Cpu,
  Database,
  Network,
  Layers,
  Code2,
  UserCheck,
  Disc,
} from 'lucide-react';
import { LiquidSculpture } from '../components/canvas/LiquidSculpture';
import { useCodeQuest } from '../context/CodeQuestContext';
import { TOPICS } from '../data/topics';
import { WHEEL_CATEGORIES } from '../utils/wheel';
import { getLevelProgress } from '../utils/xp';
import type { Category } from '../types/topic';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentStreak, longestStreak, totalXP, sessions, dailyGoalCount, todayCompletedCount } = useCodeQuest();
  const levelInfo = getLevelProgress(totalXP);

  // Compute completed topic IDs from sessions
  const completedTopicIds = useMemo(() => {
    return Array.from(new Set(sessions.map((s) => s.topicId)));
  }, [sessions]);

  // Active step in Section B (MK Vision Perspective Stacked Cards)
  const [activeRitualStep, setActiveRitualStep] = useState(0);

  // Active category in Section C (Explore Curriculum)
  const [selectedCategory, setSelectedCategory] = useState<Category>('DSA');

  const ritualSteps = [
    {
      num: '01',
      title: 'SPIN',
      tagline: 'Break interview paralysis with authentic roulette randomness.',
      desc: 'The interactive arena spins across 8 foundational engineering disciplines. Eliminating cherry-picking trains you to tackle unforeseen questions under authentic interview pressure.',
      detail: 'Physics-calibrated wheel with casino roulette acoustics and verified wedge geometry.',
      icon: Disc,
      tag: 'Curriculum Roulette',
    },
    {
      num: '02',
      title: 'THINK',
      tagline: 'Train active unassisted retrieval from first principles.',
      desc: 'Before peeking at solution hints, you have a dedicated timed window to mentally architect your solution, identify edge constraints, and formulate time & space complexity bounds.',
      detail: 'Active recall strengthens neural pathways significantly faster than passive code reading.',
      icon: Cpu,
      tag: 'First Principles',
    },
    {
      num: '03',
      title: 'EXPLAIN',
      tagline: 'Articulate your logic like a Staff Engineer.',
      desc: 'Type or dictate your technical rationale into the structured workspace. Interviewers evaluate how articulately you communicate trade-offs, defend assumptions, and justify algorithms.',
      detail: 'Core concepts tracker, markdown workspace, and live pacing telemetry.',
      icon: Terminal,
      tag: 'Verbal Delivery',
    },
    {
      num: '04',
      title: 'REFLECT',
      tagline: 'Calibrate your cognitive blind spots with canonical rubrics.',
      desc: 'Unlock verified industry solution blueprints, multi-language code implementations, and complexity rubrics. Self-assess your completeness and correctness on a 5-star rubric.',
      detail: 'Side-by-side comparison with production-grade solution architectures.',
      icon: CheckCircle2,
      tag: 'Self Calibration',
    },
    {
      num: '05',
      title: 'REPEAT',
      tagline: 'Lock concepts permanently into memory with SM-2 intervals.',
      desc: 'Every session updates the SM-2 Spaced Repetition engine. Unfamiliar concepts resurface promptly; mastered topics return right before memory decay sets in.',
      detail: 'Automated revision queue and streak telemetry persisted in private client storage.',
      icon: RotateCcw,
      tag: 'Spaced Repetition',
    },
  ];

  const categoryIcons: Record<Category, React.ElementType> = {
    DSA: Cpu,
    OOPS: Layers,
    PROGRAMMING: Code2,
    DBMS: Database,
    OS: Terminal,
    NETWORKS: Network,
    SYSTEM_DESIGN: Layers,
    BEHAVIORAL: UserCheck,
    PROJECT_DEFENSE: ShieldCheck,
  };

  const selectedCategoryTopics = TOPICS.filter((t) => t.category === selectedCategory);
  const selectedCategoryMeta = WHEEL_CATEGORIES.find((c) => c.category === selectedCategory) || WHEEL_CATEGORIES[0];

  return (
    <div className="relative w-full bg-[#08090B] text-[#F3F4F6] overflow-x-hidden selection:bg-[#03E29C]/30 selection:text-white">
      {/* SECTION A: MK VISION STUDIO EDITORIAL HERO */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between px-4 sm:px-8 lg:px-16 pt-8 pb-12 overflow-hidden border-b border-[rgba(242,245,248,0.08)]">
        {/* 3D Perspective Sliding Core */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-90 sm:opacity-95">
          <LiquidSculpture intensity={1.1} interactive={true} />
        </div>

        {/* Ambient Subtle Architectural Glows */}
        <div className="absolute top-1/4 -left-20 w-[30rem] h-[30rem] rounded-full bg-[#03E29C]/[0.06] blur-[150px] pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-[36rem] h-[36rem] rounded-full bg-[#0F1115]/[0.4] blur-[160px] pointer-events-none" />

        {/* Top Minimal Editorial Metadata */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono tracking-widest text-[#8E959E] uppercase pt-2">
          <div className="flex items-center gap-3">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#03E29C] animate-pulse" />
            <span className="text-white font-medium">Daily Technical Practice</span>
            <span className="text-white/20">/</span>
            <span className="hidden sm:inline text-[#8E959E]">Algorithms &bull; Systems &bull; Architecture</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#8E959E] hidden md:inline">52 Curated Topics</span>
            <span className="text-white/20 hidden md:inline">/</span>
            <span className="px-3 py-1 rounded-full border border-[rgba(242,245,248,0.12)] bg-[#0F1115]/80 text-[#03E29C] font-mono text-xs backdrop-blur-md">
              Zero-Backend &bull; 100% Private
            </span>
          </div>
        </div>

        {/* Hero Headline & Editorial Composition */}
        <div className="relative z-10 max-w-5xl my-auto py-12 sm:py-20">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[rgba(242,245,248,0.12)] bg-[#0F1115]/80 backdrop-blur-md text-xs text-[#8E959E] mb-8 sm:mb-10 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#03E29C]" />
            <span className="font-mono uppercase tracking-wider text-[11px] text-[#03E29C]">Studio Edition</span>
            <span className="text-white/20">&bull;</span>
            <span className="text-[#F3F4F6] font-medium">Unprompted active recall</span>
          </div>

          <h1 className="hero-headline text-5xl sm:text-7xl md:text-8xl lg:text-[7.6rem] font-sans font-medium tracking-tight text-white select-none leading-[0.93]">
            <span className="block text-white transition-transform duration-700 hover:translate-x-2">
              YOUR NEXT
            </span>
            <span className="block">
              INTERVIEW <span className="font-italic-accent text-[#03E29C]">Starts</span>
            </span>
            <span className="block text-white flex items-center gap-4 flex-wrap">
              <span>RIGHT HERE</span>
              <span className="inline-block h-3.5 w-3.5 sm:h-5 sm:w-5 rounded-full bg-[#03E29C] shadow-[0_0_16px_rgba(3,226,156,0.5)]" />
            </span>
          </h1>

          <div className="mt-8 sm:mt-12 max-w-xl">
            <p className="text-base sm:text-lg text-[#8E959E] font-light leading-relaxed">
              Cultivate instinctive software engineering recall one challenge at a time. Spin the wheel, articulate your architecture under simulated constraints, and lock it into permanent memory.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/practice"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#03E29C] text-[#08090B] font-semibold text-sm tracking-wide transition-all duration-300 hover:bg-[#00FFAF] hover:shadow-[0_0_30px_rgba(3,226,156,0.35)] active:scale-95"
              >
                <Compass className="h-4 w-4 text-[#08090B] group-hover:rotate-45 transition-transform" />
                <span>Enter the Arena</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#ritual"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-[rgba(242,245,248,0.12)] bg-[#0F1115]/60 text-[#F3F4F6] text-sm font-medium tracking-wide hover:border-[rgba(242,245,248,0.3)] hover:bg-[#16191F] transition-all backdrop-blur-sm"
              >
                <span>The 5-Stage System</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Hero Footer Meta */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-[rgba(242,245,248,0.08)] text-xs text-[#8E959E] font-mono">
          <div className="flex items-center gap-6">
            <span>&bull; REAL CASINO ROULETTE AUDIO</span>
            <span className="hidden sm:inline">&bull; ZERO SPOILER RETRIEVAL</span>
            <span className="hidden md:inline">&bull; SM-2 SPACED REPETITION ENGINE</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#555B64]">SCROLL TO EXPLORE</span>
            <div className="h-4 w-px bg-[#03E29C] animate-bounce" />
          </div>
        </div>
      </section>

      {/* SECTION B: THE PRACTICE RITUAL (MK VISION STUDIO STACKING CARDS) */}
      <section id="ritual" className="relative py-24 sm:py-36 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto border-b border-[rgba(242,245,248,0.08)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-24">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 font-mono text-xs text-[#03E29C] tracking-widest uppercase mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#03E29C]" />
              <span>Section 02 &bull; The Practice Ritual</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-sans font-medium text-white tracking-tight leading-tight">
              A 5-Stage System For <span className="font-italic-accent text-[#03E29C]">Mastery</span>.
            </h2>
          </div>
          <p className="text-[#8E959E] text-sm max-w-sm leading-relaxed font-light">
            Move beyond passive code consumption. CodeQuest guides you to recall, articulate, and defend solutions under authentic interview conditions.
          </p>
        </div>

        {/* Interactive Perspective Stacking Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Stage Selector Tabs */}
          <div className="lg:col-span-5 space-y-3">
            {ritualSteps.map((step, idx) => {
              const isActive = activeRitualStep === idx;
              return (
                <div
                  key={step.num}
                  onClick={() => setActiveRitualStep(idx)}
                  className={`group cursor-pointer p-5 rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? 'border-[#03E29C]/50 bg-[#0F1115] shadow-lg shadow-[#03E29C]/5'
                      : 'border-[rgba(242,245,248,0.06)] bg-transparent hover:border-[rgba(242,245,248,0.18)] hover:bg-[#0F1115]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span
                        className={`font-mono text-base font-bold transition-colors ${
                          isActive ? 'text-[#03E29C]' : 'text-[#555B64] group-hover:text-[#8E959E]'
                        }`}
                      >
                        {step.num}
                      </span>
                      <h3
                        className={`text-lg font-sans transition-colors ${
                          isActive ? 'text-white font-semibold' : 'text-[#8E959E] group-hover:text-white'
                        }`}
                      >
                        {step.title}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-[rgba(242,245,248,0.08)] text-[#8E959E]">
                      {step.tag}
                    </span>
                  </div>

                  <p className="text-xs text-[#8E959E] mt-2 line-clamp-1 font-light">
                    {step.tagline}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right: MK Vision Studio Featured Stack Card */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl border border-[rgba(242,245,248,0.08)] bg-[#0F1115] p-8 sm:p-12 overflow-hidden shadow-2xl">
              {/* Giant Background Number Callout */}
              <div className="absolute right-6 -bottom-6 font-mono text-[120px] sm:text-[160px] font-bold text-white/[0.03] select-none pointer-events-none leading-none">
                {ritualSteps[activeRitualStep].num}
              </div>

              <div className="relative z-10 flex flex-col justify-between min-h-[380px]">
                <div>
                  <div className="flex items-center justify-between border-b border-[rgba(242,245,248,0.08)] pb-6 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#03E29C]/10 border border-[#03E29C]/25 flex items-center justify-center text-[#03E29C]">
                        {React.createElement(ritualSteps[activeRitualStep].icon, { className: 'h-5 w-5' })}
                      </div>
                      <div>
                        <span className="font-mono text-[11px] text-[#03E29C] uppercase tracking-widest block">
                          Stage {ritualSteps[activeRitualStep].num}
                        </span>
                        <h4 className="text-2xl font-sans font-medium text-white tracking-tight mt-0.5">
                          {ritualSteps[activeRitualStep].title} &bull; <span className="text-[#8E959E] font-normal">{ritualSteps[activeRitualStep].tagline}</span>
                        </h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-base text-[#F3F4F6]/80 leading-relaxed font-light mb-8">
                    {ritualSteps[activeRitualStep].desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-[rgba(242,245,248,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-[#8E959E] font-mono">
                    <span className="text-[#03E29C] font-semibold">Architecture Detail: </span>
                    {ritualSteps[activeRitualStep].detail}
                  </div>

                  <button
                    onClick={() => navigate('/practice')}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#03E29C] hover:text-white transition-colors"
                  >
                    <span>Launch in Arena</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: CURRICULUM MATRIX */}
      <section className="relative py-24 sm:py-36 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto border-b border-[rgba(242,245,248,0.08)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#03E29C] tracking-widest uppercase mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#03E29C]" />
              <span>Section 03 &bull; Curated Syllabus</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-sans font-medium text-white tracking-tight leading-tight">
              Explore Your <span className="font-italic-accent text-[#03E29C]">Knowledge</span>.
            </h2>
          </div>
          <Link
            to="/topics"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#03E29C] hover:text-white uppercase tracking-wider border-b border-[#03E29C]/30 pb-1 transition-colors"
          >
            <span>Complete Curriculum ({TOPICS.length} Questions)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-8">
          {WHEEL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.category;
            const Icon = categoryIcons[cat.category] || Code2;
            const topicCount = TOPICS.filter((t) => t.category === cat.category).length;

            return (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(cat.category)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 border ${
                  isSelected
                    ? 'border-[#03E29C] text-[#08090B] bg-[#03E29C] shadow-md shadow-[#03E29C]/20 font-semibold'
                    : 'border-[rgba(242,245,248,0.08)] text-[#8E959E] bg-[#0F1115] hover:border-[rgba(242,245,248,0.2)] hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{cat.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-black/25 text-[#08090B]' : 'bg-white/5 text-[#8E959E]'}`}>
                  {topicCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Category Matrix Grid */}
        <div className="rounded-3xl border border-[rgba(242,245,248,0.08)] bg-[#0B0D11] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[rgba(242,245,248,0.08)] pb-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#03E29C]">
                Curriculum Track
              </span>
              <h3 className="text-2xl font-sans font-medium text-white mt-0.5">
                {selectedCategoryMeta.label}
              </h3>
            </div>
            <Link
              to="/topics"
              className="text-xs font-medium text-[#03E29C] hover:text-white transition-colors inline-flex items-center gap-1"
            >
              Browse all {selectedCategoryTopics.length} questions <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedCategoryTopics.slice(0, 6).map((topic) => (
              <div
                key={topic.id}
                onClick={() => navigate(`/practice/session/${topic.id}`)}
                className="group cursor-pointer rounded-2xl border border-[rgba(242,245,248,0.08)] bg-[#0F1115] p-5 hover:border-[#03E29C]/50 hover:bg-[#14171E] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#03E29C]">
                      {topic.difficulty}
                    </span>
                    <span className="text-[10px] font-mono text-[#555B64]">
                      ~{topic.estimatedMinutes}m
                    </span>
                  </div>
                  <h4 className="text-sm font-sans font-medium text-white group-hover:text-[#03E29C] transition-colors line-clamp-2">
                    {topic.title}
                  </h4>
                  <p className="text-xs text-[#8E959E] mt-2 line-clamp-2 leading-relaxed font-light">
                    {topic.shortDescription}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[rgba(242,245,248,0.08)] flex items-center justify-between text-[11px] text-[#8E959E]">
                  <span className="truncate max-w-[160px]">{topic.tags[0] || topic.category}</span>
                  <span className="font-semibold text-white group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Practice <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION D: CONSISTENCY IS A SUPERPOWER */}
      <section className="relative py-24 sm:py-36 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto border-b border-[rgba(242,245,248,0.08)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#03E29C] tracking-widest uppercase mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#03E29C]" />
              <span>Section 04 &bull; Habit Engineering</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-sans font-medium text-white tracking-tight leading-tight">
              Consistency Is A <span className="font-italic-accent text-[#03E29C]">Superpower</span>.
            </h2>
          </div>
          <p className="text-[#8E959E] text-sm max-w-sm leading-relaxed font-light">
            A single 15-minute challenge every day creates unstoppable engineering recall. Your active telemetry:
          </p>
        </div>

        {/* 4 Studio Metric Panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="relative rounded-3xl border border-[rgba(242,245,248,0.08)] bg-[#0F1115] p-6 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[#8E959E]">Current Streak</span>
              <div className="h-8 w-8 rounded-full bg-[#03E29C]/10 border border-[#03E29C]/25 flex items-center justify-center text-[#03E29C]">
                <Flame className="h-4 w-4" />
              </div>
            </div>
            <div className="my-6">
              <div className="text-5xl font-sans font-semibold text-white tracking-tight">{currentStreak}</div>
              <span className="text-xs text-[#8E959E] mt-1 block font-light">
                {currentStreak > 0 ? 'Active consecutive days' : 'Begin your streak today'}
              </span>
            </div>
            <div className="pt-4 border-t border-[rgba(242,245,248,0.08)] text-xs text-[#555B64] font-mono">
              All-time record: <strong className="text-white">{longestStreak} days</strong>
            </div>
          </div>

          <div className="relative rounded-3xl border border-[rgba(242,245,248,0.08)] bg-[#0F1115] p-6 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[#8E959E]">Experience Points</span>
              <div className="h-8 w-8 rounded-full bg-[#03E29C]/10 border border-[#03E29C]/25 flex items-center justify-center text-[#03E29C]">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div className="my-6">
              <div className="text-5xl font-sans font-semibold text-white tracking-tight">{totalXP}</div>
              <span className="text-xs text-[#8E959E] mt-1 block font-light">Level {levelInfo.level} Engineer</span>
            </div>
            <div className="pt-4 border-t border-[rgba(242,245,248,0.08)]">
              <div className="w-full bg-[#16191F] h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#03E29C] transition-all duration-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-[#555B64] font-mono block mt-1.5">
                {levelInfo.xpRemainingToNext} XP to Level {levelInfo.level + 1}
              </span>
            </div>
          </div>

          <div className="relative rounded-3xl border border-[rgba(242,245,248,0.08)] bg-[#0F1115] p-6 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[#8E959E]">Topics Mastered</span>
              <div className="h-8 w-8 rounded-full bg-[#03E29C]/10 border border-[#03E29C]/25 flex items-center justify-center text-[#03E29C]">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="my-6">
              <div className="text-5xl font-sans font-semibold text-white tracking-tight">
                {completedTopicIds.length} <span className="text-xl text-[#555B64] font-normal">/ {TOPICS.length}</span>
              </div>
              <span className="text-xs text-[#8E959E] mt-1 block font-light">
                {Math.round((completedTopicIds.length / TOPICS.length) * 100)}% syllabus coverage
              </span>
            </div>
            <div className="pt-4 border-t border-[rgba(242,245,248,0.08)] text-xs text-[#555B64] font-mono">
              Total questions available: <strong className="text-white">{TOPICS.length}</strong>
            </div>
          </div>

          <div className="relative rounded-3xl border border-[rgba(242,245,248,0.08)] bg-[#0F1115] p-6 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[#8E959E]">Daily Objective</span>
              <div className="h-8 w-8 rounded-full bg-[#03E29C]/10 border border-[#03E29C]/25 flex items-center justify-center text-[#03E29C]">
                <Terminal className="h-4 w-4" />
              </div>
            </div>
            <div className="my-6">
              <div className="text-5xl font-sans font-semibold text-white tracking-tight">
                {todayCompletedCount} <span className="text-xl text-[#555B64] font-normal">/ {dailyGoalCount}</span>
              </div>
              <span className="text-xs text-[#8E959E] mt-1 block font-light">
                {todayCompletedCount >= dailyGoalCount ? 'Target accomplished today' : '1 challenge needed today'}
              </span>
            </div>
            <div className="pt-4 border-t border-[rgba(242,245,248,0.08)] flex items-center justify-between">
              <Link
                to="/dashboard"
                className="text-xs font-semibold text-[#03E29C] hover:text-white transition-colors inline-flex items-center gap-1"
              >
                Open Dashboard <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION E: ENTER THE ARENA */}
      <section className="relative py-28 sm:py-40 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto overflow-hidden">
        <div className="relative z-10 rounded-3xl border border-[rgba(242,245,248,0.12)] bg-[#0B0D11] p-8 sm:p-16 lg:p-20 text-center shadow-2xl">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-3.5 py-1 rounded-full border border-[rgba(242,245,248,0.08)] bg-[#08090B] text-xs font-mono tracking-widest text-[#03E29C] uppercase mb-6">
              Instant Session &bull; Zero Backend Friction
            </span>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-sans font-medium tracking-tight text-white uppercase leading-[0.96] mb-8">
              Enter The <span className="font-italic-accent text-[#03E29C] lowercase">Arena</span>.
            </h2>

            <p className="text-base sm:text-lg text-[#8E959E] font-light leading-relaxed max-w-xl mx-auto mb-10">
              Spin the roulette wheel, articulate your solution against verified industry rubrics, and achieve permanent interview confidence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/practice"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-[#03E29C] text-[#08090B] font-semibold text-sm tracking-wide transition-all duration-300 hover:bg-[#00FFAF] hover:shadow-[0_0_36px_rgba(3,226,156,0.35)] active:scale-95"
              >
                <Compass className="h-4 w-4" />
                <span>Launch Roulette Arena</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-5 rounded-full border border-[rgba(242,245,248,0.12)] bg-[#0F1115] text-[#F3F4F6] text-sm font-medium hover:border-[rgba(242,245,248,0.3)] transition-all backdrop-blur-sm"
              >
                <span>View Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MINIMAL ARCHITECTURAL FOOTER */}
      <footer className="border-t border-[rgba(242,245,248,0.08)] bg-[#08090B] py-14 px-4 sm:px-8 lg:px-16 text-xs text-[#8E959E]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2 text-white font-sans font-bold text-base tracking-tight">
              <span className="h-2 w-2 rounded-full bg-[#03E29C]" />
              <span>CODEQUEST</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-[rgba(242,245,248,0.12)] text-[#03E29C]">
                STUDIO
              </span>
            </div>
            <p className="text-[#555B64] text-xs text-center md:text-left">
              Architectural engineering interview preparation with unprompted active recall.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-[#8E959E]">
            <Link to="/practice" className="hover:text-white transition-colors">
              ARENA
            </Link>
            <Link to="/topics" className="hover:text-white transition-colors">
              SYLLABUS
            </Link>
            <Link to="/revision" className="hover:text-white transition-colors">
              SPACED REPETITION
            </Link>
            <Link to="/dashboard" className="hover:text-white transition-colors">
              DASHBOARD
            </Link>
            <Link to="/profile" className="hover:text-white transition-colors">
              PROFILE & GOALS
            </Link>
          </div>

          <div className="text-[11px] font-mono text-[#555B64]">
            &copy; {new Date().getFullYear()} CODEQUEST STUDIO &bull; ARCHITECTURAL EDITION
          </div>
        </div>
      </footer>
    </div>
  );
};
