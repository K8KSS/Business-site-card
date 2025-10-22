import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Send, User, MessageSquare, Phone, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { messagesApi } from "../utils/supabase/client";

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await messagesApi.create(formData);
      setIsSubmitted(true);
      toast.success("Сообщение отправлено!");
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      }, 3000);
    } catch (error: any) {
      toast.error("Ошибка: " + (error.message || "Не удалось отправить сообщение"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-4"
          >
            <Mail className="w-16 h-16 text-purple-600" />
          </motion.div>
          <h2 className="text-5xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Обратная связь
          </h2>
          <p className="text-xl text-gray-600">Свяжитесь со мной</p>
        </motion.div>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-green-100 to-teal-100 rounded-3xl p-12 text-center shadow-lg"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 0.5,
              }}
              className="inline-block mb-6"
            >
              <CheckCircle className="w-24 h-24 text-green-600" />
            </motion.div>
            <h3 className="text-3xl text-gray-800 mb-4">Сообщение отправлено!</h3>
            <p className="text-xl text-gray-600">
              Спасибо за ваше обращение. Я свяжусь с вами в ближайшее время!
            </p>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-8 shadow-lg">
                <h3 className="text-2xl text-purple-600 mb-6">Контактная информация</h3>
                
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-2xl p-4"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">ФИО</div>
                      <div className="text-gray-800">Парфирова Елена Юрьевна</div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-2xl p-4"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Email</div>
                      <div className="text-gray-800">elena.parfirova@example.com</div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-2xl p-4"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Телефон</div>
                      <div className="text-gray-800">+7 (495) 123-45-67</div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-2xl p-4"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Учреждение</div>
                      <div className="text-gray-800">МБДОУ "Детский сад № 123"</div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-6 shadow-lg"
              >
                <p className="text-gray-700 text-center italic">
                  "Я всегда рада общению с родителями и коллегами! 
                  Не стесняйтесь обращаться с вопросами и предложениями."
                </p>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">Ваше имя *</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Как вас зовут?"
                    className="rounded-full border-2 border-purple-200 focus:border-purple-400"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Email *</label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="rounded-full border-2 border-purple-200 focus:border-purple-400"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Телефон</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+7 (___) ___-__-__"
                    className="rounded-full border-2 border-purple-200 focus:border-purple-400"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Тема обращения *</label>
                  <Input
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="О чем вы хотите написать?"
                    className="rounded-full border-2 border-purple-200 focus:border-purple-400"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Сообщение *</label>
                  <Textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Ваше сообщение..."
                    rows={6}
                    className="rounded-3xl border-2 border-purple-200 focus:border-purple-400"
                    disabled={isLoading}
                  />
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white rounded-full py-6 shadow-lg text-lg"
                    disabled={isLoading}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {isLoading ? "Отправка..." : "Отправить сообщение"}
                  </Button>
                </motion.div>

                <p className="text-sm text-gray-500 text-center">
                  * Обязательные для заполнения поля
                </p>
              </form>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
