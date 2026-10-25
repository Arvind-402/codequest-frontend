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
    <div className="min-h-screen bg-[#0e0f11] text-[#fcf8d8] flex flex-col font-sans selection:bg-[#dd700b]/30 selection:text-[#fcf8d8]">
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
        <footer className="border-t border-[#d9dadf]/10 bg-[#0a0b0d] py-8 text-center text-xs text-[#adaca7] font-mono">
          <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#fcf8d8]">CODEQUEST PRO</span>
              <span className="text-[#7c7d75]">&bull;</span>
              <span className="text-[#d9dadf]">Frozen Mist Edition</span>
            </div>
            <div className="flex items-center gap-4 text-[#adaca7]">
              <span>52 Curated Topics</span>
              <span className="text-[#7c7d75]">&bull;</span>
              <span>SM-2 Spaced Repetition</span>
              <span className="text-[#7c7d75]">&bull;</span>
              <span>Zero-Backend Prototype</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
