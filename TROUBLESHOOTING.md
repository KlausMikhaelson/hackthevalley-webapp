# Troubleshooting Guide

## Common Issues and Solutions

### ✅ FIXED: Jest Tests Failing

**Problem:** Tests were failing with module resolution errors.

**Solution:** Added TypeScript support to Jest configuration.

**What was fixed:**
1. Added `ts-jest` as a dev dependency
2. Updated Jest config with TypeScript preset
3. Configured proper transform settings

The fix is already applied in `package.json`. Tests now pass successfully:
- ✅ 21 tests passing
- ✅ 100% statement coverage
- ✅ All API routes tested
- ✅ All utility functions tested

### Running Tests

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch

# Run quick tests (no coverage)
npm run test:quick
```

---

## Other Common Issues

### Issue: "Cannot find module '@/...'"

**Cause:** Path alias not configured correctly.

**Solution:** Already configured in `package.json`:
```json
"moduleNameMapper": {
  "^@/(.*)$": "<rootDir>/$1"
}
```

### Issue: "GEMINI_API_KEY is not defined"

**Cause:** Environment variables not loaded.

**Solution:**
1. Create `.env` file in root directory
2. Add: `GEMINI_API_KEY=your_api_key_here`
3. Restart dev server

### Issue: Port 3000 already in use

**Solution (Windows):**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Or run on different port:**
```bash
$env:PORT=3001; npm run dev
```

### Issue: Husky hooks not running

**Solution:**
```bash
# Reinstall Husky
npm run prepare

# Verify hooks are installed
ls .husky
```

### Issue: Build fails

**Solution:**
```bash
# Clear Next.js cache
rm -r .next

# Reinstall dependencies
rm -r node_modules
npm install

# Try building again
npm run build
```

### Issue: TypeScript errors

**Solution:**
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Update TypeScript
npm install typescript@latest --save-dev
```

### Issue: ESLint errors

**Solution:**
```bash
# Run linter
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

### Issue: "Failed to load config 'next/core-web-vitals'"

**Cause:** Missing ESLint Next.js config package.

**Solution:**
```bash
npm install --save-dev eslint-config-next
```

This is already installed if you ran `npm install` after the migration.

---

## Test-Specific Issues

### Issue: Mock not working

**Cause:** Mock defined after import.

**Solution:** Always define mocks before imports:
```typescript
// ✅ Correct
jest.mock('@/lib/utility');
import { utility } from '@/lib/utility';

// ❌ Wrong
import { utility } from '@/lib/utility';
jest.mock('@/lib/utility');
```

### Issue: Tests timeout

**Solution:** Increase timeout:
```typescript
jest.setTimeout(10000); // 10 seconds
```

### Issue: Coverage too low

**Solution:**
1. Run tests to see uncovered lines
2. Add tests for missing scenarios
3. Check `coverage/lcov-report/index.html` for details

---

## Development Issues

### Issue: Hot reload not working

**Solution:**
```bash
# Restart dev server
npm run dev
```

### Issue: API route not found (404)

**Cause:** File not in correct location or server not restarted.

**Solution:**
1. Ensure route file is in `app/api/[route]/route.ts`
2. Restart dev server
3. Check browser console for errors

### Issue: CORS errors

**Solution:** Add CORS headers to API routes:
```typescript
export async function POST(request: NextRequest) {
  const response = NextResponse.json({ data: 'value' });
  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
}
```

---

## Deployment Issues

### Issue: Build succeeds locally but fails in CI

**Cause:** Environment-specific code or missing dependencies.

**Solution:**
1. Check GitHub Actions logs
2. Verify all secrets are set
3. Ensure `package-lock.json` is committed
4. Test with: `npm ci` instead of `npm install`

### Issue: API routes work locally but not in production

**Cause:** Environment variables not set in production.

**Solution:**
1. Add environment variables to deployment platform
2. Verify `GEMINI_API_KEY` is set
3. Check deployment logs

---

## Getting Help

If you're still stuck:

1. **Check Documentation**
   - [API.md](docs/API.md)
   - [TESTING.md](docs/TESTING.md)
   - [MIGRATION.md](docs/MIGRATION.md)

2. **Review Examples**
   - Check test files in `__tests__/`
   - Review API route implementations

3. **Check Logs**
   - Browser console
   - Terminal output
   - GitHub Actions logs

4. **Common Commands**
   ```bash
   # Clean install
   rm -r node_modules package-lock.json
   npm install
   
   # Reset everything
   rm -r .next node_modules
   npm install
   npm run dev
   ```

---

## Quick Fixes Checklist

When something breaks, try these in order:

1. ✅ Restart dev server
2. ✅ Clear `.next` cache
3. ✅ Reinstall dependencies
4. ✅ Check environment variables
5. ✅ Review error messages carefully
6. ✅ Check documentation
7. ✅ Run tests to verify functionality

---

## Useful Debug Commands

```bash
# Check Node version
node --version

# Check npm version
npm --version

# List installed packages
npm list --depth=0

# Check for outdated packages
npm outdated

# Verify TypeScript config
npx tsc --showConfig

# Run single test file
npx jest __tests__/api/roast.test.ts

# Debug tests
node --inspect-brk node_modules/.bin/jest --runInBand
```

---

## Success Indicators

Your setup is working correctly if:

- ✅ `npm run dev` starts without errors
- ✅ `npm test` shows 21 passing tests
- ✅ `npm run build` completes successfully
- ✅ API endpoints respond (test with `.\test-api.ps1`)
- ✅ Git hooks trigger on commit/push
- ✅ No TypeScript errors in IDE

---

## Prevention Tips

To avoid issues:

1. **Always commit `package-lock.json`**
2. **Use `npm ci` in CI/CD** (not `npm install`)
3. **Keep dependencies updated** (but test first)
4. **Run tests before committing** (hooks do this automatically)
5. **Document environment variables** in `env.example`
6. **Use TypeScript** for type safety
7. **Write tests** for new features

---

## Emergency Rollback

If everything breaks:

```bash
# Restore from git
git reset --hard HEAD

# Clean install
rm -r node_modules .next
npm install

# Verify
npm test
npm run dev
```
