'use client';

import { motion } from 'framer-motion';
import { PartyPopper, Heart, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export default function CongratsLevel({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 overflow-hidden">
      <div className="relative z-10 max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 text-center shadow-2xl"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <PartyPopper className="text-primary" size={40} />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-serif text-white mb-4"
          >
            You're Incredible! 💖
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 text-lg mb-8 leading-relaxed italic"
          >
            Congratulations for completing all the challenges! You've shown that no puzzle is too hard when it comes to us. 
            <br /><br />
            Now, the moment we've all been waiting for... Let's cut the cake! 🎂
          </motion.p>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-background rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 group"
          >
            Go to Cake Cutting
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="fixed inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0, 
              x: Math.random() * 100 - 50 + '%', 
              y: '110%' 
            }}
            animate={{ 
              opacity: [0, 1, 0],
              y: '-10%',
              rotate: 360
            }}
            transition={{ 
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute text-primary/20"
          >
            <Heart size={Math.random() * 30 + 20} fill="currentColor" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
