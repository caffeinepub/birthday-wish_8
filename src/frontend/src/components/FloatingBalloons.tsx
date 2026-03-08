import { useEffect, useRef } from "react";

interface Balloon {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  drift: number;
  phase: number;
}

const BALLOON_COLORS = [
  "#60a5fa",
  "#93c5fd",
  "#fbbf24",
  "#f9a8d4",
  "#86efac",
  "#c4b5fd",
  "#fb923c",
  "#34d399",
  "#f472b6",
  "#38bdf8",
];

export default function FloatingBalloons() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const balloonsRef = useRef<Balloon[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Generate balloons
    const balloons: Balloon[] = [];
    for (let i = 0; i < 12; i++) {
      balloons.push({
        id: i,
        x: Math.random() * (canvas.width - 60) + 30,
        y: canvas.height + 100 + Math.random() * canvas.height,
        size: 28 + Math.random() * 22,
        color: BALLOON_COLORS[i % BALLOON_COLORS.length],
        speed: 0.3 + Math.random() * 0.5,
        drift: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2,
      });
    }
    balloonsRef.current = balloons;

    function drawBalloon(ctx: CanvasRenderingContext2D, b: Balloon) {
      const { x, y, size, color } = b;
      // Balloon body
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(x, y, size * 0.7, size, 0, 0, Math.PI * 2);

      const grad = ctx.createRadialGradient(
        x - size * 0.2,
        y - size * 0.3,
        size * 0.1,
        x,
        y,
        size,
      );
      grad.addColorStop(0, `${color}ff`);
      grad.addColorStop(0.5, `${color}dd`);
      grad.addColorStop(1, `${color}88`);
      ctx.fillStyle = grad;
      ctx.fill();

      // Highlight
      ctx.beginPath();
      ctx.ellipse(
        x - size * 0.2,
        y - size * 0.35,
        size * 0.2,
        size * 0.25,
        -0.3,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fill();

      // Knot
      ctx.beginPath();
      ctx.arc(x, y + size + 2, 3, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // String
      ctx.beginPath();
      ctx.moveTo(x, y + size + 5);
      const stringLen = 50;
      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        const sx = x + Math.sin(t * Math.PI * 2 + b.phase) * 6;
        const sy = y + size + 5 + t * stringLen;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = `${color}88`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }

    function animate(time: number) {
      if (!ctx || !canvas) return;
      timeRef.current = time;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const b of balloonsRef.current) {
        b.y -= b.speed;
        b.x += Math.sin(time * 0.001 + b.phase) * b.drift;
        b.phase += 0.008;

        // Reset when off top
        if (b.y < -b.size * 2 - 60) {
          b.y = canvas.height + 100 + Math.random() * 200;
          b.x = Math.random() * (canvas.width - 60) + 30;
        }

        // Clip to canvas edges
        b.x = Math.max(b.size, Math.min(canvas.width - b.size, b.x));

        drawBalloon(ctx, b);
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, opacity: 0.55 }}
    />
  );
}
