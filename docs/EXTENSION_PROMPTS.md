# Browser Extension Prompts & Templates

This document contains prompt templates and code snippets for building the browser extension integration.

## AI Categorization Prompts

### Primary Categorization Prompt
Used by the backend API to categorize purchases:

```
Categorize "{item_name}" {description} into one of the following categories: food, fashion, entertainment, transport, travel, living. If it doesn't fit any category, respond with "other". Reply with only one word - the category name.
```

**Examples:**
- Input: "Nike Air Max 270" → Output: "fashion"
- Input: "Pizza Hut Large Pizza" → Output: "food"
- Input: "Uber ride to airport" → Output: "transport"
- Input: "Netflix Monthly Subscription" → Output: "entertainment"

---

## Extension Detection Prompts

### Generic Purchase Detection
Use this template to detect purchases across different e-commerce sites:

```javascript
/**
 * Generic purchase detection logic
 * Customize selectors for each website
 */
const SITE_CONFIGS = {
  'amazon.com': {
    confirmationUrls: ['/gp/buy/spc/handlers/display.html', '/gp/css/order-history'],
    selectors: {
      itemName: '.product-title, .a-size-medium',
      price: '.grand-total-price, .a-color-price',
      orderId: '.order-info .value',
      description: '.product-description'
    }
  },
  'ebay.com': {
    confirmationUrls: ['/sh/landing', '/purchase/'],
    selectors: {
      itemName: '.item-title',
      price: '.total-price',
      orderId: '.order-number',
      description: '.item-description'
    }
  },
  'walmart.com': {
    confirmationUrls: ['/checkout/confirmation'],
    selectors: {
      itemName: '.product-title-link',
      price: '.order-total',
      orderId: '.order-number',
      description: '.product-description'
    }
  }
};

function detectPurchase() {
  const hostname = window.location.hostname;
  const config = Object.entries(SITE_CONFIGS).find(([domain]) => 
    hostname.includes(domain)
  )?.[1];
  
  if (!config) return null;
  
  const isConfirmationPage = config.confirmationUrls.some(url => 
    window.location.pathname.includes(url)
  );
  
  if (!isConfirmationPage) return null;
  
  return extractPurchaseData(config.selectors);
}
```

---

## User Notification Templates

### Success Notification
```javascript
chrome.notifications.create({
  type: 'basic',
  iconUrl: 'icon.png',
  title: '✅ Purchase Tracked',
  message: `${itemName} - $${price}\nCategory: ${category}`,
  priority: 1
});
```

### Budget Warning Notification
```javascript
chrome.notifications.create({
  type: 'basic',
  iconUrl: 'icon-warning.png',
  title: '⚠️ Budget Alert',
  message: `This purchase may exceed your ${category} budget!\nConsider reviewing your spending.`,
  priority: 2,
  requireInteraction: true
});
```

### Authentication Required
```javascript
chrome.notifications.create({
  type: 'basic',
  iconUrl: 'icon.png',
  title: '🔐 Sign In Required',
  message: 'Please sign in to track your purchases',
  priority: 1
});
```

---

## Data Extraction Patterns

### Amazon Product Page
```javascript
function extractAmazonData() {
  // Product name
  const itemName = document.querySelector('#productTitle')?.textContent?.trim() ||
                   document.querySelector('.product-title')?.textContent?.trim();
  
  // Price
  const priceWhole = document.querySelector('.a-price-whole')?.textContent;
  const priceFraction = document.querySelector('.a-price-fraction')?.textContent;
  const price = parseFloat(`${priceWhole}.${priceFraction}`.replace(/[^0-9.]/g, ''));
  
  // Description
  const description = document.querySelector('#feature-bullets')?.textContent?.trim() ||
                     document.querySelector('#productDescription')?.textContent?.trim();
  
  // Category
  const breadcrumb = Array.from(document.querySelectorAll('#wayfinding-breadcrumbs_feature_div a'))
    .map(a => a.textContent.trim())
    .join(' > ');
  
  return {
    item_name: itemName,
    price: price,
    currency: 'USD',
    website: 'amazon.com',
    url: window.location.href,
    description: description?.substring(0, 500), // Limit length
    metadata: {
      breadcrumb: breadcrumb,
      asin: extractASIN()
    }
  };
}

function extractASIN() {
  const match = window.location.pathname.match(/\/dp\/([A-Z0-9]{10})/);
  return match ? match[1] : null;
}
```

### Shopify-based Stores
```javascript
function extractShopifyData() {
  // Works for most Shopify stores
  const itemName = document.querySelector('.product__title, .product-single__title')?.textContent?.trim();
  
  const priceElement = document.querySelector('.product__price, .product-single__price');
  const price = parseFloat(priceElement?.textContent?.replace(/[^0-9.]/g, '') || '0');
  
  const description = document.querySelector('.product__description, .product-single__description')?.textContent?.trim();
  
  return {
    item_name: itemName,
    price: price,
    currency: detectCurrency(),
    website: window.location.hostname,
    url: window.location.href,
    description: description?.substring(0, 500)
  };
}

function detectCurrency() {
  const currencySymbols = {
    '$': 'USD',
    '€': 'EUR',
    '£': 'GBP',
    '¥': 'JPY',
    '₹': 'INR'
  };
  
  const priceText = document.querySelector('.product__price')?.textContent || '';
  for (const [symbol, code] of Object.entries(currencySymbols)) {
    if (priceText.includes(symbol)) return code;
  }
  
  return 'USD';
}
```

