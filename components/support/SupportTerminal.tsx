"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Headphones,
  PlusCircle,
  Lock,
  Copy,
  ShieldCheck,
  CheckCheck,
  Paperclip,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Message,
  useDepositFundsMutation,
} from "@/app/services/features/market/marketApi";
import Logo from "../Layout/Logo";
import { useGetMeQuery } from "@/app/services/features/auth/authApi";

// --- TYPES ---

export default function SupportTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isDepositFormOpen, setIsDepositFormOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: response, isLoading } = useGetMeQuery();

  console.log(response, "User data in SupportTerminal...");

  // --- RTK Query Hooks ---
  const [depositFunds, { isLoading: isDepositing }] = useDepositFundsMutation();

  // --- State for Local Chat History ---
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      id: "init",
      sender: "admin",
      text: "Vault Terminal Connected. How can we facilitate your assets today?",
      timestamp: "09:00 AM",
      conversationId: "system",
    },
    {
      id: "h1",
      sender: "user",
      text: "Hello, I was reviewing my monthly portfolio performance. I noticed a slight lag in my bond yields. Is everything on track?",
      timestamp: "09:05 AM",
      conversationId: "system",
    },
    {
      id: "h2",
      sender: "admin",
      text: "Checking your account status... Yes, the lag you're seeing is due to the recent federal interest rate adjustments. Your core assets remain in the top 5% of performance benchmarks.",
      timestamp: "09:07 AM",
      conversationId: "system",
    },
    {
      id: "h3",
      sender: "user",
      text: "That's reassuring. In that case, I'd like to increase my liquidity by making a new deposit. Can you help me with that?",
      timestamp: "09:10 AM",
      conversationId: "system",
    },
    {
      id: "h4",
      sender: "admin",
      text: "Certainly. Please use the 'Request Deposit' action below to initialize the institutional transfer protocol.",
      timestamp: "09:11 AM",
      conversationId: "system",
    },
  ]);

  // --- Auto-scroll Effect ---
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isDepositFormOpen, isOpen]);

  // --- Message Handler ---
  const handleSend = async (
    text: string,
    sender: "user" | "admin" = "user"
  ) => {
    if (!text.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      conversationId: response?.user?.id,
    };

    setChatHistory((prev) => [...prev, newMsg]);
    setMessage("");
  };

  // --- Deposit Submission Handler ---
  const handleDepositSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get("amount"));
    const fullName = formData.get("fullName") as string;

    try {
      // Trigger API call with requested parameters
      await depositFunds({
        userId: response?.user?.id,
        method: "wire_transfer",
        fullName,
        amount,
        description: `Deposit request by ${fullName}`,
      }).unwrap();

      // UI Feedback in Chat
      handleSend(
        `🚀 **DEPOSIT INITIALIZED**\n**User ID:** ${
          response?.user?.id
        }\n**Beneficiary:** ${fullName}\n**Amount:** $${amount.toLocaleString()}`
      );
      setIsDepositFormOpen(false);
      toast.success("Deposit Request Sent to Compliance");

      // Simulated Admin Response providing the wire details
      setTimeout(() => {
        handleSend(
          `🏦 **OFFICIAL WIRE INSTRUCTIONS**\n\n**Bank:** JP Morgan Chase\n**Account:** VaultStock Institutional LLC\n**Number:** 9900112233\n**Routing:** 021000021\n**Memo:** REF-${
            response?.user?.id
          }-${Math.floor(1000 + Math.random() * 9000)}`,
          "admin"
        );
      }, 1500);
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Deposit protocol failed. Please contact support."
      );
    }
  };

  return (
    <>
      {/* Absolute Trigger Button */}
      <div className="fixed bottom-8 right-8 z-[100]">
        <Button
          onClick={() => setIsOpen(true)}
          className="relative h-16 w-16 rounded-[2rem] bg-zinc-900 dark:bg-blue-600 shadow-2xl hover:scale-110 active:scale-95 transition-all"
        >
          <MessageSquare className="text-white h-7 w-7" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>

            <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-white dark:border-zinc-950"></span>
          </span>
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-zinc-950/20 backdrop-blur-sm z-[110]"
            />

            {/* Support Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-[480px] bg-white dark:bg-zinc-950 border-l border-zinc-100 dark:border-zinc-800 shadow-2xl z-[120] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                    <Headphones size={24} />
                  </div>
                  <div>
                    <Logo />
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        Agent Connection Secure
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl"
                >
                  <X size={20} />
                </Button>
              </div>

              {/* Chat Canvas */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
              >
                {chatHistory.map((msg) => {
                  const isBankDetails = msg.text.includes("🏦");
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div className={`max-w-[85%] space-y-1.5`}>
                        <div
                          className={`p-4 rounded-2xl text-[13px] font-medium leading-relaxed border ${
                            msg.sender === "user"
                              ? "bg-blue-600 text-white border-blue-500 rounded-tr-none shadow-lg shadow-blue-500/10"
                              : isBankDetails
                              ? "bg-zinc-900 text-zinc-100 border-zinc-700 rounded-tl-none shadow-xl"
                              : "bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-100 dark:border-zinc-800 rounded-tl-none"
                          }`}
                        >
                          <pre className="whitespace-pre-wrap font-sans">
                            {msg.text}
                          </pre>
                          {isBankDetails && (
                            <Button
                              variant="secondary"
                              size="sm"
                              className="mt-4 w-full h-9 text-[10px] font-black uppercase tracking-widest bg-zinc-800 hover:bg-zinc-700"
                              onClick={() => {
                                navigator.clipboard.writeText(msg.text);
                                toast.success("Wire details copied");
                              }}
                            >
                              <Copy size={12} className="mr-2" /> Copy Wire
                              Details
                            </Button>
                          )}
                        </div>
                        <div
                          className={`flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest ${
                            msg.sender === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          {msg.timestamp}{" "}
                          {msg.sender === "user" && (
                            <CheckCheck size={12} className="text-blue-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Deposit Initialization Form */}
                <AnimatePresence>
                  {isDepositFormOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-6 rounded-[2rem] space-y-4 shadow-inner"
                    >
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
                        <PlusCircle size={14} /> Fund Request Initialization
                      </div>
                      <form
                        onSubmit={handleDepositSubmit}
                        className="space-y-3"
                      >
                        <Input
                          name="fullName"
                          placeholder="Full Registered Name"
                          required
                          className="h-11 rounded-xl text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                        <Input
                          name="amount"
                          type="number"
                          placeholder="Amount to Deposit ($)"
                          required
                          className="h-11 rounded-xl text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />
                        <Input
                          name="description"
                          placeholder="System description (e.g. 'Deposit for trading account')"
                          required
                          className="h-11 rounded-xl text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        />

                        <div className="flex gap-2 pt-2">
                          <Button
                            type="submit"
                            disabled={isDepositing}
                            className="flex-1 h-11 rounded-xl bg-blue-600 text-[10px] font-black uppercase tracking-widest"
                          >
                            {isDepositing
                              ? "Processing..."
                              : "Authorize Request"}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsDepositFormOpen(false)}
                            className="h-11 rounded-xl text-[10px] font-black uppercase tracking-widest"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-zinc-100 dark:border-zinc-800">
                {!isDepositFormOpen && (
                  <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                    <button
                      onClick={() => setIsDepositFormOpen(true)}
                      className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                    >
                      <PlusCircle size={14} className="text-blue-600" /> Request
                      Deposit
                    </button>
                  </div>
                )}
                <div className="flex items-end gap-3 bg-zinc-100/50 dark:bg-zinc-900/80 p-2 rounded-3xl border border-zinc-200 dark:border-zinc-800">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 shrink-0 text-zinc-400 hover:text-blue-500"
                  >
                    <Paperclip size={20} />
                  </Button>
                  <textarea
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      (e.preventDefault(), handleSend(message))
                    }
                    placeholder="Message Support..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-[13px] py-3 px-4 rounded-lg resize-none max-h-32"
                  />
                  <Button
                    onClick={() => handleSend(message)}
                    disabled={!message.trim()}
                    className="h-11 w-11 shrink-0 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20 disabled:opacity-50"
                  >
                    <Send size={18} />
                  </Button>
                </div>
                <div className="mt-4 flex justify-center items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                  <ShieldCheck size={12} className="text-emerald-500" /> AES-256
                  Protected
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
