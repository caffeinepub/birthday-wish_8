import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { BirthdayProfile } from "../backend.d";

interface HeroSectionProps {
  profile: BirthdayProfile;
}

interface Candle {
  id: number;
  lit: boolean;
  color: string;
}

const CANDLE_COLORS = [
  "#fbbf24",
  "#f472b6",
  "#60a5fa",
  "#86efac",
  "#c4b5fd",
  "#fb923c",
];

function getDaysUntilBirthday(dateStr: string): number | null {
  if (!dateStr) return null;
  const today = new Date();
  const birthday = new Date(dateStr);
  birthday.setFullYear(today.getFullYear());
  if (birthday < today) birthday.setFullYear(today.getFullYear() + 1);
  const diff = birthday.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function isBirthdayToday(dateStr: string): boolean {
  if (!dateStr) return false;
  const today = new Date();
  const birthday = new Date(dateStr);
  return (
    birthday.getMonth() === today.getMonth() &&
    birthday.getDate() === today.getDate()
  );
}

// Stable stars array — created once outside component to avoid re-render jitter
const HERO_STARS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: (i * 4.7 + 3) % 97,
  y: (i * 3.3 + 5) % 62,
  size: 6 + (i % 5) * 2.4,
  delay: (i * 0.41) % 3,
  dur: 2.2 + (i % 4) * 0.55,
  char: i % 3 === 0 ? "✦" : i % 3 === 1 ? "✧" : "·",
}));

// Container variants for staggered children
const heroContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, damping: 18, stiffness: 220 },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: 40, skewY: 2 },
  visible: {
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: { type: "spring" as const, damping: 14, stiffness: 180 },
  },
};

