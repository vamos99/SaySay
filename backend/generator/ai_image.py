import warnings
warnings.filterwarnings("ignore", category=UserWarning)

import vertexai
from vertexai.vision_models import ImageGenerationModel
import os
import json
import uuid
import random
import logging
from pathlib import Path
from google.oauth2 import service_account
from storage_utils import upload_to_gcs

THEME_OBJECTS = {
    "Korsanlar": ["korsan şapkası", "papağan", "hazine sandığı", "korsan gemisi", "bayrak", "kılıç", "dürbün", "harita", "gözlük", "altın", "mücevher", "top", "yelken", "çapa", "zincir", "su şişesi"],
    "Korsan": ["korsan şapkası", "papağan", "hazine sandığı", "korsan gemisi", "bayrak", "kılıç", "dürbün", "harita", "gözlük", "altın", "mücevher", "top", "yelken", "çapa", "zincir", "su şişesi"],
    "Uzay": ["roket", "yıldız", "gezegen", "astronot", "ufo", "ay", "kuyruklu yıldız", "uzay istasyonu", "meteor", "galaksi", "uydu", "teleskop", "uzay aracı", "nebula", "uzaylı", "robot"],
    "Orman": ["ağaç", "çiçek", "kelebek", "sincap", "mantar", "yaprak", "kuş", "böcek", "karınca", "arı", "kurtçuk", "tırtıl", "yosun", "kozalak", "dal", "kök"],
    "Deniz": ["balık", "deniz yıldızı", "yengeç", "deniz kabuğu", "balina", "denizatı", "mürekkep balığı", "yunus", "köpekbalığı", "mercan", "deniz anası", "kaplumbağa", "fok", "penguen", "ahtapot", "karides"],
    "Çiftlik": ["tavuk", "inek", "koyun", "at", "domuz", "horoz", "köpek", "kedi", "keçi", "ördek", "kaz", "hindi", "eşek", "tavşan", "saman", "çit"]
}

OBJECT_TRANSLATIONS = {
    "korsan şapkası": "pirate hat",
    "papağan": "parrot", 
    "hazine sandığı": "treasure chest",
    "korsan gemisi": "pirate ship",
    "bayrak": "flag",
    "kılıç": "sword",
    "dürbün": "telescope", 
    "harita": "map",
    "gözlük": "eyepatch",
    "altın": "gold coin",
    "mücevher": "jewel",
    "top": "cannon",
    "yelken": "sail",
    "çapa": "anchor",
    "zincir": "chain",
    "su şişesi": "water bottle",
    "roket": "rocket",
    "yıldız": "star",
    "gezegen": "planet", 
    "astronot": "astronaut",
    "ufo": "ufo",
    "ay": "moon",
    "kuyruklu yıldız": "comet",
    "uzay istasyonu": "space station",
    "meteor": "meteor",
    "galaksi": "galaxy",
    "uydu": "satellite",
    "teleskop": "telescope",
    "uzay aracı": "spaceship",
    "nebula": "nebula",
    "uzaylı": "alien",
    "robot": "robot",
    "ağaç": "tree",
    "çiçek": "flower",
    "kelebek": "butterfly",
    "sincap": "squirrel", 
    "mantar": "mushroom",
    "yaprak": "leaf",
    "kuş": "bird",
    "böcek": "insect",
    "karınca": "ant",
    "arı": "bee",
    "kurtçuk": "worm",
    "tırtıl": "caterpillar",
    "yosun": "moss",
    "kozalak": "pinecone",
    "dal": "branch",
    "kök": "root",
    "balık": "fish",
    "deniz yıldızı": "starfish",
    "yengeç": "crab",
    "deniz kabuğu": "seashell", 
    "balina": "whale",
    "denizatı": "seahorse",
    "mürekkep balığı": "octopus",
    "yunus": "dolphin",
    "köpekbalığı": "shark",
    "mercan": "coral",
    "deniz anası": "jellyfish",
    "kaplumbağa": "turtle",
    "fok": "seal",
    "penguen": "penguin",
    "ahtapot": "octopus",
    "karides": "shrimp",
    "tavuk": "chicken",
    "inek": "cow",
    "koyun": "sheep",
    "at": "horse",
    "domuz": "pig", 
    "horoz": "rooster",
    "köpek": "dog",
    "kedi": "cat",
    "keçi": "goat",
    "ördek": "duck",
    "kaz": "goose",
    "hindi": "turkey",
    "eşek": "donkey",
    "tavşan": "rabbit",
    "saman": "hay",
    "çit": "fence"
}

