import { useState } from "react";
import { useAddWish, useWishes } from "../hooks/useQueries";

export function WishingWell() {
  const { data: wishes = [] } = useWishes();
  const { mutate: addWish, isPending } = useAddWish();
  const [name, setName] = useState("");
  const [wish, setWish] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !wish.trim()) return;
    addWish(
      { visitorName: name.trim(), wishText: wish.trim() },
      {
        onSuccess: () => {
          setName("");
          setWish("");
          setSubmitted(true);
          setTimeout(() => setSubmitted(false), 3000);
        },
      },
    );
  };

  return (
    <div className="py-20 px-4 flex flex-col items-center gap-10">
      <h2
        className="text-4xl md:text-5xl font-heading text-center"
        style={{
          color: "oklch(0.42 0.15 280)",
          textShadow: "0 2px 12px oklch(0.72 0.12 280 / 40%)",
        }}
      >
        🪄 Wishing Well
      </h2>

      <div
        className="w-full max-w-lg rounded-3xl p-8"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.97 0.02 220), oklch(0.95 0.04 260))",
          boxShadow: "0 12px 48px oklch(0.62 0.16 230 / 20%)",
        }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            data-ocid="wishing.name_input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name 🌸"
            className="px-4 py-3 rounded-xl border-2 font-body"
            style={{ borderColor: "oklch(0.80 0.08 230)", outline: "none" }}
            required
          />
          <textarea
            data-ocid="wishing.textarea"
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            placeholder="Leave a birthday wish... 💝"
            rows={3}
            className="px-4 py-3 rounded-xl border-2 font-body resize-none"
            style={{ borderColor: "oklch(0.80 0.08 230)", outline: "none" }}
            required
          />
          <button
            data-ocid="wishing.submit_button"
            type="submit"
            disabled={isPending}
            className="py-3 rounded-xl text-white font-heading text-lg shadow-birthday hover:scale-105 transition-transform disabled:opacity-60"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.62 0.16 230), oklch(0.52 0.17 260))",
            }}
          >
            {isPending ? "Sending... 💫" : "Send Wish! 🎊"}
          </button>
          {submitted && (
            <p
              className="text-center font-body text-lg"
              style={{ color: "oklch(0.52 0.18 140)" }}
            >
              ✅ Your wish was sent!
            </p>
          )}
        </form>
      </div>

      {wishes.length > 0 && (
        <div className="w-full max-w-lg flex flex-col gap-4">
          <h3
            className="text-2xl font-heading text-center"
            style={{ color: "oklch(0.45 0.12 260)" }}
          >
            💌 Birthday Wishes
          </h3>
          {wishes.map((w, i) => (
            <div
              key={`wish-${w.visitorName}-${i}`}
              className="rounded-2xl p-5"
              style={{
                background: "white",
                boxShadow: "0 4px 16px oklch(0.62 0.16 230 / 12%)",
              }}
            >
              <p
                className="font-heading text-base"
                style={{ color: "oklch(0.45 0.12 260)" }}
              >
                ✨ {w.visitorName}
              </p>
              <p
                className="font-body mt-1"
                style={{ color: "oklch(0.35 0.06 240)" }}
              >
                {w.wishText}
              </p>
            </div>
          ))}
        </div>
      )}

      {wishes.length === 0 && (
        <div
          data-ocid="wishing.empty_state"
          className="text-center font-body"
          style={{ color: "oklch(0.60 0.08 240)" }}
        >
          No wishes yet — be the first! 🌟
        </div>
      )}
    </div>
  );
}
