"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Lock } from "lucide-react";

type Message = {
  id: string;
  from: 'user' | 'bot';
  text: string;
  meta?: {
    engine?: 'insight' | 'action' | 'plan';
  };
};

type QuickChip = {
  id: string;
  label: string;
};

interface AlignChatProps {
  userId?: string | null;
  userTier?: 'free' | 'pro';
  apiBaseUrl?: string;
}

export function AlignChat({ 
  userId = null, 
  userTier = 'free',
  apiBaseUrl = '/api/align'
}: AlignChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      from: 'bot',
      text: "I'm here. Tell me one area of your life you want to shift right now—work, body, focus, or relationships?",
      meta: { engine: 'insight' },
    },
  ]);
  const [suggestedChips, setSuggestedChips] = useState<QuickChip[]>([
    { id: 'give_plan', label: 'Give me a practical plan' },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallReason, setPaywallReason] = useState<string | undefined>();
  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, suggestedChips]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      from: 'user',
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setSuggestedChips([]);

    try {
      const res = await fetch(`${apiBaseUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: trimmed,
          userId,
          userTier,
          conversationHistory: messages.slice(-10).map(m => ({
            role: m.from === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to reach ALIGN");
      }

      const data = await res.json();

      // Add bot message
      if (data.messages && data.messages.length > 0) {
        setMessages((prev) => [...prev, data.messages[0]]);
      }

      // Update chips
      if (data.suggestedChips) {
        setSuggestedChips(data.suggestedChips);
      }

      // Show paywall if needed
      if (data.showPaywall) {
        setPaywallReason(data.paywallReason);
        setShowPaywall(true);
      }

    } catch (err) {
      const errorMessage: Message = {
        id: `bot-error-${Date.now()}`,
        from: 'bot',
        text: "I'm having trouble connecting right now. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleChipClick(chip: QuickChip) {
    // Handle special chip actions
    if (chip.id === 'unlock_30_days' || (chip.id === 'save_routine' && userTier === 'free')) {
      setShowPaywall(true);
      setPaywallReason(chip.id === 'save_routine' ? 'save_routine' : 'bigger_plan');
      return;
    }

    // Send chip as message with explicit engine
    let explicitEngine: 'insight' | 'action' | 'plan' | undefined;
    
    if (chip.id === 'give_plan' || chip.id === 'yes_action') {
      explicitEngine = 'action';
    } else if (chip.id === 'inner_block') {
      explicitEngine = 'insight';
    }

    setInput(chip.label);
    
    // Trigger submit
    const event = new Event('submit', { bubbles: true, cancelable: true });
    const form = document.querySelector('form');
    if (form) {
      // We'll handle this by calling handleSubmit logic directly
      const userMessage: Message = {
        id: `user-chip-${Date.now()}`,
        from: 'user',
        text: chip.label,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setSuggestedChips([]);

      try {
        const res = await fetch(`${apiBaseUrl}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userInput: chip.label,
            userId,
            userTier,
            explicitEngine,
            conversationHistory: messages.slice(-10).map(m => ({
              role: m.from === 'user' ? 'user' : 'assistant',
              content: m.text,
            })),
          }),
        });

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();

        if (data.messages && data.messages.length > 0) {
          setMessages((prev) => [...prev, data.messages[0]]);
        }

        if (data.suggestedChips) {
          setSuggestedChips(data.suggestedChips);
        }

        if (data.showPaywall) {
          setPaywallReason(data.paywallReason);
          setShowPaywall(true);
        }

      } catch (err) {
        const errorMessage: Message = {
          id: `bot-error-${Date.now()}`,
          from: 'bot',
          text: "Something went wrong. Please try again.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        setInput("");
      }
    }
  }

  async function handleUpgrade() {
    try {
      const res = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          successUrl: `${window.location.origin}/?session_id={CHECKOUT_SESSION_ID}&success=true`,
          cancelUrl: `${window.location.origin}/?canceled=true`,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
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
                ALIGN
              </p>
              <p className="text-[0.7rem] text-[#7b679e]">
                Insight · Action · Plan {userTier === 'pro' && '· Pro'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[0.7rem] text-[#7e7a9b]">
            <span className="h-2.5 w-2.5 rounded-full bg-[radial-gradient(circle,#9cffc0,#33d182)] shadow-[0_0_8px_rgba(51,209,130,0.9)]" />
            <span>Online</span>
          </div>
        </header>

        {/* CHAT AREA */}
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth"
        >
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.97 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className={`flex max-w-[82%] items-end gap-2 ${
                  m.from === "bot"
                    ? "self-start"
                    : "self-end flex-row-reverse"
                }`}
              >
                <div className="h-7 w-7 flex-shrink-0 rounded-full bg-[radial-gradient(circle_at_20%_0,#ffffff,#fbd9ff,#b691ff)] shadow-[0_0_12px_rgba(147,112,219,0.55)]" />
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-[0_12px_30px_rgba(45,22,87,0.06)] whitespace-pre-line ${
                    m.from === "bot"
                      ? "rounded-tl-md border border-[#e3deff] bg-white/95 text-[#403054]"
                      : "rounded-tr-md bg-gradient-to-br from-[#f062d9] to-[#b47bff] text-white shadow-[0_12px_30px_rgba(165,75,196,0.55)]"
                  }`}
                >
                  {m.text}
                  {m.meta?.engine && (
                    <div className="text-[0.65rem] text-[#9ca3af] mt-1 italic">
                      {m.meta.engine}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="flex items-center gap-2 self-start rounded-full bg-white/80 px-3 py-1.5 text-[0.7rem] text-[#7e7a9b]">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Thinking...
            </div>
          )}
        </div>

        {/* QUICK CHIPS */}
        {suggestedChips.length > 0 && (
          <div className="px-4 py-2 border-t border-[#eee7ff] bg-gradient-to-b from-white/95 to-[#f5f0ff]/95">
            <div className="flex flex-wrap gap-2">
              {suggestedChips.map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => handleChipClick(chip)}
                  disabled={isLoading}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    chip.label.includes('🔒')
                      ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                      : 'bg-white/80 text-[#4f2a88] border border-[#cbc0ff] hover:bg-white'
                  } disabled:opacity-50`}
                >
                  {chip.label.includes('🔒') && <Lock className="h-3 w-3" />}
                  {chip.label.replace('🔒', '').trim()}
                </button>
              ))}
            </div>
          </div>
        )}

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
        </form>
      </motion.div>

      {/* PAYWALL MODAL */}
      <AnimatePresence>
        {showPaywall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPaywall(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-[#4f2a88] mb-2">
                Unlock Your Full 30-Day Plan
              </h2>
              <p className="text-gray-600 mb-6">
                You're thinking bigger than a quick fix. ALIGN Pro gives you a full 30-day structure, saved routines, and deeper adjustments as you grow.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-500">✓</span>
                  <span>Full 30-day structured plans</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-500">✓</span>
                  <span>Save unlimited routines</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-green-500">✓</span>
                  <span>Priority support</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleUpgrade}
                  className="flex-1 bg-gradient-to-br from-[#f062d9] to-[#b47bff] text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transition-shadow"
                >
                  Upgrade to ALIGN Pro – $9/mo
                </button>
                <button
                  onClick={() => setShowPaywall(false)}
                  className="px-4 py-3 text-gray-600 font-medium hover:text-gray-800"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

