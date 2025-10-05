'use client';

import { useState, useEffect } from 'react';
import { Goal } from '../components/Goals';

export function useDashboard() {
  // Spending state
  const [dailySpent, setDailySpent] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(100); // Default daily limit
  // Historical spending array of last ~30 days
  type DailyHistoryEntry = { date: string; spent: number };
  const [dailyHistory, setDailyHistory] = useState<DailyHistoryEntry[]>([]);
  
  // Goals state
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 5000,
      savedAmount: 1200,
      color: 'green',
      isDefault: true
    },
    {
      id: '2', 
      name: 'Vacation',
      targetAmount: 2500,
      savedAmount: 800,
      color: 'blue',
      isDefault: false
    },
    {
      id: '3',
      name: 'New Laptop',
      targetAmount: 1500,
      savedAmount: 300,
      color: 'purple',
      isDefault: false
    }
  ]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedDailySpent = localStorage.getItem('dashboard-dailySpent');
    const savedDailyLimit = localStorage.getItem('dashboard-dailyLimit');
    const savedGoals = localStorage.getItem('dashboard-goals');
    const savedHistory = localStorage.getItem('dashboard-dailyHistory');

    if (savedDailySpent) {
      setDailySpent(parseFloat(savedDailySpent));
    }
    if (savedDailyLimit) {
      setDailyLimit(parseFloat(savedDailyLimit));
    }
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (error) {
        console.error('Error loading goals from localStorage:', error);
      }
    }
    if (savedHistory) {
      try {
        setDailyHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading history from localStorage:', error);
      }
    }
    // Seed initial 7 days of data if none exists
    if (!savedHistory) {
      const today = new Date();
      const seeded: { date: string; spent: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().slice(0,10);
        // Simple pattern: weekday index * 5 + some base
        const spent = Math.round(((i === 0 ? 35 : 20) + (6 - i) * 3 + (d.getDay() % 3) * 4));
        seeded.push({ date: dateStr, spent });
      }
      setDailyHistory(seeded);
      // Set current day's spending to today's seed
      const todayEntry = seeded[seeded.length - 1];
      setDailySpent(todayEntry.spent);
    }
  }, []);

  // Ensure today's entry exists (and reset dailySpent if new day)
  useEffect(() => {
    const today = new Date().toISOString().slice(0,10);
    setDailyHistory(prev => {
      if (prev.some(e => e.date === today)) return prev;
      // New day: reset spending and add entry
      setDailySpent(0);
      const trimmed = prev.slice(-29); // keep max 29 previous + today = 30
      return [...trimmed, { date: today, spent: 0 }];
    });
  }, []);

  // Save spending data whenever it changes
  useEffect(() => {
    localStorage.setItem('dashboard-dailySpent', dailySpent.toString());
  }, [dailySpent]);

  useEffect(() => {
    localStorage.setItem('dashboard-dailyLimit', dailyLimit.toString());
  }, [dailyLimit]);

  useEffect(() => {
    if (dailyHistory.length) {
      localStorage.setItem('dashboard-dailyHistory', JSON.stringify(dailyHistory));
    }
  }, [dailyHistory]);

  // Save goals data whenever it changes
  useEffect(() => {
    localStorage.setItem('dashboard-goals', JSON.stringify(goals));
  }, [goals]);

  // Reset daily spending (call this at midnight or manually)
  const resetDailySpending = () => {
    setDailySpent(0);
    const today = new Date().toISOString().slice(0,10);
    setDailyHistory(prev => prev.map(e => e.date === today ? { ...e, spent: 0 } : e));
  };

  // Handle adding expense
  const handleAddExpense = (amount: number) => {
    setDailySpent(prev => prev + amount);
    const today = new Date().toISOString().slice(0,10);
    setDailyHistory(prev => prev.map(e => e.date === today ? { ...e, spent: e.spent + amount } : e));
  };

  // Handle adding income
  const handleAddIncome = (amount: number) => {
    // Some income could go to goals or reduce daily spending
    // For now, just reduce daily spending (income = spending allowance increase)
    setDailySpent(prev => Math.max(0, prev - amount));
    const today = new Date().toISOString().slice(0,10);
    setDailyHistory(prev => prev.map(e => e.date === today ? { ...e, spent: Math.max(0, e.spent - amount) } : e));
  };

  // Handle adding money to a goal
  const handleAddToGoal = (goalId: string, amount: number) => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, savedAmount: goal.savedAmount + amount }
          : goal
      )
    );
  };

  // Handle creating a new goal
  const handleCreateGoal = (name: string, targetAmount: number) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      name,
      targetAmount,
      savedAmount: 0,
      color: ['green', 'blue', 'purple', 'yellow', 'pink'][goals.length % 5],
      isDefault: false
    };
    setGoals(prev => [...prev, newGoal]);
  };

  // Handle deleting a goal
  const handleDeleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  // Handle setting a goal as default
  const handleSetDefaultGoal = (goalId: string) => {
    setGoals(prev => 
      prev.map(goal => ({
        ...goal,
        isDefault: goal.id === goalId
      }))
    );
  };

  // Update daily limit
  const updateDailyLimit = (newLimit: number) => {
    setDailyLimit(newLimit);
  };

  return {
    // Spending data
    dailySpent,
    dailyLimit,
    weeklySpending: (() => {
      const sorted = [...dailyHistory].sort((a,b) => a.date.localeCompare(b.date));
      return sorted.slice(-7); // last 7 days
    })(),
    
    // Goals data
    goals,
    
    // Actions
    handleAddExpense,
    handleAddIncome,
    handleAddToGoal,
    handleCreateGoal,
    handleDeleteGoal,
    handleSetDefaultGoal,
    updateDailyLimit,
    resetDailySpending
  };
}
