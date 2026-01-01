from youtube_transcript_api import YouTubeTranscriptApi
from app.core.exceptions import NoTranscriptError
import re


class YouTubeService:
    @staticmethod
    def extract_video_id(url: str) -> str:
        # Supports youtube.com/watch?v= and youtu.be/
        # Also handles additional params
        regex = r"(?:v=|\/)([0-9A-Za-z_-]{11}).*"
        match = re.search(regex, url)
        if match:
            return match.group(1)
        raise ValueError("Invalid YouTube URL")

    def get_transcript(self, video_id: str) -> str:
        """
        Fetches transcript using yt-dlp which is more robust than youtube_transcript_api.
        Downloads the lowest quality audio (skip download) but grabs subtitles.
        """
        import yt_dlp
        import os
        import glob
        import uuid

        # Create a unique temp filename to avoid collisions
        temp_id = str(uuid.uuid4())
        output_template = f"/tmp/{temp_id}"

        # Configure yt-dlp to download subtitles only
        ydl_opts = {
            "skip_download": True,
            "writesubtitles": True,
            "writeautomaticsub": True,  # Fallback to auto-captions
            "subtitleslangs": ["en.*", "en"],  # varied english codes
            "outtmpl": output_template,
            "quiet": True,
            "no_warnings": True,
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                # This writes file like /tmp/{uuid}.en.vtt
                ydl.download([f"https://www.youtube.com/watch?v={video_id}"])

            # Find the downloaded vtt file
            # it might happen that it downloads .en.vtt or .en-US.vtt etc
            possible_files = glob.glob(f"{output_template}*.vtt")

            if not possible_files:
                raise NoTranscriptError(video_id)

            # Pick the first one (usually best match)
            vtt_path = possible_files[0]

            # Parse VTT to plain text
            # We need a simple parser or just strip tags.
            # Installing 'webvtt-py' would be ideal but maybe overkill to add a dep now?
            # Let's do a simple regex strip for now or rudimentary VTT parsing.
            # actually, let's just read lines that are not timestamps or IDs.

            content = []
            with open(vtt_path, "r", encoding="utf-8") as f:
                # Simple VTT parser to extract text
                # VTT format:
                # 00:00:00.000 --> 00:00:05.000
                # Some text here
                # <c>Color</c> tags etc

                # We can use regex to ignore headers and timestamps
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    if line == "WEBVTT":
                        continue
                    if "-->" in line:
                        continue
                    if re.match(r"^\d+$", line):
                        continue  # seq numbers

                    # Remove HTML-like tags e.g. <c.color> or <b>
                    text = re.sub(r"<[^>]+>", "", line)
                    # Remove timestamp tags if embedded like <00:00:01>
                    # text = re.sub(r'<\d{2}:\d{2}:\d{2}\.\d{3}>', '', text)

                    # Deduplicate repeated lines (common in rolling captions)
                    if content and content[-1] == text:
                        continue
                    content.append(text)

            return " ".join(content)

        except Exception as e:
            print(f"Error fetching transcript with yt-dlp: {e}")
            if isinstance(e, NoTranscriptError):
                raise e
            raise NoTranscriptError(video_id)  # Wrap others

        finally:
            # Cleanup
            try:
                for f in glob.glob(f"{output_template}*"):
                    os.remove(f)
            except:
                pass
