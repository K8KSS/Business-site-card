import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Award, GraduationCap, Heart, Music } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { pagesApi } from "../utils/supabase/client";

export default function AboutSection() {
  const defaultImage = "https://images.unsplash.com/photo-1750924718882-33ee16ddf3a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFjaGVyJTIwcG9ydHJhaXQlMjB3b21hbnxlbnwxfHx8fDE3NjA1NjY4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
  
  const [pageData, setPageData] = useState<any>({ image_url: defaultImage });

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      const data = await pagesApi.getPage('about');
      if (data && data.image_url) {
        setPageData(data);
      }
    } catch (error) {
      console.error('Error loading about page:', error);
      // Keep using default image on error
    }
  };
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
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-4"
          >
            <Music className="w-16 h-16 text-purple-600" />
          </motion.div>
          <h2 className="text-5xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            О себе
          </h2>
          <p className="text-xl text-gray-600">Парфирова Елена Юрьевна</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-400 rounded-3xl blur-xl opacity-30" />
            <ImageWithFallback
              src={pageData.image_url}
              alt="Парфирова Елена Юрьевна"
              className="relative w-full h-[600px] object-cover rounded-3xl shadow-2xl"
            />
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Education & Experience Cards */}
            <motion.div
              whileHover={{ scale: 1.02, rotate: 1 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 border-pink-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl text-purple-600 mb-2">Образование</h3>
                  <p className="text-gray-700">
                    Высшее педагогическое образование, специальность "Музыкальное образование"
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, rotate: -1 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 border-purple-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl text-purple-600 mb-2">Опыт работы</h3>
                  <p className="text-gray-700">
                    Более 15 лет работы музыкальным руководителем в дошкольных образовательных учреждениях
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, rotate: 1 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 border-blue-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl text-purple-600 mb-2">Профессиональное кредо</h3>
                  <p className="text-gray-700 italic">
                    "Музыка - это язык души. Моя задача - помочь каждому ребенку открыть для себя 
                    этот удивительный мир звуков, ритмов и гармонии."
                  </p>
                </div>
              </div>
            </motion.div>

            {/* About text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-8 shadow-lg"
            >
              <h3 className="text-2xl text-purple-600 mb-4">Мой подход</h3>
              <div className="space-y-3 text-gray-700">
                <p>
                  Я убеждена, что каждый ребенок талантлив и способен к творчеству. 
                  В своей работе я использую разнообразные методы и приемы, которые 
                  помогают детям раскрыть свой потенциал.
                </p>
                <p>
                  Работаю по программам музыкального воспитания, применяю инновационные 
                  технологии, здоровьесберегающие методики. Постоянно повышаю свою 
                  квалификацию, участвую в профессиональных конкурсах и делюсь опытом 
                  с коллегами.
                </p>
                <p>
                  Мои воспитанники - активные участники и победители творческих конкурсов 
                  различного уровня. Это наполняет мою работу особым смыслом и радостью!
                </p>
              </div>
            </motion.div>

            {/* Contacts */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg"
            >
              <h3 className="text-xl text-purple-600 mb-4">Контакты</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> elena.parfirova@example.com</p>
                <p><strong>Учреждение:</strong> МБДОУ "Детский сад № 123"</p>
                <p><strong>Город:</strong> Самара</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
