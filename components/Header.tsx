"use client";

import { BarChart2, Settings } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

// 👇 부모에게 "나 클릭됐어!"라고 알리는 기능 정의
interface HeaderProps {
    onSettingsClick: () => void;
}

export default function Header({ onSettingsClick }: HeaderProps) {
    const { language, toggleLanguage } = useLanguage();

    return (
        <header className="flex justify-between items-center p-6 pb-2">
            <div>
                <h1 className="text-2xl font-serif font-bold text-gray-800 tracking-tight">
                    Haru Rhythm
                </h1>
            </div>

            <div className="flex items-center gap-4">
                {/* 통계 페이지 이동 */}
                <Link href="/stats" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-full transition-all">
                    <BarChart2 className="w-5 h-5" />
                </Link>

                {/* 언어 변경 */}
                <button
                    onClick={toggleLanguage}
                    className="text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest px-2 py-1 rounded-md hover:bg-gray-100/50 transition-all"
                >
                    {language === 'ko' ? 'KR' : 'EN'}
                </button>

                {/* 👇 설정 버튼 (클릭 시 작동) */}
                <button
                    onClick={onSettingsClick}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-full transition-all"
                >
                    <Settings className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}