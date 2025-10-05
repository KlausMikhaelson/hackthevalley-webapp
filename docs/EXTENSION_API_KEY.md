# Browser Extension API Key Authentication

## Overview

The purchase tracking API supports two authentication methods:
1. **Clerk Session** - For web application users
2. **API Key** - For browser extension integration

This allows the browser extension to add purchases without requiring complex OAuth flows.

## Setup

### 1. Generate API Key

Add to your `.env` file:

```env
EXTENSION_API_KEY=your_secure_random_api_key_here
```

**Generate a secure key:**
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use an online generator (for development only)
```

### 2. Extension Configuration

In your browser extension, store the API key securely:

```javascript
// background.js or config.js
const API_CONFIG = {
  baseUrl: 'https://your-app.com',
  apiKey: 'your_secure_random_api_key_here'
};
```

## Usage

### Adding a Purchase with API Key

```javascript
// Browser extension background script
async function savePurchase(purchaseData, userId) {
  const response = await fetch('https://your-app.com/api/purchases/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_CONFIG.apiKey  // API key in header
    },
    body: JSON.stringify({
      user_id: userId,  // Required when using API key
      item_name: purchaseData.item_name,
      price: purchaseData.price,
      website: purchaseData.website,
      url: purchaseData.url,
      description: purchaseData.description
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    console.log('Purchase saved:', result.purchase);
  } else {
    console.error('Error:', result.error);
  }
}
```

### Getting User ID

The extension needs to know the user's Clerk ID. Options:

#### Option 1: User Input (Simplest)
```javascript
// In extension popup, ask user to enter their user ID once
chrome.storage.sync.set({ userId: 'user_abc123' });
```

#### Option 2: Login Flow
```javascript
// Redirect to your app for one-time authentication
chrome.tabs.create({
  url: 'https://your-app.com/extension-auth'
});

// On your-app.com/extension-auth page:
// Display the user's Clerk ID for them to copy
```

#### Option 3: Message Passing
```javascript
// Content script on your app's domain can access the user ID
// and send it to the extension
chrome.runtime.sendMessage({
  type: 'USER_ID',
  userId: getCurrentUserId()
});
```

## Complete Extension Example

### manifest.json
```json
{
  "manifest_version": 3,
  "name": "Purchase Tracker",
  "version": "1.0.0",
  "permissions": ["storage", "notifications"],
  "host_permissions": [
    "https://your-app.com/*",
    "https://*.amazon.com/*"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [{
    "matches": ["https://*.amazon.com/*"],
    "js": ["content.js"]
  }],
  "action": {
    "default_popup": "popup.html"
  }
}
```

### background.js
```javascript
const API_CONFIG = {
  baseUrl: 'https://your-app.com',
  apiKey: 'your_api_key_here'
};

// Listen for purchase detection
chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.type === 'PURCHASE_DETECTED') {
    await savePurchase(message.data);
  }
});

