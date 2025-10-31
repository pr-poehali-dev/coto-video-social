-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    subscribers_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    duration VARCHAR(10),
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    video_id INTEGER REFERENCES videos(id),
    user_id INTEGER REFERENCES users(id),
    text TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create likes table
CREATE TABLE IF NOT EXISTS video_likes (
    id SERIAL PRIMARY KEY,
    video_id INTEGER REFERENCES videos(id),
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(video_id, user_id)
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    subscriber_id INTEGER REFERENCES users(id),
    channel_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(subscriber_id, channel_id)
);

-- Insert sample users
INSERT INTO users (username, display_name, avatar_url, subscribers_count) VALUES
('traveler', 'Путешественник', 'https://api.dicebear.com/7.x/avataaars/svg?seed=traveler', 2500000),
('chef', 'Кулинарный Мастер', 'https://api.dicebear.com/7.x/avataaars/svg?seed=chef', 890000),
('coder', 'КодМастер', 'https://api.dicebear.com/7.x/avataaars/svg?seed=coder', 1500000),
('dancer', 'DanceStar', 'https://api.dicebear.com/7.x/avataaars/svg?seed=dancer', 5700000),
('builder', 'Строитель Pro', 'https://api.dicebear.com/7.x/avataaars/svg?seed=builder', 780000),
('catlover', 'Котолюб', 'https://api.dicebear.com/7.x/avataaars/svg?seed=catlover', 12000000),
('myuser', 'Мой Профиль', 'https://api.dicebear.com/7.x/avataaars/svg?seed=user', 0);

-- Insert sample videos
INSERT INTO videos (title, description, thumbnail_url, duration, views_count, likes_count, user_id) VALUES
('Удивительный закат на Байкале', 'Потрясающие виды озера Байкал на закате. Эксклюзивные кадры природы России.', '/placeholder.svg', '3:45', 2300000, 145000, 1),
('Рецепт идеального борща', 'Пошаговый рецепт классического борща от профессионального повара.', '/placeholder.svg', '8:12', 890000, 67000, 2),
('Топ-10 лайфхаков для программистов', 'Полезные советы и трюки для повышения продуктивности в программировании.', '/placeholder.svg', '12:30', 1500000, 98000, 3),
('Танцевальный челлендж 2024', 'Новый вирусный танцевальный челлендж, который покорил весь интернет!', '/placeholder.svg', '0:45', 5700000, 320000, 4),
('Как я построил дом за месяц', 'Полная инструкция по быстрому строительству дома своими руками.', '/placeholder.svg', '15:22', 780000, 54000, 5),
('Самый милый котёнок в мире', 'Невероятно милые моменты с маленьким котёнком. Гарантирую улыбку!', '/placeholder.svg', '2:18', 12000000, 890000, 6);

-- Insert sample comments
INSERT INTO comments (video_id, user_id, text, likes_count) VALUES
(1, 2, 'Потрясающий контент! Спасибо за видео 🔥', 234),
(1, 3, 'Когда будет продолжение?', 89),
(1, 4, 'Лучшее видео, что я видел за последнее время!', 156),
(2, 1, 'Отличный рецепт, уже попробовал!', 45),
(3, 4, 'Очень полезные советы, спасибо!', 78),
(4, 5, 'Крутой челлендж, уже записал свою версию!', 234),
(5, 6, 'Впечатляющая работа!', 56),
(6, 1, 'Котик просто прелесть ❤️', 890);
