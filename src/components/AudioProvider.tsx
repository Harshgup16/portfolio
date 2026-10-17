"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

interface AudioContextType {
  // Background music
  isPlaying: boolean;
  togglePlay: () => void;
  playMusic: () => void;
  pauseMusic: () => void;

  // Sound effects (AUGE XP Web Audio Engine)
  soundEnabled: boolean;
  toggleSound: () => void;
  playHover: () => void;
  playClick: () => void;
  playStep: () => void;
  playMenuOpen: () => void;
  playTransition: () => void;
  playScramble: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const SOUND_FILES = {
  click: "/sounds/click.mp3",
  menuOpen: "/sounds/menu-open.mp3",
  transition: "/sounds/transition.mp3",
  scramble: "/sounds/scramble.mp3",
  hover: [
    "/sounds/hover-1.mp3",
    "/sounds/hover-2.mp3",
    "/sounds/hover-3.mp3",
    "/sounds/hover-4.mp3",
  ],
  step: [
    "/sounds/step-1.mp3",
    "/sounds/step-2.mp3",
    "/sounds/step-3.mp3",
    "/sounds/step-4.mp3",
    "/sounds/step-5.mp3",
    "/sounds/step-6.mp3",
  ],
};

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Background music ref
  const musicRef = useRef<HTMLAudioElement | null>(null);

  // Web Audio API refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const buffersRef = useRef<Map<string, AudioBuffer>>(new Map());
  const lastHoverIndexRef = useRef<number>(-1);
  const stepIndexRef = useRef<number>(0);
  const sleepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // -------------------------------------------------------------
  // 1. Web Audio Engine Initialization & Auto-Sleep
  // -------------------------------------------------------------
  const resetSleepTimer = () => {
    if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    sleepTimerRef.current = setTimeout(() => {
      if (audioCtxRef.current && audioCtxRef.current.state === "running") {
        audioCtxRef.current.suspend().catch(() => {});
      }
    }, 30000); // Auto-sleep after 30s idle to conserve battery & CPU
  };

