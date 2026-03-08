import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import ConfettiEffect from "./components/ConfettiEffect";
import CustomizePanel from "./components/CustomizePanel";
import FloatingBalloons from "./components/FloatingBalloons";
import FunActivities from "./components/FunActivities";
import HeroSection from "./components/HeroSection";
import PersonalNoteCard from "./components/PersonalNoteCard";
import VirtualGiftBox from "./components/VirtualGiftBox";
import { useBirthdayProfile, useWishes } from "./hooks/useQueries";

export default function App() {
  const { data: profile, isLoading: profileLoading } = useBirthdayProfile();
  const { data: wishes = [] } = useWishes();
  const [showConfetti, setShowConfetti] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    // Trigger confetti on first load after profile loads
    if (profile && !pageLoaded) {
      setPageLoaded(true);
      setTimeout(() => setShowConfetti(true), 800);
    }
  }, [profile, pageLoaded]);

  if (profileLoading || !profile) {
    return (
      <div className="min-h-screen birthday-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="text-5xl"
          >
            🎂
          </motion.div>
          <div className="space-y-3 text-center">
            <Skeleton className="h-8 w-64 mx-auto rounded-xl" />
            <Skeleton className="h-4 w-48 mx-auto rounded-xl" />
            <Skeleton className="h-4 w-56 mx-auto rounded-xl" />
          </div>
          <p className="font-fun text-sm text-foreground/50 animate-pulse">
            Loading your birthday experience...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen birthday-bg">
      {/* Floating balloons background */}
      <FloatingBalloons />

      {/* Confetti effect on load */}
      <ConfettiEffect
        trigger={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />

      {/* Main content */}
      <main className="relative z-10">
        {/* Hero */}
        <HeroSection profile={profile} />

        {/* Divider with decorations */}
        <SectionDivider emoji="💌" />

        {/* Personal Note (flip card) */}
        <PersonalNoteCard profile={profile} />

        {/* Divider */}
        <SectionDivider emoji="🎁" />

        {/* Virtual Gift Box */}
        <VirtualGiftBox profile={profile} />

        {/* Divider */}
        <SectionDivider emoji="🎉" />

        {/* Fun Activities */}
        <FunActivities wishes={wishes} />

        {/* Footer */}
        <footer
          className="py-12 px-6 text-center"
          style={{
            background:
              "linear-gradient(to top, oklch(0.94 0.04 220 / 60%), transparent)",
            borderTop: "1px solid oklch(0.88 0.04 220 / 40%)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="space-y-3"
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="text-3xl"
            >
              🎂✨🎈
            </motion.div>
            <p className="font-display text-xl font-bold text-sky-dark">
              {profile.recipientName}&apos;s Special Day
            </p>
            <p className="font-body text-sm text-foreground/50">
              Made with{" "}
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{
                  duration: 1.6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="inline-block"
              >
                💙
              </motion.span>{" "}
              for{" "}
              <span className="font-semibold text-sky-dark">
                {profile.recipientName}
              </span>{" "}
              by{" "}
              <span className="font-semibold text-sky-dark">
                {profile.senderName}
              </span>
            </p>
            <p className="font-body text-xs text-foreground/30">
              © {new Date().getFullYear()}. Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-sky-dark transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </motion.div>
        </footer>
      </main>

      {/* Customize panel */}
      <CustomizePanel profile={profile} />

      {/* Toast notifications */}
      <Toaster position="top-center" richColors />
    </div>
  );
}

function SectionDivider({ emoji }: { emoji: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.6 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ type: "spring", damping: 22, stiffness: 200 }}
      className="flex items-center justify-center gap-4 py-2 px-6"
    >
      <div
        className="flex-1 max-w-40 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, oklch(0.72 0.12 230 / 35%))",
        }}
      />
      <motion.span
        whileInView={{ scale: [0.7, 1.3, 1], rotate: [0, 15, 0] }}
        viewport={{ once: true }}
        transition={{ type: "spring", damping: 10, stiffness: 200, delay: 0.1 }}
        className="text-2xl select-none"
      >
        {emoji}
      </motion.span>
      <div
        className="flex-1 max-w-40 h-px"
        style={{
          background:
            "linear-gradient(to left, transparent, oklch(0.72 0.12 230 / 35%))",
        }}
      />
    </motion.div>
  );
}
