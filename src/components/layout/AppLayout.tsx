import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const isLandingPage = location.pathname === '/';
  const isSessionPage = location.pathname.startsWith('/practice/session/');

  const showSidebar = !isLandingPage && !isSessionPage;

  return (
    <div className="min-h-screen bg-[#030305] text-[#f0f0f5] flex flex-col font-sans selection:bg-[#ff6b2c]/30 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main Shell */}
      <div className="flex flex-1 w-full">
        {showSidebar && (
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        )}

        {/* Scrollable Content Viewport */}
        <main
          className={`flex-1 min-w-0 ${
            showSidebar ? 'px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full' : 'w-full'
          }`}
        >
          <Outlet />
        </main>
      </div>

      {/* Global App Footer for internal dashboard & syllabus pages */}
      {!isLandingPage && !isSessionPage && (
        <footer className="border-t border-white/[0.06] bg-[#020204] py-8 text-center text-xs text-slate-500 font-mono">
          <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300">CODEQUEST PRO</span>
              <span className="text-slate-600">&bull;</span>
              <span>Gamified Software Engineering Preparation</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>52 Curated Topics</span>
              <span className="text-slate-600">&bull;</span>
              <span>SM-2 Spaced Repetition</span>
              <span className="text-slate-600">&bull;</span>
              <span>Zero-Backend Prototype</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
