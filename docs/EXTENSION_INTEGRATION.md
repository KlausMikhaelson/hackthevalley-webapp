# Browser Extension Integration Guide

This guide explains how to integrate the purchase tracking feature with a browser extension.

## Overview

The purchase tracking system automatically captures and categorizes user purchases from e-commerce websites using AI-powered categorization via Google Gemini.

## API Endpoints

### 1. Add Purchase
**Endpoint:** `POST /api/purchases/add`

**Authentication:** Required (Clerk session cookie)

**Request Body:**
```json
{
  "item_name": "Wireless Headphones",
  "price": 79.99,
  "currency": "USD",
  "website": "amazon.com",
  "url": "https://amazon.com/product/12345",
  "description": "Sony WH-1000XM4 Wireless Noise Canceling Headphones",
  "purchase_date": "2025-10-05T08:23:56Z",
  "metadata": {
    "order_id": "112-1234567-1234567",
    "shipping_address": "123 Main St",
    "payment_method": "Visa ending in 1234"
  }
}
```

**Required Fields:**
- `item_name` (string): Name of the purchased item
- `price` (number): Price in decimal format
- `website` (string): Domain name of the website

**Optional Fields:**
- `currency` (string): Currency code (default: "USD")
- `url` (string): Full URL of the product page
- `description` (string): Additional product details
- `purchase_date` (string): ISO 8601 date string (default: current time)
- `metadata` (object): Any additional data you want to store

**Response (201 Created):**
```json
{
  "success": true,
  "purchase": {
    "id": "507f1f77bcf86cd799439011",
    "item_name": "Wireless Headphones",
    "price": 79.99,
    "currency": "USD",
    "category": "electronics",
    "website": "amazon.com",
    "url": "https://amazon.com/product/12345",
    "description": "Sony WH-1000XM4 Wireless Noise Canceling Headphones",
    "purchase_date": "2025-10-05T08:23:56.000Z",
    "created_at": "2025-10-05T08:24:01.000Z"
  },
  "message": "Purchase added successfully"
}
```

**Error Responses:**
- `401 Unauthorized`: User not authenticated
- `400 Bad Request`: Missing required fields or invalid data
- `500 Internal Server Error`: Server error

---

### 2. List Purchases
**Endpoint:** `GET /api/purchases/list`

**Authentication:** Required (Clerk session cookie)

**Query Parameters:**
- `limit` (number, optional): Number of results (default: 50, max: 100)
- `offset` (number, optional): Pagination offset (default: 0)
- `category` (string, optional): Filter by category
- `start_date` (ISO date, optional): Filter purchases after this date
- `end_date` (ISO date, optional): Filter purchases before this date
- `sort` (string, optional): 'asc' or 'desc' (default: 'desc')

**Example Request:**
```
GET /api/purchases/list?limit=20&category=fashion&sort=desc
```

**Response (200 OK):**
```json
{
  "success": true,
  "purchases": [
    {
      "id": "507f1f77bcf86cd799439011",
      "item_name": "Wireless Headphones",
      "price": 79.99,
      "currency": "USD",
      "category": "electronics",
      "website": "amazon.com",
      "url": "https://amazon.com/product/12345",
      "description": "Sony WH-1000XM4",
      "purchase_date": "2025-10-05T08:23:56.000Z",
      "created_at": "2025-10-05T08:24:01.000Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "has_more": true
  },
  "statistics": {
    "total_purchases": 150,
    "total_spent": 5432.10,
    "category_breakdown": {
      "food": { "total_spent": 1200.50, "count": 45 },
      "fashion": { "total_spent": 890.00, "count": 12 },
      "electronics": { "total_spent": 2341.60, "count": 8 }
    }
  }
}
```

---

## Categories

The AI automatically categorizes purchases into one of the following:
- **food**: Groceries, restaurants, food delivery
- **fashion**: Clothing, shoes, accessories
- **entertainment**: Movies, games, streaming services
- **transport**: Uber, Lyft, gas, public transit
- **travel**: Hotels, flights, vacation packages
- **living**: Rent, utilities, household items
- **other**: Everything else

---

## Browser Extension Implementation

### Content Script Example

```javascript
// content-script.js
// Detect purchase completion on e-commerce sites

// Example for Amazon
if (window.location.hostname.includes('amazon.com')) {
  // Listen for order confirmation page
  if (window.location.pathname.includes('/gp/buy/spc/handlers/display.html')) {
    extractAmazonPurchase();
  }
}

async function extractAmazonPurchase() {
  // Extract purchase details from the page
  const itemName = document.querySelector('.product-title')?.textContent?.trim();
  const priceText = document.querySelector('.grand-total-price')?.textContent?.trim();
  const price = parseFloat(priceText?.replace(/[^0-9.]/g, '') || '0');
  
  const purchaseData = {
    item_name: itemName,
    price: price,
    currency: 'USD',
    website: 'amazon.com',
    url: window.location.href,
    description: extractProductDescription(),
    purchase_date: new Date().toISOString(),
    metadata: {
      order_id: extractOrderId(),
      detected_by: 'browser-extension-v1.0'
    }
  };

  // Send to background script
  chrome.runtime.sendMessage({
    type: 'PURCHASE_DETECTED',
    data: purchaseData
  });
}

function extractProductDescription() {
  return document.querySelector('.product-description')?.textContent?.trim() || '';
}

function extractOrderId() {
  const orderIdElement = document.querySelector('.order-id');
  return orderIdElement?.textContent?.trim() || '';
}
```

