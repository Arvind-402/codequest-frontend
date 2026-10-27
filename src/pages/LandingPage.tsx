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
      tagline: 'Break interview paralysis with authentic roulette randomness.',
      desc: 'The interactive arena spins across 8 foundational engineering disciplines. Eliminating cherry-picking trains you to tackle unforeseen questions under authentic interview pressure.',
      detail: 'Physics-calibrated wheel with casino roulette acoustics and verified wedge geometry.',
      icon: Disc,
      tag: 'Curriculum Roulette',
    },
    {
      num: '02',
      title: 'THINK',
      tagline: 'Train active unassisted retrieval.',
      desc: 'Before peeking at solution hints, you have a dedicated timed window to mentally architect your solution, identify edge constraints, and formulate time & space complexity bounds from first principles.',
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
      tagline: 'Calibrate your cognitive blind spots.',
      desc: 'Unlock verified industry solution blueprints, multi-language code implementations, and complexity rubrics. Self-assess your completeness and correctness on a 5-star rubric.',
      detail: 'Side-by-side comparison with production-grade solution architectures.',
      icon: CheckCircle2,
      tag: 'Self Calibration',
    },
    {
      num: '05',
      title: 'REPEAT',
      tagline: 'Lock concepts permanently into memory.',
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
    <div className="relative w-full bg-[#010001] text-[#FFFFFF] overflow-x-hidden selection:bg-[#367D8A]/40 selection:text-white">
      {/* SECTION A: EDITORIAL BOTANICAL HERO */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between px-4 sm:px-8 lg:px-16 pt-8 pb-12 overflow-hidden border-b border-[#133336]/40">
        {/* Organic 3D Liquid Sculpture with Deep Teal Reflections */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-85 sm:opacity-95">
          <LiquidSculpture intensity={1.1} interactive={true} />
        </div>

        {/* Ambient Teal Organic Lighting (#367D8A & #133336) */}
        <div className="absolute top-1/4 -left-20 w-[32rem] h-[32rem] rounded-full bg-[#367D8A]/[0.12] blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-[36rem] h-[36rem] rounded-full bg-[#133336]/[0.25] blur-[160px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 rounded-full bg-[#285F6B]/[0.10] blur-[120px] pointer-events-none" />

        {/* Top Minimal Editorial Floating Header */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono tracking-widest text-white/50 uppercase pt-2">
          <div className="flex items-center gap-3">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#367D8A] animate-pulse" />
            <span className="text-white font-medium">Daily Technical Practice</span>
            <span className="text-white/20">/</span>
            <span className="hidden sm:inline text-white/60">Algorithms &bull; Systems &bull; Architecture</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-white/50 hidden md:inline">52 Curated Topics</span>
            <span className="text-white/20 hidden md:inline">/</span>
            <span className="px-3 py-1 rounded-full border border-[#133336] bg-[#040a0b]/80 text-[#5DA8B6] font-sans normal-case text-xs backdrop-blur-md">
              Frontend Only &bull; 100% Private
            </span>
          </div>
        </div>

        {/* Hero Headline & Editorial Serif Composition */}
        <div className="relative z-10 max-w-6xl my-auto py-12 sm:py-20">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[#367D8A]/30 bg-[#061214]/80 backdrop-blur-md text-xs text-white/80 mb-8 sm:mb-10 shadow-2xl">
            <span className="h-2 w-2 rounded-full bg-[#367D8A] shadow-[0_0_8px_#367D8A]" />
            <span className="font-mono uppercase tracking-wider text-[11px] text-[#5DA8B6]">Niche Discipline</span>
            <span className="text-white/20">&bull;</span>
            <span className="text-white font-medium">Mastery through unprompted recall</span>
          </div>

          <h1 className="hero-headline text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-serif font-light tracking-tight text-white select-none leading-[0.94]">
            <span className="block text-white transition-transform duration-700 hover:translate-x-2">
              YOUR NEXT
            </span>
            <span className="block italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-white via-[#5DA8B6] to-[#367D8A]">
              INTERVIEW
            </span>
            <span className="block text-white flex items-center gap-4 flex-wrap">
              <span>STARTS HERE</span>
              <span className="inline-block h-3.5 w-3.5 sm:h-5 sm:w-5 rounded-full bg-[#367D8A] shadow-[0_0_20px_#367D8A]" />
            </span>
          </h1>

          <div className="mt-8 sm:mt-12 max-w-xl">
            <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed">
              Cultivate instinctive engineering recall one challenge at a time. Spin the wheel, articulate your solution under simulated constraints, and lock it into permanent memory.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/practice"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#285F6B] to-[#367D8A] text-white font-medium text-sm tracking-wide uppercase transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_30px_rgba(54,125,138,0.4)] active:scale-95"
              >
                <Compass className="h-4 w-4 text-white group-hover:rotate-45 transition-transform" />
                <span>Enter the Arena</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#ritual"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-[#133336] bg-[#040a0b]/60 text-white/70 text-sm font-medium tracking-wide hover:border-[#367D8A]/50 hover:bg-[#061214] hover:text-white transition-all backdrop-blur-sm"
              >
                <span>The 5-Stage Ritual</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Hero Footer Meta */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-[#133336]/30 text-xs text-white/50 font-mono">
          <div className="flex items-center gap-6">
            <span>&bull; REAL CASINO ROULETTE AUDIO</span>
            <span className="hidden sm:inline">&bull; ZERO SPOILERS</span>
            <span className="hidden md:inline">&bull; SPACED REPETITION ENGINE</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white/40">SCROLL TO EXPLORE</span>
            <div className="h-4 w-px bg-[#367D8A] animate-bounce" />
          </div>
        </div>
      </section>

      {/* SECTION B: THE PRACTICE RITUAL */}
      <section id="ritual" className="relative py-24 sm:py-36 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto border-b border-[#133336]/40">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-24">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 font-mono text-xs text-[#367D8A] tracking-widest uppercase mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#367D8A]" />
              <span>Section 02 &bull; The Practice Ritual</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-light text-white tracking-tight leading-tight">
              A 5-Stage System For Deep Engineering Mastery.
            </h2>
          </div>
          <p className="text-white/50 text-sm max-w-sm leading-relaxed">
            Move beyond passive code watching. CodeQuest guides you to recall, articulate, and defend solutions under authentic interview conditions.
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
                      ? 'border-[#367D8A]/60 bg-[#061214] shadow-[0_4px_30px_rgba(54,125,138,0.15)]'
                      : 'border-[#133336]/50 bg-transparent hover:border-[#367D8A]/30 hover:bg-[#03090a]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span
                        className={`font-mono text-base font-bold transition-colors ${
                          isActive ? 'text-[#367D8A]' : 'text-white/30 group-hover:text-white/60'
                        }`}
                      >
                        {step.num}
                      </span>
                      <h3
                        className={`text-lg font-serif transition-colors ${
                          isActive ? 'text-white font-medium' : 'text-white/60 group-hover:text-white'
                        }`}
                      >
                        {step.title}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-[#133336] text-[#5DA8B6]">
                      {step.tag}
                    </span>
                  </div>

                  <p className="text-xs text-white/50 mt-2 line-clamp-1">
                    {step.tagline}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-7">
            <div className="relative rounded-3xl border border-[#133336] bg-gradient-to-b from-[#061214] to-[#010001] p-8 sm:p-12 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#367D8A]/[0.08] blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col justify-between min-h-[360px]">
                <div>
                  <div className="flex items-center justify-between border-b border-[#133336]/40 pb-6 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#133336]/60 border border-[#367D8A]/30 flex items-center justify-center text-[#5DA8B6]">
                        {React.createElement(ritualSteps[activeRitualStep].icon, { className: 'h-5 w-5' })}
                      </div>
                      <div>
                        <span className="font-mono text-[11px] text-[#367D8A] uppercase tracking-widest block">
                          Stage {ritualSteps[activeRitualStep].num}
                        </span>
                        <h4 className="text-xl sm:text-2xl font-serif text-white tracking-tight mt-0.5">
                          {ritualSteps[activeRitualStep].title} &bull; <span className="italic text-white/80">{ritualSteps[activeRitualStep].tagline}</span>
                        </h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-base text-white/70 leading-relaxed font-light mb-8">
                    {ritualSteps[activeRitualStep].desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#133336]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-white/50 font-mono">
                    <span className="text-[#5DA8B6] font-semibold">Architecture Detail: </span>
                    {ritualSteps[activeRitualStep].detail}
                  </div>

                  <button
                    onClick={() => navigate('/practice')}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#367D8A] hover:text-[#5DA8B6] transition-colors"
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
      <section className="relative py-24 sm:py-36 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto border-b border-[#133336]/40">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#367D8A] tracking-widest uppercase mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#367D8A]" />
              <span>Section 03 &bull; Curated Syllabus</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-light text-white tracking-tight leading-tight">
              Explore Your Knowledge.
            </h2>
          </div>
          <Link
            to="/topics"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#5DA8B6] hover:text-white uppercase tracking-wider border-b border-[#367D8A]/40 pb-1 transition-colors"
          >
            <span>Complete Curriculum ({TOPICS.length} Questions)</span>
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
                    ? 'border-[#367D8A] text-white bg-[#367D8A] shadow-[0_0_20px_rgba(54,125,138,0.3)]'
                    : 'border-[#133336]/60 text-white/60 bg-[#040a0b] hover:border-[#367D8A]/40 hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{cat.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-black/30 text-white' : 'bg-white/5 text-white/50'}`}>
                  {topicCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Category Highlights */}
        <div className="rounded-3xl border border-[#133336] bg-[#030809] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#133336]/40 pb-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#367D8A]">
                Domain Spotlight
              </span>
              <h3 className="text-2xl font-serif font-light text-white mt-0.5">
                {selectedCategoryMeta.label}
              </h3>
            </div>
            <Link
              to="/topics"
              className="text-xs font-medium text-[#5DA8B6] hover:text-white transition-colors inline-flex items-center gap-1"
            >
              Browse all {selectedCategoryTopics.length} questions <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedCategoryTopics.slice(0, 6).map((topic) => (
              <div
                key={topic.id}
                onClick={() => navigate(`/practice/session/${topic.id}`)}
                className="group cursor-pointer rounded-2xl border border-[#133336]/60 bg-[#061214] p-5 hover:border-[#367D8A]/60 hover:bg-[#091b1e] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#367D8A]">
                      {topic.difficulty}
                    </span>
                    <span className="text-[10px] font-mono text-white/40">
                      ~{topic.estimatedMinutes}m
                    </span>
                  </div>
                  <h4 className="text-sm font-serif font-medium text-white group-hover:text-[#5DA8B6] transition-colors line-clamp-2">
                    {topic.title}
                  </h4>
                  <p className="text-xs text-white/50 mt-2 line-clamp-2 leading-relaxed">
                    {topic.shortDescription}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#133336]/40 flex items-center justify-between text-[11px] text-white/50">
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
      <section className="relative py-24 sm:py-36 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto border-b border-[#133336]/40">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#367D8A] tracking-widest uppercase mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#367D8A]" />
              <span>Section 04 &bull; Habit Engineering</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-light text-white tracking-tight leading-tight">
              Consistency Is A Superpower.
            </h2>
          </div>
          <p className="text-white/50 text-sm max-w-sm leading-relaxed">
            A single 15-minute challenge every day creates unstoppable engineering recall. Your active telemetry:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="relative rounded-3xl border border-[#133336] bg-[#040a0b] p-6 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-white/50">Current Streak</span>
              <div className="h-8 w-8 rounded-full bg-[#133336]/60 border border-[#367D8A]/30 flex items-center justify-center text-[#5DA8B6]">
                <Flame className="h-4 w-4" />
              </div>
            </div>
            <div className="my-6">
              <div className="text-5xl font-serif font-light text-white">{currentStreak}</div>
              <span className="text-xs text-white/50 mt-1 block">
                {currentStreak > 0 ? 'Active consecutive days' : 'Begin your streak today'}
              </span>
            </div>
            <div className="pt-4 border-t border-[#133336]/40 text-xs text-white/40 font-mono">
              All-time record: <strong className="text-white">{longestStreak} days</strong>
            </div>
          </div>

          <div className="relative rounded-3xl border border-[#133336] bg-[#040a0b] p-6 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-white/50">Experience Points</span>
              <div className="h-8 w-8 rounded-full bg-[#133336]/60 border border-[#367D8A]/30 flex items-center justify-center text-[#5DA8B6]">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <div className="my-6">
              <div className="text-5xl font-serif font-light text-white">{totalXP}</div>
              <span className="text-xs text-white/50 mt-1 block">Level {levelInfo.level} Engineer</span>
            </div>
            <div className="pt-4 border-t border-[#133336]/40">
              <div className="w-full bg-[#061214] h-1.5 rounded-full overflow-hidden border border-[#133336]/50">
                <div
                  className="h-full bg-gradient-to-r from-[#285F6B] to-[#367D8A] transition-all duration-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-white/40 font-mono block mt-1.5">
                {levelInfo.xpRemainingToNext} XP to Level {levelInfo.level + 1}
              </span>
            </div>
          </div>

          <div className="relative rounded-3xl border border-[#133336] bg-[#040a0b] p-6 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-white/50">Topics Mastered</span>
              <div className="h-8 w-8 rounded-full bg-[#133336]/60 border border-[#367D8A]/30 flex items-center justify-center text-[#5DA8B6]">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="my-6">
              <div className="text-5xl font-serif font-light text-white">
                {completedTopicIds.length} <span className="text-xl text-white/30">/ {TOPICS.length}</span>
              </div>
              <span className="text-xs text-white/50 mt-1 block">
                {Math.round((completedTopicIds.length / TOPICS.length) * 100)}% syllabus coverage
              </span>
            </div>
            <div className="pt-4 border-t border-[#133336]/40 text-xs text-white/40 font-mono">
              Total questions available: <strong className="text-white">{TOPICS.length}</strong>
            </div>
          </div>

          <div className="relative rounded-3xl border border-[#133336] bg-[#040a0b] p-6 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-white/50">Daily Goal</span>
              <div className="h-8 w-8 rounded-full bg-[#133336]/60 border border-[#367D8A]/30 flex items-center justify-center text-[#5DA8B6]">
                <Terminal className="h-4 w-4" />
              </div>
            </div>
            <div className="my-6">
              <div className="text-5xl font-serif font-light text-white">
                {todayCompletedCount} <span className="text-xl text-white/30">/ {dailyGoalCount}</span>
              </div>
              <span className="text-xs text-white/50 mt-1 block">
                {todayCompletedCount >= dailyGoalCount ? 'Daily target accomplished' : '1 challenge needed today'}
              </span>
            </div>
            <div className="pt-4 border-t border-[#133336]/40 flex items-center justify-between">
              <Link
                to="/dashboard"
                className="text-xs font-semibold text-[#5DA8B6] hover:text-white transition-colors inline-flex items-center gap-1"
              >
                Open Dashboard <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION E: ENTER THE ARENA */}
      <section className="relative py-28 sm:py-40 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44rem] h-[44rem] rounded-full bg-gradient-to-tr from-[#133336]/30 via-[#285F6B]/20 to-[#367D8A]/20 blur-[150px] pointer-events-none" />

        <div className="relative z-10 rounded-3xl border border-[#367D8A]/30 bg-gradient-to-b from-[#061214] to-[#010001] p-8 sm:p-16 lg:p-20 text-center shadow-2xl">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-3.5 py-1 rounded-full border border-[#133336] bg-[#020506] text-xs font-mono tracking-widest text-[#367D8A] uppercase mb-6">
              Instant Session &bull; Zero Backend Friction
            </span>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light tracking-tight text-white uppercase leading-[0.96] mb-8">
              Enter The Arena.
            </h2>

            <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed max-w-xl mx-auto mb-10">
              Spin the roulette wheel, articulate your solution against verified industry rubrics, and achieve permanent interview confidence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/practice"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-[#285F6B] to-[#367D8A] text-white font-medium text-sm tracking-wide uppercase transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_36px_rgba(54,125,138,0.45)] active:scale-95"
              >
                <Compass className="h-4 w-4" />
                <span>Launch Roulette Arena</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-5 rounded-full border border-[#133336] bg-[#030809] text-white/80 text-sm font-medium hover:border-[#367D8A]/50 hover:text-white transition-all backdrop-blur-sm"
              >
                <span>View Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MINIMAL EDITORIAL FOOTER */}
      <footer className="border-t border-[#133336]/40 bg-[#010001] py-14 px-4 sm:px-8 lg:px-16 text-xs text-white/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2 text-white font-serif text-lg tracking-tight">
              <span className="h-2 w-2 rounded-full bg-[#367D8A]" />
              <span>CODEQUEST</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-[#133336] text-[#5DA8B6]">
                BOTANICAL TEAL
              </span>
            </div>
            <p className="text-white/40 text-xs text-center md:text-left">
              Gamified software engineering interview preparation with unprompted active recall.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-white/60">
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

          <div className="text-[11px] font-mono text-white/40">
            &copy; {new Date().getFullYear()} CODEQUEST &bull; AUTHENTIC ROULETTE EDITION
          </div>
        </div>
      </footer>
    </div>
  );
};
