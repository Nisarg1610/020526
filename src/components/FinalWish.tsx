import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Send, CheckCircle2 } from 'lucide-react';
import { saveWish } from '@/lib/supabase';

export default function FinalWish() {
  const [wish, setWish] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showWishForm, setShowWishForm] = useState(false);

  const handleSaveWish = async () => {
    if (!wish.trim()) return;
    await saveWish(wish);
    setIsSubmitted(true);
  };

  const credits = [
    "To My Most Special Person",
    "",
    "Words can never truly express",
    "the joy you bring into my life.",
    "Every memory we've shared",
    "is a treasure I'll keep forever.",
    "",
    "Thank you for your kindness,",
    "your laughter, and your love.",
    "",
    "You are my partner, my best friend,",
    "and my greatest adventure.",
    "",
    "May this year be as beautiful",
    "as the heart you possess.",
    "",
    "I love you more than",
    "words could ever say.",
    "",
    "Happy Birthday,",
    "My Love.",
    "",
    "✨ Forever & Always ✨"
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              y: [-20, 20],
              x: [-10, 10]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            className="absolute text-primary/30"
          >
            <Sparkles size={Math.random() * 20 + 10} />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {!showWishForm && (
          <motion.div
            key="credits-container"
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 1.5 } }}
            className="relative w-full overflow-hidden h-[75vh] flex flex-col items-center"
          >
            <motion.div
              initial={{ y: '80vh' }}
              animate={{ y: '-130vh' }}
              transition={{ duration: 55, ease: "linear", delay: 2 }}
              onAnimationComplete={() => setShowWishForm(true)}
              className="text-center space-y-10 px-4"
            >
              {credits.map((line, i) => (
                <p
                  key={i}
                  className={`text-2xl md:text-4xl font-serif text-primary/90 leading-loose ${line === "" ? "h-10" : ""} ${i === 0 || i > credits.length - 3 ? "text-secondary font-bold text-5xl mb-10" : ""}`}
                >
                  {line}
                </p>
              ))}

              <div className="pt-24 flex flex-col items-center gap-8">
                <Heart className="text-secondary fill-secondary animate-pulse" size={60} />
                <div className="w-40 h-1 bg-primary rounded-full shadow-[0_0_20px_#D4AF37]" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wish Section */}
      <AnimatePresence>
        {showWishForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full max-w-md px-6 z-10"
          >
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <h3 className="text-3xl font-serif text-primary mb-6 text-center">One Last Thing...</h3>
              <p className="text-white/80 text-center mb-8 italic text-lg leading-relaxed">
                Write the wish that you want to write. It's not specific to me. Your actual general wish that you want... and write it down below.
                I will not see the wish what you have written. It will stored in your mobile locally and will be populated on your next Birthday!!
              </p>

              {!isSubmitted ? (
                <div className="space-y-6">
                  <textarea
                    value={wish}
                    onChange={(e) => setWish(e.target.value)}
                    placeholder="My birthday wish is..."
                    className="w-full h-40 bg-white/5 border border-white/20 rounded-3xl p-6 text-white text-lg placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all resize-none shadow-inner"
                  />
                  <button
                    onClick={handleSaveWish}
                    disabled={!wish.trim()}
                    className="w-full py-5 bg-gradient-to-r from-primary to-secondary text-background rounded-2xl font-bold text-xl shadow-[0_10px_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale"
                  >
                    <Send size={24} />
                    Seal the Wish
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="text-center py-10"
                >
                  <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="text-primary" size={50} />
                  </div>
                  <p className="text-2xl text-white font-serif italic mb-2">
                    Your wish has been sealed...
                  </p>
                  <p className="text-primary/60 text-sm uppercase tracking-widest">
                    May it all come true ✨
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Hint */}
      {!showWishForm && (
        <div className="fixed bottom-10 left-0 right-0 flex justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            className="text-primary/40 text-[10px] tracking-[0.4em] uppercase font-bold"
          >
            The final chapter unfolds
          </motion.div>
        </div>
      )}
    </div>
  );
}


