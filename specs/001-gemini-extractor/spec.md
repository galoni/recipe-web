# Feature Specification: Gemini AI Extractor

**Feature Branch**: `001-gemini-extractor`  
**Created**: 2026-01-01  
**Status**: Draft  
**Input**: User description: "Build a Gemini-powered backend service to extract structured recipes from YouTube URLs"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Extract Recipe from YouTube URL (Priority: P1)

As a user, I want to paste a YouTube video URL so that I can get a structured recipe (ingredients, steps, etc.) without watching the whole video.

**Why this priority**: Core value proposition. Without this, the app does nothing.

**Independent Test**: Can be tested via a curl/Postman request to the API with a valid YouTube URL, verifying it returns a valid JSON recipe.

**Acceptance Scenarios**:

1. **Given** a valid YouTube cooking video URL, **When** I submit it to the extraction endpoint, **Then** I receive a JSON response with title, description, ingredients list, and step-by-step instructions.
2. **Given** a non-cooking video URL, **When** I submit it, **Then** the system returns a meaningful error (e.g., "No recipe detected").
3. **Given** an invalid URL, **When** I submit it, **Then** the system returns a 400 Bad Request error.

---

### User Story 2 - Regression Testing with Cached Samples (Priority: P2)

As a developer, I want to ensure that changes to prompts or models don't break extraction quality, using a set of "golden" cached video samples.

**Why this priority**: Essential for the "Strict Testing Discipline" constitution. Prevents AI drift and API costs during testing.

**Independent Test**: Running `pytest` runs the regression suite against local cached transcripts, verifying the output JSON structure matches the expected schema.

**Acceptance Scenarios**:

1. **Given** a set of cached video transcripts, **When** I run the test suite, **Then** the AI extraction runs against these cached inputs instead of calling YouTube.
2. **Given** a change in the prompt, **When** I run the regression tests, **Then** I can see diffs in the extracted output to verify quality hasn't degraded.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST accept standard YouTube URLs (watch?v=...) and shortened URLs (youtu.be/...).
- **FR-002**: System MUST use `yt-dlp` to fetch **text transcripts only**.
    - If no transcript/captions are available, the extraction MUST FAIL with a specific "NoTranscriptError".
    - Audio/Video downloading is EXPLICITLY DISABLED to minimize bandwidth and cost.
- **FR-003**: System MUST use Google Gemini 1.5 Flash for text processing.
- **FR-004**: System MUST implement a "Smart Context" strategy:
    - Videos < 20 mins: Pass full transcript to Gemini.
    - Videos > 20 mins: Chunk transcript (e.g., 10-minute segments) and summarize before final extraction.
- **FR-005**: System MUST enforce a rigid Pydantic schema for the LLM output.
- **FR-006**: System MUST handle AI hallucinations by validating the JSON structure.
- **FR-007**: System MUST use **PostgreSQL** for caching extraction results.
    - Cache Key: YouTube Video ID + Prompt Version + Model Version.
    - TTL: 30 days (recipes rarely change).
    - If a valid cache entry exists, return it immediately without calling Gemini or YouTube.

### Key Entities

- **Recipe**: The core output object.
- **ExtractionJob**: Track the status of long-running extractions (Pending -> Processing -> Completed/Failed).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of valid cooking videos return a strict JSON recipe (no parsing errors).
- **SC-002**: Extraction process completes in under 15 seconds for an average 10-minute video.
- **SC-003**: Regression test suite passes 100% of the "Golden Set" videos.
