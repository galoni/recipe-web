# Implementation Plan: Gemini AI Extractor

**Branch**: `001-gemini-extractor` | **Date**: 2026-01-01 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-gemini-extractor/spec.md`

## Summary

Build a backend service `AI Extractor` in FastAPI that accepts a YouTube URL, fetches the transcript via `yt-dlp`, and uses Google Gemini 1.5 Flash to extract a structured recipe (Pydantic). Results are cached in PostgreSQL for 30 days.

## Technical Context

**Language/Version**: Python 3.11 (FastAPI)
**Primary Dependencies**:
- `fastapi` (Web Framework)
- `yt-dlp` (Transcript Fetching)
- `google-generativeai` (Gemini SDK)
- `sqlalchemy` + `asyncpg` (Database)
- `pydantic` (Data Validation)
**Storage**: PostgreSQL (`recipes`, `extraction_cache` tables)
**Testing**: `pytest` with `vcrpy` or custom caching for regression.
**Target Platform**: Dockerized Linux Service
**Project Type**: Backend Service
**Performance Goals**: <15s end-to-end latency for <20m videos.
**Constraints**: No video/audio downloading (transcript only). Strict JSON output.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Gemini-First Strategy**: Uses `google-generativeai` and Gemini 1.5 Flash.
- [x] **Modularity Limits**: Service will be split into `fetcher.py`, `extractor.py`, `models.py` to keep files <300 lines.
- [x] **Test Coverage**: Plan includes unit tests for each module + regression suite.
- [x] **AI Regression**: "Golden Set" caching strategy defined in Spec User Story 2.
- [x] **Fullstack Integrity**: Backend-only feature exposed via REST API.
- [x] **UX Wow Factor**: N/A (Backend feature, but enables fast UI via caching).
- [x] **Scalability**: Stateless service, cache-backed, Docker-ready.

## Project Structure

### Documentation

```text
specs/001-gemini-extractor/
├── plan.md              # This file
├── research.md          # Technical decisions (Gemini, yt-dlp)
├── data-model.md        # DB Schema (Recipe, Cache)
├── contracts/           # OpenAPI Spec
└── tasks.md             # Implementation Tasks
```

### Source Code

```text
backend/app/
├── api/
│   └── v1/
│       └── extract.py   # Endpoint: POST /extract
├── services/
│   ├── youtube.py       # Wrapper for yt-dlp (fetch_transcript)
│   └── gemini.py        # Wrapper for Google Gemini (extract_recipe)
├── models/
│   ├── recipe.py        # Pydantic models (Input/Output)
│   └── db.py            # SQLAlchemy models (Cache)
├── core/
│   └── config.py        # Env vars (GEMINI_API_KEY)
└── tests/
    ├── unit/            # Logic tests
    └── regression/      # Cached AI responses
```

**Structure Decision**: Standard FastAPI service layer pattern. Separating `youtube` and `gemini` services ensures modularity (<300 lines).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Caching | Performance & Cost | Calling API every time is too slow and expensive given strict latency goals |