THEME_BACKGROUNDS = {
    "Korsan": "pirate ship deck background, ocean waves, treasure island",
    "Korsanlar": "pirate ship deck background, ocean waves, treasure island", 
    "Uzay": "space background, stars and nebula, cosmic scene",
    "Orman": "forest background, green trees and nature",
    "Deniz": "underwater background, coral reef, ocean floor",
    "Çiftlik": "farm background, barn and fields, countryside"
}

COLORS = {
    "kırmızı": "red",
    "mavi": "blue", 
    "yeşil": "green",
    "sarı": "yellow",
    "pembe": "pink",
    "mor": "purple",
    "turuncu": "orange",
    "siyah": "black",
    "beyaz": "white"
}

COLOR_ALTERNATIVES = {
    "kırmızı": ["mavi", "yeşil", "sarı"],
    "mavi": ["kırmızı", "yeşil", "mor"], 
    "yeşil": ["kırmızı", "mavi", "sarı"],
    "sarı": ["mavi", "mor", "kırmızı"],
    "pembe": ["mavi", "yeşil", "mor"],
    "mor": ["sarı", "yeşil", "turuncu"],
    "turuncu": ["mavi", "mor", "yeşil"],
    "siyah": ["beyaz", "sarı", "kırmızı"],
    "beyaz": ["siyah", "mavi", "mor"]
}

SIZE_ALTERNATIVES = {
    "büyük": "small",
    "küçük": "big"
}

NUMBER_ALTERNATIVES = {
    "1": "3", "bir": "3", "tek": "3",
    "2": "1", "iki": "1", "çift": "1", 
    "3": "1", "üç": "1"
}

def generate_image_prompts(theme, question, concept):
    """Tema, soru ve kavrama göre görsel promptları üretir"""
    theme_background = THEME_BACKGROUNDS.get(theme, "simple clean background")
    base_style = f"cartoon style, children's book illustration, {theme_background}, NO TEXT, NO WORDS, NO LETTERS, NO NUMBERS, NO SYMBOLS, NO WRITING, NO LABELS"
    
    question_lower = question.lower()
    theme_objects = THEME_OBJECTS.get(theme, ["nesne"])
    
    # Sorudan nesne tespit et
    detected_object = _detect_object_from_question(question_lower, theme_objects)
    
    # Kavrama göre prompt üret
    if concept == "Renkler" or any(color in question_lower for color in COLORS.keys()):
        return _generate_color_prompts(question_lower, detected_object, base_style)
    elif concept == "Büyük/Küçük" or "büyük" in question_lower or "küçük" in question_lower:
        return _generate_size_prompts(question_lower, detected_object, base_style)
    elif concept == "Sayılar" or any(num in question_lower for num in NUMBER_ALTERNATIVES.keys()):
        return _generate_number_prompts(question_lower, detected_object, base_style)
    elif concept == "Duygular" or "mutlu" in question_lower or "üzgün" in question_lower:
        return _generate_emotion_prompts(question_lower, detected_object, base_style)
    else:
        return _generate_general_prompts(detected_object, theme_objects, base_style)

def _detect_object_from_question(question_lower, theme_objects):
    """Sorudan nesne tespit eder"""
    for obj in theme_objects:
        if obj in question_lower:
            return obj
        # Çok kelimeli nesneler için kelime kontrolü
        obj_words = obj.split()
        question_words = question_lower.split()
        for obj_word in obj_words:
            if obj_word in question_words:
                return obj
    return random.choice(theme_objects)

def _generate_color_prompts(question_lower, detected_object, base_style):
    """Renk kavramı için promptlar"""
    detected_color = None
    for color in COLORS.keys():
        if color in question_lower:
            detected_color = color
            break
    
    english_object = OBJECT_TRANSLATIONS.get(detected_object, detected_object)
    
    if detected_color:
        english_color = COLORS[detected_color]
        wrong_color_turkish = random.choice(COLOR_ALTERNATIVES[detected_color])
        wrong_color_english = COLORS[wrong_color_turkish]
        return (f"A {english_color} {english_object}, {base_style}",
                f"A {wrong_color_english} {english_object}, {base_style}")
    else:
        return (f"A colorful {english_object}, {base_style}",
                f"A gray {english_object}, {base_style}")

