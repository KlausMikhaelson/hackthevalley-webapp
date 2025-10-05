# API Documentation

## Overview

The HTV WebApp provides AI-powered APIs for budget management and purchase decision-making using Google Gemini AI.

## Base URL

```
Development: http://localhost:3000
Production: https://your-domain.com
```

## Endpoints

### 1. POST /api/roast

Analyzes a shopping cart against budget and financial goals, providing AI-powered feedback on purchase responsibility.

#### Request Body

```json
{
  "items": {
    "Apple iPhone 15": "$999.99",
    "AirPods Pro": "$249.99"
  },
  "amount": "$1000",
  "goals": {
    "tuition": ["10000", "01012026"],
    "savings": ["5000", "12312025"]
  }
}
```

#### Parameters

- `items` (object, required): Key-value pairs of item names and prices
- `amount` (string, required): Remaining budget amount
- `goals` (object, required): Financial goals with format `{ "goal_name": ["amount", "date"] }`

#### Response

**Success (200)**
```json
{
  "result": "APPROVED! This purchase is within your budget and aligns with your goals."
}
```

**Error (400)**
```json
{
  "error": "Missing required fields: items, amount, goals"
}
```

**Error (500)**
```json
{
  "error": "API Error message"
}
```

#### Example

```bash
curl -X POST http://localhost:3000/api/roast \
  -H "Content-Type: application/json" \
  -d '{
    "items": {"Laptop": "$1200"},
    "amount": "$2000",
    "goals": {"savings": ["5000", "12312025"]}
  }'
```

---

### 2. POST /api/categorize

Automatically categorizes purchases into spending categories using AI.

#### Request Body

```json
{
  "items": {
    "Apple iPhone 15": "$999.99",
    "Pizza Hut Large Pizza": "$19.99",
    "Netflix Subscription": "$15.99"
  }
}
```

#### Parameters

- `items` (object, required): Key-value pairs of item names and prices

#### Response

**Success (200)**
```json
{
  "categories": {
    "fashion": [
      { "item": "Apple iPhone 15", "price": "$999.99" }
    ],
    "food": [
      { "item": "Pizza Hut Large Pizza", "price": "$19.99" }
    ],
    "entertainment": [
      { "item": "Netflix Subscription", "price": "$15.99" }
    ]
  }
}
```

**Error (400)**
```json
{
  "error": "Missing required field: items"
}
```

**Error (500)**
```json
{
  "error": "Categorization failed"
}
```

#### Categories

Items are categorized into:
- `food`
- `fashion`
- `entertainment`
- `transport`
- `travel`
- `living`

#### Example

```bash
curl -X POST http://localhost:3000/api/categorize \
  -H "Content-Type: application/json" \
  -d '{
    "items": {
      "Nike Shoes": "$120",
      "Burger": "$10"
    }
  }'
```

---

### 3. GET /api/storage/buckets

Tests Google Cloud Storage authentication by listing available buckets.

#### Request

No parameters required.

#### Response

**Success (200)**
```json
{
  "message": "Successfully authenticated and listed buckets. Check console for output."
}
```

**Error (500)**
```json
{
  "error": "Authentication failed"
}
```

#### Example

```bash
curl http://localhost:3000/api/storage/buckets
```

---

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request (missing or invalid parameters)
- `500` - Internal Server Error (API failure, authentication issues)

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production use.

---

## Authentication

Currently no authentication is required. For production, consider implementing:
- API keys
- OAuth 2.0
- JWT tokens

---

## Environment Variables

Required environment variables:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## Testing the API

### Using PowerShell

See `test-api.ps1` for comprehensive API testing script.

### Using curl

```bash
# Test roast endpoint
curl -X POST http://localhost:3000/api/roast \
  -H "Content-Type: application/json" \
  -d '{"items":{"Test":"$50"},"amount":"$1000","goals":{"savings":["5000","12312025"]}}'

# Test categorize endpoint
curl -X POST http://localhost:3000/api/categorize \
  -H "Content-Type: application/json" \
  -d '{"items":{"Pizza":"$15"}}'

# Test storage endpoint
curl http://localhost:3000/api/storage/buckets
```

