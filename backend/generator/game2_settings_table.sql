-- Game2 Kullanıcı Ayarları Tablosu
CREATE TABLE game2_user_settings (
    id SERIAL PRIMARY KEY,
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    selected_object_ids INTEGER[] DEFAULT '{}',
    selected_action_ids INTEGER[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(child_id)
);

-- İndeksler
CREATE INDEX idx_game2_user_settings_child_id ON game2_user_settings(child_id);
CREATE INDEX idx_game2_user_settings_updated_at ON game2_user_settings(updated_at);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_game2_user_settings_updated_at 
    BEFORE UPDATE ON game2_user_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Örnek veri (opsiyonel)
-- INSERT INTO game2_user_settings (child_id, selected_object_ids, selected_action_ids) VALUES
-- ('your-child-uuid-here', ARRAY[1,2,3], ARRAY[1,2,3,4,5]); 