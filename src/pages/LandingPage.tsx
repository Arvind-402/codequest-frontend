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

  // Active step in Section B (The Practice Ritual)
  const [activeRitualStep, setActiveRitualStep] = useState(0);

  // Active category in Section C (Explore Your Knowledge)
  const [selectedCategory, setSelectedCategory] = useState<Category>('DSA');

  const ritualSteps = [
    {
      num: '01',
      title: 'SPIN',
      tagline: 'Break interview paralysis.',
      desc: 'The interactive arena randomly selects an authentic interview topic across 8 engineering disciplines. No cherry-picking easy questions; you prepare for the true randomness of live interview loops.',
      detail: 'Physics-calibrated wheel with haptic feedback and balanced randomness.',
      icon: Disc,
      tag: 'Challenge Discovery',
    },
    {
      num: '02',
      title: 'THINK',
      tagline: 'Train unassisted retrieval.',
      desc: 'Before peeking at solution hints or notes, you have a timed interval to mentally structure your approach, identify trade-offs, and establish time & space invariants from first principles.',
      detail: 'Active recall strengthens synaptic pathways 3x faster than passive reading.',
      icon: Cpu,
      tag: 'First Principles',
    },
    {
      num: '03',
      title: 'EXPLAIN',
      tagline: 'Articulate like a Staff Engineer.',
      desc: 'Type or speak your complete thought process into the structured explanation canvas. Great interviewers hire clear thinkers who can defend their architecture, explain edge cases, and justify algorithmic choices.',
      detail: 'Key concepts checklist, syntax highlighting, and live time management.',
      icon: Terminal,
      tag: 'Verbal Delivery',
    },
    {
      num: '04',
      title: 'REFLECT',
      tagline: 'Calibrate your blind spots.',
      desc: 'Reveal the canonical solution notes, code implementations, and optimal complexity rubrics. Self-assess your correctness, completeness, and clarity on a rigorous 5-star rubric.',
      detail: 'Compare your explanation side-by-side with industry-vetted solution blueprints.',
      icon: CheckCircle2,
      tag: 'Self Calibration',
    },
    {
      num: '05',
      title: 'REPEAT',
      tagline: 'Lock into long-term memory.',
      desc: 'Every session updates the SM-2 Spaced Repetition scheduling engine. Hard concepts reappear tomorrow; mastered topics resurface right before memory decay sets in.',
      detail: 'Streaks, daily targets, and dynamic review queue automated in local storage.',
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
    <div className="relative w-full bg-[#0e0f11] text-[#fcf8d8] overflow-x-hidden selection:bg-[#dd700b]/30 selection:text-[#fcf8d8]">
      {/* SECTION A: CINEMATIC HERO */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between px-4 sm:px-8 lg:px-12 pt-8 pb-12 overflow-hidden border-b border-[#d9dadf]/10">
        {/* Abstract 3D Liquid Sculpture with Frozen Mist rim reflections */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-90 sm:opacity-100">
          <LiquidSculpture intensity={1.15} interactive={true} />
        </div>

        {/* Ambient lighting glows (Burnished amber #DD700B & Pale Frost #D9DADF) */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-[#dd700b]/[0.10] blur-[110px] pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-[30rem] h-[30rem] rounded-full bg-[#d9dadf]/[0.08] blur-[130px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-[#adaca7]/[0.06] blur-[90px] pointer-events-none" />

        {/* Top Minimal Editorial Floating Metadata */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono tracking-widest text-[#adaca7] uppercase pt-2">
          <div className="flex items-center gap-3">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#dd700b] animate-pulse" />
            <span className="text-[#fcf8d8] font-medium">Daily Technical Practice</span>
            <span className="text-[#7c7d75]">/</span>
            <span className="hidden sm:inline text-[#d9dadf]">DSA &bull; Systems &bull; Architecture</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#adaca7] hidden md:inline">52 Curated Topics</span>
            <span className="text-[#7c7d75] hidden md:inline">/</span>
            <span className="px-2.5 py-1 rounded-full border border-[#d9dadf]/15 bg-[#181a1d]/60 text-[#d9dadf] font-sans normal-case text-xs backdrop-blur-md">
              Zero-Backend &bull; 100% Private
            </span>
          </div>
        </div>

        {/* Hero Headline & Editorial Composition */}
        <div className="relative z-10 max-w-6xl my-auto py-12 sm:py-16">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[#d9dadf]/15 bg-[#181a1d]/70 backdrop-blur-md text-xs text-[#d9dadf] mb-8 sm:mb-10 shadow-2xl">
            <span className="h-2 w-2 rounded-full bg-[#dd700b]" />
            <span className="font-mono uppercase tracking-wider text-[11px] text-[#adaca7]">CodeQuest Mist</span>
            <span className="text-[#7c7d75]">&bull;</span>
            <span className="text-[#fcf8d8] font-medium">Your next level starts with one question</span>
          </div>

          <h1 className="hero-headline text-5xl sm:text-7xl md:text-8xl lg:text-[7.2rem] font-black tracking-tight text-[#fcf8d8] uppercase select-none leading-[0.92]">
            <span className="block text-[#fcf8d8] transition-transform duration-700 hover:translate-x-2">
              YOUR NEXT
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#fcf8d8] via-[#d9dadf] to-[#adaca7]">
              INTERVIEW
            </span>
            <span className="block text-[#fcf8d8] flex items-center gap-4 flex-wrap">
              <span>STARTS HERE</span>
              <span className="inline-block h-4 w-4 sm:h-6 sm:w-6 rounded-full bg-[#dd700b] shadow-[0_0_24px_#dd700b]" />
            </span>
          </h1>

          <div className="mt-8 sm:mt-12 max-w-xl">
            <p className="text-base sm:text-lg text-[#d9dadf] font-normal leading-relaxed">
              Build technical confidence one challenge at a time. Practice, explain, improve, repeat. 
              Engineered for software engineers preparing for top-tier product and systems interviews.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/practice"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#dd700b] text-[#fcf8d8] font-bold text-sm tracking-wide uppercase transition-all duration-300 hover:bg-[#b85806] hover:shadow-[0_0_36px_rgba(221,112,11,0.45)] active:scale-95"
              >
                <Compass className="h-4 w-4 text-[#fcf8d8] group-hover:rotate-45 transition-transform" />
                <span>Enter the Arena</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#ritual"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-[#d9dadf]/20 bg-[#181a1d]/40 text-[#d9dadf] text-sm font-medium tracking-wide hover:border-[#dd700b]/40 hover:bg-[#181a1d]/80 hover:text-[#fcf8d8] transition-all backdrop-blur-sm"
              >
                <span>Explore the Method</span>
                <ChevronRight className="h-4 w-4 text-[#adaca7]" />
              </a>
            </div>
          </div>
        </div>

        {/* Hero Bottom Floating Indicators */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-t border-[#d9dadf]/10 pt-6 text-xs text-[#adaca7] font-mono">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[10px] text-[#7c7d75] block uppercase tracking-wider">Methodology</span>
              <span className="text-[#fcf8d8] font-semibold font-sans">Active Recall + SM-2 Spaced Repetition</span>
            </div>
            <div className="h-6 w-px bg-[#d9dadf]/15" />
            <div>
              <span className="text-[10px] text-[#7c7d75] block uppercase tracking-wider">Target Roles</span>
              <span className="text-[#fcf8d8] font-semibold font-sans">SDE I &bull; SDE II &bull; Systems Engineers</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[#7c7d75] text-[11px]">SCROLL TO EXPLORE</span>
            <div className="h-4 w-px bg-[#dd700b]/60 animate-bounce" />
          </div>
        </div>
      </section>

      {/* SECTION B: THE PRACTICE RITUAL */}
      <section id="ritual" className="relative py-24 sm:py-36 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto border-b border-[#d9dadf]/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-24">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 font-mono text-xs text-[#dd700b] tracking-widest uppercase mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#dd700b]" />
              <span>Section 02 &bull; The Practice Ritual</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#fcf8d8] tracking-tight uppercase leading-tight">
              A 5-Stage System For Deep Technical Mastery.
            </h2>
          </div>
          <p className="text-[#adaca7] text-sm max-w-sm leading-relaxed">
            Move past passive video watching. CodeQuest forces you to recall, structure, and defend solutions under simulated interview constraints.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-3">
            {ritualSteps.map((step, idx) => {
              const isActive = activeRitualStep === idx;
              return (
                <div
                  key={step.num}
                  onClick={() => setActiveRitualStep(idx)}
                  className={`group cursor-pointer p-5 rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? 'border-[#dd700b]/40 bg-[#1f2126] shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
                      : 'border-[#d9dadf]/10 bg-transparent hover:border-[#d9dadf]/25 hover:bg-[#181a1d]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span
                        className={`font-mono text-lg font-bold transition-colors ${
                          isActive ? 'text-[#dd700b]' : 'text-[#7c7d75] group-hover:text-[#adaca7]'
                        }`}
                      >
                        {step.num}
                      </span>
                      <h3
                        className={`text-xl font-bold tracking-tight uppercase transition-colors ${
                          isActive ? 'text-[#fcf8d8]' : 'text-[#adaca7] group-hover:text-[#d9dadf]'
                        }`}
                      >
                        {step.title}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-[#d9dadf]/15 text-[#adaca7]">
                      {step.tag}
                    </span>
                  </div>

                  <p className="text-xs text-[#adaca7] mt-2 line-clamp-1">
                    {step.tagline}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-7">
            <div className="relative rounded-3xl border border-[#d9dadf]/15 bg-gradient-to-b from-[#181a1d] to-[#121316] p-8 sm:p-12 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#dd700b]/[0.08] blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col justify-between min-h-[360px]">
                <div>
                  <div className="flex items-center justify-between border-b border-[#d9dadf]/10 pb-6 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#dd700b]/15 border border-[#dd700b]/30 flex items-center justify-center text-[#dd700b]">
                        {React.createElement(ritualSteps[activeRitualStep].icon, { className: 'h-5 w-5' })}
                      </div>
                      <div>
                        <span className="font-mono text-[11px] text-[#adaca7] uppercase tracking-widest block">
                          Stage {ritualSteps[activeRitualStep].num}
                        </span>
                        <h4 className="text-2xl font-black text-[#fcf8d8] uppercase tracking-tight">
                          {ritualSteps[activeRitualStep].title} &bull; {ritualSteps[activeRitualStep].tagline}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-base text-[#d9dadf] leading-relaxed font-normal mb-8">
                    {ritualSteps[activeRitualStep].desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#d9dadf]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-[#adaca7] font-mono">
                    <span className="text-[#fcf8d8] font-semibold">Engineered Detail: </span>
                    {ritualSteps[activeRitualStep].detail}
                  </div>

                  <button
                    onClick={() => navigate('/practice')}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#dd700b] hover:text-[#fcf8d8] transition-colors"
                  >
                    <span>Try In Arena</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: EXPLORE YOUR KNOWLEDGE */}
      <section className="relative py-24 sm:py-36 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto border-b border-[#d9dadf]/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#d9dadf] tracking-widest uppercase mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d9dadf]" />
              <span>Section 03 &bull; Comprehensive Syllabus</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#fcf8d8] tracking-tight uppercase leading-tight">
              Explore Your Knowledge.
            </h2>
          </div>
          <Link
            to="/topics"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#d9dadf] hover:text-[#fcf8d8] uppercase tracking-wider border-b border-[#d9dadf]/25 pb-1"
          >
            <span>View Complete Syllabus ({TOPICS.length} Questions)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

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
                    ? 'border-[#dd700b] text-[#fcf8d8] bg-[#dd700b] font-bold shadow-[0_0_20px_rgba(221,112,11,0.3)]'
                    : 'border-[#d9dadf]/15 text-[#adaca7] bg-[#181a1d] hover:border-[#d9dadf]/30 hover:text-[#fcf8d8]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{cat.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-black/20 text-[#fcf8d8]' : 'bg-white/5 text-[#adaca7]'}`}>
                  {topicCount}
                </span>
              </button>
            );
          })}
        </div>

        <div className="rounded-3xl border border-[#d9dadf]/15 bg-[#141619] p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d9dadf]/10 pb-6 mb-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#d9dadf]">
                Curriculum Focus
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#fcf8d8] mt-1">
                {selectedCategoryMeta.label}
              </h3>
            </div>
            <Link
              to="/topics"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#202226] border border-[#d9dadf]/15 text-xs font-semibold text-[#fcf8d8] hover:bg-[#272a30] transition-colors"
            >
              <span>Practice All {selectedCategoryTopics.length} In Syllabus</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedCategoryTopics.slice(0, 6).map((topic) => (
              <div
                key={topic.id}
                onClick={() => navigate(`/practice/session/${topic.id}`)}
                className="group cursor-pointer rounded-2xl border border-[#d9dadf]/10 bg-[#1a1c20] p-5 hover:border-[#dd700b]/40 hover:bg-[#222429] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#adaca7]">
                      {topic.difficulty}
                    </span>
                    <span className="text-[10px] font-mono text-[#7c7d75]">
                      ~{topic.estimatedMinutes}m
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#fcf8d8] group-hover:text-[#dd700b] transition-colors line-clamp-2">
                    {topic.title}
                  </h4>
                  <p className="text-xs text-[#adaca7] mt-2 line-clamp-2 leading-relaxed">
                    {topic.shortDescription}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#d9dadf]/10 flex items-center justify-between text-[11px] text-[#adaca7]">
                  <span className="truncate max-w-[160px]">{topic.tags[0] || topic.category}</span>
                  <span className="font-semibold text-[#fcf8d8] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Practice <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION D: CONSISTENCY IS A SUPERPOWER */}
      <section className="relative py-24 sm:py-36 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto border-b border-[#d9dadf]/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#dd700b] tracking-widest uppercase mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#dd700b]" />
              <span>Section 04 &bull; Habit Engineering</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#fcf8d8] tracking-tight uppercase leading-tight">
              Consistency Is A Superpower.
            </h2>
          </div>
          <p className="text-[#adaca7] text-sm max-w-sm leading-relaxed">
            One 15-minute challenge every single day creates unbeatable technical fluency. Your current live progress:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="relative rounded-3xl border border-[#d9dadf]/15 bg-[#16181b] p-6 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[#adaca7]">Current Streak</span>
              <div className="h-8 w-8 rounded-full bg-[#dd700b]/15 border border-[#dd700b]/30 flex items-center justify-center text-[#dd700b]">
                <Flame className="h-4 w-4" />
              </div>
            </div>
            <div className="my-6">
              <div className="text-5xl font-black text-[#fcf8d8] font-mono">{currentStreak}</div>
              <span className="text-xs text-[#adaca7] mt-1 block">
                {currentStreak > 0 ? 'Active consecutive days' : 'Start your streak today'}
              </span>
            </div>
            <div className="pt-4 border-t border-[#d9dadf]/10 text-xs text-[#7c7d75] font-mono">
              All-time record: <strong className="text-[#fcf8d8]">{longestStreak} days</strong>
            </div>
          </div>

          <div className="relative rounded-3xl border border-[#d9dadf]/15 bg-[#16181b] p-6 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[#adaca7]">Experience Points</span>
              <div className="h-8 w-8 rounded-full bg-[#d9dadf]/10 border border-[#d9dadf]/20 flex items-center justify-center text-[#d9dadf]">
                <Sparkles className="h-4 w-4 text-[#dd700b]" />
              </div>
            </div>
            <div className="my-6">
              <div className="text-5xl font-black text-[#fcf8d8] font-mono">{totalXP}</div>
              <span className="text-xs text-[#adaca7] mt-1 block">Level {levelInfo.level} Engineer</span>
            </div>
            <div className="pt-4 border-t border-[#d9dadf]/10">
              <div className="w-full bg-[#2a2c30] h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#dd700b] to-[#d9dadf] transition-all duration-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-[#7c7d75] font-mono block mt-1.5">
                {levelInfo.xpRemainingToNext} XP to Level {levelInfo.level + 1}
              </span>
            </div>
          </div>

          <div className="relative rounded-3xl border border-[#d9dadf]/15 bg-[#16181b] p-6 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[#adaca7]">Topics Mastered</span>
              <div className="h-8 w-8 rounded-full bg-[#d9dadf]/10 border border-[#d9dadf]/20 flex items-center justify-center text-[#fcf8d8]">
                <CheckCircle2 className="h-4 w-4 text-[#dd700b]" />
              </div>
            </div>
            <div className="my-6">
              <div className="text-5xl font-black text-[#fcf8d8] font-mono">
                {completedTopicIds.length} <span className="text-xl text-[#7c7d75]">/ {TOPICS.length}</span>
              </div>
              <span className="text-xs text-[#adaca7] mt-1 block">
                {Math.round((completedTopicIds.length / TOPICS.length) * 100)}% syllabus coverage
              </span>
            </div>
            <div className="pt-4 border-t border-[#d9dadf]/10 text-xs text-[#7c7d75] font-mono">
              Total questions available: <strong className="text-[#fcf8d8]">{TOPICS.length}</strong>
            </div>
          </div>

          <div className="relative rounded-3xl border border-[#d9dadf]/15 bg-[#16181b] p-6 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[#adaca7]">Daily Mission</span>
              <div className="h-8 w-8 rounded-full bg-[#dd700b]/15 border border-[#dd700b]/30 flex items-center justify-center text-[#dd700b]">
                <Terminal className="h-4 w-4" />
              </div>
            </div>
            <div className="my-6">
              <div className="text-5xl font-black text-[#fcf8d8] font-mono">
                {todayCompletedCount} <span className="text-xl text-[#7c7d75]">/ {dailyGoalCount}</span>
              </div>
              <span className="text-xs text-[#adaca7] mt-1 block">
                {todayCompletedCount >= dailyGoalCount ? 'Daily goal accomplished!' : '1 challenge needed today'}
              </span>
            </div>
            <div className="pt-4 border-t border-[#d9dadf]/10 flex items-center justify-between">
              <Link
                to="/dashboard"
                className="text-xs font-semibold text-[#fcf8d8] hover:text-[#dd700b] transition-colors inline-flex items-center gap-1"
              >
                Open Dashboard <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION E: ENTER THE ARENA */}
      <section className="relative py-28 sm:py-40 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] rounded-full bg-gradient-to-tr from-[#dd700b]/15 via-[#d9dadf]/10 to-[#fcf8d8]/10 blur-[130px] pointer-events-none" />

        <div className="relative z-10 rounded-3xl border border-[#d9dadf]/20 bg-gradient-to-b from-[#181a1d] to-[#101114] p-8 sm:p-16 lg:p-20 text-center shadow-2xl">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-3.5 py-1 rounded-full border border-[#d9dadf]/15 bg-[#202226] text-xs font-mono tracking-widest text-[#dd700b] uppercase mb-6">
              Instant Session &bull; Zero Setup Required
            </span>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#fcf8d8] uppercase leading-[0.95] mb-8">
              Enter The Arena.
            </h2>

            <p className="text-base sm:text-lg text-[#d9dadf] font-normal leading-relaxed max-w-xl mx-auto mb-10">
              Spin the wheel, test your technical explanation against verified industry rubrics, and cement permanent interview mastery.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/practice"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-[#dd700b] text-[#fcf8d8] font-bold text-sm tracking-wide uppercase transition-all duration-300 hover:bg-[#b85806] hover:shadow-[0_0_40px_rgba(221,112,11,0.5)] active:scale-95"
              >
                <Compass className="h-4 w-4" />
                <span>Launch Spin Arena Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-5 rounded-full border border-[#d9dadf]/20 bg-[#202226] text-[#d9dadf] text-sm font-semibold hover:border-[#dd700b]/40 hover:text-[#fcf8d8] transition-all backdrop-blur-sm"
              >
                <span>View Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MINIMAL EDITORIAL FOOTER */}
      <footer className="border-t border-[#d9dadf]/10 bg-[#0a0b0d] py-14 px-4 sm:px-8 lg:px-12 text-xs text-[#adaca7]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2 text-[#fcf8d8] font-bold text-base tracking-tight">
              <span className="h-2 w-2 rounded-full bg-[#dd700b]" />
              <span>CODEQUEST</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border border-[#d9dadf]/20 text-[#d9dadf]">
                MIST
              </span>
            </div>
            <p className="text-[#7c7d75] text-xs text-center md:text-left">
              Gamified software engineering interview preparation. Designed with Frozen Mist palette.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-[#adaca7]">
            <Link to="/practice" className="hover:text-[#fcf8d8] transition-colors">
              ARENA
            </Link>
            <Link to="/topics" className="hover:text-[#fcf8d8] transition-colors">
              SYLLABUS
            </Link>
            <Link to="/revision" className="hover:text-[#fcf8d8] transition-colors">
              SPACED REPETITION
            </Link>
            <Link to="/dashboard" className="hover:text-[#fcf8d8] transition-colors">
              DASHBOARD
            </Link>
            <Link to="/profile" className="hover:text-[#fcf8d8] transition-colors">
              PROFILE & GOALS
            </Link>
          </div>

          <div className="text-[11px] font-mono text-[#7c7d75]">
            &copy; {new Date().getFullYear()} CODEQUEST &bull; FROZEN MIST PALETTE
          </div>
        </div>
      </footer>
    </div>
  );
};