---

## SDK Support

Currently no official SDKs are provided. The API follows REST principles and can be consumed by any HTTP client.

### Example: JavaScript/TypeScript

```typescript
async function roastPurchase(items: Record<string, string>, amount: string, goals: Record<string, [string, string]>) {
  const response = await fetch('/api/roast', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, amount, goals })
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  
  return await response.json();
}
```

---

---

### 4. POST /api/purchases/add

Add a new purchase to the user's database with automatic AI categorization.

**Authentication:** Required (Clerk session)

#### Request Body

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
    "order_id": "112-1234567-1234567"
  }
}
```

#### Parameters

- `item_name` (string, required): Name of the purchased item
- `price` (number, required): Price in decimal format
- `website` (string, required): Domain name of the website
- `currency` (string, optional): Currency code (default: "USD")
- `url` (string, optional): Full URL of the product page
- `description` (string, optional): Additional product details
- `purchase_date` (string, optional): ISO 8601 date string (default: current time)
- `metadata` (object, optional): Additional data to store

#### Response

**Success (201)**
```json
{
  "success": true,
  "purchase": {
    "id": "507f1f77bcf86cd799439011",
    "item_name": "Wireless Headphones",
    "price": 79.99,
    "currency": "USD",
    "category": "entertainment",
    "website": "amazon.com",
    "url": "https://amazon.com/product/12345",
    "description": "Sony WH-1000XM4 Wireless Noise Canceling Headphones",
    "purchase_date": "2025-10-05T08:23:56.000Z",
    "created_at": "2025-10-05T08:24:01.000Z"
  },
  "message": "Purchase added successfully"
}
```

**Error (401)**
```json
{
  "error": "Unauthorized - Please sign in"
}
```

**Error (400)**
```json
{
  "error": "Missing required fields: item_name, price, website"
}
```

#### Example

```bash
curl -X POST http://localhost:3000/api/purchases/add \
  -H "Content-Type: application/json" \
  -H "Cookie: __session=YOUR_SESSION_COOKIE" \
  -d '{
    "item_name": "Nike Shoes",
    "price": 120.00,
    "website": "nike.com"
  }'
```

---

### 5. GET /api/purchases/list

Retrieve user's purchases with optional filters and statistics.

**Authentication:** Required (Clerk session)

#### Query Parameters

- `limit` (number, optional): Number of results (default: 50, max: 100)
- `offset` (number, optional): Pagination offset (default: 0)
- `category` (string, optional): Filter by category
- `start_date` (ISO date, optional): Filter purchases after this date
- `end_date` (ISO date, optional): Filter purchases before this date
- `sort` (string, optional): 'asc' or 'desc' (default: 'desc')

#### Response

**Success (200)**
```json
{
  "success": true,
  "purchases": [
    {
      "id": "507f1f77bcf86cd799439011",
      "item_name": "Wireless Headphones",
      "price": 79.99,
      "currency": "USD",
      "category": "entertainment",
      "website": "amazon.com",
      "purchase_date": "2025-10-05T08:23:56.000Z",
      "created_at": "2025-10-05T08:24:01.000Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 50,
    "offset": 0,
    "has_more": true
  },
  "statistics": {
    "total_purchases": 150,
    "total_spent": 5432.10,
    "category_breakdown": {
      "food": { "total_spent": 1200.50, "count": 45 },
      "fashion": { "total_spent": 890.00, "count": 12 }
    }
  }
}
```

#### Example

```bash
curl -X GET "http://localhost:3000/api/purchases/list?limit=20&category=fashion" \
  -H "Cookie: __session=YOUR_SESSION_COOKIE"
```

---

## Changelog

### Version 2.0.0
- Added POST /api/purchases/add endpoint for purchase tracking
- Added GET /api/purchases/list endpoint for retrieving purchases
- Integrated Clerk authentication
- Added MongoDB for data persistence
- AI-powered automatic categorization

### Version 1.0.0
- Initial API release
- POST /api/roast endpoint
- POST /api/categorize endpoint
- GET /api/storage/buckets endpoint
