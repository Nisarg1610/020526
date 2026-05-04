'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronRight, ChevronLeft, Heart } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION — swap these values with your real assets
// ─────────────────────────────────────────────────────────────────────────────

const BACKGROUND_VIDEO = '/memories/romantic-bg-loop.mp4'; // Add a nice subtle video loop here

const B1_COMIC = '/memories/1.jpg';
const B1_PHOTO_2 = '/memories/2.jpg';
const B1_PHOTO_3 = '/memories/3.jpg';
const B1_PHOTO_4 = '/memories/4.jpg';
const B2_COMIC_1 = '/memories/5.jpg';
const B2_VIDEO = '/memories/0504.mp4';
const B2_COMIC_2 = '/memories/6.jpg';

const CLOSING_PARA =
  "Every birthday you've had, I've wanted nothing more than to be right there beside you — " +
  "to watch your eyes light up, to hear you laugh, to hold you close. " +
  "These memories are proof that even across the miles, every moment with you is everything. " +
  "You deserve the whole world, and I'm spending every day trying to give it to you. " +
  "Happy Birthday, my love. 🎂";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Step =
  | { kind: 'chapter-title'; label: string; subtitle: string }
  | { kind: 'comic'; src: string; caption: string; tapeAngle?: number }
  | { kind: 'video'; src: string; caption: string }
  | { kind: 'transition'; message: string }
  | { kind: 'closing' };

const STEPS: Step[] = [
  {
    kind: 'chapter-title',
    label: '1st Birthday - 02/05/2024',
    subtitle: 'The beginning of our little tradition ✨',
  },
  {
    kind: 'comic',
    src: B1_COMIC,
    caption: 'The day that started it all 💖',
    tapeAngle: -1.5,
  },
  {
    kind: 'comic',
    src: B1_PHOTO_2,
    caption: 'I knew then you were the one 🌹',
    tapeAngle: 2,
  },
  {
    kind: 'comic',
    src: B1_PHOTO_3,
    caption: 'That smile I could look at forever...',
    tapeAngle: -1.2,
  },
  {
    kind: 'comic',
    src: B1_PHOTO_4,
    caption: 'Capturing every little moment 📸',
    tapeAngle: 0.8,
  },
  {
    kind: 'transition',
    message: "One year wasn't enough... I wanted a lifetime more. ❤️",
  },
  {
    kind: 'chapter-title',
    label: '2nd Birthday - 02/05/2025',
    subtitle: 'Even better than the first 🎉',
  },
  {
    kind: 'comic',
    src: B2_COMIC_1,
    caption: 'Part one of a perfect day',
    tapeAngle: 1.2,
  },
  {
    kind: 'video',
    src: B2_VIDEO,
    caption: 'A little moment I never want to forget 🎬',
  },
  {
    kind: 'comic',
    src: B2_COMIC_2,
    caption: 'And the magic kept going…',
    tapeAngle: -0.8,
  },
  { kind: 'closing' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Gentle floating background emojis for Love/Birthday vibes */
const FloatingMagic = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-60">
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute text-2xl drop-shadow-sm"
        initial={{ top: '110%', left: `${Math.random() * 100}%`, rotate: 0 }}
        animate={{ top: '-10%', left: `${Math.random() * 100}%`, rotate: 360 }}
        transition={{
          duration: 15 + Math.random() * 20,
          repeat: Infinity,
          ease: 'linear',
          delay: Math.random() * 15
        }}
      >
        {i % 3 === 0 ? '✨' : i % 2 === 0 ? '💖' : '🎂'}
      </motion.div>
    ))}
  </div>
);

/** Tape strip across the top of a scrapbook item */
const Tape = ({ angle = 0 }: { angle?: number }) => (
  <div
    className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-7 z-20 pointer-events-none"
    style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
  >
    <div className="w-full h-full bg-white/60 border border-white/40 rounded-sm shadow-sm backdrop-blur-md" />
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="absolute top-0 bottom-0 w-px bg-rose-200/20"
        style={{ left: `${14 + i * 12}%` }}
      />
    ))}
  </div>
);

/** Corner photo mounts */
const Corners = () => (
  <>
    {[
      'top-0 left-0',
      'top-0 right-0 rotate-90',
      'bottom-0 right-0 rotate-180',
      'bottom-0 left-0 -rotate-90',
    ].map((pos, i) => (
      <div key={i} className={`absolute ${pos} w-5 h-5 z-20 pointer-events-none`}>
        <div className="w-full h-full border-t-2 border-l-2 border-rose-800/30 rounded-tl-sm" />
      </div>
    ))}
  </>
);

