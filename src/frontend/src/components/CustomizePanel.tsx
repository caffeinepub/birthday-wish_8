import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Settings2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { BirthdayProfile } from "../backend.d";
import { useSetBirthdayProfile } from "../hooks/useQueries";

interface CustomizePanelProps {
  profile: BirthdayProfile;
}

export default function CustomizePanel({ profile }: CustomizePanelProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<BirthdayProfile>(profile);
  const setProfile = useSetBirthdayProfile();

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  const handleSave = async () => {
    try {
      await setProfile.mutateAsync(form);
      toast.success("🎉 Profile saved! Your birthday page is updated.", {
        description: "Changes will appear after a moment.",
        style: {
          background: "oklch(0.99 0.012 215)",
          border: "1px solid oklch(0.88 0.04 220)",
        },
      });
      setOpen(false);
    } catch {
      toast.error("Failed to save changes. Please try again.");
    }
  };

  const update = (key: keyof BirthdayProfile, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {/* Subtle trigger button */}
      <motion.button
        data-ocid="customize.open_modal_button"
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 glass-card rounded-2xl px-4 py-2.5 shadow-birthday text-sky-dark font-fun font-semibold text-sm hover:shadow-gold transition-shadow group"
        title="Customize this birthday page"
      >
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Settings2 size={16} />
        </motion.div>
        <span className="hidden sm:block">Customize</span>
      </motion.button>

      {/* Panel overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              data-ocid="customize.dialog"
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md glass-card border-l border-border shadow-birthday flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <div>
                  <h2 className="font-display text-xl font-bold text-sky-dark">
                    Customize Page 🎨
                  </h2>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">
                    Personalize this birthday experience
                  </p>
                </div>
                <button
                  type="button"
                  data-ocid="customize.close_button"
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form fields */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                <FormField label="🎂 Recipient Name" id="recipient-name">
                  <Input
                    id="recipient-name"
                    data-ocid="customize.recipient_input"
                    value={form.recipientName}
                    onChange={(e) => update("recipientName", e.target.value)}
                    placeholder="Who is celebrating?"
                    className="rounded-xl"
                  />
                </FormField>

                <FormField label="💌 Sender Name" id="sender-name">
                  <Input
                    id="sender-name"
                    data-ocid="customize.sender_input"
                    value={form.senderName}
                    onChange={(e) => update("senderName", e.target.value)}
                    placeholder="From who?"
                    className="rounded-xl"
                  />
                </FormField>

                <FormField label="📅 Birthday Date" id="birthday-date">
                  <Input
                    id="birthday-date"
                    data-ocid="customize.date_input"
                    type="date"
                    value={form.birthdayDate}
                    onChange={(e) => update("birthdayDate", e.target.value)}
                    className="rounded-xl"
                  />
                </FormField>

                <FormField label="💬 Personal Note" id="personal-note">
                  <Textarea
                    id="personal-note"
                    data-ocid="customize.note_textarea"
                    value={form.personalNote}
                    onChange={(e) => update("personalNote", e.target.value)}
                    placeholder="A heartfelt message..."
                    className="rounded-xl resize-none"
                    rows={3}
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="🎁 Gift Box Color" id="gift-color">
                    <div className="flex items-center gap-2">
                      <input
                        id="gift-color"
                        data-ocid="customize.gift_color_input"
                        type="color"
                        value={form.giftBoxColor}
                        onChange={(e) => update("giftBoxColor", e.target.value)}
                        className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                      />
                      <span className="font-body text-sm text-muted-foreground">
                        {form.giftBoxColor}
                      </span>
                    </div>
                  </FormField>

                  <FormField label="🎀 Ribbon Color" id="ribbon-color">
                    <div className="flex items-center gap-2">
                      <input
                        id="ribbon-color"
                        data-ocid="customize.ribbon_color_input"
                        type="color"
                        value={form.ribbonColor}
                        onChange={(e) => update("ribbonColor", e.target.value)}
                        className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                      />
                      <span className="font-body text-sm text-muted-foreground">
                        {form.ribbonColor}
                      </span>
                    </div>
                  </FormField>
                </div>

                <FormField label="🪢 Bow Style" id="bow-style">
                  <Select
                    value={form.bowStyle}
                    onValueChange={(v) => update("bowStyle", v)}
                  >
                    <SelectTrigger
                      data-ocid="customize.bow_select"
                      className="rounded-xl"
                    >
                      <SelectValue placeholder="Select bow style" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="classic">Classic Bow 🎀</SelectItem>
                      <SelectItem value="modern">Modern Bow ✨</SelectItem>
                      <SelectItem value="fancy">Fancy Bow 🌸</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="🌟 Surprise Message" id="surprise-msg">
                  <Textarea
                    id="surprise-msg"
                    data-ocid="customize.surprise_textarea"
                    value={form.surpriseMessage}
                    onChange={(e) => update("surpriseMessage", e.target.value)}
                    placeholder="What's inside the gift box?"
                    className="rounded-xl resize-none"
                    rows={2}
                  />
                </FormField>

                <FormField label="🎨 Background Theme" id="bg-theme">
                  <Select
                    value={form.backgroundTheme}
                    onValueChange={(v) => update("backgroundTheme", v)}
                  >
                    <SelectTrigger
                      data-ocid="customize.theme_select"
                      className="rounded-xl"
                    >
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="light-blue">
                        Light Blue Sky ☁️
                      </SelectItem>
                      <SelectItem value="pastel">Pastel Dream 🌸</SelectItem>
                      <SelectItem value="confetti">
                        Confetti Party 🎊
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border bg-muted/30">
                <Button
                  data-ocid="customize.save_button"
                  onClick={handleSave}
                  disabled={setProfile.isPending}
                  className="w-full rounded-xl font-fun font-bold bg-primary hover:bg-sky-dark transition-colors"
                >
                  {setProfile.isPending ? (
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
                      Saving...
                    </span>
                  ) : (
                    "💾 Save Changes"
                  )}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function FormField({
  label,
  id,
  children,
}: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="font-fun font-semibold text-sm text-foreground/80"
      >
        {label}
      </Label>
      {children}
    </div>
  );
}
