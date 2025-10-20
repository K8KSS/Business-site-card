import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Music, User, BookOpen, Image, Award, FileText, MessageCircle, Mail, Headphones, Video, Settings } from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import Header from "./components/Header";
import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import PublicationsSection from "./components/PublicationsSection";
import PhotoAlbums from "./components/PhotoAlbums";
import Achievements from "./components/Achievements";
import Portfolio from "./components/Portfolio";
import ReviewsSection from "./components/ReviewsSection";
import FeedbackForm from "./components/FeedbackForm";
import AudioSection from "./components/AudioSection";
import VideoSection from "./components/VideoSection";
import AdminPanel from "./components/AdminPanel";
import Footer from "./components/Footer";

export default function App() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [showAdmin, setShowAdmin] = useState(false);

  const sections = [
    { id: "home", label: "Главная", icon: Music },
    { id: "about", label: "О себе", icon: User },
    { id: "publications", label: "Публикации", icon: BookOpen },
    { id: "albums", label: "Альбомы", icon: Image },
    { id: "achievements", label: "Достижения", icon: Award },
    { id: "portfolio", label: "Портфолио", icon: FileText },
    { id: "reviews", label: "Отзывы", icon: MessageCircle },
    { id: "contact", label: "Связь", icon: Mail },
    { id: "audio", label: "Аудио", icon: Headphones },
    { id: "video", label: "Видео", icon: Video },
  ];

  // Admin panel access - Method 1: 3 clicks on logo
  const [logoClicks, setLogoClicks] = useState(0);
  
  const handleLogoClick = () => {
    const newClicks = logoClicks + 1;
    setLogoClicks(newClicks);
    if (newClicks >= 3) {
      setShowAdmin(true);
      setLogoClicks(0);
    }
  };

  // Admin panel access - Method 2: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowAdmin(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Animated musical notes background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: -50,
              rotate: 0
            }}
            animate={{
              y: window.innerHeight + 50,
              rotate: 360,
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
          >
            {["♪", "♫", "♬", "♩"][Math.floor(Math.random() * 4)]}
          </motion.div>
        ))}
      </div>

      <Header 
        sections={sections} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        onLogoClick={handleLogoClick}
      />

      <main className="relative">
        <AnimatePresence mode="wait">
          {showAdmin ? (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AdminPanel onClose={() => setShowAdmin(false)} />
            </motion.div>
          ) : (
            <motion.div
              key="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {activeSection === "home" && <Hero onNavigate={setActiveSection} />}
              {activeSection === "about" && <AboutSection />}
              {activeSection === "publications" && <PublicationsSection />}
              {activeSection === "albums" && <PhotoAlbums />}
              {activeSection === "achievements" && <Achievements />}
              {activeSection === "portfolio" && <Portfolio />}
              {activeSection === "reviews" && <ReviewsSection />}
              {activeSection === "contact" && <FeedbackForm />}
              {activeSection === "audio" && <AudioSection />}
              {activeSection === "video" && <VideoSection />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {!showAdmin && <Footer onNavigate={setActiveSection} />}
      
      <Toaster position="top-right" />
    </div>
  );
}