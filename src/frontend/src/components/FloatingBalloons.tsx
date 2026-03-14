import { useMemo } from "react";

const COLORS = [
  "#ff6b9d",
  "#c77dff",
  "#4cc9f0",
  "#ffd166",
  "#ef476f",
  "#06d6a0",
  "#118ab2",
  "#ff9f1c",
  "#e63946",
  "#7209b7",
];

function Balloon({
  color,
  left,
  size,
  duration,
  delay,
}: {
  color: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${left}%`,
        bottom: "-20px",
        animation: `balloon-rise ${duration}s linear ${delay}s infinite`,
        pointerEvents: "none",
      }}
    >
      <svg
        role="img"
        aria-label="Balloon"
        width={size}
        height={size * 1.3}
        viewBox="0 0 60 80"
        fill="none"
      >
        <ellipse cx="30" cy="30" rx="26" ry="28" fill={color} opacity="0.85" />
        <ellipse cx="22" cy="18" rx="8" ry="6" fill="white" opacity="0.3" />
        <path
          d="M30 58 Q32 64 30 70 Q28 76 30 80"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="30" cy="59" r="2.5" fill={color} />
      </svg>
    </div>
  );
}

export function FloatingBalloons() {
  const balloons = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        color: COLORS[i % COLORS.length],
        left: (i * 11 + 3) % 95,
        size: 40 + (i % 3) * 15,
        duration: 8 + (i % 5) * 2,
        delay: i * 1.2,
      })),
    [],
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {balloons.map((b) => (
        <Balloon key={b.id} {...b} />
      ))}
    </div>
  );
}
