'use client';

import { useState } from 'react';
import { Warning as WarningIcon, Close } from '@mui/icons-material';

interface RoastDialogProps {
  isOpen: boolean;
  onClose: () => void;
  roastMessage: string;
  itemName: string;
  price: number;
  dailyLimit: number;
  spentToday: number;
  newTotal: number;
  onProceedAnyway?: () => void;
}

export default function RoastDialog({
  isOpen,
  onClose,
  roastMessage,
  itemName,
  price,
  dailyLimit,
  spentToday,
  newTotal,
  onProceedAnyway
}: RoastDialogProps) {
  if (!isOpen) return null;

  const overspendAmount = newTotal - dailyLimit;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[var(--card-bg)] rounded-xl p-6 max-w-lg w-full border-2 border-red-500 shadow-2xl animate-shake">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <WarningIcon className="text-white" sx={{ fontSize: 28 }} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-500">⚠️ Overspending Alert!</h3>
              <p className="text-sm text-[var(--text-secondary)]">Think twice before proceeding</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
          >
            <Close sx={{ fontSize: 24 }} />
          </button>
        </div>

        {/* Purchase Details */}
        <div className="bg-[var(--background)] rounded-lg p-4 mb-4 border border-[var(--border-color)]">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Item:</span>
              <span className="font-semibold text-[var(--foreground)]">{itemName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Price:</span>
              <span className="font-semibold text-[var(--foreground)]">${price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Spent Today:</span>
              <span className="font-semibold text-[var(--foreground)]">${spentToday.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Daily Limit:</span>
              <span className="font-semibold text-[var(--foreground)]">${dailyLimit.toFixed(2)}</span>
            </div>
            <div className="h-px bg-[var(--border-color)] my-2"></div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">New Total:</span>
              <span className="font-bold text-red-500">${newTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Over Budget:</span>
              <span className="font-bold text-red-500">+${overspendAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Roast Message */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800 dark:text-red-200 leading-relaxed whitespace-pre-wrap">
            {roastMessage}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
          >
            Cancel Purchase
          </button>
          {onProceedAnyway && (
            <button
              onClick={onProceedAnyway}
              className="flex-1 px-4 py-3 bg-[var(--border-color)] hover:bg-[var(--text-secondary)]/20 text-[var(--foreground)] font-medium rounded-lg transition-colors"
            >
              Buy Anyway
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
