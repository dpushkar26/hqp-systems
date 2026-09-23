'use client';

import { motion } from 'framer-motion';

export function StampProgress() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const dotVariants = {
    hidden: { opacity: 0.2, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: 'spring',
        bounce: 0.4,
        duration: 0.8,
      }
    },
  };

  return (
    <motion.div 
      className="flex items-center gap-3 md:gap-4 p-6 bg-[var(--bg-softer)] rounded-2xl border border-[var(--line)]"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.6 }}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div 
          key={i}
          variants={dotVariants}
          className="stamp-dot w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-[var(--accent)] flex items-center justify-center bg-[var(--bg-soft)]"
        >
          {i === 5 ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          ) : (
            <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-[var(--accent)] opacity-20" />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
