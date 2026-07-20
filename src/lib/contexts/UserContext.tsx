'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useUser } from '@/lib/hooks/useUser';

interface User {
  id: number;
  email: string;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  balance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalProfit: number;
  totalTrades: number;
  isAdmin: boolean;
  isActive: boolean;
  currency: string;
  profileImage: string | null;
  createdAt: string;
  country?: string | null;
  phone?: string | null;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
  refresh: async () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const userData = useUser();
  return (
    <UserContext.Provider value={userData}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}