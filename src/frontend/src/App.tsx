import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { BirthdayProfile } from "./backend.d";
import { BirthdayWishCards } from "./components/BirthdayWishCards";
import type { CustomCard } from "./components/BirthdayWishCards";
import { CakeSection } from "./components/CakeSection";
import { ConfettiEffect } from "./components/ConfettiEffect";
import { CustomizePanel } from "./components/CustomizePanel";
import { FloatingBalloons } from "./components/FloatingBalloons";
import { HeroSection } from "./components/HeroSection";
import { MusicToggle } from "./components/MusicToggle";
import PersonalNoteCard from "./components/PersonalNoteCard";
import { ScrollReveal } from "./components/ScrollReveal";
import { VirtualGiftBox } from "./components/VirtualGiftBox";
import { WishingWell } from "./components/WishingWell";
import { useBirthdayProfile } from "./hooks/useQueries";
import { DEFAULT_PROFILE } from "./hooks/useQueries";

const queryClient = new QueryClient();
const CARDS_KEY = "bdayCards";

function loadCustomCards(): CustomCard[] {
  try {
    const stored = localStorage.getItem(CARDS_KEY);
    if (stored) return JSON.parse(stored) as CustomCard[];
  } catch {
    // ignore
  }
  return [];
}

function BirthdayApp() {
  const { data: profileData } = useBirthdayProfile();
  const [config, setConfig] = useState<BirthdayProfile>(DEFAULT_PROFILE);
  const [showConfetti, setShowConfetti] = useState(false);
  const [customCards, setCustomCards] = useState<CustomCard[]>(loadCustomCards);

  useEffect(() => {
    if (profileData) setConfig(profileData);
  }, [profileData]);

  const handleSave = (newConfig: BirthdayProfile) => {
    setConfig(newConfig);
    setCustomCards(loadCustomCards());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-50 to-purple-50 relative overflow-x-hidden">
      <FloatingBalloons />
      <MusicToggle />
      {showConfetti && <ConfettiEffect onDone={() => setShowConfetti(false)} />}

      {/* Hero - immediately visible */}
      <section className="relative z-10">
        <HeroSection config={config} />
      </section>

      {/* Cake Section */}
      <ScrollReveal className="relative z-10">
        <section
          className="mx-auto max-w-2xl px-4"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.97 0.02 220 / 80%), oklch(0.95 0.04 260 / 80%))",
            borderRadius: "2rem",
            margin: "2rem auto",
            backdropFilter: "blur(10px)",
          }}
        >
          <CakeSection onWishMade={() => setShowConfetti(true)} />
        </section>
      </ScrollReveal>

      {/* Gift Section */}
      <ScrollReveal className="relative z-10">
        <section
          className="mx-auto max-w-2xl px-4"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.97 0.02 280 / 80%), oklch(0.95 0.04 230 / 80%))",
            borderRadius: "2rem",
            margin: "2rem auto",
            backdropFilter: "blur(10px)",
          }}
        >
          <VirtualGiftBox />
        </section>
      </ScrollReveal>

      {/* Birthday Wishes Cards */}
      <ScrollReveal className="relative z-10">
        <section
          className="mx-auto max-w-2xl px-4"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.97 0.02 220 / 80%), oklch(0.96 0.03 260 / 80%))",
            borderRadius: "2rem",
            margin: "2rem auto",
            backdropFilter: "blur(10px)",
          }}
        >
          <BirthdayWishCards customCards={customCards} />
        </section>
      </ScrollReveal>

      {/* Personal Note / Special Letter */}
      <ScrollReveal className="relative z-10">
        <section
          className="mx-auto max-w-2xl px-4"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.97 0.03 200 / 80%), oklch(0.96 0.04 240 / 80%))",
            borderRadius: "2rem",
            margin: "2rem auto",
            backdropFilter: "blur(10px)",
          }}
        >
          <PersonalNoteCard profile={config} />
        </section>
      </ScrollReveal>

      {/* Wishing Well */}
      <ScrollReveal className="relative z-10">
        <section
          className="mx-auto max-w-2xl px-4"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.97 0.02 260 / 80%), oklch(0.95 0.04 220 / 80%))",
            borderRadius: "2rem",
            margin: "2rem auto",
            backdropFilter: "blur(10px)",
          }}
        >
          <WishingWell />
        </section>
      </ScrollReveal>

      {/* Footer */}
      <footer
        className="relative z-10 py-10 text-center font-body"
        style={{ color: "oklch(0.55 0.08 240)" }}
      >
        <p className="text-2xl mb-2">🎂🎈💖🎉🌟</p>
        <p>
          © {new Date().getFullYear()}. Built with{" "}
          <span style={{ color: "oklch(0.65 0.18 25)" }}>♥</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80 transition-opacity"
            style={{ color: "oklch(0.52 0.15 260)" }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      <CustomizePanel
        config={config}
        onSave={handleSave}
        customCards={customCards}
        setCustomCards={setCustomCards}
      />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BirthdayApp />
    </QueryClientProvider>
  );
}
