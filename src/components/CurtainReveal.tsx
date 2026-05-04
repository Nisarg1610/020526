'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Heart, Sparkles } from 'lucide-react';

// ─── Floating Petals Effect ────────────────────────────────────────────────
const FloatingDecor = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0, 
            y: -100, 
            x: Math.random() * 100 + 'vw',
            rotate: 0 
          }}
          animate={{ 
            opacity: [0, 0.7, 0],
            y: '110vh',
            x: (Math.random() * 100 - 50) + 'vw',
            rotate: 360
          }}
          transition={{ 
            duration: Math.random() * 10 + 10, 
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear"
          }}
          className="absolute text-rose-300/40"
        >
          {i % 2 === 0 ? <Heart size={Math.random() * 20 + 10} fill="currentColor" /> : '🌸'}
        </motion.div>
      ))}
    </div>
  );
};

// ─── Letter Typewriter component ───────────────────────────────────────────
const LetterTypewriter = ({ onComplete }: { onComplete: () => void }) => {
  const [revealedParas, setRevealedParas] = useState<string[]>([]);
  const [currentTyping, setCurrentTyping] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (currentIndex >= LETTER_PARAGRAPHS.length) {
      setAllDone(true);
      return;
    }

    const text = LETTER_PARAGRAPHS[currentIndex];
    let charIndex = 0;
    setCurrentTyping('');

    const interval = setInterval(() => {
      charIndex++;
      setCurrentTyping(text.slice(0, charIndex));
      if (charIndex >= text.length) {
        clearInterval(interval);
        timeoutRef.current = setTimeout(() => {
          setRevealedParas(prev => [...prev, text]);
          setCurrentTyping('');
          setCurrentIndex(prev => prev + 1);
        }, 600);
      }
    }, TYPING_SPEED_MS);

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [revealedParas, currentTyping]);

  return (
    <div className="relative w-full max-w-2xl mx-auto px-4 z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="relative bg-rose-50/90 backdrop-blur-sm rounded-3xl shadow-[0_20px_50px_rgba(159,18,57,0.2)] border-2 border-rose-200/50 p-8 md:p-12 overflow-hidden"
      >
        {/* Decorative corner florals */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full text-rose-900 fill-current">
            <path d="M0 0 Q 50 0 50 50 Q 0 50 0 0" />
          </svg>
        </div>
        
        <div
          className="relative z-10 font-serif text-rose-950 leading-[2] text-base md:text-lg space-y-6 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-rose-200"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {revealedParas.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className={
                i === 0
                  ? 'text-2xl font-bold text-rose-800 italic border-b border-rose-200 pb-2 inline-block' 
                  : i === LETTER_PARAGRAPHS.length - 1
                    ? 'text-right font-bold text-rose-700 italic pt-8'
                    : 'whitespace-pre-line'
              }
            >
              {para}
            </motion.p>
          ))}

          {currentTyping && (
            <p className={
              currentIndex === 0 
                ? 'text-2xl font-bold text-rose-800 italic' 
                : currentIndex === LETTER_PARAGRAPHS.length - 1 
                  ? 'text-right font-bold text-rose-700 italic pt-8' 
                  : 'whitespace-pre-line'
            }>
              {currentTyping}
              <span className="inline-block w-[3px] h-[1.2em] bg-rose-400 ml-1 align-middle animate-pulse" />
            </p>
          )}

          <div ref={bottomRef} />
        </div>
      </motion.div>

      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10 flex justify-center"
          >
            <button
              onClick={onComplete}
              className="group relative flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-full font-bold text-xl shadow-[0_10px_30px_rgba(225,29,72,0.4)] hover:shadow-[0_15px_40px_rgba(225,29,72,0.6)] hover:-translate-y-1 transition-all duration-300"
            >
              <Heart size={24} className="fill-white animate-heartbeat" />
              <span>Enter Our World of Memories</span>
              <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Content ─────────────────────────────────────────────────────────
