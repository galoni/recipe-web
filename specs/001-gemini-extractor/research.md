# Research: Gemini AI Extractor

**Decision**: Use Google Gemini 1.5 Flash for transcription summarization and recipe extraction.
**Rationale**: 
- **Cost**: Flash is significantly cheaper than Pro/Ultra while maintaining high accuracy for text tasks.
- **Context Window**: 1M context window allows passing full transcripts (text) for almost all cooking videos without complex chunking logic for standard cases.
- **Performance**: Faster token generation speed is critical for the <15s latency target.

**Decision**: Transcript-Only Extraction via `yt-dlp`.
**Rationale**:
- **Bandwidth**: Downloading video/audio takes seconds-to-minutes. Reading the transcript via `yt-dlp` is nearly instant.
- **Cost**: Avoids storage and egress costs for media files.
- **Privacy**: No user video data is stored, only the derived text.

**Decision**: PostgreSQL for Caching.
**Rationale**:
- **Constitution**: PostgreSQL is the defined "source of truth".
- **Complexity**: Avoids adding Redis just for this one feature (keeps infrastructure simple).
- **Structure**: `jsonb` column allows flexible storage of the raw Gemini response if the schema evolves.

**Alternatives Considered**:
- **Whisper (OpenAI)**: Rejected due to cost and need for audio download.
- **Full Video Multimodality**: Rejected due to high latency (video upload + processing time) and cost.

## Lessons Learned (Post-Implementation)

### 1. Robust Transcript Fetching
`yt-dlp` is highly effective but can be inconsistent in CI environments. We've optimized `YouTubeService` to:
- Write subtitles directly to `/tmp` as `.vtt`.
- Fall back to auto-generated captions if manual ones are missing.
- Implement a custom VTT parser to avoid external dependencies like `webvtt-py`.
- Handle deduplication of "scrolling" captions commonly found in auto-generated YouTube subtitles.

### 2. Poetry Packaging
For backend applications (not libraries), `package-mode = false` in `pyproject.toml` is essential to avoid "Package not found" errors during dependency installation.

### 3. CI/CD Robustness
- **Environment Isolation**: Always provide dummy defaults for `DATABASE_URL` in `config.py` to allow the app to initialize its configuration in CI runners.
- **Async Testing**: `AsyncMock` behavior differs from `MagicMock`. When mocking a method that is awaited, the attribute itself must be assigned to an `AsyncMock` to avoid `TypeError`.
- **Package Discovery**: Explicitly adding `__init__.py` files to `/app` and `/tests` subdirectories ensures consistent package discovery across different OS environments (macOS local vs Linux CI).
