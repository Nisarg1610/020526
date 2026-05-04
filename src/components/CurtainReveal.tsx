'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Heart } from 'lucide-react';

// ─── Typewriter for intro paragraphs ───────────────────────────────────────
const TypewriterText = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    setDisplayText('');
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, index + 1));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 40);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return <span>{displayText}</span>;
};

// ─── Letter content – edit this to your personal message ───────────────────
const LETTER_PARAGRAPHS = [
  "My wifee,",
  "First Birthday of you and I am not there to celebrate it with you physically. But yk I find every possible way to make it special. As I said that till I am there you will remember all the your birthdays.",
  "IDK when you are seeing this but I think it can be a night or early morning or your break. As this time I dont have much time to go beyond my limits, but tried my best to make it special for you!!",
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
  `Ik I don’t have anything to give you right now but I promise je divas hase ee divas tame haqq thi mango and hu haqq thi apis without seeing any price or anything. Thank you for staying with me. Always will be grateful for your love. 

I LOVE YOU BACCHA 💕❤️💕🥳`,
  "Happy Birthday, my love. 🎂✨",
  "— Always yours",
  // --- NEW SECTION ADDED BELOW ---
  `As I have made a small memories section as today is the day on which you need to sit down and remember all your past memories that you have created. And today is the day which you will decide what you want and how should be your upcoming life.

So firstly, we will see your past birthdays. Take a time to recall those memories and bring them alive. Then we will see what memories we have created together. See the pictures and try to remember the moments that we created on those days. 

And then... we will cut the cake and you will write your final wish.`
];
// ─── How fast each character is typed (ms). Higher = slower. ───────────────
// Normal comfortable reading is ~250 wpm ≈ 1 char per ~24ms.
// We go ~65ms per char so the reader can fully absorb each word.
const TYPING_SPEED_MS = 65;

// ─── Letter Typewriter component ───────────────────────────────────────────
const LetterTypewriter = ({ onComplete }: { onComplete: () => void }) => {
  // We reveal paragraphs one at a time; each paragraph types itself out fully
  // before the next one fades in.
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
        // Pause before moving to next paragraph
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

  // Auto-scroll to bottom as letter grows
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [revealedParas, currentTyping]);

  return (
    <div className="relative w-full max-w-2xl mx-auto px-4">
      {/* Paper texture card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative bg-[#fffdf5] rounded-2xl shadow-[0_8px_60px_rgba(212,175,55,0.18)] border border-primary/20 p-8 md:p-12 overflow-hidden"
      >
        {/* Decorative corner flourish */}
        <div className="absolute top-4 left-4 text-primary/20 text-4xl font-serif select-none">❝</div>
        <div className="absolute bottom-4 right-4 text-primary/20 text-4xl font-serif select-none rotate-180">❝</div>



        <div
          className="relative z-10 font-serif text-[#3a2e1e] leading-[1.9] text-base md:text-lg space-y-5 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20"
          style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
        >
          {revealedParas.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className={
                i === 0
                  ? 'text-xl font-semibold text-[#8B7536]'       // salutation
                  : i === LETTER_PARAGRAPHS.length - 1
                    ? 'italic text-[#8B7536]'                       // sign-off
                    : ''
              }
            >
              {para}
            </motion.p>
          ))}

          {/* Currently typing paragraph */}
          {currentTyping && (
            <p
              className={
                currentIndex === 0
                  ? 'text-xl font-semibold text-[#8B7536]'
                  : currentIndex === LETTER_PARAGRAPHS.length - 1
                    ? 'italic text-[#8B7536]'
                    : ''
              }
            >
              {currentTyping}
              {/* Blinking cursor */}
              <span className="inline-block w-[2px] h-[1.1em] bg-[#8B7536] ml-0.5 align-middle animate-[blink_0.8s_step-end_infinite]" />
            </p>
          )}

          <div ref={bottomRef} />
        </div>
      </motion.div>

      {/* CTA after letter finishes */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="mt-8 flex justify-center"
          >
            <button
              onClick={onComplete}
              className="flex items-center gap-3 px-8 py-3 bg-primary text-background rounded-full font-bold text-lg shadow-[0_0_28px_rgba(212,175,55,0.5)] hover:scale-105 transition-all"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              <Heart size={20} className="fill-current" />
              Glimpse of your past Birthdays!!
              <ChevronRight size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main component ─────────────────────────────────────────────────────────
export default function CurtainReveal({ onComplete }: { onComplete: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [paraIndex, setParaIndex] = useState(0);
  const [isLetterPhase, setIsLetterPhase] = useState(false);

  const paragraphs = [
    "To the one who makes every day brighter than the last...",
    "Today is all about you, your memories, your journey, your happiness and your love.",
    "I've prepared a little quest for you. A journey through your memories and some fun surprises.",
    "Are you ready to begin? Take a deep breath..."
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Curtains */}
      <motion.div
        initial={{ x: 0 }}
        animate={isOpen ? { x: '-100%' } : { x: 0 }}
        transition={{ duration: 2, ease: [0.7, 0, 0.3, 1] }}
        className="fixed inset-y-0 left-0 w-1/2 bg-[#1a1a1a] border-r border-primary z-50 flex items-center justify-end"
      >
        <div className="w-1 h-full bg-primary/20" />
      </motion.div>
      <motion.div
        initial={{ x: 0 }}
        animate={isOpen ? { x: '100%' } : { x: 0 }}
        transition={{ duration: 2, ease: [0.7, 0, 0.3, 1] }}
        className="fixed inset-y-0 right-0 w-1/2 bg-[#1a1a1a] border-l border-primary z-50 flex items-center justify-start"
      >
        <div className="w-1 h-full bg-primary/20" />
      </motion.div>

      {/* ── Intro paragraphs phase ── */}
      <AnimatePresence mode="wait">
        {!isLetterPhase && (
          <motion.div
            key={paraIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center px-6 max-w-xl"
          >
            <p className="text-xl md:text-2xl text-primary font-serif italic mb-12 leading-relaxed h-32 flex items-center justify-center">
              {paragraphs[paraIndex]}
            </p>

            <div className="flex justify-between items-center max-w-xs mx-auto gap-8">
              <button
                disabled={paraIndex === 0}
                onClick={() => setParaIndex(prev => prev - 1)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 text-primary/60 transition-all ${paraIndex === 0 ? 'opacity-0 pointer-events-none' : 'hover:bg-primary/10'
                  }`}
              >
                <ChevronLeft size={20} /> Back
              </button>

              {paraIndex < paragraphs.length - 1 ? (
                <button
                  onClick={() => setParaIndex(prev => prev + 1)}
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-background rounded-full font-bold hover:scale-105 transition-transform"
                >
                  Next <ChevronRight size={20} />
                </button>
              ) : (
                // Last intro para → open the letter
                <button
                  onClick={() => setIsLetterPhase(true)}
                  className="px-8 py-3 bg-primary text-background rounded-full font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 transition-all animate-pulse"
                >
                  Lets GOOOO ❤️
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Letter phase ── */}
      <AnimatePresence>
        {isLetterPhase && (
          <motion.div
            key="letter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full flex items-center justify-center px-4 py-12"
          >
            <LetterTypewriter onComplete={onComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global blink keyframe — add to your global CSS if preferred */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
      `}</style>
    </div>
  );
}