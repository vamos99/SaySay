import os
import time
import logging
from typing import Optional, List
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid

# Secret Manager import'u
try:
    import google.cloud.secretmanager as secretmanager
    SECRET_MANAGER_AVAILABLE = True
except ImportError:
    SECRET_MANAGER_AVAILABLE = False

from ai_image import generate_image
from ai_question import generate_question
from ai_tts import generate_tts_audio
from db_client import get_child_data, get_child_roadmap, find_existing_content, insert_ai_content

class GenerateRequest(BaseModel):
    prompt: str

class GenerateResponse(BaseModel):
    image_url: str

class GenerateQuestionRequest(BaseModel):
    yas_araligi: int
    tema: str
    kavram: str

class GenerateQuestionResponse(BaseModel):
    question: str

class GenerateFullContentRequest(BaseModel):
    child_id: str

class ConceptResult(BaseModel):
    concept: str
    question: Optional[str] = None
    correct_image_url: Optional[str] = None
    wrong_image_url: Optional[str] = None
    audio_url: Optional[str] = None
    from_db: Optional[bool] = None
    error: Optional[str] = None

class GenerateFullContentResponse(BaseModel):
    question: Optional[str] = None
    correct_image_url: Optional[str] = None
    wrong_image_url: Optional[str] = None
    audio_url: Optional[str] = None
    from_db: Optional[bool] = None
    all_concepts: List[ConceptResult] = []
    error: Optional[str] = None

class GenerateNextConceptRequest(BaseModel):
    child_id: str

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.error(f"Hata: {exc}")
    return JSONResponse(status_code=500, content={"error": str(exc)})

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Service is running"}

@app.post("/generate", response_model=GenerateResponse)
async def generate(request: GenerateRequest):
    logging.info(f"/generate endpoint çağrıldı. prompt: {request.prompt}")
    result = generate_image(request.prompt)
    logging.info(f"Görsel üretildi: {result}")
    return {"image_url": result}

@app.post("/generate-question", response_model=GenerateQuestionResponse)
async def generate_question_api(request: GenerateQuestionRequest):
    logging.info(f"/generate-question endpoint çağrıldı. tema: {request.tema}, kavram: {request.kavram}, yaş: {request.yas_araligi}")
    question = generate_question(request.yas_araligi, request.tema, request.kavram)
    logging.info(f"Soru üretildi: {question}")
    return {"question": question}

@app.post("/generate-full-content", response_model=GenerateFullContentResponse)
async def generate_full_content(request: GenerateFullContentRequest):
    """Roadmap'teki tüm kavramları sırayla işler"""
    if not request.child_id:
        return {"error": "child_id zorunlu."}
    
    # UUID validasyonu
    try:
        uuid.UUID(request.child_id)
    except ValueError:
        return {"error": "Geçersiz child_id formatı. UUID olmalı."}
    
    logging.info(f"/generate-full-content endpoint çağrıldı. child_id: {request.child_id}")
    
    # Çocuk ve roadmap verilerini al
    child_data = get_child_data(request.child_id)
    if not child_data:
        return {"error": "Çocuk bulunamadı."}
    
    roadmap = get_child_roadmap(request.child_id)
    if not roadmap or not roadmap.get('concepts_order'):
        return {"error": "Roadmap bulunamadı."}
    
    logging.info(f"child: {child_data}")
    logging.info(f"roadmap: {roadmap}")
    
    # Tüm kavramları işle
    concepts_order = roadmap['concepts_order']
    if not concepts_order:
        return {"error": "Kavram listesi boş."}
    
    theme = child_data['theme']
    age = 2024 - child_data['birth_year']
    all_results = []
    
    for concept in concepts_order:
        result = _process_concept(request.child_id, theme, age, concept)
        all_results.append(result)
    
    # İlk başarılı sonucu ana response olarak döndür
    main_result = next((r for r in all_results if "error" not in r), None)
    
    if not main_result:
        return {"error": "Hiçbir kavram işlenemedi.", "all_concepts": all_results}
    
    return {
        "question": main_result["question"],
        "correct_image_url": main_result["correct_image_url"],
        "wrong_image_url": main_result["wrong_image_url"],
        "audio_url": main_result["audio_url"],
        "from_db": main_result["from_db"],
        "all_concepts": all_results
    }

