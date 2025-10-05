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

## Changelog

### Version 1.0.0
- Initial API release
- POST /api/roast endpoint
- POST /api/categorize endpoint
- GET /api/storage/buckets endpoint
