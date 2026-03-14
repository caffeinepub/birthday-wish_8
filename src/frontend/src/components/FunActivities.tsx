import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAudio } from "../hooks/useAudio";

// ===================== Memory Match =====================
const EMOJI_PAIRS = ["🎂", "🎁", "🎈", "🎉", "🌟", "💖"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function MemoryMatch() {
  const { playSound } = useAudio();
  const [cards, setCards] = useState(() =>
    shuffle(
      [...EMOJI_PAIRS, ...EMOJI_PAIRS].map((e, i) => ({
        id: i,
        emoji: e,
        flipped: false,
        matched: false,
      })),
    ),
  );
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const checkingRef = useRef(false);

  const handleFlip = useCallback(
    (id: number) => {
      if (checkingRef.current) return;
      const card = cards.find((c) => c.id === id);
      if (!card || card.flipped || card.matched) return;
      if (selected.length === 1 && selected[0] === id) return;

      playSound("flip");
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)),
      );
      setSelected((prev) => {
        const next = [...prev, id];
        if (next.length === 2) {
          checkingRef.current = true;
          setMoves((m) => m + 1);
          setTimeout(() => {
            setCards((prev2) => {
              const [a, b] = next.map(
                (sid) => prev2.find((c) => c.id === sid)!,
              );
              if (a.emoji === b.emoji) {
                playSound("pop");
                const updated = prev2.map((c) =>
                  c.id === a.id || c.id === b.id
                    ? { ...c, matched: true, flipped: true }
                    : c,
                );
                if (updated.every((c) => c.matched)) {
                  setWon(true);
                  playSound("success");
                }
                return updated;
              }
              return prev2.map((c) =>
                c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c,
              );
            });
            checkingRef.current = false;
          }, 900);
          return [];
        }
        return next;
      });
    },
    [cards, selected, playSound],
  );

  const reset = () => {
    setCards(
      shuffle(
        [...EMOJI_PAIRS, ...EMOJI_PAIRS].map((e, i) => ({
          id: i,
          emoji: e,
          flipped: false,
          matched: false,
        })),
      ),
    );
    setSelected([]);
    setMoves(0);
    setWon(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex items-center gap-4">
        <span className="font-body" style={{ color: "oklch(0.45 0.10 240)" }}>
          Moves: {moves}
        </span>
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 rounded-xl text-white text-sm font-body"
          style={{ background: "oklch(0.62 0.16 230)" }}
        >
          Reset
        </button>
      </div>
      {won && (
        <div
          className="text-2xl font-heading text-center"
          style={{ color: "oklch(0.52 0.17 260)" }}
        >
          🎉 You won in {moves} moves!
        </div>
      )}
      <div className="grid grid-cols-4 gap-3">
        {cards.map((card, idx) => (
          <button
            key={card.id}
            type="button"
            data-ocid={`games.memory_card.${idx + 1}`}
            onClick={() => handleFlip(card.id)}
            className="w-16 h-16 rounded-2xl text-3xl flex items-center justify-center transition-all duration-300 shadow-soft"
            style={{
              background:
                card.flipped || card.matched
                  ? "linear-gradient(135deg, oklch(0.90 0.08 230), oklch(0.85 0.10 260))"
                  : "linear-gradient(135deg, oklch(0.62 0.16 230), oklch(0.52 0.17 260))",
              border: card.matched ? "2px solid oklch(0.72 0.18 140)" : "none",
            }}
          >
            {card.flipped || card.matched ? card.emoji : "❓"}
          </button>
        ))}
      </div>
    </div>
  );
}

