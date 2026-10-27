import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F3F4F6] flex flex-col font-sans selection:bg-[#03E29C]/30 selection:text-white">
      <Navbar onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

      <div className="flex flex-1">
        {!isLandingPage && (
          <Sidebar
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />
        )}

        <main className="flex-1 w-full overflow-x-hidden min-h-[calc(100vh-4rem)]">
          <div className={!isLandingPage ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : ''}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
