FROM python:3.10-slim

WORKDIR /app

# Sadece gerekli dosyaları kopyala
COPY generator/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Uygulama dosyalarını kopyala
COPY generator/api.py ./
COPY generator/ai_image.py ./
COPY generator/ai_question.py ./
COPY generator/ai_tts.py ./
COPY generator/db_client.py ./
COPY generator/storage_utils.py ./
COPY generator/plated-shelter-466317-a7-9f02f535400f.json ./

# Sadece gerekli olmayan environment variables
ENV PYTHONUNBUFFERED=1
ENV USE_LOCAL_CREDENTIALS=false
ENV PROJECT_ID=plated-shelter-466317-a7
ENV LOCATION=us-central1

EXPOSE 8080

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8080"] 