import { motion } from "motion/react";
import { Music, Music2, Headphones } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.8
          }}
          className="relative mb-8"
        >
          {/* Background Circle */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-full blur-2xl opacity-50"
          />

          {/* Main Logo Circle */}
          <div className="relative w-24 h-24 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Music2 className="w-12 h-12 text-white" />
            </motion.div>
          </div>

          {/* Floating Music Notes */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: `${-20 + i * 30}%`,
                left: `${100 + i * 20}%`,
              }}
              animate={{
                y: [-20, -40, -20],
                x: [0, 10, 0],
                rotate: [0, 360],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              {i % 2 === 0 ? (
                <Music className="w-6 h-6 text-purple-500" />
              ) : (
                <Headphones className="w-6 h-6 text-pink-500" />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Музыкальная страничка
          </h2>
          
          {/* Loading Dots */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-gray-600">Загрузка</span>
            {[...Array(3)].map((_, i) => (
              <motion.span
                key={i}
                className="w-2 h-2 bg-purple-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "200px" }}
          transition={{
            duration: 2,
            ease: "easeInOut"
          }}
          className="mt-6 mx-auto h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full"
        />
      </div>

      {/* Background Musical Notes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl text-purple-600"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {["♪", "♫", "♬", "♩"][Math.floor(Math.random() * 4)]}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
