# CI/CD Pipeline Documentation

This document describes the CI/CD pipeline setup for the KudosCraft application.

## Overview

The CI/CD pipeline consists of multiple workflows that ensure code quality, security, and reliable deployments:

1. **CI/CD Pipeline** (`ci.yml`) - Main pipeline for testing and building
2. **Deploy** (`deploy.yml`) - Automated deployment after successful CI
3. **Security** (`security.yml`) - Security scanning and code quality analysis
4. **Dependencies** (`dependencies.yml`) - Automated dependency updates

## Local Development Hooks

### Pre-commit Hook

Runs before each commit to ensure code quality:

- ✅ Linting (ESLint for JS/TS, built-in for C#)
- ✅ Code formatting (Prettier)
- ✅ Type checking (TypeScript)
- ✅ Build verification
- ✅ Unit tests

### Pre-push Hook

Runs before pushing to remote repository:

- 🛡️ Prevents direct pushes to main branch
- 🔒 Security audit (npm audit)
- 🔍 Sensitive file detection
- 📝 TODO/FIXME detection with confirmation

## CI/CD Workflows

### 1. Main CI Pipeline (`ci.yml`)

Triggered on: Push to main/develop, Pull requests

**Backend Jobs:**

- Install dependencies
- Generate Prisma client and run migrations
- Lint and format check
- Run unit and e2e tests
- Build application
- Upload coverage reports

**Frontend Jobs:**

- Install dependencies
- Lint and format check
- TypeScript type checking
- Build application
- Run UI tests (if configured)

**Desktop Jobs:**

- Restore .NET dependencies
- Build application
- Run tests

**Security & Quality:**

- npm security audit
- Secret detection with TruffleHog
- Docker build tests
- Commit message linting

### 2. Deployment Pipeline (`deploy.yml`)

Triggered on: Successful CI completion on main branch

**Features:**

- Automated backend deployment (Heroku/Railway example)
- Frontend deployment (Vercel example)
- Desktop app releases on git tags
- Environment-specific deployments

### 3. Security Pipeline (`security.yml`)

Triggered on: Push, PR, and daily schedule

**Features:**

- CodeQL security analysis
- SonarCloud code quality analysis
- Snyk vulnerability scanning
- Dependency review for PRs
- License compliance checking

### 4. Dependency Updates (`dependencies.yml`)

Triggered on: Weekly schedule and manual dispatch

**Features:**

- Automated npm package updates
- .NET package updates
- Security vulnerability fixes
- Automated PR creation

## Setup Instructions

### 1. Repository Secrets

Add the following secrets to your GitHub repository:

```bash
# Deployment
HEROKU_API_KEY=your_heroku_api_key
VERCEL_TOKEN=your_vercel_token
ORG_ID=your_vercel_org_id
PROJECT_ID=your_vercel_project_id

# Security Scanning
SONAR_TOKEN=your_sonarcloud_token
SNYK_TOKEN=your_snyk_token

# General
GITHUB_TOKEN=automatically_provided
```

### 2. Local Development Setup

1. Install Husky for git hooks:

```bash
# In backend directory
npm install husky --save-dev
npx husky install

# In frontend directory
npm install husky --save-dev
npx husky install
```

2. Make hooks executable (Linux/macOS):

```bash
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

### 3. SonarCloud Setup

1. Visit [SonarCloud.io](https://sonarcloud.io)
2. Import your repository
3. Get your project key and organization
4. Update `sonar-project.properties` with your details
5. Add `SONAR_TOKEN` to repository secrets

### 4. Deployment Configuration

Update the deployment jobs in `deploy.yml` with your specific deployment targets:

- **Heroku**: Update app names and configuration
- **Vercel**: Update organization and project IDs
- **Railway**: Uncomment and configure Railway deployment
- **Custom**: Add your own deployment steps

## Branch Protection Rules

Recommended branch protection rules for `main` branch:

1. ✅ Require status checks to pass before merging
2. ✅ Require branches to be up to date before merging
3. ✅ Require review from code owners
4. ✅ Dismiss stale reviews when new commits are pushed
5. ✅ Restrict pushes that create files larger than 100MB
6. ✅ Require signed commits (optional)

Required status checks:

- `Backend CI`
- `Frontend CI`
- `Desktop CI`
- `Security & Quality`
- `Docker Build Test`

## Monitoring and Notifications

### Slack Integration (Optional)

Add Slack notifications for deployment status:

```yaml
- name: Notify Slack on Success
  if: success()
  uses: 8398a7/action-slack@v3
  with:
    status: success
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}

- name: Notify Slack on Failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: failure
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Email Notifications

GitHub automatically sends email notifications for workflow failures to repository owners.

## Troubleshooting

### Common Issues

1. **Pre-commit hook fails on Windows**

   - Ensure Git Bash or WSL is properly configured
   - Check file permissions and line endings

2. **Build fails due to environment variables**

   - Verify all required secrets are set
   - Check environment variable names match between local and CI

3. **Tests fail in CI but pass locally**

   - Check for differences in Node.js versions
   - Verify database connection strings
   - Ensure test isolation

4. **Security scans fail**
   - Review and update vulnerable dependencies
   - Add exceptions for false positives
   - Check license compatibility

### Getting Help

- Check GitHub Actions logs for detailed error messages
- Review workflow files for configuration issues
- Consult service documentation (Heroku, Vercel, etc.)
- Check repository secrets and permissions

## Continuous Improvement

Regular maintenance tasks:

- Review and update dependency versions
- Monitor security scan results
- Optimize build times
- Update deployment configurations
- Review and update branch protection rules
