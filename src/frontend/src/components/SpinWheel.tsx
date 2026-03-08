import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const PRIZES = [
  { label: "Make a Wish!", emoji: "🌟", color: "#60a5fa" },
  { label: "Dance!", emoji: "💃", color: "#f472b6" },
  { label: "Sing a Song!", emoji: "🎵", color: "#fbbf24" },
  { label: "Get a Hug!", emoji: "🤗", color: "#86efac" },
  { label: "Share a Memory!", emoji: "📸", color: "#c4b5fd" },
  { label: "Eat Cake!", emoji: "🎂", color: "#fb923c" },
  { label: "Tell a Joke!", emoji: "😂", color: "#34d399" },
  { label: "Happy Dance!", emoji: "🕺", color: "#38bdf8" },
];

function drawWheelOnCanvas(canvas: HTMLCanvasElement, angle: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const size = canvas.width;
  const cx = size / 2;
  const cy = size / 2;
  const r = cx - 8;
  const segAngle = (2 * Math.PI) / PRIZES.length;

  ctx.clearRect(0, 0, size, size);

  // Outer ring
  ctx.beginPath();
  ctx.arc(cx, cy, r + 6, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.strokeStyle = "#93c5fd";
  ctx.lineWidth = 3;
  ctx.stroke();

  PRIZES.forEach((prize, i) => {
    const startAngle = angle + i * segAngle;
    const endAngle = startAngle + segAngle;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = prize.color;
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r * 0.5, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = `${prize.color}44`;
    ctx.fill();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(startAngle + segAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = `bold ${size < 280 ? 9 : 11}px system-ui, sans-serif`;
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 3;
    ctx.fillText(prize.label, r - 8, 4);
    ctx.font = `${size < 280 ? 14 : 18}px system-ui`;
    ctx.fillText(prize.emoji, r - 8, -8);
    ctx.restore();
  });

  ctx.beginPath();
  ctx.arc(cx, cy, 20, 0, Math.PI * 2);
  const grad = ctx.createRadialGradient(cx - 5, cy - 5, 2, cx, cy, 20);
  grad.addColorStop(0, "#fff");
  grad.addColorStop(1, "#93c5fd");
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = "#60a5fa";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#fbbf24";
  ctx.font = "16px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("⭐", cx, cy);
}

export default function SpinWheel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<(typeof PRIZES)[number] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const angleRef = useRef(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const size = Math.min(300, window.innerWidth - 80);
    canvas.width = size;
    canvas.height = size;
    drawWheelOnCanvas(canvas, 0);
  }, []);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);

    const extraSpins = 5 + Math.floor(Math.random() * 5);
    const targetSegment = Math.floor(Math.random() * PRIZES.length);
    const segAngle = (2 * Math.PI) / PRIZES.length;
    const targetAngle = -(targetSegment * segAngle + segAngle / 2);
    const totalRotation = extraSpins * Math.PI * 2 + targetAngle;

    let startTime: number | null = null;
    const duration = 4000;
    const startAngle = angleRef.current;

    const easeOut = (t: number) => 1 - (1 - t) ** 3;

    function animate(now: number) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const easedT = easeOut(t);

      angleRef.current = startAngle + totalRotation * easedT;
      if (canvasRef.current)
        drawWheelOnCanvas(canvasRef.current, angleRef.current);

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        // Normalize angle and find result
        const normalizedAngle =
          ((angleRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const pointerAngle = (Math.PI * 3.5 - normalizedAngle) % (Math.PI * 2);
        const prizeIndex = Math.floor(pointerAngle / segAngle) % PRIZES.length;
        setResult(PRIZES[prizeIndex]);
        setIsSpinning(false);
        setTimeout(() => setShowModal(true), 200);
      }
    }

    animRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Wheel container */}
      <div
        data-ocid="spin.canvas_target"
        className="relative flex items-center justify-center"
      >
        {/* Pointer */}
        <div
          className="absolute z-10 pointer-events-none"
          style={{
            top: -8,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <div
            className="w-0 h-0"
            style={{
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: "24px solid #fbbf24",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
            }}
          />
        </div>

        <motion.div
          animate={isSpinning ? {} : { scale: [1, 1.01, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <canvas ref={canvasRef} className="rounded-full shadow-gold" />
        </motion.div>
      </div>

      {/* Spin button */}
      <motion.button
        data-ocid="spin.primary_button"
        onClick={spin}
        disabled={isSpinning}
        whileHover={!isSpinning ? { scale: 1.05, y: -2 } : {}}
        whileTap={!isSpinning ? { scale: 0.95 } : {}}
        className={`
          font-fun text-lg font-black px-10 py-3.5 rounded-2xl transition-all shadow-gold
          ${
            isSpinning
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-gold text-white hover:bg-accent cursor-pointer"
          }
        `}
      >
        {isSpinning ? (
          <span className="flex items-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{
                duration: 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              ⭐
            </motion.span>
            Spinning...
          </span>
        ) : (
          "🎡 SPIN!"
        )}
      </motion.button>

      {/* Result modal */}
      <AnimatePresence>
        {showModal && result && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              data-ocid="spin.modal"
              className="relative glass-card rounded-3xl p-8 max-w-sm w-full text-center shadow-birthday z-10"
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, rotate: 10 }}
              transition={{ type: "spring", bounce: 0.4 }}
            >
              {/* Sparkles */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <motion.div
                  key={i}
                  className="absolute text-gold text-xl pointer-events-none"
                  style={{
                    left: `${50 + Math.cos((i / 8) * Math.PI * 2) * 45}%`,
                    top: `${50 + Math.sin((i / 8) * Math.PI * 2) * 40}%`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.6] }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                >
                  ✨
                </motion.div>
              ))}

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
                className="text-6xl mb-4"
              >
                {result.emoji}
              </motion.div>

              <h3 className="font-display text-2xl font-black text-sky-dark mb-2">
                You Got:
              </h3>
              <p
                className="font-fun text-xl font-bold mb-6"
                style={{ color: result.color }}
              >
                {result.label}
              </p>

              <button
                type="button"
                data-ocid="spin.close_button"
                onClick={() => setShowModal(false)}
                className="w-full font-fun font-bold text-sm bg-primary text-primary-foreground py-3 rounded-xl hover:bg-sky-dark transition-colors"
              >
                Awesome! 🎉
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
