import os
import time
import logging
from typing import Optional, List
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid

# Load environment variables from config.env
from dotenv import load_dotenv
load_dotenv('config.env')

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

# Oyun2 için yeni modeller
class GetGame2DataRequest(BaseModel):
    child_id: str

class Game2DataResponse(BaseModel):
    objects: List[dict] = []
    actions: List[dict] = []
    error: Optional[str] = None

class GenerateSentenceRequest(BaseModel):
    object_name: str
    action_name: str

class GenerateSentenceResponse(BaseModel):
    sentence: Optional[str] = None
    error: Optional[str] = None

class GenerateGame2TTSRequest(BaseModel):
    sentence: str

class GenerateGame2TTSResponse(BaseModel):
    audio_url: Optional[str] = None
    error: Optional[str] = None

# Game2 Ayarlar için modeller
class GetGame2SettingsRequest(BaseModel):
    child_id: str

class Game2SettingsResponse(BaseModel):
    objects: List[dict] = []
    actions: List[dict] = []
    error: Optional[str] = None

class UpdateGame2SettingsRequest(BaseModel):
    child_id: str
    selected_object_ids: List[str] = []  # UUID string array olarak değiştirildi
    selected_action_ids: List[int] = []

class UpdateGame2SettingsResponse(BaseModel):
    success: bool = False
    error: Optional[str] = None

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

# Oyun2 endpoint'leri
@app.post("/game2/data", response_model=Game2DataResponse)
async def get_game2_data(request: GetGame2DataRequest):
    """Oyun2 için nesne ve eylem verilerini getirir"""
    if not request.child_id:
        return {"error": "child_id zorunlu."}
    
    try:
        uuid.UUID(request.child_id)
    except ValueError:
        return {"error": "Geçersiz child_id formatı. UUID olmalı."}
    
    logging.info(f"/game2/data endpoint çağrıldı. child_id: {request.child_id}")
    
    try:
        # Tüm nesne ve eylemleri getir (tema bağımsız)
        objects = _get_all_game2_objects()
        actions = _get_all_game2_actions()
        
        return {
            "objects": objects,
            "actions": actions
        }
    except Exception as e:
        logging.error(f"Game2 data hatası: {e}")
        return {"error": f"Veri yüklenirken hata: {e}"}

@app.post("/game2/generate-sentence", response_model=GenerateSentenceResponse)
async def generate_game2_sentence(request: GenerateSentenceRequest):
    """Nesne ve eylem için doğal cümle oluşturur"""
    logging.info(f"/game2/generate-sentence endpoint çağrıldı. object: {request.object_name}, action: {request.action_name}")
    
    try:
        sentence = _generate_natural_sentence(request.object_name, request.action_name)
        
        # Kullanım verilerini kaydet (opsiyonel, child_id gerekirse eklenebilir)
        # from db_client import insert_game2_usage
        # if child_id:
        #     insert_game2_usage(child_id, request.object_name, request.action_name, sentence, "")
        
        return {"sentence": sentence}
    except Exception as e:
        logging.error(f"Sentence generation hatası: {e}")
        return {"error": f"Cümle oluşturulurken hata: {e}"}

@app.post("/game2/generate-tts", response_model=GenerateGame2TTSResponse)
async def generate_game2_tts(request: GenerateGame2TTSRequest):
    """Oyun2 için TTS audio üretir"""
    logging.info(f"/game2/generate-tts endpoint çağrıldı. sentence: {request.sentence}")
    
    try:
        # AI TTS kullanarak audio üret
        from ai_tts import generate_tts_audio
        import hashlib
        import time
        import base64
        
        # Benzersiz dosya adı oluştur
        timestamp = int(time.time())
        sentence_hash = hashlib.md5(request.sentence.encode()).hexdigest()[:8]
        file_name = f"game2_tts_{timestamp}_{sentence_hash}.wav"
        
        # TTS audio üret
        audio_bytes = generate_tts_audio(
            text=request.sentence,
            voice_name='Sulafat',  # Çocuk dostu ses
            file_name=file_name
        )
        
        # Audio'yu base64'e çevir
        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
        audio_data_url = f"data:audio/wav;base64,{audio_base64}"
        
        logging.info(f"TTS audio generated successfully, size: {len(audio_bytes)} bytes")
        return {"audio_url": audio_data_url}
        
    except Exception as e:
        logging.error(f"Game2 TTS hatası: {e}")
        return {"error": f"TTS üretilirken hata: {e}"}

