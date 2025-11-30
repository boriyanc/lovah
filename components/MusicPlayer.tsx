import React, { useEffect, useRef, useState } from 'react';
import { BACKGROUND_MUSIC } from '../constants';

interface MusicPlayerProps {
  shouldPlay: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ shouldPlay }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (shouldPlay && !hasInteracted && audioRef.current) {
        // Attempt play, might fail if no interaction yet, but we expect shouldPlay 
        // to come AFTER a click on the previous screen.
        audioRef.current.play().then(() => {
            setIsPlaying(true);
            setHasInteracted(true);
        }).catch(err => {
            console.log("Autoplay prevented:", err);
        });
    }
  }, [shouldPlay, hasInteracted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg flex items-center gap-3 transition-opacity duration-500 hover:opacity-100 opacity-50">
      <audio ref={audioRef} src={BACKGROUND_MUSIC.url} loop />
      
      <button 
        onClick={togglePlay}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-rose-400 text-white hover:bg-rose-500 transition"
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <input 
        type="range" 
        min="0" 
        max="1" 
        step="0.01" 
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-20 accent-rose-500 h-1"
      />
    </div>
  );
};

export default MusicPlayer;