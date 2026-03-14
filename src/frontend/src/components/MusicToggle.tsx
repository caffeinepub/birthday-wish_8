import { useAudio } from "../hooks/useAudio";

export function MusicToggle() {
  const { toggleMusic, isMusicPlaying } = useAudio();

  return (
    <button
      type="button"
      data-ocid="music.toggle"
      onClick={toggleMusic}
      className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full shadow-birthday flex items-center justify-center text-2xl bg-white/90 backdrop-blur-sm border-2 border-primary/20 hover:scale-110 transition-transform"
      title={isMusicPlaying ? "Stop music" : "Play music"}
    >
      {isMusicPlaying ? "🔇" : "🎵"}
    </button>
  );
}
