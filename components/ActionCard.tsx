"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ActionCardProps {
    mood: string | null;
    action: string;
    duration: string;
}

export default function ActionCard({ mood, action, duration }: ActionCardProps) {
    const { t } = useLanguage();

    if (!mood) return null;

    if (!mood) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-8 mt-4 p-6 bg-white rounded-3xl shadow-sm border border-gray-100"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <span className="text-[10px] font-bold text-[#8DA399] uppercase tracking-widest">{t.action.recommended}</span>
                    <h3 className="text-lg font-serif font-medium text-gray-800 mt-1">{action}</h3>
                </div>
                <span className="text-xs font-semibold text-gray-500 bg-[#F5F5F0] px-3 py-1.5 rounded-full">
                    {duration}
                </span>
            </div>

            <button className="w-full py-4 bg-[#4A4A4A] text-white rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200">
                <Play className="w-4 h-4 fill-current" />
                {t.action.start}
            </button>
        </motion.div>
    );
}
