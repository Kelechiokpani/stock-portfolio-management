"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Headphones,
  PlusCircle,
  Copy,
  ShieldCheck,
  CheckCheck,
  Paperclip,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  useDepositFundsMutation,
  useGetChatHistoryQuery,
  useSendMessageMutation,
} from "@/app/services/features/market/marketApi";
import Logo from "../Layout/Logo";
import { useGetMeQuery } from "@/app/services/features/auth/authApi";

export default function SupportTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isDepositFormOpen, setIsDepositFormOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- RTK Query Hooks ---
  const { data: userData } = useGetMeQuery();

  // Pass undefined to trigger the User-facing chat history
  const { data: chatHistory, isLoading: isHistoryLoading } =
    useGetChatHistoryQuery(undefined, {
      skip: !isOpen, // Only fetch when terminal is open
      pollingInterval: 5000, // Optional: Poll every 5s for new admin replies
    });

  // Ensure we always have an array for the map function
  const messagesArray = Array.isArray(chatHistory) ? chatHistory : [];

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [depositFunds, { isLoading: isDepositing }] = useDepositFundsMutation();

  const userId = userData?.user?.id || userData?.user?._id;

  // --- Auto-scroll Effect ---
  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isDepositFormOpen, isOpen]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isSending) return;

    try {
      // Logic from API: No ID passed here means it sends to /support/chat/send
      await sendMessage({ text }).unwrap();
      setMessage("");
      // Success toast is optional since the message will appear in chat via tag invalidation
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to transmit message.");
    }
  };

  const handleDepositSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      userId,
      method: "wire_transfer",
      fullName: formData.get("fullName") as string,
      amount: Number(formData.get("amount")),
      description: formData.get("description") as string,
    };

    try {
      await depositFunds(payload).unwrap();
      setIsDepositFormOpen(false);
      toast.success("Deposit Request Sent to Compliance");

      // Auto-send a message to support about the deposit
      handleSend(`Initialized deposit of $${payload.amount.toLocaleString()}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Deposit protocol failed.");
    }
  };

  return (
    <>
      {/* Absolute Trigger Button */}
      <div className="fixed bottom-8 right-8 z-[100]">
        <Button
          onClick={() => setIsOpen(true)}
          className="relative h-16 w-16 rounded-[2rem] bg-zinc-900 dark:bg-primary shadow-2xl hover:scale-110 active:scale-95 transition-all"
        >
          <MessageSquare className="text-white h-7 w-7" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-white dark:border-zinc-950"></span>
          </span>
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-zinc-950/20 backdrop-blur-sm z-[110]"
            />

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
                  <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
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
                {isHistoryLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="animate-spin text-primary" />
                  </div>
                ) : (
                  messagesArray.map((msg: any) => {
                    const isBankDetails = msg.text.includes("🏦");
                    const isUser = msg.sender === "user" || msg.role === "user";
                    return (
                      <div
                        key={msg.id || msg._id}
                        className={`flex ${
                          isUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div className="max-w-[85%] space-y-1.5">
                          <div
                            className={`p-4 rounded-2xl text-[13px] font-medium border ${
                              isUser
                                ? "bg-primary text-primary-foreground border-primary rounded-tr-none shadow-lg shadow-primary/10"
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
                              isUser ? "justify-end" : "justify-start"
                            }`}
                          >
                            {msg.timestamp}
                            {isUser && (
                              <CheckCheck size={12} className="text-primary" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Deposit Form UI remains the same... */}
                <AnimatePresence>
                  {isDepositFormOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-6 rounded-[2rem] space-y-4 shadow-inner"
                    >
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
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
                          className="h-11 rounded-xl text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary"
                        />
                        <Input
                          name="amount"
                          type="number"
                          placeholder="Amount ($)"
                          required
                          className="h-11 rounded-xl text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary"
                        />
                        <Input
                          name="description"
                          placeholder="Description"
                          required
                          className="h-11 rounded-xl text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary"
                        />
                        <div className="flex gap-2 pt-2">
                          <Button
                            type="submit"
                            disabled={isDepositing}
                            className="flex-1 h-11 rounded-xl bg-primary text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20"
                          >
                            {isDepositing
                              ? "Processing..."
                              : "Authorize Request"}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsDepositFormOpen(false)}
                            className="h-11 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors"
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
              <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                {!isDepositFormOpen && (
                  <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                    <button
                      onClick={() => setIsDepositFormOpen(true)}
                      className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all"
                    >
                      <PlusCircle size={14} className="text-primary" /> Request
                      Deposit
                    </button>
                  </div>
                )}
                <div className="flex items-end gap-3 bg-zinc-100/50 dark:bg-zinc-900/80 p-2 rounded-3xl border border-zinc-200 dark:border-zinc-800 focus-within:ring-2 ring-primary/20 transition-all">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 shrink-0 text-zinc-400 hover:text-primary"
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
                    className="flex-1 bg-transparent border-none focus:ring-0 text-[13px] py-3 px-4 rounded-lg resize-none max-h-32 dark:text-zinc-100"
                  />
                  <Button
                    onClick={() => handleSend(message)}
                    disabled={!message.trim() || isSending}
                    className="h-11 w-11 shrink-0 bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {isSending ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Send size={18} />
                    )}
                  </Button>
                </div>
                <div className="mt-4 flex justify-center items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                  <ShieldCheck size={12} className="text-primary" /> AES-256
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

// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   MessageSquare,
//   X,
//   Send,
//   Headphones,
//   PlusCircle,
//   Copy,
//   ShieldCheck,
//   CheckCheck,
//   Paperclip,
//   Loader2,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import {
//   useDepositFundsMutation,
//   useGetChatHistoryQuery,
//   useSendMessageMutation,
// } from "@/app/services/features/market/marketApi";
// import Logo from "../Layout/Logo";
// import { useGetMeQuery } from "@/app/services/features/auth/authApi";

// export default function SupportTerminal() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [message, setMessage] = useState("");
//   const [isDepositFormOpen, setIsDepositFormOpen] = useState(false);
//   const scrollRef = useRef<HTMLDivElement>(null);

//   // --- RTK Query Hooks ---
//   const { data: userData } = useGetMeQuery();
//   const { data: chatHistory, isLoading: isHistoryLoading } =
//     useGetChatHistoryQuery();

//   console.log(chatHistory, "chat....");

//   const messagesArray = Array.isArray(chatHistory) ? chatHistory : [];

//   const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
//   const [depositFunds, { isLoading: isDepositing }] = useDepositFundsMutation();

//   const userId = userData?.user?.id || userData?.user?._id;

//   // --- Auto-scroll Effect ---
//   useEffect(() => {
//     if (scrollRef.current && isOpen) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [chatHistory, isDepositFormOpen, isOpen]);

//   // --- Message Handler ---
//   const handleSend = async (text: string) => {
//     if (!text.trim() || isSending) return;

//     try {
//       const chat = await sendMessage({ text }).unwrap();
//       if (chat?.message) {
//         toast.success("Message sent to support successfully");
//         setMessage("");
//       } else {
//         toast.error("Unexpected response from server.");
//       }
//     } catch (err: any) {
//       toast.error(err?.data?.message || "Failed to transmit message.");
//     }
//   };

//   // --- Deposit Submission Handler ---
//   const handleDepositSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     const amount = Number(formData.get("amount"));
//     const fullName = formData.get("fullName") as string;
//     const description = formData.get("description") as string;

//     try {
//       await depositFunds({
//         userId,
//         method: "wire_transfer",
//         fullName,
//         amount,
//         description,
//       }).unwrap();

//       setIsDepositFormOpen(false);
//       toast.success("Deposit Request Sent to Compliance");
//     } catch (err: any) {
//       toast.error(err?.data?.message || "Deposit protocol failed.");
//     }
//   };

//   return (
//     <>
//       {/* Absolute Trigger Button */}
//       <div className="fixed bottom-8 right-8 z-[100]">
//         <Button
//           onClick={() => setIsOpen(true)}
//           className="relative h-16 w-16 rounded-[2rem] bg-zinc-900 dark:bg-primary shadow-2xl hover:scale-110 active:scale-95 transition-all"
//         >
//           <MessageSquare className="text-white h-7 w-7" />
//           <span className="absolute -top-1 -right-1 flex h-5 w-5">
//             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
//             <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-white dark:border-zinc-950"></span>
//           </span>
//         </Button>
//       </div>

//       <AnimatePresence>
//         {isOpen && (
//           <>
//             {/* Backdrop */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setIsOpen(false)}
//               className="fixed inset-0 bg-zinc-950/20 backdrop-blur-sm z-[110]"
//             />

//             {/* Support Panel */}
//             <motion.div
//               initial={{ x: "100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "100%" }}
//               transition={{ type: "spring", damping: 25, stiffness: 200 }}
//               className="fixed right-0 top-0 h-full w-full max-w-[480px] bg-white dark:bg-zinc-950 border-l border-zinc-100 dark:border-zinc-800 shadow-2xl z-[120] flex flex-col"
//             >
//               {/* Header */}
//               <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
//                 <div className="flex items-center gap-4">
//                   <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
//                     <Headphones size={24} />
//                   </div>
//                   <div>
//                     <Logo />
//                     <div className="flex items-center gap-2 mt-1.5">
//                       <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
//                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
//                         Agent Connection Secure
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setIsOpen(false)}
//                   className="rounded-xl"
//                 >
//                   <X size={20} />
//                 </Button>
//               </div>

//               {/* Chat Canvas */}
//               <div
//                 ref={scrollRef}
//                 className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
//               >
//                 {isHistoryLoading ? (
//                   <div className="flex items-center justify-center h-full">
//                     <Loader2 className="animate-spin text-zinc-300" />
//                   </div>
//                 ) : (
//                   messagesArray?.map((msg: any) => {
//                     const isBankDetails = msg.text.includes("🏦");
//                     const isUser = msg.sender === "user";
//                     return (
//                       <div
//                         key={msg.id || msg._id}
//                         className={`flex ${
//                           isUser ? "justify-end" : "justify-start"
//                         }`}
//                       >
//                         <div className={`max-w-[85%] space-y-1.5`}>
//                           <div
//                             className={`p-4 rounded-2xl text-[13px] font-medium leading-relaxed border ${
//                               isUser
//                                 ? "bg-primary text-primary-foreground border-primary rounded-tr-none shadow-lg shadow-primary/10"
//                                 : isBankDetails
//                                 ? "bg-zinc-900 text-zinc-100 border-zinc-700 rounded-tl-none shadow-xl"
//                                 : "bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-100 dark:border-zinc-800 rounded-tl-none"
//                             }`}
//                           >
//                             <pre className="whitespace-pre-wrap font-sans">
//                               {msg.text}
//                             </pre>
//                             {isBankDetails && (
//                               <Button
//                                 variant="secondary"
//                                 size="sm"
//                                 className="mt-4 w-full h-9 text-[10px] font-black uppercase tracking-widest bg-zinc-800 hover:bg-zinc-700"
//                                 onClick={() => {
//                                   navigator.clipboard.writeText(msg.text);
//                                   toast.success("Wire details copied");
//                                 }}
//                               >
//                                 <Copy size={12} className="mr-2" /> Copy Wire
//                                 Details
//                               </Button>
//                             )}
//                           </div>
//                           <div
//                             className={`flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest ${
//                               isUser ? "justify-end" : "justify-start"
//                             }`}
//                           >
//                             {msg.timestamp}{" "}
//                             {isUser && (
//                               <CheckCheck size={12} className="text-primary" />
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })
//                 )}

