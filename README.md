# ChefStream

ChefStream is an AI-powered cooking companion that turns YouTube videos into interactive, step-by-step recipes.

## Tech Stack
- **Frontend**: Next.js, Tailwind CSS
- **Backend**: FastAPI, Python
- **Database**: PostgreSQL
- **AI**: LLM Integration for Recipe Extraction

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local dev without Docker)
- Python 3.10+ (for local dev without Docker)

### Running Locally
1. Clone the repo.
2. Run `docker-compose up --build`.
3. Open `http://localhost:3000`.

## Architecture
See `.agent/rules.md` and `implementation_plan.md` for architectural details.
