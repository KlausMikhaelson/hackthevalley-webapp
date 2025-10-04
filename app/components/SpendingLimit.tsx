'use client';

import { useState } from 'react';

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
    <div className="bg-[#1a1a2e] rounded-xl card-shadow-lg p-6 border border-[#27272a]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-[#3b82f6] rounded-xl flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Spending Limit</h2>
            <p className="text-sm text-[#a1a1aa]">Track your daily expenses</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-[#a1a1aa]">Daily Limit</div>
          <div className="text-lg font-bold text-white">${dailyLimit.toFixed(2)}</div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-3">
          <div>
            <div className="text-sm text-[#a1a1aa]">Today's Spending</div>
            <div className="text-2xl font-bold text-white">${dailySpent.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${
              spendingPercentage >= 100 
                ? 'text-red-400' 
                : spendingPercentage >= 80 
                  ? 'text-yellow-400' 
                  : 'text-green-400'
            }`}>
              {spendingPercentage.toFixed(1)}%
            </div>
            <div className="text-xs text-[#a1a1aa]">of limit</div>
          </div>
        </div>
        <div className="w-full bg-[#27272a] rounded-full h-2">
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
      
      {/* Quick Actions */}
      <div className="space-y-4">
        <div>
          <label htmlFor="expense" className="block text-sm font-medium text-white mb-2">
            Add Expense
          </label>
          <div className="flex gap-3">
            <input
              id="expense"
              type="number"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 px-4 py-3 bg-[#27272a] border border-[#3b82f6]/30 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] text-white placeholder-[#a1a1aa]"
            />
            <button
              onClick={handleAddExpense}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors shadow-lg"
            >
              Add Expense
            </button>
          </div>
        </div>
        
        <div>
          <label htmlFor="income" className="block text-sm font-medium text-white mb-2">
            Add Income
          </label>
          <div className="flex gap-3">
            <input
              id="income"
              type="number"
              value={incomeAmount}
              onChange={(e) => setIncomeAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 px-4 py-3 bg-[#27272a] border border-[#3b82f6]/30 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] text-white placeholder-[#a1a1aa]"
            />
            <button
              onClick={handleAddIncome}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors shadow-lg"
            >
              Add Income
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
