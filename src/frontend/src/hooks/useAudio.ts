import { useCallback, useRef, useState } from "react";

type SoundType = "pop" | "blow" | "unwrap" | "whack" | "flip" | "success";

const SOUND_URLS: Record<SoundType, string> = {
  pop: "https://assets.mixkit.co/sfx/preview/mixkit-balloon-pop-2280.wav",
  blow: "https://assets.mixkit.co/sfx/preview/mixkit-blowing-air-2003.wav",
  unwrap:
    "https://assets.mixkit.co/sfx/preview/mixkit-gift-box-opening-2201.wav",
  whack:
    "https://assets.mixkit.co/sfx/preview/mixkit-cartoon-hit-impact-2952.wav",
  flip: "https://assets.mixkit.co/sfx/preview/mixkit-page-flip-3030.wav",
  success:
    "https://assets.mixkit.co/sfx/preview/mixkit-achievement-completed-2068.wav",
};

const MUSIC_URL =
  "https://assets.mixkit.co/music/preview/mixkit-happy-birthday-music-648.mp3";

export function useAudio() {
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const playSound = useCallback((type: SoundType) => {
    try {
      const audio = new Audio(SOUND_URLS[type]);
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch {
      // Audio not supported
    }
  }, []);

  const toggleMusic = useCallback(() => {
    try {
      if (isMusicPlaying) {
        if (musicRef.current) {
          musicRef.current.pause();
          musicRef.current.currentTime = 0;
        }
        setIsMusicPlaying(false);
      } else {
        if (!musicRef.current) {
          musicRef.current = new Audio(MUSIC_URL);
          musicRef.current.loop = true;
          musicRef.current.volume = 0.3;
        }
        musicRef.current.play().catch(() => {});
        setIsMusicPlaying(true);
      }
    } catch {
      // Audio not supported
    }
  }, [isMusicPlaying]);

  return { playSound, toggleMusic, isMusicPlaying };
}
