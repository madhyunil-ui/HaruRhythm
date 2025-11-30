"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

export default function SettingsModal({ isOpen, onClose, onSave }: SettingsModalProps) {
    const { t } = useLanguage();
    const [mbti, setMbti] = useState({
        EI: "E",
        SN: "S",
        TF: "T",
        JP: "J",
    });

    useEffect(() => {
        if (isOpen) {
            const savedMbti = localStorage.getItem("user_mbti");
            if (savedMbti && savedMbti.length === 4) {
                setMbti({
                    EI: savedMbti[0],
                    SN: savedMbti[1],
                    TF: savedMbti[2],
                    JP: savedMbti[3],
                });
            }
        }
    }, [isOpen]);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    const handleSave = () => {
        const mbtiString = `${mbti.EI}${mbti.SN}${mbti.TF}${mbti.JP}`;
        localStorage.setItem("user_mbti", mbtiString);
        window.dispatchEvent(new Event("mbtiChanged"));
        onSave();
        onClose();
    };

    const setType = (key: keyof typeof mbti, value: string) => {
        setMbti((prev) => ({ ...prev, [key]: value }));
    };

    const questions = [
        {
            id: "EI",
            question: t.settings.questions.energy.question,
            options: [
                { value: "E", label: t.settings.questions.energy.options.E, desc: "Social & Active" },
                { value: "I", label: t.settings.questions.energy.options.I, desc: "Quiet & Reflective" },
            ],
        },
        {
            id: "SN",
            question: t.settings.questions.mind.question,
            options: [
                { value: "S", label: t.settings.questions.mind.options.S, desc: "Facts & Details" },
                { value: "N", label: t.settings.questions.mind.options.N, desc: "Concepts & Future" },
            ],
        },
        {
            id: "TF",
            question: t.settings.questions.heart.question,
            options: [
                { value: "T", label: t.settings.questions.heart.options.T, desc: "Objective & Rational" },
                { value: "F", label: t.settings.questions.heart.options.F, desc: "Empathetic & Feeling" },
            ],
        },
        {
            id: "JP",
            question: t.settings.questions.life.question,
            options: [
                { value: "J", label: t.settings.questions.life.options.J, desc: "Organized & Planned" },
                { value: "P", label: t.settings.questions.life.options.P, desc: "Flexible & Spontaneous" },
            ],
        },
    ];

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-lg bg-white rounded-3xl shadow-2xl z-50 p-6 max-h-[85vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-gray-800">{t.settings.title}</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {t.settings.guidance}
                                </p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0">
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-6 my-6">
                            {questions.map((q) => (
                                <div key={q.id} className="space-y-3">
                                    <h3 className="font-medium text-gray-700 text-lg">{q.question}</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {q.options.map((opt) => {
                                            const isSelected = mbti[q.id as keyof typeof mbti] === opt.value;
                                            return (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setType(q.id as keyof typeof mbti, opt.value)}
                                                    className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${isSelected
                                                        ? "border-blue-500 bg-blue-50"
                                                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2 text-blue-500">
                                                            <Check className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                    <div className={`font-bold ${isSelected ? "text-blue-700" : "text-gray-700"}`}>
                                                        {opt.label}
                                                    </div>
                                                    <div className={`text-xs mt-1 ${isSelected ? "text-blue-500" : "text-gray-400"}`}>
                                                        {opt.desc}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">{t.settings.result}</span>
                                <div className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                    {mbti.EI}{mbti.SN}{mbti.TF}{mbti.JP}
                                </div>
                            </div>
                            <button
                                onClick={handleSave}
                                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg active:scale-95 transform duration-200"
                            >
                                {t.settings.save}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
