# Contributing to Bigenda Bite

Thank you for your interest in contributing to Bigenda Bite! This document provides guidelines and instructions for contributing.

## How to Contribute

### Reporting Bugs

- Use the GitHub issue tracker
- Describe the bug clearly with steps to reproduce
- Include screenshots if applicable
- Specify your browser, OS, and Node.js version

### Requesting Features

- Use the GitHub issue tracker
- Describe the feature and its use case
- Explain why it would benefit the project
- Be specific about expected behavior

### Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local`
4. Fill in required environment variables
5. Start the dev server: `npm run dev`

### Code Style

- **Language**: TypeScript (strict mode)
- **Framework**: Next.js 15 App Router
- **Styling**: Tailwind CSS 3 with custom design system
- **Formatting**: Follow existing code patterns
- **Components**: Server components by default, `'use client'` only when needed
- **Imports**: Group imports (React, Next.js, third-party, local)
- **Naming**: camelCase for variables/functions, PascalCase for components

### Commit Conventions

Use clear, descriptive commit messages:

```
feat: add admin user management page
fix: resolve slug fallback for guides without slugs
docs: update API reference with new endpoints
style: improve button hover states
refactor: extract city selector to client component
test: add unit tests for analytics tracking
```

### Pull Request Process

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes and test them
3. Run the build: `npm run build`
4. Commit with a clear message
5. Push to your fork
6. Open a Pull Request against `main`
7. Wait for review and address any feedback

### Code Review

- All PRs require at least one approval
- Address all review comments before merging
- Keep PRs focused and reasonably sized
- Update documentation if needed

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for system design and [docs/API.md](docs/API.md) for API reference.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment instructions.

## Questions?

Feel free to open an issue for any questions about contributing.
