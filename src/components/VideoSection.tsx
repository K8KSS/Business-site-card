import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Video as VideoIcon, Play, X, Eye, Download, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { videosApi } from "../utils/supabase/client";

const categories = [
  { id: "all", label: "Все видео", color: "bg-gray-500" },
  { id: "Праздники", label: "Праздники", color: "bg-pink-500" },
  { id: "Занятия", label: "Занятия", color: "bg-purple-500" },
  { id: "Методика", label: "Методика", color: "bg-blue-500" },
];

export default function VideoSection() {
  const [videos, setVideos] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const data = await videosApi.getAll();
      setVideos(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error loading videos:', error);
      setVideos([]);
    }
  };

  const handleVideoClick = async (video: any) => {
    setSelectedVideo(video);
    setPreviewOpen(true);
    
    // Increment view count
    try {
      await videosApi.incrementViews(video.id);
      await loadVideos();
    } catch (error) {
      console.error("Failed to increment view");
    }
  };

  const extractVkIframe = (iframeCode: string) => {
    // Extract src from iframe code
    const srcMatch = iframeCode.match(/src=["']([^"']+)["']/);
    return srcMatch ? srcMatch[1] : null;
  };

  const extractVkThumbnail = (iframeCode: string) => {
    // Try to get video ID from iframe and generate thumbnail
    // VK video thumbnails can be constructed from video ID
    const oidMatch = iframeCode.match(/oid=(-?\d+)/);
    const idMatch = iframeCode.match(/id=(\d+)/);
    
    if (oidMatch && idMatch) {
      return `https://vkvideo.ru/video${oidMatch[1]}_${idMatch[1]}.jpg`;
    }
    return null;
  };

  const filteredVideos = videos.filter(video => {
    if (selectedCategory === "all") return true;
    return video.category === selectedCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-4"
          >
            <VideoIcon className="w-12 h-12 md:w-16 md:h-16 text-purple-600" />
          </motion.div>
          <h2 className="text-3xl md:text-5xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Видеотека
          </h2>
          <p className="text-lg md:text-xl text-gray-600">Записи праздников и занятий</p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-12"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                px-4 md:px-6 py-2 md:py-3 rounded-full transition-all text-sm md:text-base
                ${selectedCategory === category.id
                  ? `${category.color} text-white shadow-lg`
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                }
              `}
            >
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Videos Grid */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow cursor-pointer"
                onClick={() => handleVideoClick(video)}
              >
                {/* Thumbnail */}
                <div className="relative h-40 md:h-52 overflow-hidden group">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ImageWithFallback
                      src={video.thumbnail || extractVkThumbnail(video.vk_iframe || "") || "https://images.unsplash.com/photo-1576495350482-942cde5fb23b?w=400"}
                      alt={video.title}
                      className="w-full h-40 md:h-52 object-cover"
                    />
                  </motion.div>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center"
                    >
                      <Play className="w-6 h-6 md:w-8 md:h-8 text-purple-600 ml-1" />
                    </motion.div>
                  </div>

                  {/* Duration Badge */}
                  {video.duration && (
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
                      {video.duration}
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs md:text-sm">
                      {video.category}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 space-y-2 md:space-y-3">
                  <h3 className="text-base md:text-lg text-gray-800 line-clamp-2 min-h-[2.5rem] md:min-h-[3.5rem]">
                    {video.title}
                  </h3>

                  <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
                    {video.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs md:text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                      {new Date(video.date).toLocaleDateString('ru-RU')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3 md:w-4 md:h-4" />
                      {video.views || 0}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredVideos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <VideoIcon className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <p className="text-xl text-gray-500">Видео не найдены</p>
            <p className="text-sm text-gray-400 mt-2">Добавьте видео через админ-панель</p>
          </motion.div>
        )}

        {/* Video Player Modal */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-6" aria-describedby="video-description">
            <DialogHeader className="sr-only">
              <DialogTitle>{selectedVideo?.title || "Видео"}</DialogTitle>
            </DialogHeader>
            <div className="relative">
              <Button
                onClick={() => setPreviewOpen(false)}
                variant="ghost"
                className="absolute top-0 right-0 z-10 rounded-full bg-white/90 hover:bg-white"
              >
                <X className="w-6 h-6" />
              </Button>

              {selectedVideo && (
                <div>
                  {/* Video Player */}
                  <div className="relative aspect-video bg-black">
                    {selectedVideo.vk_iframe ? (
                      <iframe
                        src={extractVkIframe(selectedVideo.vk_iframe) || ""}
                        className="w-full h-full"
                        allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
                        frameBorder="0"
                        allowFullScreen
                        title={selectedVideo.title}
                      />
                    ) : selectedVideo.video_url ? (
                      <video 
                        src={selectedVideo.video_url}
                        className="w-full h-full"
                        controls
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center text-white p-8">
                          <VideoIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg">Видео недоступно</p>
                          <p className="text-sm opacity-75 mt-2">Добавьте ссылку через адм��н-панель</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Video Info */}
                  <div className="p-6 md:p-8" id="video-description">
                    <div className="mb-4">
                      <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white mb-3">
                        {selectedVideo.category}
                      </Badge>
                      <h3 className="text-2xl md:text-3xl text-gray-800 mb-2">{selectedVideo.title}</h3>
                      <p className="text-gray-600">{selectedVideo.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        {new Date(selectedVideo.date).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        {selectedVideo.views || 0} просмотров
                      </div>
                      {selectedVideo.duration && (
                        <div className="flex items-center gap-2">
                          <VideoIcon className="w-5 h-5" />
                          {selectedVideo.duration}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}