### Background Script Example

```javascript
// background.js
// Handle API communication

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PURCHASE_DETECTED') {
    savePurchase(message.data);
  }
});

async function savePurchase(purchaseData) {
  try {
    // Get authentication cookie from Clerk
    const cookies = await chrome.cookies.getAll({
      domain: 'your-app-domain.com',
      name: '__session' // Clerk session cookie
    });

    const sessionCookie = cookies[0]?.value;
    
    if (!sessionCookie) {
      console.error('User not authenticated');
      showNotification('Please sign in to track purchases');
      return;
    }

    // Send purchase to API
    const response = await fetch('https://your-app-domain.com/api/purchases/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `__session=${sessionCookie}`
      },
      credentials: 'include',
      body: JSON.stringify(purchaseData)
    });

    const result = await response.json();

    if (result.success) {
      showNotification(`Purchase tracked: ${result.purchase.item_name} - $${result.purchase.price}`);
      console.log('Category:', result.purchase.category);
    } else {
      console.error('Failed to save purchase:', result.error);
    }
  } catch (error) {
    console.error('Error saving purchase:', error);
  }
}

function showNotification(message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon.png',
    title: 'Purchase Tracked',
    message: message
  });
}
```

### Manifest.json Example

```json
{
  "manifest_version": 3,
  "name": "Smart Purchase Tracker",
  "version": "1.0.0",
  "description": "Automatically track and categorize your online purchases",
  "permissions": [
    "cookies",
    "notifications",
    "storage"
  ],
  "host_permissions": [
    "https://your-app-domain.com/*",
    "https://*.amazon.com/*",
    "https://*.ebay.com/*",
    "https://*.walmart.com/*"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": [
        "https://*.amazon.com/*",
        "https://*.ebay.com/*",
        "https://*.walmart.com/*"
      ],
      "js": ["content-script.js"],
      "run_at": "document_idle"
    }
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icon.png"
  }
}
```

---

## Supported E-commerce Sites

### Detection Patterns

Here are common patterns for detecting purchases on popular e-commerce sites:

#### Amazon
- **Confirmation URL:** `/gp/buy/spc/handlers/display.html` or `/gp/css/order-history`
- **Item Name:** `.product-title`, `.a-size-medium`
- **Price:** `.grand-total-price`, `.a-color-price`
- **Order ID:** `.order-info .value`

#### eBay
- **Confirmation URL:** `/sh/landing`
- **Item Name:** `.item-title`
- **Price:** `.total-price`
- **Order ID:** `.order-number`

#### Walmart
- **Confirmation URL:** `/checkout/confirmation`
- **Item Name:** `.product-title-link`
- **Price:** `.order-total`
- **Order ID:** `.order-number`

#### Shopify-based stores
- **Confirmation URL:** `/thank_you` or `/orders/`
- **Item Name:** `.product__description__name`
- **Price:** `.payment-due__price`
- **Order ID:** `.os-order-number`

---

## Testing

### Test the API with cURL

```bash
# Add a purchase
curl -X POST https://your-app-domain.com/api/purchases/add \
  -H "Content-Type: application/json" \
  -H "Cookie: __session=YOUR_SESSION_COOKIE" \
  -d '{
    "item_name": "Test Product",
    "price": 29.99,
    "website": "test.com",
    "description": "A test purchase"
  }'

# List purchases
curl -X GET "https://your-app-domain.com/api/purchases/list?limit=10" \
  -H "Cookie: __session=YOUR_SESSION_COOKIE"
```

---

## Security Considerations

1. **Authentication:** All requests must include a valid Clerk session cookie
2. **Data Privacy:** Purchase data is only accessible to the authenticated user
3. **HTTPS Only:** All API calls must use HTTPS
4. **Rate Limiting:** Consider implementing rate limiting to prevent abuse
5. **Input Validation:** All inputs are validated server-side

---

## Error Handling

The extension should handle these scenarios:

1. **User not authenticated:** Redirect to login or show authentication prompt
2. **Network errors:** Retry with exponential backoff
3. **Invalid data:** Log errors and notify user
4. **API rate limits:** Queue requests and retry later

---

## Next Steps

1. Implement the content scripts for your target e-commerce sites
2. Set up authentication flow with Clerk
3. Test the purchase detection on various sites
4. Add user preferences for which sites to track
5. Implement local caching for offline support
6. Add analytics dashboard in the web app

---

## Support

For questions or issues, please refer to the main documentation or create an issue in the repository.
