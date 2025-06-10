"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { recommendations } from "@/consts";

interface RecommendationsProps {
  onQuestionSelect: (question: string) => void;
}

const Recommendations = ({ onQuestionSelect }: RecommendationsProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleClick = (question: string, index: number) => {
    setSelectedIndex(index);
    setTimeout(() => {
      onQuestionSelect(question);
    }, 300);
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-md text-center font-semibold text-gray-600 mb-4">
        Suggested Questions
      </h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.question}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: selectedIndex === index ? 0 : 1,
                y: selectedIndex === index ? -300 : 0,
                x: selectedIndex === index ? 400 : 0,
                scale: selectedIndex === index ? 0.3 : 1,
                rotate: selectedIndex === index ? 5 : 0,
              }}
              exit={{
                opacity: 0,
                y: -300,
                x: 400,
                scale: 0.3,
                rotate: 5,
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              onClick={() => handleClick(rec.question, index)}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:border-blue-200 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {rec.icon}
                </span>
                <div>
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    {rec.category}
                  </span>
                  <p className="mt-1 text-gray-700 group-hover:text-blue-600 transition-colors">
                    {rec.question}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Recommendations;
