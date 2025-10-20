import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Award, Trophy, Medal, Star, Sparkles } from "lucide-react";
import { achievementsApi } from "../utils/supabase/client";

const statistics = [
  { label: "Лет педагогического стажа", value: "15+", icon: Award },
  { label: "Авторских методик", value: "25+", icon: Star },
  { label: "Проведенных праздников", value: "200+", icon: Sparkles },
  { label: "Победителей конкурсов", value: "50+", icon: Trophy },
];

const iconMap: Record<string, any> = {
  Trophy,
  Award,
  Medal,
  Star,
  Sparkles,
};

// Fallback achievements if API is not available
const fallbackAchievements = [
  {
    id: 1,
    title: "Победитель районного конкурса 'Лучший педагог года'",
    year: "2024",
    type: "personal",
    icon: "Trophy",
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: 2,
    title: "1 место во Всероссийском конкурсе методических разработок",
    year: "2023",
    type: "professional",
    icon: "Award",
    color: "from-blue-400 to-purple-500",
  },
  {
    id: 3,
    title: "Благодарность от Министерства образования",
    year: "2023",
    type: "personal",
    icon: "Star",
    color: "from-pink-400 to-red-500",
  },
  {
    id: 4,
    title: "Диплом за подготовку победителей творческого конкурса",
    year: "2024",
    type: "teaching",
    icon: "Medal",
    color: "from-green-400 to-teal-500",
  },
  {
    id: 5,
    title: "Лауреат городского фестиваля педагогического мастерства",
    year: "2022",
    type: "professional",
    icon: "Sparkles",
    color: "from-purple-400 to-pink-500",
  },
  {
    id: 6,
    title: "Почетная грамота за вклад в развитие музыкального образования",
    year: "2022",
    type: "personal",
    icon: "Award",
    color: "from-orange-400 to-red-500",
  },
];

export default function Achievements() {
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const data = await achievementsApi.getAll();
      setAchievements(Array.isArray(data) && data.length > 0 ? data : fallbackAchievements);
    } catch (error: any) {
      console.error('Error loading achievements:', error);
      setAchievements(fallbackAchievements);
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
            <Trophy className="w-16 h-16 text-yellow-500" />
          </motion.div>
          <h2 className="text-5xl bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
            Достижения
          </h2>
          <p className="text-xl text-gray-600">Награды и признание профессионального мастерства</p>
        </motion.div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {statistics.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.5 }
                }}
                className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-6 shadow-lg text-center"
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                  className="inline-block mb-4"
                >
                  <Icon className="w-12 h-12 text-purple-600 mx-auto" />
                </motion.div>
                <div className="text-4xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => {
            const Icon = iconMap[achievement.icon] || Trophy;
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  y: -10,
                  rotate: [0, 2, -2, 0],
                  transition: { duration: 0.3 }
                }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
              >
                <div className={`h-2 bg-gradient-to-r ${achievement.color}`} />
                
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                      className={`w-14 h-14 rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </motion.div>
                    
                    <div className="flex-1">
                      <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full text-sm text-purple-700 mb-2">
                        {achievement.year}
                      </div>
                      <h3 className="text-lg text-gray-800 leading-snug">
                        {achievement.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {achievements.length === 0 && (
          <div className="text-center py-20">
            <Trophy className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <p className="text-xl text-gray-500">Нет достижений</p>
            <p className="text-sm text-gray-400 mt-2">Добавьте достижения через админ-панель</p>
          </div>
        )}

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-3xl p-12 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 text-9xl text-purple-200 opacity-20">
              "
            </div>
            <div className="relative z-10">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
                className="inline-block mb-6"
              >
                <Star className="w-12 h-12 text-yellow-500" />
              </motion.div>
              <p className="text-2xl text-gray-700 italic mb-6">
                Каждое достижение — это не только награда, но и подтверждение того, 
                что я на правильном пути. Главная моя награда — это счастливые глаза детей 
                и их любовь к музыке!
              </p>
              <p className="text-xl text-purple-600">— Парфирова Елена Юрьевна</p>
            </div>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -50,
                opacity: 0.3,
              }}
              animate={{
                y: window.innerHeight + 50,
                rotate: 360,
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            >
              {i % 3 === 0 ? (
                <Trophy className="w-8 h-8 text-yellow-400" />
              ) : i % 3 === 1 ? (
                <Star className="w-8 h-8 text-purple-400" />
              ) : (
                <Medal className="w-8 h-8 text-pink-400" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
