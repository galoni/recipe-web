# 🍳 ChefStream

**ChefStream** is a premium, AI-powered cooking companion that transforms YouTube videos into interactive, high-fidelity recipes. Powered by **Gemini 2.0**, it extracts ingredients, timing, and steps directly from video transcripts to provide a focused, ad-free cooking experience.

---

## ✨ Features

- 🪄 **Instant Extraction**: Convert any YouTube URL into a structured recipe in seconds.
- 🔍 **Search & Explore**: Discover recipes from the community or find your own in the vault.
- 📦 **The Vault**: Save and organize your personal high-fidelity cookbook.
- 🍱 **Global Sharing**: Recipes are public by default, while your collection remains private.
- 📱 **Cooking Mode**: A focused, distraction-free UI designed for the kitchen.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: Tailwind CSS + Framer Motion for rich animations.
- **State Management**: React Query (TanStack Query) for efficient caching.
- **Icons**: Lucide React.

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11+)
- **LLM**: Google Gemini 1.5 Flash (via `google-generativeai`).
- **Extraction**: `yt-dlp` for robust transcript retrieval.
- **Database**: PostgreSQL with SQLAlchemy (Async).
- **Migrations**: Alembic.

---

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- Python 3.11+
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/))

### Local Development (Docker)
The easiest way to get started is using Docker Compose:

```bash
docker-compose up --build
```
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs

### Local Development (Manual)

#### 1. Backend Setup
```bash
cd backend
cp .env.example .env  # Add your GEMINI_API_KEY
pip install poetry
poetry install
poetry run uvicorn app.main:app --reload
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Testing & QA

We maintain a high bar for code quality with automated CI pipelines.

### Backend Tests
```bash
cd backend
poetry run pytest --cov=app --cov-fail-under=75
```
Includes:
- **Unit Tests**: Business logic isolation.
- **Contract Tests**: API schema validation.
- **Regression Tests**: Quality checks against "Golden Samples" (located in `backend/tests/regression/data`).

### Frontend Quality
```bash
cd frontend
npm run lint      # High-strictness ESLint
npx tsc --noEmit  # Type checking
```

---

## 📖 Documentation
Detailed specifications and research for major features can be found in the `specs/` directory:
- [001-Gemini Extractor](./specs/001-gemini-extractor/spec.md): The core AI engine.

---

## 🤝 Contributing
Please see [DEVELOPMENT.md](./DEVELOPMENT.md) for our coding standards and CI/CD guidelines.
