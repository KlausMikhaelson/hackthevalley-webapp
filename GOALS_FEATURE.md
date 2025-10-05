# Goals Feature Documentation

## Overview
The Goals feature allows users to set spending limits and savings goals. By default, every user gets a daily spending goal of $100. When users try to make a purchase that would exceed their daily limit, they receive a personalized "roast" message from the AI to discourage overspending.

## Features

### 1. Default Daily Spending Goal
- Every user automatically gets a default goal: "Spend less than $100 daily"
- This goal is created when the user first initializes their goals
- The daily spending tracker resets at the start of each day

### 2. Spending Check with AI Roasting
- Before adding an expense, the system checks if it would exceed the daily limit
- If overspending is detected:
  - The AI generates a personalized roast message
  - A dialog appears showing:
    - Current spending for the day
    - The daily limit
    - How much over budget the purchase would be
    - The AI's roast message
  - Users can either cancel the purchase or proceed anyway

### 3. Goal Types
- **daily_spending**: Daily spending limits (default: $100)
- **savings**: Savings goals with target amounts
- **custom**: Custom goals defined by users

## API Endpoints

### Initialize Default Goal
```
POST /api/goals/initialize
Body: { user_id: string }
```
Creates the default $100 daily spending goal for a new user.

### Create Goal
```
POST /api/goals/create
Body: {
  user_id: string;
  name: string;
  type: 'daily_spending' | 'savings' | 'custom';
  target_amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'one_time';
  is_default?: boolean;
}
```

### List Goals
```
GET /api/goals/list?user_id=xxx
```
Returns all goals for a user.

### Update Goal
```
PUT /api/goals/update
Body: {
  goal_id: string;
  user_id: string;
  name?: string;
  target_amount?: number;
  current_amount?: number;
  is_default?: boolean;
}
```

### Check Spending
```
POST /api/purchases/check-spending
Body: {
  user_id: string;
  item_name: string;
  price: number;
}
```
Checks if a purchase would exceed the daily spending limit. Returns roast message if overspending.

### Reset Daily Goals
```
POST /api/goals/reset-daily
Body: { user_id: string }
```
Resets all daily spending goals' current_amount to 0. Should be called at the start of each day.

## Database Schema

### Goal Model
```typescript
{
  user_id: string;           // Clerk user ID
  name: string;              // Goal name
  type: 'daily_spending' | 'savings' | 'custom';
  target_amount: number;     // Target/limit amount
  current_amount: number;    // Current progress (for daily spending, this is spent today)
  period: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'one_time';
  is_default: boolean;       // Is this the primary goal
  createdAt: Date;
  updatedAt: Date;
}
```

## Frontend Components

### RoastDialog
A modal dialog that displays when a user tries to overspend:
- Shows spending breakdown
- Displays AI-generated roast message
- Offers "Cancel Purchase" or "Buy Anyway" options
- Includes shake animation for emphasis

### useGoals Hook
Custom React hook for managing goals:
- `fetchGoals()` - Load user's goals
- `initializeDefaultGoal()` - Create default goal
- `createGoal()` - Create new goal
- `updateGoal()` - Update existing goal
- `checkSpending()` - Check if purchase exceeds limit
- `resetDailyGoals()` - Reset daily spending

## Usage Example

### Initialize Goals for New User
```typescript
const { initializeDefaultGoal } = useGoals(userId);
await initializeDefaultGoal();
```

### Check Spending Before Purchase
```typescript
const { checkSpending } = useGoals(userId);
const result = await checkSpending('Coffee', 5.50);

if (result.is_overspending && result.roast_message) {
  // Show roast dialog
  showRoastDialog(result);
} else {
  // Proceed with purchase
  addPurchase();
}
```

## Integration with Purchase Flow

When a purchase is added via `/api/purchases/add`:
1. The purchase is saved to the database
2. If the purchase is for today, the daily spending goal's `current_amount` is incremented
3. The frontend can call `/api/purchases/check-spending` before adding to get a warning

## Daily Reset

The daily spending goals should be reset at the start of each day. This can be implemented via:
- A cron job that calls `/api/goals/reset-daily` for all users
- Client-side check on user login that resets if it's a new day
- Serverless function triggered at midnight

## Future Enhancements

- Weekly/monthly spending goals
- Category-specific spending limits
- Goal progress notifications
- Achievement badges for meeting goals
- Spending trends and insights
