'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Ticker from './Ticker';
import ActivityFeed from './ActivityFeed';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Desktop Ticker */}
        <div className="hidden lg:block">
          <Ticker variant="desktop" />
        </div>

        {/* Desktop Activity Feed */}
        <div className="hidden lg:block">
          <ActivityFeed variant="desktop" />
        </div>

        {/* Header */}
        <Header />

        {/* Main Content Area */}
        <main className="w-full px-4 py-4 lg:px-6 lg:py-5 space-y-4">
          {/* Mobile Ticker */}
          <div className="lg:hidden">
            <Ticker variant="mobile" />
          </div>

          {/* Mobile Activity Feed */}
          <div className="lg:hidden">
            <ActivityFeed variant="mobile" />
          </div>

          {/* Page Content */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;