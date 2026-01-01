---
description: "Task list for Gemini AI Extractor implementation"
---

# Tasks: Gemini AI Extractor

**Input**: Design documents from `/specs/001-gemini-extractor/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/api-spec.json

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Install dependencies (`fastapi`, `uvicorn`, `yt-dlp`, `google-generativeai`, `sqlalchemy`, `asyncpg`, `pydantic-settings`)
- [x] T002 [P] Configure environment variables `backend/app/core/config.py` (Include `GEMINI_API_KEY`, `POSTGRES_URL`)
- [x] T003 [P] Create database connection module `backend/app/core/db.py`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T004 Create SQLAlchemy models in `backend/app/models/db.py` (`Recipe`, `ExtractionCache`)
- [x] T005 [P] Create Pydantic models in `backend/app/models/recipe.py` (`RecipeData`, `Ingredient`, `InstructionStep`)
- [x] T006 Setup Alembic migrations and create initial migration for recipe tables
- [x] T007 Configure custom error handlers for `NoTranscriptError` in `backend/app/main.py`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Extract Recipe from YouTube URL (Priority: P1) 🎯 MVP

**Goal**: Core extraction functionality via YouTube URL -> JSON

**Tests for User Story 1**

- [x] T008 [P] [US1] Unit test for YouTube fetcher (mocking yt-dlp) in `backend/tests/unit/services/test_youtube.py`
- [x] T009 [P] [US1] Unit test for Gemini extractor (mocking API) in `backend/tests/unit/services/test_gemini.py`
- [x] T010 [P] [US1] Contract test for `/api/v1/extract` endpoint in `backend/tests/contract/test_extract_api.py`

**Implementation for User Story 1**

- [x] T011 [US1] Implement `YouTubeService` in `backend/app/services/youtube.py` (fetch_transcript logic)
- [x] T012 [US1] Implement `GeminiService` in `backend/app/services/gemini.py` (prompt engineering, rigid output parsing)
- [x] T013 [US1] Implement `CacheService` in `backend/app/services/cache.py` (check DB before external calls)
- [x] T014 [US1] Create API Endpoint `POST /extract` in `backend/app/api/v1/extract.py` integrating services
- [x] T015 [US1] Wire up endpoint in `backend/app/main.py`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Regression Testing with Cached Samples (Priority: P2)

**Goal**: Ensure quality stability using "golden" samples

**Tests for User Story 2**

- [x] T016 [P] [US2] Create regression test suite structure in `backend/tests/regression/conftest.py`
- [x] T017 [US2] Create "Golden Set" data fixtures in `backend/tests/regression/data/` (cached transcripts + expected JSON)
- [x] T018 [US2] Implement regression test runner `backend/tests/regression/test_quality.py` that mocks YouTube but calls real Gemini (or cached Gemini if cost-saving mode)
- [x] T019 [US2] Add CI job definition to run regression tests on PR
- [x] T020 Run full test suite and verify >75% coverage
- [x] T021 Add docstrings and type hints to all new modules
- [x] T022 Verification: Test with 3 real YouTube videos (Script provided in `scripts/verify_live.py`)
