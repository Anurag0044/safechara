FROM python:3.11-slim

# Prevent Python from buffering stdout/stderr (important for Cloud Run logs)
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies first for Docker layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Cloud Run injects the PORT env var; default to 8080
ENV PORT=8080

# Run with gunicorn: 1 worker, 8 threads, no timeout (Cloud Run manages lifecycle)
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 app:app
