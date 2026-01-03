# Branch-Per-Feature Workflow & CI Requirements

## 🎯 Overview

ChefStream enforces a **branch-per-feature workflow** where every feature is developed in isolation and must pass CI checks before merging to main.

## 📋 The Workflow

### 1. Create Feature Branch (REQUIRED)

**Always use the script:**
```bash
.gemini/scripts/bash/create-new-feature.sh "Your feature description"
```

**What it does:**
- Auto-generates next feature number (e.g., 004, 005, 006)
- Creates branch with pattern: `###-feature-name`
- Creates spec directory: `specs/###-feature-name/`
- Copies spec template

**Examples:**
```bash
# Auto-numbered branch
.gemini/scripts/bash/create-new-feature.sh "Add recipe search"
# Creates: 004-recipe-search

# Custom short name
.gemini/scripts/bash/create-new-feature.sh "Add user profiles" --short-name "user-profiles"
# Creates: 005-user-profiles

# Specific number
.gemini/scripts/bash/create-new-feature.sh "Add ratings" --number 10
# Creates: 010-ratings
```

### 2. Develop on Feature Branch

**Never commit directly to main!**

```bash
# Check you're on a feature branch
git branch --show-current
# Should show: ###-feature-name

# If on main, create a feature branch first
.gemini/scripts/bash/create-new-feature.sh "Your feature"
```

### 3. CI Checks (MUST PASS)

Before merging, your branch must pass all CI checks:

#### Backend Checks
- ✅ **Linting**: `poetry run ruff check .`
- ✅ **Formatting**: `poetry run ruff format --check .`
- ✅ **Tests**: `poetry run pytest -v`
- ✅ **Coverage**: Must be ≥80% (`--cov-fail-under=80`)

#### Frontend Checks
- ✅ **Linting**: `npm run lint`
- ✅ **Type Check**: `npx tsc --noEmit`
- ✅ **Build**: `npm run build`

### 4. Create Pull Request

```bash
# Push your branch
git push origin ###-feature-name

# Create PR (if you have GitHub CLI)
gh pr create --base main --head ###-feature-name \
  --title "feat: add feature name" \
  --body "$(cat specs/###-feature-name/spec.md)"
```

### 5. Merge After CI Passes

- ✅ All CI checks green
- ✅ Code review approved
- ✅ Merge to main
- ✅ Delete feature branch

## 🚨 CI Configuration

### Current CI Setup (`.github/workflows/ci.yml`)

```yaml
name: ChefStream CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  backend-qa:
    - Lint with Ruff
    - Format Check with Ruff
    - Test with Pytest & Coverage (80% Required)
  
  frontend-qa:
    - Lint
    - Type Check
    - Build Check
```

### Coverage Requirement

**Constitution requires 80% coverage:**
```bash
poetry run pytest --cov=app --cov-fail-under=80
```

**CI enforces this:**
```yaml
- name: Test with Pytest & Coverage (80% Required)
  run: |
    poetry run pytest -v --tb=short --cov=app --cov-report=term-missing --cov-fail-under=80
```

## ✅ Pre-Merge Checklist

Before creating a PR, verify locally:

```bash
# Backend checks
cd backend
poetry run ruff check .              # Linting
poetry run ruff format --check .     # Formatting
poetry run pytest --cov=app --cov-fail-under=80  # Tests + Coverage

# Frontend checks
cd ../frontend
npm run lint                         # Linting
npx tsc --noEmit                     # Type checking
npm run build                        # Build

# Or use the safe-push workflow
/safe-push
```

## 🔧 Fixing CI Failures

### Coverage Below 80%

```bash
# Check current coverage
poetry run pytest --cov=app --cov-report=html
open htmlcov/index.html

# Find uncovered lines
poetry run pytest --cov=app --cov-report=term-missing

# Add tests for uncovered code
# Then verify
poetry run pytest --cov=app --cov-fail-under=80
```

### Linting Errors

