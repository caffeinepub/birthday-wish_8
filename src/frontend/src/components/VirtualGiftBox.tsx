import { useState } from "react";
import { useAudio } from "../hooks/useAudio";
import { AnimatedPanda } from "./AnimatedPanda";

const SPARKLE_ITEMS = [
  { emoji: "✨", top: 10, left: 5, dur: 1.0 },
  { emoji: "⭐", top: 5, left: 85, dur: 1.3 },
  { emoji: "💫", top: 15, left: 90, dur: 1.6 },
  { emoji: "🌟", top: 8, left: 50, dur: 1.9 },
  { emoji: "✨", top: 20, left: 70, dur: 2.2 },
];

export function VirtualGiftBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const { playSound } = useAudio();

  const handleOpen = () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);
    playSound("unwrap");
    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
    }, 600);
  };

  return (
    <div className="py-20 px-4 flex flex-col items-center gap-8">
      <h2
        className="text-4xl md:text-5xl font-heading text-center"
        style={{
          color: "oklch(0.42 0.15 280)",
          textShadow: "0 2px 12px oklch(0.72 0.12 280 / 40%)",
        }}
      >
        🎁 Your Special Gift!
      </h2>

      <div className="relative flex flex-col items-center">
        {!isOpen ? (
          <button
            type="button"
            data-ocid="gift.open_button"
            onClick={handleOpen}
            className="relative cursor-pointer hover:scale-105 transition-transform"
            aria-label="Open your gift"
          >
            <div className="relative flex flex-col items-center">
              <div
                style={{
                  width: 200,
                  height: 60,
                  background: "linear-gradient(135deg, #ff6b9d, #c77dff)",
                  borderRadius: "12px 12px 0 0",
                  boxShadow: "0 4px 16px rgba(199, 125, 255, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: isOpening
                    ? "gift-open 0.6s ease-in forwards"
                    : "float 2s ease-in-out infinite",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <div style={{ display: "flex", gap: 4 }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      background: "#ffd166",
                      borderRadius: "50% 50% 50% 0",
                      transform: "rotate(-45deg)",
                      boxShadow: "inset 2px 2px 4px rgba(255,255,255,0.4)",
                    }}
                  />
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      background: "#ffd166",
                      borderRadius: "50% 50% 0 50%",
                      transform: "rotate(45deg)",
                      boxShadow: "inset 2px 2px 4px rgba(255,255,255,0.4)",
                    }}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    width: 200,
                    height: 10,
                    background: "#ffd166",
                    top: "50%",
                    left: 0,
                    transform: "translateY(-50%)",
                  }}
                />
              </div>
              <div
                style={{
                  width: 200,
                  height: 160,
                  background: "linear-gradient(135deg, #4cc9f0, #7209b7)",
                  borderRadius: "0 0 16px 16px",
                  boxShadow: "0 8px 32px rgba(114, 9, 183, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: 12,
                    height: "100%",
                    background: "#ffd166",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                />
                <div style={{ fontSize: 48 }}>🎁</div>
              </div>
            </div>
            <p
              className="mt-4 text-center font-body text-lg"
              style={{ color: "oklch(0.45 0.12 280)" }}
            >
              Click to open your gift! 🎊
            </p>
          </button>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div
              className="relative flex flex-col items-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.95 0.04 230), oklch(0.92 0.06 280))",
                borderRadius: 24,
                padding: "2rem 3rem",
                boxShadow: "0 12px 48px oklch(0.62 0.16 280 / 25%)",
              }}
            >
              {SPARKLE_ITEMS.map((s) => (
                <div
                  key={`sparkle-${s.emoji}-${s.top}-${s.left}`}
                  className="absolute text-2xl"
                  style={{
                    top: `${s.top}%`,
                    left: `${s.left}%`,
                    animation: `sparkle ${s.dur}s ease-in-out infinite`,
                  }}
                >
                  {s.emoji}
                </div>
              ))}
              <AnimatedPanda size={200} />
              <p
                className="text-2xl font-heading mt-4"
                style={{ color: "oklch(0.42 0.15 280)" }}
              >
                🐼 A Panda Plushie for You!
              </p>
              <p
                className="text-base font-body"
                style={{ color: "oklch(0.52 0.10 260)" }}
              >
                The most adorable gift in the world! 💕
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
