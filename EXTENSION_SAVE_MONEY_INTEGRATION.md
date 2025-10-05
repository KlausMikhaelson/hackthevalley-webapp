# Browser Extension - "I'll Save" Button Integration

## Overview
When a user is about to overspend and sees the roast dialog, they can click "I'll Save" instead of buying. This endpoint distributes the saved money across all their savings goals.

## API Endpoint

### Add Savings to Goals
```
POST /api/goals/add-savings
```

**Request Body:**
```json
{
  "user_id": "user_xxx",
  "amount": 45.99,
  "distribution": "equal"  // optional: "equal", "proportional", or "priority"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully added $45.99 to 3 goal(s)",
  "distribution_method": "equal",
  "total_amount": 45.99,
  "goals_updated": [
    {
      "id": "goal_id_1",
      "name": "Emergency Fund",
      "previous_amount": 1200.00,
      "new_amount": 1215.33,
      "amount_added": 15.33,
      "target_amount": 5000,
      "progress_percentage": "24.31"
    },
    {
      "id": "goal_id_2",
      "name": "Vacation",
      "previous_amount": 800.00,
      "new_amount": 815.33,
      "amount_added": 15.33,
      "target_amount": 2500,
      "progress_percentage": "32.61"
    },
    {
      "id": "goal_id_3",
      "name": "New Laptop",
      "previous_amount": 300.00,
      "new_amount": 315.33,
      "amount_added": 15.33,
      "target_amount": 1500,
      "progress_percentage": "21.02"
    }
  ]
}
```

## Distribution Methods

### 1. Equal Distribution (Default)
Splits the saved amount equally across all savings goals.

**Example:** User saves $60, has 3 goals
- Each goal gets: $20

```javascript
{
  "distribution": "equal"
}
```

### 2. Proportional Distribution
Distributes based on target amounts - bigger goals get more money.

**Example:** User saves $100, has 2 goals
- Goal 1: $5000 target → gets $83.33
- Goal 2: $1000 target → gets $16.67

```javascript
{
  "distribution": "proportional"
}
```

### 3. Priority Distribution
Gives all money to the default/primary goal. If no default, falls back to equal.

**Example:** User saves $50, default goal is "Emergency Fund"
- Emergency Fund gets: $50
- Other goals get: $0

```javascript
{
  "distribution": "priority"
}
```

## Extension Implementation

### Update RoastDialog to Include "I'll Save" Button

```javascript
// In your roast dialog
function showRoastDialog(data) {
  // ... existing code ...
  
  // Add "I'll Save" button
  const saveButton = document.createElement('button');
  saveButton.textContent = "I'll Save! 💰";
  saveButton.className = 'btn-save';
  saveButton.onclick = () => handleSaveInstead(data);
  
  // Add to dialog
  actionsContainer.appendChild(saveButton);
}

// Handle "I'll Save" click
async function handleSaveInstead(purchaseData) {
  try {
    const response = await fetch('https://your-domain.com/api/goals/add-savings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: purchaseData.userId,
        amount: purchaseData.price,
        distribution: 'equal' // or let user choose
      })
    });

    const data = await response.json();
    
    if (data.success) {
      // Show success message
      showSuccessMessage(
        `Great decision! 🎉\n\n` +
        `You saved $${purchaseData.price.toFixed(2)} and added it to ${data.goals_updated.length} goal(s)!\n\n` +
        data.goals_updated.map(g => 
          `${g.name}: $${g.new_amount.toFixed(2)} / $${g.target_amount.toFixed(2)} (${g.progress_percentage}%)`
        ).join('\n')
      );
      
      // Close roast dialog
      closeRoastDialog();
      
      // Block the purchase
      blockPurchase();
    }
  } catch (error) {
    console.error('Error saving money:', error);
    alert('Failed to save money. Please try again.');
  }
}
```

### Updated Roast Dialog HTML

