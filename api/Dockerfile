FROM python:3.12-slim

# install curl
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

RUN pip config set global.index-url https://mirrors.cloud.tencent.com/pypi/simple
RUN pip install pip -U
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8001

HEALTHCHECK --interval=30s --timeout=5s --retries=5 --start-period=10s CMD curl -fs http://localhost:8001/alive || exit 1

CMD ["python", "main.py"]