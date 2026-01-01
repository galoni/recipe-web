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
