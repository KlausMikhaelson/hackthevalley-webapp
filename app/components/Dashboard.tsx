'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import SpendingLimit from './SpendingLimit';
import Goals, { Goal } from './Goals';
import ThemeSettings from './ThemeSettings';
import { useDashboard } from '../hooks/useDashboard';
import Analytics from './Analytics';
import {
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
  Savings as SavingsIcon,
  AccountBalance as AccountBalanceIcon,
  CheckCircle as CheckCircleIcon,
  Add,
  TrackChanges as GoalsIcon
} from '@mui/icons-material';

// Default Goal Card Component for Dashboard
function DefaultGoalCard({ goal, onAddToGoal }: { goal: Goal | undefined, onAddToGoal: (goalId: string, amount: number) => void }) {
  const [addAmount, setAddAmount] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleAddToGoal = () => {
    if (goal && addAmount) {
      const amount = parseFloat(addAmount);
      if (amount > 0) {
        onAddToGoal(goal.id, amount);
        setAddAmount('');
        setShowAddDialog(false);
      }
    }
  };

  if (!goal) {
    return (
      <div className="bg-[var(--card-bg)] rounded-xl card-shadow-lg p-6 border border-[var(--border-color)]">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mr-4">
            <GoalsIcon className="text-white" sx={{ fontSize: 24 }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--foreground)]">No Primary Goal</h3>
          </div>
        </div>
        <div className="text-center py-4">
          <p className="text-[var(--text-secondary)] mb-2">Set a goal as primary to see it here</p>
          <p className="text-sm text-[var(--text-secondary)]">Use the star ⭐ on any goal to make it your primary focus</p>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
  const getProgressColor = (percentage: number): string => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-[var(--accent-primary)]';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-[var(--accent-secondary)]';
  };

  return (
    <div className="bg-[var(--card-bg)] rounded-xl card-shadow-lg p-6 border border-[var(--border-color)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mr-4">
            <GoalsIcon className="text-white" sx={{ fontSize: 24 }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--foreground)]">{goal.name}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddDialog(true)}
            className="w-10 h-10 btn-gradient text-white rounded-lg flex items-center justify-center transition-colors"
          >
            <Add sx={{ fontSize: 16 }} />
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between mb-3">
          <div>
            <div className="flex items-end gap-2">
              <div className="text-2xl font-bold text-[var(--foreground)]">${goal.savedAmount.toFixed(2)}</div>
              <div className="text-sm text-[#a1a1aa]">out of ${goal.targetAmount.toFixed(2)}</div>
            </div>
          </div>
        </div>
        <div className="w-full bg-[var(--border-color)] rounded-full h-6 relative">
          <div
            className={`h-6 rounded-full transition-all duration-300 ${getProgressColor(progressPercentage)}`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Add Money Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card-bg)] rounded-xl p-6 max-w-md w-full border border-[var(--border-color)]">
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">Add to {goal?.name}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Amount to Add</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">$</span>
                  <input
                    type="number"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 pr-3 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] text-[var(--foreground)] placeholder-[var(--text-secondary)]"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddDialog(false)}
                className="flex-1 px-4 py-2 bg-[var(--border-color)] hover:bg-[var(--text-secondary)]/20 text-[var(--foreground)] font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToGoal}
                className="flex-1 px-4 py-2 btn-gradient text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Add sx={{ fontSize: 16 }} />
                Add Money
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const {
    dailySpent,
    dailyLimit,
    weeklySpending,
    goals,
    handleAddExpense,
    handleAddIncome,
    handleAddToGoal,
    handleCreateGoal,
    handleSetDefaultGoal,
    updateDailyLimit,
    resetDailySpending
  } = useDashboard();

  const [showSettings, setShowSettings] = useState(false);
  const [newLimit, setNewLimit] = useState(dailyLimit.toString());

  // Sample recent purchases data
  const recentPurchases = [
    {
      id: '1',
      amount: 45.99,
      category: 'Shopping',
      website: 'Amazon',
      date: new Date('2025-10-04')
    },
    {
      id: '2',
      amount: 12.50,
      category: 'Food & Dining',
      website: 'Starbucks',
      date: new Date('2025-10-04')
    },
    {
      id: '3',
      amount: 89.99,
      category: 'Electronics',
      website: 'Best Buy',
      date: new Date('2025-10-03')
    },
    {
      id: '4',
      amount: 23.45,
      category: 'Groceries',
      website: 'Walmart',
      date: new Date('2025-10-03')
    },
    {
      id: '5',
      amount: 15.99,
      category: 'Entertainment',
      website: 'Netflix',
      date: new Date('2025-10-02')
    },
    {
      id: '6',
      amount: 34.99,
      category: 'Transportation',
      website: 'Uber',
      date: new Date('2025-10-02')
    },
    {
      id: '7',
      amount: 67.89,
      category: 'Clothing',
      website: 'H&M',
      date: new Date('2025-10-01')
    },
    {
      id: '8',
      amount: 19.99,
      category: 'Books',
      website: 'Barnes & Noble',
      date: new Date('2025-10-01')
    },
    {
      id: '9',
      amount: 8.50,
      category: 'Food & Dining',
      website: 'McDonald\'s',
      date: new Date('2025-09-30')
    },
    {
      id: '10',
      amount: 120.00,
      category: 'Health & Fitness',
      website: 'Planet Fitness',
      date: new Date('2025-09-30')
    },
    {
      id: '11',
      amount: 56.78,
      category: 'Gas',
      website: 'Shell',
      date: new Date('2025-09-29')
    },
    {
      id: '12',
      amount: 29.99,
      category: 'Software',
      website: 'Adobe',
      date: new Date('2025-09-29')
    }
  ];

  const handleUpdateLimit = () => {
    const limit = parseFloat(newLimit);
    if (limit > 0) {
      updateDailyLimit(limit);
      setShowSettings(false);
    }
  };

  const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalSpentLast7 = weeklySpending.reduce((sum, d) => sum + d.spent, 0);
  const defaultGoal = goals.find(goal => goal.isDefault);

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebar-collapsed');
    if (savedCollapsed !== null) {
      setIsSidebarCollapsed(JSON.parse(savedCollapsed));
    }
  }, []);

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-[var(--card-bg)] border-b border-[var(--accent-primary)]/30 px-6 py-4">
            <div className="flex items-center gap-4">
              <label htmlFor="daily-limit" className="text-sm font-medium text-[var(--foreground)]">
                Daily Spending Limit:
              </label>
              <div className="flex gap-3">
                <input
                  id="daily-limit"
                  type="number"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  className="px-3 py-2 bg-[var(--background)] border border-[var(--accent-primary)]/30 rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] text-[var(--foreground)] w-32"
                />
                <button
                  onClick={handleUpdateLimit}
                  className="btn-gradient text-white text-sm rounded-lg px-4 py-2"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[var(--card-bg)] rounded-xl card-shadow-lg p-6 border border-[var(--border-color)]">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mr-4">
                      <SavingsIcon className="text-white" sx={{ fontSize: 24 }} />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">Money Saved</p>
                      <p className="text-2xl font-bold text-[var(--foreground)]">$0.00</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--card-bg)] rounded-xl card-shadow-lg p-6 border border-[var(--border-color)]">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mr-4">
                      <CheckCircleIcon className="text-white" sx={{ fontSize: 24 }} />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">Transactions Cancelled</p>
                      <p className="text-2xl font-bold text-[var(--foreground)]">0</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Dashboard Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SpendingLimit
                  dailySpent={dailySpent}
                  dailyLimit={dailyLimit}
                  onAddExpense={handleAddExpense}
                  onAddIncome={handleAddIncome}
                  showRecentPurchases={false}
                />
                <DefaultGoalCard
                  goal={defaultGoal}
                  onAddToGoal={handleAddToGoal}
                />
              </div>
            </div>
          )}

          {activeTab === 'spending' && (
              <SpendingLimit
                dailySpent={dailySpent}
                dailyLimit={dailyLimit}
                onAddExpense={handleAddExpense}
                onAddIncome={handleAddIncome}
                recentPurchases={recentPurchases}
                showRecentPurchases={true}
              />
          )}

          {activeTab === 'goals' && (
              <Goals
                goals={goals}
                onAddToGoal={handleAddToGoal}
                onCreateGoal={handleCreateGoal}
                onSetDefaultGoal={handleSetDefaultGoal}
              />
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6 max-w-6xl">
              <Analytics 
                weeklySpending={weeklySpending} 
                dailyLimit={dailyLimit} 
                totalSaved={totalSaved}
                totalSpent={totalSpentLast7}
              />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <ThemeSettings />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
