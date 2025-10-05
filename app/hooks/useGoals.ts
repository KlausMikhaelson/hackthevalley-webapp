'use client';

import { useState, useEffect } from 'react';

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  type: 'daily_spending' | 'savings' | 'custom';
  target_amount: number;
  current_amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'one_time';
  is_default: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface SpendingCheckResult {
  success: boolean;
  can_purchase: boolean;
  is_overspending: boolean;
  daily_limit: number;
  spent_today: number;
  remaining: number;
  new_total: number;
  overspend_amount: number;
  roast_message: string | null;
  message: string;
}

export function useGoals(userId: string | null) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch goals for user
  const fetchGoals = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/goals/list?user_id=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setGoals(data.goals);
      } else {
        setError(data.error || 'Failed to fetch goals');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  };

  // Initialize default goal for new user
  const initializeDefaultGoal = async () => {
    if (!userId) return;
    
    try {
      const response = await fetch('/api/goals/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchGoals(); // Refresh goals list
        return data.goal;
      }
    } catch (err) {
      console.error('Error initializing default goal:', err);
    }
  };

  // Create a new goal
  const createGoal = async (
    name: string,
    type: 'daily_spending' | 'savings' | 'custom',
    target_amount: number,
    period: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'one_time',
    is_default: boolean = false
  ) => {
    if (!userId) return;
    
    try {
      const response = await fetch('/api/goals/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          name,
          type,
          target_amount,
          period,
          is_default
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchGoals(); // Refresh goals list
        return data.goal;
      } else {
        setError(data.error || 'Failed to create goal');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create goal');
    }
  };

  // Update a goal
  const updateGoal = async (
    goal_id: string,
    updates: Partial<Pick<Goal, 'name' | 'target_amount' | 'current_amount' | 'is_default'>>
  ) => {
    if (!userId) return;
    
    try {
      const response = await fetch('/api/goals/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal_id,
          user_id: userId,
          ...updates
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchGoals(); // Refresh goals list
        return data.goal;
      } else {
        setError(data.error || 'Failed to update goal');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update goal');
    }
  };

  // Check if a purchase would exceed spending limit
  const checkSpending = async (
    item_name: string,
    price: number
  ): Promise<SpendingCheckResult | null> => {
    if (!userId) return null;
    
    try {
      const response = await fetch('/api/purchases/check-spending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          item_name,
          price
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data;
      } else {
        setError(data.error || 'Failed to check spending');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check spending');
      return null;
    }
  };

  // Reset daily spending goals
  const resetDailyGoals = async () => {
    if (!userId) return;
    
    try {
      const response = await fetch('/api/goals/reset-daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchGoals(); // Refresh goals list
      }
    } catch (err) {
      console.error('Error resetting daily goals:', err);
    }
  };

  // Load goals on mount and when userId changes
  useEffect(() => {
    if (userId) {
      fetchGoals();
    }
  }, [userId]);

  return {
    goals,
    loading,
    error,
    fetchGoals,
    initializeDefaultGoal,
    createGoal,
    updateGoal,
    checkSpending,
    resetDailyGoals
  };
}
