'use client';

import { useState } from 'react';
import { AttachMoney as AttachMoneyIcon, Add } from '@mui/icons-material';

interface SpendingLimitProps {
  dailySpent: number;
  dailyLimit: number;
  onAddExpense: (amount: number) => void;
  onAddIncome: (amount: number) => void;
}

export default function SpendingLimit({ 
  dailySpent, 
  dailyLimit, 
  onAddExpense, 
  onAddIncome 
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
    <div className="bg-[var(--card-bg)] rounded-xl card-shadow-lg p-6 border border-[var(--border-color)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mr-4">
            <AttachMoneyIcon className="text-white" sx={{ fontSize: 24 }} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">Spending Limit</h2>
          </div>
        </div>
        <button
          onClick={() => setShowTransactionDialog(true)}
          className="w-10 h-10 btn-gradient text-white rounded-lg flex items-center justify-center transition-colors text-xl font-bold"
        >
          +
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-3">
          <div>
            <div className="text-sm text-[var(--text-secondary)]">Today's Spending</div>
            <div className="text-2xl font-bold text-[var(--foreground)]">${dailySpent.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${
              spendingPercentage >= 100 
                ? 'bg-red-500' 
                : spendingPercentage >= 80 
                  ? 'bg-yellow-500' 
                  : 'bg-[var(--accent-primary)]'
            }`}>
              {spendingPercentage.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="w-full bg-[var(--border-color)] rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              spendingPercentage >= 100 
                ? 'bg-red-500' 
                : spendingPercentage >= 80 
                  ? 'bg-yellow-500' 
                  : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
          />
        </div>
        <div className="text-sm text-[#a1a1aa] mt-2">
          Remaining: ${remainingAmount.toFixed(2)}
        </div>
      </div>

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
