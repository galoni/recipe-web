import pytest
from unittest.mock import MagicMock, patch, mock_open
from app.core.exceptions import NoTranscriptError
from app.services.youtube import YouTubeService
import os


@pytest.fixture
def youtube_service():
    return YouTubeService()


def test_extract_video_id_valid():
    assert (
        YouTubeService.extract_video_id("https://www.youtube.com/watch?v=12345678901")
        == "12345678901"
    )
    assert (
        YouTubeService.extract_video_id("https://youtu.be/12345678901") == "12345678901"
    )
    assert (
        YouTubeService.extract_video_id(
            "https://www.youtube.com/watch?v=12345678901&feature=share"
        )
        == "12345678901"
    )


def test_extract_video_id_invalid():
    with pytest.raises(ValueError, match="Invalid YouTube URL"):
        YouTubeService.extract_video_id("https://google.com")


@patch("yt_dlp.YoutubeDL")
@patch("glob.glob")
@patch("webvtt.read")
@patch("os.remove")
@patch("uuid.uuid4")
def test_get_transcript_success(
    mock_uuid, mock_remove, mock_webvtt_read, mock_glob, mock_ytdl, youtube_service
):
    # Setup mocks
    mock_uuid.return_value = "fixed-uuid"
    mock_glob.return_value = ["/tmp/fixed-uuid.vtt"]

    mock_caption = MagicMock()
    mock_caption.text = "This is a transcript."
    mock_webvtt_read.return_value = [mock_caption]

    # Execute
    transcript = youtube_service.get_transcript("12345678901")

    # Verify
    assert transcript == "This is a transcript."
    mock_ytdl.assert_called_once()
    mock_glob.assert_any_call("/tmp/fixed-uuid*.vtt")


@patch("yt_dlp.YoutubeDL")
@patch("glob.glob")
@patch("os.remove")
def test_get_transcript_no_file(mock_remove, mock_glob, mock_ytdl, youtube_service):
    mock_glob.return_value = []  # No files found

    with pytest.raises(NoTranscriptError):
        youtube_service.get_transcript("12345678901")


@patch("yt_dlp.YoutubeDL")
@patch("glob.glob")
@patch("webvtt.read")
@patch("os.remove")
def test_transcript_parsing_logic(
    mock_remove, mock_webvtt_read, mock_glob, mock_ytdl, youtube_service
):
    mock_glob.side_effect = [["/tmp/test.vtt"], ["/tmp/test.vtt"]]

    # Mock webvtt captions
    mock_caption1 = MagicMock()
    mock_caption1.text = "Line 1"
    mock_caption2 = MagicMock()
    mock_caption2.text = "Line 1"  # duplicate check
    mock_caption3 = MagicMock()
    mock_caption3.text = "Line 2"

    mock_webvtt_read.return_value = [mock_caption1, mock_caption2, mock_caption3]

    result = youtube_service.get_transcript("12345678901")

    assert result == "Line 1 Line 1 Line 2"
