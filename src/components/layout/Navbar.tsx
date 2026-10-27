import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  RotateCw,
  Flame,
  Sparkles,
  RotateCcw,
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

  const todayStr = new Date().toISOString().split('T')[0];
  const dueCount = Object.values(revisionSchedule).filter((s) => s.nextReviewDate <= todayStr).length;
  const isLanding = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[rgba(242,245,248,0.08)] bg-[#08090B]/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-8 lg:px-12">
        {/* Brand Logo & Mobile Trigger */}
        <div className="flex items-center gap-3">
          {!isLanding && onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 rounded-xl text-[#8E959E] hover:text-white hover:bg-white/[0.04] transition-colors"
              aria-label="Open navigation drawer"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F1115] border border-[rgba(242,245,248,0.12)] text-[#03E29C] shadow-sm group-hover:border-[#03E29C]/50 transition-colors">
              <span className="font-mono text-xs font-bold">CQ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-sans font-semibold tracking-tight text-white text-base">
                CODEQUEST
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono tracking-widest text-[#03E29C] uppercase px-1.5 py-0.5 rounded bg-[#03E29C]/10 border border-[#03E29C]/20">
                STUDIO
              </span>
            </div>
          </Link>
        </div>

        {/* Global Telemetry & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {isLanding ? (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex text-xs font-mono uppercase tracking-wider text-[#8E959E] hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/practice"
                className="inline-flex items-center gap-2 rounded-full bg-[#03E29C] px-4 py-2 text-xs font-semibold text-[#08090B] shadow-md shadow-[#03E29C]/15 hover:bg-[#00FFAF] active:scale-95 transition-all"
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>Launch Arena</span>
              </Link>
            </div>
          ) : (
            <>
              {/* Streak Badge */}
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[rgba(242,245,248,0.08)] bg-[#0F1115] text-xs font-mono"
                title={`${currentStreak} day active streak! Complete 1 topic daily to preserve your streak.`}
              >
                <Flame className={`h-3.5 w-3.5 ${currentStreak > 0 ? 'text-[#03E29C] fill-[#03E29C]' : 'text-white/20'}`} />
                <span className="font-semibold text-white">{currentStreak}</span>
                <span className="hidden sm:inline text-[#8E959E]">d streak</span>
              </div>

              {/* XP Level Bar */}
              <Link
                to="/progress"
                className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(242,245,248,0.08)] bg-[#0F1115] text-xs hover:border-[rgba(242,245,248,0.18)] transition-colors"
                title={`Level ${levelInfo.level} Engineer (${totalXP} Total XP)`}
              >
                <div className="flex items-center gap-1 font-mono text-[#03E29C]">
                  <Sparkles className="h-3 w-3 text-[#03E29C]" />
                  <span>Lvl {levelInfo.level}</span>
                </div>
                <div className="w-12 h-1 bg-[#16191F] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#03E29C] transition-all duration-500"
                    style={{ width: `${levelInfo.progressPercent}%` }}
                  />
                </div>
                <span className="font-mono text-[#8E959E] text-xs">{totalXP} XP</span>
              </Link>

              {/* Due Revisions Notification */}
              {dueCount > 0 && (
                <Link
                  to="/revision"
                  className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-[rgba(242,245,248,0.12)] bg-[#0F1115] text-white hover:border-[#03E29C]/40 transition-all"
                  title={`${dueCount} revision topic(s) due!`}
                >
                  <RotateCcw className="h-3.5 w-3.5 text-[#03E29C]" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#03E29C] text-[9px] font-bold text-[#08090B] font-mono">
                    {dueCount}
                  </span>
                </Link>
              )}

              {/* Profile Avatar */}
              <Link
                to="/profile"
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl border border-[rgba(242,245,248,0.08)] bg-[#0F1115] hover:border-[rgba(242,245,248,0.2)] transition-colors"
              >
                <div className="h-6 w-6 rounded-md bg-[#16191F] border border-[rgba(242,245,248,0.12)] flex items-center justify-center text-[11px] font-bold text-[#F3F4F6]">
                  {profile.name.charAt(0)}
                </div>
                <span className="hidden md:inline text-xs font-medium text-[#F3F4F6]">
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
