# Testing Guide

## Overview

The project uses Jest for comprehensive testing of both API routes and utility functions.

## Test Coverage

Current test coverage: **~96%**

### Test Files

```
__tests__/
├── api/                           # API route tests
│   ├── roast.test.ts             # POST /api/roast tests
│   ├── categorize.test.ts        # POST /api/categorize tests
│   └── storage-buckets.test.ts   # GET /api/storage/buckets tests
└── lib/                          # Utility function tests
    └── roasting.test.ts          # Core business logic tests
```

## Running Tests

### Run All Tests with Coverage
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Quick Tests (No Coverage)
```bash
npm run test:quick
```

### Run Specific Test File
```bash
npx jest __tests__/api/roast.test.ts
```

### Run Tests Matching Pattern
```bash
npx jest --testNamePattern="should return roast result"
```

## Test Structure

### API Route Tests

API route tests use Next.js `NextRequest` to simulate HTTP requests:

```typescript
import { POST } from '@/app/api/roast/route';
import { NextRequest } from 'next/server';

describe('POST /api/roast', () => {
  it('should return roast result when valid data is provided', async () => {
    const request = new NextRequest('http://localhost:3000/api/roast', {
      method: 'POST',
      body: JSON.stringify({ items, amount, goals }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ result: mockResult });
  });
});
```

### Utility Function Tests

Utility tests mock external dependencies (Google AI, Cloud Storage):

```typescript
// Mock the Google AI SDK
jest.mock("@google/genai", () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: mockGenerateContent
    }
  }))
}));

describe('roast()', () => {
  it('should return AI-generated roast response', async () => {
    mockGenerateContent.mockResolvedValue({ text: 'APPROVED!' });
    
    const result = await roast(items, amount, goals);
    
    expect(result).toBe('APPROVED!');
  });
});
```

## Test Categories

### 1. Happy Path Tests
Tests that verify correct behavior with valid inputs:
- ✅ Valid request returns expected response
- ✅ Correct status codes
- ✅ Proper data formatting

### 2. Error Handling Tests
Tests that verify proper error handling:
- ✅ Missing required fields return 400
- ✅ API failures return 500
- ✅ Error messages are descriptive

### 3. Edge Cases
Tests for boundary conditions:
- ✅ Empty objects
- ✅ Special characters in responses
- ✅ Multiple items in same category

### 4. Integration Tests
Tests that verify component interaction:
- ✅ API routes call correct utility functions
- ✅ Utility functions format data correctly
- ✅ Mocked dependencies behave as expected

## Mocking Strategy

### External APIs
All external API calls are mocked to:
- Avoid rate limits
- Ensure consistent test results
- Speed up test execution
- Prevent real API charges

### Mocked Dependencies
- `@google/genai` - Google Gemini AI SDK
- `@google-cloud/storage` - Google Cloud Storage

## Writing New Tests

### 1. Create Test File
```bash
# For API routes
touch __tests__/api/your-endpoint.test.ts

# For utilities
touch __tests__/lib/your-utility.test.ts
```

### 2. Follow the Pattern
```typescript
import { POST } from '@/app/api/your-endpoint/route';
import { NextRequest } from 'next/server';

// Mock dependencies
jest.mock('@/lib/your-utility', () => ({
  yourFunction: jest.fn(),
}));

import { yourFunction } from '@/lib/your-utility';

describe('POST /api/your-endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle valid request', async () => {
    // Arrange
    (yourFunction as jest.Mock).mockResolvedValue('result');
    const request = new NextRequest('http://localhost:3000/api/your-endpoint', {
      method: 'POST',
      body: JSON.stringify({ data: 'test' }),
      headers: { 'Content-Type': 'application/json' },
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data).toEqual({ result: 'result' });
    expect(yourFunction).toHaveBeenCalledWith('test');
  });

  it('should handle errors', async () => {
    // Arrange
    (yourFunction as jest.Mock).mockRejectedValue(new Error('Test error'));
    const request = new NextRequest('http://localhost:3000/api/your-endpoint', {
      method: 'POST',
      body: JSON.stringify({ data: 'test' }),
      headers: { 'Content-Type': 'application/json' },
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Test error' });
  });
});
```

