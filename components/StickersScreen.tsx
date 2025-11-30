import React, { useState, useEffect } from 'react';
import { MEMORIES_LIST, LOVE_REASONS, CAKE_IMAGE_URL, CANDLE_IMAGE_URL } from '../constants';
import { StickerData } from '../types';

interface MainScreenProps {
  isActive: boolean;
}

const MainScreen: React.FC<MainScreenProps> = ({ isActive }) => {
  const [activeMemory, setActiveMemory] = useState<number | null>(null);
  const [extinguishedCandles, setExtinguishedCandles] = useState<Set<number>>(new Set());
  const [activeReason, setActiveReason] = useState<string | null>(null);
  const [memoryPositions, setMemoryPositions] = useState<Array<{x: number, y: number}>>([]);

  // --- SMART POSITION GENERATION ---
  useEffect(() => {
    if (!isActive) return;

    const generateNonOverlappingPositions = (count: number) => {
      const positions: Array<{x: number, y: number}> = [];
      const maxAttempts = 50; // Try 50 times to find a spot for each photo

      // Dimensions (in percentages) used for collision math
      const cardWidth = 16;  // Approx width of a photo card in %
      const cardHeight = 20; // Approx height of a photo card in %
      
      // Define "Forbidden Zones" [x, y, width, height] in percentages
      // These are areas where photos are strictly NOT allowed to spawn.
      const forbiddenZones = [
        { x: 25, y: 0, w: 50, h: 30 },  // TITLE ZONE (Top Center): Protects "Happy Birthday" text
        { x: 25, y: 30, w: 50, h: 45 }  // CAKE ZONE (Center): Protects the Cake
      ];

      for (let i = 0; i < count; i++) {
        let placed = false;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          // Generate random coordinate
          // We limit max X to 82 and max Y to 80 to keep the card inside the screen edges
          const x = Math.floor(Math.random() * (82 - 2 + 1)) + 2;
          const y = Math.floor(Math.random() * (80 - 2 + 1)) + 2;

          // 1. Check against Forbidden Zones (Title & Cake)
          // Logic: Does the rectangle of the new photo intersect with a forbidden zone?
          const hitsZone = forbiddenZones.some(zone => {
            return (
              x < zone.x + zone.w &&
              x + cardWidth > zone.x &&
              y < zone.y + zone.h &&
              y + cardHeight > zone.y
            );
          });

          if (hitsZone) continue; // Try again

          // 2. Check against Existing Photos (Prevent Photo Overlap)
          // Logic: Is this position too close to a photo we already placed?
          const hitsPhoto = positions.some(pos => {
            const distance = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
            // If distance is less than 18%, they are too close
            return distance < 18; 
          });

          if (hitsPhoto) continue; // Try again

          // If we passed both checks, it's a valid spot!
          positions.push({ x, y });
          placed = true;
          break;
        }

        // If we couldn't place it after 50 tries (screen too full), 
        // dump it in a generic safe corner so it doesn't disappear.
        if (!placed) {
             positions.push({ x: 5, y: 85 }); 
        }
      }
      return positions;
    };

    setMemoryPositions(generateNonOverlappingPositions(MEMORIES_LIST.length));
  }, [isActive]);

  if (!isActive) return null;

  const handleCandleClick = (index: number) => {
    if (!extinguishedCandles.has(index)) {
      const newSet = new Set(extinguishedCandles);
      newSet.add(index);
      setExtinguishedCandles(newSet);
      setActiveReason(LOVE_REASONS[index]);
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-orange-50 to-rose-50 flex items-center justify-center">
      
      {/* --- CENTRAL GROUP: Title + Cake --- */}
      {/* pointer-events-none ensures clicks pass through the empty areas to the photos below */}
      <div className="relative z-30 flex flex-col items-center justify-center h-full max-h-screen py-10 pointer-events-none">
        
        {/* Title Group - explicitly spaced to match the "Forbidden Zone" logic */}
        <div className="mb-8 text-center px-4 animate-fade-in pointer-events-auto">
          <h2 className="text-5xl md:text-6xl font-hand text-rose-500 drop-shadow-sm mb-2">Happy Birthday pretty boy!</h2>
          <p className="text-stone-400 text-sm animate-pulse tracking-widest uppercase font-bold">
              {extinguishedCandles.size === 19 ? "All wishes made, have an amazing year my love ❤️" : "19 reasons why, for your 19th:)"}
              <br></br>(PS click on the polaroids for my favourite memories of us!)
          </p>
        </div>

        {/* Cake Container */}
        <div className="relative transform scale-90 md:scale-100 transition-transform">
           <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
              <img 
                src={CAKE_IMAGE_URL} 
                alt="Birthday Cake" 
                className="w-full h-full object-contain drop-shadow-2xl"
              />

              {/* Candles - pointer-events-auto ensures they remain clickable */}
              <div className="absolute top-[20%] left-[39.5%] w-[19.5%] h-[12%] flex justify-between items-end">
                  {[...Array(4)].map((_, i) => (
                      <div key={i} className="pointer-events-auto h-full w-[20%] flex justify-center items-end" style={{ transform: `translateY(-${Math.pow(Math.abs(i - 1.5), 2) * 4}px)` }}>
                        <Candle index={i} isLit={!extinguishedCandles.has(i)} onClick={() => handleCandleClick(i)} />
                      </div>
                  ))}
              </div>
              <div className="absolute top-[34%] left-[32%] w-[34%] h-[10%] flex justify-between items-end">
                  {[...Array(7)].map((_, i) => (
                      <div key={i + 4} className="pointer-events-auto h-full w-[12%] flex justify-center items-end" style={{ transform: `translateY(-${Math.pow(Math.abs(i - 3), 2) * 2}px)` }}>
                        <Candle index={i + 4} isLit={!extinguishedCandles.has(i + 4)} onClick={() => handleCandleClick(i + 4)} />
                      </div>
                  ))}
              </div>
              <div className="absolute top-[46%] left-[26%] w-[44%] h-[12%] flex justify-between items-end">
                  {[...Array(8)].map((_, i) => (
                      <div key={i + 11} className="pointer-events-auto h-full w-[15%] flex justify-center items-end" style={{ transform: `translateY(-${Math.pow(Math.abs(i - 3.5), 2) * 1.5}px)` }}>
                        <Candle index={i + 11} isLit={!extinguishedCandles.has(i + 11)} onClick={() => handleCandleClick(i + 11)} />
                      </div>
                  ))}
              </div>
           </div>
        </div>
      </div>

      {/* --- LAYER 2: Floating Memories --- */}
      {/* z-40 places them above the cake container layer, but below the modal */}
      <div className="absolute inset-0 pointer-events-none z-40">
        {MEMORIES_LIST.map((sticker: StickerData, index) => {
          if (memoryPositions.length === 0) return null;
          // Fallback to center if calculation failed (rare)
          const pos = memoryPositions[index] || {x: 50, y: 50}; 
          
          return (
            <FloatingMemory 
              key={sticker.id} 
              data={sticker} 
              position={pos}
              isOpen={activeMemory === sticker.id}
              onToggle={() => setActiveMemory(activeMemory === sticker.id ? null : sticker.id)}
            />
          );
        })}
      </div>

      {/* --- LAYER 3: Reason Popup Modal --- */}
      {activeReason && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-fade-in pointer-events-auto">
           <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full text-center relative animate-bloom border-2 border-rose-100">
              <div className="mb-4 text-4xl">💌</div>
              <p className="font-['Quicksand'] text-2xl text-stone-800 leading-relaxed">
                {activeReason}
              </p>
              <button 
                onClick={() => setActiveReason(null)}
                className="mt-6 bg-rose-400 text-white px-6 py-2 rounded-full hover:bg-rose-500 transition-colors text-sm font-semibold shadow-md"
              >
                Close
              </button>
           </div>
        </div>
      )}

    </div>
  );
};

