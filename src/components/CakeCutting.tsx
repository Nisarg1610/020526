'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Wind, PartyPopper, Mic, Utensils } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CakeCutting({ onComplete }: { onComplete: () => void }) {
  const [candlesOut, setCandlesOut] = useState(false);
  const [cakeCut, setCakeCut] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const audioContext = useRef<AudioContext | null>(null);
  const analyzer = useRef<AnalyserNode | null>(null);
  const microphone = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContext.current?.state !== 'closed') {
        audioContext.current?.close();
      }
    };
  }, []);

  const startBlowingDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyzer.current = audioContext.current.createAnalyser();
      microphone.current = audioContext.current.createMediaStreamSource(stream);
      microphone.current.connect(analyzer.current);
      analyzer.current.fftSize = 512;

      setIsListening(true);
      const dataArray = new Uint8Array(analyzer.current.frequencyBinCount);

      const checkBlowing = () => {
        if (candlesOut) return;

        analyzer.current?.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

        // 60 is a good threshold for blowing directly into a phone/laptop mic
        if (average > 60) {
          setIsListening(false);
          setCandlesOut(true);

          // Small delay for realism before confetti pops
          setTimeout(() => {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#FFC0CB', '#FF69B4', '#FFFFFF', '#FFD700']
            });
          }, 300);

          stream.getTracks().forEach(track => track.stop());
        } else {
          requestAnimationFrame(checkBlowing);
        }
      };

      checkBlowing();
    } catch (err) {
      console.error("Mic access denied", err);
      // Fallback: If no mic, auto-blow after 3 seconds so she isn't stuck
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        setCandlesOut(true);
      }, 3000);
    }
  };

  const handleCut = (_: any, info: any) => {
    // If they dragged the knife far enough to the right
    if (info.offset.x > 120 && !cakeCut) {
      setCakeCut(true);
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFB7C5', '#FFFFFF']
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-4 overflow-hidden">

      {/* Header Text */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 z-10"
      >
        <h2 className="text-4xl md:text-5xl font-serif text-rose-600 mb-4">
          {!candlesOut ? "Make a Wish" : !cakeCut ? "Time to Cut!" : "Happy Birthday!"}
        </h2>
        <p className="text-stone-600 text-lg h-8">
          {!candlesOut
            ? (isListening ? "Listening... blow on your screen!" : "Tap the button, close your eyes, and blow")
            : !cakeCut
              ? "Drag the knife across to cut the cake"
              : "Wishing you the sweetest year ahead ✨"}
        </p>
      </motion.div>

      {/* Interactive Cake Area */}
      <div className="relative w-80 h-80 flex items-center justify-center mb-12">

        {/* Decorative Plate */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-stone-200 rounded-full shadow-xl border-4 border-white z-0" />

        {/* The Cake (Split into two halves for realistic cutting) */}
        <div className="relative w-full h-full flex z-10 shadow-2xl rounded-full bg-rose-100 border-8 border-white">

          {/* Left Half */}
          <motion.div
            animate={cakeCut ? { x: -15, rotate: -3 } : { x: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="w-1/2 h-full bg-rose-300 rounded-l-full relative overflow-hidden border-r-2 border-rose-400/30 shadow-[inset_10px_0_20px_rgba(255,255,255,0.5)]"
          >
            {/* Frosting drips */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,_#fecdd3_0%,_transparent_60%)]" />
          </motion.div>

          {/* Right Half */}
          <motion.div
            animate={cakeCut ? { x: 15, rotate: 3 } : { x: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="w-1/2 h-full bg-rose-300 rounded-r-full relative overflow-hidden shadow-[inset_-10px_0_20px_rgba(0,0,0,0.1)]"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,_#fecdd3_0%,_transparent_60%)]" />
          </motion.div>

          {/* Happy Birthday Text perfectly centered on top */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-rose-600/80 font-bold text-3xl font-serif rotate-[-10deg]">HB Day!</span>
          </div>
        </div>

        {/* Candles Group */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 flex justify-center gap-6 z-20">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative w-3 h-14 bg-gradient-to-b from-rose-100 to-white rounded-t-full shadow-sm border border-stone-200">

              {/* Flame & Smoke */}
              <AnimatePresence>
                {!candlesOut ? (
                  <motion.div
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 origin-bottom"
                  >
                    {/* Realistic Glow */}
                    <div className="absolute inset-0 bg-orange-400 blur-md rounded-full scale-150 opacity-60 animate-pulse" />
                    {/* The Flame */}
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 0.9, 1],
                        rotate: [0, 2, -2, 0],
                        skewX: [0, 5, -5, 0]
                      }}
                      transition={{ repeat: Infinity, duration: Math.random() * 0.5 + 0.5 }}
                      className="relative w-4 h-8 bg-gradient-to-t from-orange-500 via-yellow-400 to-white rounded-[50%_50%_20%_20%]"
                    />
                  </motion.div>
                ) : (
                  // Smoke effect when blown out
                  <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: [0, 0.5, 0], y: -40, scale: 2 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-300 rounded-full blur-sm"
                  />
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* The Knife (Swipe to cut mechanic) */}
        {candlesOut && !cakeCut && (
          <div className="absolute -bottom-16 left-0 right-0 flex items-center z-30">
            <div className="w-full h-16 bg-stone-200/50 rounded-full relative overflow-hidden shadow-inner border border-stone-300">
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 240 }}
                dragElastic={0.1}
                onDragEnd={handleCut}
                className="absolute top-1 left-1 w-14 h-14 bg-rose-500 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg z-10"
              >
                <Utensils className="text-white w-6 h-6" />
              </motion.div>
              <span className="absolute inset-0 flex items-center justify-center text-stone-500 font-medium pointer-events-none">
                Slide knife to cut &rarr;
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Controls Area */}
      <div className="h-20 flex items-center justify-center mt-4 z-10">
        {!candlesOut ? (
          <button
            onClick={startBlowingDetection}
            disabled={isListening}
            className={`px-8 py-4 rounded-full font-bold shadow-lg flex items-center gap-3 transition-all duration-300 ${isListening
              ? 'bg-rose-100 text-rose-500 scale-95 shadow-inner'
              : 'bg-rose-600 text-white hover:scale-105 hover:bg-rose-700'
              }`}
          >
            {isListening ? (
              <>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }}>
                  <Mic size={20} />
                </motion.div>
                Listening...
              </>
            ) : (
              <>
                <Wind size={20} /> Turn on Mic to Blow
              </>
            )}
          </button>
        ) : cakeCut ? (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onComplete}
            className="px-10 py-4 bg-rose-600 text-white rounded-full font-bold shadow-[0_0_20px_rgba(225,29,72,0.4)] flex items-center gap-3 hover:scale-105 transition-all"
          >
            <PartyPopper size={24} /> Continue to Final Wish
          </motion.button>
        ) : null}
      </div>

    </div>
  );
}