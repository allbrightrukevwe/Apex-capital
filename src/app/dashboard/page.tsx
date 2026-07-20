'use client';

import { useUserContext } from '@/lib/contexts/UserContext';
import {
  DashboardLayout,
  BalanceCard,
  QuickActions,
  StatsCards,
  MarketOverview,
} from './components';

export default function DashboardPage() {
  const { user, loading } = useUserContext();

  return (
    <DashboardLayout>
      {/* Mobile Greeting */}
      <div>
        <p className="text-slate-400 text-sm">Good Evening,</p>
        <p className="text-teal-400 text-2xl font-bold tracking-wide lg:hidden">
          {user?.fullName || user?.firstName || 'User'} 👋
        </p>
      </div>

      {/* Balance Card */}
      <BalanceCard balance={user?.balance ?? 0} loading={loading} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Stats Cards */}
      <StatsCards />

      {/* Market Overview */}
      <MarketOverview />

      {/* Spacer */}
      <div className="h-6"></div>
    </DashboardLayout>
  );
}