```bash
# Check what's wrong
poetry run ruff check .

# Auto-fix what's possible
poetry run ruff check --fix .

# Format code
poetry run ruff format .
```

### Type Errors (Frontend)

```bash
# Check types
npx tsc --noEmit

# Fix type errors in the reported files
```

### Build Failures (Frontend)

```bash
# Try building locally
npm run build

# Check for:
# - Missing dependencies
# - Type errors
# - Import errors
# - Environment variables
```

## 📊 Branch Naming Convention

### Pattern: `###-short-descriptive-name`

**Good Examples:**
```
001-gemini-extractor
002-authentication
003-cookbook
004-recipe-search
005-user-profiles
006-rating-system
```

**Bad Examples:**
```
❌ feature/search          # No number
❌ 4-search               # Number not zero-padded
❌ search-feature         # No number at all
❌ main-updates           # Not a feature branch
```

### Why This Pattern?

1. **Sequential**: Easy to track feature order
2. **Descriptive**: Clear what the feature does
3. **Sortable**: Branches sort naturally by number
4. **Spec-aligned**: Matches `specs/###-feature/` directory

## 🚀 Complete Example

### Scenario: Adding Recipe Ratings

```bash
# 1. Create feature branch
.gemini/scripts/bash/create-new-feature.sh "Recipe rating system"
# Output: Created branch 006-recipe-rating-system

# 2. Develop the feature
/speckit-specify
/speckit-plan
/speckit-tasks
/speckit-implement

# 3. Run local checks
cd backend
poetry run ruff check .
poetry run ruff format --check .
poetry run pytest --cov=app --cov-fail-under=80
# All pass ✅

cd ../frontend
npm run lint
npx tsc --noEmit
npm run build
# All pass ✅

# 4. Commit and push
git add .
git commit -m "feat: add recipe rating system"
git push origin 006-recipe-rating-system

# 5. Create PR
gh pr create --base main --head 006-recipe-rating-system \
  --title "feat: add recipe rating system" \
  --body "$(cat specs/006-recipe-rating-system/spec.md)"

# 6. Wait for CI to pass
# GitHub Actions runs all checks
# ✅ Backend QA: Passed
# ✅ Frontend QA: Passed

# 7. Merge PR
# After code review approval

# 8. Delete branch
git checkout main
git pull
git branch -d 006-recipe-rating-system
```

## 💡 Best Practices

### DO:
✅ Always create a feature branch before starting work
✅ Use the create-new-feature script
✅ Run CI checks locally before pushing
✅ Keep branches focused on one feature
✅ Delete branches after merging
✅ Use `/safe-push` workflow to automate checks

### DON'T:
❌ Commit directly to main
❌ Create branches manually (use the script)
❌ Push without running tests locally
❌ Mix multiple features in one branch
❌ Leave stale branches around
❌ Ignore CI failures

## 🔍 Troubleshooting

### "Not on a feature branch"

```bash
# Check current branch
git branch --show-current

# If on main, create feature branch
.gemini/scripts/bash/create-new-feature.sh "Your feature"
```

### "CI failing but passes locally"

```bash
# Ensure you're using the same versions
poetry --version  # Should match CI
python --version  # Should be 3.13

# Clear cache and retry
poetry cache clear . --all
poetry install --no-root
poetry run pytest --cov=app --cov-fail-under=80
```

### "Coverage dropped below 80%"

```bash
# Check what's not covered
poetry run pytest --cov=app --cov-report=term-missing

# Add tests for uncovered lines
# Focus on:
# - New functions
# - Edge cases
# - Error handling
```

## 📚 Related Documents

- **Constitution**: `.gemini/constitution.md` (Principle XII)
- **Quick Reference**: `.gemini/QUICK_REFERENCE.md`
- **CI Config**: `.github/workflows/ci.yml`
- **Safe Push Workflow**: `.agent/workflows/safe-push.md`

---

**Remember: No feature goes to main without passing CI! 🚦**