### 3. Run Your Tests
```bash
npx jest __tests__/api/your-endpoint.test.ts --watch
```

## Best Practices

### ✅ DO:
- Write tests before fixing bugs (TDD)
- Keep tests isolated and independent
- Mock external dependencies
- Test both success and failure cases
- Use descriptive test names
- Clear mocks between tests with `beforeEach`
- Aim for high coverage (>80%)

### ❌ DON'T:
- Make real API calls in tests
- Test implementation details
- Make tests dependent on each other
- Skip tests without good reason
- Commit failing tests
- Hard-code sensitive data

## Test Naming Convention

Use descriptive names that explain what is being tested:

```typescript
// ✅ Good
it('should return 400 when items is missing', async () => { ... });
it('should categorize items into spending categories', async () => { ... });

// ❌ Bad
it('test 1', async () => { ... });
it('works', async () => { ... });
```

## Debugging Tests

### View Detailed Output
```bash
npx jest --verbose
```

### Debug Single Test
```bash
npx jest --testNamePattern="your test name" --verbose
```

### Debug with Node Inspector
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then open `chrome://inspect` in Chrome.

## CI/CD Integration

Tests run automatically on:
- Every push to `main` or `develop`
- Every pull request
- Multiple Node.js versions (18.x, 20.x)

### GitHub Actions Workflow
```yaml
- name: Run tests
  run: npm test
  env:
    GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

## Git Hooks

### Pre-Commit Hook
Runs linter before commit (fast):
```bash
git commit -m "Your message"
# 🔍 Running linter...
# ✓ Lint passed!
```

### Pre-Push Hook
Runs full test suite before push:
```bash
git push
# 🧪 Running full test suite before push...
# ✓ All tests passed!
```

### Bypass Hooks (Emergency Only)
```bash
git commit --no-verify
git push --no-verify
```

## Coverage Reports

### View Coverage in Terminal
```bash
npm test
```

### Generate HTML Coverage Report
```bash
npm test
# Open coverage/lcov-report/index.html in browser
```

### Coverage Thresholds
Configure in `package.json`:
```json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

## Common Issues

### Issue: "Cannot find module '@/lib/...'"
**Solution:** Check `moduleNameMapper` in `package.json`:
```json
{
  "jest": {
    "moduleNameMapper": {
      "^@/(.*)$": "<rootDir>/$1"
    }
  }
}
```

### Issue: Tests timeout
**Solution:** Increase timeout:
```typescript
jest.setTimeout(10000); // 10 seconds
```

### Issue: Mock not working
**Solution:** Ensure mock is defined before import:
```typescript
// ✅ Correct order
jest.mock('@/lib/utility');
import { utility } from '@/lib/utility';

// ❌ Wrong order
import { utility } from '@/lib/utility';
jest.mock('@/lib/utility');
```

### Issue: "ReferenceError: fetch is not defined"
**Solution:** Next.js 15 includes fetch by default. If using older version:
```bash
npm install --save-dev whatwg-fetch
```

## Performance Tips

### Run Tests in Parallel
```bash
npx jest --maxWorkers=4
```

### Run Only Changed Tests
```bash
npx jest --onlyChanged
```

### Skip Slow Tests During Development
```typescript
describe.skip('Slow integration tests', () => {
  // These tests will be skipped
});
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Next.js Testing Documentation](https://nextjs.org/docs/app/building-your-application/testing/jest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

## Test Statistics

| Metric | Value |
|--------|-------|
| Total Tests | 22+ |
| Coverage | ~96% |
| Average Runtime | ~5s |
| Files Tested | 7 |

## Continuous Improvement

Regularly:
1. Review and update tests when adding features
2. Refactor tests to reduce duplication
3. Add tests for reported bugs
4. Monitor coverage trends
5. Update mocks when APIs change