async function savePurchase(purchaseData) {
  try {
    // Get stored user ID
    const { userId } = await chrome.storage.sync.get('userId');
    
    if (!userId) {
      showNotification('Please set up your user ID in extension settings');
      return;
    }
    
    const response = await fetch(`${API_CONFIG.baseUrl}/api/purchases/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_CONFIG.apiKey
      },
      body: JSON.stringify({
        user_id: userId,
        ...purchaseData
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      showNotification(
        `✅ Purchase tracked: ${result.purchase.item_name} - $${result.purchase.price}\n` +
        `Category: ${result.purchase.category}`
      );
    } else {
      console.error('API Error:', result.error);
      showNotification('❌ Failed to track purchase');
    }
  } catch (error) {
    console.error('Error saving purchase:', error);
  }
}

function showNotification(message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon.png',
    title: 'Purchase Tracker',
    message: message
  });
}
```

### content.js (Amazon example)
```javascript
// Detect purchase on Amazon confirmation page
if (window.location.pathname.includes('/gp/buy/spc/handlers/display.html')) {
  extractAndSendPurchase();
}

function extractAndSendPurchase() {
  const itemName = document.querySelector('.product-title')?.textContent?.trim();
  const priceText = document.querySelector('.grand-total-price')?.textContent;
  const price = parseFloat(priceText?.replace(/[^0-9.]/g, '') || '0');
  
  if (itemName && price > 0) {
    chrome.runtime.sendMessage({
      type: 'PURCHASE_DETECTED',
      data: {
        item_name: itemName,
        price: price,
        currency: 'USD',
        website: 'amazon.com',
        url: window.location.href,
        purchase_date: new Date().toISOString()
      }
    });
  }
}
```

### popup.html
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { width: 300px; padding: 16px; font-family: sans-serif; }
    input { width: 100%; padding: 8px; margin: 8px 0; }
    button { width: 100%; padding: 10px; background: #6c47ff; color: white; border: none; border-radius: 4px; cursor: pointer; }
  </style>
</head>
<body>
  <h3>Purchase Tracker Setup</h3>
  <label>Your User ID:</label>
  <input type="text" id="userId" placeholder="user_abc123">
  <button id="save">Save</button>
  <p id="status"></p>
  
  <script src="popup.js"></script>
</body>
</html>
```

### popup.js
```javascript
// Load saved user ID
chrome.storage.sync.get('userId', ({ userId }) => {
  if (userId) {
    document.getElementById('userId').value = userId;
    document.getElementById('status').textContent = '✅ Configured';
  }
});

// Save user ID
document.getElementById('save').addEventListener('click', () => {
  const userId = document.getElementById('userId').value.trim();
  
  if (userId) {
    chrome.storage.sync.set({ userId }, () => {
      document.getElementById('status').textContent = '✅ Saved!';
    });
  } else {
    document.getElementById('status').textContent = '❌ Please enter a user ID';
  }
});
```

## Security Considerations

### ⚠️ Important Security Notes

1. **API Key Protection**
   - Never commit API keys to public repositories
   - Use different keys for development and production
   - Rotate keys periodically

2. **User ID Validation**
   - The API should validate that the user_id exists in your database
   - Consider adding rate limiting per user_id

3. **Extension Distribution**
   - For production, consider per-user API keys
   - Store keys in Chrome's sync storage (encrypted by Chrome)
   - Use Chrome Web Store for distribution (adds security layer)

### Enhanced Security (Optional)

For production, consider implementing per-user API keys:

```javascript
// Generate unique API key for each user
// Store in database: { user_id, api_key, created_at }

// In your API endpoint:
const apiKey = request.headers.get('x-api-key');
const userApiKey = await getUserApiKey(apiKey);

if (!userApiKey) {
  return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
}

userId = userApiKey.user_id;
```

## Testing

### Test with cURL

```bash
curl -X POST http://localhost:3000/api/purchases/add \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key_here" \
  -d '{
    "user_id": "user_abc123",
    "item_name": "Test Product",
    "price": 29.99,
    "website": "test.com"
  }'
```

### Test in Extension

1. Load unpacked extension in Chrome
2. Navigate to Amazon
3. Make a test purchase (or visit confirmation page)
4. Check extension notifications
5. Verify purchase in your app's database

## Troubleshooting

**401 Invalid API key**
- Check EXTENSION_API_KEY in .env matches extension config
- Ensure header name is exactly 'x-api-key'

**400 user_id required**
- Make sure user_id is included in request body
- Check extension popup has saved user ID

**Purchase not saving**
- Check browser console for errors
- Verify API endpoint URL is correct
- Test with cURL first

## Alternative: Completely Remove Auth (Not Recommended)

If you really want to remove authentication entirely (⚠️ **not recommended for production**):

```typescript
// In middleware.ts, exclude the purchases API
export const config = {
  matcher: [
    '/((?!_next|api/purchases|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(?!/purchases)(.*)',
  ],
};
```

**Why this is bad:**
- Anyone can add purchases to any user's account
- No rate limiting or abuse prevention
- Data integrity issues
- Security vulnerability

**Use the API key approach instead!** ✅
