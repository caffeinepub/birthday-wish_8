import type { BirthdayProfile } from "../backend.d";

interface Props {
  config: BirthdayProfile;
}

export function HeroSection({ config }: Props) {
  const sparkles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    top: `${10 + ((i * 7) % 80)}%`,
    left: `${5 + ((i * 11) % 90)}%`,
    delay: `${(i * 0.4) % 2.5}s`,
    size: 16 + (i % 3) * 8,
  }));

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full text-center px-4 overflow-hidden">
      {/* Sparkles */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute pointer-events-none select-none"
          style={{
            top: s.top,
            left: s.left,
            fontSize: s.size,
            animation: `sparkle 2s ease-in-out ${s.delay} infinite`,
          }}
        >
          ✨
        </div>
      ))}

      {/* Glow backdrop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.12 230 / 25%) 0%, transparent 70%)",
            animation: "pulse-glow 3s ease-in-out infinite",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div
          className="text-6xl mb-2"
          style={{ animation: "float 3s ease-in-out infinite" }}
        >
          🎂
        </div>

        <h1
          className="text-5xl md:text-7xl font-heading"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.52 0.17 235), oklch(0.62 0.20 280), oklch(0.72 0.18 230))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
            filter: "drop-shadow(0 4px 16px oklch(0.62 0.16 230 / 40%))",
          }}
        >
          Happy Birthday!
        </h1>

        <h2
          className="text-3xl md:text-5xl font-heading"
          style={{
            color: "oklch(0.42 0.15 280)",
            textShadow: "0 2px 12px oklch(0.72 0.12 280 / 50%)",
          }}
        >
          {config.recipientName} 🎉
        </h2>

        <p
          className="text-lg md:text-xl max-w-lg text-center font-body"
          style={{ color: "oklch(0.40 0.08 240)" }}
        >
          {config.personalNote}
        </p>

        {/* Sender name - prominent display */}
        <div
          className="mt-2 px-6 py-3 rounded-2xl font-heading text-xl md:text-2xl"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.92 0.06 260 / 80%), oklch(0.90 0.08 230 / 80%))",
            color: "oklch(0.38 0.15 280)",
            boxShadow: "0 4px 16px oklch(0.62 0.16 260 / 20%)",
            backdropFilter: "blur(8px)",
            border: "1.5px solid oklch(0.82 0.08 240 / 50%)",
          }}
        >
          💝 A birthday wish from <strong>{config.senderName}</strong>
        </div>

        <div
          className="mt-4 text-4xl"
          style={{ animation: "bounce-idle 1.5s ease-in-out infinite" }}
        >
          🎈🎈🎈
        </div>

        <div
          className="mt-8 text-sm font-body animate-bounce"
          style={{ color: "oklch(0.55 0.10 230)" }}
        >
          ↓ Scroll down for surprises! ↓
        </div>
      </div>
    </div>
  );
}
