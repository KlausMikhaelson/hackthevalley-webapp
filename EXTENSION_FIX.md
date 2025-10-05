# Fix for Extension Authentication

## The Problem

Your extension is sending Clerk session cookies, but the middleware is no longer processing them for API routes because you removed `'/(api|trpc)(.*)'` from the matcher.

## Solution: Use API Key Authentication

### Step 1: Set API Key in .env

Add to your `.env` file:
```env
EXTENSION_API_KEY=your_secure_random_key_here
```

Generate a key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Update Your Extension Code

Modify your extension to send the API key:

```javascript
// In your extension's background.js or content script
const API_KEY = 'your_secure_random_key_here'; // Same as EXTENSION_API_KEY in .env
const USER_ID = 'user_33dJfGGpFjaLwHeABefNU3iODCW'; // From your Clerk session

async function savePurchase(purchaseData) {
  const response = await fetch('http://localhost:3000/api/purchases/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY  // ← Add this header
    },
    body: JSON.stringify({
      user_id: USER_ID,  // ← Add this field
      item_name: purchaseData.item_name,
      price: purchaseData.price,
      website: purchaseData.website,
      url: purchaseData.url,
      purchase_date: purchaseData.purchase_date,
      metadata: purchaseData.metadata,
      currency: purchaseData.currency
    })
  });
  
  return await response.json();
}
```

### Step 3: Test with cURL

```bash
curl "http://localhost:3000/api/purchases/add" ^
  -H "Content-Type: application/json" ^
  -H "x-api-key: your_secure_random_key_here" ^
  --data-raw "{\"user_id\":\"user_33dJfGGpFjaLwHeABefNU3iODCW\",\"item_name\":\"Test Product\",\"price\":29.99,\"website\":\"amazon.ca\"}"
```

---

## Alternative: Restore Clerk Middleware for API Routes

If you want to use Clerk authentication instead, restore the middleware:

```typescript
// middleware.ts
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',  // ← Add this back
  ],
};
```

But this won't work well for browser extensions because:
- Extensions can't easily send Clerk session cookies cross-origin
- CORS issues with chrome-extension:// origin
- More complex authentication flow

**Recommendation: Use the API key approach!** ✅