def _generate_size_prompts(question_lower, detected_object, base_style):
    """Boyut kavramı için promptlar"""
    english_object = OBJECT_TRANSLATIONS.get(detected_object, detected_object)
    
    if "büyük" in question_lower:
        return (f"A big {english_object}, {base_style}",
                f"A small {english_object}, {base_style}")
    else:
        return (f"A small {english_object}, {base_style}",
                f"A big {english_object}, {base_style}")

def _generate_number_prompts(question_lower, detected_object, base_style):
    """Sayı kavramı için promptlar"""
    detected_number = None
    for num in NUMBER_ALTERNATIVES.keys():
        if num in question_lower:
            detected_number = num
            break
    
    english_object = OBJECT_TRANSLATIONS.get(detected_object, detected_object)
    
    if detected_number:
        correct_count = _get_count_value(detected_number)
        wrong_count = NUMBER_ALTERNATIVES[detected_number]
        
        correct_text = "One" if correct_count == "1" else f"{correct_count} {_get_plural_form(english_object)}"
        wrong_text = "One" if wrong_count == "1" else f"{wrong_count} {_get_plural_form(english_object)}"
        
        return (f"{correct_text} {english_object if correct_count == '1' else ''}, {base_style}".strip(),
                f"{wrong_text} {english_object if wrong_count == '1' else ''}, {base_style}".strip())
    else:
        return (f"Multiple {english_object}, {base_style}",
                f"One {english_object}, {base_style}")

def _generate_emotion_prompts(question_lower, detected_object, base_style):
    """Duygu kavramı için promptlar"""
    english_object = OBJECT_TRANSLATIONS.get(detected_object, detected_object)
    
    if "mutlu" in question_lower:
        return (f"A happy {english_object}, {base_style}",
                f"A sad {english_object}, {base_style}")
    else:
        return (f"A sad {english_object}, {base_style}",
                f"A happy {english_object}, {base_style}")

def _generate_general_prompts(detected_object, theme_objects, base_style):
    """Genel durum için promptlar"""
    other_objects = [obj for obj in theme_objects if obj != detected_object]
    wrong_object = random.choice(other_objects) if other_objects else detected_object
    
    english_object = OBJECT_TRANSLATIONS.get(detected_object, detected_object)
    english_wrong_object = OBJECT_TRANSLATIONS.get(wrong_object, wrong_object)
    
    return (f"A {english_object}, {base_style}",
            f"A {english_wrong_object}, {base_style}")

def _get_count_value(detected_number):
    """Sayıyı İngilizce değere çevirir"""
    if detected_number.isdigit():
        return detected_number
    elif detected_number in ["bir", "tek"]:
        return "1"
    elif detected_number in ["iki", "çift"]:
        return "2"
    else:
        return "3"

def _get_plural_form(english_object):
    """İngilizce çoğul formu döndürür"""
    if english_object.endswith('fish') or english_object.endswith('s'):
        return english_object
    return english_object + "s"

def generate_image(prompt: str):
    """Vertex AI ile görsel üretir"""
    PROJECT_ID = os.getenv("PROJECT_ID", "plated-shelter-466317-a7")
    LOCATION = os.getenv("LOCATION", "us-central1")
    
    # Vertex AI'yi başlat
    USE_LOCAL_CREDENTIALS = os.getenv("USE_LOCAL_CREDENTIALS", "true").lower() == "true"
    if USE_LOCAL_CREDENTIALS:
        credentials = _get_service_account_credentials()
        vertexai.init(project=PROJECT_ID, location=LOCATION, credentials=credentials)
    else:
        vertexai.init(project=PROJECT_ID, location=LOCATION)

    model = ImageGenerationModel.from_pretrained("imagen-4.0-fast-generate-preview-06-06")
    
    response = model.generate_images(
        prompt=prompt,
        number_of_images=1,
        aspect_ratio="1:1",
        negative_prompt="text, words, letters, numbers, symbols, writing, labels, speech bubbles, dialogue, captions, titles, watermarks, signatures, annotations, branded text, theme names, topic names",
        person_generation="allow_all",
        safety_filter_level="block_few",
    )
    
    if response.images:
        image = response.images[0]
        image_bytes = image._image_bytes
        return upload_to_gcs(image_bytes, "image/png", "images", "png")
    else:
        raise Exception("Görsel üretilemedi")

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