import { useEffect, useRef } from "react";

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: "rect" | "circle" | "star";
}

interface ConfettiEffectProps {
  trigger: boolean;
  onComplete?: () => void;
}

const COLORS = [
  "#60a5fa",
  "#93c5fd",
  "#fbbf24",
  "#f9a8d4",
  "#86efac",
  "#c4b5fd",
  "#fb923c",
  "#34d399",
  "#a78bfa",
  "#f472b6",
];

function createStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
) {
  const spikes = 5;
  const outerRadius = size;
  const innerRadius = size / 2;
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / spikes - Math.PI / 2;
    if (i === 0)
      ctx.moveTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
    else ctx.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
  }
  ctx.closePath();
}

export default function ConfettiEffect({
  trigger,
  onComplete,
}: ConfettiEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const piecesRef = useRef<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Generate confetti pieces
    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < 150; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 5 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        opacity: 1,
        shape: (["rect", "circle", "star"] as const)[
          Math.floor(Math.random() * 3)
        ],
      });
    }
    piecesRef.current = pieces;

    let startTime = performance.now();
    const duration = 4000;

    function animate(now: number) {
      if (!ctx || !canvas) return;
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      for (const p of piecesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;
        if (elapsed > duration * 0.6) {
          p.opacity = Math.max(
            0,
            1 - (elapsed - duration * 0.6) / (duration * 0.4),
          );
        }

        if (p.y < canvas.height + 20) alive = true;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          createStar(ctx, 0, 0, p.size / 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (alive && elapsed < duration + 1000) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onComplete?.();
      }
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [trigger, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
    />
  );
}
