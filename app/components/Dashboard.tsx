'use client';

import { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  IconButton,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Switch,
  FormControlLabel,
  Button,
  InputAdornment,
  Collapse,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  FavoriteRounded as HeartIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import Sidebar from './Sidebar';
import SpendingLimit from './SpendingLimit';
import Goals from './Goals';
import { useDashboard } from '../hooks/useDashboard';
import { useTheme } from '../contexts/ThemeContext';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [newLimit, setNewLimit] = useState('');
  
  const { colorScheme, themeMode, setColorScheme, setThemeMode } = useTheme();
  
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

  const handleUpdateLimit = () => {
    const limit = parseFloat(newLimit);
    if (limit > 0) {
      updateDailyLimit(limit);
      setNewLimit('');
      setShowSettings(false);
    }
  };

  const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              {/* Search Bar */}
              <TextField
                placeholder="Type here..."
                size="small"
                sx={{ width: 300, mr: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Action Buttons */}
            <IconButton
              onClick={() => setShowSettings(!showSettings)}
              color="inherit"
            >
              <SettingsIcon />
            </IconButton>
            <IconButton
              onClick={resetDailySpending}
              color="inherit"
            >
              <RefreshIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Settings Panel */}
        <Collapse in={showSettings}>
          <Alert 
            severity="info" 
            sx={{ borderRadius: 0 }}
            action={
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  label="Daily Spending Limit"
                  type="number"
                  size="small"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  sx={{ width: 150 }}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleUpdateLimit}
                >
                  Update
                </Button>
              </Box>
            }
          >
            Configure your daily spending limit
          </Alert>
        </Collapse>

        {/* Main Content Area */}
        <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3 }}>
          {activeTab === 'dashboard' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Key Metrics Cards */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card 
                    sx={{ 
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            mr: 2,
                            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                          }}
                        >
                          <MoneyIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Today's Spending
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            ${dailySpent.toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card 
                    sx={{ 
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            mr: 2,
                            background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
                            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                          }}
                        >
                          <TrendingUpIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Today's Income
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                            ${dailySpent.toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card 
                    sx={{ 
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            mr: 2,
                            background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                            boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
                          }}
                        >
                          <HeartIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Total Saved
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                            ${totalSaved.toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card 
                    sx={{ 
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            mr: 2,
                            background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                          }}
                        >
                          <CheckIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Active Goals
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                            {goals.length}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Main Dashboard Content */}
              <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                  <SpendingLimit
                    dailySpent={dailySpent}
                    dailyLimit={dailyLimit}
                    onAddExpense={handleAddExpense}
                    onAddIncome={handleAddIncome}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <Goals
                    goals={goals}
                    onAddToGoal={handleAddToGoal}
                    onCreateGoal={handleCreateGoal}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {activeTab === 'spending' && (
            <Box sx={{ maxWidth: 800 }}>
              <SpendingLimit
                dailySpent={dailySpent}
                dailyLimit={dailyLimit}
                onAddExpense={handleAddExpense}
                onAddIncome={handleAddIncome}
              />
            </Box>
          )}

          {activeTab === 'goals' && (
            <Box sx={{ maxWidth: 800 }}>
              <Goals
                goals={goals}
                onAddToGoal={handleAddToGoal}
                onCreateGoal={handleCreateGoal}
              />
            </Box>
          )}

          {activeTab === 'analytics' && (
            <Card>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Coming Soon
                </Typography>
                <Typography color="text.secondary">
                  Advanced analytics and insights will be available here.
                </Typography>
              </CardContent>
            </Card>
          )}

          {activeTab === 'settings' && (
            <Card>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Theme Settings
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={themeMode === 'dark'}
                        onChange={(e) => setThemeMode(e.target.checked ? 'dark' : 'light')}
                      />
                    }
                    label="Dark Mode"
                  />
                  
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Color Scheme
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {(['blue', 'purple', 'green', 'orange', 'pink', 'cyan', 'emerald', 'indigo'] as const).map((color) => (
                        <Button
                          key={color}
                          variant={colorScheme === color ? 'contained' : 'outlined'}
                          onClick={() => setColorScheme(color)}
                          sx={{ textTransform: 'capitalize' }}
                        >
                          {color}
                        </Button>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Container>
      </Box>
    </Box>
  );
}
