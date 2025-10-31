import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Shorts from '@/components/Shorts';

const API_URLS = {
  videos: 'https://functions.poehali.dev/1124ef87-dafa-4394-b6b3-ed37e94c9637',
  likes: 'https://functions.poehali.dev/bc2dc355-06f9-4ac5-b7f6-50f28d44016d',
  subscriptions: 'https://functions.poehali.dev/5ea655a4-f5fc-4ad3-98de-71583bbe1ced',
  comments: 'https://functions.poehali.dev/5d7d1834-b8c2-47ad-8afb-c7493b78bf31'
};

const USER_ID = 7;

interface Video {
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
  subscribers_count?: number;
}

interface Comment {
  id: number;
  author: string;
  author_avatar: string;
  text: string;
  likes_count: number;
  time: string;
}

interface VideoDetail extends Video {
  comments: Comment[];
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [videoDetail, setVideoDetail] = useState<VideoDetail | null>(null);
  const [likedVideos, setLikedVideos] = useState<Set<number>>(new Set());
  const [subscribedUsers, setSubscribedUsers] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');

  const navItems = [
    { id: 'home', label: 'Главная', icon: 'Home' },
    { id: 'shorts', label: 'Shorts', icon: 'Zap' },
    { id: 'trending', label: 'Трендовое', icon: 'TrendingUp' },
    { id: 'subscriptions', label: 'Подписки', icon: 'Users' },
    { id: 'profile', label: 'Профиль', icon: 'User' },
    { id: 'upload', label: 'Загрузка', icon: 'Upload' },
    { id: 'notifications', label: 'Уведомления', icon: 'Bell' },
    { id: 'settings', label: 'Настройки', icon: 'Settings' },
  ];

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    if (selectedVideo) {
      fetchVideoDetail(selectedVideo);
    }
  }, [selectedVideo]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URLS.videos);
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideoDetail = async (videoId: number) => {
    try {
      const response = await fetch(`${API_URLS.videos}?id=${videoId}`);
      const data = await response.json();
      setVideoDetail(data);
    } catch (error) {
      console.error('Failed to fetch video detail:', error);
    }
  };

  const handleLike = async (videoId: number) => {
    try {
      const response = await fetch(API_URLS.likes, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_id: videoId, user_id: USER_ID })
      });
      const data = await response.json();
      
      setLikedVideos((prev) => {
        const newSet = new Set(prev);
        if (data.liked) {
          newSet.add(videoId);
        } else {
          newSet.delete(videoId);
        }
        return newSet;
      });

      setVideos(prev => prev.map(v => 
        v.id === videoId ? { ...v, likes_count: data.likes_count } : v
      ));

      if (videoDetail && videoDetail.id === videoId) {
        setVideoDetail({ ...videoDetail, likes_count: data.likes_count });
      }
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

      if (videoDetail && videoDetail.user_id === userId) {
        setVideoDetail({ ...videoDetail, subscribers_count: data.subscribers_count });
      }
    } catch (error) {
      console.error('Failed to toggle subscription:', error);
    }
  };

  const formatViews = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  const formatSubscribers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  const handlePostComment = async () => {
    if (!newComment.trim() || !selectedVideo) return;

    try {
      const response = await fetch(API_URLS.comments, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_id: selectedVideo, user_id: USER_ID, text: newComment })
      });
      const data = await response.json();
      
      if (videoDetail) {
        setVideoDetail({
          ...videoDetail,
          comments: [data, ...videoDetail.comments]
        });
      }
      
      setNewComment('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  if (activeTab === 'shorts') {
    return <Shorts />;
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6">
          <h1 className="text-3xl font-bold gradient-text">CotoVideo</h1>
        </div>

        <nav className="flex-1 px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                activeTab === item.id
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <Icon name={item.icon as any} size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
              <AvatarFallback>Я</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Мой Профиль</p>
              <p className="text-xs text-muted-foreground">@myprofile</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border flex items-center px-6 gap-4">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск видео, авторов, тем..."
                className="pl-10 bg-input border-border"
              />
            </div>
          </div>
          <Button size="icon" variant="ghost">
            <Icon name="Bell" size={20} />
          </Button>
        </header>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Загрузка...</p>
              </div>
            </div>
          ) : selectedVideo && videoDetail ? (
            <div className="grid lg:grid-cols-3 gap-6 p-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="aspect-video bg-card rounded-xl overflow-hidden relative group">
                  <img
                    src={videoDetail.thumbnail_url}
                    alt="Video"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Button size="icon" className="h-20 w-20 rounded-full gradient-primary animate-pulse-glow">
                      <Icon name="Play" size={32} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">{videoDetail.title}</h2>

                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={videoDetail.author_avatar} />
                        <AvatarFallback>{videoDetail.author[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{videoDetail.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatSubscribers(videoDetail.subscribers_count || 0)} подписчиков
                        </p>
                      </div>
                      <Button
                        onClick={() => handleSubscribe(videoDetail.user_id)}
                        className={
                          subscribedUsers.has(videoDetail.user_id)
                            ? 'bg-muted text-foreground hover:bg-muted/80'
                            : 'gradient-primary'
                        }
                      >
                        {subscribedUsers.has(videoDetail.user_id) ? 'Подписан' : 'Подписаться'}
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => handleLike(selectedVideo)}
                        className={likedVideos.has(selectedVideo) ? 'text-primary border-primary' : ''}
                      >
                        <Icon name="ThumbsUp" size={20} className="mr-2" />
                        {videoDetail.likes_count.toLocaleString()}
                      </Button>
                      <Button size="lg" variant="outline">
                        <Icon name="Share2" size={20} className="mr-2" />
                        Поделиться
                      </Button>
                    </div>
                  </div>

                  <Card className="bg-card">
                    <CardContent className="p-4">
                      <div className="flex gap-4 text-sm text-muted-foreground mb-2">
                        <span>{formatViews(videoDetail.views_count)} просмотров</span>
                      </div>
                      <p className="text-foreground">{videoDetail.description}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Комментарии ({videoDetail.comments.length})</h3>

                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                      <AvatarFallback>Я</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex gap-2">
                      <Input 
                        placeholder="Написать комментарий..." 
                        className="bg-input flex-1" 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                      />
                      <Button 
                        onClick={handlePostComment}
                        disabled={!newComment.trim()}
                        className="gradient-primary"
                      >
                        <Icon name="Send" size={18} />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {videoDetail.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3 animate-fade-in">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={comment.author_avatar} />
                          <AvatarFallback>{comment.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">{comment.time}</span>
                          </div>
                          <p className="text-sm mb-2">{comment.text}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <button className="flex items-center gap-1 hover:text-primary transition-colors">
                              <Icon name="ThumbsUp" size={16} />
                              <span>{comment.likes_count}</span>
                            </button>
                            <button className="hover:text-primary transition-colors">Ответить</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold">Рекомендованные</h3>
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-3">
                    {videos
                      .filter((v) => v.id !== selectedVideo)
                      .map((video) => (
                        <Card
                          key={video.id}
                          className="cursor-pointer hover:bg-accent/50 transition-all animate-scale-in"
                          onClick={() => setSelectedVideo(video.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex gap-3">
                              <div className="relative w-40 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={video.thumbnail_url}
                                  alt={video.title}
                                  className="w-full h-full object-cover"
                                />
                                <Badge className="absolute bottom-2 right-2 bg-black/80 text-white">
                                  {video.duration}
                                </Badge>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm line-clamp-2 mb-1">{video.title}</h4>
                                <p className="text-xs text-muted-foreground mb-1">{video.author}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatViews(video.views_count)} просмотров
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Популярное сегодня</h2>
                <p className="text-muted-foreground">Самые просматриваемые видео прямо сейчас</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video, index) => (
                  <Card
                    key={video.id}
                    className="group cursor-pointer hover:scale-105 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setSelectedVideo(video.id)}
                  >
                    <CardContent className="p-0">
                      <div className="relative aspect-video overflow-hidden rounded-t-xl">
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center gap-2">
                              <Icon name="Play" size={24} className="text-white" />
                              <span className="text-white font-semibold">Смотреть</span>
                            </div>
                          </div>
                        </div>
                        <Badge className="absolute top-2 right-2 bg-black/80 text-white">
                          {video.duration}
                        </Badge>
                      </div>

                      <div className="p-4">
                        <div className="flex gap-3">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src={video.author_avatar} />
                            <AvatarFallback>{video.author[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold line-clamp-2 mb-1">{video.title}</h3>
                            <p className="text-sm text-muted-foreground">{video.author}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <span>{formatViews(video.views_count)} просмотров</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Icon name="ThumbsUp" size={14} />
                                {formatViews(video.likes_count)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;