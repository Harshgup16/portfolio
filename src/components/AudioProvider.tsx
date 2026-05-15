"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

interface AudioContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  playMusic: () => void;
  pauseMusic: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio only on client side
    audioRef.current = new Audio("/music/mast.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Browsers block auto-play. Silently catch the error and set up a listener 
        // to start music on the very first valid user interaction.
        const playOnInteract = () => {
          if (audioRef.current) {
            audioRef.current.play().then(() => {
              setIsPlaying(true);
              // Clean up listeners ONLY on success
              document.removeEventListener("click", playOnInteract);
              document.removeEventListener("pointerdown", playOnInteract);
              document.removeEventListener("touchstart", playOnInteract);
              document.removeEventListener("keydown", playOnInteract);
            }).catch(() => {
              // Silently ignore failure, wait for the next interaction
            });
          }
        };
        
        document.addEventListener("click", playOnInteract);
        document.addEventListener("pointerdown", playOnInteract);
        document.addEventListener("touchstart", playOnInteract);
        document.addEventListener("keydown", playOnInteract);
      });
    }
  };

  const pauseMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) pauseMusic();
    else playMusic();
  };

  return (
    <AudioContext.Provider value={{ isPlaying, togglePlay, playMusic, pauseMusic }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