export default function HeroSection({ profile }: HeroSectionProps) {
  const prefersReduced = useReducedMotion();
  const [candles, setCandles] = useState<Candle[]>(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      lit: true,
      color: CANDLE_COLORS[i],
    })),
  );
  const [allBlown, setAllBlown] = useState(false);

  const daysUntil = getDaysUntilBirthday(profile.birthdayDate);
  const isToday = isBirthdayToday(profile.birthdayDate);

  const blowCandle = (id: number) => {
    setCandles((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, lit: false } : c));
      if (updated.every((c) => !c.lit)) {
        setTimeout(() => setAllBlown(true), 400);
      }
      return updated;
    });
  };

  const relightAll = () => {
    setCandles(
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        lit: true,
        color: CANDLE_COLORS[i],
      })),
    );
    setAllBlown(false);
  };

  const litCount = candles.filter((c) => c.lit).length;

  return (
    <section
      data-ocid="hero.section"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 75% 60% at 12% 8%, oklch(0.80 0.14 220 / 50%) 0%, transparent 62%),
          radial-gradient(ellipse 55% 48% at 88% 6%, oklch(0.86 0.10 285 / 36%) 0%, transparent 58%),
          radial-gradient(ellipse 45% 35% at 5% 55%, oklch(0.90 0.07 215 / 28%) 0%, transparent 52%),
          radial-gradient(ellipse 65% 50% at 55% 98%, oklch(0.94 0.10 75 / 26%) 0%, transparent 62%),
          radial-gradient(ellipse 50% 38% at 95% 85%, oklch(0.90 0.08 345 / 20%) 0%, transparent 52%),
          oklch(0.965 0.022 215)
        `,
      }}
    >
      {/* Decorative stars — fixed positions, no layout thrash */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden
      >
        {HERO_STARS.map((s) => (
          <motion.div
            key={s.id}
            className="absolute select-none"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              fontSize: s.size,
              color:
                s.id % 4 === 0
                  ? "oklch(0.82 0.18 80 / 55%)"
                  : s.id % 4 === 1
                    ? "oklch(0.72 0.16 225 / 45%)"
                    : s.id % 4 === 2
                      ? "oklch(0.78 0.14 285 / 40%)"
                      : "oklch(0.82 0.12 340 / 35%)",
            }}
            animate={
              prefersReduced
                ? {}
                : {
                    opacity: [0.8, 0.15, 0.8],
                    scale: [1, 0.55, 1],
                  }
            }
            transition={{
              duration: s.dur,
              delay: s.delay,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            {s.char}
          </motion.div>
        ))}
      </div>

      {/* Soft inner vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, oklch(0.90 0.04 220 / 20%) 100%)",
        }}
        aria-hidden
      />

      {/* Main content — staggered container */}
      <motion.div
        variants={heroContainerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center gap-8 px-6 py-20 text-center max-w-4xl mx-auto"
      >
        {/* Label pill */}
        <motion.div variants={heroItemVariants}>
          <div className="label-pill">
            <motion.span
              animate={prefersReduced ? {} : { rotate: [-12, 12, -12] }}
              transition={{
                duration: 2.2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              🎉
            </motion.span>
            Special Birthday Wishes
            <motion.span
              animate={prefersReduced ? {} : { rotate: [12, -12, 12] }}
              transition={{
                duration: 2.2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              🎂
            </motion.span>
          </div>
        </motion.div>

        {/* Headings — independent spring reveal per line */}
        <div className="space-y-1 overflow-hidden">
          <motion.h1
            variants={headingVariants}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] shimmer-text"
          >
            Happy Birthday,
          </motion.h1>
          <motion.h1
            variants={headingVariants}
            transition={{
              type: "spring",
              damping: 14,
              stiffness: 180,
              delay: 0.08,
            }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] shimmer-text"
          >
            {profile.recipientName}!
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          variants={heroItemVariants}
          className="font-body text-xl md:text-2xl text-foreground/65 italic max-w-lg"
        >
          With all the love from{" "}
          <span className="font-semibold text-sky-dark not-italic">
            {profile.senderName}
          </span>{" "}
          <span className="not-italic">💙</span>
        </motion.p>

        {/* Countdown — glow ring treatment */}
        <motion.div
          data-ocid="hero.countdown_panel"
          variants={heroItemVariants}
          className="glass-card rounded-2xl px-8 py-4 countdown-pulse"
        >
          {isToday ? (
            <div className="flex items-center gap-3">
              <motion.span
                animate={prefersReduced ? {} : { scale: [1, 1.35, 1] }}
                transition={{ duration: 1.1, repeat: Number.POSITIVE_INFINITY }}
                className="text-3xl"
              >
                🎊
              </motion.span>
              <p className="font-fun text-xl font-bold text-sky-dark animate-glow-pulse">
                Today is Your Special Day!
              </p>
              <motion.span
                animate={prefersReduced ? {} : { scale: [1, 1.35, 1] }}
                transition={{
                  duration: 1.1,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: 0.55,
                }}
                className="text-3xl"
              >
                🎊
              </motion.span>
            </div>
          ) : daysUntil !== null ? (
            <div className="flex items-center gap-3">
              <span className="text-2xl">🗓️</span>
              <p className="font-body text-lg text-foreground/80">
                <motion.span
                  className="font-display font-black text-4xl text-primary inline-block"
                  animate={prefersReduced ? {} : { scale: [1, 1.08, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  {daysUntil}
                </motion.span>{" "}
                <span className="text-lg">
                  {daysUntil === 1 ? "day" : "days"} to go!
                </span>
              </p>
            </div>
          ) : null}
        </motion.div>

        {/* Birthday Cake — elastic spring entrance */}
        <motion.div
          data-ocid="hero.cake_canvas_target"
          variants={{
            hidden: { opacity: 0, scale: 0.75, y: 50 },
            visible: {
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                type: "spring",
                damping: 12,
                stiffness: 160,
                delay: 0.15,
              },
            },
          }}
          className="relative"
        >
          <BirthdayCake
            candles={candles}
            onBlowCandle={blowCandle}
            allBlown={allBlown}
            onRelight={relightAll}
            litCount={litCount}
          />
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          variants={heroItemVariants}
          className="flex flex-col items-center gap-1.5 text-foreground/35"
        >
          <div className="scroll-indicator text-lg">↓</div>
          <span className="text-xs font-body uppercase tracking-[0.18em]">
            Scroll to explore
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}

interface CakeProps {
  candles: Candle[];
  onBlowCandle: (id: number) => void;
  allBlown: boolean;
  onRelight: () => void;
  litCount: number;
}

function BirthdayCake({
  candles,
  onBlowCandle,
  allBlown,
  onRelight,
  litCount,
}: CakeProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Candle row */}
      <div className="flex items-end gap-3 mb-1">
        {candles.map((candle) => (
          <motion.button
            key={candle.id}
            onClick={() => candle.lit && onBlowCandle(candle.id)}
            className="flex flex-col items-center cursor-pointer relative"
            whileHover={candle.lit ? { scale: 1.1 } : {}}
            whileTap={candle.lit ? { scale: 0.9 } : {}}
            title={candle.lit ? "Click to blow out!" : "Blown out"}
          >
            {/* Flame */}
            {candle.lit && (
              <motion.div
                className="w-3 h-5 rounded-full mb-0.5"
                style={{
                  background:
                    "radial-gradient(ellipse, #fff700 0%, #ff8c00 50%, transparent 100%)",
                }}
                animate={{
                  scaleY: [1, 1.2, 0.9, 1.1, 1],
                  scaleX: [1, 0.8, 1, 0.9, 1],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            )}
            {!candle.lit && (
              <div className="w-2 h-2 rounded-full bg-foreground/20 mb-1" />
            )}
            {/* Candle stick */}
            <div
              className="w-4 rounded-sm"
              style={{
                height: 40 + (candle.id % 3) * 8,
                background: candle.lit
                  ? `linear-gradient(135deg, ${candle.color}ff, ${candle.color}99)`
                  : `linear-gradient(135deg, ${candle.color}88, ${candle.color}44)`,
              }}
            />
          </motion.button>
        ))}
      </div>

      {/* Cake SVG */}
      <svg
        width="260"
        height="160"
        viewBox="0 0 260 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Birthday cake"
        role="img"
      >
        {/* Bottom tier */}
        <rect x="20" y="85" width="220" height="65" rx="12" fill="#93c5fd" />
        <rect
          x="20"
          y="85"
          width="220"
          height="65"
          rx="12"
          fill="url(#cakeGrad1)"
        />
        {/* Frosting drips bottom */}
        {[35, 65, 95, 125, 155, 185, 215].map((x) => (
          <ellipse
            key={x}
            cx={x}
            cy="88"
            rx="10"
            ry="8"
            fill="white"
            opacity="0.85"
          />
        ))}
        {/* Middle tier */}
        <rect x="45" y="50" width="170" height="45" rx="10" fill="#bfdbfe" />
        <rect
          x="45"
          y="50"
          width="170"
          height="45"
          rx="10"
          fill="url(#cakeGrad2)"
        />
        {/* Frosting drips middle */}
        {[60, 90, 120, 150, 180].map((x) => (
          <ellipse
            key={x}
            cx={x}
            cy="53"
            rx="9"
            ry="7"
            fill="white"
            opacity="0.85"
          />
        ))}
        {/* Decorations */}
        <circle cx="80" cy="105" r="6" fill="#f9a8d4" opacity="0.9" />
        <circle cx="130" cy="112" r="5" fill="#86efac" opacity="0.9" />
        <circle cx="180" cy="105" r="6" fill="#fbbf24" opacity="0.9" />
        <circle cx="105" cy="100" r="4" fill="#c4b5fd" opacity="0.9" />
        <circle cx="155" cy="100" r="4" fill="#fb923c" opacity="0.9" />
        {/* Stars on cake */}
        <text x="60" y="80" fontSize="14" textAnchor="middle" opacity="0.7">
          ⭐
        </text>
        <text x="130" y="76" fontSize="16" textAnchor="middle" opacity="0.7">
          🌟
        </text>
        <text x="200" y="80" fontSize="14" textAnchor="middle" opacity="0.7">
          ⭐
        </text>
        {/* Plate */}
        <ellipse
          cx="130"
          cy="152"
          rx="120"
          ry="10"
          fill="#dbeafe"
          opacity="0.6"
        />
        <defs>
          <linearGradient
            id="cakeGrad1"
            x1="20"
            y1="85"
            x2="240"
            y2="150"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#60a5fa" />
            <stop offset="1" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient
            id="cakeGrad2"
            x1="45"
            y1="50"
            x2="215"
            y2="95"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#93c5fd" />
            <stop offset="1" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
      </svg>

      {/* Status */}
      <div className="text-center">
        {allBlown ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <p className="font-fun text-lg font-bold text-gold">
              🎉 Make a wish! All candles blown!
            </p>
            <button
              type="button"
              onClick={onRelight}
              className="text-sm text-sky-dark/60 underline hover:text-sky-dark transition-colors"
            >
              Re-light candles
            </button>
          </motion.div>
        ) : (
          <p className="font-body text-sm text-foreground/50">
            Click each candle to blow it out! ({litCount} remaining)
          </p>
        )}
      </div>
    </div>
  );
}