/** Chapter title slide */
const ChapterTitle = ({ label, subtitle }: { label: string; subtitle: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[55vh] text-center px-6">
    <motion.div
      initial={{ scale: 0, rotate: -12 }}
      animate={{ scale: 1, rotate: -6 }}
      transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.1 }}
      className="mb-6 w-28 h-28 rounded-full border-4 border-dashed border-rose-400/60 flex items-center justify-center bg-rose-50/60 backdrop-blur-sm"
    >
      <Heart className="text-rose-500 fill-rose-300" size={40} />
    </motion.div>

    <motion.h2
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="text-4xl md:text-5xl text-rose-900 mb-3 drop-shadow-sm"
      style={{ fontFamily: "'Caveat', 'Dancing Script', cursive", fontWeight: 700 }}
    >
      {label}
    </motion.h2>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="text-rose-800/90 text-lg italic bg-white/40 px-4 py-1 rounded-full backdrop-blur-sm"
      style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
    >
      {subtitle}
    </motion.p>

    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="mt-4 h-1.5 w-32 rounded-full bg-gradient-to-r from-pink-400 via-rose-500 to-pink-400 origin-left shadow-sm"
    />
  </div>
);

/** Comic page in scrapbook mount */
const ComicPage = ({ src, caption, tapeAngle = 0 }: { src: string; caption: string; tapeAngle?: number }) => (
  <div className="flex flex-col items-center gap-6 w-full px-2">
    <div className="relative w-full max-w-sm" style={{ transform: `rotate(${tapeAngle * 0.3}deg)` }}>
      <Tape angle={tapeAngle * 2} />

      <div className="relative bg-[#fff5f7] p-3 pb-10 rounded-sm shadow-[4px_6px_24px_rgba(225,29,72,0.15)] border border-rose-200/60">
        <Corners />

        <div className="relative overflow-hidden rounded-[2px] border border-rose-100">
          <img
            src={src}
            alt={caption}
            className="w-full object-contain block max-h-[65vh]"
            draggable={false}
          />
          {/* Soft romantic vignette overlay */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(225,29,72,0.08) 100%)' }}
          />
        </div>

        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <p
            className="text-rose-900/80 text-lg px-4 text-center"
            style={{ fontFamily: "'Caveat', cursive", letterSpacing: '0.01em', fontWeight: 700 }}
          >
            {caption}
          </p>
        </div>
      </div>

      <div className="absolute -bottom-2 left-3 right-3 h-3 bg-rose-900/10 blur-md rounded-full -z-10" />
    </div>
  </div>
);

/** Video in scrapbook mount */
const VideoSlide = ({ src, caption }: { src: string; caption: string }) => (
  <div className="flex flex-col items-center gap-6 w-full px-2">
    <div className="relative w-full max-w-sm" style={{ transform: 'rotate(0.4deg)' }}>
      <Tape angle={-3} />

      <div className="relative bg-[#fff5f7] p-3 pb-10 rounded-sm shadow-[4px_6px_24px_rgba(225,29,72,0.15)] border border-rose-200/60">
        <Corners />

        <div className="flex gap-1 mb-2 justify-center">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-3 h-2 bg-rose-900/20 rounded-[1px]" />
          ))}
        </div>

        <div className="relative rounded-[2px] overflow-hidden border border-rose-100 shadow-inner">
          <video
            src={src}
            controls
            playsInline
            className="w-full max-h-[55vh] object-contain bg-black/90"
          />
        </div>

        <div className="flex gap-1 mt-2 mb-1 justify-center">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-3 h-2 bg-rose-900/20 rounded-[1px]" />
          ))}
        </div>

        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <p
            className="text-rose-900/80 text-lg px-4 text-center"
            style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
          >
            {caption}
          </p>
        </div>
      </div>

      <div className="absolute -bottom-2 left-3 right-3 h-3 bg-rose-900/10 blur-md rounded-full -z-10" />
    </div>
  </div>
);
const TransitionSlide = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6">
    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="mb-8">
      <Heart className="text-rose-500 fill-rose-400" size={80} />
    </motion.div>
    <p className="text-3xl text-rose-900" style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}>{message}</p>
  </div>
);
/** Closing para */
const ClosingSlide = ({ onComplete }: { onComplete: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[55vh] px-6 text-center max-w-xl mx-auto">
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 160, delay: 0.1 }}
      className="mb-6"
    >
      <Heart className="text-rose-500 fill-rose-400 mx-auto drop-shadow-md" size={54} />
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="relative bg-[#fff5f7] rounded-sm shadow-[3px_5px_20px_rgba(225,29,72,0.15)] border border-rose-200/50 px-8 py-8"
      style={{
        clipPath: 'polygon(0 0,100% 0,100% 92%,97% 100%,90% 95%,82% 100%,74% 95%,66% 100%,58% 95%,50% 100%,42% 95%,34% 100%,26% 95%,18% 100%,10% 95%,3% 100%,0 92%)',
      }}
    >
      <div className="absolute top-0 bottom-0 left-10 w-px bg-rose-300/60" />

      <p
        className="text-rose-950/85 text-lg leading-8 relative z-10 pl-4"
        style={{ fontFamily: "'Crimson Text', Georgia, serif", fontStyle: 'italic' }}
      >
        {CLOSING_PARA}
      </p>
    </motion.div>

    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      onClick={onComplete}
      className="mt-10 flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-bold text-lg shadow-[0_0_24px_rgba(225,29,72,0.4)] hover:scale-105 transition-all"
      style={{ fontFamily: "'Caveat', cursive", fontSize: '1.4rem' }}
    >
      Continue to the next part <ChevronRight size={20} />
    </motion.button>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Progress dots
