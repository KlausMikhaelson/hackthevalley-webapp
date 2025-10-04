'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import SpendingLimit from './SpendingLimit';
import Goals from './Goals';
import { useDashboard } from '../hooks/useDashboard';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const {
    dailySpent,
    dailyLimit,
    goals,
    handleAddExpense,
    handleAddIncome,
    handleAddToGoal,
    handleCreateGoal,
    updateDailyLimit,
    resetDailySpending
  } = useDashboard();

  const [showSettings, setShowSettings] = useState(false);
  const [newLimit, setNewLimit] = useState(dailyLimit.toString());

  const handleUpdateLimit = () => {
    const limit = parseFloat(newLimit);
    if (limit > 0) {
      updateDailyLimit(limit);
      setShowSettings(false);
    }
  };

  const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);

  return (
    <div className="min-h-screen bg-[#0f0f23] flex">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-[#27272a] border-b border-[#3b82f6]/30 px-6 py-4">
            <div className="flex items-center gap-4">
              <label htmlFor="daily-limit" className="text-sm font-medium text-white">
                Daily Spending Limit:
              </label>
              <div className="flex gap-3">
                <input
                  id="daily-limit"
                  type="number"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  className="px-3 py-2 bg-[#1a1a2e] border border-[#3b82f6]/30 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] text-white w-32"
                />
                <button
                  onClick={handleUpdateLimit}
                  className="px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm rounded-lg transition-colors"
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[#1a1a2e] rounded-xl card-shadow-lg p-6 border border-[#27272a]">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[#3b82f6] rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-[#a1a1aa]">Today's Spending</p>
                      <p className="text-2xl font-bold text-white">${dailySpent.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a2e] rounded-xl card-shadow-lg p-6 border border-[#27272a]">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-[#a1a1aa]">Active Goals</p>
                      <p className="text-2xl font-bold text-white">{goals.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a2e] rounded-xl card-shadow-lg p-6 border border-[#27272a]">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[#8b5cf6] rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-[#a1a1aa]">Total Saved</p>
                      <p className="text-2xl font-bold text-white">${totalSaved.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a2e] rounded-xl card-shadow-lg p-6 border border-[#27272a]">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-[#a1a1aa]">Active Goals</p>
                      <p className="text-2xl font-bold text-white">{goals.length}</p>
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
                />
                <Goals
                  goals={goals}
                  onAddToGoal={handleAddToGoal}
                  onCreateGoal={handleCreateGoal}
                />
              </div>
            </div>
          )}

          {activeTab === 'spending' && (
            <div className="max-w-4xl">
              <SpendingLimit
                dailySpent={dailySpent}
                dailyLimit={dailyLimit}
                onAddExpense={handleAddExpense}
                onAddIncome={handleAddIncome}
              />
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="max-w-4xl">
              <Goals
                goals={goals}
                onAddToGoal={handleAddToGoal}
                onCreateGoal={handleCreateGoal}
              />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-[#1a1a2e] rounded-xl card-shadow-lg p-6 border border-[#27272a]">
                <h2 className="text-xl font-bold text-white mb-4">Coming Soon</h2>
                <p className="text-[#a1a1aa]">Advanced analytics and insights will be available here.</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-[#1a1a2e] rounded-xl card-shadow-lg p-6 border border-[#27272a]">
                <h2 className="text-xl font-bold text-white mb-4">Settings</h2>
                <p className="text-[#a1a1aa]">Configure your preferences and account settings.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
