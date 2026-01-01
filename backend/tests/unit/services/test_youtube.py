import pytest
from unittest.mock import MagicMock, patch
from app.core.exceptions import NoTranscriptError
from app.services.youtube import YouTubeService

# Mock yt-dlp response
MOCK_TRANSCRIPT = [
    {"text": "Hello world", "start": 0.0, "duration": 1.0},
    {"text": "This is a cooking video", "start": 1.0, "duration": 2.0}
]

@pytest.fixture
def youtube_service():
    return YouTubeService()

def test_extract_video_id_valid():
    assert YouTubeService.extract_video_id("https://www.youtube.com/watch?v=12345678901") == "12345678901"
    assert YouTubeService.extract_video_id("https://youtu.be/12345678901") == "12345678901"

def test_extract_video_id_invalid():
    with pytest.raises(ValueError):
        YouTubeService.extract_video_id("https://google.com")

@patch("yt_dlp.YoutubeDL")
def test_get_transcript_success(mock_ytdl, youtube_service):
    # Setup mock
    instance = mock_ytdl.return_value
    instance.extract_info.return_value = {"subtitles": {"en": [{"url": "http://fake"}]}} 
    # Note: Real yt-dlp interaction is complex to mock fully for subtitles download
    # For unit test, we might mock the wrapper method if we separate download vs parsing
    pass

# Simplified for TDD: We will write the service to be testable
