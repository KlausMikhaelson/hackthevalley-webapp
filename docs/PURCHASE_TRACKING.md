# Purchase Tracking Feature

## Overview

The Purchase Tracking feature automatically captures, categorizes, and stores user purchases from e-commerce websites. It uses AI-powered categorization via Google Gemini to intelligently organize spending data.

## Features

✅ **Automatic Purchase Detection** - Browser extension captures purchases from popular e-commerce sites  
✅ **AI Categorization** - Gemini AI automatically categorizes purchases into spending categories  
✅ **User Database** - All purchases stored in MongoDB with user authentication  
✅ **Analytics & Statistics** - Track spending by category, time period, and more  
✅ **RESTful API** - Clean API for adding and retrieving purchases  
✅ **Extension Ready** - Complete integration guide for browser extensions  

## Architecture

```
┌─────────────────┐
│ Browser         │
│ Extension       │
└────────┬────────┘
         │ Detects Purchase
         ▼
┌─────────────────┐
│ POST /api/      │
│ purchases/add   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Gemini AI       │◄─── Categorizes Item
│ Categorization  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ MongoDB         │◄─── Stores Purchase
│ Database        │
└─────────────────┘
```

## Components

### 1. Database Model (`models/Purchase.ts`)

Defines the purchase schema with the following fields:
- `user_id` - Clerk user ID (indexed)
- `item_name` - Name of purchased item
- `price` - Price in decimal format
- `currency` - Currency code (default: USD)
- `category` - AI-assigned category
- `website` - Domain of purchase
- `url` - Product page URL (optional)
- `description` - Item description (optional)
- `purchase_date` - Date of purchase
- `metadata` - Additional data (optional)

### 2. API Endpoints

#### Add Purchase
**`POST /api/purchases/add`**
- Requires Clerk authentication
- Validates input data
- Categorizes item using Gemini AI
- Stores in database
- Returns purchase with assigned category

#### List Purchases
**`GET /api/purchases/list`**
- Requires Clerk authentication
- Supports filtering by category, date range
- Pagination support (limit, offset)
- Returns statistics and category breakdown

### 3. Categorization Library (`lib/categorization.ts`)

Reusable utility for AI-powered categorization:
- `categorizePurchase()` - Categorize single item
- `categorizeBatch()` - Categorize multiple items
- `getCategoryDisplayName()` - Get friendly category names
- `getCategoryIcon()` - Get category emojis

**Categories:**
- 🍔 Food & Dining
- 👕 Fashion & Apparel
- 🎮 Entertainment
- 🚗 Transportation
- ✈️ Travel
- 🏠 Living & Household
- 📦 Other

### 4. Browser Extension Integration

Complete documentation and code examples in:
- `docs/EXTENSION_INTEGRATION.md` - Full integration guide
- `docs/EXTENSION_PROMPTS.md` - Templates and prompts

## Usage

### Adding a Purchase (API)

```bash
curl -X POST http://localhost:3000/api/purchases/add \
  -H "Content-Type: application/json" \
  -H "Cookie: __session=YOUR_SESSION_COOKIE" \
  -d '{
    "item_name": "Wireless Headphones",
    "price": 79.99,
    "website": "amazon.com",
    "description": "Sony WH-1000XM4"
  }'
```

### Retrieving Purchases (API)

```bash
curl -X GET "http://localhost:3000/api/purchases/list?limit=20&category=fashion" \
  -H "Cookie: __session=YOUR_SESSION_COOKIE"
```

### Using in Browser Extension

```javascript
// In your content script
const purchaseData = {
  item_name: "Nike Shoes",
  price: 120.00,
  website: "nike.com",
  url: window.location.href
};

// Send to background script
chrome.runtime.sendMessage({
  type: 'PURCHASE_DETECTED',
  data: purchaseData
});
```

```javascript
// In your background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'PURCHASE_DETECTED') {
    fetch('https://your-app.com/api/purchases/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(message.data)
    });
  }
});
```

## Testing

Run the test suite:

```bash
npm test __tests__/api/purchases.test.ts
```

Tests cover:
- ✅ Adding purchases with authentication
- ✅ Input validation
- ✅ AI categorization
- ✅ Listing purchases with filters
- ✅ Pagination
- ✅ Statistics calculation

## Environment Variables

Required in `.env`:

```env
# Gemini AI for categorization
GEMINI_API_KEY=your_gemini_api_key

# MongoDB for data storage
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# Clerk for authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Security

- ✅ **Authentication Required** - All endpoints require Clerk session
- ✅ **User Isolation** - Users can only access their own purchases
- ✅ **Input Validation** - All inputs validated server-side
- ✅ **HTTPS Only** - Production requires HTTPS
- ✅ **No Sensitive Data** - Payment details not stored

## Performance

- **Indexed Queries** - User ID and date fields indexed for fast queries
- **Pagination** - Efficient pagination with limit/offset
- **Batch Categorization** - Support for categorizing multiple items
- **Caching** - Consider adding Redis for frequently accessed data

## Future Enhancements

- [ ] Budget alerts when category spending exceeds limits
- [ ] Duplicate purchase detection
- [ ] Receipt image upload and OCR
- [ ] Export data to CSV/PDF
- [ ] Spending trends and predictions
- [ ] Integration with bank APIs
- [ ] Multi-currency support with conversion
- [ ] Shared family accounts

## Documentation

- **API Reference**: `docs/API.md`
- **Extension Guide**: `docs/EXTENSION_INTEGRATION.md`
- **Extension Prompts**: `docs/EXTENSION_PROMPTS.md`
- **Testing Guide**: `docs/TESTING.md`

## Support

For questions or issues:
1. Check the documentation in `docs/`
2. Review test files in `__tests__/api/purchases.test.ts`
3. Create an issue in the repository

## License

Same as main project license.