//                 {/* Deposit Initialization Form */}
//                 <AnimatePresence>
//                   {isDepositFormOpen && (
//                     <motion.div
//                       initial={{ opacity: 0, scale: 0.95, y: 10 }}
//                       animate={{ opacity: 1, scale: 1, y: 0 }}
//                       exit={{ opacity: 0, scale: 0.95 }}
//                       className="bg-primary/5 dark:bg-primary/10 border border-primary/20 p-6 rounded-[2rem] space-y-4 shadow-inner"
//                     >
//                       <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
//                         <PlusCircle size={14} /> Fund Request Initialization
//                       </div>
//                       <form
//                         onSubmit={handleDepositSubmit}
//                         className="space-y-3"
//                       >
//                         <Input
//                           name="fullName"
//                           placeholder="Full Registered Name"
//                           required
//                           className="h-11 rounded-xl text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary"
//                         />
//                         <Input
//                           name="amount"
//                           type="number"
//                           placeholder="Amount to Deposit ($)"
//                           required
//                           className="h-11 rounded-xl text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary"
//                         />
//                         <Input
//                           name="description"
//                           placeholder="Description (e.g. Trading Capital)"
//                           required
//                           className="h-11 rounded-xl text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary"
//                         />

//                         <div className="flex gap-2 pt-2">
//                           <Button
//                             type="submit"
//                             disabled={isDepositing}
//                             className="flex-1 h-11 rounded-xl bg-primary text-[10px] font-black uppercase tracking-widest text-primary-foreground"
//                           >
//                             {isDepositing
//                               ? "Processing..."
//                               : "Authorize Request"}
//                           </Button>
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             onClick={() => setIsDepositFormOpen(false)}
//                             className="h-11 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-primary"
//                           >
//                             Cancel
//                           </Button>
//                         </div>
//                       </form>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>

