"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { WeatherType } from "@/lib/recommendation";

interface WeatherMateProps {
    weather: { type: WeatherType; temp: number; city: string; isNight: boolean } | null;
    mood: string | null;
    mbti: string | null;
}

interface Message {
    role: 'user' | 'assistant';
    text: string;
}

export default function WeatherMate({ weather, mood, mbti }: WeatherMateProps) {
    const { t, language } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [hasBeenDismissed, setHasBeenDismissed] = useState(false);

    // Chat State
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Show bubble after 2 seconds if not dismissed
        if (!hasBeenDismissed) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [hasBeenDismissed]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    const handleDismiss = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsVisible(false);
        setHasBeenDismissed(true);
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen && messages.length === 0) {
            // Add initial greeting based on weather
            const initialGreeting = getInitialGreeting();
            setMessages([{ role: 'assistant', text: initialGreeting }]);
        }
    };

    const getInitialGreeting = () => {
        if (!weather) return t.stats.weatherMate.Default;

        // Night specific greetings could be added here if we had them in dictionary
        // For now, we rely on the chat API for dynamic night responses

        switch (weather.type) {
            case 'Clear': return t.stats.weatherMate.Clear;
            case 'Clouds': return t.stats.weatherMate.Clouds;
            case 'Rain':
            case 'Drizzle':
            case 'Thunderstorm': return t.stats.weatherMate.Rain;
            default: return t.stats.weatherMate.Default;
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    context: {
                        weather: weather ? `${weather.type} (${weather.temp}°C)` : null,
                        isNight: weather?.isNight || false,
                        mood,
                        mbti,
                        language
                    }
                })
            });

            const data = await res.json();
            if (data.response) {
                setMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
            } else {
                throw new Error("No response");
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'assistant', text: language === 'ko' ? "죄송해요, 잠시 연결이 원활하지 않네요. 😢" : "Sorry, I'm having trouble connecting right now. 😢" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-white/90 backdrop-blur-xl w-[320px] h-[450px] rounded-3xl shadow-2xl border border-white/50 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                                    <span className="text-lg">🧚‍♀️</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm">Haru</h3>
                                    <p className="text-[10px] text-gray-500 font-medium">Healing Coach</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/50 rounded-full transition-colors">
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-indigo-500 text-white rounded-tr-none'
                                        : 'bg-white shadow-sm text-gray-700 rounded-tl-none border border-gray-100'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white shadow-sm p-3 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1">
                                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-white border-t border-gray-100">
                            <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder={language === 'ko' ? "메시지를 입력하세요..." : "Type a message..."}
                                    className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!input.trim() || isLoading}
                                    className="p-1.5 bg-indigo-500 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Bubble (Only show if chat is closed) */}
            <AnimatePresence>
                {isVisible && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleChat}
                        className="cursor-pointer flex items-end gap-3 group"
                    >
                        {/* Chat Bubble Text */}
                        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl rounded-br-none shadow-xl border border-white/50 relative max-w-[250px] hidden md:block">
                            <button
                                onClick={handleDismiss}
                                className="absolute -top-2 -left-2 bg-white rounded-full p-1 shadow-md text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <X className="w-3 h-3" />
                            </button>
                            <p className="text-sm text-gray-700 font-medium leading-relaxed">
                                {getInitialGreeting()}
                            </p>
                        </div>

                        {/* Avatar Button */}
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-400 flex items-center justify-center shadow-lg border-2 border-white relative">
                            <span className="text-3xl">🧚‍♀️</span>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
