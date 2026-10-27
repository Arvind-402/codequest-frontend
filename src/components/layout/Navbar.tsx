import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  RotateCw,
  Flame,
  Sparkles,
  RotateCcw,
  Compass,
} from 'lucide-react';
import { useCodeQuest } from '../../context/CodeQuestContext';
import { getLevelProgress } from '../../utils/xp';

interface NavbarProps {
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const location = useLocation();
  const { currentStreak, totalXP, profile, revisionSchedule } = useCodeQuest();
  const levelInfo = getLevelProgress(totalXP);

  // Due revisions count
  const todayStr = new Date().toISOString().split('T')[0];
  const dueCount = Object.values(revisionSchedule).filter((s) => s.nextReviewDate <= todayStr).length;

  const isLanding = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#133336]/40 bg-[#010001]/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-8 lg:px-12">
        {/* Brand Logo & Mobile Trigger */}
        <div className="flex items-center gap-3">
          {!isLanding && onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-[#133336]/30 transition-colors"
              aria-label="Open navigation drawer"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#133336] via-[#285F6B] to-[#367D8A] text-white shadow-lg shadow-[#367D8A]/20 group-hover:scale-105 transition-transform">
              <Compass className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-normal tracking-tight text-white group-hover:text-[#5DA8B6] transition-colors leading-tight">
                CODEQUEST
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#367D8A] uppercase">
                INTERVIEW ARENA
              </span>
            </div>
          </Link>
        </div>

        {/* Global Gamification & Telemetry Strip */}
        <div className="flex items-center gap-2 sm:gap-4">
          {isLanding ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex text-xs font-mono uppercase tracking-wider text-white/60 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/practice"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#285F6B] to-[#367D8A] px-4 py-2 text-xs font-medium text-white shadow-md shadow-[#367D8A]/20 hover:brightness-110 active:scale-95 transition-all"
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>Launch Arena</span>
              </Link>
            </div>
          ) : (
            <>
              {/* Streak Badge */}
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#133336] bg-[#040a0b] text-xs font-mono"
                title={`${currentStreak} day active streak! Complete 1 topic daily to preserve your streak.`}
              >
                <Flame className={`h-3.5 w-3.5 ${currentStreak > 0 ? 'text-[#367D8A] fill-[#367D8A]' : 'text-white/30'}`} />
                <span className="font-bold text-white">{currentStreak}</span>
                <span className="hidden sm:inline text-white/40">d streak</span>
              </div>

              {/* XP Level Bar */}
              <Link
                to="/progress"
                className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-[#133336] bg-[#040a0b] text-xs hover:border-[#367D8A]/50 transition-colors"
                title={`Level ${levelInfo.level} Engineer (${totalXP} Total XP)`}
              >
                <div className="flex items-center gap-1 font-mono text-[#5DA8B6]">
                  <Sparkles className="h-3 w-3 text-[#367D8A]" />
                  <span>Lvl {levelInfo.level}</span>
                </div>
                <div className="w-12 h-1 bg-[#133336] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#285F6B] to-[#367D8A] transition-all duration-500"
                    style={{ width: `${levelInfo.progressPercent}%` }}
                  />
                </div>
                <span className="font-mono text-white/60 text-xs">{totalXP} XP</span>
              </Link>

              {/* Due Revisions Notification */}
              {dueCount > 0 && (
                <Link
                  to="/revision"
                  className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-[#367D8A]/40 bg-[#133336]/40 text-white hover:bg-[#133336]/70 transition-all"
                  title={`${dueCount} revision topic(s) due!`}
                >
                  <RotateCcw className="h-3.5 w-3.5 text-[#5DA8B6]" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#367D8A] text-[9px] font-bold text-white font-mono">
                    {dueCount}
                  </span>
                </Link>
              )}

              {/* Profile Avatar */}
              <Link
                to="/profile"
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl border border-[#133336] bg-[#040a0b] hover:border-[#367D8A]/50 transition-colors"
              >
                <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#133336] to-[#367D8A] flex items-center justify-center text-[11px] font-bold text-white shadow">
                  {profile.name.charAt(0)}
                </div>
                <span className="hidden md:inline text-xs font-medium text-white/80">
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
