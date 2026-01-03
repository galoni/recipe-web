# ChefStream Gemini Workflows

**Build high-quality features faster with specification-driven development.**

This directory contains all the tools, templates, and workflows for developing ChefStream using the Specification-Driven Development (SDD) methodology optimized for Gemini AI.

## 🚀 Quick Start

### Create a New Feature

```bash
.gemini/scripts/bash/create-new-feature.sh "Add recipe search functionality"
```

Or use the workflow command:
```
/speckit-specify
```

### Full Development Cycle

1. **Constitution** - Establish project principles (one-time)
   ```
   /speckit-constitution
   ```

2. **Specify** - Define what you want to build
   ```
   /speckit-specify
   ```

3. **Plan** - Create technical implementation plan
   ```
   /speckit-plan
   ```

4. **Tasks** - Generate actionable task list
   ```
   /speckit-tasks
   ```

5. **Implement** - Execute the implementation
   ```
   /speckit-implement
   ```

6. **Push** - Run checks and push changes
   ```
   /safe-push
   ```

## 📁 Directory Structure

```
.gemini/
├── README.md                 # This file - getting started guide
├── constitution.md           # Project principles and governance
├── QUICK_REFERENCE.md        # Quick command reference
├── commands/                 # TOML configurations for workflows
│   ├── speckit.specify.toml
│   ├── speckit.plan.toml
│   ├── speckit.tasks.toml
│   └── ... (9 total)
├── templates/                # Markdown templates for features
│   ├── spec-template.md      # Feature specification template
│   ├── plan-template.md      # Implementation plan template
│   ├── tasks-template.md     # Task breakdown template
│   └── ... (5 total)
└── scripts/bash/             # Automation scripts
    ├── create-new-feature.sh # Create new feature branch
    ├── setup-plan.sh         # Initialize implementation plan
    └── common.sh             # Shared utilities
```

## 🎯 Core Philosophy

ChefStream follows **Specification-Driven Development (SDD)**:

- **Intent-driven**: Specifications define the "what" and "why" before the "how"
- **Constitution-first**: All development follows project principles
- **Multi-step refinement**: Iterative specification → plan → tasks → implementation
- **AI-powered**: Leverages Gemini AI for specification interpretation and code generation

## 📚 Key Documents

| Document | Purpose | When to Read |
|----------|---------|--------------|
| `constitution.md` | Project principles and rules | Before starting any work |
| `QUICK_REFERENCE.md` | Command reference | Daily development |
| `templates/spec-template.md` | Feature specification format | Creating new features |
| `templates/plan-template.md` | Implementation plan format | Planning features |
| `templates/tasks-template.md` | Task breakdown format | Breaking down work |

## 🔄 Workflow Commands

Available in `.agent/workflows/`:

| Command | Purpose | Input Required |
|---------|---------|----------------|
| `/speckit-constitution` | Create/update project principles | Core principles description |
| `/speckit-specify` | Create feature specification | Feature description (what & why) |
| `/speckit-plan` | Create implementation plan | Tech stack & architecture |
| `/speckit-tasks` | Generate task breakdown | None (reads plan.md) |
| `/speckit-implement` | Execute implementation | None (reads tasks.md) |
| `/safe-push` | Run checks and push | None |

## 💡 Best Practices

### Before Starting Work
1. Read `.gemini/constitution.md` to understand project principles
2. Ensure you're on the correct feature branch
3. Review existing specs in `specs/` for examples

### During Development
1. **Be explicit** about requirements in specifications
2. **Separate concerns**: Spec (what/why) → Plan (how) → Tasks (steps)
3. **Test first**: Follow the >80% coverage requirement
4. **Keep it simple**: Avoid over-engineering

### Before Committing
1. Run tests: `cd backend && poetry run pytest`
2. Check coverage: `poetry run pytest --cov`
3. Lint: `poetry run ruff check .`
4. Format: `poetry run ruff format .`
5. Use `/safe-push` to automate this

## 🎨 Feature Naming Convention

Features follow the pattern: `###-short-name`

Examples:
- `001-gemini-extractor`
- `002-authentication`
- `003-cookbook`
- `004-recipe-search`

The script auto-generates meaningful names from descriptions.

## 📖 Example Flow

### Creating a Recipe Search Feature

```bash
# 1. Create feature specification
/speckit-specify Users should be able to search recipes by ingredients, cuisine type, and cooking time. Search results should show recipe thumbnails, ratings, and preparation time. Users can filter results and save favorites.

# This creates:
# - Branch: 004-recipe-search
# - File: specs/004-recipe-search/spec.md

# 2. Create implementation plan
/speckit-plan Use FastAPI for backend search API with PostgreSQL full-text search. Frontend uses Next.js with React Query for caching. Implement debounced search input and infinite scroll for results.

# This creates:
# - specs/004-recipe-search/plan.md
# - specs/004-recipe-search/data-model.md
# - specs/004-recipe-search/contracts/
# - specs/004-recipe-search/research.md

# 3. Generate tasks
/speckit-tasks

# This creates:
# - specs/004-recipe-search/tasks.md

# 4. Implement
/speckit-implement

# 5. Test and push
/safe-push
```

## 🔧 Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `SPECIFY_FEATURE` | Override feature detection | `004-recipe-search` |
| `REPO_ROOT` | Repository root path | `/path/to/recipe-web` |

## ✅ Quality Checklist

From `constitution.md` - Non-negotiable requirements:

- [ ] **>80% test coverage** - All backend services
- [ ] **Gemini-first AI** - Use Google Gemini models
- [ ] **Docker as truth** - Keep Dockerfiles updated
- [ ] **Security first** - OWASP compliance
- [ ] **Structured logging** - JSON format
- [ ] **Living documentation** - Update docs with code
- [ ] **50/300 line limits** - Functions/files
- [ ] **Premium UX** - Wow factor required

## 🚨 Common Issues

### "Template not found"
```bash
ls .gemini/templates/  # Verify templates exist
```

### "Cannot find feature directory"
```bash
export SPECIFY_FEATURE="004-recipe-search"
```

### "Branch already exists"
```bash
.gemini/scripts/bash/create-new-feature.sh "Feature" --number 5
```

## 📞 Getting Help

1. **Quick Reference**: See `QUICK_REFERENCE.md`
2. **Constitution**: Read `constitution.md` for principles
3. **Examples**: Check existing specs in `specs/`
4. **Workflows**: Review `.agent/workflows/` for command details

## 🌟 Why Specification-Driven Development?

Traditional development treats code as king and specs as scaffolding. SDD inverts this:

- **Specifications are executable** - They generate code, not just guide it
- **Intent drives implementation** - Focus on what and why, not how
- **AI amplifies productivity** - Gemini handles mechanical translation
- **Quality is built-in** - Tests, docs, and architecture from specs

This methodology is especially powerful for:
- **0-to-1 development** - Building new features from scratch
- **Creative exploration** - Trying different implementations
- **Iterative enhancement** - Adding to existing systems

---

**Version**: 2.0.0 | **Created**: 2026-01-03 | **Optimized for**: Gemini AI
