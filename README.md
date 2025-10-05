# HTV WebApp - AI-Powered Budget Management

An AI-powered Next.js application that helps users make responsible purchasing decisions by analyzing their shopping cart against their budget and financial goals using Google Gemini AI.

## Features

- 🤖 **AI-Powered Roasting** - Get intelligent feedback on purchase decisions
- 📊 **Smart Categorization** - Automatically categorize purchases into spending categories
- ☁️ **Google Cloud Integration** - Cloud Storage authentication and management
- ✅ **Comprehensive Testing** - 96%+ test coverage with Jest
- 🔄 **CI/CD Pipeline** - Automated testing and deployment with GitHub Actions
- 🎣 **Git Hooks** - Pre-commit and pre-push validation with Husky

## API Endpoints

- `POST /api/roast` - Analyze purchases against budget and goals
- `POST /api/categorize` - Categorize items into spending categories
- `GET /api/storage/buckets` - Test Google Cloud Storage authentication

## Getting Started

### Prerequisites

- Node.js 18.x or 20.x
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd htv-webapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Initialize Husky (Git hooks)**
   ```bash
   npm run prepare
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Testing

### Run all tests with coverage
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run quick tests (no coverage)
```bash
npm run test:quick
```

### Test API endpoints
```bash
# Make sure dev server is running first
npm run dev

# In another terminal
.\test-api.ps1
```

## Project Structure

```
htv-webapp/
├── app/
│   ├── api/                    # Next.js API routes
│   │   ├── roast/             # POST /api/roast
│   │   ├── categorize/        # POST /api/categorize
│   │   └── storage/           # GET /api/storage/buckets
│   ├── page.tsx               # Home page
│   └── layout.tsx             # Root layout
├── lib/
│   └── roasting.ts            # AI utility functions
├── __tests__/
│   ├── api/                   # API route tests
│   └── lib/                   # Utility function tests
├── docs/
│   ├── API.md                 # API documentation
│   ├── TESTING.md             # Testing guide
│   └── MIGRATION.md           # Migration guide
├── .github/
│   └── workflows/
│       └── ci.yml             # CI/CD pipeline
├── .husky/                    # Git hooks
│   ├── pre-commit            # Runs linter
│   └── pre-push              # Runs tests
└── package.json
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run tests with coverage |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:quick` | Run quick tests without coverage |
| `npm run lint` | Run Next.js linter |
| `npm run prepare` | Install Husky git hooks |

## Git Hooks

### Pre-Commit Hook
Runs linter before each commit (fast):
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

## CI/CD

GitHub Actions workflow runs on every push and pull request:
- ✅ Tests on Node.js 18.x and 20.x
- ✅ Code coverage reports
- ✅ Linting validation
- ✅ Next.js build verification

### Setting up GitHub Actions

1. Push code to GitHub
2. Add `GEMINI_API_KEY` to repository secrets:
   - Go to Settings → Secrets and variables → Actions
   - Add new secret: `GEMINI_API_KEY`

## Documentation

- **[API Documentation](docs/API.md)** - Complete API reference
- **[Testing Guide](docs/TESTING.md)** - How to write and run tests
- **[Migration Guide](docs/MIGRATION.md)** - Express to Next.js migration details

## Technologies

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Google Gemini AI](https://ai.google.dev/)** - AI-powered content generation
- **[Google Cloud Storage](https://cloud.google.com/storage)** - Cloud storage integration
- **[Jest](https://jestjs.io/)** - Testing framework
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS

## API Usage Examples

### Roast Endpoint
```typescript
const response = await fetch('/api/roast', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: { "iPhone 15": "$999.99" },
    amount: "$1000",
    goals: { "savings": ["5000", "12312025"] }
  })
});

const data = await response.json();
console.log(data.result); // AI feedback
```

### Categorize Endpoint
```typescript
const response = await fetch('/api/categorize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: { 
      "Nike Shoes": "$120",
      "Pizza": "$15"
    }
  })
});

const data = await response.json();
console.log(data.categories); // { fashion: [...], food: [...] }
```

## Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/htv-webapp)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variable: `GEMINI_API_KEY`
4. Deploy!

### Other Platforms

- **Netlify** - Supports Next.js
- **AWS Amplify** - Full-stack deployment
- **Self-hosted** - Use `npm run build && npm start`

## Troubleshooting

For detailed troubleshooting, see **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)**.

### Quick Fixes

**Tests fail:**
```bash
npm install
npm test
```

**API routes not found:**
```bash
npm run dev  # Restart the development server
```

**Environment variables not loaded:**
Ensure `.env` file exists in root directory with `GEMINI_API_KEY`

**Husky hooks not running:**
```bash
npm run prepare
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues or questions:
- Check the [documentation](docs/)
- Review [test files](__tests__/) for usage examples
- Open an issue on GitHub

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Google Gemini AI](https://ai.google.dev/)
- Inspired by responsible spending habits
