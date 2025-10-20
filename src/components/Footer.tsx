import { motion } from "motion/react";
import { Music2, Mail, Phone, MapPin, Heart } from "lucide-react";

interface FooterProps {
  onNavigate?: (section: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const handleNavigation = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Music2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl">Музыкальная страничка</h3>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed">
              Персональный сайт музыкального руководителя Парфировой Елены Юрьевны
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl mb-4">Разделы</h3>
            <ul className="space-y-2 text-white/80">
              <li><button onClick={() => handleNavigation('about')} className="hover:text-white transition-colors">О себе</button></li>
              <li><button onClick={() => handleNavigation('publications')} className="hover:text-white transition-colors">Публикации</button></li>
              <li><button onClick={() => handleNavigation('achievements')} className="hover:text-white transition-colors">Достижения</button></li>
              <li><button onClick={() => handleNavigation('portfolio')} className="hover:text-white transition-colors">Портфолио</button></li>
            </ul>
          </motion.div>

          {/* Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl mb-4">Медиа</h3>
            <ul className="space-y-2 text-white/80">
              <li><button onClick={() => handleNavigation('albums')} className="hover:text-white transition-colors">Фотоальбомы</button></li>
              <li><button onClick={() => handleNavigation('audio')} className="hover:text-white transition-colors">Аудиотека</button></li>
              <li><button onClick={() => handleNavigation('video')} className="hover:text-white transition-colors">Видеотека</button></li>
              <li><button onClick={() => handleNavigation('reviews')} className="hover:text-white transition-colors">Отзывы</button></li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl mb-4">Контакты</h3>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-start gap-2">
                <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="break-all">elena.parfirova@example.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>+7 (495) 123-45-67</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>МБДОУ "Детский сад № 123", Москва</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 my-8" />

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 text-white/80"
        >
          <p className="flex items-center gap-2">
            © 2024 Парфирова Елена Юрьевна. Все права защищены.
          </p>
          <p className="flex items-center gap-2">
            Создано с <Heart className="w-4 h-4 text-pink-400 fill-pink-400" /> для детей и музыки
          </p>
        </motion.div>
      </div>

      {/* Decorative elements */}
     
    </footer>
  );
}