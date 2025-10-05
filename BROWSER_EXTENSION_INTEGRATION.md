# Browser Extension Integration Guide

## Overview
This guide explains how to integrate your browser extension with the spending goals and AI roasting system. The extension should intercept purchase attempts, check against the user's daily spending limit, and display roast messages when they're about to overspend.

## Extension Flow

### 1. Detect Purchase Attempt
When a user clicks "Buy Now", "Add to Cart", or "Checkout" on any e-commerce site:
1. Extract purchase details (item name, price, website)
2. Get the user's ID from your extension's storage
3. Call the spending check API
4. Show roast dialog if overspending, or allow purchase to proceed

### 2. API Integration

#### Check Spending Before Purchase
```javascript
// When user clicks buy button
async function checkPurchaseBeforeBuying(itemName, price, userId) {
  try {
    const response = await fetch('https://your-domain.com/api/purchases/check-spending', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        item_name: itemName,
        price: price
      })
    });

    const data = await response.json();
    
    if (data.success && data.is_overspending && data.roast_message) {
      // SHOW ROAST DIALOG - Block the purchase
      showRoastDialog({
        roastMessage: data.roast_message,
        itemName: itemName,
        price: price,
        dailyLimit: data.daily_limit,
        spentToday: data.spent_today,
        newTotal: data.new_total,
        overspendAmount: data.overspend_amount
      });
      
      return false; // Block purchase
    } else {
      // Purchase is within budget, allow it
      return true;
    }
  } catch (error) {
    console.error('Error checking spending:', error);
    return true; // Allow purchase on error
  }
}
```

#### Record Purchase After Completion
```javascript
// After purchase is confirmed/completed
async function recordPurchase(purchaseData, userId) {
  try {
    const response = await fetch('https://your-domain.com/api/purchases/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        item_name: purchaseData.itemName,
        price: purchaseData.price,
        currency: purchaseData.currency || 'USD',
        website: purchaseData.website,
        url: purchaseData.url,
        description: purchaseData.description,
        purchase_date: new Date().toISOString(),
        metadata: {
          // Any additional data from the extension
          browser: 'chrome',
          intercepted: true
        }
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Purchase recorded successfully');
      // The API automatically updates the daily spending goal
    }
  } catch (error) {
    console.error('Error recording purchase:', error);
  }
}
```

#### Initialize User Goals (First Time Setup)
```javascript
// Call this when user first installs extension or logs in
async function initializeUserGoals(userId) {
  try {
    const response = await fetch('https://your-domain.com/api/goals/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Default goal created:', data.goal);
      // User now has a $100 daily spending limit
    }
  } catch (error) {
    console.error('Error initializing goals:', error);
  }
}
```

## Extension UI Components

### Roast Dialog HTML/CSS
Create a modal overlay that appears when user is overspending:

```html
<div id="roast-dialog" class="roast-overlay" style="display: none;">
  <div class="roast-dialog">
    <div class="roast-header">
      <div class="warning-icon">⚠️</div>
      <div class="roast-title">
        <h3>Overspending Alert!</h3>
        <p>Think twice before proceeding</p>
      </div>
      <button class="close-btn" onclick="closeRoastDialog()">✕</button>
    </div>
    
    <div class="spending-details">
      <div class="detail-row">
        <span>Item:</span>
        <span id="roast-item-name"></span>
      </div>
      <div class="detail-row">
        <span>Price:</span>
        <span id="roast-price"></span>
      </div>
      <div class="detail-row">
        <span>Spent Today:</span>
        <span id="roast-spent-today"></span>
      </div>
      <div class="detail-row">
        <span>Daily Limit:</span>
        <span id="roast-daily-limit"></span>
      </div>
      <hr>
      <div class="detail-row highlight">
        <span>New Total:</span>
        <span id="roast-new-total"></span>
      </div>
      <div class="detail-row highlight">
        <span>Over Budget:</span>
        <span id="roast-overspend"></span>
      </div>
    </div>
    
    <div class="roast-message">
      <p id="roast-text"></p>
    </div>
    
    <div class="roast-actions">
      <button class="btn-cancel" onclick="cancelPurchase()">Cancel Purchase</button>
      <button class="btn-proceed" onclick="proceedAnyway()">Buy Anyway</button>
    </div>
  </div>
</div>
```

### CSS Styling
```css
.roast-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.roast-dialog {
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  border: 2px solid #ef4444;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.roast-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
}

.warning-icon {
  font-size: 32px;
  background: #ef4444;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.roast-title h3 {
  margin: 0;
  color: #ef4444;
  font-size: 20px;
  font-weight: bold;
}

.roast-title p {
  margin: 4px 0 0 0;
  color: #666;
  font-size: 14px;
}

.spending-details {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.detail-row.highlight {
  font-weight: bold;
  color: #ef4444;
}

.roast-message {
  background: #fee2e2;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.roast-message p {
  margin: 0;
  color: #991b1b;
  line-height: 1.6;
  white-space: pre-wrap;
}

.roast-actions {
  display: flex;
  gap: 12px;
}

.btn-cancel {
  flex: 1;
  padding: 12px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
}

.btn-cancel:hover {
  background: #059669;
}

.btn-proceed {
  flex: 1;
  padding: 12px;
  background: #e5e7eb;
  color: #374151;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
}

.btn-proceed:hover {
  background: #d1d5db;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #9ca3af;
  margin-left: auto;
}
```

