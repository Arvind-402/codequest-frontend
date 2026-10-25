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

  // Due topics count
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
      badge: 'Signature',
      badgeColor: 'bg-[#dd700b]/15 text-[#dd700b] border-[#dd700b]/30',
    },
    {
      to: '/topics',
      label: 'Topic Syllabus',
      icon: BookOpen,
      badge: '52 Topics',
      badgeColor: 'bg-[#d9dadf]/5 text-[#adaca7] border-[#d9dadf]/15',
    },
    {
      to: '/revision',
      label: 'Revision Hub',
      icon: RotateCcw,
      badge: dueCount > 0 ? `${dueCount} Due` : null,
      badgeColor: 'bg-[#d9dadf]/15 text-[#fcf8d8] border-[#d9dadf]/30 animate-pulse',
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
    <div className="flex h-full flex-col justify-between bg-[#121316] px-3 py-5 border-r border-[#d9dadf]/10">
      {/* Top Navigation Links */}
      <div className="space-y-6">
        <div className="px-3 pt-1">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#7c7d75]">
            Interview Prep Suite
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
                  `group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#d9dadf]/10 text-[#fcf8d8] border border-[#dd700b]/40 shadow-[0_2px_12px_rgba(0,0,0,0.4)] font-semibold'
                      : 'text-[#adaca7] hover:bg-white/[0.03] hover:text-[#fcf8d8]'
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

      {/* Bottom: Daily Goal Widget & Quick Action */}
      <div className="space-y-3">
        {/* Daily Mission Progress */}
        <div className="rounded-2xl border border-[#d9dadf]/15 bg-[#181a1d] p-3.5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-[#fcf8d8]">
              <Target className="h-3.5 w-3.5 text-[#dd700b]" />
              Daily Mission
            </span>
            <span className="text-[10px] font-mono text-[#adaca7]">
              {todayCompletedCount} / {dailyGoalCount}
            </span>
          </div>

          <div className="h-1.5 w-full bg-[#2a2c30] rounded-full overflow-hidden mb-2.5">
            <div
              className={`h-full transition-all duration-500 ${
                isDailyGoalMet
                  ? 'bg-[#fcf8d8] shadow-[0_0_10px_rgba(252,248,216,0.5)]'
                  : 'bg-gradient-to-r from-[#dd700b] via-[#adaca7] to-[#d9dadf]'
              }`}
              style={{
                width: `${Math.min(100, (todayCompletedCount / dailyGoalCount) * 100)}%`,
              }}
            />
          </div>

          <p className="text-[11px] text-[#adaca7]">
            {isDailyGoalMet ? (
              <span className="text-[#fcf8d8] font-medium flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-[#dd700b]" /> Mission accomplished! (+25 XP)
              </span>
            ) : (
              <span>Complete {dailyGoalCount - todayCompletedCount} more challenge today.</span>
            )}
          </p>
        </div>

        {/* Home Link */}
        <NavLink
          to="/"
          className="flex items-center justify-center gap-1.5 rounded-xl border border-[#d9dadf]/15 py-2.5 text-xs text-[#adaca7] hover:text-[#fcf8d8] hover:bg-white/[0.04] transition-colors font-mono"
        >
          <span>Landing Overview</span>
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
