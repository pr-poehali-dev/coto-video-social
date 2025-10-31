import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const API_URLS = {
  shorts: 'https://functions.poehali.dev/412bc3b4-f047-4dd8-9c0c-110ed65956fb',
  likes: 'https://functions.poehali.dev/bc2dc355-06f9-4ac5-b7f6-50f28d44016d',
  subscriptions: 'https://functions.poehali.dev/5ea655a4-f5fc-4ad3-98de-71583bbe1ced'
};

const USER_ID = 7;

interface Short {
  id: number;
  title: string;
  description: string;
  author: string;
  author_avatar: string;
  views_count: number;
  likes_count: number;
  thumbnail_url: string;
  duration: string;
  user_id: number;
}

const Shorts = () => {
  const [shorts, setShorts] = useState<Short[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedShorts, setLikedShorts] = useState<Set<number>>(new Set());
  const [subscribedUsers, setSubscribedUsers] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchShorts();
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0 && currentIndex < shorts.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: true });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [currentIndex, shorts.length]);

  const fetchShorts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URLS.shorts);
      const data = await response.json();
      setShorts(data);
    } catch (error) {
      console.error('Failed to fetch shorts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (shortId: number) => {
    try {
      const response = await fetch(API_URLS.likes, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_id: shortId, user_id: USER_ID })
      });
      const data = await response.json();
      
      setLikedShorts((prev) => {
        const newSet = new Set(prev);
        if (data.liked) {
          newSet.add(shortId);
        } else {
          newSet.delete(shortId);
        }
        return newSet;
      });

      setShorts(prev => prev.map(s => 
        s.id === shortId ? { ...s, likes_count: data.likes_count } : s
      ));
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleSubscribe = async (userId: number) => {
    try {
      const response = await fetch(API_URLS.subscriptions, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel_id: userId, subscriber_id: USER_ID })
      });
      const data = await response.json();
      
      setSubscribedUsers((prev) => {
        const newSet = new Set(prev);
        if (data.subscribed) {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Failed to toggle subscription:', error);
    }
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  const goToNext = () => {
    if (currentIndex < shorts.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Загрузка Shorts...</p>
        </div>
      </div>
    );
  }

  if (shorts.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center text-white">
          <Icon name="Video" size={64} className="mx-auto mb-4 opacity-50" />
          <p className="text-xl">Нет доступных Shorts</p>
        </div>
      </div>
    );
  }

  const currentShort = shorts[currentIndex];

  return (
    <div ref={containerRef} className="relative h-screen w-full bg-black overflow-hidden">
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out"
        style={{ transform: `translateY(-${currentIndex * 100}%)` }}
      >
        {shorts.map((short, index) => (
          <div
            key={short.id}
            className="relative h-screen w-full flex items-center justify-center"
          >
            <div className="relative w-full max-w-md h-full bg-gradient-to-br from-gray-900 to-black">
              <img
                src={short.thumbnail_url}
                alt={short.title}
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

              <div className="absolute top-4 right-4 z-10 flex flex-col gap-4">
                <button
                  onClick={() => handleLike(short.id)}
                  className={`flex flex-col items-center gap-1 transition-all ${
                    likedShorts.has(short.id) ? 'text-red-500' : 'text-white'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
                    <Icon name="Heart" size={24} fill={likedShorts.has(short.id) ? 'currentColor' : 'none'} />
                  </div>
                  <span className="text-xs font-semibold">{formatCount(short.likes_count)}</span>
                </button>

                <button className="flex flex-col items-center gap-1 text-white">
                  <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
                    <Icon name="MessageCircle" size={24} />
                  </div>
                  <span className="text-xs font-semibold">128</span>
                </button>

                <button className="flex flex-col items-center gap-1 text-white">
                  <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform">
                    <Icon name="Share2" size={24} />
                  </div>
                  <span className="text-xs font-semibold">Поделиться</span>
                </button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12 border-2 border-white">
                    <AvatarImage src={short.author_avatar} />
                    <AvatarFallback>{short.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{short.author}</p>
                    <p className="text-sm text-gray-300">{formatCount(short.views_count)} просмотров</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleSubscribe(short.user_id)}
                    className={
                      subscribedUsers.has(short.user_id)
                        ? 'bg-white/20 text-white hover:bg-white/30'
                        : 'gradient-primary'
                    }
                  >
                    {subscribedUsers.has(short.user_id) ? 'Подписан' : 'Подписаться'}
                  </Button>
                </div>
                
                <h3 className="text-lg font-bold mb-2">{short.title}</h3>
                <p className="text-sm text-gray-300 line-clamp-2">{short.description}</p>
              </div>

              {index === currentIndex && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-20 h-20 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center animate-pulse-glow pointer-events-auto">
                    <Icon name="Play" size={40} className="text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {currentIndex > 0 && (
        <button
          onClick={goToPrev}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60vh] z-20 w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
        >
          <Icon name="ChevronUp" size={24} />
        </button>
      )}

      {currentIndex < shorts.length - 1 && (
        <button
          onClick={goToNext}
          className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-[60vh] z-20 w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
        >
          <Icon name="ChevronDown" size={24} />
        </button>
      )}

      <div className="absolute top-4 left-4 z-20">
        <p className="text-white text-sm font-semibold bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
          {currentIndex + 1} / {shorts.length}
        </p>
      </div>
    </div>
  );
};

export default Shorts;
