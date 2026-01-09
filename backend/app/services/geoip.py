from typing import Optional, Tuple


class GeoIPService:
    @staticmethod
    async def get_location(ip_address: str) -> Tuple[Optional[str], Optional[str]]:
        """
        Stub for GeoIP lookup.
        In production, this would use geoip2 and a local database like GeoLite2-City.mmdb.
        """
        if ip_address == "127.0.0.1" or ip_address == "unknown":
            return "Local", "Localhost"

        # For MVP, return unknown unless we have a real DB
        return None, None
