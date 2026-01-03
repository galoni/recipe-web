FROM python:3.13-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y curl \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="/root/.local/bin:$PATH"

# Copy dependency files
COPY pyproject.toml poetry.lock* ./

# Configure poetry to not use virtualenvs (we are in docker)
RUN poetry config virtualenvs.create false

# Install dependencies
RUN poetry lock && poetry install --no-root --without dev

# Copy app code
COPY . .

# Command is overridden in docker-compose, but good to have default
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
