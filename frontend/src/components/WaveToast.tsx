"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const WaveToast = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-4 right-4 max-w-md bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3"
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={{
            rotate: [0, 20, 0, 20, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="text-4xl -translate-x-2"
        >
          👋
        </motion.div>
        <div>
          <p className="font-medium">Hey visitor (Taieb)!</p>
          <p className="text-sm opacity-90">
            The backend is running on a small machine for demo purposes, so you
            might feel some slight latency.
          </p>
        </div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="ml-2 text-white/80 hover:text-white"
      >
        ×
      </button>
    </motion.div>
  );
};

export default WaveToast;
