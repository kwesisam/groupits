'use client'
import React, { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "bot"; content: string };

function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage: Message = { role: "user", content: input };
    setMessages((msgs: Message[]) => [...msgs, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/openai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages
              .filter((m: Message) => m.role === "user")
              .map((m: Message) => ({ role: "user", content: m.content })),
            userMessage,
          ],
        }),
      });
      const data = await res.json();
      setMessages((msgs: Message[]) => [
        ...msgs,
        { role: "bot", content: data.answer || "Sorry, I couldn't generate a response." },
      ]);
    } catch (err) {
      setMessages((msgs: Message[]) => [
        ...msgs,
        { role: "bot", content: "Error: Could not reach the server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Avatars
  const botAvatar = (
    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center border-2 border-rose-200 shadow-md">
      {/* Health/medical icon */}
      <svg width="28" height="28" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="24" fill="#ffe4e6"/><path d="M24 14v20M14 24h20" stroke="#e11d48" strokeWidth="3" strokeLinecap="round"/></svg>
    </div>
  );
  const userAvatar = (
    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>
    </div>
  );

  return (
    <div className="relative w-full h-[80vh] max-w-5xl mx-auto flex bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden mt-10 border border-rose-100 dark:border-rose-300">
      {/* Subtle blurred background shape for depth */}
      <div className="absolute left-[-10%] top-[-20%] w-[400px] h-[400px] bg-rose-100 rounded-full blur-3xl opacity-60 -z-10 pointer-events-none" />
      {/* Sidebar */}
      <aside className="hidden sm:flex flex-col w-56 bg-rose-50 dark:bg-rose-900/30 border-r border-rose-100 dark:border-rose-800 p-6 gap-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="24" fill="#ffe4e6"/><path d="M24 14v20M14 24h20" stroke="#e11d48" strokeWidth="3" strokeLinecap="round"/></svg>
          </div>
          <span className="font-bold text-lg text-rose-700 tracking-tight">HealthBot</span>
        </div>
        <button
          className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg px-4 py-2 font-medium transition-colors border border-rose-200 shadow"
          onClick={() => setMessages([])}
        >
          + New Health Chat
        </button>
        <div className="flex-1" />
        <div className="text-xs text-rose-700/70">Health AI Assistant</div>
      </aside>
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative z-10">
        {/* Header */}
        <header className="h-16 flex items-center px-6 border-b border-rose-100 dark:border-rose-800 bg-white dark:bg-rose-900/10 backdrop-blur-sm">
          <span className="font-semibold text-lg text-rose-700">Health AI Assistant</span>
        </header>
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-8 py-6 bg-white dark:bg-rose-900/5">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16">
              <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center shadow-md">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="24" fill="#ffe4e6"/><path d="M24 14v20M14 24h20" stroke="#e11d48" strokeWidth="3" strokeLinecap="round"/></svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-rose-700">Welcome to HealthBot!</h2>
              <p className="text-rose-700/80 max-w-md mx-auto">HealthBot is your personal AI-powered health assistant. Ask me anything about health, wellness, symptoms, or healthy living. I can provide information, tips, and support for your well-being. Please note: I do not provide medical diagnoses or treatment plans.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} items-end`}>
                  {msg.role === "user" ? userAvatar : botAvatar}
                  <div className={`px-5 py-3 rounded-2xl text-base max-w-[75%] break-words shadow-sm ${msg.role === "user" ? "bg-gray-100 text-gray-900" : "bg-rose-50 text-rose-900 border border-rose-100"}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3 items-end">
                  {botAvatar}
                  <div className="px-5 py-3 rounded-2xl text-base max-w-[75%] bg-rose-50 text-rose-900 border border-rose-100 opacity-70 shadow-sm">
                    ...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        {/* Input Bar */}
        <form
          className="sticky bottom-0 border-t border-rose-100 dark:border-rose-800 bg-white dark:bg-rose-900/10 px-4 py-4 flex items-center gap-2"
          onSubmit={e => { e.preventDefault(); handleSend(); }}
        >
          <input
            className="flex-1 rounded-full border border-rose-200 dark:border-rose-800 px-4 py-3 text-base bg-white dark:bg-rose-900/10 focus:outline-none focus:ring-2 focus:ring-rose-400"
            type="text"
            placeholder="Ask a health question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
            disabled={loading}
          />
          <button
            className="bg-rose-500 hover:bg-rose-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl disabled:opacity-50 border border-rose-200 shadow"
            type="submit"
            disabled={loading}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatBot; 