import { supabase } from './supabaseClient';

// PIN oluşturma (4 haneli)
export const generatePIN = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// PIN hash'leme (basit hash - production'da bcrypt kullanılmalı)
export const hashPIN = (pin: string): string => {
  // Basit hash fonksiyonu - gerçek uygulamada bcrypt kullanılmalı
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32-bit integer'a dönüştür
  }
  return hash.toString();
};

// PIN doğrulama
export const verifyPIN = (inputPIN: string, hashedPIN: string): boolean => {
  return hashPIN(inputPIN) === hashedPIN;
};

// Ebeveyn için PIN oluştur ve tüm çocuklarına kaydet
export const createParentPIN = async (userId: string): Promise<string> => {
  const pin = generatePIN();
  
  // Ebeveynin tüm çocuklarına açık PIN'i kaydet (hash'leme yok)
  const { error } = await supabase
    .from('children')
    .update({ pin_hash: pin })
    .eq('user_id', userId);
  
  if (error) {
    throw new Error('PIN kaydedilemedi');
  }
  
  return pin; // Açık PIN'i döndür (ebeveyne gösterilecek)
};

// Çocuk için PIN oluştur ve kaydet (tek çocuk için)
export const createChildPIN = async (childId: string): Promise<string> => {
  const pin = generatePIN();
  const hashedPIN = hashPIN(pin);
  
  const { error } = await supabase
    .from('children')
    .update({ pin_hash: hashedPIN })
    .eq('id', childId);
  
  if (error) {
    throw new Error('PIN kaydedilemedi');
  }
  
  return pin; // Açık PIN'i döndür (ebeveyne gösterilecek)
};

// PIN güncelleme
export const updateChildPIN = async (childId: string, newPIN: string): Promise<void> => {
  const { error } = await supabase
    .from('children')
    .update({ pin_hash: newPIN })
    .eq('id', childId);
  
  if (error) {
    throw new Error('PIN güncellenemedi');
  }
};

// PIN doğrulama (çocuk ID ile)
export const verifyChildPIN = async (childId: string, inputPIN: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('children')
    .select('pin_hash')
    .eq('id', childId)
    .single();
  
  if (error || !data) {
    return false;
  }
  
  // Eğer pin_hash yoksa, PIN yok demektir
  if (!data.pin_hash) {
    return false;
  }
  
  // DB'de açık PIN saklanıyor, direkt karşılaştır
  return inputPIN === data.pin_hash;
}; 