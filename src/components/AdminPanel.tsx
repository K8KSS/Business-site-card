import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Settings, X, FileText, Image, Award, MessageCircle, Mail, 
  Headphones, Video, Edit, Trash2, Plus, Check, Eye, Upload, Trophy 
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { toast } from "sonner@2.0.3";
import { 
  adminApi, 
  publicationsApi, 
  albumsApi, 
  achievementsApi, 
  portfolioApi, 
  reviewsApi, 
  messagesApi, 
  audioApi, 
  videosApi,
  uploadFile 
} from "../utils/supabase/client";

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState("publications");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [stats, setStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  // Data states
  const [publications, setPublications] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [audioTracks, setAudioTracks] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);

  // Dialog states
  const [isPublicationDialogOpen, setIsPublicationDialogOpen] = useState(false);
  const [isAlbumDialogOpen, setIsAlbumDialogOpen] = useState(false);
  const [isPortfolioDialogOpen, setIsPortfolioDialogOpen] = useState(false);
  const [isAchievementDialogOpen, setIsAchievementDialogOpen] = useState(false);
  const [isAudioDialogOpen, setIsAudioDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [selectedAlbumForPhotos, setSelectedAlbumForPhotos] = useState<any>(null);

  // Edit states
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await adminApi.login(password);
      if (data.success) {
        setIsAuthenticated(true);
        toast.success("Вход выполнен успешно!");
      } else {
        toast.error("Неверный пароль!");
      }
    } catch (error: any) {
      toast.error(error.message || "Ошибка входа в систему");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load stats
      const statsData = await adminApi.getStats();
      setStats(statsData || {});

      // Load all data
      const [pubsData, albumsData, portfolioData, achievementsData, reviewsData, messagesData, audioData, videosData] = await Promise.all([
        publicationsApi.getAll().catch(() => []),
        albumsApi.getAll().catch(() => []),
        portfolioApi.getAll().catch(() => []),
        achievementsApi.getAll().catch(() => []),
        reviewsApi.getAll('pending').catch(() => []),
        messagesApi.getAll().catch(() => []),
        audioApi.getAll().catch(() => []),
        videosApi.getAll().catch(() => [])
      ]);

      setPublications(Array.isArray(pubsData) ? pubsData : []);
      setAlbums(Array.isArray(albumsData) ? albumsData : []);
      setPortfolio(Array.isArray(portfolioData) ? portfolioData : []);
      setAchievements(Array.isArray(achievementsData) ? achievementsData : []);
      setPendingReviews(Array.isArray(reviewsData) ? reviewsData : []);
      setMessages(Array.isArray(messagesData) ? messagesData : []);
      setAudioTracks(Array.isArray(audioData) ? audioData : []);
      setVideos(Array.isArray(videosData) ? videosData : []);
    } catch (error: any) {
      toast.error("Ошибка загрузки данных: " + (error.message || "Неизвестная ошибка"));
    } finally {
      setIsLoading(false);
    }
  };

  // Publications CRUD
  const handleAddPublication = async (data: any) => {
    setIsLoading(true);
    try {
      await publicationsApi.create(data);
      toast.success("Публикация добавлена!");
      loadData();
      setIsPublicationDialogOpen(false);
      setEditingItem(null);
    } catch (error: any) {
      toast.error("Ошибка: " + (error.message || "Не удалось добавить публикацию"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePublication = async (id: string, data: any) => {
    setIsLoading(true);
    try {
      await publicationsApi.update(id, data);
      toast.success("Публикация обновлена!");
      loadData();
      setIsPublicationDialogOpen(false);
      setEditingItem(null);
    } catch (error: any) {
      toast.error("Ошибка: " + (error.message || "Не удалось обновить публикацию"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePublication = async (id: string) => {
    if (!confirm("Удалить публикацию?")) return;
    setIsLoading(true);
    try {
      await publicationsApi.delete(id);
      toast.success("Публикация удалена!");
      loadData();
    } catch (error: any) {
      toast.error("Ошибка: " + (error.message || "Не удалось удалить"));
    } finally {
      setIsLoading(false);
    }
  };

  // Albums CRUD
  const handleAddAlbum = async (data: any) => {
    setIsLoading(true);
    try {
      await albumsApi.create(data);
      toast.success("Альбом создан!");
      loadData();
      setIsAlbumDialogOpen(false);
      setEditingItem(null);
    } catch (error: any) {
      toast.error("Ошибка: " + (error.message || "Не удалось создать альбом"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPhotoToAlbum = async (albumId: string, photoUrl: string) => {
    setIsLoading(true);
    try {
      await albumsApi.addPhoto(albumId, photoUrl);
      toast.success("Фото добавлено!");
      loadData();
      setIsPhotoDialogOpen(false);
    } catch (error: any) {
      toast.error("Ошибка: " + (error.message || "Не удалось добавить фото"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!confirm("Удалить альбом и все фото?")) return;
    setIsLoading(true);
    try {
      await albumsApi.delete(id);
      toast.success("Альбом удалён!");
      loadData();
    } catch (error: any) {
      toast.error("Ошибка: " + (error.message || "Не удалось удалить"));
    } finally {
      setIsLoading(false);
    }
  };

  // Portfolio CRUD
  const handleAddPortfolio = async (data: any) => {
    setIsLoading(true);
    try {
      await portfolioApi.create(data);
      toast.success("Документ добавлен!");
      loadData();
      setIsPortfolioDialogOpen(false);
      setEditingItem(null);
    } catch (error: any) {
      toast.error("Ошибка: " + (error.message || "Не удалось добавить документ"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    if (!confirm("Удалить документ?")) return;
    setIsLoading(true);
    try {
      await portfolioApi.delete(id);
      toast.success("Документ удалён!");
      loadData();
    } catch (error: any) {
      toast.error("Ошибка: " + (error.message || "Не удалось удалить"));
    } finally {
      setIsLoading(false);
    }
  };

  // Achievements CRUD
  const handleAddAchievement = async (data: any) => {
    setIsLoading(true);
    try {
      await achievementsApi.create(data);
      toast.success("Достижение добавлено!");
      loadData();
      setIsAchievementDialogOpen(false);
      setEditingItem(null);
    } catch (error: any) {
      toast.error("Ошибка: " + (error.message || "Не удалось добавить достижение"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAchievement = async (id: string) => {
    if (!confirm("Удалить достижение?")) return;
    setIsLoading(true);
    try {
      await achievementsApi.delete(id);
      toast.success("Достижение удалено!");
      loadData();
    } catch (error: any) {
      toast.error("Ошибка: " + (error.message || "Не удалось удалить"));
    } finally {
      setIsLoading(false);
    }
  };

  // Reviews moderation
  const handleApproveReview = async (id: string) => {
    setIsLoading(true);
    try {
      await reviewsApi.approve(id);
      toast.success("Отзыв одобрен!");
      loadData();
    } catch (error: any) {
      toast.error("Ошибка: " + (error.message || "Не удалось одобрить"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Отклонить отзыв?")) return;
    setIsLoading(true);
    try {
      await reviewsApi.delete(id);
      toast.success("Отзыв отклонён!");
      loadData();
    } catch (error: any) {
      toast.error("Ошибка: " + (error.message || "Не удалось удалить"));
    } finally {
      setIsLoading(false);
    }
  };

  // Messages
  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Удалить сообщение?")) return;
    setIsLoading(true);
    try {
      await messagesApi.delete(id);
      toast.success("Сообщение удалено!");
      loadData();
    } catch (error: any) {
      toast.error("Ошибка: " + (error.message || "Не удалось удалить"));
    } finally {
      setIsLoading(false);
    }
  };

  // Audio CRUD
  const handleAddAudio = async (data: any) => {
    setIsLoading(true);
    try {
      await audioApi.create(data);
      toast.success("Аудио добавлено!");
      loadData();
      setIsAudioDialogOpen(false);
      setEditingItem(null);
    } catch (error: any) {
      toast.error("Ошибка: " + (error.message || "Не удалось добавить аудио"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAudio = async (id: string) => {
    if (!confirm("Удалить аудио?")) return;
    setIsLoading(true);
    try {
      await audioApi.delete(id);
      toast.success("Аудио удалено!");
      loadData();
    } catch (error: any) {
      toast.error("Ошибка: " + (error.message || "Не удалось удалить"));
    } finally {
      setIsLoading(false);
    }
  };

  // Video CRUD
  const handleAddVideo = async (data: any) => {
    setIsLoading(true);
    try {
      await videosApi.create(data);
      toast.success("Видео добавлено!");
      loadData();
      setIsVideoDialogOpen(false);
      setEditingItem(null);
    } catch (error: any) {
      toast.error("Ошибка: " + (error.message || "Не удалось добавить видео"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm("Удалить видео?")) return;
    setIsLoading(true);
    try {
      await videosApi.delete(id);
      toast.success("Видео удалено!");
      loadData();
    } catch (error: any) {
      toast.error("Ошибка: " + (error.message || "Не удалось удалить"));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-12 shadow-2xl max-w-md w-full"
        >
          <div className="text-center mb-8">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="inline-block mb-4"
            >
              <Settings className="w-16 h-16 text-purple-600" />
            </motion.div>
            <h2 className="text-3xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Админ-панель
            </h2>
            <p className="text-gray-600">Вход для администратора</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">Пароль</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className="rounded-full border-2 border-purple-200"
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full py-6"
              disabled={isLoading}
            >
              {isLoading ? "Вход..." : "Войти"}
            </Button>

            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="w-full rounded-full border-2 border-purple-300 py-6"
              disabled={isLoading}
            >
              Отмена
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Административная панель
              </h1>
              <p className="text-gray-600">Управление контентом сайта</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="outline"
            className="rounded-full border-2 border-purple-300"
          >
            <X className="w-5 h-5 mr-2" />
            Закрыть
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-pink-500 to-purple-500 rounded-3xl p-6 text-white shadow-lg"
          >
            <FileText className="w-8 h-8 mb-3" />
            <div className="text-3xl mb-1">{publications.length || 0}</div>
            <div className="text-sm opacity-90">Публикаций</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl p-6 text-white shadow-lg"
          >
            <MessageCircle className="w-8 h-8 mb-3" />
            <div className="text-3xl mb-1">{pendingReviews.length || 0}</div>
            <div className="text-sm opacity-90">Новых отзывов</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-blue-500 to-teal-500 rounded-3xl p-6 text-white shadow-lg"
          >
            <Mail className="w-8 h-8 mb-3" />
            <div className="text-3xl mb-1">{messages.length || 0}</div>
            <div className="text-sm opacity-90">Сообщений</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-teal-500 to-green-500 rounded-3xl p-6 text-white shadow-lg"
          >
            <Eye className="w-8 h-8 mb-3" />
            <div className="text-3xl mb-1">{albums.length || 0}</div>
            <div className="text-sm opacity-90">Альбомов</div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-7 mb-6">
              <TabsTrigger value="publications">
                <FileText className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Публикации</span>
              </TabsTrigger>
              <TabsTrigger value="albums">
                <Image className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Альбомы</span>
              </TabsTrigger>
              <TabsTrigger value="achievements">
                <Trophy className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Достижения</span>
              </TabsTrigger>
              <TabsTrigger value="portfolio">
                <Award className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Портфолио</span>
              </TabsTrigger>
              <TabsTrigger value="reviews">
                <MessageCircle className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Отзывы</span>
              </TabsTrigger>
              <TabsTrigger value="media">
                <Headphones className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Медиа</span>
              </TabsTrigger>
              <TabsTrigger value="messages">
                <Mail className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Сообщения</span>
              </TabsTrigger>
            </TabsList>

            {/* Publications */}
            <TabsContent value="publications" className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl">Управление публикациями</h3>
                <Dialog open={isPublicationDialogOpen} onOpenChange={(open) => {
                  setIsPublicationDialogOpen(open);
                  if (!open) setEditingItem(null);
                }}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить публикацию
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingItem ? "Редактировать публикацию" : "Новая публикация"}</DialogTitle>
                    </DialogHeader>
                    <PublicationForm 
                      onSubmit={editingItem ? 
                        (data) => handleUpdatePublication(editingItem.id, data) : 
                        handleAddPublication
                      }
                      initialData={editingItem}
                      isLoading={isLoading}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {publications.map((pub) => (
                  <div key={pub.id} className="border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between hover:border-purple-300 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-8 h-8 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="text-gray-800 mb-1">{pub.title}</h4>
                        <div className="flex gap-2">
                          <Badge>{pub.category}</Badge>
                          <span className="text-sm text-gray-500">{new Date(pub.date).toLocaleDateString('ru-RU')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full" 
                        onClick={() => {
                          setEditingItem(pub);
                          setIsPublicationDialogOpen(true);
                        }}
                        disabled={isLoading}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full text-red-600 hover:text-red-700" 
                        onClick={() => handleDeletePublication(pub.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {publications.length === 0 && (
                  <p className="text-center text-gray-500 py-8">Нет публикаций</p>
                )}
              </div>
            </TabsContent>

            {/* Albums */}
            <TabsContent value="albums" className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl">Управление альбомами</h3>
                <Dialog open={isAlbumDialogOpen} onOpenChange={(open) => {
                  setIsAlbumDialogOpen(open);
                  if (!open) setEditingItem(null);
                }}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Создать альбом
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Новый альбом</DialogTitle>
                    </DialogHeader>
                    <AlbumForm onSubmit={handleAddAlbum} isLoading={isLoading} />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {albums.map((album) => (
                  <div key={album.id} className="border-2 border-gray-200 rounded-2xl p-4 hover:border-purple-300 transition-colors">
                    <div className="aspect-video bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl mb-3 flex items-center justify-center">
                      <Image className="w-12 h-12 text-purple-600" />
                    </div>
                    <h4 className="text-gray-800 mb-2">{album.title}</h4>
                    <p className="text-sm text-gray-500 mb-2">{album.photos?.length || 0} фото</p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 rounded-full" 
                        onClick={() => {
                          setSelectedAlbumForPhotos(album);
                          setIsPhotoDialogOpen(true);
                        }}
                        disabled={isLoading}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Добавить фото
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full text-red-600" 
                        onClick={() => handleDeleteAlbum(album.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {albums.length === 0 && (
                  <p className="text-center text-gray-500 py-8 col-span-3">Нет альбомов</p>
                )}
              </div>
            </TabsContent>

            {/* Achievements */}
            <TabsContent value="achievements" className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl">Управление достижениями</h3>
                <Dialog open={isAchievementDialogOpen} onOpenChange={(open) => {
                  setIsAchievementDialogOpen(open);
                  if (!open) setEditingItem(null);
                }}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить достижение
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Новое достижение</DialogTitle>
                    </DialogHeader>
                    <AchievementForm onSubmit={handleAddAchievement} isLoading={isLoading} />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((item) => (
                  <div key={item.id} className="border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-4 hover:border-purple-300 transition-colors">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-8 h-8 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-800 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.year} • {item.type}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-full text-red-600" 
                      onClick={() => handleDeleteAchievement(item.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {achievements.length === 0 && (
                  <p className="text-center text-gray-500 py-8 col-span-2">Нет достижений</p>
                )}
              </div>
            </TabsContent>

            {/* Portfolio */}
            <TabsContent value="portfolio" className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl">Управление портфолио</h3>
                <Dialog open={isPortfolioDialogOpen} onOpenChange={(open) => {
                  setIsPortfolioDialogOpen(open);
                  if (!open) setEditingItem(null);
                }}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить документ
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Новый документ</DialogTitle>
                    </DialogHeader>
                    <PortfolioForm onSubmit={handleAddPortfolio} isLoading={isLoading} />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {portfolio.map((item) => (
                  <div key={item.id} className="border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-4 hover:border-purple-300 transition-colors">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Award className="w-8 h-8 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-800 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.organization}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-full text-red-600" 
                      onClick={() => handleDeletePortfolio(item.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {portfolio.length === 0 && (
                  <p className="text-center text-gray-500 py-8 col-span-2">Нет документов</p>
                )}
              </div>
            </TabsContent>

            {/* Reviews */}
            <TabsContent value="reviews" className="space-y-4">
              <h3 className="text-xl mb-6">Модерация отзывов</h3>
              
              <div className="space-y-3">
                {pendingReviews.map((review) => (
                  <div key={review.id} className="border-2 border-orange-200 bg-orange-50 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-gray-800 mb-1">{review.author}</h4>
                        <p className="text-sm text-gray-500">{review.role} • {new Date(review.date).toLocaleDateString('ru-RU')}</p>
                      </div>
                      <Badge className="bg-orange-500">Ожидает модерации</Badge>
                    </div>
                    <p className="text-gray-700 mb-4">{review.text}</p>
                    <div className="flex gap-2">
                      <Button 
                        className="bg-green-600 hover:bg-green-700 text-white rounded-full" 
                        onClick={() => handleApproveReview(review.id)}
                        disabled={isLoading}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Одобрить
                      </Button>
                      <Button 
                        variant="outline" 
                        className="rounded-full text-red-600 hover:text-red-700" 
                        onClick={() => handleDeleteReview(review.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Отклонить
                      </Button>
                    </div>
                  </div>
                ))}
                {pendingReviews.length === 0 && (
                  <p className="text-center text-gray-500 py-8">Нет отзывов на модерации</p>
                )}
              </div>
            </TabsContent>

            {/* Media */}
            <TabsContent value="media" className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl">Аудио файлы</h3>
                  <Dialog open={isAudioDialogOpen} onOpenChange={(open) => {
                    setIsAudioDialogOpen(open);
                    if (!open) setEditingItem(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить аудио
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Новое аудио</DialogTitle>
                      </DialogHeader>
                      <AudioForm onSubmit={handleAddAudio} isLoading={isLoading} />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="space-y-2">
                  {audioTracks.map((track) => (
                    <div key={track.id} className="border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Headphones className="w-5 h-5 text-purple-600" />
                        <span>{track.title} - {track.artist}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full text-red-600" 
                        onClick={() => handleDeleteAudio(track.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {audioTracks.length === 0 && (
                    <p className="text-center text-gray-500 py-8">Нет аудио файлов</p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl">Видео файлы</h3>
                  <Dialog open={isVideoDialogOpen} onOpenChange={(open) => {
                    setIsVideoDialogOpen(open);
                    if (!open) setEditingItem(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить видео
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Новое видео</DialogTitle>
                      </DialogHeader>
                      <VideoForm onSubmit={handleAddVideo} isLoading={isLoading} />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="space-y-2">
                  {videos.map((video) => (
                    <div key={video.id} className="border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Video className="w-5 h-5 text-purple-600" />
                        <span>{video.title}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-full text-red-600" 
                        onClick={() => handleDeleteVideo(video.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {videos.length === 0 && (
                    <p className="text-center text-gray-500 py-8">Нет видео файлов</p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Messages */}
            <TabsContent value="messages" className="space-y-4">
              <h3 className="text-xl mb-6">Сообщения обратной связи</h3>
              
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-purple-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-gray-800 mb-1">{message.name}</h4>
                        <p className="text-sm text-purple-600">{message.email}</p>
                      </div>
                      <span className="text-sm text-gray-500">{new Date(message.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <p className="text-gray-700 mb-1">{message.subject}</p>
                    <p className="text-sm text-gray-600 mb-3">{message.message}</p>
                    <Button 
                      variant="outline" 
                      className="rounded-full text-red-600 hover:text-red-700" 
                      onClick={() => handleDeleteMessage(message.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Удалить
                    </Button>
                  </div>
                ))}
                {messages.length === 0 && (
                  <p className="text-center text-gray-500 py-8">Нет сообщений</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Photo Upload Dialog */}
        <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить фото в альбом: {selectedAlbumForPhotos?.title}</DialogTitle>
            </DialogHeader>
            <PhotoForm 
              onSubmit={(photoUrl) => {
                if (selectedAlbumForPhotos) {
                  handleAddPhotoToAlbum(selectedAlbumForPhotos.id, photoUrl);
                }
              }} 
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}

// Forms
function PublicationForm({ onSubmit, initialData, isLoading }: { onSubmit: (data: any) => void, initialData?: any, isLoading?: boolean }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "education");
  const [file, setFile] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let fileUrl = initialData?.file_url;
      let coverUrl = initialData?.cover_image;

      if (file) {
        const uploadedFile = await uploadFile(file);
        fileUrl = uploadedFile.url;
      }

      if (cover) {
        const uploadedCover = await uploadFile(cover);
        coverUrl = uploadedCover.url;
      }

      onSubmit({
        title,
        description,
        category,
        file_url: fileUrl,
        cover_image: coverUrl,
        date: new Date().toISOString()
      });
    } catch (error: any) {
      toast.error("Ошибка загрузки файлов: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Название</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required disabled={uploading || isLoading} />
      </div>
      <div>
        <Label>Описание</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required disabled={uploading || isLoading} />
      </div>
      <div>
        <Label>Категория</Label>
        <Select value={category} onValueChange={setCategory} disabled={uploading || isLoading}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="education">Воспитательная работа</SelectItem>
            <SelectItem value="art">Декоративно-прикладное искусство</SelectItem>
            <SelectItem value="distance">Дистанционное обучение</SelectItem>
            <SelectItem value="health">Здоровый образ жизни</SelectItem>
            <SelectItem value="correction">Коррекционная педагогика</SelectItem>
            <SelectItem value="parents">Материалы для родителей</SelectItem>
            <SelectItem value="music">Музыкально-ритмическое занятие</SelectItem>
            <SelectItem value="world">Окружающий мир</SelectItem>
            <SelectItem value="other">Разное</SelectItem>
            <SelectItem value="scenarios">Сценарии праздников</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Обложка (изображение)</Label>
        <Input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] || null)} disabled={uploading || isLoading} />
      </div>
      <div>
        <Label>Файл документа (PDF, DOCX)</Label>
        <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} disabled={uploading || isLoading} />
      </div>
      <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white" disabled={uploading || isLoading}>
        <Upload className="w-4 h-4 mr-2" />
        {uploading ? "Загрузка..." : initialData ? "Обновить" : "Добавить"}
      </Button>
    </form>
  );
}

function AlbumForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void, isLoading?: boolean }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, photos: [] });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Название альбома</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isLoading} />
      </div>
      <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white" disabled={isLoading}>
        Создать альбом
      </Button>
    </form>
  );
}

function PhotoForm({ onSubmit, isLoading }: { onSubmit: (photoUrl: string) => void, isLoading?: boolean }) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) {
      toast.error("Выберите фото");
      return;
    }

    setUploading(true);
    try {
      const uploaded = await uploadFile(photo);
      onSubmit(uploaded.url);
    } catch (error: any) {
      toast.error("Ошибка загрузки фото: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Фотография</Label>
        <Input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} required disabled={uploading || isLoading} />
      </div>
      <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white" disabled={uploading || isLoading}>
        <Upload className="w-4 h-4 mr-2" />
        {uploading ? "Загрузка..." : "Загрузить фото"}
      </Button>
    </form>
  );
}

function PortfolioForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void, isLoading?: boolean }) {
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [category, setCategory] = useState("diploma");
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setUploading(true);
    try {
      let imageUrl = "";
      if (image) {
        const uploaded = await uploadFile(image);
        imageUrl = uploaded.url;
      }

      onSubmit({
        title,
        organization,
        category,
        image_url: imageUrl
      });
    } catch (error: any) {
      toast.error("Ошибка загрузки изображения: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Название</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required disabled={uploading || isLoading} />
      </div>
      <div>
        <Label>Организация</Label>
        <Input value={organization} onChange={(e) => setOrganization(e.target.value)} required disabled={uploading || isLoading} />
      </div>
      <div>
        <Label>Категория</Label>
        <Select value={category} onValueChange={setCategory} disabled={uploading || isLoading}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="diploma">Диплом</SelectItem>
            <SelectItem value="certificate">Сертификат</SelectItem>
            <SelectItem value="gratitude">Благодарность</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Изображение</Label>
        <Input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} required disabled={uploading || isLoading} />
      </div>
      <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white" disabled={uploading || isLoading}>
        {uploading ? "Загрузка..." : "Добавить"}
      </Button>
    </form>
  );
}

function AchievementForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void, isLoading?: boolean }) {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [type, setType] = useState("personal");
  const [icon, setIcon] = useState("Trophy");
  const [color, setColor] = useState("from-yellow-400 to-orange-500");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, year, type, icon, color });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Название достижения</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isLoading} />
      </div>
      <div>
        <Label>Год</Label>
        <Input value={year} onChange={(e) => setYear(e.target.value)} required disabled={isLoading} />
      </div>
      <div>
        <Label>Тип</Label>
        <Select value={type} onValueChange={setType} disabled={isLoading}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal">Личное</SelectItem>
            <SelectItem value="professional">Профессиональное</SelectItem>
            <SelectItem value="teaching">Педагогическое</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Иконка</Label>
        <Select value={icon} onValueChange={setIcon} disabled={isLoading}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Trophy">Кубок</SelectItem>
            <SelectItem value="Award">Награда</SelectItem>
            <SelectItem value="Medal">Медаль</SelectItem>
            <SelectItem value="Star">Звезда</SelectItem>
            <SelectItem value="Sparkles">Блёстки</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Цвет градиента</Label>
        <Select value={color} onValueChange={setColor} disabled={isLoading}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="from-yellow-400 to-orange-500">Жёлто-оранжевый</SelectItem>
            <SelectItem value="from-blue-400 to-purple-500">Сине-фиолетовый</SelectItem>
            <SelectItem value="from-pink-400 to-red-500">Розово-красный</SelectItem>
            <SelectItem value="from-green-400 to-teal-500">Зелено-бирюзовый</SelectItem>
            <SelectItem value="from-purple-400 to-pink-500">Фиолетово-розовый</SelectItem>
            <SelectItem value="from-orange-400 to-red-500">Оранжево-красный</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white" disabled={isLoading}>
        Добавить
      </Button>
    </form>
  );
}

function AudioForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void, isLoading?: boolean }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [category, setCategory] = useState("Детские песни");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Выберите аудио файл");
      return;
    }

    setUploading(true);
    try {
      const uploaded = await uploadFile(file);

      onSubmit({
        title,
        artist,
        category,
        url: uploaded.url
      });
    } catch (error: any) {
      toast.error("Ошибка загрузки файла: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Название</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required disabled={uploading || isLoading} />
      </div>
      <div>
        <Label>Исполнитель</Label>
        <Input value={artist} onChange={(e) => setArtist(e.target.value)} required disabled={uploading || isLoading} />
      </div>
      <div>
        <Label>Категория</Label>
        <Select value={category} onValueChange={setCategory} disabled={uploading || isLoading}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Детские песни">Детские песни</SelectItem>
            <SelectItem value="Физминутки">Физминутки</SelectItem>
            <SelectItem value="Релаксация">Релаксация</SelectItem>
            <SelectItem value="Танцы">Танцы</SelectItem>
            <SelectItem value="Игры">Игры</SelectItem>
            <SelectItem value="Праздники">Праздники</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Аудио файл (mp3)</Label>
        <Input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required disabled={uploading || isLoading} />
      </div>
      <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white" disabled={uploading || isLoading}>
        {uploading ? "Загрузка..." : "Загрузить"}
      </Button>
    </form>
  );
}

function VideoForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void, isLoading?: boolean }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Праздники");
  const [vkIframe, setVkIframe] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setUploading(true);
    try {
      let thumbnailUrl = "";
      if (thumbnail) {
        const uploaded = await uploadFile(thumbnail);
        thumbnailUrl = uploaded.url;
      }

      onSubmit({
        title,
        description,
        category,
        vk_iframe: vkIframe,
        thumbnail: thumbnailUrl,
        views: 0
      });
    } catch (error: any) {
      toast.error("Ошибка загрузки превью: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Название</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required disabled={uploading || isLoading} />
      </div>
      <div>
        <Label>Описание</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required disabled={uploading || isLoading} />
      </div>
      <div>
        <Label>Категория</Label>
        <Select value={category} onValueChange={setCategory} disabled={uploading || isLoading}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Праздники">Праздники</SelectItem>
            <SelectItem value="Занятия">Занятия</SelectItem>
            <SelectItem value="Методика">Методика</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Код iframe из VK Видео</Label>
        <Textarea 
          value={vkIframe} 
          onChange={(e) => setVkIframe(e.target.value)} 
          placeholder='<iframe src="https://vk.com/video_ext.php?..." />'
          required 
          disabled={uploading || isLoading}
        />
      </div>
      <div>
        <Label>Превью (опционально)</Label>
        <Input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} disabled={uploading || isLoading} />
      </div>
      <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white" disabled={uploading || isLoading}>
        {uploading ? "Загрузка..." : "Добавить"}
      </Button>
    </form>
  );
}
