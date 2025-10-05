# Savings Tracking API Documentation

## Overview
Track and analyze money saved when users choose not to make purchases. Every time a user clicks "I'll Save" in the extension, the saved amount is recorded and can be queried for statistics and insights.

---

## API Endpoints

### 1. Add Savings (Updated)
**`POST /api/goals/add-savings`**

Records a saved purchase and distributes the money to user's goals.

**Request:**
```json
{
  "user_id": "user_xxx",
  "amount": 45.99,
  "distribution": "equal",
  "item_name": "Wireless Headphones",
  "website": "amazon.com",
  "url": "https://amazon.com/product/123",
  "description": "Sony WH-1000XM4"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully added $45.99 to 3 goal(s)",
  "distribution_method": "equal",
  "total_amount": 45.99,
  "saved_purchase_id": "saved_purchase_id_123",
  "goals_updated": [...]
}
```

---

### 2. Get Daily Savings
**`GET /api/savings/daily?user_id=xxx&date=YYYY-MM-DD`**

Get total money saved on a specific day.

**Query Parameters:**
- `user_id` (required): User's Clerk ID
- `date` (optional): Date in YYYY-MM-DD format (default: today)

**Example Request:**
```
GET /api/savings/daily?user_id=user_123&date=2025-10-05
```

**Response:**
```json
{
  "success": true,
  "date": "2025-10-05",
  "total_saved": 145.97,
  "purchases_avoided": 3,
  "savings_breakdown": {
    "by_website": [
      {
        "website": "amazon.com",
        "count": 2,
        "total_saved": 95.98
      },
      {
        "website": "ebay.com",
        "count": 1,
        "total_saved": 49.99
      }
    ]
  },
  "saved_purchases": [
    {
      "id": "saved_id_1",
      "item_name": "Wireless Headphones",
      "amount_saved": 45.99,
      "website": "amazon.com",
      "url": "https://amazon.com/product/123",
      "description": "Sony WH-1000XM4",
      "saved_at": "2025-10-05T14:30:00.000Z",
      "distribution_method": "equal"
    },
    {
      "id": "saved_id_2",
      "item_name": "Smart Watch",
      "amount_saved": 49.99,
      "website": "amazon.com",
      "url": "https://amazon.com/product/456",
      "saved_at": "2025-10-05T16:45:00.000Z",
      "distribution_method": "proportional"
    },
    {
      "id": "saved_id_3",
      "item_name": "Gaming Mouse",
      "amount_saved": 49.99,
      "website": "ebay.com",
      "saved_at": "2025-10-05T18:20:00.000Z",
      "distribution_method": "priority"
    }
  ]
}
```

---

### 3. Get Savings Statistics
**`GET /api/savings/stats?user_id=xxx&period=week`**

Get comprehensive savings statistics over a period.

**Query Parameters:**
- `user_id` (required): User's Clerk ID
- `period` (optional): 'day' | 'week' | 'month' | 'year' | 'all' (default: 'week')
- `start_date` (optional): Custom start date (YYYY-MM-DD)
- `end_date` (optional): Custom end date (YYYY-MM-DD)

**Example Request:**
```
GET /api/savings/stats?user_id=user_123&period=week
```