export default function CurtainReveal({ onComplete }: { onComplete: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [paraIndex, setParaIndex] = useState(0);
  const [isLetterPhase, setIsLetterPhase] = useState(false);

  const paragraphs = [
    "To the woman who owns every beat of my heart...",
    "Today is a celebration of you—the magic you bring and the memories we share.",
    "I've built this journey just for you, a path through our most beautiful moments.",
    "Are you ready to see what's inside? Close your eyes for a second..."
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#1a0105] overflow-hidden">
      <FloatingDecor />

      {/* Velvet Curtains */}
      <motion.div
        initial={{ x: 0 }}
        animate={isOpen ? { x: '-105%' } : { x: 0 }}
        transition={{ duration: 2.5, ease: [0.77, 0, 0.175, 1] }}
        className="fixed inset-y-0 left-0 w-1/2 bg-[#4a0404] z-[60] shadow-[10px_0_50px_rgba(0,0,0,0.8)] flex justify-end"
      >
        <div className="w-4 h-full bg-gradient-to-r from-transparent via-[#d4af3733] to-[#d4af37aa]" />
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]" />
      </motion.div>
      
      <motion.div
        initial={{ x: 0 }}
        animate={isOpen ? { x: '105%' } : { x: 0 }}
        transition={{ duration: 2.5, ease: [0.77, 0, 0.175, 1] }}
        className="fixed inset-y-0 right-0 w-1/2 bg-[#4a0404] z-[60] shadow-[-10px_0_50px_rgba(0,0,0,0.8)] flex justify-start"
      >
        <div className="w-4 h-full bg-gradient-to-l from-transparent via-[#d4af3733] to-[#d4af37aa]" />
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]" />
      </motion.div>

      {/* Intro Phase */}
      <AnimatePresence mode="wait">
        {!isLetterPhase && (
          <motion.div
            key={paraIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="text-center px-6 max-w-2xl z-20"
          >
            <div className="mb-8 flex justify-center">
              <Sparkles className="text-rose-400 animate-pulse" size={40} />
            </div>
            <p className="text-2xl md:text-3xl text-rose-100 font-serif italic mb-12 leading-relaxed min-h-[160px] flex items-center justify-center">
              "{paragraphs[paraIndex]}"
            </p>

            <div className="flex justify-center items-center gap-6">
              <button
                disabled={paraIndex === 0}
                onClick={() => setParaIndex(prev => prev - 1)}
                className={`p-3 rounded-full border-2 border-rose-500/30 text-rose-300 transition-all ${paraIndex === 0 ? 'opacity-0 pointer-events-none' : 'hover:bg-rose-500/20'}`}
              >
                <ChevronLeft size={24} />
              </button>

              {paraIndex < paragraphs.length - 1 ? (
                <button
                  onClick={() => setParaIndex(prev => prev + 1)}
                  className="px-10 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                  Continue <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  onClick={() => setIsLetterPhase(true)}
                  className="px-12 py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-full font-bold text-xl shadow-[0_0_30px_rgba(225,29,72,0.6)] hover:scale-110 transition-all animate-heartbeat"
                >
                  Unlock My Heart ❤️
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letter Phase */}
      <AnimatePresence>
        {isLetterPhase && (
          <motion.div
            key="letter"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full flex items-center justify-center z-10"
          >
            <LetterTypewriter onComplete={onComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          15% { transform: scale(1.1); }
          30% { transform: scale(1); }
          45% { transform: scale(1.15); }
          60% { transform: scale(1); }
        }
        .animate-heartbeat {
          animation: heartbeat 2s infinite ease-in-out;
        }
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
      `}</style>
    </div>
  );
}

// Configuration for Typing
const TYPING_SPEED_MS = 60;
const LETTER_PARAGRAPHS = [
  "My wifee,",
  "This is your first birthday since we've been together where I can't be there to celebrate with you physically. But you know me—I’ll always find every possible way to make it special. Like I’ve always said, as long as I’m in your life, I want to make sure every birthday is one you’ll never forget.",
  "I’m not sure when you’ll see this—maybe late at night, early in the morning, or during a your break. Even though I didn't have much time to go all out this year, I’ve tried my absolute best to make this day special for you.",
  "So let me start by wishing you Happy Birthday!! 🎉❤️",
  `To the woman who completes me ✅
To the one who brings constant joy to my life 🥳
To the person who always knows how to make me smile 😃
To my biggest supporter and my greatest strength 🎗️
To the soul who shows me a thousand different ways to love ❤️
To the one who sets aside her own burdens and problems just to help with mine 📖
To the person who cares for me and scolds me just like a mom 😤
To the one who always stands beside me, no matter the situation 🐥
To my teacher, who showed me how to fight from this world 🌎
To my absolute best friend 😇
To my everything ♾️
To the person I want to write every chapter of my life story with 🌟
To the one I never want to be without 😍
To the woman for whom these words are too small to express my true feelings.`,
  `Looking back at the year, my favorite highlight is simply having you by my side. You’ve turned my ordinary days into something extraordinary. Thank you for choosing me, for staying with me, and for being the heart of my world.
  I know today we are miles apart, but I’m already counting down the days until we can celebrate properly. I promise you a 'Birthday 2.0' celebration when I'm back—with the biggest hug, your favorite food, and all the time in the world just for us.

  I LOVE YOU BACCHA 💕❤️💕🥳`,
  "Happy Birthday, my love. 🎂✨",
  "— Always yours",
  `As I have made a small memories section as today is the day on which you need to sit down and remember all your past memories that you have created. And today is the day which you will decide what you want and how should be your upcoming life.

So firstly, we will see your past birthdays. Take a time to recall those memories and bring them alive. Then we will see what memories we have created together. See the pictures and try to remember the moments that we created on those days. 

And then... we will cut the cake and you will write your final wish.`
];

