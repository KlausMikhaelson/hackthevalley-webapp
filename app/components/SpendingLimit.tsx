'use client';

import { useState } from 'react';
import { AttachMoney as AttachMoneyIcon, Add } from '@mui/icons-material';

interface Purchase {
  id: string;
  amount: number;
  category: string;
  website: string;
  date: Date;
}

interface SpendingLimitProps {
  dailySpent: number;
  dailyLimit: number;
  onAddExpense: (amount: number) => void;
  onAddIncome: (amount: number) => void;
  recentPurchases?: Purchase[];
  showRecentPurchases?: boolean;
}

export default function SpendingLimit({ 
  dailySpent, 
  dailyLimit, 
  onAddExpense, 
  onAddIncome,
  recentPurchases = [],
  showRecentPurchases = false
}: SpendingLimitProps) {
  const [expenseAmount, setExpenseAmount] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  
  const spendingPercentage = dailySpent / dailyLimit * 100;
  const remainingAmount = dailyLimit - dailySpent;
  
  const handleAddExpense = () => {
    const amount = parseFloat(expenseAmount);
    if (amount > 0) {
      onAddExpense(amount);
      setExpenseAmount('');
    }
  };
  
  const handleAddIncome = () => {
    const amount = parseFloat(incomeAmount);
    if (amount > 0) {
      onAddIncome(amount);
      setIncomeAmount('');
    }
  };

  return (
    <div className={showRecentPurchases ? "flex flex-col h-[calc(100vh-2rem)]" : ""}>  
      {/* Main Spending Limit Card */}
      <div className="bg-[var(--card-bg)] rounded-xl card-shadow-lg p-6 border border-[var(--border-color)] flex-shrink-0 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mr-4">
              <AttachMoneyIcon className="text-white" sx={{ fontSize: 24 }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--foreground)]">Today's Spending</h2>
            </div>
          </div>
          <button
            onClick={() => setShowTransactionDialog(true)}
            className="w-10 h-10 btn-gradient text-white rounded-lg flex items-center justify-center transition-colors"
          >
            <Add sx={{ fontSize: 20 }} />  {/* Changed from text-xl and font-bold to icon */}
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-3">
            <div>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-bold text-[var(--foreground)]">${dailySpent.toFixed(2)}</div>
                <div className="text-sm text-[#a1a1aa]">out of ${remainingAmount.toFixed(2)}</div>
              </div>
            </div>
          </div>
          <div className="w-full bg-[var(--border-color)] rounded-full h-6 relative">
            <div 
              className="h-6 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min(spendingPercentage, 100)}%`,
                background: spendingPercentage >= 100 
                  ? `linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))` // intense theme gradient for over budget
                  : spendingPercentage >= 80 
                    ? `linear-gradient(90deg, var(--accent-primary), var(--accent-bg))` // medium theme gradient for warning
                    : 'var(--accent-gradient)' // normal theme gradient
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1.0)]">
                {spendingPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Purchases List - only show when showRecentPurchases is true */}
      {showRecentPurchases && (
        <div className="bg-[var(--card-bg)] rounded-xl card-shadow-lg border border-[var(--border-color)] flex flex-col flex-1 overflow-hidden">
          <div className="p-6 pb-0">
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">Recent Purchases</h3>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="space-y-3">
              {recentPurchases.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[var(--text-secondary)]">No recent purchases</p>
                </div>
              ) : (
                recentPurchases.map((purchase) => (
                  <div key={purchase.id} className="flex items-center justify-between p-3 bg-[var(--background)] rounded-lg border border-[var(--border-color)]">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[var(--foreground)]">{purchase.website}</p>
                          <p className="text-sm text-[var(--text-secondary)]">{purchase.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[var(--foreground)]">-${purchase.amount.toFixed(2)}</p>
                          <p className="text-xs text-[var(--text-secondary)]">
                            {purchase.date.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Transaction Dialog */}
      {showTransactionDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card-bg)] rounded-xl p-6 max-w-md w-full border border-[var(--border-color)]">
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">Add Transaction</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Add Expense</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="0.00"
                    className="flex-1 px-3 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] text-[var(--foreground)] placeholder-[var(--text-secondary)]"
                  />
                  <button
                    onClick={() => {
                      handleAddExpense();
                      setShowTransactionDialog(false);
                    }}
                    className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Add sx={{ fontSize: 16 }} />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Add Income</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={incomeAmount}
                    onChange={(e) => setIncomeAmount(e.target.value)}
                    placeholder="0.00"
                    className="flex-1 px-3 py-2 bg-[var(--background)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] text-[var(--foreground)] placeholder-[var(--text-secondary)]"
                  />
                  <button
                    onClick={() => {
                      handleAddIncome();
                      setShowTransactionDialog(false);
                    }}
                    className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Add sx={{ fontSize: 16 }} />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowTransactionDialog(false)}
                className="flex-1 px-4 py-2 bg-[var(--border-color)] hover:bg-[var(--text-secondary)]/20 text-[var(--foreground)] font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