**Response:**
```json
{
  "success": true,
  "period": {
    "type": "week",
    "start_date": "2025-09-28",
    "end_date": "2025-10-05",
    "days": 7
  },
  "summary": {
    "total_saved": 342.45,
    "purchases_avoided": 8,
    "avg_saved_per_day": 48.92,
    "avg_saved_per_purchase": 42.81,
    "biggest_save": {
      "item_name": "4K TV",
      "amount": 299.99,
      "website": "bestbuy.com",
      "date": "2025-10-03T20:15:00.000Z"
    }
  },
  "breakdown": {
    "by_website": [
      {
        "website": "amazon.com",
        "purchases_avoided": 4,
        "total_saved": 185.96,
        "top_items": ["Wireless Headphones", "Smart Watch", "Keyboard"]
      },
      {
        "website": "bestbuy.com",
        "purchases_avoided": 2,
        "total_saved": 349.98,
        "top_items": ["4K TV", "Laptop Stand"]
      },
      {
        "website": "ebay.com",
        "purchases_avoided": 2,
        "total_saved": 106.51,
        "top_items": ["Gaming Mouse", "USB Cable"]
      }
    ],
    "daily_trend": [
      {
        "date": "2025-09-28",
        "total_saved": 0,
        "purchases_avoided": 0
      },
      {
        "date": "2025-09-29",
        "total_saved": 45.99,
        "purchases_avoided": 1
      },
      {
        "date": "2025-09-30",
        "total_saved": 95.98,
        "purchases_avoided": 2
      },
      {
        "date": "2025-10-01",
        "total_saved": 0,
        "purchases_avoided": 0
      },
      {
        "date": "2025-10-02",
        "total_saved": 54.50,
        "purchases_avoided": 1
      },
      {
        "date": "2025-10-03",
        "total_saved": 299.99,
        "purchases_avoided": 1
      },
      {
        "date": "2025-10-04",
        "total_saved": 0,
        "purchases_avoided": 0
      },
      {
        "date": "2025-10-05",
        "total_saved": 145.99,
        "purchases_avoided": 3
      }
    ]
  },
  "recent_saves": [
    {
      "id": "saved_id_8",
      "item_name": "Gaming Mouse",
      "amount_saved": 49.99,
      "website": "ebay.com",
      "saved_at": "2025-10-05T18:20:00.000Z"
    }
    // ... up to 10 most recent
  ]
}
```

---

## Database Schema

