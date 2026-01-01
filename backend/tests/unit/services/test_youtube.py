import pytest
from unittest.mock import MagicMock, patch, mock_open
from app.core.exceptions import NoTranscriptError
from app.services.youtube import YouTubeService
import os

@pytest.fixture
def youtube_service():
    return YouTubeService()

def test_extract_video_id_valid():
    assert YouTubeService.extract_video_id("https://www.youtube.com/watch?v=12345678901") == "12345678901"
    assert YouTubeService.extract_video_id("https://youtu.be/12345678901") == "12345678901"
    assert YouTubeService.extract_video_id("https://www.youtube.com/watch?v=12345678901&feature=share") == "12345678901"

def test_extract_video_id_invalid():
    with pytest.raises(ValueError, match="Invalid YouTube URL"):
        YouTubeService.extract_video_id("https://google.com")

@patch("yt_dlp.YoutubeDL")
@patch("glob.glob")
@patch("builtins.open", new_callable=mock_open, read_data="WEBVTT\n\n00:00:00.000 --> 00:00:01.000\nHello world\n")
@patch("os.remove")
def test_get_transcript_success(mock_remove, mock_file, mock_glob, mock_ytdl, youtube_service):
    # Setup mocks
    mock_glob.side_effect = [["/tmp/test.en.vtt"], ["/tmp/test.en.vtt"]] # first for finding, second for cleanup
    
    result = youtube_service.get_transcript("12345678901")
    
    assert result == "Hello world"
    mock_ytdl.return_value.__enter__.return_value.download.assert_called_once()

@patch("yt_dlp.YoutubeDL")
@patch("glob.glob")
@patch("os.remove")
def test_get_transcript_no_file(mock_remove, mock_glob, mock_ytdl, youtube_service):
    mock_glob.return_value = [] # No files found
    
    with pytest.raises(NoTranscriptError):
        youtube_service.get_transcript("12345678901")

@patch("yt_dlp.YoutubeDL")
@patch("glob.glob")
@patch("builtins.open", new_callable=mock_open, read_data="WEBVTT\n\n1\n00:00:01,000 --> 00:00:02,000\n<c>Line 1</c>\n\n2\n00:00:02,000 --> 00:00:03,000\nLine 1\n\n3\n00:00:03,000 --> 00:00:04,000\nLine 2\n")
@patch("os.remove")
def test_transcript_parsing_logic(mock_remove, mock_file, mock_glob, mock_ytdl, youtube_service):
    mock_glob.side_effect = [["/tmp/test.vtt"], ["/tmp/test.vtt"]]
    
    result = youtube_service.get_transcript("12345678901")
    
    # Line 1 should be deduplicated, <c> tags removed
    # Expected: "Line 1 Line 2"
    assert "Line 1" in result
    assert "Line 2" in result
    assert result.count("Line 1") == 1
    assert "<c>" not in result
