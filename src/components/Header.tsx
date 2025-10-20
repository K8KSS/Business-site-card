import { motion } from "motion/react";
import { Music2, LucideIcon } from "lucide-react";

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
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-lg border-b-4 border-gradient"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={onLogoClick}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Music2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Музыкальная страничка
              </h1>
              <p className="text-sm text-gray-600">Парфирова Елена Юрьевна</p>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap gap-2">
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
      </div>

      <style>{`
        .border-gradient {
          border-image: linear-gradient(to right, #ec4899, #a855f7, #3b82f6) 1;
        }
      `}</style>
    </motion.header>
  );
}