# Game2 Ayarlar endpoint'leri
@app.post("/game2/settings", response_model=Game2SettingsResponse)
async def get_game2_settings(request: GetGame2SettingsRequest):
    """Game2 ayarlar sayfası için tüm nesne ve eylemleri getirir"""
    if not request.child_id:
        return {"error": "child_id zorunlu."}
    
    try:
        uuid.UUID(request.child_id)
    except ValueError:
        return {"error": "Geçersiz child_id formatı. UUID olmalı."}
    
    logging.info(f"/game2/settings endpoint çağrıldı. child_id: {request.child_id}")
    
    try:
        # Tüm nesne ve eylemleri getir
        objects = _get_all_game2_objects()
        actions = _get_all_game2_actions()
        
        return {
            "objects": objects,
            "actions": actions
        }
    except Exception as e:
        logging.error(f"Game2 settings hatası: {e}")
        return {"error": f"Ayarlar yüklenirken hata: {e}"}

@app.post("/game2/settings/update", response_model=UpdateGame2SettingsResponse)
async def update_game2_settings(request: UpdateGame2SettingsRequest):
    """Game2 ayarlarını günceller"""
    if not request.child_id:
        return {"success": False, "error": "child_id zorunlu."}
    
    try:
        uuid.UUID(request.child_id)
    except ValueError:
        return {"success": False, "error": "Geçersiz child_id formatı. UUID olmalı."}
    
    logging.info(f"/game2/settings/update endpoint çağrıldı. child_id: {request.child_id}")
    
    try:
        # Ayarları veritabanına kaydet
        from db_client import update_game2_settings
        success = update_game2_settings(
            request.child_id, 
            request.selected_object_ids, 
            request.selected_action_ids
        )
        
        if success:
            return {"success": True}
        else:
            return {"success": False, "error": "Ayarlar kaydedilemedi"}
            
    except Exception as e:
        logging.error(f"Game2 settings update hatası: {e}")
        return {"success": False, "error": f"Ayarlar güncellenirken hata: {e}"}

def _get_all_game2_objects() -> List[dict]:
    """Tüm nesneleri getirir (tema bağımsız)"""
    try:
        from db_client import get_all_game2_objects
        
        # Supabase'den tüm nesneleri getir
        objects = get_all_game2_objects()
        
        if objects:
            return objects
        else:
            logging.warning("Supabase'den nesne bulunamadı")
            return []
            
    except Exception as e:
        logging.error(f"Supabase'den nesne getirme hatası: {e}")
        return []

def _get_all_game2_actions() -> List[dict]:
    """Tüm eylemleri getirir (tema bağımsız)"""
    try:
        from db_client import get_all_game2_actions
        
        # Supabase'den tüm eylemleri getir
        actions = get_all_game2_actions()
        
        if actions:
            return actions
        else:
            logging.warning("Supabase'den eylem bulunamadı")
            return []
            
    except Exception as e:
        logging.error(f"Supabase'den eylem getirme hatası: {e}")
        return []

def _get_game2_actions(theme: str) -> List[dict]:
    """Tema bazlı eylem listesini Supabase'den getirir"""
    try:
        from db_client import get_game2_actions
        
        # Supabase'den tema bazlı eylemleri getir
        actions = get_game2_actions(theme)
        
        if actions:
            return actions
        else:
            logging.warning(f"Supabase'den {theme} teması için eylem bulunamadı")
            return []
            
    except Exception as e:
        logging.error(f"Supabase'den eylem getirme hatası: {e}")
        return []

