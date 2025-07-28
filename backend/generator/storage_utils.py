import os
import json
import uuid
import logging
from pathlib import Path
from google.cloud import storage
from google.oauth2 import service_account
    
def _get_bucket_name():
    """Bucket name'i Secret Manager'dan alır"""
    try:
        import google.cloud.secretmanager as secretmanager
        client = secretmanager.SecretManagerServiceClient()
        project_id = "plated-shelter-466317-a7"
        name = f"projects/{project_id}/secrets/gcs-bucket-name/versions/latest"
        response = client.access_secret_version(request={"name": name})
        return response.payload.data.decode("UTF-8")
    except Exception as e:
        logging.warning(f"Secret Manager'dan bucket name yüklenemedi: {e}")
        # Fallback: environment variable'dan yükle
        bucket_name = os.environ.get("GCS_BUCKET_NAME")
        if bucket_name:
            return bucket_name
        else:
            raise Exception("GCS_BUCKET_NAME bulunamadı!")

def upload_to_gcs(file_bytes: bytes, file_type: str, folder: str, extension: str) -> str:
    """Google Cloud Storage'a dosya yükler"""
    bucket_name = _get_bucket_name()
    
    # Service account kimlik doğrulaması
    USE_LOCAL_CREDENTIALS = os.getenv("USE_LOCAL_CREDENTIALS", "true").lower() == "true"
    if USE_LOCAL_CREDENTIALS:
        credentials = _get_service_account_credentials()
        client = storage.Client(credentials=credentials)
    else:
        client = storage.Client()
    
    bucket = client.bucket(bucket_name)
    folder = folder.strip("/")
    filename = f"{folder}/{uuid.uuid4()}.{extension}"
    blob = bucket.blob(filename)
    
    # Bytes kontrolü
    if isinstance(file_bytes, bytes):
        blob.upload_from_string(file_bytes, content_type=file_type)
    else:
        blob.upload_from_string(str(file_bytes), content_type=file_type)
    
    return f"https://storage.googleapis.com/{bucket_name}/{filename}"

def delete_from_gcs(file_url: str) -> bool:
    """Google Cloud Storage'dan dosya siler"""
    try:
        bucket_name = _get_bucket_name()
        filename = file_url.replace(f"https://storage.googleapis.com/{bucket_name}/", "")
        
        USE_LOCAL_CREDENTIALS = os.getenv("USE_LOCAL_CREDENTIALS", "true").lower() == "true"
        if USE_LOCAL_CREDENTIALS:
            credentials = _get_service_account_credentials()
            client = storage.Client(credentials=credentials)
        else:
            client = storage.Client()
    
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(filename)
        blob.delete()
        
        logging.info(f"Dosya silindi: {filename}")
        return True
    except Exception as e:
        logging.error(f"Dosya silme hatası: {e}")
        return False

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