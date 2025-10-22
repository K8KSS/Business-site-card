import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, Star, Calendar, User } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner";
import { reviewsApi } from "../utils/supabase/client";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newReview, setNewReview] = useState({
    author: "",
    role: "",
    text: "",
    rating: 5,
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await reviewsApi.getAll('approved');
      setReviews(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error loading reviews:', error);
      setReviews([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await reviewsApi.create(newReview);
      toast.success("Спасибо за ваш отзыв! Он будет опубликован после модерации.");
      setNewReview({ author: "", role: "", text: "", rating: 5 });
      setShowForm(false);
    } catch (error: any) {
      toast.error("Ошибка: " + (error.message || "Не удалось отправить отзыв"));
    } finally {
      setIsLoading(false);
    }
  };

  // Лайки убраны по требованию клиента

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-4"
          >
            <MessageCircle className="w-16 h-16 text-purple-600" />
          </motion.div>
          <h2 className="text-5xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Отзывы
          </h2>
          <p className="text-xl text-gray-600">Что говорят родители и коллеги</p>
        </motion.div>

        {/* Add Review Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-6 rounded-full shadow-lg text-lg"
            disabled={isLoading}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Оставить отзыв
          </Button>
        </motion.div>

        {/* Review Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12"
            >
              <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Ваше имя</label>
                    <Input
                      required
                      value={newReview.author}
                      onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                      placeholder="Как вас зовут?"
                      className="rounded-full border-2 border-purple-200"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Ваша роль</label>
                    <Input
                      required
                      value={newReview.role}
                      onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                      placeholder="Например: Мама воспитанника"
                      className="rounded-full border-2 border-purple-200"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Оценка</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <motion.button
                        key={rating}
                        type="button"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setNewReview({ ...newReview, rating })}
                        className={`text-3xl ${
                          rating <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        disabled={isLoading}
                      >
                        <Star className="w-8 h-8 fill-current" />
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Ваш отзыв</label>
                  <Textarea
                    required
                    value={newReview.text}
                    onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                    placeholder="Поделитесь своим мнением..."
                    rows={5}
                    className="rounded-3xl border-2 border-purple-200"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full py-6"
                    disabled={isLoading}
                  >
                    {isLoading ? "Отправка..." : "Отправить отзыв"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowForm(false)}
                    variant="outline"
                    className="flex-1 rounded-full border-2 border-purple-300 py-6"
                    disabled={isLoading}
                  >
                    Отмена
                  </Button>
                </div>

                <p className="text-sm text-gray-500 text-center">
                  * Отзыв будет опубликован после проверки модератором
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <Avatar className="w-16 h-16 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-400 text-white text-xl">
                    {review.author.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl text-gray-800">{review.author}</h3>
                      <p className="text-sm text-purple-600">{review.role}</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Calendar className="w-4 h-4" />
                      {new Date(review.date).toLocaleDateString('ru-RU')}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 leading-relaxed">
                    {review.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Пока нет отзывов. Будьте первым!</p>
          </div>
        )}

        {/* Average Rating */}
        {reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-3xl p-8 text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-6xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => {
                    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
                    return (
                      <Star 
                        key={i} 
                        className={`w-8 h-8 ${
                          i < Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`} 
                      />
                    );
                  })}
                </div>
                <p className="text-gray-600">Средний рейтинг</p>
              </div>
            </div>
            <p className="text-gray-600">
              На основе {reviews.length} отзывов
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