### JavaScript Functions
```javascript
// Show the roast dialog
function showRoastDialog(data) {
  document.getElementById('roast-item-name').textContent = data.itemName;
  document.getElementById('roast-price').textContent = `$${data.price.toFixed(2)}`;
  document.getElementById('roast-spent-today').textContent = `$${data.spentToday.toFixed(2)}`;
  document.getElementById('roast-daily-limit').textContent = `$${data.dailyLimit.toFixed(2)}`;
  document.getElementById('roast-new-total').textContent = `$${data.newTotal.toFixed(2)}`;
  document.getElementById('roast-overspend').textContent = `+$${data.overspendAmount.toFixed(2)}`;
  document.getElementById('roast-text').textContent = data.roastMessage;
  
  document.getElementById('roast-dialog').style.display = 'flex';
}

// Close the dialog
function closeRoastDialog() {
  document.getElementById('roast-dialog').style.display = 'none';
}

// Cancel the purchase
function cancelPurchase() {
  closeRoastDialog();
  // Prevent the purchase from going through
  // This depends on how you're intercepting the purchase
  alert('Purchase cancelled. Good decision! 💪');
}

// Proceed with purchase anyway
function proceedAnyway() {
  closeRoastDialog();
  // Allow the purchase to proceed
  // Record it via the API
  console.log('User chose to proceed with purchase');
}
```

## Complete Extension Flow Example

```javascript
// content.js - Main extension script

// 1. Initialize when extension loads
chrome.storage.local.get(['userId'], async (result) => {
  if (result.userId) {
    await initializeUserGoals(result.userId);
  }
});

// 2. Intercept buy buttons
document.addEventListener('click', async (e) => {
  const target = e.target;
  
  // Check if clicked element is a buy button
  if (isBuyButton(target)) {
    e.preventDefault();
    e.stopPropagation();
    
    // Extract purchase details from the page
    const purchaseData = extractPurchaseDetails();
    
    // Get user ID
    const { userId } = await chrome.storage.local.get(['userId']);
    
    if (!userId) {
      console.error('User not logged in');
      return;
    }
    
    // Check spending
    const canPurchase = await checkPurchaseBeforeBuying(
      purchaseData.itemName,
      purchaseData.price,
      userId
    );
    
    if (canPurchase) {
      // Allow purchase to proceed
      // Either simulate the original click or let it through
      proceedWithOriginalPurchase(target);
    }
  }
}, true);

// Helper function to detect buy buttons
function isBuyButton(element) {
  const text = element.textContent.toLowerCase();
  const buyKeywords = ['buy', 'checkout', 'add to cart', 'purchase', 'order now'];
  return buyKeywords.some(keyword => text.includes(keyword));
}

// Helper function to extract purchase details
function extractPurchaseDetails() {
  // This will vary by website
  // You'll need to implement site-specific extractors
  return {
    itemName: document.querySelector('.product-title')?.textContent || 'Unknown Item',
    price: parseFloat(document.querySelector('.price')?.textContent.replace(/[^0-9.]/g, '') || '0'),
    website: window.location.hostname,
    url: window.location.href,
    description: document.querySelector('.product-description')?.textContent || '',
    currency: 'USD'
  };
}
```

## API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/goals/initialize` | POST | Create default $100 daily goal for new user |
| `/api/purchases/check-spending` | POST | Check if purchase exceeds limit, get roast message |
| `/api/purchases/add` | POST | Record completed purchase (auto-updates daily spending) |
| `/api/goals/list` | GET | Get all user goals |
| `/api/goals/update` | PUT | Update goal settings |

## Testing Your Extension

1. **Install extension** in your browser
2. **Set user ID** in extension storage
3. **Visit e-commerce site** (Amazon, eBay, etc.)
4. **Try to buy something** that would exceed your daily limit
5. **Verify roast dialog appears** with AI message
6. **Test both "Cancel" and "Buy Anyway"** buttons

## Important Notes

- The extension must have the user's `user_id` (Clerk ID) stored
- Replace `https://your-domain.com` with your actual API domain
- Handle authentication/CORS properly
- The `/api/purchases/add` endpoint is public (no auth required) as per your middleware
- Daily spending resets automatically when purchases are checked against a new day
- The roast messages are generated by Gemini AI based on the user's goals

## Example Roast Messages

When overspending, users might see messages like:

> "Hold up! You're about to drop $45.99 on that gadget, pushing you to $145.99 today. Your limit is $100. That's $45.99 over budget! Remember, you're trying to save $5000 for your emergency fund. Every dollar counts. Maybe sleep on this purchase and see if you still want it tomorrow? Your future self will thank you! 💰"

The AI considers:
- The item being purchased
- Current spending vs limit
- User's other goals (savings, etc.)
- How much over budget they'd be
