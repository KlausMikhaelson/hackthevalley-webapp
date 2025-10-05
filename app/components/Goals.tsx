'use client';

import { useState } from 'react';
import { CheckCircle, FavoriteBorder, Star, StarBorder, Delete, Add, TrackChanges } from '@mui/icons-material';

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  color: string;
  isDefault?: boolean;
}

interface GoalsProps {
  goals: Goal[];
  onAddToGoal: (goalId: string, amount: number) => void;
  onCreateGoal?: (name: string, targetAmount: number) => void;
  onDeleteGoal?: (goalId: string) => void;
  onSetDefaultGoal?: (goalId: string) => void;
}

export default function Goals({ goals, onAddToGoal, onCreateGoal, onDeleteGoal, onSetDefaultGoal }: GoalsProps) {
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [addAmountValues, setAddAmountValues] = useState<Record<string, string>>({});
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleAddToGoal = (goalId: string) => {
    const amount = parseFloat(addAmountValues[goalId] || '0');
    if (amount > 0) {
      onAddToGoal(goalId, amount);
      setAddAmountValues({ ...addAmountValues, [goalId]: '' });
    }
  };

  const handleCreateGoal = () => {
    const targetAmount = parseFloat(newGoalTarget);
    if (newGoalName.trim() && targetAmount > 0 && onCreateGoal) {
      onCreateGoal(newGoalName.trim(), targetAmount);
      setNewGoalName('');
      setNewGoalTarget('');
      setShowCreateDialog(false);
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    if (onDeleteGoal && window.confirm('Are you sure you want to delete this goal?')) {
      onDeleteGoal(goalId);
    }
  };

  const handleSetDefaultGoal = (goalId: string) => {
    if (onSetDefaultGoal) {
      onSetDefaultGoal(goalId);
    }
  };

  const getGoalProgressPercentage = (goal: Goal) => {
    return Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-[var(--accent-primary)]';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-[var(--accent-secondary)]';
  };

  return (
    <div className="bg-[var(--card-bg)] rounded-xl card-shadow-lg p-6 border border-[var(--border-color)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mr-4">
            <TrackChanges className="text-white" sx={{ fontSize: 24 }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--foreground)]">Savings Goals</h3>
            <p className="text-sm text-[var(--text-secondary)]">Track your financial targets</p>
          </div>
        </div>
        {onCreateGoal && (
          <button
            onClick={() => setShowCreateDialog(true)}
            className="w-10 h-10 btn-gradient text-white rounded-lg flex items-center justify-center transition-colors text-xl font-bold"
          >
            +
          </button>
        )}
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-8">
            <FavoriteBorder className="text-[var(--text-secondary)] mx-auto mb-4" sx={{ fontSize: 64 }} />
            <h4 className="text-lg font-semibold text-[var(--foreground)] mb-1">No goals yet</h4>
            <p className="text-sm text-[var(--text-secondary)]">Create your first savings goal!</p>
          </div>
        ) : (
          goals.map((goal) => {
            const progressPercentage = getGoalProgressPercentage(goal);
            const progressColor = getProgressColor(progressPercentage);
            
            return (
              <div key={goal.id} className="bg-[var(--background)] rounded-lg p-4 border border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-[var(--foreground)]">{goal.name}</h4>
                    <button
                      onClick={() => handleSetDefaultGoal(goal.id)}
                      className={`p-1 rounded transition-colors ${
                        goal.isDefault 
                          ? 'text-yellow-500' 
                          : 'text-[var(--text-secondary)] hover:text-yellow-500'
                      }`}
                    >
                      {goal.isDefault ? (
                        <Star className="text-yellow-500" sx={{ fontSize: 20 }} />
                      ) : (
                        <StarBorder className="text-yellow-500" sx={{ fontSize: 20 }} />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${progressColor}`}>
                      {progressPercentage.toFixed(1)}%
                    </span>
                    {onDeleteGoal && (
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-medium rounded border border-red-500/30 transition-colors flex items-center gap-1"
                      >
                        <Delete sx={{ fontSize: 16 }} />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[var(--text-secondary)]">Progress</span>
                    <span className="text-[var(--foreground)] font-semibold">
                      ${goal.savedAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-[var(--border-color)] rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${progressColor}`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                </div>
                
                {/* Add Money Section */}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">$</span>
                    <input
                      type="number"
                      value={addAmountValues[goal.id] || ''}
                      onChange={(e) => setAddAmountValues({ 
                        ...addAmountValues, 
                        [goal.id]: e.target.value 
                      })}
                      placeholder="Amount to add"
                      className="w-full pl-7 pr-3 py-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] text-[var(--foreground)] placeholder-[var(--text-secondary)]"
                    />
                  </div>
                  <button
                    onClick={() => handleAddToGoal(goal.id)}
                    className="w-10 h-10 btn-gradient text-white rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Add sx={{ fontSize: 16 }} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Goal Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card-bg)] rounded-xl p-6 max-w-md w-full border border-[var(--border-color)]">
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">Create New Goal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Goal Name</label>
                <input
                  type="text"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  placeholder="e.g., Emergency Fund"
                  className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] text-[var(--foreground)] placeholder-[var(--text-secondary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Target Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">$</span>
                  <input
                    type="number"
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 pr-3 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] text-[var(--foreground)] placeholder-[var(--text-secondary)]"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateDialog(false)}
                className="flex-1 px-4 py-2 bg-[var(--border-color)] hover:bg-[var(--text-secondary)]/20 text-[var(--foreground)] font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGoal}
                className="flex-1 px-4 py-2 btn-gradient text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Add sx={{ fontSize: 16 }} />
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}