import os
import logging
from datetime import datetime, timezone
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from config.env
load_dotenv('config.env')

def _get_supabase_client():
    """Supabase client'ı Secret Manager'dan yükler"""
    try:
        import google.cloud.secretmanager as secretmanager
        client = secretmanager.SecretManagerServiceClient()
        project_id = os.environ.get("GCP_PROJECT_ID", "plated-shelter-466317-a7")
        
        # Supabase URL'i al
        name = f"projects/{project_id}/secrets/supabase-url/versions/latest"
        response = client.access_secret_version(request={"name": name})
        supabase_url = response.payload.data.decode("UTF-8")
        
        # Supabase Key'i al
        name = f"projects/{project_id}/secrets/supabase-key/versions/latest"
        response = client.access_secret_version(request={"name": name})
        supabase_key = response.payload.data.decode("UTF-8")
        
        return create_client(supabase_url, supabase_key)
    except Exception as e:
        logging.warning(f"Secret Manager'dan Supabase yüklenemedi: {e}")
        # Fallback: environment variable'dan yükle
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_KEY")
        
        # Check if the values are actual credentials (not placeholder text)
        if (supabase_url and supabase_key and 
            supabase_url != "your_supabase_project_url_here" and 
            supabase_key != "your_supabase_anon_key_here"):
            return create_client(supabase_url, supabase_key)
        else:
            logging.warning("Supabase credentials bulunamadı veya placeholder değerler! Mock client kullanılıyor.")
            return None

# Supabase client'ı oluştur (None olabilir)
try:
    supabase: Client = _get_supabase_client()
except Exception as e:
    logging.warning(f"Supabase client oluşturulamadı: {e}")
    supabase = None

def get_child_data(child_id: str) -> dict:
    """Çocuk verilerini getirir"""
    if not supabase:
        logging.error("Supabase bağlantısı yok! Lütfen config.env dosyasında SUPABASE_URL ve SUPABASE_KEY değerlerini kontrol edin.")
        return None
    
    try:
        response = supabase.table("children").select("id,theme,birth_year,is_literate,wants_tts").eq("id", child_id).limit(1).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        logging.error(f"Çocuk verisi getirme hatası: {e}")
        return None

def get_child_roadmap(child_id: str) -> dict:
    """Çocuğun kavram roadmap'ini getirir"""
    if not supabase:
        logging.error("Supabase bağlantısı yok! Lütfen config.env dosyasında SUPABASE_URL ve SUPABASE_KEY değerlerini kontrol edin.")
        return None
    
    try:
        response = supabase.table("concept_roadmap").select("concepts_order").eq("child_id", child_id).limit(1).execute()
        logging.info(f"concept_roadmap response: {response.data}")
        return response.data[0] if response.data else None
    except Exception as e:
        logging.error(f"Roadmap getirme hatası: {e}")
        return None

def find_existing_content(theme: str, concept: str, child_id: str) -> dict:
    """Mevcut içeriği kontrol eder"""
    if not supabase:
        logging.error("Supabase bağlantısı yok! Lütfen config.env dosyasında SUPABASE_URL ve SUPABASE_KEY değerlerini kontrol edin.")
        return None
    
    try:
        response = supabase.table("ai_content").select("*") \
            .eq("theme", theme).eq("concept", concept).eq("child_id", child_id).limit(1).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        logging.error(f"İçerik arama hatası: {e}")
        return None 

