import React, { useState } from 'react';
import {
  User,
  Sparkles,
  Flame,
  Trophy,
  Award,
  Target,
  Sliders,
  RotateCcw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  ShieldCheck,
  Save,
} from 'lucide-react';
import { useCodeQuest } from '../context/CodeQuestContext';
import { getLevelProgress } from '../utils/xp';

export const ProfilePage: React.FC = () => {
  const {
    profile,
    currentStreak,
    longestStreak,
    totalXP,
    achievements,
    updateProfile,
    updatePreferences,
    resetAllData,
    loadRichDemoData,
  } = useCodeQuest();

  const levelInfo = getLevelProgress(totalXP);

  // Profile Edit State
  const [name, setName] = useState<string>(profile.name);
  const [targetRole, setTargetRole] = useState<string>(profile.targetRole);
  const [isSavedMessage, setIsSavedMessage] = useState<boolean>(false);

  // Modals
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, targetRole);
    setIsSavedMessage(true);
    setTimeout(() => setIsSavedMessage(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-[#16191F] pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-[#03E29C]/20 text-[#03E29C] border border-[#03E29C]/30">
            <User className="h-6 w-6" />
          </span>
          Profile & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your local candidate persona, daily practice goals, study settings, and trophies.
        </p>
      </div>

      {/* USER PERSONA & LEVEL CARD */}
      <div className="rounded-3xl border border-[#16191F] bg-gradient-to-br from-[#12162a] via-[#0e1224] to-[#080a14] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-[#03E29C] to-cyan-500 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-[#03E29C]/30 ring-4 ring-[#16191F] shrink-0">
            {profile.name.charAt(0)}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-3">
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                <span className="rounded-full bg-[#03E29C]/20 px-2.5 py-0.5 text-xs font-bold text-[#03E29C] border border-[#03E29C]/30">
                  Level {levelInfo.level} SDE Candidate
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Targeting: <strong className="text-slate-200">{profile.targetRole}</strong>
              </p>
            </div>

            {/* Level Progress Bar */}
            <div className="space-y-1.5 max-w-md">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#03E29C] flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  XP Level Progress
                </span>
                <span className="font-mono text-slate-400">
                  {totalXP} / {levelInfo.nextLevelXp} XP ({levelInfo.progressPercent}%)
                </span>
              </div>
              <div className="h-2 w-full bg-[#18203d] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#03E29C] to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Quick Metrics Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs">
              <span className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 font-bold text-amber-300 flex items-center gap-1.5">
                <Flame className="h-4 w-4" /> {currentStreak}-day current streak
              </span>
              <span className="rounded-xl border border-[#232b4d] bg-[#12162a] px-3 py-1.5 font-semibold text-slate-300 flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-amber-400" /> {longestStreak}-day record
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PERSONA FORM & PREFERENCES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Candidate Profile Form */}
        <form
          onSubmit={handleSaveProfile}
          className="rounded-3xl border border-[#16191F] bg-[#0c1020] p-6 shadow-xl flex flex-col justify-between space-y-5"
        >
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Sliders className="h-4 w-4 text-[#03E29C]" />
              Candidate Persona
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Customize how your profile and target goals appear across the platform.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#16191F] bg-[#080a14] px-4 py-2.5 text-xs sm:text-sm text-slate-200 focus:border-[#03E29C] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                  Target Engineering Role
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full rounded-xl border border-[#16191F] bg-[#080a14] px-4 py-2.5 text-xs sm:text-sm text-slate-200 focus:border-[#03E29C] outline-none"
                  placeholder="e.g. Full-Stack SDE, Backend Engineer, Systems Intern"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#18203c] flex items-center justify-between">
            {isSavedMessage ? (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Saved successfully
              </span>
            ) : (
              <span className="text-[11px] text-slate-500">Stored locally in browser</span>
            )}
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-[#03E29C] px-4 py-2 text-xs font-bold text-white hover:bg-[#03E29C] transition-colors shadow-md shadow-[#03E29C]/30"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Persona</span>
            </button>
          </div>
        </form>

        {/* Practice Preferences */}
        <div className="rounded-3xl border border-[#16191F] bg-[#0c1020] p-6 shadow-xl flex flex-col justify-between space-y-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-cyan-400" />
              Practice Preferences & Daily Goal
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Tune your daily mission requirements and challenge timer presets.
            </p>

            <div className="space-y-4">
              {/* Daily Goal Count */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                  Daily Challenge Goal
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => updatePreferences({ dailyGoalCount: count })}
                      className={`rounded-xl py-2 text-xs font-semibold border transition-all ${
                        profile.preferences.dailyGoalCount === count
                          ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 font-bold'
                          : 'border-[#16191F] bg-[#12162a] text-slate-400 hover:text-white'
                      }`}
                    >
                      {count} {count === 1 ? 'Challenge' : 'Challenges'} / day
                    </button>
                  ))}
                </div>
              </div>

              {/* Default Timer Duration */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                  Default Timer Preset
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 15, 20].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => updatePreferences({ defaultTimerMinutes: mins })}
                      className={`rounded-xl py-1.5 text-xs font-semibold border transition-all ${
                        profile.preferences.defaultTimerMinutes === mins
                          ? 'border-[#03E29C] bg-[#03E29C]/25 text-[#03E29C] font-bold'
                          : 'border-[#16191F] bg-[#12162a] text-slate-400 hover:text-white'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Warn Before Reveal Notes Toggle */}
              <div className="pt-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex flex-col pr-4">
                    <span className="text-xs font-semibold text-slate-300">
                      Warn Before Revealing Notes
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Alerts when leaving independent recall mode
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.preferences.warnBeforeRevealNotes}
                    onChange={(e) =>
                      updatePreferences({ warnBeforeRevealNotes: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-[#03E29C] focus:ring-[#03E29C]"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#18203c] text-[11px] text-slate-500">
            Changes save automatically to local storage.
          </div>
        </div>
      </div>

      {/* ACHIEVEMENTS TROPHY SHOWCASE */}
      <div className="rounded-3xl border border-[#16191F] bg-[#0c1020] p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#1b223d] pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              Achievements & Trophies Showcase
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Badges unlock dynamically based on your verified practice sessions and streaks.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400">
            {achievements.filter((a) => a.isUnlocked).length} / {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`rounded-2xl border p-4 flex flex-col justify-between transition-all ${
                ach.isUnlocked
                  ? 'border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-[#13172e] to-[#0c1020] shadow-md shadow-amber-500/10'
                  : 'border-[#16191F] bg-[#090b16] opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                      ach.isUnlocked
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {ach.isUnlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      ach.isUnlocked
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {ach.isUnlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1">{ach.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {ach.description}
                </p>
              </div>

              {/* Progress Bar inside trophy */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Progress</span>
                  <span>{ach.progress} / {ach.maxProgress}</span>
                </div>
                <div className="h-1.5 w-full bg-[#18203d] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      ach.isUnlocked ? 'bg-amber-400' : 'bg-slate-700'
                    }`}
                    style={{
                      width: `${Math.min(100, (ach.progress / ach.maxProgress) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LOCAL DATA MANAGEMENT */}
      <div className="rounded-3xl border border-[#16191F] bg-[#0c1020] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1b223d] pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#03E29C]" />
              Local Storage Data Management
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              CodeQuest runs completely client-side in your browser. You can reset or reload sample data at any time.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <button
            onClick={loadRichDemoData}
            className="flex items-center gap-2 rounded-xl border border-[#03E29C]/30 bg-[#03E29C]/20 px-4 py-2.5 text-xs font-bold text-[#03E29C] hover:bg-[#03E29C]/30 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Load Rich Starter History</span>
          </button>

          <button
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Reset Demo Data to Fresh State</span>
          </button>
        </div>
      </div>

      {/* RESET CONFIRMATION MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="rounded-3xl border border-rose-500/40 bg-[#12162a] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="h-10 w-10 rounded-xl bg-rose-500/20 flex items-center justify-center border border-rose-500/30">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reset Local Practice Data?</h3>
                <span className="text-xs text-rose-300">Action cannot be undone</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This will wipe all completed session history, streak counts, XP, and bookmarks from your browser's localStorage. You will start with a fresh blank profile.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="rounded-xl border border-[#222a47] bg-[#161c33] px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllData(true);
                  setShowResetModal(false);
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500 shadow-md shadow-rose-600/30"
              >
                Yes, Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
