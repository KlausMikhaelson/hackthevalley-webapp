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
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  TrackChanges as GoalsIcon,
  FavoriteRounded as HeartIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
} from '@mui/icons-material';

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
  const [addAmountValues, setAddamountValues] = useState<Record<string, string>>({});
  const [showCreateDialog, setShowCreateDialog] = useState(false);

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

  const getProgressColor = (percentage: number): 'success' | 'primary' | 'warning' | 'secondary' => {
    if (percentage >= 100) return 'success';
    if (percentage >= 75) return 'primary';
    if (percentage >= 50) return 'warning';
    return 'secondary';
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
              <GoalsIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Savings Goals
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track your financial targets
              </Typography>
            </Box>
          </Box>
          {/* Create New Goal Button */}
          {onCreateGoal && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="contained"
                onClick={() => setShowCreateDialog(true)}
                startIcon={<AddIcon />}
                // sx={{
                //   background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                //   boxShadow: '0 4px 14px rgba(25, 118, 210, 0.3)',
                //   '&:hover': {
                //     background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                //     boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                //   },
                // }}
              >

              </Button>
            </Box>
          )}
        </Box>

        {/* Goals List */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {goals.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <HeartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No goals yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first savings goal!
              </Typography>
            </Box>
          ) : (
            goals.map((goal) => {
              const progressPercentage = getGoalProgressPercentage(goal);
              const progressColor = getProgressColor(progressPercentage);
              
              return (
                <Card key={goal.id} variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {goal.name}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleSetDefaultGoal(goal.id)}
                        sx={{ 
                          color: goal.isDefault ? 'warning.main' : 'text.secondary',
                          '&:hover': {
                            color: 'warning.main',
                          }
                        }}
                      >
                        <StarIcon sx={{ 
                          fill: goal.isDefault ? 'currentColor' : 'none',
                          stroke: 'currentColor',
                          strokeWidth: 1.5
                        }} />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={`${progressPercentage.toFixed(1)}%`}
                        color={progressColor}
                        size="small"
                      />
                      {onDeleteGoal && (
                        <Button
                          size="small"
                          onClick={() => handleDeleteGoal(goal.id)}
                          startIcon={<DeleteIcon />}
                          color="error"
                          variant="outlined"
                        >
                          Delete
                        </Button>
                      )}
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Progress
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ${goal.savedAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(progressPercentage, 100)}
                      color={progressColor}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  
                  {/* Add Money Section */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      type="number"
                      value={addAmountValues[goal.id] || ''}
                      onChange={(e) => setAddamountValues({ 
                        ...addAmountValues, 
                        [goal.id]: e.target.value 
                      })}
                      placeholder="Amount to add"
                      size="small"
                      fullWidth
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                      }}
                    />
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleAddToGoal(goal.id)}
                      startIcon={<AddIcon />}
                      sx={{ minWidth: 120 }}
                    >
                      Add
                    </Button>
                  </Box>
                </Card>
              );
            })
          )}
        </Box>
      </CardContent>

      {/* Create Goal Dialog */}
      <Dialog 
        open={showCreateDialog} 
        onClose={() => setShowCreateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Goal</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Goal Name"
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              placeholder="e.g., Emergency Fund"
              fullWidth
            />
            <TextField
              label="Target Amount"
              type="number"
              value={newGoalTarget}
              onChange={(e) => setNewGoalTarget(e.target.value)}
              placeholder="0.00"
              fullWidth
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateGoal}
            variant="contained"
            startIcon={<AddIcon />}
          >
            Create Goal
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
