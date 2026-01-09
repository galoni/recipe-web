import pytest
from app.services.geoip import GeoIPService


@pytest.mark.asyncio
async def test_get_location_localhost():
    city, country = await GeoIPService.get_location("127.0.0.1")
    assert city == "Local"
    assert country == "Localhost"


@pytest.mark.asyncio
async def test_get_location_unknown():
    city, country = await GeoIPService.get_location("8.8.8.8")
    assert city is None
    assert country is None
