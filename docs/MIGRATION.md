# Migration from Express Server to Next.js API Routes

## Overview

The separate Express server (`htv-server`) has been successfully migrated to Next.js API routes within the main application.

## What Changed

### Directory Structure

**Before:**
```
htv-webapp/
├── htv-server/              # Separate Express server
│   ├── server.js
│   ├── roasting.js
│   ├── server.test.js
│   ├── roasting.test.js
│   ├── .github/
│   ├── .husky/
│   └── package.json
└── app/                     # Next.js app
    └── ...
```

**After:**
```
htv-webapp/
├── app/
│   └── api/                 # Next.js API routes
│       ├── roast/
│       │   └── route.ts
│       ├── categorize/
│       │   └── route.ts
│       └── storage/
│           └── buckets/
│               └── route.ts
├── lib/
│   └── roasting.ts          # Shared utility functions
├── __tests__/
│   ├── api/                 # API route tests
│   │   ├── roast.test.ts
│   │   ├── categorize.test.ts
│   │   └── storage-buckets.test.ts
│   └── lib/                 # Utility function tests
│       └── roasting.test.ts
├── .github/
│   └── workflows/
│       └── ci.yml           # Updated CI/CD pipeline
├── .husky/                  # Git hooks
│   ├── pre-commit
│   └── pre-push
└── package.json             # Consolidated dependencies
```

### API Endpoints

The API endpoints remain **unchanged**:
- `POST /api/roast`
- `POST /api/categorize`
- `GET /api/storage/buckets`

**No changes required to frontend code or API consumers.**

### Technology Changes

| Component | Before | After |
|-----------|--------|-------|
| Framework | Express.js | Next.js API Routes |
| Language | JavaScript | TypeScript |
| Testing | Jest + Supertest | Jest + Next.js testing |
| Server | Standalone (port 3000) | Integrated with Next.js |

## Migration Steps Performed

### 1. Dependencies
- ✅ Merged `htv-server/package.json` into main `package.json`
- ✅ Added required dependencies: `@google-cloud/storage`, `@google/genai`, `dotenv`
- ✅ Added dev dependencies: `jest`, `husky`, `@types/jest`

### 2. Code Migration
- ✅ Converted `roasting.js` → `lib/roasting.ts` (TypeScript)
- ✅ Created Next.js API routes:
  - `app/api/roast/route.ts`
  - `app/api/categorize/route.ts`
  - `app/api/storage/buckets/route.ts`

### 3. Tests
- ✅ Migrated `roasting.test.js` → `__tests__/lib/roasting.test.ts`
- ✅ Converted `server.test.js` → API route tests:
  - `__tests__/api/roast.test.ts`
  - `__tests__/api/categorize.test.ts`
  - `__tests__/api/storage-buckets.test.ts`

### 4. CI/CD & Git Hooks
- ✅ Migrated `.github/workflows/ci.yml` with Next.js build step
- ✅ Migrated Husky hooks (`.husky/pre-commit`, `.husky/pre-push`)
- ✅ Updated scripts in `package.json`

### 5. Documentation
- ✅ Created `docs/API.md` - API documentation
- ✅ Created `docs/MIGRATION.md` - This file
- ✅ Created `docs/TESTING.md` - Testing guide

## Breaking Changes

**None.** The API interface remains identical.

## Environment Variables

Ensure `.env` file exists in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## Running the Application

### Before (Express Server)
```bash
cd htv-server
npm install
npm start
```

### After (Next.js)
```bash
npm install
npm run dev
```

The API will be available at `http://localhost:3000/api/*`

## Testing

### Before
```bash
cd htv-server
npm test
```

### After
```bash
npm test
```

## Deployment

### Before
Deploy Express server separately to:
- Heroku
- AWS EC2
- DigitalOcean
- etc.

### After
Deploy as a unified Next.js application to:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Self-hosted

## Benefits of Migration

### 1. **Unified Codebase**
- Single repository
- Shared dependencies
- Consistent tooling

### 2. **Better Developer Experience**
- TypeScript support
- Integrated development
- Faster hot reload

### 3. **Simplified Deployment**
- One deployment instead of two
- Automatic API route optimization
- Built-in serverless support

### 4. **Performance**
- Next.js optimizations
- Automatic code splitting
- Edge runtime support (optional)

### 5. **Maintenance**
- Single CI/CD pipeline
- Unified testing strategy
- Easier dependency management

## Rollback Plan

If you need to rollback to the Express server:

1. The original `htv-server` directory is still available
2. Start the Express server:
   ```bash
   cd htv-server
   npm install
   npm start
   ```
3. Update frontend to point to `http://localhost:3000` (Express port)

## Next Steps

### Recommended Actions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Initialize Husky**
   ```bash
   npm run prepare
   ```

3. **Run Tests**
   ```bash
   npm test
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Update GitHub Secrets**
   - Ensure `GEMINI_API_KEY` is set in repository secrets

### Optional Enhancements

1. **Add API Authentication**
   - Implement API keys or JWT tokens
   - Add middleware for route protection

2. **Add Rate Limiting**
   - Protect against abuse
   - Use `@upstash/ratelimit` or similar

3. **Add Request Validation**
   - Use Zod or Yup for schema validation
   - Improve error messages

4. **Add API Versioning**
   - Create `/api/v1/` routes
   - Maintain backward compatibility

5. **Add Monitoring**
   - Integrate Sentry for error tracking
   - Add logging with Winston or Pino

## Troubleshooting

### Issue: Tests Fail
**Solution:** Ensure all dependencies are installed:
```bash
npm install
```

### Issue: API Routes Not Found
**Solution:** Restart the development server:
```bash
npm run dev
```

### Issue: Environment Variables Not Loaded
**Solution:** Create `.env` file in root directory with required variables.

### Issue: Husky Hooks Not Running
**Solution:** Reinstall Husky:
```bash
npm run prepare
```

## Support

For issues or questions:
1. Check the documentation in `docs/`
2. Review test files for usage examples
3. Check GitHub Actions logs for CI/CD issues

## Cleanup

After verifying the migration works correctly, you can optionally remove the old server:

```bash
# CAUTION: Only do this after thorough testing
rm -rf htv-server
```

**Recommendation:** Keep `htv-server` for a few weeks as a backup before removing it.
