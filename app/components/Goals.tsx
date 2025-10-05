'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useGoals } from '../hooks/useGoals';
import { CheckCircle, FavoriteBorder, Star, StarBorder, Delete, Add, TrackChanges, Edit } from '@mui/icons-material';

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  color: string;
  deadline?: string; // ISO date string
  isDefault?: boolean;
}

interface GoalsProps {
  goals?: Goal[];
  onAddToGoal?: (goalId: string, amount: number) => void;
  onCreateGoal?: (name: string, targetAmount: number) => void;
  onUpdateGoal?: (goalId: string, updates: Partial<Goal>) => void;
  onDeleteGoal?: (goalId: string) => void;
  onSetDefaultGoal?: (goalId: string) => void;
}

export default function Goals({ goals: goalsProp, onAddToGoal: onAddToGoalProp, onCreateGoal: onCreateGoalProp, onDeleteGoal: onDeleteGoalProp, onSetDefaultGoal: onSetDefaultGoalProp }: GoalsProps) {
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  // Use Clerk user
  const { user } = useUser();
  
  // Use API-backed goals if no props provided
  const { 
    goals: apiGoals, 
    loading, 
    error,
    createGoal: createGoalAPI,
    updateGoal: updateGoalAPI,
    fetchGoals
  } = useGoals(user?.id || null);
  
  // Use prop goals if provided, otherwise use API goals
  const goals = goalsProp || apiGoals.filter(g => g.type === 'savings').map(g => ({
    id: g.id,
    name: g.name,
    targetAmount: g.target_amount,
    savedAmount: g.current_amount,
    color: 'blue',
    isDefault: g.is_default
  }));
  
  // Use prop handlers if provided, otherwise use API handlers
  const handleAddToGoalAPI = async (goalId: string, amount: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      await updateGoalAPI(goalId, { 
        current_amount: goal.savedAmount + amount 
      });
    }
  };
  
  const handleCreateGoalAPI = async (name: string, targetAmount: number) => {
    if (user?.id) {
      await createGoalAPI(name, 'savings', targetAmount, 'one_time', false);
    }
  };
  
  const handleSetDefaultGoalAPI = async (goalId: string) => {
    await updateGoalAPI(goalId, { is_default: true });
  };
  
  const onAddToGoal = onAddToGoalProp || handleAddToGoalAPI;
  const onCreateGoal = onCreateGoalProp || handleCreateGoalAPI;
  const onSetDefaultGoal = onSetDefaultGoalProp || handleSetDefaultGoalAPI;
  const onDeleteGoal = onDeleteGoalProp;
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editGoalName, setEditGoalName] = useState('');
  const [editGoalDeadline, setEditGoalDeadline] = useState('');
  const [editAddAmount, setEditAddAmount] = useState('');

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setEditGoalName(goal.name);
    setEditGoalDeadline(goal.deadline || '');
    setEditAddAmount('');
  };

  const handleUpdateGoal = () => {
    if (!editingGoal || !onUpdateGoal) return;
    
    const updates: Partial<Goal> = {
      name: editGoalName.trim(),
      deadline: editGoalDeadline || undefined
    };
    
    // Add money if specified
    const addAmount = parseFloat(editAddAmount);
    if (addAmount > 0) {
      updates.savedAmount = editingGoal.savedAmount + addAmount;
    }
    
    onUpdateGoal(editingGoal.id, updates);
    setEditingGoal(null);
    setEditGoalName('');
    setEditGoalDeadline('');
    setEditAddAmount('');
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

  // Show loading state
  if (loading && !goalsProp) {
    return (
      <div className="bg-[var(--card-bg)] rounded-xl card-shadow-lg p-6 border border-[var(--border-color)]">
        <div className="text-center py-8">
          <p className="text-[var(--text-secondary)]">Loading goals...</p>
        </div>
      </div>
    );
  }

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
        <button
          onClick={() => setShowCreateDialog(true)}
          className="w-10 h-10 btn-gradient text-white rounded-lg flex items-center justify-center transition-colors"
        >
          <Add sx={{ fontSize: 20 }} />
        </button>
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
                
                {/* Goal Info */}
                <div className="mb-3">
                  {goal.deadline && (
                    <div className="text-xs text-[var(--text-secondary)] mb-2">
                      Deadline: {new Date(goal.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                {/* Edit Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleEditGoal(goal)}
                    className="px-3 py-1 bg-[var(--accent-primary)]/10 hover:bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-xs font-medium rounded border border-[var(--accent-primary)]/30 transition-colors flex items-center gap-1"
                  >
                    <Edit sx={{ fontSize: 16 }} />
                    Edit Goal
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

      {/* Edit Goal Dialog */}
      {editingGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card-bg)] rounded-xl p-6 max-w-md w-full border border-[var(--border-color)]">
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">Edit Goal: {editingGoal.name}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Goal Name</label>
                <input
                  type="text"
                  value={editGoalName}
                  onChange={(e) => setEditGoalName(e.target.value)}
                  placeholder="Goal name"
                  className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] text-[var(--foreground)] placeholder-[var(--text-secondary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Deadline (Optional)</label>
                <input
                  type="date"
                  value={editGoalDeadline}
                  onChange={(e) => setEditGoalDeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] text-[var(--foreground)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Add Money (Optional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">$</span>
                  <input
                    type="number"
                    value={editAddAmount}
                    onChange={(e) => setEditAddAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 pr-3 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] text-[var(--foreground)] placeholder-[var(--text-secondary)]"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingGoal(null)}
                className="flex-1 px-4 py-2 bg-[var(--border-color)] hover:bg-[var(--text-secondary)]/20 text-[var(--foreground)] font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateGoal}
                className="flex-1 px-4 py-2 btn-gradient text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Edit sx={{ fontSize: 16 }} />
                Update Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}