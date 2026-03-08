import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Wish } from "../backend.d";
import { useAddWish } from "../hooks/useQueries";

interface WishingWellProps {
  wishes: Wish[];
}

interface FloatingBubble {
  id: number;
  text: string;
  x: number;
}

export default function WishingWell({ wishes }: WishingWellProps) {
  const [visitorName, setVisitorName] = useState("");
  const [wishText, setWishText] = useState("");
  const [bubbles, setBubbles] = useState<FloatingBubble[]>([]);
  const [bubbleId, setBubbleId] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const addWishMutation = useAddWish();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !wishText.trim()) return;

    // Add floating bubble
    const newBubble = {
      id: bubbleId,
      text: wishText,
      x: 20 + Math.random() * 60,
    };
    setBubbles((prev) => [...prev, newBubble]);
    setBubbleId((n) => n + 1);

    // Remove bubble after animation
    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== newBubble.id));
    }, 2000);

    try {
      await addWishMutation.mutateAsync({
        visitorName: visitorName.trim(),
        wishText: wishText.trim(),
      });
    } catch {
      // ignore backend errors
    }

    setSubmitted(true);
    setVisitorName("");
    setWishText("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Wishing Well illustration + form */}
        <div className="flex flex-col gap-6">
          {/* Well SVG */}
          <div className="flex justify-center relative">
            <div className="relative w-48 h-40">
              <WellSVG />
              {/* Floating bubbles */}
              <AnimatePresence>
                {bubbles.map((bubble) => (
                  <motion.div
                    key={bubble.id}
                    className="absolute pointer-events-none"
                    style={{ left: `${bubble.x}%`, bottom: "60%" }}
                    initial={{ y: 0, opacity: 1, scale: 1 }}
                    animate={{ y: -120, opacity: 0, scale: 0.6 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  >
                    <div className="glass-card rounded-full px-3 py-1 text-xs font-fun font-semibold text-sky-dark whitespace-nowrap max-w-24 truncate shadow-soft">
                      💙 {bubble.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="glass-card rounded-2xl p-6 shadow-soft space-y-4"
          >
            <h3 className="font-display text-xl font-bold text-sky-dark">
              Drop Your Wish ✨
            </h3>

            <div className="space-y-2">
              <label
                className="font-body text-sm font-semibold text-foreground/70"
                htmlFor="visitor-name"
              >
                Your Name
              </label>
              <Input
                id="visitor-name"
                data-ocid="wishing_well.input"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="Enter your name..."
                className="rounded-xl border-border/60 focus:ring-primary"
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <label
                className="font-body text-sm font-semibold text-foreground/70"
                htmlFor="wish-text"
              >
                Your Birthday Wish
              </label>
              <Textarea
                id="wish-text"
                data-ocid="wishing_well.textarea"
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                placeholder="Write your birthday wish here..."
                className="rounded-xl border-border/60 focus:ring-primary resize-none"
                rows={3}
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground text-right">
                {wishText.length}/200
              </p>
            </div>

            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-mint/20 border border-mint/40 rounded-xl px-4 py-2 text-center"
                >
                  <p className="font-fun text-sm font-semibold text-foreground/70">
                    🎉 Your wish has been cast! ✨
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              data-ocid="wishing_well.submit_button"
              type="submit"
              disabled={
                !visitorName.trim() ||
                !wishText.trim() ||
                addWishMutation.isPending
              }
              className="w-full rounded-xl font-fun font-bold text-sm bg-primary hover:bg-sky-dark transition-colors"
            >
              {addWishMutation.isPending ? (
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
                  Casting wish...
                </span>
              ) : (
                "🌟 Cast Your Wish!"
              )}
            </Button>
          </form>
        </div>

        {/* Wish Wall */}
        <WishWall wishes={wishes} />
      </div>
    </div>
  );
}

function WishWall({ wishes }: { wishes: Wish[] }) {
  const formatTime = (timestamp: bigint) => {
    try {
      const ms = Number(timestamp) / 1_000_000;
      const date = new Date(ms);
      const now = Date.now();
      const diff = now - date.getTime();
      if (diff < 60000) return "just now";
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
      return date.toLocaleDateString();
    } catch {
      return "recently";
    }
  };

  const sampleWishes: Wish[] = [
    {
      visitorName: "Sarah M.",
      wishText:
        "Wishing you a day filled with sunshine, laughter, and endless joy! 🌟",
      timestamp: BigInt(Date.now() - 300000) * BigInt(1_000_000),
    },
    {
      visitorName: "James K.",
      wishText:
        "May this birthday bring you everything your heart desires! Happy Birthday! 🎂",
      timestamp: BigInt(Date.now() - 900000) * BigInt(1_000_000),
    },
    {
      visitorName: "Emma L.",
      wishText:
        "Sending you the biggest birthday hugs and wishes! You deserve the world! 💙",
      timestamp: BigInt(Date.now() - 1800000) * BigInt(1_000_000),
    },
  ];

  const displayWishes = wishes.length > 0 ? wishes : sampleWishes;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h3 className="font-display text-xl font-bold text-sky-dark">
          Wish Wall 🌈
        </h3>
        <span className="font-fun text-xs font-semibold bg-primary/20 text-primary px-2 py-0.5 rounded-full">
          {displayWishes.length} wishes
        </span>
      </div>

      {displayWishes.length === 0 ? (
        <div
          data-ocid="wish_wall.empty_state"
          className="glass-card rounded-2xl p-8 text-center"
        >
          <p className="text-4xl mb-2">🌊</p>
          <p className="font-body text-foreground/50">
            No wishes yet. Be the first!
          </p>
        </div>
      ) : (
        <div
          data-ocid="wish_wall.list"
          className="space-y-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin"
        >
          {displayWishes.map((wish, i) => (
            <motion.div
              key={`${wish.visitorName}-${String(wish.timestamp)}-${i}`}
              data-ocid={
                `wish_wall.item.${i + 1}` as `wish_wall.item.${number}`
              }
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="glass-card wish-card rounded-xl p-4 shadow-soft cursor-default"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-fun font-bold text-sm shrink-0"
                  style={{
                    background: `hsl(${(wish.visitorName.charCodeAt(0) * 30) % 360}, 60%, 65%)`,
                  }}
                >
                  {wish.visitorName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-fun text-sm font-bold text-foreground truncate">
                      {wish.visitorName}
                    </span>
                    <span className="font-body text-xs text-muted-foreground shrink-0">
                      {formatTime(wish.timestamp)}
                    </span>
                  </div>
                  <p className="font-body text-sm text-foreground/80 leading-relaxed line-clamp-3">
                    {wish.wishText}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function WellSVG() {
  return (
    <svg
      width="192"
      height="160"
      viewBox="0 0 192 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Wishing well"
      role="img"
    >
      {/* Well base */}
      <ellipse cx="96" cy="115" rx="65" ry="18" fill="#93c5fd" opacity="0.6" />
      {/* Well sides */}
      <path
        d="M31 80 L31 115 Q31 133 96 133 Q161 133 161 115 L161 80Z"
        fill="#bfdbfe"
      />
      <path
        d="M31 80 L31 115 Q31 133 96 133 Q161 133 161 115 L161 80Z"
        fill="url(#wellGrad)"
      />
      {/* Well rim */}
      <ellipse cx="96" cy="80" rx="65" ry="18" fill="#93c5fd" />
      {/* Inner water effect */}
      <ellipse cx="96" cy="80" rx="52" ry="12" fill="#60a5fa" opacity="0.7" />
      <ellipse cx="96" cy="80" rx="40" ry="8" fill="#3b82f6" opacity="0.5" />
      {/* Water shimmer */}
      <path
        d="M68 78 Q80 74, 92 78 Q104 82, 116 78"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Stone texture */}
      {([40, 55, 70, 85, 100, 115, 130, 145] as const).map((x, i) => (
        <rect
          key={x}
          x={x}
          y={88 + (i % 2) * 8}
          width={10}
          height={7}
          rx={2}
          fill="#93c5fd"
          opacity="0.5"
        />
      ))}
      {/* Roof poles */}
      <rect x="30" y="20" width="8" height="65" rx="3" fill="#fbbf24" />
      <rect x="154" y="20" width="8" height="65" rx="3" fill="#fbbf24" />
      {/* Roof */}
      <path d="M18 28 L96 5 L174 28Z" fill="#fbbf24" />
      <path d="M18 28 L96 5 L174 28Z" fill="url(#roofGrad)" opacity="0.4" />
      {/* Rope */}
      <line
        x1="96"
        y1="28"
        x2="96"
        y2="72"
        stroke="#92400e"
        strokeWidth="2"
        strokeDasharray="4,3"
      />
      {/* Bucket */}
      <rect x="84" y="70" width="24" height="18" rx="3" fill="#60a5fa" />
      <path
        d="M84 70 Q96 65 108 70"
        stroke="#93c5fd"
        strokeWidth="2"
        fill="none"
      />
      <defs>
        <linearGradient
          id="wellGrad"
          x1="31"
          y1="80"
          x2="161"
          y2="133"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#bfdbfe" />
          <stop offset="1" stopColor="#93c5fd" />
        </linearGradient>
        <linearGradient
          id="roofGrad"
          x1="18"
          y1="5"
          x2="174"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );
}
