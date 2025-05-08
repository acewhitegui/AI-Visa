FROM python:3.12-slim AS base

# Install curl and clean up in a single layer
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only requirements first to leverage Docker cache
COPY requirements.txt .

# Set pip mirror and upgrade pip in a single RUN
RUN pip config set global.index-url https://mirrors.cloud.tencent.com/pypi/simple && \
    pip install --upgrade pip && \
    pip install -r requirements.txt

FROM base AS build

# Copy the rest of the application code
COPY . .

EXPOSE 8001

HEALTHCHECK --interval=30s --timeout=5s --retries=5 --start-period=10s CMD curl -fs http://localhost:8001/alive || exit 1

CMD ["python", "main.py"]