### SavedPurchase Model
```typescript
{
  user_id: string;              // Clerk user ID
  item_name: string;            // What they didn't buy
  amount_saved: number;         // Money saved
  currency: string;             // Default: 'USD'
  website: string;              // Where they didn't buy it
  url?: string;                 // Product URL
  description?: string;         // Product description
  saved_date: Date;             // When they chose to save
  distribution_method?: string; // 'equal' | 'proportional' | 'priority'
  goals_updated?: string[];     // IDs of goals that received money
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Extension Integration

### When User Clicks "I'll Save"

```javascript
async function handleSaveInstead(purchaseData) {
  try {
    // Call add-savings endpoint (now with item details)
    const response = await fetch('https://your-domain.com/api/goals/add-savings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: purchaseData.userId,
        amount: purchaseData.price,
        distribution: 'equal',
        item_name: purchaseData.itemName,
        website: purchaseData.website,
        url: purchaseData.url,
        description: purchaseData.description
      })
    });

    const data = await response.json();
    
    if (data.success) {
      // Show success message
      showSuccessMessage(data);
      
      // Block the purchase
      blockPurchase();
      
      // Close roast dialog
      closeRoastDialog();
    }
  } catch (error) {
    console.error('Error saving money:', error);
  }
}
```

### Display Daily Savings in Extension

```javascript
// Show user their daily savings in extension popup
async function showDailySavings(userId) {
  try {
    const response = await fetch(
      `https://your-domain.com/api/savings/daily?user_id=${userId}`
    );
    
    const data = await response.json();
    
    if (data.success) {
      displaySavingsSummary({
        totalSaved: data.total_saved,
        purchasesAvoided: data.purchases_avoided,
        breakdown: data.savings_breakdown
      });
    }
  } catch (error) {
    console.error('Error fetching daily savings:', error);
  }
}
```

### Display Savings Statistics

```javascript
// Show weekly/monthly stats
async function showSavingsStats(userId, period = 'week') {
  try {
    const response = await fetch(
      `https://your-domain.com/api/savings/stats?user_id=${userId}&period=${period}`
    );
    
    const data = await response.json();
    
    if (data.success) {
      displayStatsChart({
        totalSaved: data.summary.total_saved,
        avgPerDay: data.summary.avg_saved_per_day,
        biggestSave: data.summary.biggest_save,
        dailyTrend: data.breakdown.daily_trend,
        byWebsite: data.breakdown.by_website
      });
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
}
```

---

## Use Cases

### 1. Extension Popup Dashboard
Show user their daily savings when they open the extension:
```javascript
// In popup.js
document.addEventListener('DOMContentLoaded', async () => {
  const userId = await getUserId();
  const dailyData = await fetch(`/api/savings/daily?user_id=${userId}`).then(r => r.json());
  
  document.getElementById('today-saved').textContent = `$${dailyData.total_saved.toFixed(2)}`;
  document.getElementById('purchases-avoided').textContent = dailyData.purchases_avoided;
});
```

### 2. Weekly Summary Email/Notification
```javascript
// Get weekly stats for email
const weeklyStats = await fetch(
  `/api/savings/stats?user_id=${userId}&period=week`
).then(r => r.json());

sendEmail({
  subject: `You saved $${weeklyStats.summary.total_saved.toFixed(2)} this week! 🎉`,
  body: `
    Great job! You avoided ${weeklyStats.summary.purchases_avoided} impulse purchases.
    
    Your biggest save: ${weeklyStats.summary.biggest_save.item_name} ($${weeklyStats.summary.biggest_save.amount})
    
    Keep it up!
  `
});
```

### 3. Savings Trends Chart
```javascript
// Display daily trend chart
const stats = await fetch(
  `/api/savings/stats?user_id=${userId}&period=month`
).then(r => r.json());

renderChart(stats.breakdown.daily_trend);
```

### 4. Leaderboard/Gamification
```javascript
// Compare with friends or show achievements
const allTimeStats = await fetch(
  `/api/savings/stats?user_id=${userId}&period=all`
).then(r => r.json());

if (allTimeStats.summary.total_saved > 1000) {
  unlockAchievement('Savings Master');
}
```

---

## Testing

### Test Recording a Save
```bash
curl -X POST http://localhost:3000/api/goals/add-savings \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_123",
    "amount": 45.99,
    "distribution": "equal",
    "item_name": "Wireless Headphones",
    "website": "amazon.com"
  }'
```

### Test Getting Daily Savings
```bash
curl "http://localhost:3000/api/savings/daily?user_id=user_123&date=2025-10-05"
```

### Test Getting Weekly Stats
```bash
curl "http://localhost:3000/api/savings/stats?user_id=user_123&period=week"
```

---

## Frontend Integration (Dashboard)

You can also display savings stats in the web dashboard:

```tsx
// In a new Savings component
import { useEffect, useState } from 'react';

function SavingsStats({ userId }) {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    fetch(`/api/savings/stats?user_id=${userId}&period=week`)
      .then(r => r.json())
      .then(data => setStats(data));
  }, [userId]);
  
  if (!stats) return <div>Loading...</div>;
  
  return (
    <div>
      <h2>This Week's Savings</h2>
      <p>Total Saved: ${stats.summary.total_saved.toFixed(2)}</p>
      <p>Purchases Avoided: {stats.summary.purchases_avoided}</p>
      <p>Avg Per Day: ${stats.summary.avg_saved_per_day.toFixed(2)}</p>
      
      {stats.summary.biggest_save && (
        <div>
          <h3>Biggest Save</h3>
          <p>{stats.summary.biggest_save.item_name}</p>
          <p>${stats.summary.biggest_save.amount}</p>
        </div>
      )}
    </div>
  );
}
```

---

## Notes

- All endpoints are **public** (no authentication required for extension access)
- Dates are stored in UTC
- All amounts are in USD by default
- Saved purchases are linked to the goals they updated
- Statistics can be filtered by custom date ranges
- Daily trend data is perfect for charts/graphs
- Website breakdown helps identify where users save the most
