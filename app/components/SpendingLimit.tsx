'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  TextField,
  Button,
  Avatar,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';

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

  const getProgressColor = () => {
    if (spendingPercentage >= 100) return 'error';
    if (spendingPercentage >= 80) return 'warning';
    return 'success';
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              <MoneyIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Spending Limit
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track your daily expenses
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary">
              Daily Limit
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              ${dailyLimit.toFixed(2)}
            </Typography>
          </Box>
        </Box>
        
        {/* Progress Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Today's Spending
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                ${dailySpent.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold',
                  color: spendingPercentage >= 100 ? 'error.main' :
                         spendingPercentage >= 80 ? 'warning.main' : 'success.main'
                }}
              >
                {spendingPercentage.toFixed(1)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                of limit
              </Typography>
            </Box>
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={Math.min(spendingPercentage, 100)}
            color={getProgressColor()}
            sx={{ height: 8, borderRadius: 4 }}
          />
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Remaining: ${remainingAmount.toFixed(2)}
          </Typography>
        </Box>
        
        {/* Quick Actions */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Add Expense
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                type="number"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                placeholder="0.00"
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
              />
              <Button
                variant="contained"
                color="error"
                onClick={handleAddExpense}
                startIcon={<RemoveIcon />}
                sx={{ minWidth: 120 }}
              >
                Expense
              </Button>
            </Box>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Add Income
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                type="number"
                value={incomeAmount}
                onChange={(e) => setIncomeAmount(e.target.value)}
                placeholder="0.00"
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
              />
              <Button
                variant="contained"
                color="success"
                onClick={handleAddIncome}
                startIcon={<AddIcon />}
                sx={{ minWidth: 120 }}
              >
                Income
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