  const getAudioContext = () => {
    if (!audioCtxRef.current && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;

      const ctx = new AudioCtx({ latencyHint: "interactive" });
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.35, ctx.currentTime);
      gainNode.connect(ctx.destination);

      audioCtxRef.current = ctx;
      gainNodeRef.current = gainNode;
    }

    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }

    resetSleepTimer();
    return audioCtxRef.current;
  };

  // Pre-fetch & pre-decode all 14 sound files during idle time
  useEffect(() => {
    const loadSounds = async () => {
      const ctx = getAudioContext();
      if (!ctx) return;

      const allUrls = [
        SOUND_FILES.click,
        SOUND_FILES.menuOpen,
        SOUND_FILES.transition,
        SOUND_FILES.scramble,
        ...SOUND_FILES.hover,
        ...SOUND_FILES.step,
      ];

      for (const url of allUrls) {
        if (buffersRef.current.has(url)) continue;
        try {
          const res = await fetch(url);
          const arrayBuffer = await res.arrayBuffer();
          const decoded = await ctx.decodeAudioData(arrayBuffer);
          buffersRef.current.set(url, decoded);
        } catch {
          // silently skip if decode fails
        }
      }
    };

    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(() => {
          loadSounds();
        });
      } else {
        setTimeout(loadSounds, 1000);
      }

      const wakeUp = () => {
        if (audioCtxRef.current?.state === "suspended") {
          audioCtxRef.current.resume().catch(() => {});
        }
        resetSleepTimer();
      };

      window.addEventListener("pointerdown", wakeUp, { passive: true });
      window.addEventListener("keydown", wakeUp, { passive: true });
      window.addEventListener("pointermove", wakeUp, { once: true, passive: true });

      return () => {
        window.removeEventListener("pointerdown", wakeUp);
        window.removeEventListener("keydown", wakeUp);
        window.removeEventListener("pointermove", wakeUp);
        if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
      };
    }
  }, []);

  // -------------------------------------------------------------
  // 2. Play Audio Buffer with zero latency
  // -------------------------------------------------------------
  const playBuffer = (buffer: AudioBuffer | undefined, volume = 1) => {
    if (!buffer || !soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx || !gainNodeRef.current) return;

    try {
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      if (volume !== 1) {
        const itemGain = ctx.createGain();
        itemGain.gain.setValueAtTime(volume, ctx.currentTime);
        source.connect(itemGain);
        itemGain.connect(gainNodeRef.current);
      } else {
        source.connect(gainNodeRef.current);
      }

      source.start(0);
    } catch {
      // Silently catch audio buffer failures
    }
  };

  // Triggers
  const playClick = () => {
    playBuffer(buffersRef.current.get(SOUND_FILES.click), 0.9);
  };

  const playMenuOpen = () => {
    playBuffer(buffersRef.current.get(SOUND_FILES.menuOpen), 0.85);
  };

  const playTransition = () => {
    playBuffer(buffersRef.current.get(SOUND_FILES.transition), 0.85);
  };

  const playScramble = () => {
    playBuffer(buffersRef.current.get(SOUND_FILES.scramble), 0.6);
  };

  // Anti-repeat shuffle for hover (disabled on mobile phones < 768px)
  const playHover = () => {
    if (typeof window === "undefined") return;

    // Only disable hover sounds on mobile phone screens (< 768px)
    if (window.innerWidth < 768) {
      return;
    }

    const list = SOUND_FILES.hover;
    let nextIdx = Math.floor(Math.random() * list.length);
    if (nextIdx === lastHoverIndexRef.current) {
      nextIdx = (nextIdx + 1) % list.length;
    }
    lastHoverIndexRef.current = nextIdx;

    const file = list[nextIdx];
    const buffer = buffersRef.current.get(file);

    if (buffer && audioCtxRef.current && audioCtxRef.current.state === "running") {
      playBuffer(buffer, 0.65);
    } else {
      // Fallback: direct HTML5 Audio playback (works even if AudioContext is warming up)
      try {
        const audio = new Audio(file);
        audio.volume = 0.4;
        audio.play().catch(() => {});
      } catch {
        // Silently catch
      }
    }
  };

  // Ascending sequence ladder for step (carousel & pinned scrolls)
  const playStep = () => {
    const list = SOUND_FILES.step;
    const curr = stepIndexRef.current;
    stepIndexRef.current = (curr + 1) % list.length;
    playBuffer(buffersRef.current.get(list[curr]), 0.85);
  };

  // Sound FX toggle with 15ms anti-click ramp
  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (gainNodeRef.current && audioCtxRef.current) {
        const time = audioCtxRef.current.currentTime;
        gainNodeRef.current.gain.linearRampToValueAtTime(next ? 0.35 : 0.0001, time + 0.015);
      }
      return next;
    });
  };

  // -------------------------------------------------------------
  // 3. Background Music (mast.mp3)
  // -------------------------------------------------------------
  const playMusic = () => {
    if (musicRef.current) {
      musicRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          if (audioCtxRef.current?.state === "suspended") {
            audioCtxRef.current.resume().catch(() => {});
          }
        })
        .catch(() => {
          // Browsers block auto-play. Silently catch the error and set up a listener 
          // to start music on the very first valid user interaction.
          const playOnInteract = () => {
            if (musicRef.current) {
              musicRef.current
                .play()
                .then(() => {
                  setIsPlaying(true);
                  if (audioCtxRef.current?.state === "suspended") {
                    audioCtxRef.current.resume().catch(() => {});
                  }
                  // Clean up listeners ONLY on success
                  document.removeEventListener("click", playOnInteract);
                  document.removeEventListener("pointerdown", playOnInteract);
                  document.removeEventListener("touchstart", playOnInteract);
                  document.removeEventListener("keydown", playOnInteract);
                })
                .catch(() => {
                  // Silently ignore failure, wait for next interaction
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

  useEffect(() => {
    musicRef.current = new Audio("/music/mast.mp3");
    musicRef.current.loop = true;
    musicRef.current.volume = 0.5;

    // Immediately attempt to autoplay on load (laptop reload)
    playMusic();

    return () => {
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current = null;
      }
    };
  }, []);

  const pauseMusic = () => {
    if (musicRef.current) {
      musicRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) pauseMusic();
    else playMusic();
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        togglePlay,
        playMusic,
        pauseMusic,
        soundEnabled,
        toggleSound,
        playHover,
        playClick,
        playStep,
        playMenuOpen,
        playTransition,
        playScramble,
      }}
    >
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
