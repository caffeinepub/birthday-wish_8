import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import type { BirthdayProfile } from "../backend.d";
import { useSetBirthdayProfile } from "../hooks/useQueries";
import type { CustomCard } from "./BirthdayWishCards";

const PIN_KEY = "bdayPin";
const LOCKED_KEY = "bdayLocked";
const CARDS_KEY = "bdayCards";

interface Props {
  config: BirthdayProfile;
  onSave: (config: BirthdayProfile) => void;
  customCards: CustomCard[];
  setCustomCards: (cards: CustomCard[]) => void;
}

export function CustomizePanel({
  config,
  onSave,
  customCards,
  setCustomCards,
}: Props) {
  const { mutate: saveProfile, isPending } = useSetBirthdayProfile();
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [locked, setLocked] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState("");
  const [form, setForm] = useState<BirthdayProfile>(config);
  const [localCards, setLocalCards] = useState<CustomCard[]>(customCards);

  useEffect(() => {
    const storedPin = localStorage.getItem(PIN_KEY);
    const isLocked = localStorage.getItem(LOCKED_KEY) === "true";
    if (storedPin) {
      setPin(storedPin);
      setLocked(isLocked);
    }
  }, []);

  useEffect(() => {
    setForm(config);
  }, [config]);

  useEffect(() => {
    setLocalCards(customCards);
  }, [customCards]);

  const handleSetPin = () => {
    if (pinInput.length !== 4 || !/^\d{4}$/.test(pinInput)) {
      setPinError("PIN must be exactly 4 digits");
      return;
    }
    localStorage.setItem(PIN_KEY, pinInput);
    localStorage.setItem(LOCKED_KEY, "true");
    localStorage.setItem(CARDS_KEY, JSON.stringify(localCards));
    setCustomCards(localCards);
    setPin(pinInput);
    setLocked(true);
    setUnlocked(true);
    setPinInput("");
    setPinError("");
  };

  const handleUnlock = () => {
    if (pinInput === pin) {
      setUnlocked(true);
      setPinInput("");
      setPinError("");
    } else {
      setPinError("Incorrect PIN");
    }
  };

  const handleSave = () => {
    saveProfile(form, {
      onSuccess: () => {
        localStorage.setItem(CARDS_KEY, JSON.stringify(localCards));
        setCustomCards(localCards);
        onSave(form);
        setLocked(true);
        setUnlocked(false);
        localStorage.setItem(LOCKED_KEY, "true");
        setOpen(false);
      },
    });
  };

  const handleLock = () => {
    setUnlocked(false);
    setLocked(true);
    localStorage.setItem(LOCKED_KEY, "true");
  };

  const needsPin = !pin;
  const showLockScreen = !needsPin && locked && !unlocked;
  const showForm = !needsPin && unlocked;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          data-ocid="customize.open_modal_button"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-birthday flex items-center justify-center text-2xl bg-white/90 backdrop-blur-sm border-2 border-primary/20 hover:scale-110 transition-transform"
          title="Customize"
        >
          ⚙️
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle
            className="font-heading text-2xl"
            style={{ color: "oklch(0.42 0.15 280)" }}
          >
            🎨 Customize Birthday
          </DialogTitle>
        </DialogHeader>

        {needsPin && (
          <div className="flex flex-col gap-4 mt-2">
            <p
              className="font-body text-sm"
              style={{ color: "oklch(0.50 0.08 240)" }}
            >
              Set a 4-digit PIN to protect your customizations.
            </p>
            <input
              id="pin-set-input"
              data-ocid="customize.pin_input"
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pinInput}
              onChange={(e) =>
                setPinInput(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              placeholder="Enter 4-digit PIN"
              className="px-4 py-3 rounded-xl border-2 font-body text-center text-xl tracking-widest"
              style={{ borderColor: "oklch(0.80 0.08 230)", outline: "none" }}
            />
            {pinError && (
              <p
                className="text-sm font-body"
                style={{ color: "oklch(0.52 0.22 25)" }}
              >
                {pinError}
              </p>
            )}
            <ScrollArea className="max-h-[50vh] pr-2">
              <FormFields
                form={form}
                setForm={setForm}
                localCards={localCards}
                setLocalCards={setLocalCards}
              />
            </ScrollArea>
            <button
              type="button"
              data-ocid="customize.save_button"
              onClick={handleSetPin}
              className="py-3 rounded-xl text-white font-heading text-lg shadow-birthday"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.62 0.16 230), oklch(0.52 0.17 260))",
              }}
            >
              Set PIN & Save
            </button>
          </div>
        )}

        {showLockScreen && (
          <div className="flex flex-col items-center gap-4 mt-4">
            <div className="text-5xl">🔒</div>
            <p className="font-body" style={{ color: "oklch(0.45 0.08 240)" }}>
              Enter PIN to edit
            </p>
            <input
              id="pin-unlock-input"
              data-ocid="customize.pin_input"
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pinInput}
              onChange={(e) =>
                setPinInput(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
              placeholder="Enter PIN"
              className="px-4 py-3 rounded-xl border-2 font-body text-center text-2xl tracking-widest w-40"
              style={{ borderColor: "oklch(0.80 0.08 230)", outline: "none" }}
            />
            {pinError && (
              <p
                className="text-sm font-body"
                style={{ color: "oklch(0.52 0.22 25)" }}
              >
                {pinError}
              </p>
            )}
            <button
              type="button"
              data-ocid="customize.unlock_button"
              onClick={handleUnlock}
              className="px-8 py-3 rounded-xl text-white font-heading text-lg shadow-birthday"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.62 0.16 230), oklch(0.52 0.17 260))",
              }}
            >
              🔓 Unlock
            </button>
          </div>
        )}

        {showForm && (
          <div className="flex flex-col gap-4 mt-2">
            <ScrollArea className="max-h-[55vh] pr-2">
              <FormFields
                form={form}
                setForm={setForm}
                localCards={localCards}
                setLocalCards={setLocalCards}
              />
            </ScrollArea>
            <div className="flex gap-3">
              <button
                type="button"
                data-ocid="customize.save_button"
                onClick={handleSave}
                disabled={isPending}
                className="flex-1 py-3 rounded-xl text-white font-heading text-lg shadow-birthday disabled:opacity-60"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.62 0.16 230), oklch(0.52 0.17 260))",
                }}
              >
                {isPending ? "Saving..." : "💾 Save"}
              </button>
              <button
                type="button"
                onClick={handleLock}
                className="px-4 py-3 rounded-xl font-body border-2"
                style={{
                  borderColor: "oklch(0.80 0.08 230)",
                  color: "oklch(0.45 0.08 240)",
                }}
              >
                🔒 Lock
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