---

## Popup UI Templates

### Purchase Summary Popup
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      width: 350px;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .stat {
      background: #f5f5f5;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 8px;
    }
    .stat-label {
      font-size: 12px;
      color: #666;
    }
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }
    .category-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="header">
    <h2>Purchase Tracker</h2>
    <button id="refresh">🔄</button>
  </div>
  
  <div class="stat">
    <div class="stat-label">Total Spent This Month</div>
    <div class="stat-value" id="totalSpent">$0.00</div>
  </div>
  
  <div class="stat">
    <div class="stat-label">Purchases Tracked</div>
    <div class="stat-value" id="purchaseCount">0</div>
  </div>
  
  <h3>By Category</h3>
  <div id="categories"></div>
  
  <button id="viewDashboard" style="width: 100%; margin-top: 16px; padding: 12px; background: #6c47ff; color: white; border: none; border-radius: 8px; cursor: pointer;">
    View Full Dashboard
  </button>
  
  <script src="popup.js"></script>
</body>
</html>
```

### Popup JavaScript
```javascript
// popup.js
async function loadStats() {
  try {
    const response = await fetch('https://your-app-domain.com/api/purchases/list?limit=100', {
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (data.success) {
      document.getElementById('totalSpent').textContent = 
        `$${data.statistics.total_spent.toFixed(2)}`;
      document.getElementById('purchaseCount').textContent = 
        data.statistics.total_purchases;
      
      const categoriesDiv = document.getElementById('categories');
      categoriesDiv.innerHTML = '';
      
      for (const [category, stats] of Object.entries(data.statistics.category_breakdown)) {
        const item = document.createElement('div');
        item.className = 'category-item';
        item.innerHTML = `
          <span>${getCategoryIcon(category)} ${category}</span>
          <span>$${stats.total_spent.toFixed(2)}</span>
        `;
        categoriesDiv.appendChild(item);
      }
    }
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
}

function getCategoryIcon(category) {
  const icons = {
    food: '🍔',
    fashion: '👕',
    entertainment: '🎮',
    transport: '🚗',
    travel: '✈️',
    living: '🏠',
    other: '📦'
  };
  return icons[category] || '📦';
}

document.getElementById('refresh').addEventListener('click', loadStats);
document.getElementById('viewDashboard').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://your-app-domain.com/dashboard' });
});

// Load stats on popup open
loadStats();
```

---

## Testing Prompts

### Manual Testing Checklist
```
✅ Purchase Detection
  - [ ] Amazon purchase detected correctly
  - [ ] eBay purchase detected correctly
  - [ ] Shopify store purchase detected correctly
  - [ ] Price extracted accurately
  - [ ] Item name extracted correctly

✅ API Integration
  - [ ] Purchase saved to database
  - [ ] Category assigned correctly
  - [ ] User authentication works
  - [ ] Error handling works

✅ Notifications
  - [ ] Success notification shows
  - [ ] Budget warning triggers correctly
  - [ ] Authentication prompt appears when needed

✅ Popup UI
  - [ ] Statistics load correctly
  - [ ] Categories display properly
  - [ ] Dashboard link works
```

---

## Advanced Features

### Smart Budget Warnings
```javascript
async function checkBudgetBeforePurchase(price, category) {
  const response = await fetch('https://your-app-domain.com/api/purchases/list', {
    credentials: 'include'
  });
  
  const data = await response.json();
  const categorySpending = data.statistics.category_breakdown[category]?.total_spent || 0;
  
  // Assume user has set budget limits (fetch from API)
  const budgetLimits = {
    food: 500,
    fashion: 300,
    entertainment: 200
  };
  
  const limit = budgetLimits[category];
  if (limit && (categorySpending + price) > limit) {
    return {
      warning: true,
      message: `This purchase will exceed your ${category} budget by $${((categorySpending + price) - limit).toFixed(2)}`
    };
  }
  
  return { warning: false };
}
```

### Duplicate Purchase Detection
```javascript
async function checkDuplicatePurchase(itemName, price) {
  const response = await fetch(
    `https://your-app-domain.com/api/purchases/list?limit=50`,
    { credentials: 'include' }
  );
  
  const data = await response.json();
  const recentPurchases = data.purchases;
  
  // Check for similar purchases in the last 24 hours
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const duplicate = recentPurchases.find(p => 
    p.item_name.toLowerCase() === itemName.toLowerCase() &&
    Math.abs(p.price - price) < 0.01 &&
    new Date(p.purchase_date) > oneDayAgo
  );
  
  if (duplicate) {
    return {
      isDuplicate: true,
      message: 'This looks like a duplicate purchase. Did you mean to buy this again?'
    };
  }
  
  return { isDuplicate: false };
}
```

---

## Environment Variables

Add these to your `.env` file:

```bash
# Gemini AI API Key (required for categorization)
GEMINI_API_KEY=your_gemini_api_key_here

# MongoDB connection (required for storing purchases)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Clerk Authentication (required for user management)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

---

## Next Steps

1. **Build the Extension:** Use the templates above to create your browser extension
2. **Test Locally:** Test on localhost before deploying
3. **Deploy API:** Deploy your Next.js app to production
4. **Publish Extension:** Submit to Chrome Web Store / Firefox Add-ons
5. **Monitor Usage:** Track API usage and user feedback

For more details, see [EXTENSION_INTEGRATION.md](./EXTENSION_INTEGRATION.md)
