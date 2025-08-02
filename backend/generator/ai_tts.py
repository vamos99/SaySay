import os
import wave
import logging
import base64
from google import genai
from google.genai import types
import io
import random

# Load environment variables from config.env
from dotenv import load_dotenv
load_dotenv('config.env')

def wave_file(filename, pcm, channels=1, rate=24000, sample_width=2):
    """PCM verisini WAV dosyası olarak kaydeder (tts_local_test.py'den kopya)"""
    if isinstance(filename, str):
        # Dosya adı verilmişse dosyaya yaz
        with wave.open(filename, "wb") as wf:
            wf.setnchannels(channels)
            wf.setsampwidth(sample_width)
            wf.setframerate(rate)
            wf.writeframes(pcm)
    else:
        # Buffer verilmişse buffer'a yaz
        filename.write(wave.struct.pack('<4sI4s', b'RIFF', 36 + len(pcm), b'WAVE'))
        filename.write(wave.struct.pack('<4sIHHIIHH', b'fmt ', 16, 1, channels, rate, rate * channels * sample_width, channels * sample_width, sample_width * 8))
        filename.write(wave.struct.pack('<4sI', b'data', len(pcm)))
        filename.write(pcm)

def _get_gemini_model():
    """Gemini model adını Secret Manager'dan alır"""
    try:
        import google.cloud.secretmanager as secretmanager
        client = secretmanager.SecretManagerServiceClient()
        project_id = "plated-shelter-466317-a7"
        name = f"projects/{project_id}/secrets/gemini-model-tts/versions/latest"
        response = client.access_secret_version(request={"name": name})
        return response.payload.data.decode("UTF-8")
    except Exception as e:
        logging.warning(f"Secret Manager'dan model adı yüklenemedi: {e}")
        # Fallback: default model
        return "gemini-2.5-flash-preview-tts"

def generate_tts_audio(text: str, voice_name: str = 'Sulafat', file_name: str = None) -> bytes:
    """Gemini API ile TTS audio üretir"""
    api_key = _get_api_key()
    if not api_key:
        raise Exception("API key bulunamadı!")
    
    try:
        client = genai.Client(api_key=api_key)
        # Model adını Secret Manager'dan al
        model_name = _get_gemini_model()
        response = client.models.generate_content(
            model=model_name,
            contents=text,
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name=voice_name,
                        )
                    ),
                )
            )
        )
        data = response.candidates[0].content.parts[0].inline_data.data
        
        # WAV header ekle (tts_local_test.py gibi)
        wav_buffer = io.BytesIO()
        wave_file(wav_buffer, data)
        audio_bytes = wav_buffer.getvalue()
        
        # Dosya olarak kaydet (opsiyonel)
        if file_name:
            with open(file_name, 'wb') as f:
                f.write(audio_bytes)
            logging.info(f"TTS audio kaydedildi: {file_name}")
        
        return audio_bytes  # Başarılı olursa döndür
        
    except Exception as e:
        raise Exception(f"TTS audio üretilemedi: {e}")

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

# Test kodu
if __name__ == "__main__":
    import time
    
    print("🎵 TTS Test Başlıyor...")
    
    try:
        # Test metni
        test_text = "Merhaba, bu bir test sesidir. Gemini TTS çalışıyor!"
        
        print(f"📝 Metin: {test_text}")
        print("⏳ Ses üretiliyor...")
        
        # Ses üret
        audio_bytes = generate_tts_audio(
            text=test_text,
            voice_name="Sulafat",
            file_name="test_new.wav"
        )
        
        print(f"✅ Başarılı! Dosya boyutu: {len(audio_bytes)} bytes")
        print("📁 test_new.wav dosyası oluşturuldu")
        
    except Exception as e:
        print(f"❌ Hata: {e}")