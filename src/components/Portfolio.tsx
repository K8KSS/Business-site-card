import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FileText, Calendar, Download, X } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { portfolioApi } from "../utils/supabase/client";

const getCategoryLabel = (categoryId: string) => {
  const categories: Record<string, string> = {
    diploma: "Диплом",
    certificate: "Сертификат",
    gratitude: "Благодарность",
  };
  return categories[categoryId] || categoryId;
};

export default function Portfolio() {
  const [diplomas, setDiplomas] = useState<any[]>([]);
  const [selectedDiploma, setSelectedDiploma] = useState<any | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const data = await portfolioApi.getAll();
      setDiplomas(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error loading portfolio:', error);
      setDiplomas([]);
    }
  };

  const handleView = (diploma: any) => {
    setSelectedDiploma(diploma);
    setPreviewOpen(true);
  };

  const handleDownload = async (diploma: any) => {
    const imageUrl = diploma.image_url || diploma.image;
    if (!imageUrl) {
      toast.error("Изображение недоступно");
      return;
    }
    
    try {
      // For better compatibility, use fetch and blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${diploma.title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Скачивание началось!");
    } catch (error) {
      // Fallback to direct download
      try {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `${diploma.title}.jpg`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Скачивание началось!");
      } catch (err) {
        console.error("Download error:", error);
        toast.error("Ошибка скачивания");
      }
    }
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
              rotate: [0, 10, -10, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-4"
          >
            <FileText className="w-12 h-12 md:w-16 md:h-16 text-purple-600" />
          </motion.div>
          <h2 className="text-3xl md:text-5xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Портфолио
          </h2>
          <p className="text-lg md:text-xl text-gray-600">Дипломы, сертификаты и награды</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-pink-500 to-purple-500 rounded-3xl p-6 text-white shadow-lg"
          >
            <div className="text-3xl md:text-5xl mb-2">{diplomas.length}</div>
            <div className="text-base md:text-xl opacity-90">Документов в портфолио</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl p-6 text-white shadow-lg"
          >
            <div className="text-3xl md:text-5xl mb-2">
              {new Date().getFullYear() - 2010}+
            </div>
            <div className="text-base md:text-xl opacity-90">Лет опыта</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-blue-500 to-teal-500 rounded-3xl p-6 text-white shadow-lg"
          >
            <div className="text-3xl md:text-5xl mb-2">3</div>
            <div className="text-base md:text-xl opacity-90">Категорий наград</div>
          </motion.div>
        </div>

        {/* Diplomas Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {diplomas.map((diploma, index) => (
            <motion.div
              key={diploma.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, rotate: [0, 1, -1, 0] }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer"
              onClick={() => handleView(diploma)}
            >
              {/* Diploma Image */}
              <div className="relative h-48 md:h-64 overflow-hidden bg-gradient-to-br from-yellow-50 to-orange-50">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  <ImageWithFallback
                    src={diploma.image_url || diploma.image || ""}
                    alt={diploma.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs md:text-sm">
                    {getCategoryLabel(diploma.category)}
                  </Badge>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-20 h-20">
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[80px] border-r-[80px] border-t-yellow-400/30 border-r-transparent" />
                </div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                <h3 className="text-base md:text-lg text-gray-800 line-clamp-2 min-h-[3rem] md:min-h-[3.5rem]">
                  {diploma.title}
                </h3>

                <p className="text-xs md:text-sm text-purple-600">
                  {diploma.organization}
                </p>

                {/* Meta */}
                <div className="flex items-center text-xs md:text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(diploma.date).toLocaleDateString('ru-RU')}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(diploma);
                    }}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full text-sm md:text-base"
                  >
                    Просмотр
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(diploma);
                    }}
                    variant="outline"
                    className="rounded-full border-2 border-purple-300"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {diplomas.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Портфолио пока пусто</p>
          </div>
        )}

        {/* Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-6">
            <DialogHeader className="sr-only">
              <DialogTitle>{selectedDiploma?.title || "Документ"}</DialogTitle>
            </DialogHeader>
            <div className="relative">
              <Button
                onClick={() => setPreviewOpen(false)}
                variant="ghost"
                className="absolute top-0 right-0 z-10 rounded-full bg-white/90 hover:bg-white"
              >
                <X className="w-6 h-6" />
              </Button>

              {selectedDiploma && (
                <div className="p-4 md:p-8">
                  {/* Full Size Image */}
                  <div className="relative w-full mb-6">
                    <ImageWithFallback
                      src={selectedDiploma.image_url || selectedDiploma.image || ""}
                      alt={selectedDiploma.title}
                      className="w-full h-auto rounded-2xl shadow-2xl"
                    />
                  </div>

                  {/* Info */}
                  <div className="space-y-4">
                    <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                      {getCategoryLabel(selectedDiploma.category)}
                    </Badge>

                    <h3 className="text-2xl md:text-3xl text-gray-800">
                      {selectedDiploma.title}
                    </h3>

                    <p className="text-lg md:text-xl text-purple-600">
                      {selectedDiploma.organization}
                    </p>

                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-5 h-5 mr-2" />
                      {new Date(selectedDiploma.date).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>

                    <Button
                      onClick={() => handleDownload(selectedDiploma)}
                      className="w-full md:w-auto bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full px-8"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Скачать диплом
                    </Button>
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
