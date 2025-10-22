import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wifi, WifiOff, Database, AlertCircle } from "lucide-react";

interface ConnectionStatusProps {
  isConnected: boolean | null;
}

export default function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  const [show, setShow] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Auto-hide after 5 seconds if connected
    if (isConnected === true) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  const handleDismiss = () => {
    setDismissed(true);
    setShow(false);
  };

  if (isConnected === null || dismissed) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50"
        >
          {isConnected ? (
            // Connected State
            <motion.div
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-md"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Database className="w-6 h-6" />
              </motion.div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4" />
                  <span className="font-medium">Supabase подключён</span>
                </div>
                <p className="text-xs opacity-90 mt-1">
                  База данных работает. Все функции доступны!
                </p>
              </div>

              <button
                onClick={handleDismiss}
                className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
                aria-label="Закрыть"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          ) : (
            // Disconnected State (Demo Mode)
            <motion.div
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-2xl shadow-2xl max-w-md"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start gap-3">
                <motion.div
                  animate={{
                    rotate: [0, -10, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <AlertCircle className="w-6 h-6 flex-shrink-0" />
                </motion.div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <WifiOff className="w-4 h-4" />
                    <span className="font-medium">Демо-режим</span>
                  </div>
                  <p className="text-xs opacity-90 mb-2">
                    Supabase не подключён. Сайт работает с демо-данными.
                  </p>
                  <a 
                    href="/README.md#настройка-supabase"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline hover:no-underline opacity-90 hover:opacity-100"
                  >
                    Как подключить базу данных? →
                  </a>
                </div>

                <button
                  onClick={handleDismiss}
                  className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors flex-shrink-0"
                  aria-label="Закрыть"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
