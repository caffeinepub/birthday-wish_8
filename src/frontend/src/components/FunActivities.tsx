import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";
import type { Wish } from "../backend.d";
import BalloonPopGame from "./BalloonPopGame";
import SpinWheel from "./SpinWheel";
import WishingWell from "./WishingWell";

interface FunActivitiesProps {
  wishes: Wish[];
}

export default function FunActivities({ wishes }: FunActivitiesProps) {
  return (
    <section className="activities-section-bg py-20 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="text-center mb-12"
        >
          <div className="label-pill mb-4 mx-auto w-fit">
            🎮 Interactive Fun
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black text-foreground mb-3 heading-accent">
            Birthday Activities
          </h2>
          <p className="font-body text-foreground/55 mt-5">
            Play, spin, and spread birthday wishes!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            type: "spring",
            damping: 18,
            stiffness: 200,
            delay: 0.1,
          }}
        >
          <Tabs defaultValue="balloons" className="w-full">
            <TabsList
              className="w-full grid grid-cols-3 rounded-2xl p-1.5 mb-8 h-auto gap-1"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.96 0.025 220 / 70%) 0%, oklch(0.97 0.015 240 / 65%) 100%)",
                backdropFilter: "blur(16px)",
                border: "1px solid oklch(0.88 0.04 220 / 55%)",
                boxShadow:
                  "0 2px 12px oklch(0.62 0.16 230 / 10%), inset 0 1px 0 oklch(1 0 0 / 45%)",
              }}
            >
              <TabsTrigger
                value="balloons"
                data-ocid="balloon.canvas_target"
                className="rounded-xl font-fun font-semibold py-2.5 text-sm data-[state=active]:bg-white data-[state=active]:shadow-soft data-[state=active]:text-sky-dark data-[state=active]:font-bold transition-all duration-200"
              >
                🎈 Balloon Pop
              </TabsTrigger>
              <TabsTrigger
                value="wheel"
                className="rounded-xl font-fun font-semibold py-2.5 text-sm data-[state=active]:bg-white data-[state=active]:shadow-soft data-[state=active]:text-sky-dark data-[state=active]:font-bold transition-all duration-200"
              >
                🎡 Spin Wheel
              </TabsTrigger>
              <TabsTrigger
                value="wishing"
                className="rounded-xl font-fun font-semibold py-2.5 text-sm data-[state=active]:bg-white data-[state=active]:shadow-soft data-[state=active]:text-sky-dark data-[state=active]:font-bold transition-all duration-200"
              >
                🌊 Wishing Well
              </TabsTrigger>
            </TabsList>

            <TabsContent value="balloons" className="mt-0">
              <div className="glass-card rounded-3xl p-6 shadow-birthday-lg">
                <div className="mb-4">
                  <h3 className="font-display text-2xl font-bold text-sky-dark mb-1">
                    Balloon Pop Challenge! 🎈
                  </h3>
                  <p className="font-body text-sm text-foreground/55">
                    Click balloons to pop them and reveal birthday messages!
                  </p>
                </div>
                <BalloonPopGame />
              </div>
            </TabsContent>

            <TabsContent value="wheel" className="mt-0">
              <div className="glass-card rounded-3xl p-6 shadow-birthday-lg">
                <div className="mb-6 text-center">
                  <h3 className="font-display text-2xl font-bold text-sky-dark mb-1">
                    Spin the Birthday Wheel! 🎡
                  </h3>
                  <p className="font-body text-sm text-foreground/55">
                    Spin to discover your special birthday activity!
                  </p>
                </div>
                <SpinWheel />
              </div>
            </TabsContent>

            <TabsContent value="wishing" className="mt-0">
              <div className="glass-card rounded-3xl p-6 shadow-birthday-lg">
                <div className="mb-6">
                  <h3 className="font-display text-2xl font-bold text-sky-dark mb-1">
                    Birthday Wishing Well 🌊
                  </h3>
                  <p className="font-body text-sm text-foreground/55">
                    Drop your wish into the wishing well and see everyone&apos;s
                    messages!
                  </p>
                </div>
                <WishingWell wishes={wishes} />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
