-- Game2 için gerekli tabloları oluştur

-- Game2 nesneler tablosu
CREATE TABLE IF NOT EXISTS game2_objects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL,
    theme VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game2 eylemler tablosu
CREATE TABLE IF NOT EXISTS game2_actions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image_url TEXT NOT NULL,
    theme VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game2 kullanım verileri tablosu
CREATE TABLE IF NOT EXISTS game2_usage (
    id SERIAL PRIMARY KEY,
    child_id UUID REFERENCES children(id),
    object_name VARCHAR(100) NOT NULL,
    action_name VARCHAR(100) NOT NULL,
    generated_sentence TEXT NOT NULL,
    audio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_game2_objects_theme ON game2_objects(theme);
CREATE INDEX IF NOT EXISTS idx_game2_objects_active ON game2_objects(is_active);
CREATE INDEX IF NOT EXISTS idx_game2_actions_theme ON game2_actions(theme);
CREATE INDEX IF NOT EXISTS idx_game2_actions_active ON game2_actions(is_active);
CREATE INDEX IF NOT EXISTS idx_game2_usage_child_id ON game2_usage(child_id);
CREATE INDEX IF NOT EXISTS idx_game2_usage_created_at ON game2_usage(created_at);

-- Örnek veriler - Hayvanlar teması
INSERT INTO game2_objects (name, image_url, theme) VALUES
('kedi', 'https://storage.googleapis.com/saysay-images/animals/cat.jpg', 'hayvanlar'),
('köpek', 'https://storage.googleapis.com/saysay-images/animals/dog.jpg', 'hayvanlar'),
('kuş', 'https://storage.googleapis.com/saysay-images/animals/bird.jpg', 'hayvanlar'),
('balık', 'https://storage.googleapis.com/saysay-images/animals/fish.jpg', 'hayvanlar'),
('tavşan', 'https://storage.googleapis.com/saysay-images/animals/rabbit.jpg', 'hayvanlar')
ON CONFLICT DO NOTHING;

INSERT INTO game2_actions (name, image_url, theme) VALUES
('koşmak', 'https://storage.googleapis.com/saysay-images/actions/run.jpg', 'hayvanlar'),
('yemek yemek', 'https://storage.googleapis.com/saysay-images/actions/eat.jpg', 'hayvanlar'),
('uyumak', 'https://storage.googleapis.com/saysay-images/actions/sleep.jpg', 'hayvanlar'),
('oynamak', 'https://storage.googleapis.com/saysay-images/actions/play.jpg', 'hayvanlar'),
('yüzmek', 'https://storage.googleapis.com/saysay-images/actions/swim.jpg', 'hayvanlar')
ON CONFLICT DO NOTHING;

-- Örnek veriler - Taşıtlar teması
INSERT INTO game2_objects (name, image_url, theme) VALUES
('araba', 'https://storage.googleapis.com/saysay-images/vehicles/car.jpg', 'taşıtlar'),
('uçak', 'https://storage.googleapis.com/saysay-images/vehicles/plane.jpg', 'taşıtlar'),
('gemi', 'https://storage.googleapis.com/saysay-images/vehicles/ship.jpg', 'taşıtlar'),
('tren', 'https://storage.googleapis.com/saysay-images/vehicles/train.jpg', 'taşıtlar'),
('bisiklet', 'https://storage.googleapis.com/saysay-images/vehicles/bicycle.jpg', 'taşıtlar')
ON CONFLICT DO NOTHING;

INSERT INTO game2_actions (name, image_url, theme) VALUES
('sürmek', 'https://storage.googleapis.com/saysay-images/actions/drive.jpg', 'taşıtlar'),
('uçmak', 'https://storage.googleapis.com/saysay-images/actions/fly.jpg', 'taşıtlar'),
('yüzmek', 'https://storage.googleapis.com/saysay-images/actions/swim.jpg', 'taşıtlar'),
('gitmek', 'https://storage.googleapis.com/saysay-images/actions/go.jpg', 'taşıtlar'),
('binmek', 'https://storage.googleapis.com/saysay-images/actions/ride.jpg', 'taşıtlar')
ON CONFLICT DO NOTHING;

-- Örnek veriler - Renkler teması
INSERT INTO game2_objects (name, image_url, theme) VALUES
('kırmızı', 'https://storage.googleapis.com/saysay-images/colors/red.jpg', 'renkler'),
('mavi', 'https://storage.googleapis.com/saysay-images/colors/blue.jpg', 'renkler'),
('sarı', 'https://storage.googleapis.com/saysay-images/colors/yellow.jpg', 'renkler'),
('yeşil', 'https://storage.googleapis.com/saysay-images/colors/green.jpg', 'renkler'),
('turuncu', 'https://storage.googleapis.com/saysay-images/colors/orange.jpg', 'renkler')
ON CONFLICT DO NOTHING;

INSERT INTO game2_actions (name, image_url, theme) VALUES
('boyamak', 'https://storage.googleapis.com/saysay-images/actions/paint.jpg', 'renkler'),
('çizmek', 'https://storage.googleapis.com/saysay-images/actions/draw.jpg', 'renkler'),
('bulmak', 'https://storage.googleapis.com/saysay-images/actions/find.jpg', 'renkler'),
('göstermek', 'https://storage.googleapis.com/saysay-images/actions/show.jpg', 'renkler'),
('seçmek', 'https://storage.googleapis.com/saysay-images/actions/choose.jpg', 'renkler')
ON CONFLICT DO NOTHING; 