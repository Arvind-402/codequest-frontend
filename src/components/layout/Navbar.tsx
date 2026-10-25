import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, Sparkles, Menu, X, RotateCcw, ArrowRight } from 'lucide-react';
import { useCodeQuest } from '../../context/CodeQuestContext';
import { getLevelProgress } from '../../utils/xp';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { currentStreak, totalXP, profile, revisionSchedule } = useCodeQuest();
  const location = useLocation();
  const levelInfo = getLevelProgress(totalXP);

  // Count due revisions
  const todayStr = new Date().toISOString().split('T')[0];
  const dueCount = Object.values(revisionSchedule).filter((s) => s.nextReviewDate <= todayStr).length;

  const isLanding = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#030305]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          {!isLanding && (
            <button
              onClick={onToggleSidebar}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white md:hidden"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}

          <Link to="/" className="group flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#ff6b2c] via-[#8b5cf6] to-[#3b82f6] shadow-[0_0_16px_rgba(255,107,44,0.35)] group-hover:scale-105 transition-transform">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-white text-base uppercase">
                CODE<span className="text-[#ff6b2c]">QUEST</span>
              </span>
              <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border border-white/15 bg-white/[0.04] text-slate-300">
                PRO
              </span>
            </div>
          </Link>
        </div>

        {/* Center Navigation */}
        {isLanding ? (
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider uppercase text-slate-400">
            <Link to="/practice" className="hover:text-white transition-colors">
              Product
            </Link>
            <a href="#ritual" className="hover:text-white transition-colors">
              How It Works
            </a>
            <Link to="/topics" className="hover:text-white transition-colors">
              Topic Library
            </Link>
            <Link to="/progress" className="hover:text-white transition-colors">
              Progress
            </Link>
          </nav>
        ) : (
          <div className="hidden lg:flex items-center gap-4 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2 rounded-full bg-white/[0.03] px-3.5 py-1 border border-white/[0.08]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Target: <strong className="text-slate-200 font-sans">{profile.targetRole}</strong></span>
            </div>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {isLanding ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white transition-colors px-3 py-1.5"
              >
                Dashboard
              </Link>
              <Link
                to="/practice"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-[#ff6b2c] hover:text-white hover:shadow-[0_0_24px_rgba(255,107,44,0.4)] active:scale-95 transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <>
              {/* Daily Streak Badge */}
              <Link
                to="/dashboard"
                title={`${currentStreak}-day active streak`}
                className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all ${
                  currentStreak > 0
                    ? 'border-[#ff6b2c]/30 bg-[#ff6b2c]/10 text-[#ff6b2c] shadow-[0_0_14px_rgba(255,107,44,0.15)]'
                    : 'border-white/10 bg-white/[0.02] text-slate-400'
                }`}
              >
                <Flame className={`h-3.5 w-3.5 ${currentStreak > 0 ? 'text-[#ff6b2c] animate-bounce' : 'text-slate-500'}`} />
                <span>{currentStreak}d</span>
                <span className="hidden sm:inline text-slate-500 text-[10px]">streak</span>
              </Link>

              {/* XP & Level Badge */}
              <Link
                to="/progress"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.02] text-xs hover:border-white/25 transition-all"
                title={`Level ${levelInfo.level} ?" ${totalXP} Total XP`}
              >
                <div className="flex items-center gap-1 text-[#8b5cf6] font-bold">
                  <Sparkles className="h-3 w-3" />
                  <span>Lvl {levelInfo.level}</span>
                </div>
                <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] transition-all duration-500"
                    style={{ width: `${levelInfo.progressPercent}%` }}
                  />
                </div>
                <span className="font-mono text-slate-300 text-xs">{totalXP} XP</span>
              </Link>

              {/* Due Revisions Notification */}
              {dueCount > 0 && (
                <Link
                  to="/revision"
                  className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-[#06b6d4]/30 bg-[#06b6d4]/10 text-[#06b6d4] hover:bg-[#06b6d4]/20 transition-all"
                  title={`${dueCount} revision topic(s) due!`}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#06b6d4] text-[9px] font-bold text-black font-mono">
                    {dueCount}
                  </span>
                </Link>
              )}

              {/* Profile Avatar */}
              <Link
                to="/profile"
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-colors"
              >
                <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#ff6b2c] via-[#8b5cf6] to-[#06b6d4] flex items-center justify-center text-[11px] font-bold text-white shadow">
                  {profile.name.charAt(0)}
                </div>
                <span className="hidden md:inline text-xs font-medium text-slate-200">
                  {profile.name.split(' ')[0]}
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
