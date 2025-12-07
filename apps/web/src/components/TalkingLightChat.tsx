"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Loader2 } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function TalkingLightChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "seed-user",
      role: "user",
      content: "I feel anxious.",
    },
    {
      id: "seed-assistant",
      role: "assistant",
      content:
        "Anxiety is not against you.\n\nIt appears when your mind runs ahead of your life.\n\nClose your eyes for a moment and simply notice where it lives in your body — chest, throat, belly. Let the breath touch that place without trying to fix it.\n\nAsk yourself: \"What future am I imagining that is not actually happening right now?\"\n\nStay with that question for a few breaths and just watch what arises.",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/guidance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: trimmed,
          language: "en",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to reach Talking Light");
      }

      const data = await res.json();
      
      // API returns { lines: string[] }, join them with newlines
      const replyText: string = data.lines 
        ? data.lines.join("\n")
        : "Silence is also an answer. Try again in a moment.";

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: replyText,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const fallback: Message = {
        id: `assistant-error-${Date.now()}`,
        role: "assistant",
        content:
          "Something interfered with our connection.\n\nTake one slow breath in, one slow breath out, and try again.",
      };
      setMessages((prev) => [...prev, fallback]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top_left,#ffe9f5_0,#f1e7ff_35%,#d9e9ff_70%,#f8f4ff_100%)] flex items-center justify-center px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-4xl h-[82vh] max-h-[720px] rounded-3xl bg-white/80 shadow-[0_32px_80px_rgba(38,7,92,0.16)] backdrop-blur-2xl flex flex-col overflow-hidden border border-white/60"
      >
        {/* HEADER */}
        <header className="flex items-center justify-between border-b border-white/80 bg-gradient-to-tr from-white/80 via-[#f2ebff]/95 to-[#ece3ff]/95 px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 rounded-full bg-[radial-gradient(circle_at_20%_0,#ffffff,#fbd9ff,#b691ff)] shadow-[0_0_18px_rgba(171,118,255,0.8)]">
              <div className="absolute inset-[18%] rounded-full border border-white/80 opacity-70" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#4f2a88]">
                Talking Light
              </p>
              <p className="text-[0.7rem] text-[#7b679e]">
                Spiritual companion · Osho-style reflection
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[0.7rem] text-[#7e7a9b]">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[radial-gradient(circle,#9cffc0,#33d182)] shadow-[0_0_8px_rgba(51,209,130,0.9)]" />
              <span>Online</span>
            </div>
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-full border border-[#8a6eff5a] bg-[#8a6eff0f] px-3 py-1 text-[0.68rem]"
            >
              Breathe with me
            </motion.div>
          </div>
        </header>

        {/* CHAT AREA */}
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth"
        >
          <div className="flex justify-center">
            <span className="mt-1 rounded-full bg-white/80 px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-[#a39abf]">
              Today
            </span>
          </div>

          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.97 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className={`flex max-w-[82%] items-end gap-2 ${
                  m.role === "assistant"
                    ? "self-start"
                    : "self-end flex-row-reverse"
                }`}
              >
                <div className="h-7 w-7 flex-shrink-0 rounded-full bg-[radial-gradient(circle_at_20%_0,#ffffff,#fbd9ff,#b691ff)] shadow-[0_0_12px_rgba(147,112,219,0.55)]" />
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-[0_12px_30px_rgba(45,22,87,0.06)] whitespace-pre-line ${
                    m.role === "assistant"
                      ? "rounded-tl-md border border-[#e3deff] bg-white/95 text-[#403054]"
                      : "rounded-tr-md bg-gradient-to-br from-[#f062d9] to-[#b47bff] text-white shadow-[0_12px_30px_rgba(165,75,196,0.55)]"
                  }`}
                >
                  {m.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="flex items-center gap-2 self-start rounded-full bg-white/80 px-3 py-1.5 text-[0.7rem] text-[#7e7a9b]">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Thinking in silence…
            </div>
          )}
        </div>

        {/* INPUT AREA */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-[#eee7ff] bg-gradient-to-b from-white/95 to-[#f5f0ff]/95 px-4 pb-4 pt-3 space-y-2"
        >
          <div className="flex items-center gap-2">
            <input
              className="flex-1 rounded-full border border-[#cbc0ff] bg-white/95 px-4 py-2.5 text-sm outline-none placeholder:text-[#b1a5cc] focus:border-[#b38cff] focus:bg-white focus:ring-2 focus:ring-[#b38cff4d]"
              placeholder="What's moving inside you right now?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              dir="ltr"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-[#f062d9] to-[#b47bff] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_14px_28px_rgba(166,73,197,0.7)] transition-transform duration-100 ease-out hover:translate-y-[-1px] hover:shadow-[0_18px_34px_rgba(150,62,187,0.8)] disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Sending
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Send
                </>
              )}
            </button>
          </div>
          <div className="flex items-center justify-between text-[0.7rem] text-[#9a91c0]">
            <span>Talking Light responds with direct, Osho-style guidance.</span>
            <span className="font-medium text-[#8254ff]">
              Press Enter to send
            </span>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
