import os
import json
import random
import vertexai
from pathlib import Path
from google.oauth2 import service_account
from google.generativeai import configure, GenerativeModel
import logging

# ai_image.py ile aynı pool sistemi
THEME_OBJECTS = {
    "Korsanlar": ["korsan şapkası", "papağan", "hazine sandığı", "korsan gemisi", "bayrak", "kılıç", "dürbün", "harita", "gözlük", "altın", "mücevher", "top", "yelken", "çapa", "zincir", "su şişesi"],
    "Korsan": ["korsan şapkası", "papağan", "hazine sandığı", "korsan gemisi", "bayrak", "kılıç", "dürbün", "harita", "gözlük", "altın", "mücevher", "top", "yelken", "çapa", "zincir", "su şişesi"],
    "Uzay": ["roket", "yıldız", "gezegen", "astronot", "ufo", "ay", "kuyruklu yıldız", "uzay istasyonu", "meteor", "galaksi", "uydu", "teleskop", "uzay aracı", "nebula", "uzaylı", "robot"],
    "Orman": ["ağaç", "çiçek", "kelebek", "sincap", "mantar", "yaprak", "kuş", "böcek", "karınca", "arı", "kurtçuk", "tırtıl", "yosun", "kozalak", "dal", "kök"],
    "Deniz": ["balık", "deniz yıldızı", "yengeç", "deniz kabuğu", "balina", "denizatı", "mürekkep balığı", "yunus", "köpekbalığı", "mercan", "deniz anası", "kaplumbağa", "fok", "penguen", "ahtapot", "karides"],
    "Çiftlik": ["tavuk", "inek", "koyun", "at", "domuz", "horoz", "köpek", "kedi", "keçi", "ördek", "kaz", "hindi", "eşek", "tavşan", "saman", "çit"]
}

COLORS = {
    "kırmızı": "red", "mavi": "blue", "yeşil": "green", "sarı": "yellow",
    "pembe": "pink", "mor": "purple", "turuncu": "orange", "siyah": "black", "beyaz": "white"
}

COLOR_ALTERNATIVES = {
    "kırmızı": ["mavi", "yeşil", "sarı"], "mavi": ["kırmızı", "yeşil", "mor"], 
    "yeşil": ["kırmızı", "mavi", "sarı"], "sarı": ["mavi", "mor", "kırmızı"],
    "pembe": ["mavi", "yeşil", "mor"], "mor": ["sarı", "yeşil", "turuncu"],
    "turuncu": ["mavi", "mor", "yeşil"], "siyah": ["beyaz", "sarı", "kırmızı"], "beyaz": ["siyah", "mavi", "mor"]
}

SIZE_ALTERNATIVES = {"büyük": "small", "küçük": "big"}

NUMBER_ALTERNATIVES = {
    "1": "3", "bir": "3", "tek": "3", "2": "1", "iki": "1", "çift": "1", "3": "1", "üç": "1"
}

EMOTIONS = ["mutlu", "üzgün", "kızgın", "şaşkın"]

def _get_service_account_credentials():
    """Service account credentials'ını yükler"""
    try:
        # Secret Manager'dan yükle
        import google.cloud.secretmanager as secretmanager
        client = secretmanager.SecretManagerServiceClient()
        project_id = "plated-shelter-466317-a7"
        name = f"projects/{project_id}/secrets/service-account-json/versions/latest"
        response = client.access_secret_version(request={"name": name})
        service_account_info = json.loads(response.payload.data.decode("UTF-8"))
        return service_account.Credentials.from_service_account_info(service_account_info)
    except Exception as e:
        logging.warning(f"Secret Manager'dan service account yüklenemedi: {e}")
        # Fallback: dosyadan yükle
        SERVICE_ACCOUNT_FILE = str(Path(__file__).parent / "plated-shelter-466317-a7-9f02f535400f.json")
        with open(SERVICE_ACCOUNT_FILE) as f:
            service_account_info = json.load(f)
        return service_account.Credentials.from_service_account_info(service_account_info)

def _get_api_key():
    """API key'i Secret Manager'dan alır (pool sistemi)"""
    try:
        import google.cloud.secretmanager as secretmanager
        client = secretmanager.SecretManagerServiceClient()
        project_id = "plated-shelter-466317-a7"
        name = f"projects/{project_id}/secrets/gemini-api-keys/versions/latest"
        response = client.access_secret_version(request={"name": name})
        api_keys = response.payload.data.decode("UTF-8")
        
        # Virgülle ayrılmış key'leri al ve rastgele seç
        api_keys_list = [k.strip() for k in api_keys.split(",") if k.strip()]
        if api_keys_list:
            return random.choice(api_keys_list)
        return None
    except Exception as e:
        logging.warning(f"API key yüklenemedi: {e}")
        return None

