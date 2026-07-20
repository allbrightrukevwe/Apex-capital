'use client';

import { useState, useEffect } from 'react';

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
}

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include', // Send cookies as backup auth
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUser(data.user);
    } catch (err: any) {
      setError(err.message || 'Failed to load user data');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, error, refresh: fetchUser };
}