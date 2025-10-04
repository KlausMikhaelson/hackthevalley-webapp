'use client';

import { useState } from 'react';

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  color: string;
}

interface GoalsProps {
  goals: Goal[];
  onAddToGoal: (goalId: string, amount: number) => void;
  onCreateGoal?: (name: string, targetAmount: number) => void;
}

export default function Goals({ goals, onAddToGoal, onCreateGoal }: GoalsProps) {
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [addAmountValues, setAddamountValues] = useState<Record<string, string>>({});

  const handleAddToGoal = (goalId: string) => {
    const amount = parseFloat(addAmountValues[goalId] || '0');
    if (amount > 0) {
      onAddToGoal(goalId, amount);
      setAddamountValues({ ...addAmountValues, [goalId]: '' });
    }
  };

  const handleCreateGoal = () => {
    const targetAmount = parseFloat(newGoalTarget);
    if (newGoalName.trim() && targetAmount > 0 && onCreateGoal) {
      onCreateGoal(newGoalName.trim(), targetAmount);
      setNewGoalName('');
      setNewGoalTarget('');
    }
  };

  const getGoalProgressPercentage = (goal: Goal) => {
    return Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-purple-500';
  };

  return (
    <div className="bg-[#1a1a2e] rounded-xl card-shadow-lg p-6 border border-[#27272a]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-[#8b5cf6] rounded-xl flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Savings Goals</h2>
            <p className="text-sm text-[#a1a1aa]">Track your financial targets</p>
          </div>
        </div>
        {goals.length > 0 && (
          <div className="text-right">
            <div className="text-sm text-[#a1a1aa]">Active Goals</div>
            <div className="text-lg font-bold text-white">{goals.length}</div>
          </div>
        )}
      </div>

      {/* Create New Goal */}
      {onCreateGoal && (
        <div className="mb-6 p-4 bg-[#27272a] rounded-lg border border-[#3b82f6]/30">
          <h3 className="text-lg font-semibold text-white mb-3">Create New Goal</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              placeholder="Goal name"
              className="px-3 py-2 bg-[#1a1a2e] border border-[#3b82f6]/30 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] text-white placeholder-[#a1a1aa]"
            />
            <input
              type="number"
              value={newGoalTarget}
              onChange={(e) => setNewGoalTarget(e.target.value)}
              placeholder="Target amount"
              className="px-3 py-2 bg-[#1a1a2e] border border-[#3b82f6]/30 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] text-white placeholder-[#a1a1aa]"
            />
            <button
              onClick={handleCreateGoal}
              className="px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium rounded-lg transition-colors shadow-lg"
            >
              Create Goal
            </button>
          </div>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-[#a1a1aa] mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-[#a1a1aa] text-lg">No goals yet</p>
            <p className="text-[#a1a1aa] text-sm mt-1">Create your first savings goal!</p>
          </div>
        ) : (
          goals.map((goal) => {
            const progressPercentage = getGoalProgressPercentage(goal);
            const progressColor = getProgressColor(progressPercentage);
            
            return (
              <div key={goal.id} className="p-4 bg-[#27272a] border border-[#3b82f6]/20 rounded-lg hover:border-[#3b82f6]/40 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{goal.name}</h3>
                  <div className="text-right">
                    <div className="text-sm text-[#a1a1aa]">Target</div>
                    <div className="text-sm font-medium text-white">
                      ${goal.savedAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-[#a1a1aa]">Progress</span>
                    <span className="text-sm font-bold text-white">
                      {progressPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-[#1a1a2e] rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${progressColor}`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                </div>
                
                {/* Add Money Input */}
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={addAmountValues[goal.id] || ''}
                    onChange={(e) => setAddamountValues({ 
                      ...addAmountValues, 
                      [goal.id]: e.target.value 
                    })}
                    placeholder="Amount to add"
                    className="flex-1 px-3 py-2 bg-[#1a1a2e] border border-[#3b82f6]/30 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] text-white placeholder-[#a1a1aa]"
                  />
                  <button
                    onClick={() => handleAddToGoal(goal.id)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors shadow-lg"
                  >
                    Add Money
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
