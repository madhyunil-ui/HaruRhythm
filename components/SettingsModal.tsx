"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, Volume2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// 👇 모달을 열고 닫는 기능 정의
interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { language, toggleLanguage } = useLanguage();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            {/* 배경 클릭 시 닫기 */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* 모달 창 본체 */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl overflow-hidden z-10"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Settings</h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* 언어 설정 */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-full"><Globe className="w-5 h-5" /></div>
                            <span className="font-medium text-gray-700">Language</span>
                        </div>
                        <button
                            onClick={toggleLanguage}
                            className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 shadow-sm"
                        >
                            {language === 'ko' ? '한국어' : 'English'}
                        </button>
                    </div>

                    {/* 소리 설정 (UI만) */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl opacity-50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 text-green-600 rounded-full"><Volume2 className="w-5 h-5" /></div>
                            <span className="font-medium text-gray-700">Sound</span>
                        </div>
                        <span className="text-xs text-gray-400">Auto</span>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-gray-400">Haru Rhythm v1.0</p>
            </motion.div>
        </div>
    );
}