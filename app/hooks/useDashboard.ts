'use client';

import { useState, useEffect } from 'react';
import { Goal } from '../components/Goals';

export function useDashboard() {
  // Spending state
  const [dailySpent, setDailySpent] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(100); // Default daily limit
  
  // Goals state
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Emergency Fund',
      targetAmount: 5000,
      savedAmount: 1200,
      color: 'green'
    },
    {
      id: '2', 
      name: 'Vacation',
      targetAmount: 2500,
      savedAmount: 800,
      color: 'blue'
    },
    {
      id: '3',
      name: 'New Laptop',
      targetAmount: 1500,
      savedAmount: 300,
      color: 'purple'
    }
  ]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedDailySpent = localStorage.getItem('dashboard-dailySpent');
    const savedDailyLimit = localStorage.getItem('dashboard-dailyLimit');
    const savedGoals = localStorage.getItem('dashboard-goals');

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
  }, []);

  // Save spending data whenever it changes
  useEffect(() => {
    localStorage.setItem('dashboard-dailySpent', dailySpent.toString());
  }, [dailySpent]);

  useEffect(() => {
    localStorage.setItem('dashboard-dailyLimit', dailyLimit.toString());
  }, [dailyLimit]);

  // Save goals data whenever it changes
  useEffect(() => {
    localStorage.setItem('dashboard-goals', JSON.stringify(goals));
  }, [goals]);

  // Reset daily spending (call this at midnight or manually)
  const resetDailySpending = () => {
    setDailySpent(0);
  };

  // Handle adding expense
  const handleAddExpense = (amount: number) => {
    setDailySpent(prev => prev + amount);
  };

  // Handle adding income
  const handleAddIncome = (amount: number) => {
    // Some income could go to goals or reduce daily spending
    // For now, just reduce daily spending (income = spending allowance increase)
    setDailySpent(prev => Math.max(0, prev - amount));
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
      color: ['green', 'blue', 'purple', 'yellow', 'pink'][goals.length % 5]
    };
    setGoals(prev => [...prev, newGoal]);
  };

  // Update daily limit
  const updateDailyLimit = (newLimit: number) => {
    setDailyLimit(newLimit);
  };

  return {
    // Spending data
    dailySpent,
    dailyLimit,
    
    // Goals data
    goals,
    
    // Actions
    handleAddExpense,
    handleAddIncome,
    handleAddToGoal,
    handleCreateGoal,
    updateDailyLimit,
    resetDailySpending
  };
}