def _get_gemini_model():
    """Gemini model adını Secret Manager'dan alır"""
    try:
        import google.cloud.secretmanager as secretmanager
        client = secretmanager.SecretManagerServiceClient()
        project_id = "plated-shelter-466317-a7"
        name = f"projects/{project_id}/secrets/gemini-model-question/versions/latest"
        response = client.access_secret_version(request={"name": name})
        return response.payload.data.decode("UTF-8")
    except Exception as e:
        logging.warning(f"Secret Manager'dan model adı yüklenemedi: {e}")
        # Fallback: default model
        return "gemini-2.5-flash"

def generate_question(yas_araligi, tema, kavram):
    """Gemini ile eğitim sorusu üretir"""
    PROJECT_ID = os.getenv("PROJECT_ID", "plated-shelter-466317-a7")
    LOCATION = os.getenv("LOCATION", "us-central1")
    
    # Vertex AI'yi başlat
    USE_LOCAL_CREDENTIALS = os.getenv("USE_LOCAL_CREDENTIALS", "true").lower() == "true"
    if USE_LOCAL_CREDENTIALS:
        credentials = _get_service_account_credentials()
        vertexai.init(project=PROJECT_ID, location=LOCATION, credentials=credentials)
    else:
        vertexai.init(project=PROJECT_ID, location=LOCATION)
    
    # API key'i al (pool sistemi)
    api_key = _get_api_key()
    if not api_key:
        raise Exception("API key bulunamadı!")
    
    # Tema nesnelerini al ve karıştır
    theme_objects = THEME_OBJECTS.get(tema, ["nesne"])
    random.shuffle(theme_objects)
    available_objects = ", ".join(theme_objects)
    
    # Kavram örnekleri üret
    concept_examples = _generate_concept_examples(kavram, theme_objects)
    
    prompt = f"""Create a simple educational question for a {yas_araligi} year old child.

Theme: {tema}
Concept: {kavram}
Available theme objects: {available_objects}

CRITICAL REQUIREMENTS:
- The question MUST start with "Hangisi" (Which one)
- NEVER use open-ended question words: 'kim', 'ne', 'nerede', 'neden', 'nasıl', 'why', 'how', 'what', 'where', 'who'
- You MUST use one of these specific theme objects: {available_objects}
- NEVER use generic words like "nesne", "şey", "object", "thing"
- The question must be completely compatible with the '{tema}' theme
- Write a short and simple question (maximum 6 words)
- NO markdown formatting: NO **, NO __, NO bold, NO italic, NO special formatting
- NO extra words like "korsanımızın", "arkadaşımızın", just simple direct questions
- Produce only a closed-ended question with a single correct answer
- Write the question in Turkish language
- Make it simple and clear for children
- VARIETY: Try to use different objects each time, don't repeat the same object frequently

{concept_examples}

FORMATTING RULES:
- NO special characters: *, **, _, __, #, etc.
- NO extra descriptive words
- Keep it simple: "Hangisi [attribute] [specific object]?"

Create a simple question using ONLY "Hangisi" format with a specific theme object."""

    # API key'i configure et
    configure(api_key=api_key)
    
    # Model adını Secret Manager'dan al
    model_name = _get_gemini_model()
    model = GenerativeModel(model_name)
    response = model.generate_content(prompt)
    
    if response and response.text:
        return response.text.strip()
    else:
        raise Exception("Soru üretilemedi")

def _generate_concept_examples(kavram, theme_objects):
    """Kavrama göre örnek üretir"""
    if kavram == "Renkler":
        obj1, obj2 = random.sample(theme_objects, 2)
        color1, color2 = random.sample(list(COLORS.keys()), 2)
        return f"""
Examples for colors (EXACT format to follow):
- "Hangisi {color1} {obj1}?"
- "Hangisi {color2} {obj2}?"
MANDATORY: Always include both color AND specific object name."""
    
    elif kavram == "Sayılar":
        obj1, obj2 = random.sample(theme_objects, 2)
        num1, num2 = random.sample(list(NUMBER_ALTERNATIVES.keys()), 2)
        return f"""
Examples for numbers (EXACT format to follow):
- "Hangisinde {num1} {obj1} var?"
- "Hangisinde {num2} {obj2} var?"
MANDATORY: Always include both number AND specific object name."""
    
    elif kavram == "Büyük/Küçük":
        obj1, obj2 = random.sample(theme_objects, 2)
        size1, size2 = random.sample(list(SIZE_ALTERNATIVES.keys()), 2)
        return f"""
Examples for size (EXACT format to follow):
- "Hangisi {size1} {obj1}?"
- "Hangisi {size2} {obj2}?"
MANDATORY: Always include both size AND specific object name."""
    
    elif kavram == "Duygular":
        obj1, obj2 = random.sample(theme_objects, 2)
        emotion1, emotion2 = random.sample(EMOTIONS, 2)
        return f"""
Examples for emotions (EXACT format to follow):
- "Hangisi {emotion1} {obj1}?"
- "Hangisi {emotion2} {obj2}?"
MANDATORY: Always include both emotion AND specific object name."""
    
    return "" 