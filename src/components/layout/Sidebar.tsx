import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Disc,
  BookOpen,
  RotateCcw,
  BarChart3,
  UserCheck,
  Target,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useCodeQuest } from '../../context/CodeQuestContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { todayCompletedCount, dailyGoalCount, isDailyGoalMet, revisionSchedule } = useCodeQuest();

  const todayStr = new Date().toISOString().split('T')[0];
  const dueCount = Object.values(revisionSchedule).filter((s) => s.nextReviewDate <= todayStr).length;

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/practice',
      label: 'Spin Arena',
      icon: Disc,
      badge: 'Roulette',
      badgeColor: 'bg-[#03E29C]/10 text-[#03E29C] border-[#03E29C]/30',
    },
    {
      to: '/topics',
      label: 'Topic Syllabus',
      icon: BookOpen,
      badge: '52 Topics',
      badgeColor: 'bg-white/[0.04] text-[#8E959E] border-white/10',
    },
    {
      to: '/revision',
      label: 'Revision Hub',
      icon: RotateCcw,
      badge: dueCount > 0 ? `${dueCount} Due` : null,
      badgeColor: 'bg-[#03E29C]/15 text-[#03E29C] border-[#03E29C]/40 animate-pulse',
    },
    {
      to: '/progress',
      label: 'Analytics & History',
      icon: BarChart3,
      badge: null,
    },
    {
      to: '/profile',
      label: 'Profile & Goals',
      icon: UserCheck,
      badge: null,
    },
  ];

  const content = (
    <div className="flex h-full flex-col justify-between bg-[#08090B] px-3.5 py-6 border-r border-[rgba(242,245,248,0.08)]">
      <div className="space-y-6">
        <div className="px-3 pt-1">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#555B64]">
            Engineering Studio
          </p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium tracking-tight transition-all ${
                    isActive
                      ? 'bg-[#0F1115] text-white border border-[rgba(242,245,248,0.12)] shadow-sm font-semibold'
                      : 'text-[#8E959E] hover:bg-white/[0.03] hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-mono border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Daily Goal Progress */}
      <div className="space-y-3">
        <div className="rounded-2xl border border-[rgba(242,245,248,0.08)] bg-[#0F1115] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-white">
              <Target className="h-3.5 w-3.5 text-[#03E29C]" />
              Daily Objective
            </span>
            <span className="text-[10px] font-mono text-[#8E959E]">
              {todayCompletedCount} / {dailyGoalCount}
            </span>
          </div>

          <div className="h-1.5 w-full bg-[#16191F] rounded-full overflow-hidden mb-2.5">
            <div
              className={`h-full transition-all duration-500 ${
                isDailyGoalMet ? 'bg-[#03E29C]' : 'bg-gradient-to-r from-[#03E29C] to-[#C89B58]'
              }`}
              style={{
                width: `${Math.min(100, (todayCompletedCount / dailyGoalCount) * 100)}%`,
              }}
            />
          </div>

          <p className="text-[11px] text-[#8E959E]">
            {isDailyGoalMet ? (
              <span className="text-[#03E29C] font-medium flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Target reached! (+25 XP)
              </span>
            ) : (
              <span>Complete {dailyGoalCount - todayCompletedCount} more topic today.</span>
            )}
          </p>
        </div>

        <NavLink
          to="/"
          className="flex items-center justify-center gap-1.5 rounded-xl border border-[rgba(242,245,248,0.08)] py-2.5 text-xs text-[#8E959E] hover:text-white hover:bg-white/[0.03] transition-colors font-mono"
        >
          <span>Studio Overview</span>
          <ExternalLink className="h-3 w-3" />
        </NavLink>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16 z-30">
        {content}
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