// ===================== Whack-a-Mole =====================
function WhackAMole() {
  const { playSound } = useAudio();
  const [started, setStarted] = useState(false);
  const [moles, setMoles] = useState<boolean[]>(Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!started || finished) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setFinished(true);
          setStarted(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started, finished]);

  useEffect(() => {
    if (!started || finished) return;
    const pop = () => {
      const idx = Math.floor(Math.random() * 9);
      setMoles(() => {
        const next = Array(9).fill(false);
        next[idx] = true;
        return next;
      });
    };
    const interval = setInterval(pop, 800);
    return () => clearInterval(interval);
  }, [started, finished]);

  const whack = (i: number) => {
    if (!moles[i] || !started) return;
    playSound("whack");
    setScore((s) => s + 1);
    setMoles((prev) => {
      const next = [...prev];
      next[i] = false;
      return next;
    });
  };

  const start = () => {
    setScore(0);
    setTimeLeft(30);
    setFinished(false);
    setMoles(Array(9).fill(false));
    setStarted(true);
  };

  const MOLE_IDS = ["m0", "m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8"];

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex items-center gap-6">
        <span
          className="font-body font-bold text-lg"
          style={{ color: "oklch(0.45 0.10 240)" }}
        >
          Score: {score}
        </span>
        <span
          className="font-body font-bold text-lg"
          style={{
            color:
              timeLeft <= 10 ? "oklch(0.55 0.22 25)" : "oklch(0.45 0.10 240)",
          }}
        >
          ⏱ {timeLeft}s
        </span>
      </div>
      {!started && !finished && (
        <button
          type="button"
          data-ocid="games.whackamole.start_button"
          onClick={start}
          className="px-8 py-4 rounded-2xl text-white font-heading text-xl shadow-birthday hover:scale-105 transition-transform"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.62 0.16 230), oklch(0.52 0.17 260))",
          }}
        >
          🐹 Start Game!
        </button>
      )}
      {finished && (
        <div className="flex flex-col items-center gap-2">
          <p
            className="text-2xl font-heading"
            style={{ color: "oklch(0.52 0.17 260)" }}
          >
            🎊 Final Score: {score}
          </p>
          <button
            type="button"
            onClick={start}
            className="px-6 py-3 rounded-xl text-white font-body"
            style={{ background: "oklch(0.62 0.16 230)" }}
          >
            Play Again
          </button>
        </div>
      )}
      <div className="grid grid-cols-3 gap-4">
        {moles.map((active, i) => (
          <button
            key={MOLE_IDS[i]}
            type="button"
            onClick={() => whack(i)}
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all duration-150 shadow-soft"
            style={{
              background: active
                ? "linear-gradient(135deg, oklch(0.72 0.18 80), oklch(0.82 0.18 60))"
                : "linear-gradient(135deg, oklch(0.80 0.06 60), oklch(0.75 0.08 80))",
              transform: active
                ? "translateY(-8px) scale(1.1)"
                : "translateY(0) scale(1)",
              cursor: active ? "pointer" : "default",
            }}
          >
            {active ? "🐹" : "🕳️"}
          </button>
        ))}
      </div>
    </div>
  );
}

// ===================== Emoji Quiz =====================
const QUIZ_QUESTIONS = [
  {
    prompt: "🎂 + 🕯️ = ?",
    answer: "birthday cake",
    hint: "Sweet treat with candles",
  },
  { prompt: "🎁 + 🎀 = ?", answer: "gift box", hint: "Wrapped surprise" },
  { prompt: "🎈 + 🎉 = ?", answer: "party time", hint: "Celebration fun!" },
  { prompt: "🌟 + ✨ = ?", answer: "star shine", hint: "Bright and sparkly" },
  { prompt: "🎵 + 🎶 = ?", answer: "happy music", hint: "Birthday song!" },
];

