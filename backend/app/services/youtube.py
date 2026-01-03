from app.core.exceptions import NoTranscriptError
import re
from app.core.logger import logger
import webvtt


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

            # Parse VTT to plain text using webvtt-py
            captions = webvtt.read(vtt_path)

            # YouTube auto-captions are often overlapping and repeating.
            # Example:
            # 1: "hey"
            # 2: "hey everybody"
            # 3: "hey everybody it's"
            # We want to keep only unique content.

            text_lines = []
            last_text = ""

            for caption in captions:
                text = caption.text.strip()
                if not text:
                    continue

                # If the current text starts with the last text, it's likely an extension
                if text.startswith(last_text) and last_text:
                    # Replace the last line with the current one as it's more complete
                    if text_lines:
                        text_lines[-1] = text
                    else:
                        text_lines.append(text)
                elif last_text.startswith(text) and text:
                    # Current text is already contained in last text, skip
                    continue
                else:
                    text_lines.append(text)

                last_text = text

            transcript = " ".join(text_lines)

            # Final cleanup of whitespace
            return " ".join(transcript.split())

        except Exception as e:
            logger.error(f"Error fetching transcript with yt-dlp: {e}")
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
