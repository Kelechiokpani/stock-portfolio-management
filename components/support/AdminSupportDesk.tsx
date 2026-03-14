"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  User,
  ShieldCheck,
  CheckCheck,
  Paperclip,
  Clock,
  Banknote,
  Zap,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Message } from "@/app/services/features/market/marketApi";
import { useGetMeQuery } from "@/app/services/features/auth/authApi";

interface AdminSupportDeskProps {
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

export default function AdminSupportDesk({ user }: AdminSupportDeskProps) {
  // --- Internal State Management ---
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: response, isLoading } = useGetMeQuery();

  console.log(response, "Admin data in SupportTerminal...");
  // --- Mock Chat History ---
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      id: "1",
      sender: "user",
      text: "I just initiated a deposit request. When will it be approved?",
      timestamp: "10:30 AM",
      conversationId: user.id,
    },
    {
      id: "2",
      sender: "admin",
      text: "Hello! We are reviewing your request now. Please ensure you've sent the wire to the correct account.",
      timestamp: "10:32 AM",
      conversationId: user.id,
    },
  ]);

  // --- Auto-scroll Effect ---
  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen]);

  // --- Message Handler ---
  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "admin",
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      conversationId: user.id,
    };

    setChatHistory((prev) => [...prev, newMsg]);
    setMessage("");
    toast.success(`Message sent to ${user.fullName.split(" ")[0]}`);
  };

  return (
    <>
      {/* Admin Toggle Button - Floating Absolute */}
      <div className="fixed bottom-8 right-8 z-[100]">
        <Button
          onClick={() => setIsOpen(true)}
          className="relative h-16 w-16 rounded-[2rem] bg-zinc-950 dark:bg-zinc-100 dark:text-zinc-950 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all border-2 border-zinc-800 dark:border-zinc-300"
        >
          <LayoutDashboard className="h-7 w-7" />
          <span className="absolute -top-1 -right-1 flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-6 w-6 bg-blue-600 items-center justify-center text-[10px] font-bold text-white border-2 border-white dark:border-zinc-950">
              2
            </span>
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
              className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-[110]"
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
                  <div className="h-12 w-12 rounded-2xl bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center text-white shadow-lg border border-zinc-700">
                    <User size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm tracking-tight">
                      {user.fullName}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                        ADMIN_MODE: {user.id.substring(0, 12)}
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
                className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1c1c1f_1px,transparent_1px)] [background-size:20px_20px]"
              >
                {chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "admin" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className={`max-w-[85%] space-y-1.5`}>
                      <div
                        className={`p-4 rounded-2xl text-[13px] font-medium leading-relaxed border ${
                          msg.sender === "admin"
                            ? "bg-zinc-900 dark:bg-blue-600 text-white border-zinc-800 dark:border-blue-500 rounded-tr-none shadow-lg shadow-blue-500/10"
                            : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-100 dark:border-zinc-800 rounded-tl-none shadow-sm"
                        }`}
                      >
                        <pre className="whitespace-pre-wrap font-sans">
                          {msg.text}
                        </pre>
                      </div>
                      <div
                        className={`flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest ${
                          msg.sender === "admin"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <Clock size={10} /> {msg.timestamp}{" "}
                        {msg.sender === "admin" && (
                          <CheckCheck size={12} className="text-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                {/* Admin Quick Actions */}
                <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() =>
                      handleSend(
                        `🏦 **OFFICIAL WIRE INSTRUCTIONS**\n\nBank: JP Morgan Chase\nAccount: VaultStock Institutional LLC\nNumber: 9900112233\nMemo: REF-${user.id.substring(
                          0,
                          6
                        )}`
                      )
                    }
                    className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <Banknote size={14} className="text-emerald-500" /> Wire
                    Info
                  </button>
                  <button
                    onClick={() =>
                      handleSend(
                        "✅ Your deposit has been verified. The funds are now active in your portfolio."
                      )
                    }
                    className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <Zap size={14} className="text-amber-500" /> Confirm Deposit
                  </button>
                </div>

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
                    placeholder={`Reply to ${user.fullName.split(" ")[0]}...`}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-[13px] py-3 px-4 rounded-lg resize-none max-h-32"
                  />
                  <Button
                    onClick={() => handleSend(message)}
                    disabled={!message.trim()}
                    className="h-11 w-11 shrink-0 bg-zinc-900 dark:bg-blue-600 text-white rounded-2xl shadow-lg shadow-zinc-500/20 disabled:opacity-50"
                  >
                    <Send size={18} />
                  </Button>
                </div>

                <div className="mt-4 flex justify-center items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                  <ShieldCheck size={12} className="text-blue-500" /> Restricted
                  Admin Access
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
