import { useEffect, useState } from "react";

const COLORS = [
  "#ff6b9d",
  "#c77dff",
  "#4cc9f0",
  "#ffd166",
  "#06d6a0",
  "#ff9f1c",
  "#e63946",
];
const SHAPES = ["■", "●", "▲", "★"];

interface Piece {
  id: number;
  color: string;
  shape: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

export function ConfettiEffect({ onDone }: { onDone?: () => void }) {
  const [pieces] = useState<Piece[]>(() =>
    Array.from({ length: 70 }, (_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      shape: SHAPES[i % SHAPES.length],
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2.5 + Math.random() * 2,
      size: 10 + Math.random() * 14,
    })),
  );
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 4000);
    return () => clearTimeout(t);
  }, [onDone]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            top: "-20px",
            left: `${p.left}%`,
            color: p.color,
            fontSize: `${p.size}px`,
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s both`,
          }}
        >
          {p.shape}
        </div>
      ))}
    </div>
  );
}
