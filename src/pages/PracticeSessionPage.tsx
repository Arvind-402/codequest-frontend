import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Eye,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ArrowLeft,
  FileText,
  Star,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TOPICS } from '../data/topics';
import { useCodeQuest } from '../context/CodeQuestContext';
import type { ReviewDifficulty, RatingCriteria, ConfidenceLevel, PracticeSession } from '../types/session';

type SessionState = 'ready' | 'answering' | 'self_assessment' | 'completed';

export const PracticeSessionPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { saveCompletedSession, profile } = useCodeQuest();

  // Find topic by ID
  const topic = TOPICS.find((t) => t.id === topicId);

  // Session lifecycle state
  const [sessionState, setSessionState] = useState<SessionState>('ready');

  // Timer configuration
  const defaultMinutes = profile?.preferences?.defaultTimerMinutes || 10;
  const [selectedMinutes, setSelectedMinutes] = useState<number>(defaultMinutes);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(defaultMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [hasTimerExpired, setHasTimerExpired] = useState<boolean>(false);
  const [totalElapsedTime, setTotalElapsedTime] = useState<number>(0);

  // Answering state
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showFollowUps, setShowFollowUps] = useState<boolean>(false);
  const [revealedNotes, setRevealedNotes] = useState<boolean>(false);
  const [showRevealNotesModal, setShowRevealNotesModal] = useState<boolean>(false);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState<boolean>(false);

  // Self-assessment state
  const [ratings, setRatings] = useState<RatingCriteria>({
    correctness: 4,
    completeness: 4,
    clarity: 4,
    examples: 4,
  });
  const [missingConcepts, setMissingConcepts] = useState<string[]>([]);
  const [reflectionNote, setReflectionNote] = useState<string>('');
  const [confidence, setConfidence] = useState<ConfidenceLevel>('Medium');
  const [reviewDifficulty, setReviewDifficulty] = useState<ReviewDifficulty>('Good');

  // Completed session record
  const [completedRecord, setCompletedRecord] = useState<PracticeSession | null>(null);

  // Word count & metrics
  const wordCount = userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0;
  const characterCount = userAnswer.length;

  // Timer interval effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && sessionState === 'answering') {
      interval = setInterval(() => {
        setTotalElapsedTime((prev) => prev + 1);
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setHasTimerExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, sessionState]);

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Start the session
  const handleStartSession = () => {
    setSecondsRemaining(selectedMinutes * 60);
    setHasTimerExpired(false);
    setIsTimerRunning(true);
    setSessionState('answering');
  };

  // Reveal notes warning handler
  const handleConfirmRevealNotes = () => {
    setRevealedNotes(true);
    setShowRevealNotesModal(false);
  };

  // Submit Answer -> moves to Self-Assessment
  const handleSubmitAnswer = () => {
    setIsTimerRunning(false);
    setSessionState('self_assessment');
  };

  // Toggle missing concept checkbox
  const toggleMissingConcept = (concept: string) => {
    setMissingConcepts((prev) =>
      prev.includes(concept) ? prev.filter((c) => c !== concept) : [...prev, concept]
    );
  };

  // Compute average self-rating
  const averageRating = Number(
    ((ratings.correctness + ratings.completeness + ratings.clarity + ratings.examples) / 4).toFixed(1)
  );

  // Final session completion
  const handleCompleteSession = () => {
    if (!topic || completedRecord) return;

    const record = saveCompletedSession({
      topicId: topic.id,
      topicTitle: topic.title,
      category: topic.category,
      durationSeconds: Math.max(1, totalElapsedTime),
      userAnswer,
      wordCount,
      revealedNotes,
      recallMode: revealedNotes ? 'assisted' : 'independent',
      ratingCriteria: ratings,
      averageRating,
      missingConcepts,
      reflectionNote: reflectionNote.trim() || undefined,
      confidence,
      reviewDifficulty,
      isRevision: false,
    });

    setCompletedRecord(record);
    setSessionState('completed');

    // Confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#367D8A', '#06b6d4', '#10b981', '#f59e0b'],
    });
  };

  // Handle missing topic gracefully
  if (!topic) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Topic Not Found</h2>
        <p className="text-sm text-slate-400">
          The requested practice challenge ID does not exist or was removed.
        </p>
        <Link
          to="/practice"
          className="inline-flex items-center gap-2 rounded-xl bg-[#367D8A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#367D8A] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Spin Arena</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 px-3 sm:px-4">
      {/* Top Header Navigation & Exit Protection */}
      <div className="flex items-center justify-between border-b border-[#133336] pb-4 mb-6">
        <button
          onClick={() => {
            if (sessionState === 'answering' && userAnswer.length > 20) {
              setShowExitConfirmModal(true);
            } else {
              navigate('/practice');
            }
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Exit Arena</span>
        </button>

        {/* Status Phase Tracker */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <span
            className={`px-2.5 py-1 rounded-full ${
              sessionState === 'ready'
                ? 'bg-[#367D8A]/30 text-[#5DA8B6] border border-[#367D8A]/40'
                : 'text-slate-500'
            }`}
          >
            1. Ready
          </span>
          <span className="text-slate-600">→</span>
          <span
            className={`px-2.5 py-1 rounded-full ${
              sessionState === 'answering'
                ? 'bg-[#367D8A]/30 text-[#5DA8B6] border border-[#367D8A]/40'
                : 'text-slate-500'
            }`}
          >
            2. Explain
          </span>
          <span className="text-slate-600">→</span>
          <span
            className={`px-2.5 py-1 rounded-full ${
              sessionState === 'self_assessment'
                ? 'bg-[#367D8A]/30 text-[#5DA8B6] border border-[#367D8A]/40'
                : 'text-slate-500'
            }`}
          >
            3. Self-Assess
          </span>
          <span className="text-slate-600">→</span>
          <span
            className={`px-2.5 py-1 rounded-full ${
              sessionState === 'completed'
                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-500'
            }`}
          >
            4. Review
          </span>
        </div>
      </div>

      {/* STATE 1: READY SCREEN */}
      {sessionState === 'ready' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-3xl border border-[#133336] bg-[#0c1020] p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded-md bg-[#367D8A]/20 px-2.5 py-0.5 text-xs font-semibold text-[#5DA8B6] border border-[#367D8A]/30">
                {topic.category}
              </span>
              <span className="rounded-md bg-[#161c33] px-2.5 py-0.5 text-xs font-semibold text-slate-300 border border-[#232b4d]">
                {topic.difficulty}
              </span>
              <span className="text-xs text-slate-400 font-mono ml-auto flex items-center gap-1">
                <Clock className="h-3 w-3" /> ~{topic.estimatedMinutes} mins
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              {topic.title}
            </h1>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              {topic.shortDescription}
            </p>

            {/* The Question Preview */}
            <div className="rounded-2xl border border-[#367D8A]/30 bg-[#133336]/20 p-5 mb-8">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5DA8B6] block mb-1">
                Interview Challenge Question
              </span>
              <p className="text-base sm:text-lg font-semibold text-white">
                "{topic.interviewQuestion}"
              </p>
            </div>

            {/* Timer Duration Picker */}
            <div className="rounded-2xl border border-[#133336] bg-[#090b16] p-5 mb-8">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-3">
                Configure Practice Timer
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[5, 10, 15, 20].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => {
                      setSelectedMinutes(mins);
                      setSecondsRemaining(mins * 60);
                    }}
                    className={`rounded-xl py-2.5 text-xs sm:text-sm font-semibold border transition-all ${
                      selectedMinutes === mins
                        ? 'border-[#367D8A] bg-[#367D8A]/25 text-white shadow-md'
                        : 'border-[#133336] bg-[#12162a] text-slate-400 hover:text-white'
                    }`}
                  >
                    {mins} Minutes
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                * Note: Timer will not forcefully submit your answer when it reaches zero. You remain in full control.
              </p>
            </div>

            {/* Launch CTA */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleStartSession}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#367D8A] to-[#285F6B] py-3.5 text-base font-bold text-white shadow-lg shadow-[#367D8A]/30 hover:brightness-110 active:scale-95 transition-all"
              >
                <Play className="h-5 w-5 fill-white" />
                <span>Begin Recall Practice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATE 2: ANSWERING SCREEN */}
      {sessionState === 'answering' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Sticky Question & Timer Card */}
          <div className="rounded-2xl border border-[#133336] bg-[#0e1224] p-5 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#367D8A]/20 px-2 py-0.5 text-xs font-semibold text-[#5DA8B6] border border-[#367D8A]/30">
                  {topic.category}
                </span>
                <span className="text-xs text-slate-400">{topic.difficulty}</span>
                {revealedNotes && (
                  <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[11px] font-semibold text-amber-300 border border-amber-500/30">
                    Notes Revealed (Assisted)
                  </span>
                )}
              </div>

              {/* Timer & Controls */}
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold ${
                    hasTimerExpired
                      ? 'border-amber-500/50 bg-amber-500/15 text-amber-300 animate-pulse'
                      : secondsRemaining < 60
                      ? 'border-rose-500/50 bg-rose-500/15 text-rose-300'
                      : 'border-[#222b4d] bg-[#091b1e] text-slate-200'
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(secondsRemaining)}</span>
                  {hasTimerExpired && <span className="text-[10px] text-amber-400 font-sans font-medium">(Time up)</span>}
                </div>

                <button
                  onClick={() => setIsTimerRunning((prev) => !prev)}
                  className="p-1.5 rounded-lg border border-[#222b4d] bg-[#091b1e] text-slate-300 hover:text-white"
                  title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
                >
                  {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>

                <button
                  onClick={() => {
                    setSecondsRemaining(selectedMinutes * 60);
                    setHasTimerExpired(false);
                  }}
                  className="p-1.5 rounded-lg border border-[#222b4d] bg-[#091b1e] text-slate-300 hover:text-white"
                  title="Reset timer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* The Question */}
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
              "{topic.interviewQuestion}"
            </h2>

            {/* Follow-up Questions Dropdown */}
            {topic.followUpQuestions && topic.followUpQuestions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[#1b223d]">
                <button
                  onClick={() => setShowFollowUps((prev) => !prev)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-[#5DA8B6] transition-colors"
                >
                  <span>Follow-up Questions ({topic.followUpQuestions.length})</span>
                  {showFollowUps ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>

                {showFollowUps && (
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-300 pl-4 list-disc marker:text-[#5DA8B6]">
                    {topic.followUpQuestions.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Answer Editor Card */}
          <div className="rounded-2xl border border-[#133336] bg-[#0c0f1e] p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[#5DA8B6]" />
                Your Technical Explanation
              </label>

              {/* Reveal Notes Control */}
              {!revealedNotes ? (
                <button
                  onClick={() => setShowRevealNotesModal(true)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
                  title="Reveal notes (ends independent recall mode)"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Reveal Notes</span>
                </button>
              ) : (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Notes Visible
                </span>
              )}
            </div>

            {/* Textarea */}
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Structure your answer clearly:
1. High-level definition & intuition
2. Core mechanism / internal trade-offs
3. Concrete example or complexity analysis
4. Edge cases & production considerations..."
              rows={12}
              className="w-full rounded-xl border border-[#133336] bg-[#080a14] p-4 text-sm text-slate-100 placeholder:text-slate-600 focus:border-[#367D8A] focus:ring-1 focus:ring-[#367D8A] font-mono resize-y leading-relaxed outline-none"
            />

            {/* Metrics Bar & Submit Button */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span>
                  Words: <strong className="text-slate-200 font-mono">{wordCount}</strong>
                </span>
                <span>
                  Characters: <strong className="text-slate-200 font-mono">{characterCount}</strong>
                </span>
                {!revealedNotes && (
                  <span className="text-emerald-400 font-medium hidden sm:inline">
                    ★ +10 XP Independent Recall Active
                  </span>
                )}
              </div>

              <button
                onClick={handleSubmitAnswer}
                disabled={userAnswer.trim().length === 0}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition-all ${
                  userAnswer.trim().length === 0
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#367D8A] to-[#285F6B] shadow-md shadow-[#367D8A]/30 hover:brightness-110 active:scale-95'
                }`}
              >
                <span>Submit & Self-Assess</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Revealed Notes Drawer (Visible only if revealedNotes === true) */}
          {revealedNotes && (
            <div className="rounded-2xl border border-[#367D8A]/30 bg-[#0e1329] p-5 shadow-xl space-y-4 animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between border-b border-[#1b2344] pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5DA8B6] flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  Official Revision Notes & Key Concepts
                </span>
              </div>

              {/* Revision Bullet Points */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase">Core Revision Points</h4>
                <ul className="space-y-1.5 text-xs text-slate-300 pl-4 list-disc marker:text-[#5DA8B6]">
                  {topic.revisionNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>

              {/* Practical Example */}
              {topic.practicalExample && (
                <div className="rounded-xl bg-[#090b16] p-3 border border-[#1b2344]">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Practical Application / Walkthrough
                  </span>
                  <p className="text-xs text-slate-300 font-mono">{topic.practicalExample}</p>
                </div>
              )}

              {/* Suggested Structure */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase">Suggested Answer Breakdown</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {topic.suggestedAnswerStructure.map((item, idx) => (
                    <div key={idx} className="rounded-lg bg-[#141933] p-2.5 border border-[#232b55]">
                      <span className="text-xs font-bold text-[#5DA8B6] block">{item.section}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.guidance}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STATE 3: SELF-ASSESSMENT SCREEN */}
      {sessionState === 'self_assessment' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-3xl border border-[#133336] bg-[#0c1020] p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1b223d] pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Self-Assessment & Reflection
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Rate your technical explanation honestly against key interview dimensions.
                </p>
              </div>

              <div className="rounded-xl border border-[#367D8A]/30 bg-[#133336]/20 px-4 py-2 text-right">
                <span className="text-[10px] uppercase font-bold text-[#5DA8B6] block">
                  Self-Assessment Score
                </span>
                <span className="text-2xl font-extrabold text-white font-mono">
                  {averageRating} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
                </span>
              </div>
            </div>

            {/* 4 Rating Criteria (1 to 5) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'correctness', label: 'Technical Correctness', desc: 'Accuracy of mechanisms, time/space complexity, and invariant rules.' },
                { key: 'completeness', label: 'Completeness & Depth', desc: 'Covered essential components, edge cases, and design constraints.' },
                { key: 'clarity', label: 'Communication Clarity', desc: 'Cohesive structure, crisp definitions, and easy-to-follow flow.' },
                { key: 'examples', label: 'Practical Examples', desc: 'Supported theory with realistic code walkthroughs or system scenarios.' },
              ].map(({ key, label, desc }) => {
                const currentVal = ratings[key as keyof RatingCriteria];
                return (
                  <div key={key} className="rounded-2xl border border-[#133336] bg-[#090b16] p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-200">{label}</span>
                        <span className="text-xs font-mono font-bold text-[#5DA8B6]">{currentVal}/5</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-3">{desc}</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() =>
                            setRatings((prev) => ({
                              ...prev,
                              [key]: star,
                            }))
                          }
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            currentVal >= star
                              ? 'bg-[#367D8A] text-white shadow-sm shadow-[#367D8A]/30'
                              : 'bg-[#151a30] text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {star}★
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Missing Concepts Checklist */}
            {topic.keyConcepts && topic.keyConcepts.length > 0 && (
              <div className="rounded-2xl border border-[#133336] bg-[#090b16] p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                  Missing Concepts Checklist
                </span>
                <p className="text-[11px] text-slate-400 mb-3">
                  Check off any concepts you missed in your explanation to review them next time:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {topic.keyConcepts.map((concept, idx) => {
                    const isChecked = missingConcepts.includes(concept);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleMissingConcept(concept)}
                        className={`flex items-start gap-2.5 rounded-xl p-2.5 text-left text-xs border transition-all ${
                          isChecked
                            ? 'border-amber-500/40 bg-amber-500/10 text-amber-200'
                            : 'border-[#133336] bg-[#12162a] text-slate-300 hover:text-white'
                        }`}
                      >
                        <span
                          className={`h-4 w-4 rounded shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5 ${
                            isChecked
                              ? 'bg-amber-500 text-black'
                              : 'border border-slate-600 bg-slate-900'
                          }`}
                        >
                          {isChecked ? '✓' : ''}
                        </span>
                        <span>{concept}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Confidence & Spaced-Repetition Review Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Confidence */}
              <div className="rounded-2xl border border-[#133336] bg-[#090b16] p-4">
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Recall Confidence
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Low', 'Medium', 'High'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setConfidence(lvl)}
                      className={`rounded-xl py-2 text-xs font-semibold border transition-all ${
                        confidence === lvl
                          ? 'border-cyan-500 bg-cyan-500/20 text-cyan-200 shadow-sm'
                          : 'border-[#133336] bg-[#12162a] text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spaced Repetition Next Review Scheduling */}
              <div className="rounded-2xl border border-[#133336] bg-[#090b16] p-4">
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Spaced Repetition Rating (SM-2)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'Again', label: 'Again', desc: '1 day' },
                    { id: 'Hard', label: 'Hard', desc: '2 days' },
                    { id: 'Good', label: 'Good', desc: '5 days' },
                    { id: 'Easy', label: 'Easy', desc: '10 days' },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setReviewDifficulty(btn.id as ReviewDifficulty)}
                      className={`flex flex-col items-center justify-center rounded-xl py-1.5 border transition-all ${
                        reviewDifficulty === btn.id
                          ? 'border-[#367D8A] bg-[#367D8A]/30 text-white font-bold'
                          : 'border-[#133336] bg-[#12162a] text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xs">{btn.label}</span>
                      <span className="text-[10px] text-slate-500">{btn.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Optional Reflection Note */}
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                Reflection Note (Optional)
              </label>
              <input
                type="text"
                value={reflectionNote}
                onChange={(e) => setReflectionNote(e.target.value)}
                placeholder="E.g., remember to emphasize O(N) amortized proof next time"
                className="w-full rounded-xl border border-[#133336] bg-[#090b16] px-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:border-[#367D8A] outline-none"
              />
            </div>

            {/* Final Complete Action */}
            <button
              onClick={handleCompleteSession}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#367D8A] via-[#285F6B] to-[#367D8A] py-3.5 text-base font-bold text-white shadow-xl shadow-[#367D8A]/30 hover:brightness-110 active:scale-95 transition-all"
            >
              <Sparkles className="h-5 w-5" />
              <span>Complete Practice Session</span>
            </button>
          </div>
        </div>
      )}

      {/* STATE 4: COMPLETION SUMMARY SCREEN */}
      {sessionState === 'completed' && completedRecord && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="rounded-3xl border border-[#367D8A]/40 bg-gradient-to-br from-[#13172e] via-[#0d1020] to-[#090b16] p-6 sm:p-10 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#367D8A]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Badge Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#367D8A] to-cyan-500 text-white shadow-lg shadow-[#367D8A]/30 mb-4">
              <Award className="h-8 w-8" />
            </div>

            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30 inline-block mb-2">
              ✓ Challenge Completed
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              {topic.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
              Your explanation and self-assessment have been recorded into your local practice history.
            </p>

            {/* XP Earned Card */}
            <div className="rounded-2xl border border-[#367D8A]/30 bg-[#133336]/25 p-5 max-w-lg mx-auto mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5DA8B6]">
                  XP Earned
                </span>
                <span className="text-2xl font-extrabold text-[#5DA8B6] font-mono">
                  +{completedRecord.xpEarned} XP
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="rounded-lg bg-[#0f1426] p-2 border border-[#133336]">
                  <span className="text-[10px] text-slate-500 block">Base Practice</span>
                  <span className="font-bold text-slate-200">+{completedRecord.xpBreakdown.base}</span>
                </div>
                <div className="rounded-lg bg-[#0f1426] p-2 border border-[#133336]">
                  <span className="text-[10px] text-slate-500 block">Recall Bonus</span>
                  <span className="font-bold text-emerald-400">+{completedRecord.xpBreakdown.recallBonus}</span>
                </div>
                <div className="rounded-lg bg-[#0f1426] p-2 border border-[#133336]">
                  <span className="text-[10px] text-slate-500 block">Rating Bonus</span>
                  <span className="font-bold text-cyan-400">+{completedRecord.xpBreakdown.ratingBonus}</span>
                </div>
                <div className="rounded-lg bg-[#0f1426] p-2 border border-[#133336]">
                  <span className="text-[10px] text-slate-500 block">Daily Mission</span>
                  <span className="font-bold text-amber-400">+{completedRecord.xpBreakdown.dailyMissionBonus}</span>
                </div>
              </div>
            </div>

            {/* Summary Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto mb-8 text-left">
              <div className="rounded-xl border border-[#133336] bg-[#0a0d18] p-3">
                <span className="text-[10px] text-slate-500 block">Self-Assessment</span>
                <span className="text-base font-bold text-white font-mono flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  {completedRecord.averageRating}
                </span>
              </div>
              <div className="rounded-xl border border-[#133336] bg-[#0a0d18] p-3">
                <span className="text-[10px] text-slate-500 block">Time Spent</span>
                <span className="text-base font-bold text-white font-mono">
                  {formatTime(completedRecord.durationSeconds)}
                </span>
              </div>
              <div className="rounded-xl border border-[#133336] bg-[#0a0d18] p-3">
                <span className="text-[10px] text-slate-500 block">Word Count</span>
                <span className="text-base font-bold text-white font-mono">
                  {completedRecord.wordCount} words
                </span>
              </div>
              <div className="rounded-xl border border-[#133336] bg-[#0a0d18] p-3">
                <span className="text-[10px] text-slate-500 block">Review Schedule</span>
                <span className="text-xs font-bold text-cyan-400">
                  {completedRecord.reviewDifficulty}
                </span>
              </div>
            </div>

            {/* Navigation CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <Link
                to="/practice"
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#367D8A] to-[#285F6B] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#367D8A]/30 hover:brightness-110 active:scale-95 transition-all"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Practice Another Topic</span>
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#2a355c] bg-[#141a33] px-6 py-3 text-sm font-semibold text-slate-200 hover:text-white hover:bg-[#1a2242] transition-colors"
              >
                <span>Back to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Reveal Notes Warning */}
      {showRevealNotesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="rounded-3xl border border-amber-500/40 bg-[#12162a] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">End Independent Recall?</h3>
                <span className="text-xs text-amber-300">Warning: Recall mode change</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Revealing the notes during an active challenge ends independent recall mode and flags this session as <strong>Assisted</strong>. You will forfeit the +10 XP independent recall bonus.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowRevealNotesModal(false)}
                className="rounded-xl border border-[#222a47] bg-[#161c33] px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Keep Trying
              </button>
              <button
                onClick={handleConfirmRevealNotes}
                className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400"
              >
                Yes, Reveal Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Exit Confirmation Guard */}
      {showExitConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="rounded-3xl border border-rose-500/40 bg-[#12162a] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="h-10 w-10 rounded-xl bg-rose-500/20 flex items-center justify-center border border-rose-500/30">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Discard Unsaved Answer?</h3>
                <span className="text-xs text-rose-300">You have written {wordCount} words</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Leaving the practice arena now will discard your current draft explanation and won't award any XP or streak progress.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowExitConfirmModal(false)}
                className="rounded-xl border border-[#222a47] bg-[#161c33] px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Continue Writing
              </button>
              <button
                onClick={() => navigate('/practice')}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500"
              >
                Discard & Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
