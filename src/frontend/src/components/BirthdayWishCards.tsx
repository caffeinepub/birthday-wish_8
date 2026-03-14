import { useState } from "react";
import { useAudio } from "../hooks/useAudio";

const WISH_CARDS = [
  {
    id: 1,
    emoji: "🎂",
    label: "Make a Wish",
    message: "May all your birthday wishes come true today and every day!",
    color: "from-sky-200 to-blue-100",
  },
  {
    id: 2,
    emoji: "💖",
    label: "You're Loved",
    message: "You are cherished more than you know. Happy Birthday!",
    color: "from-pink-200 to-rose-100",
  },
  {
    id: 3,
    emoji: "🌟",
    label: "Shine Bright",
    message: "Today is YOUR day — shine as bright as the stars!",
    color: "from-yellow-200 to-amber-100",
  },
  {
    id: 4,
    emoji: "🎉",
    label: "Celebrate!",
    message: "Life is a gift, and so are you. Celebrate every moment!",
    color: "from-purple-200 to-violet-100",
  },
  {
    id: 5,
    emoji: "🌈",
    label: "Joy & Laughter",
    message: "Wishing you endless joy, laughter, and magical memories!",
    color: "from-teal-200 to-cyan-100",
  },
  {
    id: 6,
    emoji: "🦋",
    label: "New Chapter",
    message: "Every birthday begins a beautiful new chapter. Embrace it!",
    color: "from-indigo-200 to-sky-100",
  },
];

export interface CustomCard {
  label: string;
  message: string;
}

interface WishCardData {
  id: number;
  emoji: string;
  label: string;
  message: string;
  color: string;
}

function WishCard({ card, index }: { card: WishCardData; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const { playSound } = useAudio();

  const handleFlip = () => {
    setFlipped((f) => !f);
    playSound("flip");
  };

  return (
    <button
      type="button"
      data-ocid={`wishes.item.${index + 1}`}
      onClick={handleFlip}
      aria-label={`Birthday wish card: ${card.label}`}
      style={{
        perspective: "800px",
        cursor: "pointer",
        background: "none",
        border: "none",
        padding: 0,
        display: "block",
        width: "100%",
        textAlign: "left",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "120%",
          transformStyle: "preserve-3d",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front face */}
        <div
          className={`bg-gradient-to-br ${card.color}`}
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: "1.25rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            padding: "1.5rem",
            boxShadow:
              "0 4px 24px oklch(0.55 0.12 230 / 15%), 0 1px 4px oklch(0.55 0.12 230 / 10%)",
            border: "2px solid oklch(0.88 0.06 230 / 60%)",
          }}
        >
          <span style={{ fontSize: "3rem", lineHeight: 1 }}>{card.emoji}</span>
          <p
            style={{
              color: "oklch(0.32 0.12 260)",
              fontWeight: 700,
              fontSize: "1.1rem",
              textAlign: "center",
              fontFamily: "var(--font-heading)",
              margin: 0,
            }}
          >
            {card.label}
          </p>
          <p
            style={{
              fontSize: "0.72rem",
              color: "oklch(0.55 0.08 240)",
              letterSpacing: "0.05em",
              margin: 0,
            }}
          >
            tap to reveal ✨
          </p>
        </div>

        {/* Back face */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "1.25rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            background:
              "linear-gradient(135deg, oklch(0.40 0.18 260), oklch(0.50 0.20 280))",
            boxShadow: "0 8px 32px oklch(0.42 0.18 260 / 30%)",
            border: "2px solid oklch(0.65 0.15 270 / 40%)",
          }}
        >
          <span style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>💌</span>
          <p
            style={{
              color: "oklch(0.97 0.02 220)",
              fontSize: "0.95rem",
              textAlign: "center",
              lineHeight: 1.6,
              fontFamily: "var(--font-body)",
              margin: 0,
            }}
          >
            {card.message}
          </p>
        </div>
      </div>
    </button>
  );
}

interface BirthdayWishCardsProps {
  customCards?: CustomCard[];
}

export function BirthdayWishCards({ customCards }: BirthdayWishCardsProps) {
  const cards: WishCardData[] = WISH_CARDS.map((base, i) => ({
    ...base,
    label: customCards?.[i]?.label || base.label,
    message: customCards?.[i]?.message || base.message,
  }));

  return (
    <section className="py-10 px-4">
      <h2
        className="text-3xl md:text-4xl font-heading text-center mb-8"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.52 0.17 235), oklch(0.62 0.20 280))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 2px 8px oklch(0.62 0.16 230 / 30%))",
        }}
      >
        💌 Birthday Wishes for You!
      </h2>
      <p
        className="text-center font-body mb-8"
        style={{ color: "oklch(0.50 0.08 240)", fontSize: "0.95rem" }}
      >
        Tap a card to reveal a special birthday message 🎁
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "1.25rem",
          maxWidth: "640px",
          margin: "0 auto",
        }}
      >
        {cards.map((card, i) => (
          <WishCard key={card.id} card={card} index={i} />
        ))}
      </div>
    </section>
  );
}