// ─────────────────────────────────────────────────────────────────────────────

const ProgressDots = ({ total, current }: { total: number; current: number }) => (
  <div className="flex gap-2 justify-center mt-6">
    {[...Array(total)].map((_, i) => (
      <div
        key={i}
        className={`rounded-full transition-all duration-300 shadow-sm ${i === current
          ? 'w-5 h-2.5 bg-rose-500'
          : i < current
            ? 'w-2.5 h-2.5 bg-rose-300'
            : 'w-2.5 h-2.5 bg-rose-100 border border-rose-200'
          }`}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function MemoryDeck({ onComplete }: { onComplete: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];

  const goNext = () => {
    if (stepIndex < STEPS.length - 1) setStepIndex(p => p + 1);
  };
  const goBack = () => {
    if (stepIndex > 0) setStepIndex(p => p - 1);
  };

  const isFirst = stepIndex === 0;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* ──────────────── BACKGROUND VIDEO & BLUR ──────────────── */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-rose-50">
        <video
          src={BACKGROUND_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        {/* The blur overlay */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[8px]" />
      </div>

      <FloatingMagic />

      {/* ──────────────── MAIN CONTENT ──────────────── */}
      <div
        className="relative z-10 min-h-screen flex flex-col items-center justify-start pt-10 pb-24 px-4"
        style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        `}</style>

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2
            className="text-5xl text-rose-800 drop-shadow-sm"
            style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
          >
            Our Scrapbook 📖
          </h2>
          <div className="h-1 w-24 bg-rose-400/60 mx-auto mt-2 rounded-full" />
        </motion.div>

        <div className="w-full max-w-sm mx-auto flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              {step.kind === 'chapter-title' && <ChapterTitle label={step.label} subtitle={step.subtitle} />}
              {step.kind === 'comic' && <ComicPage src={step.src} caption={step.caption} tapeAngle={step.tapeAngle} />}
              {step.kind === 'video' && <VideoSlide src={step.src} caption={step.caption} />}
              {step.kind === 'transition' && <TransitionSlide message={step.message} />}
              {step.kind === 'closing' && <ClosingSlide onComplete={onComplete} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {step.kind !== 'closing' && (
          <div className="fixed bottom-8 left-0 right-0 flex flex-col items-center gap-3 z-30">
            <ProgressDots total={STEPS.length} current={stepIndex} />

            <div className="flex items-center gap-4 mt-1">
              <button
                onClick={goBack}
                disabled={isFirst}
                className={`p-3 rounded-full border-2 border-rose-300 text-rose-600 transition-all bg-white/60 backdrop-blur-md shadow-sm ${isFirst ? 'opacity-0 pointer-events-none' : 'hover:bg-rose-50'
                  }`}
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={goNext}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-bold shadow-[0_4px_20px_rgba(225,29,72,0.35)] hover:scale-105 transition-all"
                style={{ fontFamily: "'Caveat', cursive", fontSize: '1.3rem' }}
              >
                {step.kind === 'chapter-title' ? 'Open Chapter' : 'Next'} <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}