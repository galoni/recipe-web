import shutil
from pathlib import Path

import pytest


@pytest.fixture(scope="session")
def golden_data_dir():
    return Path(__file__).parent / "data"


@pytest.fixture(scope="session")
def setup_regression_env():
    # Setup for regression tests
    # e.g., ensure database is clean or specific mode is enabled
    pass
