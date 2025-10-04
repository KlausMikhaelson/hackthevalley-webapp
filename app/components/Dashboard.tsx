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
        {/* Header */}
        <header className="bg-[#1a1a2e] border-b border-[#27272a] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {activeTab === 'dashboard' && 'Financial Dashboard'}
                {activeTab === 'spending' && 'Spending Tracker'}
                {activeTab === 'goals' && 'Savings Goals'}
                {activeTab === 'analytics' && 'Analytics'}
                {activeTab === 'settings' && 'Settings'}
              </h1>
              <p className="text-[#a1a1aa] mt-1">
                {activeTab === 'dashboard' && 'Track your spending and savings goals'}
                {activeTab === 'spending' && 'Monitor your daily expenses'}
                {activeTab === 'goals' && 'Manage your financial targets'}
                {activeTab === 'analytics' && 'View detailed financial insights'}
                {activeTab === 'settings' && 'Configure your preferences'}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type here..."
                  className="w-64 px-4 py-2 bg-[#27272a] border border-[#3b82f6]/30 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] text-white placeholder-[#a1a1aa]"
                />
                <svg className="absolute right-3 top-2.5 w-5 h-5 text-[#a1a1aa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-[#a1a1aa] hover:text-white hover:bg-[#27272a] rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <button
                  onClick={resetDailySpending}
                  className="p-2 text-[#a1a1aa] hover:text-white hover:bg-[#27272a] rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H5a8.001 8.001 0 0015.958 2M20 20v-5h-.582m-15.356-2A8.001 8.001 0 0019.418 15M19.418 15H19a8.001 8.001 0 01-15.958-2M4 4l1-1m19.314 19l-1-1M5 4l1 1M18 19l1-1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

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
                    <div className="w-12 h-12 bg-[#3b82f6] rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-[#a1a1aa]">Today's Income</p>
                      <p className="text-2xl font-bold text-white">${dailySpent.toFixed(2)}</p>
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
