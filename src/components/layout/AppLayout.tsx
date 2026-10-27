import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // On the landing page, we render the full cinematic layout without sidebar
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#010001] text-white flex flex-col font-sans selection:bg-[#367D8A]/40 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

      <div className="flex flex-1">
        {/* Persistent Desktop Sidebar and Mobile Drawer (hidden on landing page) */}
        {!isLandingPage && (
          <Sidebar
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Routed Content Area */}
        <main className="flex-1 w-full overflow-x-hidden min-h-[calc(100vh-4rem)]">
          <div className={!isLandingPage ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : ''}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
