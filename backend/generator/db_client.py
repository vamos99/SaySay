import os
import logging
from datetime import datetime, timezone
from supabase import create_client, Client

def _get_supabase_client():
    """Supabase client'ı Secret Manager'dan yükler"""
    try:
        import google.cloud.secretmanager as secretmanager
        client = secretmanager.SecretManagerServiceClient()
        project_id = "plated-shelter-466317-a7"
        
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
        if supabase_url and supabase_key:
            return create_client(supabase_url, supabase_key)
        else:
            raise Exception("Supabase credentials bulunamadı!")

supabase: Client = _get_supabase_client()

def get_child_data(child_id: str) -> dict:
    """Çocuk verilerini getirir"""
    response = supabase.table("children").select("id,theme,birth_year,is_literate,wants_tts").eq("id", child_id).limit(1).execute()
    return response.data[0] if response.data else None

def get_child_roadmap(child_id: str) -> dict:
    """Çocuğun kavram roadmap'ini getirir"""
    response = supabase.table("concept_roadmap").select("concepts_order").eq("child_id", child_id).limit(1).execute()
    logging.info(f"concept_roadmap response: {response.data}")
    return response.data[0] if response.data else None

def find_existing_content(theme: str, concept: str, child_id: str) -> dict:
    """Mevcut içeriği kontrol eder"""
    response = supabase.table("ai_content").select("*") \
        .eq("theme", theme).eq("concept", concept).eq("child_id", child_id).limit(1).execute()
    return response.data[0] if response.data else None 

def insert_ai_content(child_id: str, theme: str, concept: str, question: str, 
                     correct_image_url: str, wrong_image_url: str, audio_url: str) -> list:
    """AI içeriğini veritabanına kaydeder"""
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

def soft_delete_ai_content(content_id: str) -> list:
    """İçeriği soft delete yapar"""
    response = supabase.table("ai_content").update({
        "is_active": False,
        "deleted_at": datetime.now(timezone.utc).isoformat()
    }).eq("id", content_id).execute()
    return response.data 