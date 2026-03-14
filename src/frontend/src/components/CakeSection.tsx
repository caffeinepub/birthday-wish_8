import { useCallback, useState } from "react";
import { useAudio } from "../hooks/useAudio";

const NUM_CANDLES = 6;
const CANDLE_COLORS = [
  "#ff6b9d",
  "#c77dff",
  "#4cc9f0",
  "#ffd166",
  "#ff6b9d",
  "#c77dff",
];

interface Props {
  onWishMade?: () => void;
}

export function CakeSection({ onWishMade }: Props) {
  const [candlesLit, setCandlesLit] = useState<boolean[]>(
    Array(NUM_CANDLES).fill(true),
  );
  const [wishMade, setWishMade] = useState(false);
  const [cakeCut, setCakeCut] = useState(false);
  const [cuttingAnim, setCuttingAnim] = useState(false);
  const [showSmoke, setShowSmoke] = useState<number[]>([]);
  const { playSound } = useAudio();

  const blowCandle = useCallback(() => {
    const nextIdx = candlesLit.lastIndexOf(true);
    if (nextIdx === -1) return;
    playSound("blow");
    setShowSmoke((prev) => [...prev, nextIdx]);
    setTimeout(
      () => setShowSmoke((prev) => prev.filter((i) => i !== nextIdx)),
      1200,
    );
    setCandlesLit((prev) => {
      const next = [...prev];
      next[nextIdx] = false;
      return next;
    });
  }, [candlesLit, playSound]);

  const allBlown = candlesLit.every((v) => !v);

  const makeWish = useCallback(() => {
    setWishMade(true);
    onWishMade?.();
    playSound("success");
  }, [onWishMade, playSound]);

  const cutCake = useCallback(() => {
    setCuttingAnim(true);
    playSound("success");
    setTimeout(() => setCakeCut(true), 800);
  }, [playSound]);

  return (
    <div className="py-20 px-4 flex flex-col items-center gap-8">
      <h2
        className="text-4xl md:text-5xl font-heading text-center"
        style={{
          color: "oklch(0.42 0.15 280)",
          textShadow: "0 2px 12px oklch(0.72 0.12 280 / 40%)",
        }}
      >
        🎂 Make a Wish!
      </h2>

      <div
        className="relative flex flex-col items-center"
        style={{
          animation: cakeCut ? "none" : "cake-wobble 4s ease-in-out infinite",
        }}
      >
        {/* Candles */}
        <div className="flex gap-3 mb-1 relative z-10">
          {candlesLit.map((lit, i) => (
            <div
              key={`candle-${CANDLE_COLORS[i]}-${i}`}
              className="relative flex flex-col items-center"
            >
              {showSmoke.includes(i) && (
                <div
                  className="absolute -top-8 text-lg"
                  style={{ animation: "smoke-puff 1.2s ease-out forwards" }}
                >
                  💨
                </div>
              )}
              {lit && (
                <div
                  style={{
                    width: 10,
                    height: 18,
                    background:
                      "linear-gradient(to top, #ff6b35, #ffd166, #fff9c4)",
                    borderRadius: "50% 50% 30% 30%",
                    animation: "flicker 0.5s ease-in-out infinite",
                    boxShadow: "0 0 8px #ffd166, 0 0 16px #ff6b35",
                    marginBottom: 2,
                  }}
                />
              )}
              <div
                style={{
                  width: 10,
                  height: 36,
                  background: CANDLE_COLORS[i],
                  borderRadius: 4,
                  boxShadow: "inset 2px 0 4px rgba(255,255,255,0.4)",
                }}
              />
            </div>
          ))}
        </div>

        {/* Cake layers */}
        {!cakeCut ? (
          <div className="flex flex-col items-center">
            <div
              style={{
                width: 160,
                height: 50,
                background: "linear-gradient(to bottom, #ff9fd4, #ffb3d9)",
                borderRadius: "12px 12px 0 0",
                boxShadow:
                  "0 4px 12px rgba(0,0,0,0.1), inset 0 4px 8px rgba(255,255,255,0.4)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  left: 0,
                  right: 0,
                  display: "flex",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 16 }}>🌸</span>
                <span style={{ fontSize: 16 }}>⭐</span>
                <span style={{ fontSize: 16 }}>🌸</span>
              </div>
            </div>
            <div
              style={{
                width: 168,
                height: 10,
                background: "white",
                borderRadius: "0 0 8px 8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            />
            <div
              style={{
                width: 200,
                height: 60,
                background: "linear-gradient(to bottom, #b3d9ff, #c5e3ff)",
                boxShadow:
                  "0 4px 12px rgba(0,0,0,0.1), inset 0 4px 8px rgba(255,255,255,0.4)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 22 }}>🎂</span>
              </div>
            </div>
            <div
              style={{
                width: 208,
                height: 10,
                background: "white",
                borderRadius: "0 0 8px 8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            />
            <div
              style={{
                width: 240,
                height: 65,
                background: "linear-gradient(to bottom, #c8b6ff, #d8c6ff)",
                borderRadius: "0 0 16px 16px",
                boxShadow:
                  "0 6px 16px rgba(0,0,0,0.12), inset 0 4px 8px rgba(255,255,255,0.4)",
              }}
            />
          </div>
        ) : (
          <div className="flex gap-4 items-end">
            <div
              style={{
                width: 110,
                height: 175,
                background:
                  "linear-gradient(to bottom, #ff9fd4, #b3d9ff, #c8b6ff)",
                borderRadius: "12px 4px 4px 16px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                animation: "float-slow 3s ease-in-out infinite",
              }}
            >
              🍰
            </div>
            <div
              style={{
                width: 110,
                height: 175,
                background:
                  "linear-gradient(to bottom, #ff9fd4, #b3d9ff, #c8b6ff)",
                borderRadius: "4px 12px 16px 4px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                animation: "float-slow 4s ease-in-out infinite",
              }}
            >
              🍰
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-4">
        {!allBlown && (
          <button
            type="button"
            data-ocid="cake.blow_button"
            onClick={blowCandle}
            className="px-8 py-4 rounded-2xl text-white font-heading text-xl shadow-birthday hover:scale-105 transition-transform"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.62 0.16 230), oklch(0.52 0.17 260))",
            }}
          >
            💨 Blow a Candle!
          </button>
        )}

        {allBlown && !wishMade && (
          <div className="flex flex-col items-center gap-3">
            <p
              className="text-2xl font-heading"
              style={{ color: "oklch(0.42 0.15 280)" }}
            >
              All candles blown! 🎉
            </p>
            <button
              type="button"
              onClick={makeWish}
              className="px-8 py-4 rounded-2xl text-white font-heading text-xl shadow-gold hover:scale-105 transition-transform"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.72 0.18 60), oklch(0.82 0.18 80))",
              }}
            >
              ⭐ Make a Wish!
            </button>
          </div>
        )}

        {wishMade && !cakeCut && (
          <div className="flex flex-col items-center gap-3">
            <p
              className="text-xl font-body"
              style={{ color: "oklch(0.40 0.10 280)" }}
            >
              Your wish has been made! ✨
            </p>
            <button
              type="button"
              data-ocid="cake.cut_button"
              onClick={cutCake}
              disabled={cuttingAnim}
              className="px-8 py-4 rounded-2xl text-white font-heading text-xl shadow-birthday hover:scale-105 transition-transform disabled:opacity-60"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.22 25), oklch(0.65 0.20 15))",
              }}
            >
              🔪 Cut the Cake!
            </button>
          </div>
        )}

        {cakeCut && (
          <div className="text-center">
            <p
              className="text-2xl font-heading"
              style={{ color: "oklch(0.42 0.15 280)" }}
            >
              Enjoy your cake! 🍰🎊
            </p>
            <p
              className="text-lg font-body mt-2"
              style={{ color: "oklch(0.52 0.10 240)" }}
            >
              Time to celebrate!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
