import { useEffect, useState } from "react";

export function AnimatedPanda({ size = 200 }: { size?: number }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setScale((s) => (s === 1 ? 1.04 : 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "inline-block",
        animation: "bounce-idle 2s ease-in-out infinite",
        transition: "transform 0.5s ease",
        transform: `scale(${scale})`,
      }}
    >
      <img
        src="/assets/generated/panda-plushie-realistic.dim_400x400.png"
        alt="Realistic panda plushie"
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          borderRadius: "50%",
          boxShadow: "0 8px 32px oklch(0.52 0.17 260 / 20%)",
          filter: "drop-shadow(0 4px 16px oklch(0.62 0.16 280 / 30%))",
        }}
      />
    </div>
  );
}
