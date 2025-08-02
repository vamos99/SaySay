interface CachedGameContent {
  childId: string;
  content: any[];
  timestamp: number;
  childName: string;
}

class GameCache {
  private cache: Map<string, CachedGameContent> = new Map();
  private readonly MAX_CACHE_SIZE = 2;
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 saat
  private readonly STORAGE_KEY = 'game_cache';

  constructor() {
    this.loadFromStorage();
  }

  // Cache'e içerik ekle
  set(childId: string, content: any[], childName: string): void {
    // Cache boyutu kontrol et
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.removeOldest();
    }

    this.cache.set(childId, {
      childId,
      content,
      timestamp: Date.now(),
      childName
    });

             // LocalStorage'a kaydet
         this.saveToStorage();
       }

  // Cache'den içerik al
  get(childId: string): any[] | null {
    const cached = this.cache.get(childId);
    
             if (!cached) {
           return null;
         }

    // Cache süresi kontrol et
    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(childId);
      this.saveToStorage(); // Update storage after deletion
      return null;
    }

    return cached.content;
  }

  // Cache'de var mı kontrol et
  has(childId: string): boolean {
    const cached = this.cache.get(childId);
    if (!cached) return false;
    
    // Cache süresi kontrol et
    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(childId);
      return false;
    }
    
    return true;
  }

  // En eski cache'i sil
  private removeOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, value] of this.cache.entries()) {
      if (value.timestamp < oldestTime) {
        oldestTime = value.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      const removed = this.cache.get(oldestKey);
      this.cache.delete(oldestKey);
      this.saveToStorage(); // Update storage after deletion
    }
  }

  // Cache durumunu göster
  getStatus(): void {
    // Debug için kullanılabilir
  }

  // Cache'i temizle
  clear(): void {
    this.cache.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  // LocalStorage'dan yükle
  private loadFromStorage(): void {
    try {
      // Server-side rendering sırasında localStorage yok
      if (typeof window === 'undefined') {
        return;
      }
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.cache = new Map(Object.entries(data));

      }
    } catch (error) {
      console.error('Cache yükleme hatası:', error);
    }
  }

  // LocalStorage'a kaydet
  private saveToStorage(): void {
    try {
      // Server-side rendering sırasında localStorage yok
      if (typeof window === 'undefined') {
        return;
      }
      const data = Object.fromEntries(this.cache);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Cache kaydetme hatası:', error);
    }
  }
}

export const gameCache = new GameCache(); 