function EmojiQuiz() {
  const { playSound } = useAudio();
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const submit = () => {
    const correct =
      input.trim().toLowerCase() === QUIZ_QUESTIONS[current].answer;
    setFeedback(correct ? "correct" : "wrong");
    if (correct) {
      playSound("success");
      setScore((s) => s + 1);
    }
    setTimeout(() => {
      setFeedback(null);
      setInput("");
      if (current + 1 >= QUIZ_QUESTIONS.length) {
        setFinished(true);
      } else {
        setCurrent((c) => c + 1);
      }
    }, 900);
  };

  const reset = () => {
    setCurrent(0);
    setInput("");
    setScore(0);
    setFinished(false);
    setFeedback(null);
  };

  if (finished) {
    return (
      <div className="flex flex-col items-center gap-4 p-6">
        <p
          className="text-3xl font-heading"
          style={{ color: "oklch(0.52 0.17 260)" }}
        >
          🎊 Quiz Complete!
        </p>
        <p
          className="text-xl font-body"
          style={{ color: "oklch(0.45 0.10 240)" }}
        >
          You scored {score} / {QUIZ_QUESTIONS.length}
        </p>
        <button
          type="button"
          onClick={reset}
          className="px-6 py-3 rounded-xl text-white font-body"
          style={{ background: "oklch(0.62 0.16 230)" }}
        >
          Play Again
        </button>
      </div>
    );
  }

  const q = QUIZ_QUESTIONS[current];

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div
        className="text-sm font-body"
        style={{ color: "oklch(0.55 0.08 240)" }}
      >
        Question {current + 1} / {QUIZ_QUESTIONS.length} &bull; Score: {score}
      </div>
      <div
        className="text-4xl font-heading text-center p-6 rounded-2xl"
        style={{ background: "oklch(0.92 0.04 230)", minWidth: 260 }}
      >
        {q.prompt}
      </div>
      <p
        className="text-sm font-body italic"
        style={{ color: "oklch(0.55 0.08 240)" }}
      >
        Hint: {q.hint}
      </p>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Type your answer…"
        className="px-4 py-3 rounded-xl border-2 font-body text-center w-64"
        style={{
          borderColor:
            feedback === "correct"
              ? "oklch(0.72 0.18 140)"
              : feedback === "wrong"
                ? "oklch(0.55 0.22 25)"
                : "oklch(0.80 0.06 230)",
          background:
            feedback === "correct"
              ? "oklch(0.95 0.06 140)"
              : feedback === "wrong"
                ? "oklch(0.95 0.06 25)"
                : "white",
          outline: "none",
        }}
      />
      {feedback && (
        <p
          className="text-xl font-heading"
          style={{
            color:
              feedback === "correct"
                ? "oklch(0.52 0.18 140)"
                : "oklch(0.52 0.22 25)",
          }}
        >
          {feedback === "correct" ? "✅ Correct!" : `❌ It was: ${q.answer}`}
        </p>
      )}
      <button
        type="button"
        data-ocid="games.quiz.submit_button"
        onClick={submit}
        disabled={!input.trim() || !!feedback}
        className="px-8 py-3 rounded-xl text-white font-body shadow-soft hover:scale-105 transition-transform disabled:opacity-50"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.62 0.16 230), oklch(0.52 0.17 260))",
        }}
      >
        Submit Answer
      </button>
    </div>
  );
}

// ===================== Main Component =====================
export function FunActivities() {
  return (
    <div className="py-20 px-4 flex flex-col items-center gap-8">
      <h2
        className="text-4xl md:text-5xl font-heading text-center"
        style={{
          color: "oklch(0.42 0.15 280)",
          textShadow: "0 2px 12px oklch(0.72 0.12 280 / 40%)",
        }}
      >
        🎮 Fun Activities!
      </h2>
      <div className="w-full max-w-xl">
        <Tabs defaultValue="memory">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger data-ocid="games.tab" value="memory">
              🃏 Memory Match
            </TabsTrigger>
            <TabsTrigger data-ocid="games.tab" value="whack">
              🐹 Whack-a-Mole
            </TabsTrigger>
            <TabsTrigger data-ocid="games.tab" value="quiz">
              🧠 Emoji Quiz
            </TabsTrigger>
          </TabsList>
          <TabsContent value="memory">
            <div
              className="rounded-3xl p-2"
              style={{
                background: "oklch(0.97 0.02 220)",
                boxShadow: "0 8px 32px oklch(0.62 0.16 230 / 15%)",
              }}
            >
              <MemoryMatch />
            </div>
          </TabsContent>
          <TabsContent value="whack">
            <div
              className="rounded-3xl p-2"
              style={{
                background: "oklch(0.97 0.02 220)",
                boxShadow: "0 8px 32px oklch(0.62 0.16 230 / 15%)",
              }}
            >
              <WhackAMole />
            </div>
          </TabsContent>
          <TabsContent value="quiz">
            <div
              className="rounded-3xl p-2"
              style={{
                background: "oklch(0.97 0.02 220)",
                boxShadow: "0 8px 32px oklch(0.62 0.16 230 / 15%)",
              }}
            >
              <EmojiQuiz />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
