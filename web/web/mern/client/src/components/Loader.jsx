import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../index.css';

const loaderVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.5, ease: 'easeIn' } },
};

export default function Loader({ show = true }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-[#FFDEE9] via-[#B5FFFC] to-[#FF9999]"
          variants={loaderVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.h1
              className="text-4xl md:text-5xl font-bold font-montserrat text-[#FF9999] transition-all duration-300 hover:text-4xl drop-shadow-lg tracking-wide"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
            >
              Dental Clinic
            </motion.h1>
            <motion.div
              className="w-32 h-2 rounded-full bg-gradient-to-r from-[#FF9999] to-pink-400 overflow-hidden mt-2"
              initial={{ width: 0 }}
              animate={{ width: '8rem' }}
              transition={{ delay: 0.7, duration: 0.7, ease: 'easeOut' }}
            >
              <motion.div
                className="h-full bg-white/60 rounded-full"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 