//               {/* Input Area */}
//               <div className="p-6 border-t border-zinc-100 dark:border-zinc-800">
//                 {!isDepositFormOpen && (
//                   <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
//                     <button
//                       onClick={() => setIsDepositFormOpen(true)}
//                       className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-primary hover:border-primary/30 transition-all"
//                     >
//                       <PlusCircle size={14} className="text-primary" /> Request
//                       Deposit
//                     </button>
//                   </div>
//                 )}
//                 <div className="flex items-end gap-3 bg-zinc-100/50 dark:bg-zinc-900/80 p-2 rounded-3xl border border-zinc-200 dark:border-zinc-800">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-11 w-11 shrink-0 text-zinc-400 hover:text-primary"
//                   >
//                     <Paperclip size={20} />
//                   </Button>
//                   <textarea
//                     rows={1}
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     onKeyDown={(e) =>
//                       e.key === "Enter" &&
//                       !e.shiftKey &&
//                       (e.preventDefault(), handleSend(message))
//                     }
//                     placeholder="Message Support..."
//                     className="flex-1 bg-transparent border-none focus:ring-0 text-[13px] py-3 px-4 rounded-lg resize-none max-h-32 dark:text-zinc-100"
//                   />
//                   <Button
//                     onClick={() => handleSend(message)}
//                     disabled={!message.trim() || isSending}
//                     className="h-11 w-11 shrink-0 bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/20 disabled:opacity-50"
//                   >
//                     {isSending ? (
//                       <Loader2 className="animate-spin" size={18} />
//                     ) : (
//                       <Send size={18} />
//                     )}
//                   </Button>
//                 </div>
//                 <div className="mt-4 flex justify-center items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
//                   <ShieldCheck size={12} className="text-emerald-500" /> AES-256
//                   Protected
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }
