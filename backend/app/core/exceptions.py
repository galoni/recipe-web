class NoTranscriptError(Exception):
    """Raised when no transcript is found for a video."""
    def __init__(self, video_id: str):
        self.video_id = video_id
        self.message = f"No transcript available for video {video_id}"
        super().__init__(self.message)
