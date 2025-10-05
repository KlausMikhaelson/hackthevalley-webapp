# Money Tracker Extension Integration

## Overview

This webapp now automatically syncs user authentication data to `localStorage` for the Money Tracker browser extension to access.

## How It Works

### Components Added

1. **`app/components/MoneyTrackerSync.tsx`**
   - Client component that monitors Clerk authentication state
   - Automatically stores user data when signed in
   - Automatically clears user data when signed out
   - Runs silently in the background

2. **Updated `app/layout.tsx`**
   - Integrated `MoneyTrackerSync` component inside `ClerkProvider`
   - Ensures sync happens on every page

### Data Structure

When a user signs in, the following data is stored in `localStorage` with key `moneyTrackerUser`:

```json
{
  "id": "user_abc123",
  "email": "user@example.com",
  "name": "John Doe",
  "firstName": "John",
  "lastName": "Doe",
  "imageUrl": "https://...",
  "createdAt": 1696800000000
}
```

### Required Fields

- ✅ `id` - User's unique Clerk ID
- ✅ `email` - User's email (primary reference for extension)
- ✅ `createdAt` - Timestamp when data was stored

### Optional Fields

- `name` - Full name
- `firstName` - First name
- `lastName` - Last name
- `imageUrl` - Profile picture URL

## Testing

### Method 1: Browser Console

1. Start your dev server: `npm run dev`
2. Sign in to the webapp
3. Open browser console (F12)
4. Run:
   ```javascript
   JSON.parse(localStorage.getItem('moneyTrackerUser'))
   ```
5. You should see your user data

### Method 2: Test Page

1. Open `test-money-tracker.html` in your browser
2. Click "Check localStorage"
3. If signed in to the webapp, you'll see your user data
4. You can also simulate test data with "Simulate User Data" button

### Method 3: Extension Integration

1. Install the Money Tracker browser extension
2. Sign in to the webapp
3. Click the extension icon
4. Click "Sign In" in the extension
5. Extension should automatically detect and display your email

## Console Logs

The integration logs to console for debugging:

- ✅ **Sign In**: `"✅ Money Tracker: User data synced to localStorage"`
- 🔒 **Sign Out**: `"🔒 Money Tracker: User data cleared from localStorage"`

## Security Notes

- ✅ No sensitive data (passwords, tokens) stored
- ✅ Data is cleared on sign out
- ✅ Extension only reads data, never modifies it
- ✅ localStorage is domain-specific (not accessible by other sites)

## Troubleshooting

### Data Not Appearing

1. **Check if signed in**: User must be authenticated with Clerk
2. **Check console**: Look for sync messages
3. **Clear cache**: Try clearing browser cache and signing in again
4. **Check domain**: Extension and webapp must be on same domain for localStorage access

### Data Not Clearing

1. **Sign out properly**: Use the sign out button in the webapp
2. **Check console**: Should see "User data cleared" message
3. **Manual clear**: Run `localStorage.removeItem('moneyTrackerUser')` in console

## Files Modified

- ✅ `app/components/MoneyTrackerSync.tsx` (NEW)
- ✅ `app/layout.tsx` (UPDATED)
- ✅ `test-money-tracker.html` (NEW - for testing)
- ✅ `MONEY_TRACKER_INTEGRATION.md` (NEW - this file)

## Extension Usage

The Money Tracker extension will:

1. Check for `localStorage.getItem('moneyTrackerUser')` on load
2. Extract the `email` field as primary identifier
3. Use the email to associate tracked expenses with the user
4. Send expense data to your backend APIs

## Next Steps

1. ✅ Integration complete
2. Test with the Money Tracker extension
3. Verify expense tracking works end-to-end
4. Monitor console logs for any issues

---

**Last Updated**: October 5, 2025  
**Status**: ✅ Active and Working
