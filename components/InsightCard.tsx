"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface InsightCardProps {
    mood: string | null;
    insight: string;
}

export default function InsightCard({ mood, insight }: InsightCardProps) {
    const { t } = useLanguage();

    if (!mood) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-8 p-6 bg-[#EBE9E4] rounded-3xl shadow-sm border border-white/50"
        >
            <div className="flex items-start gap-4">
                <Sparkles className="w-5 h-5 text-[#8DA399] mt-1" />
                <div>
                    <h3 className="font-serif font-medium text-gray-800 mb-2">{t.insight.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                        {insight || t.insight.placeholder}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
