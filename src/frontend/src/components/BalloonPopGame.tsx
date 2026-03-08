import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

interface Balloon {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  msg: string;
  popped: boolean;
  animPhase: number;
  speed: number;
}

const BALLOON_COLORS = [
  "#60a5fa",
  "#fbbf24",
  "#f472b6",
  "#86efac",
  "#c4b5fd",
  "#fb923c",
  "#34d399",
  "#38bdf8",
  "#a78bfa",
  "#f9a8d4",
];

const MESSAGES = [
  "🎉 Happy Birthday!",
  "🌟 You're a Star!",
  "🎂 Make a Wish!",
  "💙 You're Amazing!",
  "🎈 Celebrate You!",
  "✨ Shine Bright!",
  "🦋 Be Happy!",
  "🌈 Joy Forever!",
  "🏆 You're #1!",
  "💫 Magic Day!",
  "🌸 Sweet Birthday!",
  "🎶 Dance & Sing!",
  "🌙 Dream Big!",
];

function createBalloons(count: number): Balloon[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 8 + (i % 5) * 19 + Math.random() * 6,
    y: 20 + Math.floor(i / 5) * 30 + Math.random() * 10,
    color: BALLOON_COLORS[i % BALLOON_COLORS.length],
    size: 52 + Math.random() * 20,
    msg: MESSAGES[i % MESSAGES.length],
    popped: false,
    animPhase: Math.random() * Math.PI * 2,
    speed: 1.5 + Math.random() * 1.5,
  }));
}

