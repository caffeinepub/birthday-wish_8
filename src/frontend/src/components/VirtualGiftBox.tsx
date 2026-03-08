import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { BirthdayProfile } from "../backend.d";

interface VirtualGiftBoxProps {
  profile: BirthdayProfile;
}

export default function VirtualGiftBox({ profile }: VirtualGiftBoxProps) {
  const [opened, setOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening || opened) return;
    setIsOpening(true);
    setTimeout(() => {
      setOpened(true);
      setIsOpening(false);
    }, 1200);
  };

  const handleRewrap = () => {
    setOpened(false);
    setIsOpening(false);
  };

  // Color-safe fallback
  const boxColor = profile.giftBoxColor || "#60a5fa";
  const ribbonColor = profile.ribbonColor || "#fbbf24";

  // Sparkle positions
  const sparkles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.cos((i / 12) * Math.PI * 2) * 80 + 50,
    y: Math.sin((i / 12) * Math.PI * 2) * 80 + 50,
    delay: i * 0.06,
    size: 12 + (i % 3) * 8,
  }));

  return (
    <section className="gift-section-bg py-20 px-6 relative">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="mb-12"
        >
          <div className="label-pill mb-4 mx-auto w-fit">🎁 Virtual Gift</div>
          <h2 className="font-display text-4xl md:text-5xl font-black text-foreground mb-3 heading-accent">
            Unwrap Your Surprise
          </h2>
          <p className="font-body text-foreground/55 mt-5">
            {opened
              ? "✨ Surprise!"
              : "Click the gift box to unwrap your special surprise!"}
          </p>
        </motion.div>

        <div
          data-ocid="gift.card"
          className="relative flex flex-col items-center gap-6"
        >
          <AnimatePresence mode="wait">
            {!opened ? (
              <motion.div
                key="gift-wrapped"
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  isOpening
                    ? {
                        rotate: [-5, 5, -3, 3, 0],
                        y: [0, -12, 0],
                        opacity: 1,
                        scale: 1,
                      }
                    : { opacity: 1, scale: 1, rotate: 0, y: 0 }
                }
                transition={
                  isOpening
                    ? { duration: 0.65, repeat: 1, ease: "easeInOut" }
                    : { type: "spring", damping: 13, stiffness: 180 }
                }
              >
                {/* Ambient glow ring behind the box */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse 80% 60% at 50% 70%, ${boxColor}30 0%, transparent 70%)`,
                    filter: "blur(18px)",
                    transform: "scale(1.3)",
                  }}
                  aria-hidden
                />
                {/* Gift box */}
                <motion.button
                  type="button"
                  data-ocid="gift.open_modal_button"
                  whileHover={{ scale: 1.07, y: -6 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={handleOpen}
                  className="cursor-pointer relative w-48 h-44 mx-auto block"
                  aria-label="Open gift box"
                  style={{
                    filter: isOpening
                      ? "none"
                      : "drop-shadow(0 8px 24px rgba(0,0,0,0.12))",
                  }}
                >
                  <GiftBoxSVG
                    boxColor={boxColor}
                    ribbonColor={ribbonColor}
                    bowStyle={profile.bowStyle}
                    isOpening={isOpening}
                  />
                </motion.button>

                {isOpening && (
                  <div className="absolute inset-0 pointer-events-none">
                    {sparkles.slice(0, 6).map((s) => (
                      <motion.div
                        key={s.id}
                        className="absolute text-gold font-bold"
                        style={{
                          left: `${40 + s.x * 0.2}%`,
                          top: `${40 + s.y * 0.2}%`,
                          fontSize: s.size,
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: [0, 1.5, 0],
                          opacity: [0, 1, 0],
                          y: -40,
                        }}
                        transition={{ delay: s.delay, duration: 0.8 }}
                      >
                        ✨
                      </motion.div>
                    ))}
                  </div>
                )}

                <motion.p
                  className="font-fun text-sm font-semibold text-sky-dark mt-4"
                  animate={isOpening ? {} : { y: [0, -4, 0] }}
                  transition={{
                    duration: 1.6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  {isOpening ? "✨ Opening..." : "Tap to unwrap! 🎁"}
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="gift-opened"
                initial={{ opacity: 0, scale: 0.6, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 11, stiffness: 160 }}
                className="flex flex-col items-center gap-6"
              >
                {/* Sparkle burst */}
                <div className="relative w-64 h-64 flex items-center justify-center">
                  {sparkles.map((s) => (
                    <motion.div
                      key={s.id}
                      className="absolute text-gold"
                      style={{ fontSize: s.size }}
                      initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                      animate={{
                        x: Math.cos((s.id / 12) * Math.PI * 2) * 90,
                        y: Math.sin((s.id / 12) * Math.PI * 2) * 90,
                        scale: [0, 1.2, 1],
                        opacity: [0, 1, 0.7],
                      }}
                      transition={{
                        delay: s.delay,
                        duration: 0.8,
                        type: "spring",
                      }}
                    >
                      {s.id % 3 === 0 ? "✨" : s.id % 3 === 1 ? "⭐" : "🌟"}
                    </motion.div>
                  ))}

                  {/* Open box */}
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
                  >
                    <OpenGiftSVG
                      boxColor={boxColor}
                      ribbonColor={ribbonColor}
                    />
                  </motion.div>
                </div>

                {/* Surprise message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="glass-card rounded-2xl px-8 py-6 max-w-md shadow-birthday text-center"
                >
                  <span className="text-4xl block mb-3">🎊</span>
                  <p className="font-display text-xl md:text-2xl font-bold text-sky-dark italic">
                    "{profile.surpriseMessage}"
                  </p>
                </motion.div>

                {/* Re-wrap button */}
                <motion.button
                  data-ocid="gift.rewrap_button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  onClick={handleRewrap}
                  className="font-body text-sm text-sky-dark/60 underline hover:text-sky-dark transition-colors"
                >
                  🎁 Re-wrap gift
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function GiftBoxSVG({
  boxColor,
  ribbonColor,
  bowStyle,
  isOpening,
}: {
  boxColor: string;
  ribbonColor: string;
  bowStyle: string;
  isOpening: boolean;
}) {
  return (
    <svg
      width="192"
      height="176"
      viewBox="0 0 192 176"
      fill="none"
      aria-label="Gift box"
      role="img"
    >
      {/* Shadow */}
      <ellipse cx="96" cy="170" rx="70" ry="8" fill="#000" opacity="0.1" />
      {/* Box body */}
      <rect x="16" y="80" width="160" height="88" rx="10" fill={boxColor} />
      <rect
        x="16"
        y="80"
        width="160"
        height="88"
        rx="10"
        fill="url(#boxShadow)"
        opacity="0.3"
      />
      {/* Box lid */}
      <motion.rect
        x="8"
        y="56"
        width="176"
        height="32"
        rx="8"
        fill={boxColor}
        animate={isOpening ? { y: -30, rotate: -15, opacity: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{ transformOrigin: "50% 50%" }}
      />
      {/* Vertical ribbon */}
      <rect
        x="88"
        y="80"
        width="16"
        height="88"
        fill={ribbonColor}
        opacity="0.9"
      />
      <rect
        x="88"
        y="56"
        width="16"
        height="32"
        fill={ribbonColor}
        opacity="0.9"
      />
      {/* Horizontal ribbon */}
      <rect
        x="16"
        y="108"
        width="160"
        height="14"
        fill={ribbonColor}
        opacity="0.7"
      />
      {/* Bow */}
      {bowStyle === "classic" && (
        <>
          <path
            d="M96 56 C80 40, 56 44, 68 56 C76 64, 88 58, 96 56Z"
            fill={ribbonColor}
          />
          <path
            d="M96 56 C112 40, 136 44, 124 56 C116 64, 104 58, 96 56Z"
            fill={ribbonColor}
          />
          <circle cx="96" cy="56" r="8" fill={ribbonColor} />
        </>
      )}
      {bowStyle === "modern" && (
        <>
          <ellipse
            cx="78"
            cy="48"
            rx="18"
            ry="10"
            fill={ribbonColor}
            transform="rotate(-30 78 48)"
          />
          <ellipse
            cx="114"
            cy="48"
            rx="18"
            ry="10"
            fill={ribbonColor}
            transform="rotate(30 114 48)"
          />
          <circle cx="96" cy="54" r="10" fill={ribbonColor} />
        </>
      )}
      {bowStyle === "fancy" && (
        <>
          <path d="M96 56 Q75 30, 58 40 Q70 52, 88 54Z" fill={ribbonColor} />
          <path
            d="M96 56 Q117 30, 134 40 Q122 52, 104 54Z"
            fill={ribbonColor}
          />
          <path
            d="M96 54 Q80 50, 72 60 Q84 62, 96 58Z"
            fill={ribbonColor}
            opacity="0.7"
          />
          <path
            d="M96 54 Q112 50, 120 60 Q108 62, 96 58Z"
            fill={ribbonColor}
            opacity="0.7"
          />
          <circle cx="96" cy="56" r="7" fill={ribbonColor} />
        </>
      )}
      {/* Polka dots decoration */}
      <circle cx="40" cy="110" r="5" fill="white" opacity="0.3" />
      <circle cx="60" cy="140" r="4" fill="white" opacity="0.25" />
      <circle cx="140" cy="115" r="5" fill="white" opacity="0.3" />
      <circle cx="155" cy="145" r="4" fill="white" opacity="0.25" />
      <defs>
        <linearGradient
          id="boxShadow"
          x1="16"
          y1="80"
          x2="176"
          y2="168"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function OpenGiftSVG({
  boxColor,
  ribbonColor,
}: { boxColor: string; ribbonColor: string }) {
  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 160 160"
      fill="none"
      aria-label="Opened gift box"
      role="img"
    >
      {/* Box bottom */}
      <rect
        x="20"
        y="90"
        width="120"
        height="65"
        rx="8"
        fill={boxColor}
        opacity="0.9"
      />
      <rect
        x="80"
        y="90"
        width="12"
        height="65"
        fill={ribbonColor}
        opacity="0.8"
      />
      <rect
        x="20"
        y="115"
        width="120"
        height="10"
        fill={ribbonColor}
        opacity="0.6"
      />
      {/* Lid flying off */}
      <rect
        x="14"
        y="50"
        width="132"
        height="28"
        rx="8"
        fill={boxColor}
        opacity="0.7"
        transform="rotate(-20 80 64)"
      />
      {/* Gift shine */}
      <circle cx="80" cy="78" r="20" fill="white" opacity="0.12" />
      {/* Stars inside */}
      <text x="80" y="85" textAnchor="middle" fontSize="24">
        🎉
      </text>
    </svg>
  );
}
