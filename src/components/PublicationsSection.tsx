import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Download, Search, FileText, Calendar, Eye, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { publicationsApi } from "../utils/supabase/client";

const defaultCategories = [
  { id: "all", label: "Все публикации", color: "bg-gray-500" },
  { id: "education", label: "Воспитательная работа", color: "bg-pink-500" },
  { id: "art", label: "Декоративно-прикладное искусство", color: "bg-purple-500" },
  { id: "distance", label: "Дистанционное обучение", color: "bg-blue-500" },
  { id: "health", label: "Здоровый образ жизни", color: "bg-green-500" },
  { id: "correction", label: "Коррекционная педагогика", color: "bg-orange-500" },
  { id: "parents", label: "Материалы для родителей", color: "bg-red-500" },
  { id: "music", label: "Музыкально-ритмическое занятие", color: "bg-indigo-500" },
  { id: "world", label: "Окружающий мир", color: "bg-teal-500" },
  { id: "other", label: "Разное", color: "bg-gray-500" },
  { id: "scenarios", label: "Сценарии праздников", color: "bg-yellow-500" },
];

const getCategoryLabel = (categoryId: string) => {
  const category = defaultCategories.find(cat => cat.id === categoryId);
  return category ? category.label : categoryId;
};

export default function PublicationsSection() {
  const [publications, setPublications] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<any | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    loadPublications();
  }, []);

  const loadPublications = async () => {
    try {
      const data = await publicationsApi.getAll();
      setPublications(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error loading publications:', error);
      setPublications([]);
    }
  };

  const filteredPublications = publications.filter(pub => {
    const matchesCategory = selectedCategory === "all" || pub.category === selectedCategory;
    const matchesSearch = pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pub.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryInfo = (categoryId: string) => {
    return defaultCategories.find(cat => cat.id === categoryId) || defaultCategories[0];
  };

  const handleRead = (publication: any) => {
    setSelectedPublication(publication);
    setPreviewOpen(true);
  };

  const handleDownload = async (publication: any) => {
    if (!publication.file_url) {
      toast.error("Файл недоступен для скачивания");
      return;
    }
    
    try {
      const link = document.createElement('a');
      link.href = publication.file_url;
      link.download = `${publication.title}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Скачивание началось!");
    } catch (error) {
      toast.error("Ошибка скачивания");
    }
  };

  const getFileType = (filename: string) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    return ext === 'pdf' ? 'PDF' : ext === 'docx' ? 'DOCX' : ext === 'doc' ? 'DOC' : 'FILE';
  };

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
              rotate: [0, -10, 10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-4"
          >
            <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-purple-600" />
          </motion.div>
          <h2 className="text-3xl md:text-5xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Мои публикации
          </h2>
          <p className="text-lg md:text-xl text-gray-600">Методические материалы, сценарии, консультации</p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 md:mb-8 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Поиск по публикациям..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-5 md:py-6 rounded-full border-2 border-purple-200 focus:border-purple-400"
              />
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="px-6 py-5 md:py-6 rounded-full border-2 border-purple-300"
            >
              <Filter className="w-5 h-5 mr-2" />
              Категории
            </Button>
          </div>

          {/* Category filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-lg">
                  <div className="flex flex-wrap gap-2">
                    {defaultCategories.map((category, index) => (
                      <motion.button
                        key={category.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`
                          px-3 md:px-4 py-2 rounded-full transition-all text-sm md:text-base
                          ${selectedCategory === category.id
                            ? `${category.color} text-white shadow-lg`
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }
                        `}
                      >
                        {category.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Publications Grid */}
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredPublications.map((publication, index) => {
              const categoryInfo = getCategoryInfo(publication.category);
              
              return (
                <motion.div
                  key={publication.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
                >
                  {/* Image */}
                  <div className="relative h-40 md:h-48 overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ImageWithFallback
                        src={publication.cover_image || publication.image || "https://images.unsplash.com/photo-1576495350482-942cde5fb23b?w=400"}
                        alt={publication.title}
                        className="w-full h-40 md:h-48 object-cover"
                      />
                    </motion.div>
                    <div className="absolute top-4 left-4">
                      <Badge className={`${categoryInfo.color} text-white text-xs md:text-sm`}>
                        {categoryInfo.label}
                      </Badge>
                    </div>
                    {publication.file_url && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-blue-500 text-white text-xs">
                          {getFileType(publication.file_url)}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                    <h3 className="text-lg md:text-xl text-gray-800 line-clamp-2">
                      {publication.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {publication.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(publication.date).toLocaleDateString('ru-RU')}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleRead(publication)}
                        className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full text-sm md:text-base"
                      >
                        <Eye className="w-4 h-4 mr-1 md:mr-2" />
                        Читать
                      </Button>
                      {publication.file_url && (
                        <Button
                          onClick={() => handleDownload(publication)}
                          variant="outline"
                          className="rounded-full border-2 border-purple-300"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredPublications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <BookOpen className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <p className="text-xl text-gray-500">Публикации не найдены</p>
          </motion.div>
        )}

        {/* Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl text-gray-800 pr-8">
                {selectedPublication?.title}
              </DialogTitle>
            </DialogHeader>
            
            {selectedPublication && (
              <div className="space-y-6">
                {/* Cover Image */}
                {(selectedPublication.cover_image || selectedPublication.image) && (
                  <div className="relative w-full h-64 rounded-2xl overflow-hidden">
                    <ImageWithFallback
                      src={selectedPublication.cover_image || selectedPublication.image}
                      alt={selectedPublication.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Category & Date */}
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className={`${getCategoryInfo(selectedPublication.category).color} text-white`}>
                    {getCategoryLabel(selectedPublication.category)}
                  </Badge>
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(selectedPublication.date).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>

                {/* Description */}
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedPublication.description}
                  </p>
                </div>

                {/* File Preview or Download */}
                {selectedPublication.file_url ? (
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600">Документ доступен для скачивания</p>
                          <p className="text-xs text-gray-500">
                            Формат: {getFileType(selectedPublication.file_url)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleDownload(selectedPublication)}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Скачать документ
                    </Button>

                    {/* PDF Preview */}
                    {selectedPublication.file_url?.endsWith('.pdf') && (
                      <div className="mt-4">
                        <iframe
                          src={selectedPublication.file_url}
                          className="w-full h-[500px] rounded-xl border-2 border-purple-200"
                          title="PDF Preview"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 text-center">
                    <FileText className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                    <p className="text-gray-700">Файл для скачивания пока не добавлен</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}