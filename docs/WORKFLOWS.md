# GitHub Actions Workflows

This project uses multiple GitHub Actions workflows for continuous integration and quality assurance.

## Workflows Overview

### 1. CI/CD Pipeline (`ci.yml`)

**Triggers:**
- Push to `main`, `develop` branches
- Pull requests to `main`, `develop` branches

**Jobs:**
- **Test** - Runs on Node.js 18.x and 20.x
  - Installs dependencies
  - Runs all tests with coverage
  - Uploads coverage to Codecov
  
- **Lint** - Code quality checks
  - Runs ESLint
  - Performs SonarCloud analysis
  
- **Build** - Verifies production build
  - Builds Next.js application
  - Ensures no build errors

**Status:** ✅ Required for merging

---

### 2. Lint Workflow (`lint.yml`)

**Triggers:**
- Push to `main`, `master`, `develop` branches
- Pull requests to `main`, `master`, `develop` branches
- Manual trigger via workflow_dispatch

**Jobs:**
- **ESLint Check** - JavaScript/TypeScript linting
  - Runs `npm run lint`
  - Checks code style and potential errors
  
- **TypeScript Check** - Type checking
  - Runs `tsc --noEmit`
  - Validates TypeScript types without compilation
  
- **Prettier Check** - Code formatting
  - Checks if code follows formatting rules
  - Non-blocking (continues on error)

**Status:** ✅ Recommended for code quality

---

### 3. Flaky Test Detection (`flaky-tests.yml`)

**Triggers:**
- Scheduled: Daily at 2 AM UTC
- Pull requests to `main`, `master`, `develop` branches
- Manual trigger via workflow_dispatch

**Jobs:**
- **Detect Flaky Tests** - Runs tests 5 times in parallel
  - Matrix strategy runs tests simultaneously
  - Uploads test results as artifacts
  - Continues even if tests fail
  
- **Analyze Results** - Examines test consistency
  - Downloads all test results
  - Compares outcomes across runs
  - Reports flaky tests in summary
  
- **Quick Flaky Check** (PR only) - Fast flakiness check
  - Runs tests 3 times sequentially
  - Fails if any run fails
  - Provides quick feedback on PRs

**Status:** ℹ️ Informational - helps identify unreliable tests

---

## Workflow Configuration

### Required Secrets

Set these in **Settings → Secrets and variables → Actions**:

| Secret | Description | Required For |
|--------|-------------|--------------|
| `GEMINI_API_KEY` | Google Gemini AI API key | Tests, Build |
| `CODECOV_TOKEN` | Codecov upload token | Coverage reporting |
| `SONAR_TOKEN` | SonarCloud authentication | Code quality analysis |
| `GITHUB_TOKEN` | Auto-provided by GitHub | All workflows |

### Branch Protection Rules

Recommended settings for `main`/`master`:

```yaml
Required status checks:
  ✅ Test (Node.js 18.x)
  ✅ Test (Node.js 20.x)
  ✅ ESLint Check
  ✅ TypeScript Check
  ✅ Build
  
Optional checks:
  ℹ️ Prettier Check
  ℹ️ Quick Flaky Check
```

---

## Running Workflows Manually

### Via GitHub UI

1. Go to **Actions** tab
2. Select workflow from left sidebar
3. Click **Run workflow** button
4. Choose branch and click **Run workflow**

### Via GitHub CLI

```bash
# Run lint workflow
gh workflow run lint.yml

# Run flaky test detection
gh workflow run flaky-tests.yml

# Run CI/CD pipeline
gh workflow run ci.yml
```

---

## Workflow Files Location

```
.github/workflows/
├── ci.yml              # Main CI/CD pipeline
├── lint.yml            # Linting and formatting checks
└── flaky-tests.yml     # Flaky test detection
```

---

## Understanding Workflow Results

### CI/CD Pipeline

**Green ✅** - All checks passed
- Tests passed on both Node versions
- Linter found no issues
- Build succeeded
- Code coverage uploaded

**Red ❌** - One or more checks failed
- Check the specific job that failed
- Review error logs
- Fix issues and push again

### Lint Workflow

**Green ✅** - Code quality is good
- ESLint rules satisfied
- TypeScript types are correct
- Code formatting is consistent

**Yellow ⚠️** - Prettier check failed (non-blocking)
- Run `npx prettier --write .` to fix
- Commit formatted code

### Flaky Test Detection

**Consistent Results** - Tests are stable
- All 5 runs passed: ✅ Reliable tests
- All 5 runs failed: ❌ Broken tests (fix needed)

**Inconsistent Results** - Flaky tests detected
- Some runs passed, some failed: ⚠️ Investigate
- Check test logs for timing issues
- Look for race conditions or external dependencies

---

## Best Practices

### For Developers

1. **Run tests locally** before pushing
   ```bash
   npm test
   npm run lint
   ```

2. **Check workflow status** before merging
   - Wait for all required checks to pass
   - Review any warnings or failures

3. **Fix flaky tests** when detected
   - Add proper async/await handling
   - Mock external dependencies
   - Increase timeouts if needed

### For Maintainers

1. **Monitor workflow runs** regularly
   - Check Actions tab for failures
   - Review flaky test reports

2. **Update dependencies** in workflows
   - Keep action versions current
   - Use SHA hashes for security

3. **Adjust schedules** as needed
   - Modify cron schedules in workflow files
   - Balance between frequency and resource usage

---

## Troubleshooting

### Workflow Not Running

**Check:**
- Branch name matches trigger conditions
- Workflow file syntax is valid (YAML)
- Repository has Actions enabled

**Fix:**
```bash
# Validate YAML syntax
yamllint .github/workflows/*.yml

# Re-trigger workflow
git commit --allow-empty -m "Trigger workflow"
git push
```

### Tests Failing in CI but Passing Locally

**Common causes:**
- Environment variable differences
- Node.js version mismatch
- Dependency version differences

**Fix:**
```bash
# Use same Node version as CI
nvm use 20

# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Run tests
npm test
```

### Flaky Tests Detected

**Investigation steps:**
1. Review test logs from multiple runs
2. Look for timing-related issues
3. Check for shared state between tests
4. Verify mock implementations

**Common fixes:**
```typescript
// Add proper async handling
await waitFor(() => expect(element).toBeInTheDocument());

// Increase timeout for slow operations
jest.setTimeout(10000);

// Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
```

---

## Performance Optimization

### Caching

All workflows use npm caching:
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
```

### Parallel Execution

- Tests run on multiple Node versions simultaneously
- Lint checks run in parallel jobs
- Flaky test detection uses matrix strategy

### Artifact Management

- Test results retained for 7 days
- Coverage reports uploaded to Codecov
- Artifacts automatically cleaned up

---

## Security

### Action Pinning

All actions use full commit SHA hashes:
```yaml
uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
```

**Benefits:**
- Immutable references
- Protection against tag hijacking
- Clear audit trail

### Secret Management

- Secrets never logged or exposed
- Minimum required permissions
- Scoped to specific workflows

---

## Monitoring and Alerts

### GitHub Notifications

Configure in **Settings → Notifications**:
- Workflow failures
- Flaky test detections
- Security alerts

### Status Badges

Add to README.md:
```markdown
![CI/CD](https://github.com/KlausMikhaelson/hackthevalley-webapp/workflows/CI%2FCD%20Pipeline/badge.svg)
![Lint](https://github.com/KlausMikhaelson/hackthevalley-webapp/workflows/Lint/badge.svg)
```

---

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Jest Testing Documentation](https://jestjs.io/docs/getting-started)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [SonarCloud Documentation](https://docs.sonarcloud.io/)
