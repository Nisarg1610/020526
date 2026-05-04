'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { CheckCircle2, Heart, Sparkles, MousePointer2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

const BACKGROUND_VIDEO = '/memories/romantic-bg-loop.mp4';

interface PuzzleData {
  title: string;
  image: string;
  comment: string;
}

const puzzleContent: PuzzleData[] = [
  { title: "Constellation of Us", image: "/memories/p1.jpg", comment: "Like stars are all around the sky but they form a nice picture by joining them. Similar way we are far from each other in this world but we are gonna form a beautifull life ahead..." },
  { title: "The Perfect Match", image: "/memories/p2.png", comment: "Finding you was the best thing that ever happened to me." },
  { title: "The 'Everything' Cipher", image: "/memories/p3.jpg", comment: "You are my world, my soul.." },
  { title: "Love's Labyrinth", image: "/memories/p4.jpg", comment: "Even through the twists and turns, I'll always find you." },
  { title: "Piece of My Heart", image: "/memories/p5.jpg", comment: "Without you, the picture is never complete." },
  { title: "The Final Discovery", image: "/memories/p6.jpg", comment: "The more I learn about you, the more I love you." },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function PuzzleGallery({
  onComplete,
  level: globalLevel
}: {
  onComplete: () => void;
  level: number
}) {
  // Map global level (3-8) to internal puzzle index (0-5)
  const puzzleIndex = Math.max(0, Math.min(5, globalLevel - 3));

  const [gameState, setGameState] = useState<'intro' | 'playing' | 'revealed'>(
    globalLevel === 3 ? 'intro' : 'playing'
  );

  const currentPuzzle = puzzleContent[puzzleIndex];

  const handleLevelComplete = () => setGameState('revealed');

  const handleNextLevel = () => {
    onComplete();
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden font-serif bg-rose-50">
      <div className="fixed inset-0 z-0">
        <video src={BACKGROUND_VIDEO} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] p-4">
        <AnimatePresence mode="wait">
          {gameState === 'intro' && (
            <IntroPage onStart={() => setGameState('playing')} />
          )}

          {gameState === 'playing' && (
            <motion.div
              key={`game-${puzzleIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-[400px] bg-white/95 backdrop-blur-md border-2 border-rose-100 rounded-[2rem] p-6 shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="flex justify-between items-center px-2 mb-2">
                  <span className="text-rose-300 font-bold text-[10px] uppercase tracking-tighter">Puzzle {puzzleIndex + 1}/6</span>
                  <Heart className="text-rose-200 fill-rose-200" size={14} />
                </div>
                <h2 className="text-2xl text-rose-800 font-bold" style={{ fontFamily: "'Caveat', cursive" }}>{currentPuzzle.title}</h2>
              </div>

              <div className="min-h-[320px] flex items-center justify-center">
                {puzzleIndex === 0 && <ConnectDotsGame onWin={handleLevelComplete} />}
                {puzzleIndex === 1 && <MemoryMatchGame onWin={handleLevelComplete} />}
                {puzzleIndex === 2 && <WordSearchGame onWin={handleLevelComplete} />}
                {puzzleIndex === 3 && <LoveMazeGame onWin={handleLevelComplete} />}
                {puzzleIndex === 4 && <HeartJigsawGame onWin={handleLevelComplete} />}
                {puzzleIndex === 5 && <ScratchCardGame onWin={handleLevelComplete} />}
              </div>
            </motion.div>
          )}

          {gameState === 'revealed' && (
            <motion.div
              key={`reveal-${puzzleIndex}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-[340px]"
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-rose-200">
                <img src={currentPuzzle.image} className="w-full h-72 object-contain bg-rose-50" alt="Memory" />
                <div className="p-6 text-center bg-white">
                  <p className="text-rose-900 text-xl italic mb-6 leading-relaxed" style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}>
                    "{currentPuzzle.comment}"
                  </p>
                  <button
                    onClick={handleNextLevel}
                    className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform"
                  >
                    {puzzleIndex === 5 ? "Continue to Surprise! ✨" : "Next Challenge"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPLICATED GAME LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/** Level 1: Mobile-Optimized Constellation */
/** Level 1: Fixed Constellation (No Overlaps + Z-Index priority) */
function ConnectDotsGame({ onWin }: { onWin: () => void }) {
  const [points, setPoints] = useState<number[]>([]);

  // Revised coordinates: 1 and 7 are now distinct points on the heart's "dip"
  const positions = [
    { x: 42, y: 35 }, // 1. Top Left Indent
    { x: 78, y: 18 }, // 2. Right Shoulder
    { x: 90, y: 45 }, // 3. Right Side
    { x: 50, y: 88 }, // 4. Bottom Tip
    { x: 10, y: 45 }, // 5. Left Side
    { x: 22, y: 18 }, // 6. Left Shoulder
    { x: 58, y: 35 }, // 7. Top Right Indent
    { x: 50, y: 58 }, // 8. Deep Center Finish
  ];

  const handleClick = (idx: number) => {
    // Only allow clicking the next number in sequence
    if (points.length === idx) {
      const next = [...points, idx];
      setPoints(next);
      if (next.length === positions.length) setTimeout(onWin, 800);
    } else if (!points.includes(idx)) {
      // If she clicks a wrong star, it resets for that "complicated" feel
      setPoints([]);
    }
  };

  return (
    <div className="relative w-80 h-80 bg-slate-950 rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-rose-900/30 touch-none">
      <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      {/* SVG for drawing the lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {points.length > 1 && points.map((p, i) => i > 0 && (
          <motion.line
            key={i}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            x1={`${positions[points[i - 1]].x}%`}
            y1={`${positions[points[i - 1]].y}%`}
            x2={`${positions[p].x}%`}
            y2={`${positions[p].y}%`}
            stroke="#fb7185"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="1 6"
          />
        ))}
      </svg>

      {positions.map((pos, i) => {
        const isActive = points.includes(i);
        const isNext = points.length === i;

        return (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="absolute w-14 h-14 flex flex-col items-center justify-center outline-none active:scale-90 transition-transform"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
              // CRITICAL: The "Next" button is always on top (z-index 50)
              zIndex: isNext ? 50 : 10,
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            {/* The Visual Star */}
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${isActive
              ? 'bg-rose-400 shadow-[0_0_15px_#fb7185] scale-125'
              : isNext
                ? 'bg-white animate-pulse scale-110 shadow-[0_0_10px_white]'
                : 'bg-slate-800'
              }`} />

            {/* The Label */}
            <span className={`text-[10px] mt-1 font-black tracking-tighter ${isActive ? 'text-rose-300' : isNext ? 'text-white' : 'text-slate-600'
              }`}>
              {i + 1}
            </span>
          </button>
        );
      })}

      {/* Progress Indicator */}
      <div className="absolute bottom-6 w-full text-center pointer-events-none">
        <div className="flex justify-center gap-1 mb-1">
          {positions.map((_, i) => (
            <div key={i} className={`w-1 h-1 rounded-full ${i < points.length ? 'bg-rose-500' : 'bg-slate-700'}`} />
          ))}
        </div>
        <p className="text-[9px] text-rose-300/40 uppercase tracking-[0.3em] font-bold">
          {points.length === 0 ? "Begin the Constellation" : `Point ${points.length} linked`}
        </p>
      </div>
    </div>
  );
}

/** Level 2: 4x3 Grid (12 cards) */
function MemoryMatchGame({ onWin }: { onWin: () => void }) {
  const icons = ['💖', '🎁', '🎂', '🌹', '💎', '🥂', '💖', '🎁', '🎂', '🌹', '💎', '🥂'].sort(() => Math.random() - 0.5);
  const [cards, setCards] = useState(icons.map((icon, i) => ({ id: i, icon, flipped: false, matched: false })));
  const [selected, setSelected] = useState<number[]>([]);

  const flip = (idx: number) => {
    if (selected.length === 2 || cards[idx].flipped || cards[idx].matched) return;
    const newCards = [...cards]; newCards[idx].flipped = true; setCards(newCards);
    const newSelected = [...selected, idx]; setSelected(newSelected);
    if (newSelected.length === 2) {
      if (newCards[newSelected[0]].icon === newCards[newSelected[1]].icon) {
        newCards[newSelected[0]].matched = true; newCards[newSelected[1]].matched = true;
        setSelected([]); if (newCards.every(c => c.matched)) setTimeout(onWin, 600);
      } else {
        setTimeout(() => { newCards[newSelected[0]].flipped = false; newCards[newSelected[1]].flipped = false; setCards(newCards); setSelected([]); }, 1000);
      }
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {cards.map((card, i) => (
        <div key={card.id} onClick={() => flip(i)} className={`w-20 h-20 rounded-xl flex items-center justify-center text-3xl transition-all duration-300 cursor-pointer shadow-sm ${card.flipped || card.matched ? 'bg-white border-2 border-rose-200' : 'bg-rose-400'}`}>
          {(card.flipped || card.matched) ? card.icon : ''}
        </div>
      ))}
    </div>
  );
}

/** Level 3: 6x6 Grid Cipher */
/** Level 3: The "Ghost" Word Search (12x12 True Hidden Edition) */
function WordSearchGame({ onWin }: { onWin: () => void }) {
  const targetName = "NISARGA";

  // A truly randomized alphabetical grid with only ONE hidden "NISARGA"
  const grid = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S'],
    ['D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B'],
    ['N', 'M', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C'],
    ['V', 'B', 'N', 'M', 'Q', 'W', 'A', 'R', 'T', 'Y', 'U', 'I'],
    ['O', 'P', 'A', 'S', 'D', 'G', 'G', 'H', 'J', 'K', 'L', 'Z'],
    ['X', 'C', 'V', 'B', 'R', 'M', 'Q', 'W', 'E', 'R', 'T', 'Y'],
    ['U', 'I', 'O', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'S', 'C', 'V', 'B', 'N', 'M', 'Q', 'W', 'E', 'R'],
    ['T', 'I', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H'],
    ['N', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Q', 'W'],
    ['E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F'],
  ];

  /** 
   * THE SECRET PATH (NISARGA):
   * N: (10, 0)
   * I: (9, 1)
   * S: (8, 2)
   * A: (7, 3)
   * R: (6, 4)
   * G: (5, 5)
   * A: (4, 6)
   * 
   * This forms a diagonal line moving UP and RIGHT from the bottom left.
   */
  const targetCells = ["10,0", "9,1", "8,2", "7,3", "6,4", "5,5", "4,6"];

  const [startPos, setStartPos] = useState<{ r: number, c: number } | null>(null);
  const [currentPos, setCurrentPos] = useState<{ r: number, c: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const getCellCoords = (e: any) => {
    const touch = e.touches ? e.touches[0] : e;
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const cellId = element?.getAttribute('data-cell-id');
    if (cellId) {
      const [r, c] = cellId.split(',').map(Number);
      return { r, c };
    }
    return null;
  };

  const handleStart = (e: any) => {
    if (isCorrect) return;
    const coords = getCellCoords(e);
    if (coords) {
      setStartPos(coords);
      setCurrentPos(coords);
      setIsDragging(true);
    }
  };

  const handleMove = (e: any) => {
    if (!isDragging || isCorrect) return;
    const coords = getCellCoords(e);
    if (coords) setCurrentPos(coords);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    const path = getSelectedPath().map(p => `${p.r},${p.c}`);

    if (JSON.stringify(path) === JSON.stringify(targetCells)) {
      setIsCorrect(true);
      setTimeout(onWin, 1000);
    } else {
      setStartPos(null);
      setCurrentPos(null);
    }
    setIsDragging(false);
  };

  const getSelectedPath = () => {
    if (!startPos || !currentPos) return [];
    const path = [];
    const dr = currentPos.r - startPos.r;
    const dc = currentPos.c - startPos.c;
    const steps = Math.max(Math.abs(dr), Math.abs(dc));

    for (let i = 0; i <= steps; i++) {
      const r = startPos.r + Math.round((dr / steps) * i || 0);
      const c = startPos.c + Math.round((dc / steps) * i || 0);
      if (r >= 0 && r < 12 && c >= 0 && c < 12) {
        path.push({ r, c });
      }
    }
    return path;
  };

  const currentPath = getSelectedPath();

  return (
    <div className="flex flex-col items-center touch-none select-none w-full">
      <div
        className="relative grid grid-cols-12 gap-[1px] bg-slate-200 p-1 rounded-xl border-4 border-rose-100 shadow-2xl overflow-hidden"
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
      >
        {/* Selection Line Overlay */}
        {isDragging && startPos && currentPos && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <line
              x1={`${(startPos.c * 8.33) + 4.16}%`}
              y1={`${(startPos.r * 8.33) + 4.16}%`}
              x2={`${(currentPos.c * 8.33) + 4.16}%`}
              y2={`${(currentPos.r * 8.33) + 4.16}%`}
              stroke="rgba(251, 113, 133, 0.4)"
              strokeWidth="24"
              strokeLinecap="round"
            />
          </svg>
        )}

        {grid.map((row, r) => row.map((char, c) => {
          const isSelected = currentPath.some(p => p.r === r && p.c === c);
          const isFinal = isCorrect && targetCells.includes(`${r},${c}`);

          return (
            <div
              key={`${r}-${c}`}
              data-cell-id={`${r},${c}`}
              className={`w-7 h-7 flex items-center justify-center text-[11px] font-bold transition-all ${isFinal ? 'bg-rose-500 text-white rounded-full scale-110' :
                isSelected ? 'bg-rose-100 text-rose-600' : 'bg-white text-slate-400'
                }`}
            >
              {char}
            </div>
          );
        }))}
      </div>

      <div className="mt-8 text-center px-4">
        <h3 className="text-rose-900 text-xl font-bold italic" style={{ fontFamily: "'Caveat', cursive" }}>
          "Find the Name of your Everything..."
        </h3>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2 leading-relaxed">
          No decoys. No hints.
        </p>
      </div>
    </div>
  );
}

/** Level 4: Maze with Obstacles */
function LoveMazeGame({ onWin }: { onWin: () => void }) {
  const [pos, setPos] = useState({ r: 0, c: 0 });
  const walls = ["1,1", "1,2", "3,1", "3,3", "2,3", "0,2"];
  const target = { r: 4, c: 4 };

  const move = (dr: number, dc: number) => {
    const nr = Math.max(0, Math.min(4, pos.r + dr));
    const nc = Math.max(0, Math.min(4, pos.c + dc));
    if (!walls.includes(`${nr},${nc}`)) {
      setPos({ r: nr, c: nc });
      if (nr === target.r && nc === target.c) setTimeout(onWin, 600);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-5 gap-1 bg-rose-50 p-2 rounded-xl border-2 border-rose-100 mb-4">
        {[...Array(25)].map((_, i) => {
          const r = Math.floor(i / 5), c = i % 5;
          const isWall = walls.includes(`${r},${c}`);
          return (
            <div key={i} className={`w-12 h-12 flex items-center justify-center rounded ${isWall ? 'bg-rose-200 shadow-inner' : 'bg-white'}`}>
              {pos.r === r && pos.c === c && <Heart className="text-rose-600 fill-rose-600 animate-pulse" size={24} />}
              {target.r === r && target.c === c && <span className="text-xl">🎁</span>}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div /> <button onClick={() => move(-1, 0)} className="p-4 bg-white border border-rose-100 rounded-2xl shadow-sm"><ArrowUp size={24} /></button> <div />
        <button onClick={() => move(0, -1)} className="p-4 bg-white border border-rose-100 rounded-2xl shadow-sm"><ArrowLeft size={24} /></button>
        <button onClick={() => move(1, 0)} className="p-4 bg-white border border-rose-100 rounded-2xl shadow-sm"><ArrowDown size={24} /></button>
        <button onClick={() => move(0, 1)} className="p-4 bg-white border border-rose-100 rounded-2xl shadow-sm"><ArrowRight size={24} /></button>
      </div>
    </div>
  );
}

/** Level 5: The Heart Swap (Simplified) */
function HeartJigsawGame({ onWin }: { onWin: () => void }) {
  const [tiles, setTiles] = useState([1, 4, 2, 0, 5, 3, 7, 6, 8]);
  const [selected, setSelected] = useState<number | null>(null);

  const solution = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const icons = ['🤍', '🌸', '💖', '💝', '❤️', '🔥', '👑', '✨', '🎁'];

  const handleTileClick = (index: number) => {
    if (selected === null) {
      setSelected(index);
    } else {
      // Swap the two selected tiles
      const newTiles = [...tiles];
      const temp = newTiles[selected];
      newTiles[selected] = newTiles[index];
      newTiles[index] = temp;

      setTiles(newTiles);
      setSelected(null);

      // Check win condition
      if (newTiles.every((val, i) => val === solution[i])) {
        setTimeout(onWin, 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 bg-rose-100/50 px-4 py-2 rounded-full border border-rose-200">
        <p className="text-[10px] text-rose-600 font-bold uppercase tracking-widest mb-1 text-center">
          Tap two tiles to swap them:
        </p>
        <div className="flex gap-1 justify-center text-sm">
          {icons.map((icon, i) => (
            <span key={i} className="opacity-80">{icon}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-[2rem] shadow-xl border border-rose-100">
        {tiles.map((tileValue, i) => {
          const isSelected = selected === i;
          const isCorrect = tileValue === i;

          return (
            <motion.div
              key={tileValue}
              onClick={() => handleTileClick(i)}
              className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl transition-all cursor-pointer border-2 ${isSelected
                ? 'border-rose-500 bg-rose-50 scale-95 shadow-inner'
                : isCorrect
                  ? 'border-green-200 bg-green-50/30'
                  : 'border-rose-100 bg-white shadow-sm'
                }`}
            >
              {icons[tileValue]}
            </motion.div>
          );
        })}
      </div>

      <p className="mt-6 text-rose-800 text-sm italic font-medium">
        {selected !== null ? "Now tap another tile to swap..." : "Match the sequence above!"}
      </p>
    </div>
  );
}