def insert_ai_content(child_id: str, theme: str, concept: str, question: str, 
                     correct_image_url: str, wrong_image_url: str, audio_url: str) -> list:
    """AI içeriğini veritabanına kaydeder"""
    if not supabase:
        logging.error("Supabase bağlantısı yok! Lütfen config.env dosyasında SUPABASE_URL ve SUPABASE_KEY değerlerini kontrol edin.")
        return []
    
    try:
        data = {
            "child_id": child_id,
            "theme": theme,
            "concept": concept,
            "question": question,
            "correct_image_url": correct_image_url,
            "wrong_image_url": wrong_image_url,
            "audio_url": audio_url,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        response = supabase.table("ai_content").insert(data).execute()
        return response.data
    except Exception as e:
        logging.error(f"İçerik kaydetme hatası: {e}")
        return []

def soft_delete_ai_content(content_id: str) -> list:
    """İçeriği soft delete yapar"""
    if not supabase:
        logging.error("Supabase bağlantısı yok! Lütfen config.env dosyasında SUPABASE_URL ve SUPABASE_KEY değerlerini kontrol edin.")
        return []
    
    try:
        response = supabase.table("ai_content").update({
            "is_active": False,
            "deleted_at": datetime.now(timezone.utc).isoformat()
        }).eq("id", content_id).execute()
        return response.data
    except Exception as e:
        logging.error(f"İçerik silme hatası: {e}")
        return []

# Game2 için yeni fonksiyonlar
def get_all_game2_objects() -> list:
    """Game2 için tüm nesneleri getirir"""
    if not supabase:
        logging.error("Supabase bağlantısı yok! Lütfen config.env dosyasında SUPABASE_URL ve SUPABASE_KEY değerlerini kontrol edin.")
        return []
    
    try:
        # visuals tablosundan tüm nesneleri getir
        response = supabase.table("visuals").select("*").execute()
        
        if response.data:
            # Verileri Game2 formatına dönüştür
            objects = []
            for item in response.data:
                objects.append({
                    "id": item.get("id"),  # UUID'yi olduğu gibi kullan
                    "name": item.get("name", "").lower(),  # Küçük harfe çevir
                    "image_url": item.get("image_url", "")
                })
            return objects
        logging.warning("Supabase'den nesne bulunamadı")
        return []
    except Exception as e:
        logging.error(f"Game2 nesneleri getirme hatası: {e}")
        return []

def get_game2_objects(theme: str) -> list:
    """Game2 için tema bazlı nesneleri getirir (geriye uyumluluk için)"""
    return get_all_game2_objects()

def get_all_game2_actions() -> list:
    """Game2 için tüm eylemleri getirir"""
    if not supabase:
        logging.error("Supabase bağlantısı yok! Lütfen config.env dosyasında SUPABASE_URL ve SUPABASE_KEY değerlerini kontrol edin.")
        return []
    
    try:
        # game2_actions tablosundan tüm eylemleri getir
        response = supabase.table("game2_actions").select("*").execute()
        
        if response.data:
            # Verileri Game2 formatına dönüştür
            actions = []
            for item in response.data:
                actions.append({
                    "id": item.get("id"),
                    "name": item.get("name", "").lower(),  # Küçük harfe çevir
                    "image_url": item.get("image_url", "")
                })
            return actions
        logging.warning("Supabase'den eylem bulunamadı")
        return []
    except Exception as e:
        logging.error(f"Game2 eylemleri getirme hatası: {e}")
        return []

def get_game2_actions(theme: str) -> list:
    """Game2 için tema bazlı eylemleri getirir (geriye uyumluluk için)"""
    return get_all_game2_actions()

def insert_game2_usage(child_id: str, object_name: str, action_name: str, generated_sentence: str, audio_url: str) -> list:
    """Game2 kullanım verilerini kaydeder"""
    if not supabase:
        logging.error("Supabase bağlantısı yok! Lütfen config.env dosyasında SUPABASE_URL ve SUPABASE_KEY değerlerini kontrol edin.")
        return []
    
    try:
        data = {
            "child_id": child_id,
            "object_name": object_name,
            "action_name": action_name,
            "generated_sentence": generated_sentence,
            "audio_url": audio_url,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        response = supabase.table("game2_usage").insert(data).execute()
        return response.data
    except Exception as e:
        logging.error(f"Game2 kullanım verisi kaydetme hatası: {e}")
        return []

def get_action_template(object_name: str) -> str:
    """Nesne için action template'i getirir"""
    if not supabase:
        return f"{object_name} {{verb}}"
    
    try:
        # visuals tablosundan action_template'i getir
        response = supabase.table("visuals").select("action_template").eq("name", object_name.capitalize()).limit(1).execute()
        if response.data and response.data[0].get("action_template"):
            return response.data[0]["action_template"]
        return f"{object_name} {{verb}}"
    except Exception as e:
        logging.error(f"Action template getirme hatası: {e}")
        return f"{object_name} {{verb}}"

def get_game2_user_settings(child_id: str) -> dict:
    """Kullanıcının Game2 ayarlarını getirir"""
    if not supabase:
        logging.error("Supabase bağlantısı yok! Lütfen config.env dosyasında SUPABASE_URL ve SUPABASE_KEY değerlerini kontrol edin.")
        return {"selected_object_ids": [], "selected_action_ids": []}
    
    try:
        response = supabase.table("game2_user_settings").select("selected_object_ids, selected_action_ids").eq("child_id", child_id).limit(1).execute()
        if response.data:
            return response.data[0]
        return {"selected_object_ids": [], "selected_action_ids": []}
    except Exception as e:
        logging.error(f"Game2 kullanıcı ayarları getirme hatası: {e}")
        return {"selected_object_ids": [], "selected_action_ids": []}

def update_game2_settings(child_id: str, selected_object_ids: list, selected_action_ids: list) -> bool:
    """Game2 ayarlarını günceller"""
    if not supabase:
        logging.error("Supabase bağlantısı yok! Lütfen config.env dosyasında SUPABASE_URL ve SUPABASE_KEY değerlerini kontrol edin.")
        return False
    
    try:
        # Mevcut ayarları kontrol et
        existing = supabase.table("game2_user_settings").select("id").eq("child_id", child_id).execute()
        
        data = {
            "child_id": child_id,
            "selected_object_ids": selected_object_ids,
            "selected_action_ids": selected_action_ids,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        if existing.data:
            # Mevcut ayarları güncelle
            response = supabase.table("game2_user_settings").update(data).eq("child_id", child_id).execute()
        else:
            # Yeni ayar oluştur
            data["created_at"] = datetime.now(timezone.utc).isoformat()
            response = supabase.table("game2_user_settings").insert(data).execute()
        
        return bool(response.data)
    except Exception as e:
        logging.error(f"Game2 ayarları güncelleme hatası: {e}")
        return False 
