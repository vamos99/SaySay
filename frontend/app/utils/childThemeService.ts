import { supabase } from './supabaseClient';

export async function getChildTheme(childId: string): Promise<string> {
  try {
    // Önce çocuk verilerini al
    const { data: childData, error: childError } = await supabase
      .from('children')
      .select('theme')
      .eq('id', childId)
      .single();

    if (childError) {
      console.error('Çocuk verisi alma hatası:', childError);
      return 'genel'; // Varsayılan tema
    }

    if (childData?.theme) {
      return childData.theme;
    }

    // Eğer tema yoksa roadmap'ten al
    const { data: roadmapData, error: roadmapError } = await supabase
      .from('roadmaps')
      .select('theme')
      .eq('child_id', childId)
      .single();

    if (roadmapError) {
      console.error('Roadmap verisi alma hatası:', roadmapError);
      return 'genel'; // Varsayılan tema
    }

    return roadmapData?.theme || 'genel';
  } catch (error) {
    console.error('Tema alma hatası:', error);
    return 'genel'; // Varsayılan tema
  }
}

export const DEFAULT_THEMES = [
  'hayvanlar',
  'renkler',
  'sayılar',
  'şekiller',
  'meslekler',
  'taşıtlar',
  'meyveler',
  'sebzeler',
  'oyuncaklar',
  'okul',
  'ev',
  'park',
  'genel'
]; 