# Initialize Goal for Existing User

Your user was created but the goal wasn't initialized. Here are 3 ways to fix this:

## Option 1: Browser Console (Easiest)

1. Open your app in the browser (http://localhost:3000)
2. Open Developer Console (F12)
3. Paste this code and press Enter:

```javascript
fetch('http://localhost:3000/api/goals/initialize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    user_id: 'user_33e9j0LNB0oQPioPYS5tSvnwFT2'
  })
})
.then(res => res.json())
.then(data => console.log('Goal created:', data))
.catch(err => console.error('Error:', err));
```

## Option 2: Using curl

```bash
curl -X POST http://localhost:3000/api/goals/initialize \
  -H "Content-Type: application/json" \
  -d '{"user_id":"user_33e9j0LNB0oQPioPYS5tSvnwFT2"}'
```

## Option 3: Using PowerShell

```powershell
$body = @{
    user_id = "user_33e9j0LNB0oQPioPYS5tSvnwFT2"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/goals/initialize" -Method Post -Body $body -ContentType "application/json"
```

## Verify Goal Was Created

After running one of the above, verify by checking:

```javascript
fetch('http://localhost:3000/api/goals/list?user_id=user_33e9j0LNB0oQPioPYS5tSvnwFT2')
  .then(res => res.json())
  .then(data => console.log('User goals:', data))
```

You should see a goal with:
- name: "Daily Spending Limit"
- type: "daily_spending"
- target_amount: 100
- is_default: true

## For Future Users

The webhook has been updated, so all NEW users will automatically get the default goal when they sign up. This is only needed for your existing user.