const CARD_DEFAULTS = [
  {
    label: "Make a Wish",
    message: "May all your birthday wishes come true today and every day!",
  },
  {
    label: "You're Loved",
    message: "You are cherished more than you know. Happy Birthday!",
  },
  {
    label: "Shine Bright",
    message: "Today is YOUR day — shine as bright as the stars!",
  },
  {
    label: "Celebrate!",
    message: "Life is a gift, and so are you. Celebrate every moment!",
  },
  {
    label: "Joy & Laughter",
    message: "Wishing you endless joy, laughter, and magical memories!",
  },
  {
    label: "New Chapter",
    message: "Every birthday begins a beautiful new chapter. Embrace it!",
  },
];

function FormFields({
  form,
  setForm,
  localCards,
  setLocalCards,
}: {
  form: BirthdayProfile;
  setForm: (f: BirthdayProfile) => void;
  localCards: CustomCard[];
  setLocalCards: (cards: CustomCard[]) => void;
}) {
  const cards: CustomCard[] = CARD_DEFAULTS.map((def, i) => ({
    label: localCards[i]?.label ?? def.label,
    message: localCards[i]?.message ?? def.message,
  }));

  const updateCard = (
    index: number,
    field: "label" | "message",
    value: string,
  ) => {
    const updated = cards.map((c, i) =>
      i === index ? { ...c, [field]: value } : c,
    );
    setLocalCards(updated);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="ff-recipient"
          className="font-body text-sm font-semibold"
          style={{ color: "oklch(0.45 0.08 240)" }}
        >
          Recipient Name
        </label>
        <input
          id="ff-recipient"
          data-ocid="customize.name_input"
          value={form.recipientName}
          onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
          placeholder="Birthday person's name"
          className="px-3 py-2 rounded-xl border-2 font-body"
          style={{ borderColor: "oklch(0.80 0.08 230)", outline: "none" }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="ff-date"
          className="font-body text-sm font-semibold"
          style={{ color: "oklch(0.45 0.08 240)" }}
        >
          Birthday Date
        </label>
        <input
          id="ff-date"
          data-ocid="customize.date_input"
          type="date"
          value={form.birthdayDate}
          onChange={(e) => setForm({ ...form, birthdayDate: e.target.value })}
          className="px-3 py-2 rounded-xl border-2 font-body"
          style={{ borderColor: "oklch(0.80 0.08 230)", outline: "none" }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="ff-message"
          className="font-body text-sm font-semibold"
          style={{ color: "oklch(0.45 0.08 240)" }}
        >
          💌 Special Letter Text
        </label>
        <textarea
          id="ff-message"
          data-ocid="customize.message_textarea"
          value={form.personalNote}
          onChange={(e) => setForm({ ...form, personalNote: e.target.value })}
          placeholder="Your heartfelt letter message..."
          rows={3}
          className="px-3 py-2 rounded-xl border-2 font-body resize-none"
          style={{ borderColor: "oklch(0.80 0.08 230)", outline: "none" }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="ff-sender"
          className="font-body text-sm font-semibold"
          style={{ color: "oklch(0.45 0.08 240)" }}
        >
          Sender Name
        </label>
        <input
          id="ff-sender"
          value={form.senderName}
          onChange={(e) => setForm({ ...form, senderName: e.target.value })}
          placeholder="Your name"
          className="px-3 py-2 rounded-xl border-2 font-body"
          style={{ borderColor: "oklch(0.80 0.08 230)", outline: "none" }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="ff-surprise"
          className="font-body text-sm font-semibold"
          style={{ color: "oklch(0.45 0.08 240)" }}
        >
          Surprise Message
        </label>
        <input
          id="ff-surprise"
          value={form.surpriseMessage}
          onChange={(e) =>
            setForm({ ...form, surpriseMessage: e.target.value })
          }
          placeholder="A surprise message..."
          className="px-3 py-2 rounded-xl border-2 font-body"
          style={{ borderColor: "oklch(0.80 0.08 230)", outline: "none" }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="ff-theme"
          className="font-body text-sm font-semibold"
          style={{ color: "oklch(0.45 0.08 240)" }}
        >
          Color Theme
        </label>
        <select
          id="ff-theme"
          value={form.backgroundTheme}
          onChange={(e) =>
            setForm({ ...form, backgroundTheme: e.target.value })
          }
          className="px-3 py-2 rounded-xl border-2 font-body"
          style={{ borderColor: "oklch(0.80 0.08 230)", outline: "none" }}
        >
          <option value="light-blue">💙 Light Blue</option>
          <option value="pink">🩷 Pink</option>
          <option value="purple">💜 Purple</option>
          <option value="gold">💛 Gold</option>
        </select>
      </div>

      {/* Wish Card Text */}
      <div className="flex flex-col gap-3">
        <p
          className="font-body text-sm font-bold"
          style={{ color: "oklch(0.42 0.12 260)" }}
        >
          🎴 Wish Card Text
        </p>
        {cards.map((card, i) => (
          <div
            key={`card-${i + 1}`}
            className="flex flex-col gap-2 p-3 rounded-xl"
            style={{
              background: "oklch(0.97 0.02 220 / 60%)",
              border: "1px solid oklch(0.88 0.06 230 / 50%)",
            }}
          >
            <p
              className="font-body text-xs font-semibold"
              style={{ color: "oklch(0.52 0.10 260)" }}
            >
              Card {i + 1}
            </p>
            <input
              data-ocid="customize.name_input"
              value={card.label}
              onChange={(e) => updateCard(i, "label", e.target.value)}
              placeholder={`Card ${i + 1} title`}
              className="px-3 py-1.5 rounded-lg border-2 font-body text-sm"
              style={{ borderColor: "oklch(0.80 0.08 230)", outline: "none" }}
            />
            <textarea
              data-ocid="customize.textarea"
              value={card.message}
              onChange={(e) => updateCard(i, "message", e.target.value)}
              placeholder={`Card ${i + 1} message`}
              rows={2}
              className="px-3 py-1.5 rounded-lg border-2 font-body text-sm resize-none"
              style={{ borderColor: "oklch(0.80 0.08 230)", outline: "none" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