def _process_concept(child_id: str, theme: str, age: int, concept: str) -> dict:
    """Tek bir kavramı işler"""
    logging.info(f"Kavram işleniyor: {concept}")
    
    # Mevcut içerik kontrolü
    existing_content = find_existing_content(theme, concept, child_id)
    if existing_content:
        logging.info(f"Mevcut içerik bulundu: {concept}")
        return {
            "concept": concept,
            "question": existing_content["question"],
            "correct_image_url": existing_content["correct_image_url"],
            "wrong_image_url": existing_content["wrong_image_url"],
            "audio_url": existing_content.get("audio_url"),
            "from_db": True
        }
    
    # Yeni içerik üret
    try:
        # Çocuk bilgilerini al (wants_tts için)
        child_data = get_child_data(child_id)
        wants_tts = child_data.get('wants_tts', False) if child_data else False
        return _generate_new_content(child_id, theme, age, concept, wants_tts)
    except Exception as e:
        logging.error(f"Kavram işlenirken hata: {concept}, Hata: {e}")
        return {"concept": concept, "error": f"Kavram işlenirken hata: {concept}, Hata: {e}"}

def _generate_new_content(child_id: str, theme: str, age: int, concept: str, wants_tts: bool = False) -> dict:
    """Yeni içerik üretir"""
    time.sleep(8)  # Rate limiting
    
    # Soru üret
    question = generate_question(age, theme, concept)
    logging.info(f"Üretilen soru: {question}")
    if not question or len(question) > 200:
        raise Exception(f"Soru üretilemedi: {concept}")
    
    # Görselleri üret
    from ai_image import generate_image_prompts
    correct_prompt, wrong_prompt = generate_image_prompts(theme, question, concept)
    
    correct_image_url = _generate_image_with_retry(correct_prompt, f"Doğru görsel üretiliyor: {concept}")
    time.sleep(8)
    wrong_image_url = _generate_image_with_retry(wrong_prompt, f"Yanlış görsel üretiliyor: {concept}")
    time.sleep(8)
    
    # TTS üret (sadece wants_tts=True ise)
    audio_url = None
    if wants_tts:
        try:
            logging.info(f"TTS üretiliyor: {concept}")
            audio_data = generate_tts_audio(question)
            
            # TTS'i GCS'e yükle
            from storage_utils import upload_to_gcs
            audio_url = upload_to_gcs(audio_data, "audio/wav", "audio", "wav")
            logging.info(f"TTS başarılı: {concept}")
        except Exception as e:
            logging.warning(f"TTS hatası (devam ediyor): {e}")
            audio_url = None
    else:
        logging.info(f"TTS atlandı (wants_tts=False): {concept}")
    
    # DB'ye kaydet
    insert_ai_content(child_id, theme, concept, question, correct_image_url, wrong_image_url, audio_url)
    
    logging.info(f"Kavram tamamlandı: {concept}")
    
    return {
        "concept": concept,
        "question": question,
        "correct_image_url": correct_image_url,
        "wrong_image_url": wrong_image_url,
        "audio_url": audio_url,
        "from_db": False
    }

def _generate_image_with_retry(prompt: str, log_message: str, max_retries: int = 3) -> str:
    """Retry mekanizması ile görsel üretir"""
    for retry in range(max_retries):
        try:
            logging.info(f"{log_message} (Deneme: {retry + 1})")
            return generate_image(prompt)
        except Exception as e:
            if "429" in str(e) and retry < max_retries - 1:
                wait_time = 15 * (retry + 1)
                logging.info(f"Quota hatası - {wait_time}s bekleyip tekrar deniyor...")
                time.sleep(wait_time)
            else:
                raise e
    
    raise Exception("Görsel üretilemedi")