def _generate_natural_sentence(object_name: str, action_name: str) -> str:
    """AI ile doğal cümle oluşturur"""
    try:
        from google import genai
        from db_client import get_action_template
        
        api_key = _get_api_key()
        if not api_key:
            logging.warning("API key bulunamadı, fallback cümle kullanılıyor")
            return _generate_fallback_sentence(object_name, action_name)
        
        client = genai.Client(api_key=api_key)
        
        # Database'den action template'i al
        action_template = get_action_template(object_name)
        
        prompt = f"""
        Türkçe'de doğal ve gramer açısından doğru bir cümle oluştur.
        
        Nesne: {object_name}
        Eylem: {action_name}
        Template: {action_template}
        
        Bu nesne ve eylemi kullanarak, bir çocuğun konuşma tarzında doğal bir cümle oluştur.
        Template'i kullanarak daha doğal bir cümle oluşturabilirsin.
        Cümle basit, anlaşılır ve Türkçe dil kurallarına uygun olmalı.
        
        Örnekler:
        - araba + oynamak → "Araba ile oynamak istiyorum"
        - kedi + koşmak → "Kedi koşmak istiyorum"
        - kuş + uçmak → "Kuş uçmak istiyorum"
        
        Sadece cümleyi döndür, başka açıklama ekleme.
        """
        
        response = client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=prompt
        )
        
        sentence = response.candidates[0].content.parts[0].text.strip()
        
        # Cümle kontrolü
        if sentence and len(sentence) > 5:
            return sentence
        else:
            logging.warning("AI'dan gelen cümle geçersiz, fallback kullanılıyor")
            return _generate_fallback_sentence(object_name, action_name)
            
    except Exception as e:
        logging.error(f"AI sentence generation hatası: {e}")
        return _generate_fallback_sentence(object_name, action_name)

def _generate_fallback_sentence(object_name: str, action_name: str) -> str:
    """Fallback cümle oluşturur"""
    # Bazı özel durumlar için daha doğal cümleler
    if action_name == "oynamak":
        return f"{object_name} ile oynamak istiyorum"
    elif action_name == "yemek yemek":
        return f"{object_name} yemek istiyorum"
    elif action_name == "koşmak":
        return f"{object_name} koşmak istiyorum"
    elif action_name == "uyumak":
        return f"{object_name} uyumak istiyorum"
    elif action_name == "yüzmek":
        return f"{object_name} yüzmek istiyorum"
    elif action_name == "sürmek":
        return f"{object_name} sürmek istiyorum"
    elif action_name == "uçmak":
        return f"{object_name} uçmak istiyorum"
    elif action_name == "gitmek":
        return f"{object_name} gitmek istiyorum"
    elif action_name == "binmek":
        return f"{object_name} binmek istiyorum"
    elif action_name == "boyamak":
        return f"{object_name} boyamak istiyorum"
    elif action_name == "çizmek":
        return f"{object_name} çizmek istiyorum"
    elif action_name == "bulmak":
        return f"{object_name} bulmak istiyorum"
    elif action_name == "göstermek":
        return f"{object_name} göstermek istiyorum"
    elif action_name == "seçmek":
        return f"{object_name} seçmek istiyorum"
    else:
        return f"{object_name} ile {action_name} istiyorum"

def _get_api_key():
    """API key'i environment variable'dan alır, yoksa Secret Manager'dan"""
    # First try environment variable
    api_key = os.environ.get("GOOGLE_AI_API_KEY")
    if api_key:
        return api_key
    
    # Fallback to Secret Manager
    try:
        import google.cloud.secretmanager as secretmanager
        client = secretmanager.SecretManagerServiceClient()
        project_id = os.environ.get("GCP_PROJECT_ID", "plated-shelter-466317-a7")
        name = f"projects/{project_id}/secrets/gemini-api-keys/versions/latest"
        response = client.access_secret_version(request={"name": name})
        api_keys = response.payload.data.decode("UTF-8")
        
        # Virgülle ayrılmış key'leri al ve rastgele seç
        api_keys_list = [k.strip() for k in api_keys.split(",") if k.strip()]
        if api_keys_list:
            import random
            return random.choice(api_keys_list)
        return None
    except Exception as e:
        logging.warning(f"API key yüklenemedi: {e}")
        return None
