-- Add video_type column to videos table
ALTER TABLE videos ADD COLUMN IF NOT EXISTS video_type VARCHAR(20) DEFAULT 'regular';

-- Add aspect_ratio column for shorts
ALTER TABLE videos ADD COLUMN IF NOT EXISTS aspect_ratio VARCHAR(10) DEFAULT '16:9';

-- Update some existing videos to be shorts
UPDATE videos SET video_type = 'short', aspect_ratio = '9:16' WHERE id IN (4, 6);

-- Insert more shorts videos
INSERT INTO videos (title, description, thumbnail_url, duration, views_count, likes_count, user_id, video_type, aspect_ratio) VALUES
('Быстрый рецепт на завтрак', 'Готовлю вкусные панкейки за 60 секунд!', '/placeholder.svg', '0:58', 3400000, 287000, 2, 'short', '9:16'),
('Трюк на скейте', 'Невероятный трюк на скейтборде в первый раз!', '/placeholder.svg', '0:35', 8900000, 654000, 4, 'short', '9:16'),
('Лайфхак с телефоном', 'Этот трюк изменит твою жизнь!', '/placeholder.svg', '0:42', 12500000, 890000, 3, 'short', '9:16'),
('Смешной момент с котом', 'Кот застрял в коробке 😂', '/placeholder.svg', '0:28', 15000000, 1200000, 6, 'short', '9:16'),
('Тренировка за минуту', 'Эффективная тренировка пресса дома', '/placeholder.svg', '0:55', 2300000, 156000, 1, 'short', '9:16');

-- Create table for video uploads
CREATE TABLE IF NOT EXISTS video_uploads (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration VARCHAR(10),
    video_type VARCHAR(20) DEFAULT 'regular',
    aspect_ratio VARCHAR(10) DEFAULT '16:9',
    processing_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
