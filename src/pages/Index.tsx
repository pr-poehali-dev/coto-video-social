import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [likedVideos, setLikedVideos] = useState<Set<number>>(new Set());
  const [subscribedUsers, setSubscribedUsers] = useState<Set<string>>(new Set());

  const navItems = [
    { id: 'home', label: 'Главная', icon: 'Home' },
    { id: 'trending', label: 'Трендовое', icon: 'TrendingUp' },
    { id: 'subscriptions', label: 'Подписки', icon: 'Users' },
    { id: 'profile', label: 'Профиль', icon: 'User' },
    { id: 'upload', label: 'Загрузка', icon: 'Upload' },
    { id: 'notifications', label: 'Уведомления', icon: 'Bell' },
    { id: 'settings', label: 'Настройки', icon: 'Settings' },
  ];

  const videos = [
    {
      id: 1,
      title: 'Удивительный закат на Байкале',
      author: 'Путешественник',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=traveler',
      views: '2.3M',
      likes: 145000,
      thumbnail: '/placeholder.svg',
      duration: '3:45',
    },
    {
      id: 2,
      title: 'Рецепт идеального борща',
      author: 'Кулинарный Мастер',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chef',
      views: '890K',
      likes: 67000,
      thumbnail: '/placeholder.svg',
      duration: '8:12',
    },
    {
      id: 3,
      title: 'Топ-10 лайфхаков для программистов',
      author: 'КодМастер',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=coder',
      views: '1.5M',
      likes: 98000,
      thumbnail: '/placeholder.svg',
      duration: '12:30',
    },
    {
      id: 4,
      title: 'Танцевальный челлендж 2024',
      author: 'DanceStar',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dancer',
      views: '5.7M',
      likes: 320000,
      thumbnail: '/placeholder.svg',
      duration: '0:45',
    },
    {
      id: 5,
      title: 'Как я построил дом за месяц',
      author: 'Строитель Pro',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=builder',
      views: '780K',
      likes: 54000,
      thumbnail: '/placeholder.svg',
      duration: '15:22',
    },
    {
      id: 6,
      title: 'Самый милый котёнок в мире',
      author: 'Котолюб',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=catlover',
      views: '12M',
      likes: 890000,
      thumbnail: '/placeholder.svg',
      duration: '2:18',
    },
  ];

  const comments = [
    {
      id: 1,
      author: 'Александр К.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      text: 'Потрясающий контент! Спасибо за видео 🔥',
      likes: 234,
      time: '2 часа назад',
    },
    {
      id: 2,
      author: 'Мария В.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
      text: 'Когда будет продолжение?',
      likes: 89,
      time: '5 часов назад',
    },
    {
      id: 3,
      author: 'Дмитрий С.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dmitry',
      text: 'Лучшее видео, что я видел за последнее время!',
      likes: 156,
      time: '1 день назад',
    },
  ];

  const handleLike = (videoId: number) => {
    setLikedVideos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  const handleSubscribe = (author: string) => {
    setSubscribedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(author)) {
        newSet.delete(author);
      } else {
        newSet.add(author);
      }
      return newSet;
    });
  };

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
          {selectedVideo ? (
            <div className="grid lg:grid-cols-3 gap-6 p-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="aspect-video bg-card rounded-xl overflow-hidden relative group">
                  <img
                    src={videos.find((v) => v.id === selectedVideo)?.thumbnail}
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
                  <h2 className="text-2xl font-bold">
                    {videos.find((v) => v.id === selectedVideo)?.title}
                  </h2>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={videos.find((v) => v.id === selectedVideo)?.avatar} />
                        <AvatarFallback>A</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {videos.find((v) => v.id === selectedVideo)?.author}
                        </p>
                        <p className="text-sm text-muted-foreground">2.5M подписчиков</p>
                      </div>
                      <Button
                        onClick={() => handleSubscribe(videos.find((v) => v.id === selectedVideo)?.author || '')}
                        className={
                          subscribedUsers.has(videos.find((v) => v.id === selectedVideo)?.author || '')
                            ? 'bg-muted text-foreground hover:bg-muted/80'
                            : 'gradient-primary'
                        }
                      >
                        {subscribedUsers.has(videos.find((v) => v.id === selectedVideo)?.author || '')
                          ? 'Подписан'
                          : 'Подписаться'}
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
                        {videos.find((v) => v.id === selectedVideo)?.likes.toLocaleString()}
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
                        <span>{videos.find((v) => v.id === selectedVideo)?.views} просмотров</span>
                        <span>•</span>
                        <span>2 дня назад</span>
                      </div>
                      <p className="text-foreground">
                        Описание видео с подробной информацией о контенте. Здесь может быть длинное описание,
                        ссылки и другая полезная информация для зрителей.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Комментарии ({comments.length})</h3>

                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                      <AvatarFallback>Я</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Input placeholder="Написать комментарий..." className="bg-input" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3 animate-fade-in">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={comment.avatar} />
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
                              <span>{comment.likes}</span>
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
                                  src={video.thumbnail}
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
                                <p className="text-xs text-muted-foreground">{video.views} просмотров</p>
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
                          src={video.thumbnail}
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
                            <AvatarImage src={video.avatar} />
                            <AvatarFallback>{video.author[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold line-clamp-2 mb-1">{video.title}</h3>
                            <p className="text-sm text-muted-foreground">{video.author}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <span>{video.views} просмотров</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Icon name="ThumbsUp" size={14} />
                                {(video.likes / 1000).toFixed(0)}K
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
