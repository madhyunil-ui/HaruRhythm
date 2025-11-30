"use client";

import Link from "next/link"; // 👈 페이지 이동을 위한 필수 부품
import { BarChart2, Settings } from "lucide-react"; // 아이콘
import { useLanguage } from "@/context/LanguageContext";

export default function Header() {
    const { language, toggleLanguage } = useLanguage();

    return (
        <header className="flex justify-between items-center p-6 pb-2">
            {/* 로고 영역 */}
            <div>
                <h1 className="text-2xl font-serif font-bold text-gray-800 tracking-tight">
                    Haru Rhythm
                </h1>
            </div>

            {/* 우측 아이콘 영역 */}
            <div className="flex items-center gap-4">
                {/* 📊 통계 페이지 연결 버튼 (여기가 핵심!) */}
                <Link
                    href="/stats"
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-full transition-all"
                >
                    <BarChart2 className="w-5 h-5" />
                </Link>

                {/* 언어 변경 버튼 */}
                <button
                    onClick={toggleLanguage}
                    className="text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest px-2 py-1 rounded-md hover:bg-gray-100/50 transition-all"
                >
                    {language === 'ko' ? 'KR' : 'EN'}
                </button>

                {/* 설정 버튼 (나중에 기능 추가) */}
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-full transition-all">
                    <Settings className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}