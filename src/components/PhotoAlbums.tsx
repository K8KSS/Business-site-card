import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Calendar, Download } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { albumsApi } from "../utils/supabase/client";

export default function PhotoAlbums() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState<typeof albums[0] | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    try {
      const data = await albumsApi.getAll();
      setAlbums(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error loading albums:', error);
      setAlbums([]);
    }
  };

  const filteredAlbums = albums.filter(album =>
    album.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openLightbox = (album: typeof albums[0], photoIndex: number) => {
    setSelectedAlbum(album);
    setCurrentPhotoIndex(photoIndex);
    setIsLightboxOpen(true);
  };

  const nextPhoto = () => {
    if (selectedAlbum) {
      setCurrentPhotoIndex((prev) => 
        prev === selectedAlbum.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevPhoto = () => {
    if (selectedAlbum) {
      setCurrentPhotoIndex((prev) => 
        prev === 0 ? selectedAlbum.photos.length - 1 : prev - 1
      );
    }
  };

  const downloadPhoto = async (photo: any) => {
    try {
      const link = document.createElement('a');
      link.href = photo.url;
      link.download = `photo_${Date.now()}.jpg`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Скачивание началось!");
    } catch (error) {
      toast.error("Ошибка скачивания");
    }
  };

  const downloadAlbum = async (album: typeof albums[0]) => {
    toast.info("Начинаем скачивание альбома...");
    for (let i = 0; i < album.photos.length; i++) {
      setTimeout(() => {
        downloadPhoto(album.photos[i]);
      }, i * 500);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-4"
          >
            <ImageIcon className="w-16 h-16 text-purple-600" />
          </motion.div>
          <h2 className="text-5xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Фотоальбомы
          </h2>
          <p className="text-xl text-gray-600">Наши праздники и мероприятия</p>
        </motion.div>

        {/* Search Bar */}
        <div className="mb-8">
          <Input
            type="text"
            placeholder="Поиск альбомов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Albums Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAlbums.map((album, index) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow bg-white">
                {/* Cover Image */}
                <div className="relative h-64 overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ImageWithFallback
                      src={album.cover}
                      alt={album.title}
                      className="w-full h-64 object-cover"
                    />
                  </motion.div>
                  
                  {/* Photo count overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div className="flex items-center gap-2 text-white">
                      <ImageIcon className="w-5 h-5" />
                      <span>{album.photos.length} фото</span>
                    </div>
                  </div>
                </div>

                {/* Album Info */}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl text-gray-800">
                    {album.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(album.date).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Photo Thumbnails Preview */}
                  <div className="flex gap-2 overflow-hidden">
                    {album.photos.slice(0, 4).map((photo: any, photoIndex: number) => (
                      <motion.div
                        key={photo.id}
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                        onClick={() => openLightbox(album, photoIndex)}
                        className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                      >
                        <ImageWithFallback
                          src={photo.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ))}
                    {album.photos.length > 4 && (
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white">
                        +{album.photos.length - 4}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedAlbum(album);
                      setCurrentPhotoIndex(0);
                    }}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full"
                  >
                    Смотреть альбом
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Album View */}
        <AnimatePresence>
          {selectedAlbum && !isLightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedAlbum(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b p-6 flex items-center justify-between z-10">
                  <div>
                    <h3 className="text-2xl">{selectedAlbum.title}</h3>
                    <p className="text-gray-600">
                      {new Date(selectedAlbum.date).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <Button
                    onClick={() => setSelectedAlbum(null)}
                    variant="ghost"
                    className="rounded-full"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                  {selectedAlbum.photos.map((photo: any, photoIndex: number) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: photoIndex * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => openLightbox(selectedAlbum, photoIndex)}
                      className="aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <ImageWithFallback
                        src={photo.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lightbox */}
        <AnimatePresence>
          {isLightboxOpen && selectedAlbum && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center"
              onClick={() => setIsLightboxOpen(false)}
            >
              <Button
                onClick={() => setIsLightboxOpen(false)}
                variant="ghost"
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full z-10"
              >
                <X className="w-8 h-8" />
              </Button>

              <div className="relative w-full h-full flex items-center justify-center p-20">
                <motion.div
                  key={currentPhotoIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative max-w-5xl max-h-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ImageWithFallback
                    src={selectedAlbum.photos[currentPhotoIndex].url}
                    alt=""
                    className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                  />
                </motion.div>

                {/* Navigation Buttons */}
                {selectedAlbum.photos.length > 1 && (
                  <>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevPhoto();
                      }}
                      className="absolute left-8 top-1/2 -translate-y-1/2 rounded-full w-14 h-14 bg-white/20 hover:bg-white/30 text-white"
                    >
                      <ChevronLeft className="w-8 h-8" />
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextPhoto();
                      }}
                      className="absolute right-8 top-1/2 -translate-y-1/2 rounded-full w-14 h-14 bg-white/20 hover:bg-white/30 text-white"
                    >
                      <ChevronRight className="w-8 h-8" />
                    </Button>
                  </>
                )}

                {/* Photo Counter */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white">
                  {currentPhotoIndex + 1} / {selectedAlbum.photos.length}
                </div>

                {/* Download Button */}
                <Button
                  onClick={() => downloadAlbum(selectedAlbum)}
                  variant="ghost"
                  className="absolute bottom-8 right-8 text-white hover:bg-white/20 rounded-full z-10"
                >
                  <Download className="w-8 h-8" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}