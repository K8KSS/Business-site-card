import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Music2, LucideIcon, Menu, X } from "lucide-react";

interface Section {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface HeaderProps {
  sections: Section[];
  activeSection: string;
  setActiveSection: (id: string) => void;
  onLogoClick: () => void;
}

export default function Header({ sections, activeSection, setActiveSection, onLogoClick }: HeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        // Scrolling up or at top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
        setIsMobileMenuOpen(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlHeader);
    return () => window.removeEventListener('scroll', controlHeader);
  }, [lastScrollY]);

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-lg border-b-4 border-gradient"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-0 md:mb-4">
          <motion.div
            whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
            className="flex items-center gap-2 md:gap-3 cursor-pointer"
            onClick={onLogoClick}
          >
            <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Music2 className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Музыкальная страничка
              </h1>
              <p className="text-xs md:text-sm text-gray-600">Парфирова Елена Юрьевна</p>
            </div>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-purple-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-purple-600" />
            ) : (
              <Menu className="w-6 h-6 text-purple-600" />
            )}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-wrap gap-2">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection(section.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full transition-all
                  ${isActive 
                    ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white shadow-lg' 
                    : 'bg-white hover:bg-gradient-to-r hover:from-pink-100 hover:via-purple-100 hover:to-blue-100 text-gray-700'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{section.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden mt-4"
            >
              <div className="grid grid-cols-2 gap-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <motion.button
                      key={section.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setActiveSection(section.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`
                        flex items-center gap-2 px-3 py-3 rounded-2xl transition-all
                        ${isActive 
                          ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white shadow-lg' 
                          : 'bg-white hover:bg-gradient-to-r hover:from-pink-100 hover:via-purple-100 hover:to-blue-100 text-gray-700 border-2 border-gray-200'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{section.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .border-gradient {
          border-image: linear-gradient(to right, #ec4899, #a855f7, #3b82f6) 1;
        }
      `}</style>
    </motion.header>
  );
}