/** Level 6: High-Density Scratch */
function ScratchCardGame({ onWin }: { onWin: () => void }) {
  const [scratched, setScratched] = useState(0);
  useEffect(() => { if (scratched >= 250) onWin(); }, [scratched, onWin]);

  return (
    <div className="relative w-full h-64 bg-rose-50 rounded-[2rem] overflow-hidden touch-none group"
      onMouseMove={() => setScratched(s => s + 1)} onTouchMove={() => setScratched(s => s + 1)}>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 transition-opacity" style={{ opacity: scratched / 250 }}>
        <Sparkles className="text-rose-500 mb-2 animate-spin-slow" size={40} />
        <p className="text-rose-900 font-bold text-lg leading-tight">Persistence pays off!<br />One last memory unlocked.</p>
      </div>
      {scratched < 250 && (
        <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 flex flex-col items-center justify-center text-white text-center p-8 transition-all"
          style={{ clipPath: `circle(${Math.max(0, 100 - (scratched / 2.5))}% at 50% 50%)` }}>
          <MousePointer2 className="mb-3 animate-bounce" size={32} />
          <p className="font-bold text-lg">You'll have to work harder for this one!</p>
          <p className="text-xs mt-2 opacity-70">SCRATCH EVERYWHERE</p>
        </div>
      )}
    </div>
  );
}

function IntroPage({ onStart }: { onStart: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-[340px] px-8 py-12 bg-white/90 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white">
      <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Heart className="text-rose-500 fill-rose-500" size={40} />
      </div>
      <h2 className="text-4xl text-rose-900 mb-4" style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}>Are you ready?</h2>
      <p className="text-rose-700 text-lg mb-8 italic leading-relaxed">
        I've hidden 6 memories behind these challenges. They aren't as easy as they look... but I know you can do it.
      </p>
      <button onClick={onStart} className="w-full py-5 bg-rose-600 text-white rounded-2xl font-bold text-xl shadow-xl active:scale-95 transition-all">
        Enter the Gallery
      </button>
    </motion.div>
  );
}