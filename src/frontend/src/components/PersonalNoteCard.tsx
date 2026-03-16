import { motion } from "motion/react";
import { useState } from "react";
import type { BirthdayProfile } from "../backend.d";

interface PersonalNoteCardProps {
  profile: BirthdayProfile;
}

export default function PersonalNoteCard({ profile }: PersonalNoteCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <section className="note-section-bg py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="text-center mb-10"
        >
          <div className="label-pill mb-4 mx-auto w-fit">
            💌 Personal Message
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black text-foreground mb-3 heading-accent">
            A Message From the Heart
          </h2>
          <p className="font-body text-foreground/55 mt-5">
            Click the envelope to reveal your special message
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 24 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            type: "spring",
            damping: 16,
            stiffness: 180,
            delay: 0.12,
          }}
          data-ocid="gift.card"
          className={`letter-flip-card mx-auto w-full max-w-xl ${flipped ? "flipped" : ""}`}
          onClick={() => setFlipped(!flipped)}
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setFlipped(!flipped)}
          aria-label={
            flipped ? "Click to close message" : "Click to open message"
          }
        >
          <div className="letter-flip-card-inner">
            {/* Front: Envelope */}
            <div className="letter-flip-card-front glass-card flex flex-col items-center justify-center shadow-birthday overflow-hidden">
              <div className="relative">
                <svg
                  width="200"
                  height="145"
                  viewBox="0 0 180 130"
                  fill="none"
                  aria-label="Envelope"
                  role="img"
                >
                  <rect
                    x="10"
                    y="30"
                    width="160"
                    height="95"
                    rx="10"
                    fill="#bfdbfe"
                  />
                  <rect
                    x="10"
                    y="30"
                    width="160"
                    height="95"
                    rx="10"
                    fill="url(#envGrad)"
                  />
                  <path d="M10 30 L90 85 L170 30 Z" fill="#93c5fd" />
                  <path
                    d="M10 125 L60 80"
                    stroke="#60a5fa"
                    strokeWidth="1.5"
                    opacity="0.5"
                  />
                  <path
                    d="M170 125 L120 80"
                    stroke="#60a5fa"
                    strokeWidth="1.5"
                    opacity="0.5"
                  />
                  <circle cx="90" cy="85" r="16" fill="#fbbf24" opacity="0.9" />
                  <text x="90" y="91" textAnchor="middle" fontSize="16">
                    💛
                  </text>
                  <defs>
                    <linearGradient
                      id="envGrad"
                      x1="10"
                      y1="30"
                      x2="170"
                      y2="125"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#93c5fd" stopOpacity="0.8" />
                      <stop offset="1" stopColor="#60a5fa" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                </svg>
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute -top-2 -right-2 text-2xl"
                >
                  ✉️
                </motion.div>
              </div>
              <p className="font-fun text-sm font-semibold text-sky-dark mt-3 animate-pulse">
                Tap to open ✨
              </p>
            </div>

            {/* Back: Personal note */}
            <div
              className="letter-flip-card-back flex flex-col items-center justify-center p-10 stars-bg"
              style={{
                background:
                  "linear-gradient(145deg, oklch(0.96 0.04 225 / 90%) 0%, oklch(0.98 0.02 250 / 85%) 50%, oklch(0.96 0.05 75 / 80%) 100%)",
                backdropFilter: "blur(20px) saturate(1.5)",
                WebkitBackdropFilter: "blur(20px) saturate(1.5)",
                border: "1px solid oklch(0.90 0.04 220 / 65%)",
              }}
            >
              <div className="relative text-center space-y-4 w-full max-w-md">
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={
                    flipped
                      ? { opacity: 1, y: 0, scale: 1 }
                      : { opacity: 0, y: 12, scale: 0.95 }
                  }
                  transition={{
                    type: "spring",
                    damping: 18,
                    stiffness: 200,
                    delay: flipped ? 0.38 : 0,
                  }}
                >
                  <motion.span
                    className="text-4xl block mb-4"
                    animate={flipped ? { scale: [0, 1.3, 1] } : {}}
                    transition={{
                      delay: 0.5,
                      duration: 0.4,
                      type: "spring",
                      bounce: 0.5,
                    }}
                  >
                    💙
                  </motion.span>
                  <p className="font-display text-lg md:text-xl font-bold text-sky-dark leading-relaxed italic whitespace-pre-wrap break-words">
                    &ldquo;{profile.personalNote}&rdquo;
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-5">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-sky/40" />
                    <p className="font-fun text-sm font-semibold text-foreground/50 tracking-wide">
                      {profile.senderName}
                    </p>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-sky/40" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