```html
<div id="roast-dialog" class="roast-overlay" style="display: none;">
  <div class="roast-dialog">
    <!-- ... existing header and details ... -->
    
    <div class="roast-message">
      <p id="roast-text"></p>
    </div>
    
    <div class="roast-actions">
      <button class="btn-save" onclick="handleSaveInstead()">
        💰 I'll Save!
      </button>
      <button class="btn-cancel" onclick="cancelPurchase()">
        Cancel Purchase
      </button>
      <button class="btn-proceed" onclick="proceedAnyway()">
        Buy Anyway
      </button>
    </div>
  </div>
</div>
```

### CSS for "I'll Save" Button

```css
.btn-save {
  flex: 1;
  padding: 12px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  transition: all 0.3s ease;
}

.btn-save:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}

.btn-save:active {
  transform: translateY(0);
}
```

### Success Message Display

```javascript
function showSuccessMessage(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-notification';
  successDiv.innerHTML = `
    <div class="success-content">
      <div class="success-icon">✅</div>
      <div class="success-text">
        <h3>Money Saved!</h3>
        <pre>${message}</pre>
      </div>
    </div>
  `;
  
  document.body.appendChild(successDiv);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    successDiv.classList.add('fade-out');
    setTimeout(() => successDiv.remove(), 300);
  }, 5000);
}
```

### Success Notification CSS

```css
.success-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border-left: 4px solid #10b981;
  max-width: 400px;
  z-index: 1000000;
  animation: slideIn 0.3s ease;
}

.success-content {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.success-icon {
  font-size: 32px;
}

.success-text h3 {
  margin: 0 0 8px 0;
  color: #10b981;
  font-size: 18px;
}

.success-text pre {
  margin: 0;
  font-family: inherit;
  white-space: pre-wrap;
  color: #374151;
  font-size: 14px;
  line-height: 1.6;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.fade-out {
  animation: fadeOut 0.3s ease forwards;
}

@keyframes fadeOut {
  to {
    opacity: 0;
    transform: translateX(400px);
  }
}
```

## Complete Extension Flow

1. **User tries to buy something that exceeds their limit**
   - Extension calls `/api/purchases/check-spending`
   - Gets roast message and spending details

2. **Roast dialog appears with 3 options:**
   - **"I'll Save! 💰"** - Adds money to goals, blocks purchase
   - **"Cancel Purchase"** - Just blocks purchase
   - **"Buy Anyway"** - Allows purchase to proceed

3. **User clicks "I'll Save!"**
   - Extension calls `/api/goals/add-savings` with the purchase amount
   - Money is distributed across all savings goals
   - Success message shows updated goal progress
   - Purchase is blocked

4. **User sees their progress**
   - Success notification shows how much was added to each goal
   - Goals dashboard updates automatically
   - User feels good about saving! 🎉

## Example Usage

```javascript
// When user clicks "I'll Save" on a $45.99 purchase
const response = await fetch('http://localhost:3000/api/goals/add-savings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 'user_33e9j0LNB0oQPioPYS5tSvnwFT2',
    amount: 45.99,
    distribution: 'equal'
  })
});

const result = await response.json();
console.log(result);
// Shows how $45.99 was split across all goals
```

## Testing

Test the endpoint:

```bash
# Using curl
curl -X POST http://localhost:3000/api/goals/add-savings \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_33e9j0LNB0oQPioPYS5tSvnwFT2",
    "amount": 50,
    "distribution": "equal"
  }'
```

```javascript
// Using browser console
fetch('http://localhost:3000/api/goals/add-savings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 'user_33e9j0LNB0oQPioPYS5tSvnwFT2',
    amount: 50,
    distribution: 'equal'
  })
}).then(r => r.json()).then(console.log);
```

## Benefits

- **Positive Reinforcement**: Turns a "no" into a "yes" for savings
- **Gamification**: Users see immediate progress on their goals
- **Flexibility**: Multiple distribution methods for different preferences
- **Motivation**: Visual feedback encourages continued saving
- **Transparency**: Shows exactly where the money went

## Notes

- Only affects `savings` and `custom` type goals (not `daily_spending` goals)
- If user has no savings goals, returns 404 error
- All amounts are added to `current_amount` field
- Progress percentages are calculated and returned
- Endpoint is public (no authentication required for extension access)
