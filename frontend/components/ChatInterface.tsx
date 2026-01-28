"use client";
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Cpu, Satellite, Plus, MessageSquare, FileText, ChevronLeft, ChevronRight, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    sources?: string[];
}

interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    timestamp: number;
}

interface ChatInterfaceProps {
    externalQuery?: string | null;
}

export default function ChatInterface({ externalQuery }: ChatInterfaceProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [sessions, setSessions] = useState<ChatSession[]>([{
        id: '1',
        title: 'Initial Mission Briefing',
        messages: [{ id: 1, text: "System Online. Connected to ISRO Mainframe.\nHello, I am your Mission Assistant. How can I help you today?", sender: 'ai' }],
        timestamp: 1706428800000
    }]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('isro_chat_sessions');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setSessions(parsed);
                        setActiveSessionId(parsed[0].id);
                    }
                } catch (e) {
                    console.error("Failed to parse saved sessions:", e);
                }
            }
            setIsLoaded(true);
        }
    }, []);
    const [activeSessionId, setActiveSessionId] = useState<string>('1');
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

    useEffect(() => {
        if (isLoaded && typeof window !== 'undefined') {
            localStorage.setItem('isro_chat_sessions', JSON.stringify(sessions));
        }
    }, [sessions, isLoaded]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [activeSession.messages, loading]);

    useEffect(() => {
        if (externalQuery) {
            handleSend(externalQuery);
        }
    }, [externalQuery]);

    const createNewChat = () => {
        const newId = Date.now().toString();
        const newSession: ChatSession = {
            id: newId,
            title: 'New Analytical Thread',
            messages: [{ id: 1, text: "New Mission Thread Initialized. Ready for data transmission.", sender: 'ai' }],
            timestamp: Date.now()
        };
        setSessions([newSession, ...sessions]);
        setActiveSessionId(newId);
    };

    const handleSend = async (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = { id: Date.now(), text: text, sender: 'user' };

        // Update session locally
        const updatedSessions = sessions.map(s => {
            if (s.id === activeSessionId) {
                // Update title if it's the first real question
                const newTitle = s.messages.length <= 1 ? text.substring(0, 30) + (text.length > 30 ? '...' : '') : s.title;
                return { ...s, messages: [...s.messages, userMsg], title: newTitle };
            }
            return s;
        });
        setSessions(updatedSessions);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: text })
            });
            const data = await res.json();

            const aiMsg: Message = {
                id: Date.now() + 1,
                text: data.response,
                sender: 'ai',
                sources: data.sources
            };

            setSessions(prev => prev.map(s =>
                s.id === activeSessionId ? { ...s, messages: [...s.messages, aiMsg] } : s
            ));
        } catch (e) {
            const errorMsg: Message = { id: Date.now() + 1, text: "⚠ Signal Lost. Check Backend Connection.", sender: 'ai' };
            setSessions(prev => prev.map(s =>
                s.id === activeSessionId ? { ...s, messages: [...s.messages, errorMsg] } : s
            ));
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = () => handleSend(input);

    return (
        <div className="flex h-full w-full gap-6 items-start relative">

            {/* Sidebar Box */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ width: 0, opacity: 0, x: -20 }}
                        animate={{ width: 300, opacity: 1, x: 0 }}
                        exit={{ width: 0, opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="h-full border border-white/10 bg-black/40 glass-morphism-heavy rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <h3 className="text-white font-space font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                <LayoutDashboard size={14} className="text-cyan-400" />
                                Mission History
                            </h3>
                            <button onClick={createNewChat} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 transition-all active:scale-95 border border-white/5">
                                <Plus size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {sessions.map(s => (
                                <div key={s.id} className="relative group">
                                    <button
                                        onClick={() => setActiveSessionId(s.id)}
                                        className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all text-left border
                                            ${activeSessionId === s.id
                                                ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-white shadow-lg shadow-cyan-500/10'
                                                : 'border-transparent text-white/40 hover:bg-white/5 hover:text-white/60'}
                                        `}
                                    >
                                        <MessageSquare size={16} className={activeSessionId === s.id ? 'text-cyan-400' : ''} />
                                        <div className="flex-1 truncate text-sm font-medium leading-none">{s.title}</div>
                                    </button>
                                    {sessions.length > 1 && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const filtered = sessions.filter(sess => sess.id !== s.id);
                                                setSessions(filtered);
                                                if (activeSessionId === s.id) setActiveSessionId(filtered[0].id);
                                            }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 text-red-500/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                        >
                                            <Plus size={14} className="rotate-45" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="p-5 border-t border-white/5 bg-black/40">
                            <div className="flex items-center gap-3 text-[10px] font-mono text-cyan-400/40 uppercase tracking-[0.2em]">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                                Uplink Active
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Chat Box */}
            <div className="flex-1 flex flex-col h-full bg-black/40 rounded-[2.5rem] overflow-hidden glass-morphism-heavy border border-white/10 shadow-2xl relative transition-all duration-500">
                {/* Header */}
                <div className="p-5 border-b border-white/5 bg-white/[0.03] flex items-center justify-between backdrop-blur-xl z-20">
                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={`p-2.5 rounded-xl border transition-all duration-300 ${sidebarOpen ? 'bg-white/5 border-white/10 text-white/40 hover:text-white' : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/30'}`}
                        >
                            {sidebarOpen ? <ChevronLeft size={20} /> : <div className="flex items-center gap-2 px-1"><LayoutDashboard size={18} /><span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Archives</span></div>}
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30 shadow-inner">
                                    <Satellite className="text-cyan-400" size={22} />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black animate-pulse" />
                            </div>
                            <div>
                                <h2 className="font-bold text-lg text-white font-space tracking-tight flex items-center gap-2">
                                    ORBIT <span className="text-cyan-400">AI</span>
                                    <div className="h-4 w-px bg-white/10 mx-1" />
                                    <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full text-cyan-400/80 uppercase font-mono tracking-wider truncate max-w-[150px] md:max-w-[300px]">{activeSession.title}</span>
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 z-10 custom-scrollbar scroll-smooth" ref={scrollRef}>
                    <AnimatePresence initial={false}>
                        {activeSession.messages.map((msg) => (
                            <motion.div
                                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className="flex flex-col gap-3 max-w-[85%] md:max-w-[75%] lg:max-w-[70%]">
                                    <div className={`
                                        p-6 md:p-7 flex gap-5 shadow-2xl backdrop-blur-xl relative overflow-hidden group transition-all duration-300
                                        ${msg.sender === 'user'
                                            ? 'bg-gradient-to-br from-blue-600/90 to-indigo-700/90 text-white rounded-[2.5rem] rounded-tr-sm border border-white/20'
                                            : 'bg-white/[0.03] border border-white/10 text-cyan-50 rounded-[2.5rem] rounded-tl-sm hover:bg-white/[0.05] shadow-[0_0_40px_rgba(0,0,0,0.2)]'}
                                    `}>
                                        {msg.sender === 'ai' && (
                                            <div className="mt-1 min-w-[40px] h-[40px] rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                                <Bot size={22} className="text-white" />
                                            </div>
                                        )}

                                        <div className="leading-relaxed text-sm md:text-base prose prose-invert prose-p:leading-relaxed prose-li:my-2 max-w-none w-full">
                                            {msg.sender === 'ai' ? (
                                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                                            ) : (
                                                <div className="whitespace-pre-wrap font-medium tracking-wide">{msg.text}</div>
                                            )}
                                        </div>

                                        {msg.sender === 'user' && (
                                            <div className="mt-1 min-w-[40px] h-[40px] rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                                                <User size={22} className="text-white" />
                                            </div>
                                        )}

                                        {/* Ambient glow for AI messages */}
                                        {msg.sender === 'ai' && <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-cyan-500/15 transition-colors" />}
                                    </div>

                                    {/* Sources */}
                                    {msg.sender === 'ai' && msg.sources && msg.sources.length > 0 && (
                                        <div className="flex flex-wrap gap-2 px-6 mt-1">
                                            {msg.sources.map((src, i) => (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.15 + (0.05 * i) }}
                                                    key={i}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] font-medium text-white/40 hover:bg-white/[0.06] hover:text-cyan-400 hover:border-cyan-500/30 transition-all cursor-default shadow-sm"
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40" />
                                                    <FileText size={13} />
                                                    {src}
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}

                        {loading && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex justify-start"
                            >
                                <div className="bg-white/[0.03] border border-white/10 p-5 rounded-[2rem] rounded-tl-sm flex items-center gap-4 shadow-xl backdrop-blur-md">
                                    <div className="relative">
                                        <Cpu size={24} className="text-cyan-400 animate-spin-slow" />
                                        <div className="absolute inset-0 bg-cyan-400/20 blur-lg rounded-full animate-pulse" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex gap-2 h-1.5 items-end">
                                            <motion.span animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 bg-cyan-400 rounded-full" />
                                            <motion.span animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 bg-cyan-400/60 rounded-full" />
                                            <motion.span animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 bg-cyan-400/30 rounded-full" />
                                        </div>
                                        <span className="text-[10px] text-cyan-400/60 font-mono font-bold uppercase tracking-widest leading-none">Synthesizing Response...</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Input Area */}
                <div className="p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent border-t border-white/5 z-20 backdrop-blur-md">
                    <div className="max-w-4xl mx-auto bg-white/[0.03] border border-white/10 rounded-[2rem] p-3 flex items-center gap-3 focus-within:ring-2 focus-within:ring-cyan-500/30 focus-within:border-cyan-500/50 transition-all duration-300 shadow-2xl group/input">
                        <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl border border-cyan-500/20 group-focus-within/input:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all">
                            <Sparkles size={22} className="text-cyan-400" />
                        </div>
                        <input
                            className="flex-1 bg-transparent border-none text-white placeholder-white/20 focus:outline-none px-2 font-medium text-base md:text-lg"
                            placeholder="Consult ISRO Neural Core..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-2xl py-4 px-8 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-500/20 disabled:opacity-30 disabled:hover:scale-100 font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-3 border border-white/10"
                        >
                            <span>Transmit</span>
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
