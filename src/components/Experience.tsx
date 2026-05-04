'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CurtainReveal from './CurtainReveal';
import MemoryDeck from './MemoryDeck';
import PuzzleGallery from './PuzzleGallery';
import CongratsLevel from './CongratsLevel';
import CakeCutting from './CakeCutting';
import FinalWish from './FinalWish';
import { updateProgress, getProgress } from '@/lib/supabase';

export default function Experience() {
  const [level, setLevel] = useState<number | null>(null);

  useEffect(() => {
    const init = async () => {
      const savedLevel = await getProgress();
      setLevel(savedLevel);
    };
    init();
  }, []);

  const handleLevelComplete = async () => {
    if (level === null) return;
    const nextLevel = level + 1;
    setLevel(nextLevel);
    await updateProgress(nextLevel);
  };

  if (level === null) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
      />
    </div>
  );

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      <AnimatePresence mode="wait">
        {level === 1 && (
          <motion.div key="l1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CurtainReveal onComplete={handleLevelComplete} />
          </motion.div>
        )}
        
        {level === 2 && (
          <motion.div key="l2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MemoryDeck onComplete={handleLevelComplete} />
          </motion.div>
        )}

        {level >= 3 && level <= 8 && (
          <motion.div key={`l${level}`} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}>
            <PuzzleGallery level={level} onComplete={handleLevelComplete} />
          </motion.div>
        )}

        {level === 9 && (
          <motion.div key="l9" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CongratsLevel onComplete={handleLevelComplete} />
          </motion.div>
        )}

        {level === 10 && (
          <motion.div key="l10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CakeCutting onComplete={handleLevelComplete} />
          </motion.div>
        )}

        {level === 11 && (
          <motion.div key="l11" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <FinalWish />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[100] bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(level / 11) * 100}%` }}
          className="h-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_10px_rgba(212,175,55,0.5)]"
        />
      </div>
      
      <div className="fixed bottom-4 right-4 z-[100] opacity-30 text-[10px] text-primary uppercase tracking-widest font-bold">
        Level {level} / 11
      </div>
    </main>
  );
}