export default function BalloonPopGame() {
  const [balloons, setBalloons] = useState<Balloon[]>(() => createBalloons(12));
  const [score, setScore] = useState(0);
  const [popMessages, setPopMessages] = useState<
    { id: number; msg: string; x: number; y: number }[]
  >([]);
  const [msgId, setMsgId] = useState(0);

  const popBalloon = useCallback(
    (id: number) => {
      setBalloons((prev) => {
        const balloon = prev.find((b) => b.id === id);
        if (!balloon || balloon.popped) return prev;

        // Show floating message
        setPopMessages((msgs) => [
          ...msgs,
          { id: msgId, msg: balloon.msg, x: balloon.x, y: balloon.y },
        ]);
        setMsgId((n) => n + 1);
        setTimeout(() => {
          setPopMessages((msgs) => msgs.filter((m) => m.id !== msgId));
        }, 1500);

        setScore((s) => s + 1);
        return prev.map((b) => (b.id === id ? { ...b, popped: true } : b));
      });
    },
    [msgId],
  );

  const resetGame = () => {
    setBalloons(createBalloons(12));
    setScore(0);
    setPopMessages([]);
  };

  const allPopped = balloons.every((b) => b.popped);
  const remaining = balloons.filter((b) => !b.popped).length;

  return (
    <div className="flex flex-col gap-4">
      {/* Score bar */}
      <div className="flex items-center justify-between px-2">
        <div className="glass-card rounded-xl px-4 py-2">
          <span className="font-fun text-sm font-bold text-sky-dark">
            🎈 Popped: {score}/{balloons.length}
          </span>
        </div>
        <button
          type="button"
          data-ocid="balloon.reset_button"
          onClick={resetGame}
          className="font-fun text-sm font-semibold text-sky-dark bg-sky-light hover:bg-sky/20 px-4 py-2 rounded-xl transition-colors border border-sky/30"
        >
          🔄 Reset
        </button>
      </div>

      {/* Balloon playground */}
      <div
        data-ocid="balloon.canvas_target"
        className="relative w-full rounded-2xl overflow-hidden glass-card"
        style={{ height: 320, minHeight: 260 }}
      >
        {/* Sky background */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background:
              "linear-gradient(180deg, #dbeafe 0%, #eff6ff 60%, #f0fdf4 100%)",
          }}
        />

        {/* Clouds */}
        {[15, 55, 80].map((x, i) => (
          <motion.div
            key={x}
            className="absolute text-white/60 text-4xl pointer-events-none"
            style={{ left: `${x}%`, top: `${8 + i * 12}%` }}
            animate={{ x: [0, 10, 0] }}
            transition={{
              duration: 6 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            ☁️
          </motion.div>
        ))}

        {/* Balloons */}
        {balloons.map((balloon) => (
          <AnimatePresence key={balloon.id}>
            {!balloon.popped && (
              <motion.div
                className="absolute cursor-pointer select-none"
                style={{
                  left: `${balloon.x}%`,
                  top: `${balloon.y}%`,
                }}
                animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
                transition={{
                  duration: balloon.speed,
                  delay: balloon.animPhase * 0.3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                onClick={() => popBalloon(balloon.id)}
                whileHover={{ scale: 1.15, filter: "brightness(1.15)" }}
                whileTap={{ scale: 0.85 }}
              >
                <BalloonShape color={balloon.color} size={balloon.size} />
              </motion.div>
            )}
            {balloon.popped && (
              <motion.div
                key={`pop-${balloon.id}`}
                className="absolute pointer-events-none"
                style={{ left: `${balloon.x}%`, top: `${balloon.y}%` }}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.8, 0], opacity: [1, 0.6, 0] }}
                transition={{ duration: 0.35 }}
              >
                <div
                  style={{ fontSize: balloon.size * 0.5, color: balloon.color }}
                >
                  💥
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ))}

        {/* Floating messages */}
        {popMessages.map((pm) => (
          <motion.div
            key={pm.id}
            className="absolute pointer-events-none font-fun font-bold text-xs text-foreground/80 glass-card rounded-full px-3 py-1 whitespace-nowrap"
            style={{ left: `${pm.x}%`, top: `${pm.y}%` }}
            initial={{ y: 0, opacity: 1, scale: 0.8 }}
            animate={{ y: -60, opacity: 0, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {pm.msg}
          </motion.div>
        ))}

        {/* All popped overlay */}
        <AnimatePresence>
          {allPopped && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center bg-sky-light/80 backdrop-blur-sm rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="text-center space-y-3"
              >
                <p className="text-5xl">🎊</p>
                <p className="font-display text-2xl font-black text-sky-dark">
                  All Popped!
                </p>
                <p className="font-body text-foreground/60">
                  Amazing! You popped {score} balloons!
                </p>
                <button
                  type="button"
                  onClick={resetGame}
                  className="mt-2 font-fun font-bold text-sm bg-primary text-primary-foreground px-6 py-2 rounded-xl hover:bg-sky-dark transition-colors"
                >
                  Play Again!
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ground decorations */}
        <div className="absolute bottom-0 left-0 right-0 h-8 flex items-end justify-around px-4 opacity-50">
          {(["🌸-0", "🌺-1", "🌼-2", "🌻-3", "🌸-4", "🌺-5"] as const).map(
            (f) => (
              <span key={f} className="text-lg">
                {f.split("-")[0]}
              </span>
            ),
          )}
        </div>
      </div>

      <p className="font-body text-sm text-foreground/50 text-center">
        {remaining > 0
          ? `${remaining} balloons left to pop!`
          : "Refresh to play again!"}
      </p>
    </div>
  );
}

function BalloonShape({ color, size }: { color: string; size: number }) {
  const w = size * 0.75;
  const h = size;
  return (
    <svg
      width={w}
      height={h + 20}
      viewBox={`0 0 ${w} ${h + 20}`}
      fill="none"
      aria-label="Balloon"
      role="img"
    >
      <ellipse cx={w / 2} cy={h / 2} rx={w / 2} ry={h / 2} fill={color} />
      <ellipse
        cx={w / 2 - w * 0.18}
        cy={h / 2 - h * 0.22}
        rx={w * 0.14}
        ry={h * 0.18}
        fill="white"
        opacity="0.35"
      />
      <circle cx={w / 2} cy={h} r={3} fill={color} />
      <path
        d={`M ${w / 2} ${h + 3} Q ${w / 2 + 5} ${h + 10} ${w / 2} ${h + 18}`}
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
}
