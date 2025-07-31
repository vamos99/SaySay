// Güvenli Cache Manager - Sadece public data için
export class SecureCacheManager {
  // Sadece public data için cache prefix'leri
  static CACHE_PREFIXES = {
    THEMES: 'public_themes_',
    AVATARS: 'public_avatars_',
    CATEGORIES: 'public_categories_',
    UI_DATA: 'public_ui_',
    AI_CONTENT: 'public_ai_content_' // Sadece public AI content
  };
  
  // Cache süreleri
  static DURATIONS = {
    STATIC: 24 * 60 * 60 * 1000, // 24 saat (themes, avatars, categories)
    UI: 60 * 60 * 1000,          // 1 saat (UI data)
  };

  // Güvenli cache key oluşturma
  static getCacheKey(prefix: string, identifier?: string): string {
    return identifier ? `${prefix}${identifier}` : prefix;
  }

  // Cache'den veri alma
  static getCachedData(prefix: string, identifier?: string) {
    try {
      const cacheKey = this.getCacheKey(prefix, identifier);
      const cached = sessionStorage.getItem(cacheKey); // localStorage yerine sessionStorage
      
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      // Cache süresi kontrolü
      const duration = this.getDuration(prefix);
      if (now - timestamp > duration) {
        sessionStorage.removeItem(cacheKey);
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Cache okuma hatası:', error);
      return null;
    }
  }

  // Cache'e veri kaydetme
  static setCachedData(prefix: string, data: any, identifier?: string) {
    try {
      const cacheKey = this.getCacheKey(prefix, identifier);
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Cache yazma hatası:', error);
    }
  }

  // Cache temizleme
  static clearCache(prefix?: string) {
    if (prefix) {
      // Belirli prefix'i temizle
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith(prefix)) {
          sessionStorage.removeItem(key);
        }
      });
    } else {
      // Tüm public cache'leri temizle
      Object.keys(sessionStorage).forEach(key => {
        if (Object.values(this.CACHE_PREFIXES).some(p => key.startsWith(p))) {
          sessionStorage.removeItem(key);
        }
      });
    }
  }

  // Cache durumu
  static getCacheStatus() {
    const cacheKeys = Object.keys(sessionStorage).filter(key => 
      Object.values(this.CACHE_PREFIXES).some(p => key.startsWith(p))
    );
    
    return {
      totalCached: cacheKeys.length,
      cacheKeys: cacheKeys.map(key => {
        const prefix = Object.values(this.CACHE_PREFIXES).find(p => key.startsWith(p));
        return prefix ? key.replace(prefix, '') : key;
      })
    };
  }

  // Cache süresi belirleme
  private static getDuration(prefix: string): number {
    if (prefix === this.CACHE_PREFIXES.THEMES || 
        prefix === this.CACHE_PREFIXES.AVATARS || 
        prefix === this.CACHE_PREFIXES.CATEGORIES) {
      return this.DURATIONS.STATIC;
    }
    return this.DURATIONS.UI;
  }

  // Güvenlik kontrolü - sadece public data cache'lenebilir
  static isPublicData(dataType: string): boolean {
    return Object.values(this.CACHE_PREFIXES).some(prefix => 
      dataType.startsWith(prefix)
    );
  }
}

// Güvenli cache hook'u
export const useSecureCache = () => {
  const getCached = (prefix: string, identifier?: string) => {
    return SecureCacheManager.getCachedData(prefix, identifier);
  };

  const setCached = (prefix: string, data: any, identifier?: string) => {
    // Sadece public data cache'lenebilir
    if (SecureCacheManager.isPublicData(prefix)) {
      SecureCacheManager.setCachedData(prefix, data, identifier);
    }
  };

  const clearCache = (prefix?: string) => {
    SecureCacheManager.clearCache(prefix);
  };

  const getStatus = () => {
    return SecureCacheManager.getCacheStatus();
  };

  return { getCached, setCached, clearCache, getStatus };
}; 