// --- Subcomponents ---

const FloatingMemory: React.FC<{ data: StickerData; position: {x: number, y: number}; isOpen: boolean; onToggle: () => void }> = ({ data, position, isOpen, onToggle }) => {
  const style: React.CSSProperties = {
    left: `${position.x}%`,
    top: `${position.y}%`,
    animationDuration: `${data.duration}s`,
    animationDelay: `${data.delay}s`,
    transform: `rotate(${data.rotation}deg)`
  };

  return (
    <div 
      className={`absolute transition-all duration-500 ease-in-out flex items-center justify-center ${
        isOpen 
        ? 'z-[60] pointer-events-auto' 
        : 'z-40 pointer-events-auto animate-float hover:scale-110' 
      }`}
      style={isOpen ? { top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(1.25)' } : style}
    >
        <div 
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className={`cursor-pointer bg-white p-2 shadow-lg transition-all duration-300 w-24 md:w-32 transform origin-center ${isOpen ? 'rotate-0 shadow-2xl ring-4 ring-rose-100 w-64 md:w-72' : 'hover:rotate-0'}`}
        >
            <div className="aspect-square bg-stone-200 overflow-hidden mb-1">
                <img src={data.imgUrl} alt="Memory" className="w-full h-full object-cover" />
            </div>
            {isOpen && (
                <div className="text-center font-['Quicksand'] text-stone-700 text-lg leading-tight p-2 animate-fade-in">
                    {data.text}
                </div>
            )}
        </div>
        {isOpen && <div className="fixed inset-0 -z-10 bg-black/40 backdrop-blur-[2px] cursor-default" onClick={onToggle}></div>}
    </div>
  );
};

const Candle: React.FC<{ index: number; isLit: boolean; onClick: () => void }> = ({ isLit, onClick }) => {
    return (
        <div 
            className="relative flex flex-col items-center cursor-pointer hover:-translate-y-1 transition-transform group w-full h-full"
            onClick={(e) => {
               e.stopPropagation(); 
               onClick();
            }}
        >
            <div className="h-[40%] w-full flex justify-center items-end mb-[2px]">
                {isLit && (
                    <div className="w-[40%] h-[80%] bg-orange-400 rounded-[50%] shadow-[0_0_8px_1px_rgba(255,165,0,0.8)] candle-flame origin-bottom"></div>
                )}
            </div>
            <div className="w-full h-[60%] relative">
                <img 
                    src={CANDLE_IMAGE_URL} 
                    alt="Candle" 
                    className="w-full h-full object-contain opacity-90"
                />
            </div>
        </div>
    );
};

export default MainScreen;