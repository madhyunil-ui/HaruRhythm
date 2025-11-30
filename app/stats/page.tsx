"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Lock, Sun, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface MoodEntry {
    date: string;
    mood: string;
}

export default function StatsPage() {
    const { t, language } = useLanguage();
    const [history, setHistory] = useState<MoodEntry[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [totalRoutines, setTotalRoutines] = useState(0);

    useEffect(() => {
        const savedMoods = localStorage.getItem("mood_history");
        if (savedMoods) {
            try {
                setHistory(JSON.parse(savedMoods));
            } catch (e) {
                console.error("Failed to parse mood history", e);
            }
        }

        const savedRoutines = localStorage.getItem("total_routines_completed");
        if (savedRoutines) {
            setTotalRoutines(parseInt(savedRoutines));
        }
    }, []);

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    // Mood mapping
    const MOOD_EMOJIS: Record<string, string> = {
        Happy: "😊",
        Calm: "😌",
        Tired: "😴",
        Sad: "😢",
        Angry: "😠",
    };

    const getMoodForDate = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const entries = history.filter(h => h.date === dateStr);
        if (entries.length > 0) {
            return entries[entries.length - 1].mood;
        }
        return null;
    };

    // Summary calculation
    const currentMonthHistory = history.filter(h => {
        const d = new Date(h.date);
        return d.getFullYear() === year && d.getMonth() === month;
    });

    const moodCounts = currentMonthHistory.reduce((acc, curr) => {
        const mood = curr.mood;
        acc[mood] = (acc[mood] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Insight Logic
    const getTopMood = () => {
        if (Object.keys(moodCounts).length === 0) return null;
        return Object.entries(moodCounts).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    };
    const topMood = getTopMood();

    // Badge Logic
    const isSunshineUnlocked = history.filter(h => h.mood === 'Happy').length >= 5;
    const isRoutineUnlocked = totalRoutines >= 10;

    // Zen Master Logic (3 days consecutive 'Calm')
    const checkZenMaster = () => {
        const calmDates = history
            .filter(h => h.mood === 'Calm')
            .map(h => new Date(h.date).getTime())
            .sort((a, b) => a - b);

        if (calmDates.length < 3) return false;

        let consecutive = 1;
        for (let i = 1; i < calmDates.length; i++) {
            const diff = (calmDates[i] - calmDates[i - 1]) / (1000 * 60 * 60 * 24);
            if (diff === 1) {
                consecutive++;
                if (consecutive >= 3) return true;
            } else {
                consecutive = 1;
            }
        }
        return false;
    };
    const isZenUnlocked = checkZenMaster();

    const monthName = new Intl.DateTimeFormat(language === 'ko' ? 'ko-KR' : 'en-US', { month: 'long', year: 'numeric' }).format(currentDate);

    const WEEKDAYS = language === 'ko'
        ? ['일', '월', '화', '수', '목', '금', '토']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#E8E8E0] to-[#D0D8D0] flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white/40 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-white/40 overflow-hidden relative pb-10 min-h-[800px] flex flex-col">

                {/* Header */}
                <header className="flex items-center p-8 relative z-10">
                    <Link href="/" className="absolute left-8 z-10" aria-label={t.stats.back}>
                        <button className="p-3 rounded-full bg-white/50 hover:bg-white/80 transition-all shadow-sm text-gray-600">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    </Link>
                    <h1 className="w-full text-center text-xl font-serif font-bold text-gray-800 tracking-wide">
                        {t.stats.title}
                    </h1>
                </header>

                <div className="px-6 flex-1 flex flex-col gap-6 overflow-y-auto pb-20 scrollbar-hide">
                    {/* Calendar Container */}
                    <div className="bg-white/30 rounded-[2rem] p-6 shadow-sm border border-white/30">
                        {/* Controls */}
                        <div className="flex items-center justify-between mb-6">
                            <button onClick={prevMonth} className="p-2 rounded-full hover:bg-white/50 text-gray-600 transition-colors">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-lg font-bold text-gray-700 tracking-tight">{monthName}</span>
                            <button onClick={nextMonth} className="p-2 rounded-full hover:bg-white/50 text-gray-600 transition-colors">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-7 gap-3">
                            {WEEKDAYS.map(day => (
                                <div key={day} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest py-2">
                                    {day}
                                </div>
                            ))}

                            {Array.from({ length: firstDay }).map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-square" />
                            ))}

                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const mood = getMoodForDate(day);
                                const isToday =
                                    day === new Date().getDate() &&
                                    month === new Date().getMonth() &&
                                    year === new Date().getFullYear();

                                return (
                                    <div
                                        key={day}
                                        className={`aspect-square flex items-center justify-center rounded-2xl text-sm relative transition-all duration-300
                                            ${isToday ? 'bg-white shadow-md ring-2 ring-white' : 'bg-white/20 hover:bg-white/40'}
                                            ${mood ? 'shadow-sm bg-white/40' : ''}
                                        `}
                                    >
                                        <span className={`absolute top-1 left-2 text-[9px] font-medium ${isToday ? 'text-gray-800' : 'text-gray-400'}`}>
                                            {day}
                                        </span>
                                        {mood && (
                                            <span className="text-xl mt-1 filter drop-shadow-sm transform hover:scale-110 transition-transform">
                                                {MOOD_EMOJIS[mood]}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="bg-white/30 rounded-[2rem] p-6 shadow-sm border border-white/30">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">{t.stats.summary}</h3>

                        {Object.keys(moodCounts).length === 0 ? (
                            <p className="text-center text-gray-500 text-sm py-4 italic">{t.stats.empty}</p>
                        ) : (
                            <div className="space-y-3">
                                {Object.entries(moodCounts)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([mood, count]) => (
                                        <div key={mood} className="flex items-center justify-between bg-white/50 px-4 py-3 rounded-2xl shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{MOOD_EMOJIS[mood]}</span>
                                                <span className="text-sm font-semibold text-gray-700">
                                                    {t.hero.moods[mood as keyof typeof t.hero.moods] || mood}
                                                </span>
                                            </div>
                                            <div className="text-sm font-bold text-gray-600 bg-white/50 px-3 py-1 rounded-full">
                                                {count}{t.stats.days}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>

                    {/* Monthly Emotional Report */}
                    {topMood && (
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[2rem] p-6 shadow-sm border border-white/50">
                            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 ml-1">
                                {t.stats.insightTitle}
                            </h3>
                            <p className="text-gray-700 font-medium leading-relaxed">
                                {t.stats.insight.prefix} <span className="font-bold text-indigo-600">{t.hero.moods[topMood as keyof typeof t.hero.moods]}</span> {t.stats.insight.suffix}
                            </p>
                        </div>
                    )}

                    {/* Badges Section */}
                    <div className="bg-white/30 rounded-[2rem] p-6 shadow-sm border border-white/30">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">
                            {t.stats.badgesTitle}
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            {/* Sunshine Soul */}
                            <div className={`flex flex-col items-center p-3 rounded-2xl text-center transition-all ${isSunshineUnlocked ? 'bg-yellow-100/80 shadow-sm' : 'bg-gray-100/50 grayscale opacity-60'}`}>
                                <div className={`p-2 rounded-full mb-2 ${isSunshineUnlocked ? 'bg-white shadow-sm text-yellow-500' : 'bg-gray-200 text-gray-400'}`}>
                                    {isSunshineUnlocked ? <Sun className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                                </div>
                                <span className="text-[10px] font-bold text-gray-700 leading-tight mb-1">{t.stats.badges.sunshine.name}</span>
                                <span className="text-[8px] text-gray-500 leading-tight">{t.stats.badges.sunshine.desc}</span>
                            </div>

                            {/* Routine Master */}
                            <div className={`flex flex-col items-center p-3 rounded-2xl text-center transition-all ${isRoutineUnlocked ? 'bg-blue-100/80 shadow-sm' : 'bg-gray-100/50 grayscale opacity-60'}`}>
                                <div className={`p-2 rounded-full mb-2 ${isRoutineUnlocked ? 'bg-white shadow-sm text-blue-500' : 'bg-gray-200 text-gray-400'}`}>
                                    {isRoutineUnlocked ? <Zap className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                                </div>
                                <span className="text-[10px] font-bold text-gray-700 leading-tight mb-1">{t.stats.badges.routine.name}</span>
                                <span className="text-[8px] text-gray-500 leading-tight">{t.stats.badges.routine.desc}</span>
                            </div>

                            {/* Zen Master */}
                            <div className={`flex flex-col items-center p-3 rounded-2xl text-center transition-all ${isZenUnlocked ? 'bg-green-100/80 shadow-sm' : 'bg-gray-100/50 grayscale opacity-60'}`}>
                                <div className={`p-2 rounded-full mb-2 ${isZenUnlocked ? 'bg-white shadow-sm text-green-500' : 'bg-gray-200 text-gray-400'}`}>
                                    {isZenUnlocked ? <Sparkles className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                                </div>
                                <span className="text-[10px] font-bold text-gray-700 leading-tight mb-1">{t.stats.badges.zen.name}</span>
                                <span className="text-[8px] text-gray-500 leading-tight">{t.stats.badges.zen.desc}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
