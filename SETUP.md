# Setup Guide

## Quick Start

Follow these steps to get the HTV WebApp running on your local machine.

### 1. Prerequisites

Ensure you have the following installed:
- **Node.js** 18.x or 20.x ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

### 2. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd htv-webapp

# Install dependencies
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp env.example .env

# Edit .env and add your API key
# GEMINI_API_KEY=your_actual_api_key_here
```

#### Getting a Gemini API Key

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key
5. Copy the key to your `.env` file

### 4. Initialize Git Hooks

```bash
npm run prepare
```

This installs Husky git hooks for code quality checks.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Verify Installation

Run the tests to ensure everything is working:

```bash
npm test
```

You should see all tests passing with ~96% coverage.

## Next Steps

### Test the API

Use the provided PowerShell script to test all endpoints:

```powershell
# Make sure dev server is running
npm run dev

# In another terminal
.\test-api.ps1
```

### Explore the Documentation

- **[API Documentation](docs/API.md)** - Learn about available endpoints
- **[Testing Guide](docs/TESTING.md)** - How to write and run tests
- **[Migration Guide](docs/MIGRATION.md)** - Migration from Express to Next.js

### Start Building

1. Edit `app/page.tsx` to customize the home page
2. Add new API routes in `app/api/`
3. Create utility functions in `lib/`
4. Write tests in `__tests__/`

## Common Setup Issues

### Issue: "Module not found" errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "GEMINI_API_KEY is not defined"

**Solution:**
1. Ensure `.env` file exists in root directory
2. Check that `GEMINI_API_KEY` is set correctly
3. Restart the development server

### Issue: Tests fail on Windows

**Solution:**
Ensure you're using a Unix-like shell (Git Bash, WSL, or PowerShell with Unix tools).

### Issue: Husky hooks not working

**Solution:**
```bash
# Reinstall Husky
npm run prepare

# On Unix/Mac, ensure hooks are executable
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Kill the process using port 3000
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:3000 | xargs kill
```

Or run on a different port:
```bash
PORT=3001 npm run dev
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

Edit files, add features, fix bugs.

### 3. Run Tests

```bash
# Run tests in watch mode during development
npm run test:watch

# Run all tests before committing
npm test
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add your feature"
# 🔍 Running linter... (pre-commit hook)
# ✓ Lint passed!
```

### 5. Push Changes

```bash
git push origin feature/your-feature-name
# 🧪 Running full test suite before push... (pre-push hook)
# ✓ All tests passed!
```

### 6. Create Pull Request

Open a pull request on GitHub for review.

## Production Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

3. **Add Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add: `GEMINI_API_KEY` = `your_api_key`

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at `https://your-app.vercel.app`

### Deploy to Other Platforms

#### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

#### Self-Hosted
```bash
# Build the app
npm run build

# Start production server
npm start
```

## Team Setup

When a team member clones the repository:

```bash
# Clone
git clone <repo-url>
cd htv-webapp

# Install (automatically runs prepare script)
npm install

# Create .env file
cp env.example .env
# Edit .env with their API key

# Start developing
npm run dev
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini AI API key |
| `GOOGLE_CLOUD_PROJECT_ID` | No | Google Cloud project ID (for storage features) |
| `NODE_ENV` | No | Environment (development/production) |

## Scripts Reference

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `npm run dev` | Start dev server | During development |
| `npm run build` | Build for production | Before deployment |
| `npm start` | Start production server | After building |
| `npm test` | Run all tests with coverage | Before committing |
| `npm run test:watch` | Run tests in watch mode | During development |
| `npm run test:quick` | Quick tests without coverage | Fast feedback |
| `npm run lint` | Run linter | Check code quality |
| `npm run prepare` | Install git hooks | After cloning |

## Project Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `next.config.ts` | Next.js configuration |
| `tailwind.config.ts` | Tailwind CSS configuration |
| `.eslintrc.json` | ESLint configuration |
| `jest.config.js` | Jest configuration (in package.json) |
| `.env` | Environment variables (not committed) |
| `env.example` | Environment variables template |

## Getting Help

- **Documentation**: Check the `docs/` directory
- **Examples**: Review test files in `__tests__/`
- **Issues**: Open an issue on GitHub
- **Logs**: Check console output and error messages

## Useful Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Clear Next.js cache
rm -rf .next

# View test coverage in browser
npm test
# Then open: coverage/lcov-report/index.html

# Run specific test file
npx jest __tests__/api/roast.test.ts

# Debug tests
node --inspect-brk node_modules/.bin/jest --runInBand

# Format code (if Prettier is installed)
npx prettier --write .

# Check for outdated packages
npm outdated

# Update packages
npm update
```

## Success Checklist

After setup, verify:

- ✅ Development server runs (`npm run dev`)
- ✅ All tests pass (`npm test`)
- ✅ API endpoints respond (use `test-api.ps1`)
- ✅ Git hooks work (try committing)
- ✅ Environment variables loaded
- ✅ TypeScript compiles without errors
- ✅ Linter passes (`npm run lint`)

## What's Next?

1. **Customize the UI** - Edit `app/page.tsx`
2. **Add Features** - Create new API routes
3. **Write Tests** - Add tests for new features
4. **Deploy** - Push to production
5. **Monitor** - Set up error tracking and analytics

Happy coding! 🚀
